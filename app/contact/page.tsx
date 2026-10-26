import Navbar from "@/components/sections/Navbar";
import SayHello from "@/components/contact/SayHello";
import BookCall from "@/components/contact/BookCall";
import Locations from "@/components/contact/Locations";
import Footer from "@/components/sections/Footer";

export const metadata = { title: "Contact — Alam Al Roum" };

/** Contact (Figma "Contact • Desktop"): say hello + form, booking, locations. */
export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <SayHello />
      <BookCall />
      <Locations />
      <Footer />
    </main>
  );
}
