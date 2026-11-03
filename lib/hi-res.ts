/**
 * Screens that show a 4K film or frame sequence: a sharp laptop or desktop (lg and up at 1.5× or more), or any
 * screen over 2200 px wide. Phones, tablets and 1× laptops keep the 1080p files, which is all they can show.
 */
export const HI_RES = "(min-width: 1024px) and (min-resolution: 1.5dppx), (min-width: 2200px)";
export const hiRes = () => typeof window !== "undefined" && window.matchMedia(HI_RES).matches;
