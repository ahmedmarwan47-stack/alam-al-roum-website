import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import ScrollStory from "@/components/sections/ScrollStory";
import Communities from "@/components/sections/Communities";
import Masterplan from "@/components/sections/Masterplan";
import WaysToLive from "@/components/sections/WaysToLive";
import Connectivity from "@/components/sections/Connectivity";
import QatariDiarNumbers from "@/components/sections/QatariDiarNumbers";
import Landmarks from "@/components/sections/Landmarks";
import Events from "@/components/sections/Events";
import Gallery from "@/components/sections/Gallery";
import News from "@/components/sections/News";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ScrollStory />
      <Communities />
      <Masterplan />
      <WaysToLive />
      <Connectivity />
      <QatariDiarNumbers />
      <Landmarks />
      <Events />
      <Gallery />
      <News />
      <Faq />
      <Cta />
      <Footer video />
    </main>
  );
}
