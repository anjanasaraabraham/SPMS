# Product Requirements Document

## Problem Statement
Refine the existing Anjana Sara Abraham portfolio with actionable visual guidance and design architecture. The experience communicates analytical rigour, process thinking, and professional credibility without inventing experience, outcomes, clients, or achievements.

## Personas
- Hiring managers evaluating business analysis, transformation, analytics, and strategy capability
- Consulting and strategy professionals reviewing project thinking, process mapping, and communication quality
- Potential enterprise collaborators looking for direct, professional engagement

## Architecture
- React single-page application served by the existing frontend scaffold (`.js`/`.jsx`)
- One fixed crystal-glass responsive header with anchor navigation and mobile drawer
- CSS-led editorial motion: masked hero line reveal, IntersectionObserver section reveals, slow contained marquee ticker, and subtle pointer parallax
- Inline SVG coordinate grid and process diagrams communicating analytical logic
- Direct `mailto:` and LinkedIn anchors; no database flow or invented mock portals
- Design guidelines generated at `/app/design_guidelines.json` for seamless handoff

## Core Requested Edits & Design Guidance
1. **Hero Profile Panel Only Portrait**: Use the uploaded professional portrait in the Hero profile panel (`.hero-visual` / `.portrait-poster`) only, with a premium deliberate crop (`object-cover`, upper-body focus, subtle 1px border `border-white/20`, no fictional replacement anywhere else).
2. **Reduced Vertical Gaps**: Calibrate excessive section paddings (from 146px/170px down to ~82px on desktop and ~56px on mobile) and inner module spacing (from 62px to 36px) to maintain intentional editorial breathing room without dead space.
3. **Projects Layout Architecture**:
   - **Musafir & SPMS**: Side-by-side as two equal project cards (`grid-cols-1 md:grid-cols-2`) with balanced visual weight, tags, flow diagrams, and takeaways.
   - **Bayer**: Separate, more prominent ongoing live-project treatment (full-width spotlight card, pulsating live status badge, distinct sapphire-teal elevation, and "LISTEN → ANALYZE → RECOMMEND" flow).
4. **Hero Resume CTA**: Add a prominent "My Resume" action in the Hero actions group with distinct icon and test ID `hero-resume-button`.
5. **First-Person Narrative Voice**: Update intro and summary statements across Hero and About to first person ("I am an impact-oriented professional...", "My work sits at the intersection...", "I bring structure...") while preserving all authentic data.
6. **Preserved Aesthetic & Integrity**: Deep navy palette (`#090D16`, `#0E1626`), Playfair Display + IBM Plex Sans, restrained teal/lavender/warm accents, asymmetric sticky rail (01 to 07), and zero invented facts.

## Status: Design Guidelines Complete
- `/app/design_guidelines.json` generated and validated. Ready for implementation.
