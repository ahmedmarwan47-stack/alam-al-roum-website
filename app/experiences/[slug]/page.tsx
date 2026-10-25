import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import SingleHero from "@/components/sections/SingleHero";
import Overview from "@/components/sections/Overview";
import Landmarks from "@/components/sections/Landmarks";
import HotelsList from "@/components/sections/HotelsList";
import Gallery from "@/components/sections/Gallery";
import EventsHere from "@/components/sections/EventsHere";
import ExperienceTrack from "@/components/sections/ExperienceTrack";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { experienceDetails } from "@/lib/experience-detail";

export const dynamicParams = false;
export const generateStaticParams = () => experienceDetails.map((x) => ({ slug: x.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = experienceDetails.find((e) => e.slug === slug);
  return { title: x ? `${x.hero.name} — Alam Al Roum` : "Alam Al Roum" };
}

/** Experience detail, in the order of the Figma template frames (Marina 10921:10415, Hotels 10921:10489). */
export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = experienceDetails.find((e) => e.slug === slug);
  if (!x) notFound();
  return (
    <main>
      <Navbar />
      <SingleHero data={x.hero} />
      <Overview data={x.overview} />
      {x.highlights && <Landmarks data={x.highlights} />}
      {x.hotels && <HotelsList data={x.hotels} />}
      <Gallery data={x.gallery} />
      {x.events && <EventsHere data={x.events} />}
      <ExperienceTrack exclude={x.slug} />
      <Cta />
      <Footer />
    </main>
  );
}
