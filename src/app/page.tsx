import Footer from "@/components/Footer";
import GetFamiliar from "@/components/landing/GetFamiliar";
import Hero from "@/components/landing/Hero";
import WhyTermina from "@/components/landing/WhyTermina";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <WhyTermina/>
      <GetFamiliar/>
      <Footer/>
    </>
  );
}
