import type { NextConfig } from "next";

/**
 * GitHub Pages build (GITHUB_PAGES=true, see .github/workflows/pages.yml): a static export served from
 * /alam-al-roum-website/. Links and Next's own files pick the base path up; asset paths written as plain strings
 * (/images, /video, …) are prefixed after the export by scripts/prefix-assets.mjs. Dev and normal builds are unchanged.
 */
const pages = process.env.GITHUB_PAGES === "true";
export const basePath = pages ? "/alam-al-roum-website" : "";

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(pages && { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }),
};

export default nextConfig;
