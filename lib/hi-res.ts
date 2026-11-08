/**
 * Screens that get the 4K films: a sharp laptop or desktop (lg and up at 1.5× or more), or any
 * screen over 2200 px wide. Phones, tablets and 1× laptops keep the 1080p files, which is all they can show.
 */
export const HI_RES = "(min-width: 1024px) and (min-resolution: 1.5dppx), (min-width: 2200px)";
/** A film's 4K cuts, smallest first: the browser plays the first it can decode (AV1, then HEVC, then H.264). */
export const film4k = (base: string) => [
  { src: `${base}-4k-av1.mp4`, type: 'video/mp4; codecs="av01.0.12M.08"' },
  { src: `${base}-4k-hevc.mp4`, type: 'video/mp4; codecs="hvc1.1.6.L150.90"' },
  { src: `${base}-4k.mp4`, type: "video/mp4" },
];
