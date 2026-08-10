from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Query
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import random
import string
import uuid
import bcrypt
import jwt as pyjwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from pydantic import BaseModel, Field

# --- Setup ---
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"

app = FastAPI(title="SPMS API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("spms")

# --- Helpers ---
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str, role: str, email: str) -> str:
    payload = {
        "sub": user_id, "role": role, "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def get_current_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = auth[7:]
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return user

def require_roles(*roles):
    async def checker(user: dict = Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(403, "Access denied")
        return user
    return checker

def gen_otp() -> str:
    return "".join(random.choices(string.digits, k=6))

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

# --- Models ---
class LoginIn(BaseModel):
    email: str
    password: str

class ParcelIn(BaseModel):
    tracking_number: str
    student_roll: str
    courier: str
    parcel_size: str  # small/medium/large/fragile/priority
    damaged: bool = False
    misplaced: bool = False
    notes: Optional[str] = ""

class VerifyIn(BaseModel):
    parcel_id: str
    otp: str

class UserIn(BaseModel):
    email: str
    password: str
    name: str
    role: str
    roll_number: Optional[str] = None

# --- Auth Routes ---
@api.post("/auth/login")
async def login(inp: LoginIn):
    email = inp.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(inp.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_token(user["id"], user["role"], user["email"])
    user_out = {k: v for k, v in user.items() if k not in ("_id", "password_hash")}
    return {"token": token, "user": user_out}

@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

@api.post("/auth/logout")
async def logout():
    return {"ok": True}

# --- Users (admin) ---
@api.get("/users")
async def list_users(user: dict = Depends(require_roles("admin"))):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(2000)
    return users

@api.post("/users")
async def create_user(inp: UserIn, user: dict = Depends(require_roles("admin"))):
    if await db.users.find_one({"email": inp.email.lower()}):
        raise HTTPException(400, "Email exists")
    doc = {
        "id": str(uuid.uuid4()),
        "email": inp.email.lower(),
        "password_hash": hash_password(inp.password),
        "name": inp.name,
        "role": inp.role,
        "roll_number": inp.roll_number,
        "created_at": now_iso()
    }
    await db.users.insert_one(doc)
    doc.pop("_id", None); doc.pop("password_hash", None)
    return doc

# --- Parcels ---
@api.get("/parcels")
async def list_parcels(
    status: Optional[str] = None,
    student_roll: Optional[str] = None,
    limit: int = 100,
    user: dict = Depends(get_current_user)
):
    q = {}
    if status: q["status"] = status
    if user["role"] == "student":
        q["student_roll"] = user.get("roll_number")
    elif student_roll:
        q["student_roll"] = student_roll
    parcels = await db.parcels.find(q, {"_id": 0}).sort("arrival_ts", -1).to_list(limit)
    return parcels

@api.get("/parcels/{parcel_id}")
async def get_parcel(parcel_id: str, user: dict = Depends(get_current_user)):
    p = await db.parcels.find_one({"id": parcel_id}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Parcel not found")
    if user["role"] == "student" and p["student_roll"] != user.get("roll_number"):
        raise HTTPException(403, "Denied")
    return p

@api.post("/parcels")
async def create_parcel(inp: ParcelIn, user: dict = Depends(require_roles("security", "admin"))):
    student = await db.users.find_one({"roll_number": inp.student_roll, "role": "student"})
    if not student:
        raise HTTPException(404, "Student not found")

    rack_map = {"small": "A", "medium": "B", "large": "C", "fragile": "E", "priority": "LOCKER"}
    rack_letter = rack_map.get(inp.parcel_size, "A")
    rack_doc = await db.racks.find_one({"code": {"$regex": f"^{rack_letter}"}})
    bin_num = None
    bin_id = None
    if rack_doc:
        # find first available bin in this rack
        av = await db.bins.find_one({"rack_id": rack_doc["id"], "occupied": False})
        if av:
            bin_id = av["id"]
            bin_num = av["code"]
            await db.bins.update_one({"id": av["id"]}, {"$set": {"occupied": True}})

    parcel = {
        "id": str(uuid.uuid4()),
        "tracking_number": inp.tracking_number,
        "student_id": student["id"],
        "student_roll": inp.student_roll,
        "student_name": student["name"],
        "student_email": student["email"],
        "courier": inp.courier,
        "parcel_size": inp.parcel_size,
        "arrival_ts": now_iso(),
        "registration_ts": now_iso(),
        "rack_code": rack_doc["code"] if rack_doc else "A1",
        "bin_code": bin_num or "—",
        "bin_id": bin_id,
        "pickup_ts": None,
        "verification_method": None,
        "damaged": inp.damaged,
        "misplaced": inp.misplaced,
        "staff_id": user["id"],
        "staff_name": user["name"],
        "status": "ready",
        "otp": gen_otp(),
        "otp_expires": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "notes": inp.notes or "",
        "pickup_deadline": (datetime.now(timezone.utc) + timedelta(days=5)).isoformat(),
    }
    await db.parcels.insert_one(parcel)
    parcel.pop("_id", None)
    # notification
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": student["id"],
        "type": "parcel_arrived",
        "title": "Parcel Arrived",
        "message": f"Your parcel from {inp.courier} ({inp.tracking_number}) is at Rack {parcel['rack_code']} Bin {parcel['bin_code']}. OTP: {parcel['otp']}",
        "read": False,
        "created_at": now_iso()
    })
    return parcel

@api.post("/parcels/verify")
async def verify_pickup(inp: VerifyIn, user: dict = Depends(require_roles("security", "admin"))):
    p = await db.parcels.find_one({"id": inp.parcel_id})
    if not p:
        raise HTTPException(404, "Parcel not found")
    if p["status"] == "collected":
        raise HTTPException(400, "Already collected")
    if p["otp"] != inp.otp:
        raise HTTPException(400, "Invalid OTP")
    await db.parcels.update_one({"id": inp.parcel_id}, {"$set": {
        "status": "collected",
        "pickup_ts": now_iso(),
        "verification_method": "OTP"
    }})
    if p.get("bin_id"):
        await db.bins.update_one({"id": p["bin_id"]}, {"$set": {"occupied": False}})
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": p["student_id"],
        "type": "collected",
        "title": "Parcel Collected",
        "message": f"Parcel {p['tracking_number']} has been collected.",
        "read": False,
        "created_at": now_iso()
    })
    return {"ok": True}

@api.get("/students/search")
async def search_student(roll: str = Query(...), user: dict = Depends(require_roles("security", "admin"))):
    s = await db.users.find_one({"roll_number": roll, "role": "student"}, {"_id": 0, "password_hash": 0})
    if not s:
        raise HTTPException(404, "Student not found")
    return s

# --- Inventory ---
@api.get("/racks")
async def get_racks(user: dict = Depends(get_current_user)):
    racks = await db.racks.find({}, {"_id": 0}).to_list(50)
    for r in racks:
        total = await db.bins.count_documents({"rack_id": r["id"]})
        occupied = await db.bins.count_documents({"rack_id": r["id"], "occupied": True})
        r["total_bins"] = total
        r["occupied_bins"] = occupied
        r["utilization"] = round((occupied / total * 100), 1) if total else 0
    return racks

@api.get("/bins")
async def get_bins(rack_id: Optional[str] = None, user: dict = Depends(get_current_user)):
    q = {"rack_id": rack_id} if rack_id else {}
    bins = await db.bins.find(q, {"_id": 0}).to_list(500)
    return bins

# --- Notifications ---
@api.get("/notifications")
async def list_notifs(user: dict = Depends(get_current_user)):
    q = {"user_id": user["id"]} if user["role"] == "student" else {}
    n = await db.notifications.find(q, {"_id": 0}).sort("created_at", -1).to_list(50)
    return n

@api.post("/notifications/{nid}/read")
async def mark_read(nid: str, user: dict = Depends(get_current_user)):
    await db.notifications.update_one({"id": nid}, {"$set": {"read": True}})
    return {"ok": True}

# --- Dashboard ---
@api.get("/dashboard/kpis")
async def kpis(user: dict = Depends(get_current_user)):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    total = await db.parcels.count_documents({})
    today_arrivals = await db.parcels.count_documents({"arrival_ts": {"$gte": today_start}})
    today_pickups = await db.parcels.count_documents({"pickup_ts": {"$gte": today_start}})
    pending = await db.parcels.count_documents({"status": "ready"})
    overdue = await db.parcels.count_documents({"status": "overdue"})
    collected = await db.parcels.count_documents({"status": "collected"})
    damaged = await db.parcels.count_documents({"damaged": True})
    misplaced = await db.parcels.count_documents({"misplaced": True})
    total_bins = await db.bins.count_documents({})
    occ_bins = await db.bins.count_documents({"occupied": True})
    rack_util = round((occ_bins / total_bins * 100), 1) if total_bins else 0
    coll_rate = round((collected / total * 100), 1) if total else 0
    damage_rate = round((damaged / total * 100), 2) if total else 0
    misp_rate = round((misplaced / total * 100), 2) if total else 0

    return {
        "total_parcels": total,
        "today_arrivals": today_arrivals,
        "today_pickups": today_pickups,
        "pending_parcels": pending,
        "overdue_parcels": overdue,
        "rack_utilization": rack_util,
        "avg_retrieval_time": 1.6,
        "avg_storage_days": 2.1,
        "collection_rate": coll_rate,
        "inventory_accuracy": 99.4,
        "damage_rate": damage_rate,
        "misplacement_rate": misp_rate,
        "daily_throughput": today_arrivals + today_pickups,
    }

@api.get("/dashboard/trends")
async def trends(user: dict = Depends(get_current_user)):
    # Weekly arrivals/pickups (last 7 days)
    days = []
    for i in range(6, -1, -1):
        d = datetime.now(timezone.utc) - timedelta(days=i)
        start = d.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        end = (d.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)).isoformat()
        arrivals = await db.parcels.count_documents({"arrival_ts": {"$gte": start, "$lt": end}})
        pickups = await db.parcels.count_documents({"pickup_ts": {"$gte": start, "$lt": end}})
        days.append({"day": d.strftime("%a"), "arrivals": arrivals, "pickups": pickups})

    # By courier
    couriers = ["FedEx", "DHL", "BlueDart", "Delhivery", "IndiaPost"]
    by_courier = []
    for c in couriers:
        cnt = await db.parcels.count_documents({"courier": c})
        by_courier.append({"courier": c, "count": cnt})

    # By size
    sizes = ["small", "medium", "large", "fragile", "priority"]
    by_size = []
    for s in sizes:
        cnt = await db.parcels.count_documents({"parcel_size": s})
        by_size.append({"size": s.capitalize(), "count": cnt})

    # Status breakdown
    status_data = []
    for s in ["ready", "collected", "overdue", "pending"]:
        cnt = await db.parcels.count_documents({"status": s})
        status_data.append({"status": s.capitalize(), "count": cnt})

    return {"weekly": days, "by_courier": by_courier, "by_size": by_size, "status": status_data}

# --- Global Search ---
@api.get("/search")
async def global_search(q: str = Query(...), user: dict = Depends(get_current_user)):
    parcels = await db.parcels.find({
        "$or": [
            {"tracking_number": {"$regex": q, "$options": "i"}},
            {"student_roll": {"$regex": q, "$options": "i"}},
            {"student_name": {"$regex": q, "$options": "i"}},
            {"id": q},
            {"otp": q},
            {"rack_code": {"$regex": q, "$options": "i"}},
            {"bin_code": {"$regex": q, "$options": "i"}},
            {"courier": {"$regex": q, "$options": "i"}},
        ]
    }, {"_id": 0}).limit(20).to_list(20)
    return {"parcels": parcels}

# --- Reports ---
@api.get("/reports/{report_type}")
async def report(report_type: str, user: dict = Depends(get_current_user)):
    if report_type == "damage":
        docs = await db.parcels.find({"damaged": True}, {"_id": 0}).to_list(500)
    elif report_type == "pending":
        docs = await db.parcels.find({"status": "ready"}, {"_id": 0}).to_list(500)
    elif report_type == "collection":
        docs = await db.parcels.find({"status": "collected"}, {"_id": 0}).sort("pickup_ts", -1).to_list(500)
    elif report_type == "courier":
        pipeline = [{"$group": {"_id": "$courier", "count": {"$sum": 1}}}]
        agg = await db.parcels.aggregate(pipeline).to_list(20)
        return {"data": [{"courier": a["_id"], "count": a["count"]} for a in agg]}
    else:
        docs = await db.parcels.find({}, {"_id": 0}).sort("arrival_ts", -1).limit(200).to_list(200)
    return {"data": docs}

app.include_router(api)

@app.get("/api/export/students.xlsx")
async def export_students_xlsx():
    path = "/app/SPMS_Students_Dataset.xlsx"
    if not os.path.exists(path):
        raise HTTPException(404, "Dataset not generated yet")
    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="SPMS_Students_Dataset.xlsx",
    )

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Seed Data ---
COURIERS = ["FedEx", "DHL", "BlueDart", "Delhivery", "IndiaPost"]
SIZES = ["small", "medium", "large", "fragile", "priority"]
FIRST_NAMES = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Sai", "Ayaan", "Krishna", "Ishaan",
               "Aanya", "Ananya", "Diya", "Ira", "Kavya", "Myra", "Pari", "Riya", "Saanvi", "Sara",
               "Rohan", "Kabir", "Dev", "Yash", "Neha", "Priya", "Meera", "Isha", "Zara", "Anika"]
LAST_NAMES = ["Sharma", "Verma", "Patel", "Kumar", "Singh", "Rao", "Reddy", "Iyer", "Menon", "Das",
              "Gupta", "Joshi", "Malhotra", "Nair", "Bose", "Chatterjee", "Mehta", "Shah", "Kapoor", "Bhat"]

async def seed():
    # Users: admin, security (ops_manager removed)
    seed_users = [
        {"email": "admin@digicampus.edu", "password": "admin123", "name": "System Administrator", "role": "admin"},
        {"email": "security@digicampus.edu", "password": "password123", "name": "Rajesh Kumar", "role": "security"},
    ]
    # Clean up any existing ops_manager users from previous seed
    await db.users.delete_many({"role": "ops_manager"})
    for u in seed_users:
        if not await db.users.find_one({"email": u["email"]}):
            await db.users.insert_one({
                "id": str(uuid.uuid4()),
                "email": u["email"],
                "password_hash": hash_password(u["password"]),
                "name": u["name"],
                "role": u["role"],
                "roll_number": None,
                "created_at": now_iso()
            })

    # Seed students — PGDM roll format P2622001..P2622080; Aarav = P2622010
    NEW_ROLL_PREFIX = "P26220"
    FEATURED_ROLL = "P2622010"

    # Migration: if any student still uses the OLD roll format, wipe and reseed cleanly
    old_format_exists = await db.users.find_one({"role": "student", "roll_number": {"$regex": "^(CS|EE|ME|CE|EC)2024"}})
    student_count = await db.users.count_documents({"role": "student"})

    if old_format_exists or student_count != 80:
        # Wipe all students and all parcels — parcels will be reseeded with the new student pool
        await db.users.delete_many({"role": "student"})
        await db.parcels.delete_many({})
        # Reset bin occupancy
        await db.bins.update_many({}, {"$set": {"occupied": False}})

        # Featured student
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": "student@digicampus.edu",
            "password_hash": hash_password("password123"),
            "name": "Aarav Sharma",
            "role": "student",
            "roll_number": FEATURED_ROLL,
            "department": "PGDM",
            "created_at": now_iso()
        })
        bulk = []
        for i in range(1, 81):
            roll = f"{NEW_ROLL_PREFIX}{i:02d}"
            if roll == FEATURED_ROLL:
                continue
            fn = random.choice(FIRST_NAMES); ln = random.choice(LAST_NAMES)
            bulk.append({
                "id": str(uuid.uuid4()),
                "email": f"student{i}@digicampus.edu",
                "password_hash": hash_password("password123"),
                "name": f"{fn} {ln}",
                "role": "student",
                "roll_number": roll,
                "department": "PGDM",
                "created_at": now_iso()
            })
        if bulk:
            await db.users.insert_many(bulk)

    # Seed racks & bins
    if await db.racks.count_documents({}) < 10:
        await db.racks.delete_many({})
        await db.bins.delete_many({})
        racks_data = [
            ("A1", "Small Parcels"), ("A2", "Small Parcels"),
            ("B1", "Medium Parcels"), ("B2", "Medium Parcels"),
            ("C1", "Large Parcels"), ("C2", "Large Parcels"),
            ("D1", "Overflow"), ("D2", "Overflow"),
            ("E1", "Fragile"),
            ("LOCKER1", "Priority / Documents"),
        ]
        for code, category in racks_data:
            rack_id = str(uuid.uuid4())
            await db.racks.insert_one({
                "id": rack_id, "code": code, "category": category, "capacity": 10
            })
            for b in range(1, 11):
                await db.bins.insert_one({
                    "id": str(uuid.uuid4()),
                    "rack_id": rack_id,
                    "rack_code": code,
                    "code": f"{code}-{b:02d}",
                    "occupied": False
                })

    # Seed parcels
    if await db.parcels.count_documents({}) < 1200:
        students = await db.users.find({"role": "student"}).to_list(200)
        security_staff = await db.users.find_one({"role": "security"})
        racks = await db.racks.find({}).to_list(20)
        rack_map = {"small": ["A1", "A2"], "medium": ["B1", "B2"], "large": ["C1", "C2"], "fragile": ["E1"], "priority": ["LOCKER1"]}
        bulk = []
        now = datetime.now(timezone.utc)
        for i in range(1200):
            student = random.choice(students)
            size = random.choice(SIZES)
            rack_code = random.choice(rack_map[size])
            rack = next((r for r in racks if r["code"] == rack_code), racks[0])
            arrival_offset = random.randint(0, 30)
            arrival = now - timedelta(days=arrival_offset, hours=random.randint(0, 23))
            status_pick = random.choices(
                ["collected", "ready", "overdue", "pending"],
                weights=[55, 30, 8, 7]
            )[0]
            pickup_ts = None
            if status_pick == "collected":
                pickup_ts = (arrival + timedelta(days=random.randint(1, 4))).isoformat()
            damaged = random.random() < 0.008
            misplaced = random.random() < 0.003
            bulk.append({
                "id": str(uuid.uuid4()),
                "tracking_number": f"TRK{random.randint(10000000, 99999999)}",
                "student_id": student["id"],
                "student_roll": student.get("roll_number", "N/A"),
                "student_name": student["name"],
                "student_email": student["email"],
                "courier": random.choice(COURIERS),
                "parcel_size": size,
                "arrival_ts": arrival.isoformat(),
                "registration_ts": arrival.isoformat(),
                "rack_code": rack_code,
                "bin_code": f"{rack_code}-{random.randint(1, 10):02d}",
                "bin_id": None,
                "pickup_ts": pickup_ts,
                "verification_method": "OTP" if pickup_ts else None,
                "damaged": damaged,
                "misplaced": misplaced,
                "staff_id": security_staff["id"] if security_staff else "",
                "staff_name": security_staff["name"] if security_staff else "",
                "status": status_pick,
                "otp": gen_otp(),
                "otp_expires": (arrival + timedelta(days=7)).isoformat(),
                "notes": "",
                "pickup_deadline": (arrival + timedelta(days=5)).isoformat(),
            })
        if bulk:
            await db.parcels.insert_many(bulk)

    # Update bin occupancy to match ~70% utilization
    total_bins = await db.bins.count_documents({})
    already_occ = await db.bins.count_documents({"occupied": True})
    target = int(total_bins * 0.72)
    if already_occ < target:
        avail = await db.bins.find({"occupied": False}).limit(target - already_occ).to_list(200)
        ids = [b["id"] for b in avail]
        if ids:
            await db.bins.update_many({"id": {"$in": ids}}, {"$set": {"occupied": True}})

    # Seed notifications for the featured student
    featured = await db.users.find_one({"email": "student@digicampus.edu"})
    if featured:
        # Ensure demo student has active parcels for a good demo
        active_count = await db.parcels.count_documents({"student_id": featured["id"], "status": {"$in": ["ready", "pending"]}})
        if active_count < 3:
            security_staff = await db.users.find_one({"role": "security"})
            racks = await db.racks.find({}).to_list(20)
            now = datetime.now(timezone.utc)
            demo_parcels = [
                {"courier": "DHL", "size": "medium", "rack": "B1", "status": "ready"},
                {"courier": "BlueDart", "size": "small", "rack": "A2", "status": "ready"},
                {"courier": "FedEx", "size": "large", "rack": "C1", "status": "pending"},
            ]
            for dp in demo_parcels:
                arrival = now - timedelta(days=random.randint(0, 2), hours=random.randint(1, 10))
                await db.parcels.insert_one({
                    "id": str(uuid.uuid4()),
                    "tracking_number": f"TRK{random.randint(10000000, 99999999)}",
                    "student_id": featured["id"],
                    "student_roll": featured.get("roll_number", "CS2024001"),
                    "student_name": featured["name"],
                    "student_email": featured["email"],
                    "courier": dp["courier"],
                    "parcel_size": dp["size"],
                    "arrival_ts": arrival.isoformat(),
                    "registration_ts": arrival.isoformat(),
                    "rack_code": dp["rack"],
                    "bin_code": f"{dp['rack']}-{random.randint(1,10):02d}",
                    "bin_id": None,
                    "pickup_ts": None,
                    "verification_method": None,
                    "damaged": False, "misplaced": False,
                    "staff_id": security_staff["id"] if security_staff else "",
                    "staff_name": security_staff["name"] if security_staff else "",
                    "status": dp["status"],
                    "otp": gen_otp(),
                    "otp_expires": (arrival + timedelta(days=7)).isoformat(),
                    "notes": "",
                    "pickup_deadline": (arrival + timedelta(days=5)).isoformat(),
                })

        if await db.notifications.count_documents({"user_id": featured["id"]}) == 0:
            for msg in [
                ("Parcel Arrived", "Your DHL parcel TRK12345678 is ready at Rack A1 Bin A1-03. OTP: 482910"),
                ("Pickup Reminder", "Reminder: collect your parcel from Rack B2 by Friday."),
                ("Parcel Collected", "You successfully collected parcel TRK87654321."),
            ]:
                await db.notifications.insert_one({
                    "id": str(uuid.uuid4()),
                    "user_id": featured["id"],
                    "type": "info",
                    "title": msg[0],
                    "message": msg[1],
                    "read": False,
                    "created_at": now_iso()
                })

@app.on_event("startup")
async def on_start():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("roll_number")
    await db.parcels.create_index("student_roll")
    await db.parcels.create_index("status")
    await seed()
    logger.info("SPMS seed complete.")

@app.on_event("shutdown")
async def on_stop():
    client.close()
