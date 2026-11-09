# Status — 9 Nov 2026

## Handoff — 9 Nov 2026 (phone responsiveness pass 3)

### Rules the owner set (follow them)
- **4 px type grid:** every font size and line height sits on the 4 px grid; only 14 px and 18 px may be off it. Never
  suggest 13 / 15 / 17 px. Pairings in use: 12/16 or 12/18, 14/20, 16/24, 32/36.
- **Phone cards in two-column grids:** title 14/20, secondary line 12/18; labels that explain a number 14/20.
  Spacing photo → first line 12 px, line → line 4 px.
- **Communities:** names are singular ("Beachfront community", "Lagoon neighbourhood", "Resort district"); one photo
  per community everywhere = its own page's hero photo (`communityPhoto` in lib/communities.ts). Home keeps the Figma
  coin design, the list page its grid; that's intended.
- Segmented toggles: full width on phones; Map / Grid opens on **Grid**.
- Phone screenshots of every change: `local-assets/responsive-qa/` (git-ignored).

### Done this session (all below md / lg only; desktop unchanged unless noted)
- `lib/breakpoints.ts` (`BP`, `MQ`, `matches`): every JS media query uses it. Button hovers gated to `(hover: hover)`.
  Leftover `100vh` → `svh`.
- Home: Grandeur Restored phone constellation (two card bands, centre of the lower band kept clear for the lighthouse
  tower; `BANDS` in ScrollStory.tsx); Qatari Diar runs the pinned desktop animation on phones too; Ways to live rows
  without numbers; Landmarks accordion opens the first row, one open at a time; Connectivity list before the visa
  card (Home and Destination); CTA portal film cropped at 80 % on phones.
- Type: `.l-tag` tagline class (14/20 phones, 16/24 up) on all 17 taglines; `.l-14` and `.b-14` line height 20 px.
- Cards: community / hotel / event / story cards 14/12 on phones with 12/4 spacing; equal-size community and hotel
  cards on phones (4:5 photos); event dates without weekday and with a 2-digit year ("10 Feb 27"); the place ends in
  "…" when it doesn't fit (cards are `min-w-0` + `grid-cols-1` so the row can't widen the grid).
- FAQ: no side padding on phones; "Read All FAQs" after the questions below lg.
- About: pinned scenes ~40 % shorter on phones (page 18.3k → 15.4k px); city numbers 32/36 with 14/20 labels;
  "A landmark restored" points stacked, body 16/24; Milestones sizes set as (on-screen size) / rail zoom (year 32/36,
  text 14/20); Nearby map labels 12/16.
- `SmoothScroll.tsx`: `ScrollTrigger.refresh()` whenever the page height changes (fixes entrances stuck at opacity 0,
  e.g. the Milestones title on a phone).

### Next (agreed with the owner, not started)
1. **Full-bleed heroes on phones** (owner chose option A): About (Manifesto), Destination, Communities, Experiences
   (PageHero) switch to Home's phone hero: full-screen photo, tag / title / body in Limestone at the bottom over a
   soft shade. About's desktop end state already looks like this. Listing heroes (FAQ, Events, Media, Careers) stay.
2. **Hero text sizes** — owner feels the descriptions take too much space. Measured at 375 px:
   | Page | Title | Description |
   |---|---|---|
   | Home | 32.6/35.9 (off grid) | 16/24, 4 lines |
   | About | 26/26 | 16/24, 3 lines |
   | Destination | 26/29.7 (off grid) | 16/24, 4 lines (section 900 px) |
   | Sustainability | 34/37.4 (off grid) | 18/27 (off grid), 5 lines |
   | FAQ | 32/30.1 (off grid) | 16/24, 3 lines |
   Proposal to put to the owner: titles 32/36 and descriptions 14/20 on phones, on the grid.
3. **Nearby map (About) — owner chose option 1 only:** crop the phone swipe strip to the coast (a ~4:3 frame on the
   coastline and pins instead of the full 1512 × 1024 drawing, which is ~660 px tall and mostly desert). No distance
   list.

## 27 Oct — phone pass 2, articles and events
- Shared phone rules (below lg; desktop unchanged): footer link groups are accordions; the CTA film sits on top and
  fades into the copy; every Button is full width (below 768) at one 44 px size; `Drawer` is a bottom sheet (masterplan
  pins, hotel and unit drawers); filter chips scroll in one row; header = menu icon / centred logo / register chip
- Phone type scale lowered (headings and display sizes; body stays 16 px); the 1512 sizes are unchanged
- Landmarks (Ayana "Residence Types"): desktop is click-driven, no pin; phones and tablets are a tap accordion that
  opens each row's photo
- Per page: Home (stacked Qatari Diar numbers, swipeable masterplan, Ways to live thumbnails, Connectivity order),
  About (Milestones prev/next + swipe, shorter coin and Story pins, Nearby panning), Destination (in-town coin stays
  in view), Sustainability (water cards), listings (swipe tracks, two-column grids, 4:3 article heroes)
- Flight-radius map: no ring or route crosses any label at any width
- All 11 remaining Media Center stories written in the Figma article structure (`lib/articles.ts`), and every event
  has its own page `/events/<slug>` on the same template ("Event details" panel, programme, how to attend)
- Phone screenshot checker: `node ~/alam-elroum/docs/tools/phone/shots.mjs <path> [width]`

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
- Phone pass (390 px):
  - one fluid type scale (app/globals.css): every Figma size runs on a straight line from a phone size at 390
    to Figma's size at 1512, page titles included (`.d-*`); long statements use the smaller `.hd-56l`
  - Qatari Diar numbers keep the photo numerals on phones, under the copy; the lighthouse title breaks only from tablet up
  - Life in Bloom copy stays inside the framed photo; The Story's scattered words stay on screen and its paragraph
    waits until they have gathered
  - Since the Romans stacks the title above the mosaic; the water panels get a deeper shade behind their copy
  - the flight-radius map sizes its labels to the map; the Contact map uses dot pins; the Cal.com booker stacks
  - masterplan pins open the side drawer on phones (the shared `components/ui/Drawer.tsx`, as on the hotel and
    unit cards); the pin rings no longer catch taps meant for a neighbouring pin
  - Milestones keeps the year in focus centred where only one fits (phones, tablets)
  - a text-overlap check (every page scrolled at 390 and 768) finds no colliding or off-screen text
- Responsive: no horizontal overflow at 390 / 768 / 1024; phone fixes for the Grandeur film, Ways to live rows,
  the masterplan pin card (shown under the map), the Romans panel and the Water strategy decor; the hotel drawer
  and the menu scroll under a mouse wheel (`data-lenis-prevent`)

## Open
1. Contact and Register Interest forms have no backend: sending opens the visitor's mail app addressed to info@alamalroumegypt.com.
2. The Book a Call block is a working mock of the Cal.com booker; swap in the real Cal.com embed once there is an account link.
3. Footer legal links (Privacy, Terms, Cookies), social icons, hotel "Visit Website" and unit "Download Brochure" point to `#`.
4. Figma asset URLs (figma.com) are blocked from the build environment: the Contact photo is the same pool shot from
   the repo cropped to the Figma framing, and new icons come from the Hugeicons free set Figma uses.

## Copy and design not from Figma, to review
- Article copy for the 11 stories beyond phase one, and all event pages (venues, timings, dates are drafts); some
  Figma headlines ("robotics deployed", "healthcare facilities established", "green energy launched") are written as plans
- Masterplan phone caption "Swipe the map, tap a pin to explore"
- Drawer copy for the five hotels and three unit types beyond Figma's two drawers (same structure, figures from their cards)
- The last FAQ answer ("When will the first homes be handed over?") is closed in Figma; its answer follows the timeline
- Only Marine works engineer has responsibilities/requirements; the other 4 job pages show position details and "What we offer"
- Careers hero body repeats the Media Center line, as in Figma
- Contact Interest dropdown options beyond "Register interest"; Register Interest unit types beyond "Standalone Villa"
- In-town modes: all three bodies (lengthened to ~3 lines, 28 Oct) expand the factsheet's smart-mobility list; the
  autonomous shuttles running the Loop, shared bikes / e-scooters and private cars entering by the seven gates are
  drafts. Last destination FAQ answer
- Neighbourhood detail pages built from card text
- Events dates use 2027; the Past tab reuses the home page's past events
- 28 Oct client edits (items 08, 09, 22, 23):
  - Event cards everywhere read `location | date` (no category). Every event has a venue (lib/articles.ts `location`),
    which leads its page header and its cards; Home's cards repeat it in lib/content.ts. "Events at the marina" now
    shows the marina's own events (regatta, food market, 10K run, Music by the sea, linked to their pages) instead of
    the golf and sculpture cards; "Music by the sea" got its own page and joined the Events list (10 upcoming). The four
    hotel events ("Events at the hotels") name their hotel as the location and still have no pages
  - Article and event headers are one structure: tag row (events: location · date), title, a two-line standfirst,
    Share via; the byline/date block and the event "Register interest" button are gone. Every standfirst was
    rewritten to run two lines at 1024–1512 px
  - Every story and event body was lengthened: a third intro paragraph, a second heading section, a pull quote or a
    row of key figures, and captions on both images. All of it is draft copy; the pull quotes are lines from the
    article itself, unattributed (one cites "Alam Al Roum" for the FAQ line "built for permanence, not for a season");
    event programme times are drafts
  - The Coastal open championship (golf course) and Marina regatta weekend (international marina) are dated Feb 2027,
    before the course and the marina open (2028 in the phase-one story): dates or venues to confirm
  - Experience pages: all nine share one template (app/experiences/[slug]/page.tsx): overview with key facts, the
    Landmarks section for what's here (hotels: "Where to stay"), the hotel directory (hotels only), the community
    (terracotta band, clubs, membership, a photo pair), "Life in the community" (four photo cards), gallery carousel,
    events (filled to four) and the experience slider. Facts are from the factsheet; clubs, memberships and
    programmes are drafts
  - Eleven experience photos were generated with Figma AI (public/images/experiences/gen/, Figma page "Generated —
    website photos"): placeholders until real photography exists
  - Brand-book photos added for these pages need licence confirmation: public/images/experiences/{beach-lagoon-deck,
    marina-sailing, marina-dusk, golf-clubhouse-terrace, golf-clubhouse-bar, sports-courts, sports-swim, sports-sailing,
    dining-evening, dining-table, hotels-pool, hotels-suite, wellness-rest, wellness-shore, education-hub,
    education-heritage, education-nature, culture-fresco, culture-music, culture-studio}.jpg and
    public/images/events/coastal-run.jpg (from docs/brand/imagery/4k, 1600 px)
  - Sustainability: the cut-out glasses beside "Clean by nature. Calm by design." were removed (the PNGs stay in
    public/images/sustainability, unused)
- 28 Oct large-screen pass: content is capped at 1392 px and centred from 1512 px up (--gutter); lists have rules
  only between items; the FAQ accordion starts at the page centre (the Landmarks photo line), not where Figma has it
- Waiting on the client: the full masterplan image (replace public/images/photo/masterplan-aerial.jpg, then run
  scripts/masterplan-crops.py)
