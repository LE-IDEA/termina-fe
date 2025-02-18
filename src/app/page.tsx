import ActionWrapper from "@/components/app-components/ActionWrapper";
import Footer from "@/components/Footer";
import GetFamiliar from "@/components/landing/GetFamiliar";
import Hero from "@/components/landing/Hero";
import WhyTermina from "@/components/landing/WhyTermina";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      {/* <div className="px-6 "> */}
      <div className="min-h-screen bg-gradient-to-t from-[rgba(130,165,253,0.27)] via-[rgba(130,151,253,0.05)] to-[rgba(168,130,253,0)]">
      <ActionWrapper/>
      </div>
      <Footer />
    </>
  );
}
