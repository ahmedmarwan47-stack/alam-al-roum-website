import PinnedTrack from "@/components/sections/PinnedTrack";
import RevealText from "@/components/reveal/RevealText";
import FramedPhoto from "./FramedPhoto";
import { history as H } from "@/lib/destination";

/* eslint-disable @next/next/no-img-element */

/** The history coastline (Figma 11134:16026, 1218 × 273): stops on the drawn shore, labels above or below. */
function HistoryLine() {
  const L = H.line, W = 1218, Ht = 273;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  return (
    <div className="relative w-full max-w-[1218px]" style={{ aspectRatio: `${W} / ${Ht}` }}>
      <img src={L.svg} alt="" className="absolute left-0 w-full" style={{ top: pct(77.5, Ht), height: pct(113.7, Ht) }} />
      {L.stops.map((s) => (
        <div key={s.date}>
          <img src={L.stop} alt="" className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2" style={{ left: pct(s.x, W), top: pct(s.y, Ht) }} />
          <div className="absolute flex w-[170px] -translate-x-1/2 flex-col items-center gap-1 text-center" style={{ left: pct(s.x, W), top: pct(s.ly, Ht) }}>
            <span className="t-label l-12 uppercase">{s.date}</span>
            <span className="t-text x-12 text-limestone-800">{s.text}</span>
          </div>
        </div>))}
      <img src={L.mark} alt="" className="absolute h-14 w-14 -translate-x-1/2" style={{ left: pct(L.today.x, W), top: pct(64, Ht) }} />
      <img src={L.todayDot} alt="" className="absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2" style={{ left: pct(L.today.x, W), top: pct(L.today.y, Ht) }} />
      <div className="absolute flex -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap text-center" style={{ left: pct(L.today.x, W), top: pct(168, Ht) }}>
        <span className="t-label l-12 uppercase">{L.today.date}</span><span className="t-text x-12 text-limestone-800">{L.today.text}</span>
      </div>
    </div>
  );
}

/**
 * Lighthouse · history (Figma 11134:16011): 80 px above and below, three 1392 px panels in a row (844 tall, or
 * the viewport less the padding); the section pins and the
 * row slides left with the scroll (desktop). Panels: Since the Romans, the coast line, the terracotta frame.
 */
export default function HistoryTrack() {
  return (
    <PinnedTrack className="bg-limestone-50 text-deepsea-900" trackClassName="gap-24 py-20 lg:h-svh lg:max-h-[1000px] lg:gap-[94px]">
        {/* 1 · Since the Romans */}
        <div className="relative flex flex-col gap-8 lg:h-[min(844px,calc(100svh-160px))] lg:w-[1392px] lg:flex-row lg:items-end lg:gap-[30px]">
          <div className="relative h-[70vh] flex-1 lg:h-full">
            <img src={H.romans.photo} alt="A Roman mosaic of a ship" className="absolute left-[16%] top-0 h-full w-[68%] object-cover lg:left-[419px] lg:w-[622px]" />
            <h2 className="absolute left-0 top-1/2 flex w-[60%] -translate-y-1/2 flex-col gap-[7px] t-body text-right uppercase leading-none [font-size:clamp(56px,7.9vw,120px)] lg:w-[552px]">
              <span>{H.romans.title[0]}</span><span>{H.romans.title[1]}</span><span className="text-center">{H.romans.title[2]}</span>
            </h2>
          </div>
          <div className="flex max-w-[360px] flex-col gap-3 t-body">
            <RevealText text={H.romans.side.title} className="text-[36px] leading-none" />
            <RevealText text={H.romans.side.body} className="text-[20px] leading-[1.5]" delay={0.08} />
          </div>
          <img src={H.romans.flower} alt="" className="pointer-events-none absolute -bottom-20 left-[calc(var(--gutter)*-1)] w-[344px] max-w-[60vw]" />
        </div>
        {/* 2 · The coast that guided the Romans */}
        <div className="flex flex-col items-center gap-10 lg:h-[min(844px,calc(100svh-160px))] lg:w-[1392px]">
          <h2 className="max-w-[842px] text-center t-body uppercase leading-none [font-size:clamp(36px,4vw,60px)]">{H.coast.title}</h2>
          <img src={H.coast.photo} alt="The North Coast shoreline" className="aspect-square w-full max-w-[420px] min-h-0 flex-1 object-cover lg:w-auto lg:max-w-none" />
          <div className="hidden w-full justify-center lg:flex"><HistoryLine /></div>
          <ol className="flex w-full flex-col border-l border-deepsea-500 pl-5 lg:hidden">
            {[...H.line.stops, H.line.today].map((s) => (
              <li key={s.date} className="relative flex flex-col gap-1 py-3">
                <i className="absolute -left-[24px] top-[18px] h-[7px] w-[7px] rounded-full bg-deepsea-500" />
                <span className="t-label l-12 uppercase">{s.date}</span><span className="t-text x-12 text-limestone-800">{s.text}</span>
              </li>))}
          </ol>
          <p className="t-text x-12 text-limestone-800">{H.line.caption}</p>
        </div>
        {/* 3 · Terracotta frame (with its ERA entrance) */}
        <FramedPhoto photo={H.photo} flower={H.romans.flower} />
    </PinnedTrack>
  );
}
