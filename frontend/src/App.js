import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Database,
  ExternalLink,
  Globe2,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MoveRight,
  Network,
  Search,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
  X,
} from "lucide-react";
import "@/App.css";

const EMAIL = "anjanasaraabraham@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/anjana-sara-abraham";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Reveal = ({ children, className = "", delay = "" }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

const SectionHeading = ({ number, eyebrow, title, intro, testId }) => (
  <div className="section-heading" data-testid={testId}>
    <span className="section-number">{number}</span>
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  </div>
);

const Metric = ({ value, label, testId }) => (
  <div className="metric" data-testid={testId}>
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const HeroGrid = () => (
  <svg
    className="hero-coordinate-grid"
    viewBox="0 0 600 600"
    aria-hidden="true"
    data-testid="hero-coordinate-grid"
  >
    <defs>
      <pattern id="hero-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28" />
        <circle cx="1" cy="1" r="1.5" fill="currentColor" opacity="0.8" />
      </pattern>
    </defs>
    <rect width="600" height="600" fill="url(#hero-grid-pattern)" />
    <path d="M72 472 C158 384 188 334 286 328 S396 250 534 112" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
    <path d="M80 124 C176 190 216 206 318 198 S426 228 520 394" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" strokeDasharray="6 8" />
    <circle cx="72" cy="472" r="6" fill="currentColor" />
    <circle cx="286" cy="328" r="8" fill="currentColor" />
    <circle cx="534" cy="112" r="6" fill="currentColor" />
    <circle cx="318" cy="198" r="5" fill="currentColor" opacity="0.75" />
  </svg>
);

const Hero = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - bounds.left - bounds.width / 2) * 0.018,
      y: (event.clientY - bounds.top - bounds.height / 2) * 0.018,
    });
  };

  return (
    <section id="home" className="hero section-shell" data-testid="hero-section">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="status-dot" />
            <span>ANJANA SARA ABRAHAM</span>
            <span className="kicker-line" />
            <span>BUSINESS / TRANSFORMATION</span>
          </div>
          <h1 className="hero-heading" data-testid="hero-heading">
            <span className="hero-line"><span>Turning Business</span></span>
            <span className="hero-line"><span>Problems into</span></span>
            <span className="hero-line"><span>Actionable</span></span>
            <span className="hero-line"><span>Solutions.</span></span>
          </h1>
          <div className="hero-bottom-grid">
            <p className="hero-intro" data-testid="hero-intro">
              I am an impact-oriented professional skilled in business analysis, requirements gathering and stakeholder management, with strong analytical abilities to translate business needs into actionable solutions and support technology-enabled transformation.
            </p>
            <div className="hero-scroll-note" data-testid="hero-scroll-note">
              <ArrowDown size={16} strokeWidth={1.5} />
              <span>Scroll to explore<br />the working logic</span>
            </div>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects" data-testid="hero-view-work-link">
              View My Work <ArrowUpRight size={16} />
            </a>
            <a className="button button-resume" href="https://customer-assets-m6fa6gv7.emergentagent.net/job_anjana-insights/artifacts/ebzlqqqg_Anjana%20Sara%20CV%20Accenture%20ATCI%20CL10.pdf" target="_blank" rel="noreferrer" data-testid="hero-resume-link">
              My Resume <ExternalLink size={16} />
            </a>
            <a className="button button-ghost" href="#contact" data-testid="hero-connect-link">
              Let's Connect <MoveRight size={16} />
            </a>
          </div>
        </div>

        <div
          className="hero-visual-wrap"
          onMouseMove={handlePointerMove}
          onMouseLeave={() => setPointer({ x: 0, y: 0 })}
          data-testid="hero-visual"
        >
          <div
            className="hero-visual"
            style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }}
          >
            <HeroGrid />
            <div className="hero-visual-topline">
              <span>PROFILE / 01</span>
              <span>STRATEGIC PRACTICE</span>
            </div>
            <div className="portrait-poster" data-testid="profile-image-slot">
              <img
                className="portrait-image"
                src="https://customer-assets-m6fa6gv7.emergentagent.net/job_anjana-insights/artifacts/4vgqy68z_WhatsApp%20Image%202026-08-04%20at%2012.54.06%20AM%20%281%29.webp"
                alt="Anjana Sara Abraham"
                data-testid="profile-image"
              />
            </div>
            <div className="hero-coordinate-label label-one">DATA / 03</div>
            <div className="hero-coordinate-label label-two">DECISION / 07</div>
            <div className="hero-coordinate-label label-three">ACTION / 12</div>
            <div className="hero-visual-footer">
              <span><Activity size={14} /> SYSTEMS THINKING</span>
              <span>2026 / PORTFOLIO</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-metrics" data-testid="hero-metrics">
        <Metric value="1,000+" label="product parts managed across locations" testId="hero-metric-parts" />
        <Metric value="25%" label="faster issue resolution through reporting" testId="hero-metric-resolution" />
        <Metric value="99%" label="first-pass quality achieved" testId="hero-metric-quality" />
      </div>
    </section>
  );
};

const Marquee = () => {
  const marqueeText = "BUSINESS ANALYSIS  •  BUSINESS TRANSFORMATION  •  ANALYTICS  •  STRATEGY  •  DIGITAL TRANSFORMATION  •  STAKEHOLDER ALIGNMENT  •  PROCESS DESIGN  •  ";
  return (
    <div className="marquee-viewport" data-testid="editorial-marquee-strip" aria-label="Business Analysis, Business Transformation, Analytics, Strategy and Digital Transformation">
      <div className="marquee-track" aria-hidden="true" data-copy={marqueeText} />
    </div>
  );
};

const About = () => (
  <section id="about" className="section-shell content-section" data-testid="about-section">
    <div className="section-structure">
      <div className="section-rail">
        <span className="rail-index">01</span>
        <span className="rail-label">About</span>
        <span className="rail-rule" />
        <span className="rail-note">Context before action.</span>
      </div>
      <div className="section-content">
        <Reveal>
          <SectionHeading
            number="01"
            eyebrow="THE POINT OF VIEW"
            title="Clarity is the first transformation."
            intro="An engineering foundation, a management lens and a practical instinct for turning complexity into a path people can act on."
            testId="about-heading"
          />
        </Reveal>
        <div className="about-grid">
          <Reveal className="about-body" delay="reveal-delay-2">
            <p data-testid="about-summary">I am an engineering graduate and PGCM student at Great Lakes Institute of Management, Gurgaon. My work sits at the intersection of business analysis, requirements gathering, process improvement, stakeholder management, analytics and technology-enabled transformation.</p>
            <p>I bring structure to ambiguous problems: listening to what a business needs, mapping how work happens today, finding the friction, and shaping a solution that can move from conversation to implementation.</p>
            <div className="focus-list" data-testid="about-focus-list">
              <span><Search size={15} /> Understand the problem</span>
              <span><Workflow size={15} /> Redesign the process</span>
              <span><BarChart3 size={15} /> Measure the movement</span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

const experienceItems = [
  {
    id: "zealogics",
    role: "Junior Engineer",
    company: "Zealogics IT Solutions Pvt. Ltd.",
    period: "May 2024 – May 2026",
    summary: "Connecting product lifecycle detail, client requirements and leadership visibility across a growing set of product parts.",
    bullets: [
      "Managed EOL lifecycles for 1,000+ product parts across locations.",
      "Led a client product development initiative from requirements gathering through deployment.",
      "Developed leadership reports and actionable insights, reducing issue resolution time by 25%.",
    ],
    metrics: ["1,000+ parts", "25% faster resolution"],
  },
  {
    id: "sfo-technologies",
    role: "Engineer Trainee",
    company: "SFO Technologies Pvt. Ltd.",
    period: "April 2023 – May 2024",
    summary: "Balancing quality, coordination and process awareness on the shop floor to support dependable delivery.",
    bullets: [
      "Achieved 99% first-pass quality and contributed to a 20% increase in order volume.",
      "Coordinated a 20+ member workforce.",
      "Identified process gaps and contributed to process transformation initiatives.",
    ],
    metrics: ["99% first-pass", "20+ workforce"],
  },
];

const ExperienceCard = ({ item, index }) => (
  <Reveal className="experience-card" delay={index === 1 ? "reveal-delay-1" : ""}>
    <div className="experience-card-top">
      <span className="experience-index">0{index + 1}</span>
      <span className="period">{item.period}</span>
    </div>
    <div className="experience-card-main">
      <div>
        <p className="eyebrow">{item.company}</p>
        <h3>{item.role}</h3>
        <p className="experience-summary">{item.summary}</p>
      </div>
      <div className="experience-metrics" data-testid={`${item.id}-metrics`}>
        {item.metrics.map((metric) => <span key={metric}>{metric}</span>)}
      </div>
    </div>
    <ul className="detail-list" data-testid={`${item.id}-responsibilities`}>
      {item.bullets.map((bullet) => <li key={bullet}><Check size={15} /> <span>{bullet}</span></li>)}
    </ul>
  </Reveal>
);

const Experience = () => (
  <section id="experience" className="section-shell content-section section-tint" data-testid="experience-section">
    <div className="section-structure">
      <div className="section-rail">
        <span className="rail-index">02</span>
        <span className="rail-label">Experience</span>
        <span className="rail-rule" />
        <span className="rail-note">Evidence in motion.</span>
      </div>
      <div className="section-content">
        <Reveal>
          <SectionHeading
            number="02"
            eyebrow="THE WORKING RECORD"
            title="From requirements to resolved outcomes."
            intro="A practical record of translating operational detail into better visibility, quality and momentum."
            testId="experience-heading"
          />
        </Reveal>
        <div className="experience-list" data-testid="experience-list">
          {experienceItems.map((item, index) => <ExperienceCard key={item.id} item={item} index={index} />)}
        </div>
      </div>
    </div>
  </section>
);

const FlowDiagram = ({ slug, steps, icon: Icon }) => (
  <div className={`flow-diagram flow-${slug}`} data-testid={`${slug}-flow-diagram`}>
    {steps.map((step, index) => (
      <span className="flow-step-wrap" key={step}>
        <span className="flow-step" data-testid={`${slug}-flow-step-${index + 1}`}>
          {index === 0 && <Icon size={14} />}
          {index !== 0 && <span className="flow-step-dot" />}
          {step}
        </span>
        {index < steps.length - 1 && <ArrowRight className="flow-arrow" size={16} />}
      </span>
    ))}
  </div>
);

const projectItems = [
  {
    slug: "musafir",
    number: "01",
    title: "MUSAFIR",
    subtitle: "Tourism Analytics Project",
    tags: ["Data Analytics", "Strategy"],
    description: "Data-driven analysis of 100 Indian tourist destinations using correlation, regression and K-means clustering to identify tourism drivers, destination clusters and opportunity gaps.",
    finding: "Accessibility and safety were the strongest significant predictors of tourism popularity.",
    takeaway: "Uses analytics to make better tourism investment and destination-development decisions.",
    flow: ["DATA", "INSIGHT", "STRATEGY"],
    icon: Database,
  },
  {
    slug: "spms",
    number: "02",
    title: "STUDENT PARCEL MANAGEMENT SYSTEM",
    subtitle: "Process Design / Digital Transformation / Lean Management",
    tags: ["Process Design", "Digital Transformation", "Lean Management"],
    description: "Redesigns Great Lakes Gurgaon’s manual parcel-handling process into a standardized, digitally enabled system.",
    finding: "Physical ledgers, unstructured storage, 10–15+ minute search times, congestion and limited visibility created the case for change.",
    takeaway: "Uses process redesign and digitalization to make a campus service operation faster, standardized and more efficient.",
    flow: ["PROBLEM", "REDESIGN", "DIGITALIZE", "EFFICIENCY"],
    icon: Workflow,
  },
  {
    slug: "bayer",
    number: "03",
    title: "BAYER",
    subtitle: "Sustainability Project",
    tags: ["Ongoing Live Project", "Stakeholder Needs", "Metrics"],
    description: "Analyzing stakeholder needs and sustainability practices to identify process gaps and improvement opportunities, while developing data-driven recommendations and metrics to support sustainable adoption and measurable impact.",
    finding: "The project is ongoing; outcomes are intentionally not stated here.",
    takeaway: "A live study in progress, focused on sustainable adoption and measurable impact.",
    flow: ["LISTEN", "ANALYZE", "RECOMMEND"],
    icon: Target,
  },
];

const ProjectCard = ({ project, featured = false, live = false }) => (
  <Reveal className={`project-card ${featured ? "project-card-featured" : ""} ${live ? "project-card-live" : ""}`}>
    <article data-testid={`project-card-${project.slug}`}>
      <div className="project-card-header">
        <span className="project-number">{project.number}</span>
        <span className={`project-status ${project.slug === "bayer" ? "is-live" : ""}`}>
          {project.slug === "bayer" ? <><Activity size={13} /> ONGOING LIVE PROJECT</> : "CASE STUDY"}
        </span>
      </div>
      <div className="project-card-title-row">
        <div>
          <p className="eyebrow">{project.subtitle}</p>
          <h3>{project.title}</h3>
        </div>
        <ArrowUpRight className="project-arrow" size={22} />
      </div>
      <div className="tag-row" data-testid={`project-tags-${project.slug}`}>
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <p className="project-description">{project.description}</p>
      <FlowDiagram slug={project.slug} steps={project.flow} icon={project.icon} />
      <div className="project-finding" data-testid={`project-finding-${project.slug}`}>
        <span className="finding-label">{project.slug === "bayer" ? "CURRENT FOCUS" : "KEY NOTE"}</span>
        <p>{project.finding}</p>
      </div>
      <div className="project-takeaway" data-testid={`project-takeaway-${project.slug}`}>
        <span>TAKEAWAY</span>
        <p>{project.takeaway}</p>
      </div>
      {project.slug === "musafir" && (
        <div className="project-actions">
          <a className="project-link-button" href="https://india-tourism-insights.ananya-pgpm27g.chatgpt.site/" target="_blank" rel="noreferrer" data-testid="musafir-view-project-link">
            View Project <ExternalLink size={16} />
          </a>
        </div>
      )}
      {project.slug === "spms" && (
        <div className="project-actions">
          <a className="project-link-button" href="https://spms-inventory-hub.emergent.host/login" target="_blank" rel="noreferrer" data-testid="spms-view-project-link">
            View Project <ExternalLink size={16} />
          </a>
        </div>
      )}
    </article>
  </Reveal>
);

const Projects = () => (
  <section id="projects" className="section-shell content-section projects-section" data-testid="projects-section">
    <div className="section-structure">
      <div className="section-rail">
        <span className="rail-index">03</span>
        <span className="rail-label">Projects</span>
        <span className="rail-rule" />
        <span className="rail-note">Make the logic visible.</span>
      </div>
      <div className="section-content">
        <Reveal>
          <SectionHeading
            number="03"
            eyebrow="SELECTED PROJECTS"
            title="Where data earns a decision."
            intro="Three studies in making hidden friction legible, then shaping the next useful move."
            testId="projects-heading"
          />
        </Reveal>
        <div className="projects-intro-line">
          <span><span className="status-dot" /> ANALYTICS / PROCESS / TRANSFORMATION</span>
          <span>SCROLL THROUGH THE LOGIC <ArrowDown size={14} /></span>
        </div>
        <div className="project-layout" data-testid="project-list">
          <ProjectCard project={projectItems[0]} />
          <ProjectCard project={projectItems[1]} />
          <ProjectCard project={projectItems[2]} live />
        </div>
      </div>
    </div>
  </section>
);

const skillGroups = [
  {
    label: "Business / transformation",
    icon: Network,
    items: ["Business Analysis", "Requirements Gathering", "Business Process Design", "Process Mapping", "Structured Problem Solving"],
  },
  {
    label: "Delivery / engagement",
    icon: UsersRound,
    items: ["Project Coordination", "Stakeholder Management", "Client Engagement", "Data Management"],
  },
  {
    label: "Analytics / tools",
    icon: BarChart3,
    items: ["Excel", "Power BI", "Oracle", "Correlation Analysis", "Regression", "K-means Clustering"],
  },
];

const Skills = () => (
  <section id="skills" className="section-shell content-section section-tint" data-testid="skills-section">
    <div className="section-structure">
      <div className="section-rail">
        <span className="rail-index">04</span>
        <span className="rail-label">Skills</span>
        <span className="rail-rule" />
        <span className="rail-note">The working toolkit.</span>
      </div>
      <div className="section-content">
        <Reveal>
          <SectionHeading
            number="04"
            eyebrow="CAPABILITY MAP"
            title="A toolkit for the whole problem."
            intro="Structured thinking, careful coordination and analytical tools that keep a solution connected to the business need."
            testId="skills-heading"
          />
        </Reveal>
        <div className="skill-layout" data-testid="skills-list">
          {skillGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <Reveal className="skill-panel" delay={index === 1 ? "reveal-delay-1" : index === 2 ? "reveal-delay-2" : ""} key={group.label}>
                <div className="skill-panel-top"><Icon size={18} /><span>0{index + 1}</span></div>
                <h3>{group.label}</h3>
                <div className="skill-items">
                  {group.items.map((item) => <span key={item} data-testid={`skill-${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</span>)}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

const educationItems = [
  { degree: "PGCM", school: "Great Lakes Institute of Management, Gurgaon", detail: "Pursuing, 2027" },
  { degree: "B.Tech. (EEE)", school: "Rajagiri School of Engineering & Technology", detail: "73.4%, 2022" },
  { degree: "12th", school: "Vidyodaya School", detail: "81.8%, 2017" },
  { degree: "10th", school: "Vidyodaya School", detail: "10/10, 2015" },
];

const certificationItems = [
  "Business Analytics using Power BI — KOED, 2026",
  "Management Consulting Leadership Program — Skilled Sapiens, 2026",
];

const Education = () => (
  <section id="education" className="section-shell content-section" data-testid="education-section">
    <div className="section-structure">
      <div className="section-rail">
        <span className="rail-index">05</span>
        <span className="rail-label">Education</span>
        <span className="rail-rule" />
        <span className="rail-note">Built, then broadened.</span>
      </div>
      <div className="section-content">
        <Reveal>
          <SectionHeading
            number="05"
            eyebrow="EDUCATION / CERTIFICATION"
            title="Engineering detail. Management breadth."
            intro="A foundation that keeps technical understanding close to the decisions a business has to make."
            testId="education-heading"
          />
        </Reveal>
        <div className="education-grid">
          <Reveal className="education-ledger" delay="reveal-delay-1">
            <div className="ledger-label"><GraduationCap size={17} /> EDUCATION</div>
            <div className="ledger-list" data-testid="education-list">
              {educationItems.map((item) => (
                <div className="ledger-row" key={item.degree}>
                  <strong>{item.degree}</strong>
                  <span>{item.school}</span>
                  <em>{item.detail}</em>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="certification-panel" delay="reveal-delay-2">
            <div className="ledger-label"><Sparkles size={17} /> CERTIFICATIONS</div>
            <div className="certification-list" data-testid="certification-list">
              {certificationItems.map((item, index) => (
                <div className="certification-item" key={item}>
                  <span>0{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

const achievementItems = [
  "First Prize — Strategic Shutdown, Great Lakes Institute of Management, 2026",
  "Third Prize — Talent Evening, Great Lakes Institute of Management, 2026",
  "Third Prize — Eastern Group Song, Intercollege Fest, 2022",
];

const leadershipItems = [
  "Project Lead — Firmware Development, Zealogics IT Solutions, 2025",
  "Volunteer — Inter College Fest, Rajagiri School of Engineering & Technology, 2022",
];

const Achievements = () => (
  <section id="achievements" className="section-shell content-section section-tint" data-testid="achievements-section">
    <div className="section-structure">
      <div className="section-rail">
        <span className="rail-index">06</span>
        <span className="rail-label">Achievements</span>
        <span className="rail-rule" />
        <span className="rail-note">Proof of range.</span>
      </div>
      <div className="section-content">
        <Reveal>
          <SectionHeading
            number="06"
            eyebrow="BEYOND THE JOB TITLE"
            title="Performance, participation, leadership."
            intro="The details that show how Anjana contributes when the brief gets wider than the role."
            testId="achievements-heading"
          />
        </Reveal>
        <div className="achievement-grid">
          <Reveal className="achievement-column" delay="reveal-delay-1">
            <div className="ledger-label"><Award size={17} /> ACHIEVEMENTS</div>
            <div className="achievement-list" data-testid="achievement-list">
              {achievementItems.map((item, index) => (
                <div className="achievement-row" key={item}><span>0{index + 1}</span><p>{item}</p></div>
              ))}
            </div>
          </Reveal>
          <Reveal className="achievement-column" delay="reveal-delay-2">
            <div className="ledger-label"><BriefcaseBusiness size={17} /> LEADERSHIP</div>
            <div className="achievement-list" data-testid="leadership-list">
              {leadershipItems.map((item, index) => (
                <div className="achievement-row" key={item}><span>0{index + 1}</span><p>{item}</p></div>
              ))}
            </div>
            <div className="languages-block" data-testid="languages-list">
              <span className="ledger-label"><Globe2 size={16} /> LANGUAGES</span>
              <p>English <i /> Hindi <i /> Malayalam</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="section-shell contact-section" data-testid="contact-section">
    <div className="contact-grid">
      <Reveal className="contact-copy">
        <p className="eyebrow">07 / OPEN TO THE NEXT BRIEF</p>
        <h2 data-testid="contact-heading">Let's Build Something Meaningful.</h2>
        <p>For business analysis, transformation, analytics or strategy conversations, reach out directly.</p>
        <div className="contact-coordinates" aria-hidden="true"><span>KERALA / GURGAON</span><span>01° 22′ 43″ N</span></div>
      </Reveal>
      <Reveal className="contact-card" delay="reveal-delay-1">
        <div className="contact-card-top"><span>DIRECT LINE</span><ArrowUpRight size={18} /></div>
        <div className="contact-links">
          <a href={`mailto:${EMAIL}`} data-testid="contact-email-link"><Mail size={19} /><span>{EMAIL}</span><ArrowRight size={17} /></a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer" data-testid="contact-linkedin-link"><Linkedin size={19} /><span>linkedin.com/in/anjana-sara-abraham</span><ExternalLink size={16} /></a>
        </div>
        <div className="contact-buttons">
          <a className="button button-primary" href={`mailto:${EMAIL}`} data-testid="email-me-button">Email Me <Mail size={16} /></a>
          <a className="button button-ghost" href={LINKEDIN} target="_blank" rel="noreferrer" data-testid="linkedin-button">LinkedIn <ExternalLink size={16} /></a>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="site-footer" data-testid="main-footer">
    <div className="footer-inner">
      <div className="footer-brand"><span className="footer-mark">ASA</span><span>Anjana Sara Abraham</span></div>
      <p>Business Analysis <i /> Transformation <i /> Analytics</p>
      <p className="footer-copyright">© 2026 Anjana Sara Abraham</p>
    </div>
  </footer>
);

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = navItems.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.3, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="site-header" data-testid="main-header-nav">
        <div className="header-inner">
          <a className="brand" href="#home" onClick={handleNavClick} data-testid="nav-brand-logo">
            <span className="brand-mark">ASA</span>
            <span className="brand-name">ANJANA SARA ABRAHAM</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                className={activeSection === item.id ? "active" : ""}
                href={`#${item.id}`}
                onClick={handleNavClick}
                data-testid={`nav-${item.id}-link`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a className="header-contact" href="#contact" onClick={handleNavClick} data-testid="header-contact-link">Let's talk <ArrowUpRight size={15} /></a>
          <button className="mobile-menu-button" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} data-testid="mobile-menu-toggle">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        <div className={`mobile-menu-panel ${menuOpen ? "is-open" : ""}`}>
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={handleNavClick} data-testid={`mobile-nav-${item.id}-link`}>
              <span>{item.label}</span><ArrowUpRight size={17} />
            </a>
          ))}
        </div>
      </header>

      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
