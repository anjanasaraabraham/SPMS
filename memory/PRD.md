# Product Requirements Document

## Problem Statement
Create and refine a premium, modern, responsive single-page portfolio for Anjana Sara Abraham that communicates business analysis, business transformation, analytics, strategy and digital transformation capability without inventing experience, outcomes, clients or achievements.

## Personas
- Hiring managers evaluating business analysis, transformation, analytics and strategy capability
- Consulting and strategy professionals reviewing project thinking, process mapping and communication quality
- Potential collaborators looking for a direct, professional way to connect

## Architecture
- React single-page application served by the existing frontend scaffold
- One fixed responsive header with anchor navigation and mobile menu
- CSS-led editorial motion: masked hero line reveal, IntersectionObserver section reveals, contained marquee and subtle pointer parallax
- Inline SVG coordinate grid and process diagrams communicating analytical logic
- Direct `mailto:` and LinkedIn anchors; no database flow or stored contact submissions
- Public uploaded portrait and resume PDF used as external asset URLs

## Core Requirements
- One continuous page with Home, About, Experience, Projects, Skills, Education, Achievements and Contact sections
- Deep navy editorial visual system with restrained teal, lavender and warm-parchment accents
- Exact supplied professional history, projects, education, certifications, achievements, leadership and languages
- Musafir and SPMS shown side by side; Bayer shown as a separate prominent ongoing live project without invented outcomes
- First-person introduction and About narrative
- Plain portrait box in the Hero profile panel only
- Clear View Project buttons for Musafir and SPMS linking to their supplied public destinations
- Prominent My Resume action linked to the supplied public PDF
- Responsive desktop/mobile layout with unique data-testid coverage for interactive and critical elements

## Implemented 2026-09-02
- Built the complete editorial single-page portfolio experience and responsive navigation
- Added animated hero headline, metrics, project process diagrams, skill groups, education ledger, achievement/leadership sections and direct contact actions
- Added scroll reveals, pointer-based hero parallax, smooth anchor scrolling and a mobile navigation panel without using framer-motion
- Added award-oriented dark editorial typography using Playfair Display and IBM Plex Sans
- Replaced the previous identity treatment with Anjana’s uploaded portrait in a simple bordered Hero box with no overlay text or labels
- Added My Resume linked to the supplied PDF and clear View Project buttons for Musafir and SPMS
- Tightened vertical section pacing, moved Musafir and SPMS into equal columns, and made Bayer a separate full-width live-project spotlight
- Updated Hero and About copy to first person
- Removed the Hero visual header, coordinate labels and footer metadata so the uploaded profile photo remains a plain box

## Verification
- Production frontend build compiled successfully
- Uploaded portrait loaded with a non-zero natural image size
- Supplied Musafir and SPMS URLs are present on the correct View Project links; destination pages were crawled successfully
- Desktop layout assertion: one fixed header, no text behind header, no empty holes, no overlap, no clipped text, no broken images and no horizontal overflow
- Mobile check: one fixed header, no horizontal overflow, no broken images and portrait visible

## Prioritised Backlog
### P0
- No known P0 blockers after the latest responsive browser check

### P1
- Add optional project deep-dive states only if the owner provides additional approved project material

### P2
- Add a restrained print stylesheet for a one-page portfolio summary
- Add a lightweight theme preference only if a second approved visual direction is requested

## Next Tasks
1. Keep the approved portrait and resume asset links current if the public files change.
2. Add deeper approved case-study notes only when the owner provides them.
3. Re-run the preview flow after any content or asset replacement.
