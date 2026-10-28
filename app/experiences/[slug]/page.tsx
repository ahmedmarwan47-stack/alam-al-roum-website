import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import SingleHero from "@/components/sections/SingleHero";
import Overview from "@/components/sections/Overview";
import Landmarks from "@/components/sections/Landmarks";
import HotelsList from "@/components/sections/HotelsList";
import Gallery from "@/components/sections/Gallery";
import EventsHere from "@/components/sections/EventsHere";
import ExperienceTrack from "@/components/sections/ExperienceTrack";
import ExperienceCommunity from "@/components/experience/ExperienceCommunity";
import ExperienceWeek from "@/components/experience/ExperienceWeek";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import { experienceDetails } from "@/lib/experience-detail";
import { experienceCommunity } from "@/lib/experience-community";

export const dynamicParams = false;
export const generateStaticParams = () => experienceDetails.map((x) => ({ slug: x.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = experienceDetails.find((e) => e.slug === slug);
  return { title: x ? `${x.hero.name} — Alam Al Roum` : "Alam Al Roum" };
}

/**
 * Experience detail: one template for all nine experiences, every section a shared component (a change to one applies
 * on every experience page): hero, overview, what's here (Landmarks), the community, life in the community, gallery,
 * events, the other experiences, CTA. Hotels adds its hotel directory (list + drawer) after what's here.
 */
export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = experienceDetails.find((e) => e.slug === slug);
  if (!x) notFound();
  const c = experienceCommunity[slug];
  return (
    <main>
      <Navbar />
      <SingleHero data={x.hero} />
      <Overview data={{ ...x.overview, ...c.overview }} />
      <Landmarks data={x.highlights} />
      {x.hotels && <HotelsList data={x.hotels} />}
      <ExperienceCommunity data={c.community} />
      <ExperienceWeek data={c.week} />
      <Gallery data={x.gallery} />
      <EventsHere data={x.events} />
      <ExperienceTrack slider />
      <Cta />
      <Footer />
    </main>
  );
}
