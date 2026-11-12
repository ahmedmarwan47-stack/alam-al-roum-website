import PinnedTrack from "@/components/sections/PinnedTrack";
import FramedPhoto from "./FramedPhoto";
import CoastHistory from "./CoastHistory";
import RomansIntro from "./RomansIntro";
import { readFileSync } from "node:fs";
import path from "node:path";

import { history as H } from "@/lib/destination";

/** The coastline drawing's path, read from the Figma export so the client can draw it stroke by stroke. */
const coastPath = readFileSync(path.join(process.cwd(), "public", H.line.svg), "utf8").match(/ d="([^"]+)"/)![1];


/**
 * Lighthouse · history (Figma 11134:16011): 80 px above and below, three 1392 px panels in a row (844 tall, or
 * the viewport less the padding), centred in the pinned screen (on a tall screen the space falls above and below
 * them, not all under them); the section pins and the
 * row slides left with the scroll (desktop). Panels: Since the Romans, the coast line, the terracotta frame.
 */
export default function HistoryTrack() {
  return (
    <PinnedTrack className="bg-limestone-50 text-deepsea-900" trackClassName="gap-24 py-20 lg:h-svh lg:gap-[94px]">
        {/* 1 · Since the Romans: the mosaic rises in, the title writes in, the flower grows and sways */}
        <RomansIntro />
        {/* 2 · The coast that guided the Romans: the line draws itself, the 3D coin turns */}
        <CoastHistory path={coastPath} />
        {/* 3 · Terracotta frame (with its ERA entrance) */}
        <FramedPhoto photo={H.photo} />
    </PinnedTrack>
  );
}
