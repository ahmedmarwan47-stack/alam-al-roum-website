import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import SingleHero from "@/components/sections/SingleHero";
import Overview from "@/components/sections/Overview";
import HotelsList from "@/components/sections/HotelsList";
import Landmarks from "@/components/sections/Landmarks";
import Gallery from "@/components/sections/Gallery";
import OtherCommunities, { CommunityOnMasterplan } from "@/components/sections/OtherCommunities";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { neighbourhoods } from "@/lib/neighbourhoods";

export const dynamicParams = false;
export const generateStaticParams = () => neighbourhoods.map((x) => ({ slug: x.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = neighbourhoods.find((e) => e.slug === slug);
  return { title: x ? `${x.hero.name} — Alam Al Roum` : "Alam Al Roum" };
}

/** Neighbourhood detail, in the order of the Figma frame "Neighbourhood Detail • Desktop" (10921:9807). */
export default async function NeighbourhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = neighbourhoods.find((e) => e.slug === slug);
  if (!x) notFound();
  return (
    <main>
      <Navbar />
      <SingleHero data={x.hero} />
      <Overview data={x.overview} />
      {x.units && <HotelsList data={x.units} />}
      <CommunityOnMasterplan slug={x.slug} title={x.masterplan.title} body={x.masterplan.body} />
      {x.facilities && <Landmarks data={x.facilities} />}
      <Gallery data={x.gallery} />
      <OtherCommunities exclude={x.slug} />
      <Cta />
      <Footer />
    </main>
  );
}
