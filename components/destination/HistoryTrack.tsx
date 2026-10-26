import PinnedTrack from "@/components/sections/PinnedTrack";
import RevealText from "@/components/reveal/RevealText";
import FramedPhoto from "./FramedPhoto";
import CoastHistory from "./CoastHistory";
import { readFileSync } from "node:fs";
import path from "node:path";

import { history as H } from "@/lib/destination";

/** The coastline drawing's path, read from the Figma export so the client can draw it stroke by stroke. */
const coastPath = readFileSync(path.join(process.cwd(), "public", H.line.svg), "utf8").match(/ d="([^"]+)"/)![1];

/* eslint-disable @next/next/no-img-element */

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
        {/* 2 · The coast that guided the Romans: the line draws itself, the 3D coin turns */}
        <CoastHistory path={coastPath} />
        {/* 3 · Terracotta frame (with its ERA entrance) */}
        <FramedPhoto photo={H.photo} flower={H.romans.flower} />
    </PinnedTrack>
  );
}
