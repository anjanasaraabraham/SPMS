# Product Requirements Document

## Problem Statement
Create a premium, modern, responsive single-page portfolio for Anjana Sara Abraham that positions her for business analysis, business transformation, analytics, strategy and digital transformation opportunities. The experience must communicate analytical rigour, process thinking and professional credibility without inventing experience, outcomes, clients or achievements.

## Personas
- Hiring managers evaluating business analysis, transformation, analytics and strategy capability
- Consulting and strategy professionals reviewing project thinking and communication quality
- Potential collaborators or clients looking for a direct, professional way to connect

## Architecture
- React single-page application served by the existing frontend scaffold
- One fixed responsive header with anchor navigation and mobile menu
- CSS-led editorial motion: masked hero line reveal, IntersectionObserver section reveals, slow marquee and subtle pointer parallax
- Inline SVG coordinate grid and process diagrams to communicate analytical logic without fictional photography
- Direct `mailto:` and LinkedIn anchors; no form submission or database flow
- Existing FastAPI `/api/` endpoint remains unchanged and is not used by the portfolio UI

## Core Requirements
- One continuous scrolling page with Home, About, Experience, Projects, Skills, Education, Achievements and Contact sections
- Deep navy editorial visual system with teal, lavender and warm-parchment accents
- Large headline: “Turning Business Problems into Actionable Solutions.”
- Exact professional history, projects, education, certifications, achievements, leadership and languages supplied by the owner
- Projects treated as a primary section, with Musafir showing DATA → INSIGHT → STRATEGY and SPMS showing PROBLEM → REDESIGN → DIGITALIZE → EFFICIENCY
- Bayer clearly marked as an ongoing live project without invented outcomes
- Clickable email and LinkedIn links; LinkedIn opens in a new tab
- Responsive desktop and mobile layout with unique data-testid coverage for interactive and critical elements

## Implemented 2026-09-02
- Built the complete editorial single-page portfolio experience and responsive navigation
- Added animated hero headline, metrics, project process diagrams, skill groups, education ledger, achievement/leadership sections and direct contact actions
- Added scroll reveals, pointer-based hero parallax, smooth anchor scrolling and a mobile navigation panel without using framer-motion
- Added award-oriented dark editorial typography using Playfair Display and IBM Plex Sans
- No uploaded profile asset was returned by the asset lookup; the hero therefore uses a deliberate ASA identity poster as a **MOCKED PROFILE IMAGE SLOT**, never a fictional person

## Prioritised Backlog
### P0
- Replace the **MOCKED PROFILE IMAGE SLOT** with Anjana’s uploaded professional portrait when the asset is available
- Remove the remaining document-width overflow caused by the animated editorial marquee and re-run desktop/mobile layout assertions

### P1
- Add a small downloadable CV action once the approved CV file is supplied
- Add optional project deep-dive states only if the owner provides additional approved project material

### P2
- Add a restrained print stylesheet for a one-page portfolio summary
- Add a lightweight theme preference only if a second approved visual direction is requested

## Next Tasks
1. Upload the approved professional portrait and replace the identity poster asset slot.
2. Constrain the marquee animation without reducing its editorial motion.
3. Re-run the preview flow after the two P0 items are complete.
