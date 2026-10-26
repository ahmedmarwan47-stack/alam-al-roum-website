import PinnedTrack from "@/components/sections/PinnedTrack";
import RevealText from "@/components/reveal/RevealText";
import { waterTrack as W } from "@/lib/sustainability";

/* eslint-disable @next/next/no-img-element */

function Panel({ photo, title, features, from }: { photo: string; title: string[]; features: string[][]; from: "top" | "bottom" }) {
  return (
    <div className="relative h-[80vh] overflow-hidden rounded-3xl lg:h-[760px] lg:w-[1392px] lg:flex-none">
      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className={`absolute inset-0 ${from === "top" ? "bg-gradient-to-t" : "bg-gradient-to-b"} from-deepsea-500/60 to-transparent`} />
      {/* below lg the copy stacks tall over the photo: a deeper shade behind it keeps it legible */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-deepsea-950/80 via-deepsea-950/45 to-transparent lg:hidden" />
      <div className="absolute inset-x-6 bottom-6 flex flex-col gap-6 text-limestone-50 lg:inset-x-12 lg:bottom-12 lg:flex-row lg:items-end lg:justify-between">
        <h3 className="t-heading hd-40 lg:w-[439px]">{title.map((l) => <span key={l} className="block">{l}</span>)}</h3>
        <div className="grid gap-6 sm:grid-cols-3 lg:w-[800px] lg:gap-[30px]">
          {features.map(([h, b]) => <div key={h} className="flex flex-col gap-3"><span className="t-label hd-24">{h}</span><span className="t-body b-16">{b}</span></div>)}
        </div>
      </div>
    </div>
  );
}

/** Water strategy (Figma 11134:15173): four 1392 px panels on terracotta that scroll sideways while the section is pinned. */
export default function WaterTrack() {
  const s1 = W.statement1, s2 = W.statement2;
  return (
    <PinnedTrack className="bg-terracotta-500 text-limestone-50" trackClassName="gap-6 py-20 lg:h-screen lg:max-h-[920px]">
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center lg:h-[760px] lg:w-[1392px] lg:flex-none">
        <span className="t-label l-16">{s1.tag}</span>
        <p className="max-w-[1100px] t-heading hd-56l">{s1.text} <span className="text-deepsea-200">{s1.accent}</span></p>
      </div>
      <Panel photo={W.living.photo} title={W.living.title} features={W.living.features} from="top" />
      <div className="relative flex flex-col items-center justify-center gap-6 py-40 text-center lg:h-[760px] lg:w-[1392px] lg:flex-none lg:py-24">
        {/* below lg the glasses sit in the panel's padding, above and below the copy */}
        <img src={s2.cups} alt="" className="pointer-events-none absolute left-0 top-0 w-[clamp(120px,19vw,293px)]" />
        <p className="relative max-w-[1100px] t-heading hd-56l">{s2.text} <span className="text-deepsea-200">{s2.accent}</span></p>
        <RevealText text={s2.body} className="relative t-body b-18 max-w-[720px]" />
        <img src={s2.martini} alt="" className="pointer-events-none absolute bottom-0 right-0 w-[clamp(96px,17vw,256px)]" />
      </div>
      <Panel photo={W.systems.photo} title={W.systems.title} features={W.systems.features} from="bottom" />
    </PinnedTrack>
  );
}
