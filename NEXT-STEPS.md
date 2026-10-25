# Checkpoint — 25 Oct 2026, 17:45

## Done
- Destination, Experiences (+ 9 detail pages), Communities (+ 6 neighbourhood pages), Sustainability
- FAQ (`/faq`, home + destination questions merged)
- Events (`/events`) and Media Center (`/media-center`), using the shared `ListingHero` and `TabbedGrid`
- 33 photos upscaled with Real-ESRGAN; Imagery originals from Figma 11127:8055 used where they exist
- Arch-sea loop (from the Instagram footage) and shore loop videos

## Still to build
1. **Article detail** `/media-center/[slug]`: header (date, title, subtitle, byline, "Share via"), m04 hero 1392×640,
   body with key takeaways + inline m05/m04 images (768×432, caption "Illustrative coastal imagery from the brand collection."),
   then "KEEP READING / More from the Media Center." with the first 3 stories. Slugs are already generated in `lib/listings.ts`.
2. **Careers** `/careers`: ListingHero "Open Careers" + role cards (Senior urban planner, Infrastructure director,
   Landscape architect, Marine works engineer, Project controls lead).
3. **Job detail** `/careers/[slug]`: template from Marine works engineer (position details, responsibilities 01–03,
   requirements, what we offer).
4. **Contact** `/contact`: "Let's talk about what's next" contacts + form on contact olive image
   (`public/images/contact/contact-faded.jpg`), Book a Call mock, Locations on `images/contact/map.jpg`.
5. Wire Navbar menu + Footer links (currently `#`) to the routes.
6. `npm run build`, lint, and a browser pass over every page.
7. Upscale `public/video/grandeur-skyfall-v2.mp4` to 1920×1080 (289 frames, ~1.6 h; footer-lagoon is already done):
   re-run `tools/upscale/upscale_site.sh` for those two; it needs a PyTorch venv with spandrel and the RealESRGAN_x4plus.pth weights).

## Copy written by Claude (not in Figma), to review
- In-town modes 2 and 3 bodies, last destination FAQ answer
- Generic experience and neighbourhood detail pages built from card text
- Events dates use 2027; the Past tab reuses the home page's past events
- Media Center Blog/News split (6/6) is a guess
