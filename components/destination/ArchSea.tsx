import { archSea as A } from "@/lib/destination";

/**
 * Lighthouse · the arch at sea (Figma 11134:15815): the page melts into clouds, and below them the
 * mirror arch stands in the moving sea (real footage, looped). The film starts 5.3 % of the width
 * down so its top edge always sits under the solid band of the clouds (≈ top 15 % of the cloud art).
 */
export default function ArchSea() {
  return (
    <section className="relative overflow-hidden bg-limestone-50" aria-label="The arch at sea">
      <div className="relative mt-[5.3vw]">
        <video className="block w-full" poster={A.poster} autoPlay muted loop playsInline aria-hidden>
          <source src={A.webm} type="video/webm" />
          <source src={A.video} type="video/mp4" />
        </video>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={A.clouds} alt="" className="pointer-events-none absolute inset-x-0 top-0 w-full" />
    </section>
  );
}
