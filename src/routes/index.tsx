import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { StringsBand } from "@/components/site/StringsBand";
import { Videos } from "@/components/site/Videos";
import { Teaching } from "@/components/site/Teaching";
import { BookingSection } from "@/components/site/BookingSection";
import { Footer } from "@/components/site/Footer";

const title = "Zakariae AHAJI — Cours de guitare classique et solfège";
const description =
  "Professeur diplômé d'État, double lauréat en solfège et guitare. Cours particuliers à 350 DH/heure, réservation en ligne.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <StringsBand />
      <Videos />
      <Teaching />
      <BookingSection />
      <Footer />
    </div>
  );
}
