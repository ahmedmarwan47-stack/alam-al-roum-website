# Status — 26 Oct 2026

## Done
- All pages: Home, About, Destination, Experiences (+ 9 details), Communities (+ 6 neighbourhoods), Sustainability,
  Events, Media Center (+ 12 article pages), Careers (+ 5 job pages), FAQ, Contact
- Menu overlay on the MENU button; Navbar, Footer and home-page cards/CTAs wired to the routes
- `npm run build` passes (48 static pages); lint shows only the pre-existing RevealText ref error
- 33 photos upscaled with Real-ESRGAN; Imagery originals from Figma 11127:8055 used where they exist; footer-lagoon video at 1920×1080

## Open
1. `public/video/grandeur-skyfall-v2.mp4` 1920×1080 upscale (running; commit it once it lands, or re-run `tools/upscale/upscale_site.sh`).
2. Contact form has no backend: Send opens the visitor's mail app addressed to info@alamalroumegypt.com.
3. The Book a Call block is a working mock of the Cal.com booker; swap in the real Cal.com embed once there is an account link.
4. Footer legal links (Privacy, Terms, Cookies) and social icons still point to `#`: no pages or profile URLs yet.
5. Pre-existing lint error in `components/reveal/RevealText.tsx` (ref read during render).

## Copy and design not from Figma, to review
- Menu overlay design (no Figma frame found for it)
- Only the phase-one article has body text; the other 11 stories show their card image and "The full story will be published here soon."
- Only Marine works engineer has responsibilities/requirements; the other 4 job pages show position details and "What we offer"
- Careers hero body repeats the Media Center line, as in Figma
- Contact Interest dropdown options beyond "Register interest"
- In-town modes 2 and 3 bodies, last destination FAQ answer
- Generic experience and neighbourhood detail pages built from card text
- Events dates use 2027; the Past tab reuses the home page's past events; Media Center Blog/News split (6/6) is a guess
