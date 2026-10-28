import PinnedTrack from "@/components/sections/PinnedTrack";
import RevealText from "@/components/reveal/RevealText";
import { waterTrack as W } from "@/lib/sustainability";

/* eslint-disable @next/next/no-img-element */

function Panel({ photo, title, features, from }: { photo: string; title: string[]; features: string[][]; from: "top" | "bottom" }) {
  return (
    // phones (below sm) stack the card the way Solène's phone cards do: the photo, nearly whole (4:5) and clear of
    // copy but for the title, which sits on a fade into the Deep Sea panel that carries the three features
    <div className="relative h-[80vh] overflow-hidden rounded-3xl max-sm:grid max-sm:h-auto max-sm:bg-deepsea-500 lg:h-[760px] lg:w-[1392px] lg:flex-none">
      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover max-sm:relative max-sm:col-start-1 max-sm:row-start-1 max-sm:aspect-[4/5] max-sm:h-auto" />
      <div className={`absolute inset-0 ${from === "top" ? "bg-gradient-to-t" : "bg-gradient-to-b"} from-deepsea-500/60 to-transparent max-sm:hidden`} />
      {/* tablets (sm to lg) keep the copy over the photo: a deeper shade behind it keeps it legible */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-deepsea-950/80 via-deepsea-950/45 to-transparent max-sm:hidden lg:hidden" />
      <div className="absolute inset-x-6 bottom-6 flex flex-col gap-6 text-limestone-50 max-sm:contents lg:inset-x-12 lg:bottom-12 lg:flex-row lg:items-end lg:justify-between">
        <h3 className="t-heading hd-40 max-sm:relative max-sm:col-start-1 max-sm:row-start-1 max-sm:self-end max-sm:bg-gradient-to-t max-sm:from-deepsea-500 max-sm:via-deepsea-500/70 max-sm:to-transparent max-sm:px-6 max-sm:pb-2 max-sm:pt-24 lg:w-[439px]">{title.map((l) => <span key={l} className="block">{l}</span>)}</h3>
        <div className="grid gap-6 max-sm:row-start-2 max-sm:px-6 max-sm:pb-7 max-sm:pt-4 sm:grid-cols-3 lg:w-[800px] lg:gap-[30px]">
          {features.map(([h, b]) => <div key={h} className="flex flex-col gap-3"><span className="t-label hd-24">{h}</span><span className="t-body b-16">{b}</span></div>)}
        </div>
      </div>
    </div>
  );
}

/**
 * Water strategy (Figma 11134:15173): four 1392 × 760 px panels on terracotta that scroll sideways while the section is
 * pinned. On screens taller than 1000 px the track takes the whole screen, so the panels sit in its middle with the
 * terracotta above and below them (not all of it under them); up to 1000 px it keeps the 920 px cap.
 */
export default function WaterTrack() {
  const s1 = W.statement1, s2 = W.statement2;
  return (
    <PinnedTrack className="bg-terracotta-500 text-limestone-50" trackClassName="gap-6 py-20 lg:h-screen lg:max-h-[920px] lg:[@media(min-height:1000px)]:max-h-none">
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center lg:h-[760px] lg:w-[1392px] lg:flex-none">
        <span className="t-label l-16">{s1.tag}</span>
        <p className="max-w-[1100px] t-heading hd-56l">{s1.text} <span className="text-deepsea-200">{s1.accent}</span></p>
      </div>
      <Panel photo={W.living.photo} title={W.living.title} features={W.living.features} from="top" />
      {/* the second statement stands on the terracotta alone (the cut-out glasses were removed, client edit 28 Oct) */}
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center lg:h-[760px] lg:w-[1392px] lg:flex-none lg:py-24">
        <p className="max-w-[1100px] t-heading hd-56l">{s2.text} <span className="text-deepsea-200">{s2.accent}</span></p>
        <RevealText text={s2.body} className="t-body b-18 max-w-[720px]" />
      </div>
      <Panel photo={W.systems.photo} title={W.systems.title} features={W.systems.features} from="bottom" />
    </PinnedTrack>
  );
}
