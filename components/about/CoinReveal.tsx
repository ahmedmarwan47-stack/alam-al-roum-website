import { existsSync } from "node:fs";
import path from "node:path";
import CoinStage from "@/lib/about/a-coin-stage";
import { coin as C } from "@/lib/about/a-content";

/** Landmark Reveal. Server side so the film's poster is only referenced once the still exists in public/. */
export default function CoinReveal() {
  const poster = existsSync(path.join(process.cwd(), "public", C.poster)) ? C.poster : undefined;
  return <CoinStage poster={poster} />;
}
