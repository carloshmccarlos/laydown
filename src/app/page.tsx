import HeroSection from "@/components/home/HeroSection";
import ModeSelector from "@/components/home/ModeSelector";
import IncomeTypeIntro from "@/components/home/IncomeTypeIntro";
import LivingLevelPreview from "@/components/home/LivingLevelPreview";
import FeatureGrid from "@/components/home/FeatureGrid";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ModeSelector />
      <IncomeTypeIntro />
      <LivingLevelPreview />
      <FeatureGrid />
      <CTASection />
    </div>
  );
}
