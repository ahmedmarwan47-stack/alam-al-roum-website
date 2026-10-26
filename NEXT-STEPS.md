# Status — 26 Oct 2026

## Done
- All pages: Home, About, Destination, Experiences (+ 9 details), Communities (+ 6 neighbourhoods), Sustainability,
  Events, Media Center (+ 12 article pages), Careers (+ 5 job pages), FAQ, Contact
- Menu overlay on the MENU button; Navbar, Footer and home-page cards/CTAs wired to the routes
- `npm run build:pages` passes (48 static pages); `npm run lint` is clean
- Figma audit (UI Design page, 10921:7383), page by page against the frames:
  - Home: Grandeur limestone wash over the paused film, hero title on two lines, masterplan copy width and pin card,
    Connectivity in Figma's two variants (Home / Destination "To Town") with the Figma icons, larger Qatari Diar
    numerals, Landmarks rows, bottom-aligned news cards, CTA "Live Greatness" at 80/76 with the dark button
  - Experience details: "Ways to live" is the Figma slider (progress bar, prev / next), not the grid
  - Hotels / unit types: the Figma drawer (gallery thumbs, description, icon spec rows, Visit Website or
    Register Interest + Download Brochure)
  - Neighbourhood: "More communities" uses the staggered grid; the CTA is the Register Interest form panel
  - FAQ page: the Figma accordion (category chips, 11 questions); every FAQ section shares one accordion
  - Contact: the current "Say hello" design (11134:15381), full-bleed pool photo and white copy
  - Media Center: the Blog tab lists all 12 stories in Figma's order; Keep Reading with View All
  - One footer site-wide (the lagoon film), button labels in Figma's title case
- Gallery: Sienna-style wall, one viewport tall; rows loop (one tile / 12 s, rows 1 and 3 left, row 2 right) and
  the page scroll slides them and pushes them along; exactly Figma's four overlays
- Motion, one system across the site (`components/reveal/letters.ts`):
  - text blocks blur in whole (no line / word / letter splits), hidden from first paint so nothing flashes
  - photos open with one wipe (bottom up, settling from a 1.12 zoom)
  - removed the scroll snap on Milestones and the reversing entrances (they read as jumps)
  - the About film is a frame sequence on a canvas (`public/seq/skyfall`, from `grandeur-skyfall-v2.mp4`, whose
    two keyframes made scroll seeking stutter); the 3D coins only render while on screen
- Review round 2:
  - Since the Romans: Figma columns (1041 / 30 / 321), so the statement no longer runs into the mosaic; the terracotta
    frame opens from a centre seam, then its photo rises in and sharpens
  - Photo sweep now clears a blur as it opens; the CTA film, footer film, Home coins and the Gallery wall blur in only
  - Entrances play as a section starts coming into view (85 %), so a whole section is in place when you reach it
  - Reading holds (`withHold` / `HOLD_VH` in lib/gsap.ts) on every pinned section: heroes, Life in Bloom, the coin
    stage, Coastal Facts, The Story (on both copy states), Nearby, the horizontal tracks; Milestones rests on each year
  - Hero copy turns light only once the photo covers it; in-town modes keep their text visible and activate earlier
  - Story and event cards are row subgrids, so a row stays in line when one title wraps
- No orphans: `text-wrap: pretty` on all text, and RevealText ties each block's last two words
- Responsive: no horizontal overflow at 390 / 768 / 1024; phone fixes for the Grandeur film, Ways to live rows,
  the masterplan pin card (shown under the map), the Romans panel and the Water strategy decor

## Open
1. Contact and Register Interest forms have no backend: sending opens the visitor's mail app addressed to info@alamalroumegypt.com.
2. The Book a Call block is a working mock of the Cal.com booker; swap in the real Cal.com embed once there is an account link.
3. Footer legal links (Privacy, Terms, Cookies), social icons, hotel "Visit Website" and unit "Download Brochure" point to `#`.
4. Figma asset URLs (figma.com) are blocked from the build environment: the Contact photo is the same pool shot from
   the repo cropped to the Figma framing, and new icons come from the Hugeicons free set Figma uses.

## Copy and design not from Figma, to review
- Drawer copy for the five hotels and three unit types beyond Figma's two drawers (same structure, figures from their cards)
- The last FAQ answer ("When will the first homes be handed over?") is closed in Figma; its answer follows the timeline
- Only the phase-one article has body text; the other 11 stories show their card image and "The full story will be published here soon."
- Only Marine works engineer has responsibilities/requirements; the other 4 job pages show position details and "What we offer"
- Careers hero body repeats the Media Center line, as in Figma
- Contact Interest dropdown options beyond "Register interest"; Register Interest unit types beyond "Standalone Villa"
- In-town modes 2 and 3 bodies, last destination FAQ answer
- Generic experience and neighbourhood detail pages built from card text
- Events dates use 2027; the Past tab reuses the home page's past events
