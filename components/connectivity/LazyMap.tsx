"use client";
import dynamic from "next/dynamic";
import { BLOCK, SEA } from "./shared";

/**
 * The Connectivity map, loaded on its own: d3-geo and the country shapes (~100 KB gzipped) are fetched with this
 * chunk, not with the page. Until it arrives, the block's frame in the sea colour holds its place.
 */
const MapBlock = dynamic(() => import("./MapBlock"), {
  ssr: false,
  loading: () => <div className={BLOCK} style={{ background: SEA }}><div className="max-md:aspect-[4/5] md:max-lg:aspect-[4/3]" /></div>,
});

export default function LazyMap() {
  return <MapBlock />;
}
