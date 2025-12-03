import { Header } from "@/components/arab-cup/Header";
import { SearchSection } from "@/components/arab-cup/SearchSection";
import { EventCard } from "@/components/arab-cup/EventCard";
import { Partners } from "@/components/arab-cup/Partners";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans pb-10">
      <Header />
      <SearchSection />
      <EventCard />
      <Partners />
    </div>
  );
}
