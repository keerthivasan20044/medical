import Hero from '../../components/home/Hero';
import { StatsCounter, Categories } from '../../components/home/HomeSectionsA';
import { FeaturedMedicines, KaraikalPharmacies } from '../../components/home/HomeSectionsB';
import { 
  VaccineShowcase, 
  HowItWorks, 
  DoctorsConsultation, 
  GPSTracking, 
  PrescriptionUpload, 
  Testimonials, 
  Features, 
  LogoStrip, 
  BlogPreview, 
  AppDownload, 
  EmergencyBanner,
  DistrictBackdrop
} from '../../components/home/HomeSectionsC';
import LiveActivityPulse from '../../components/home/LiveActivityPulse';
import DistrictMapArchitecture from '../../components/home/DistrictMapArchitecture';
import PrescriptionScannerPreview from '../../components/home/PrescriptionScannerPreview';
import { motion, useScroll, useSpring } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation.js';
import SEO from '../../components/common/SEO';

export default function Landing() {
  useScrollAnimation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="w-full min-h-screen overflow-x-hidden pb-20 md:pb-0">
      <SEO 
        title="Home" 
        description="Karaikal's first unified healthcare platform. Order medicines, consult doctors, and track deliveries in real-time."
        schema={{
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": "MediPharm Karaikal",
          "alternateName": "MediReach",
          "url": "https://medipharm-karaikal.in",
          "logo": "https://medipharm-karaikal.in/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-94432-12345",
            "contactType": "emergency",
            "areaServed": "Karaikal"
          }
        }}
      />
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-20 left-0 right-0 h-1 bg-gradient-to-r from-[#02C39A] to-[#028090] origin-left z-[100]" 
        style={{ scaleX }}
      />

      {/* Sections 1-16 in order */}
      {/* Hero & Vital Services */}
      <Hero />
      <LiveActivityPulse />
      <EmergencyBanner />
      <Categories />
      <HowItWorks />
      <StatsCounter />
      <FeaturedMedicines />
      <KaraikalPharmacies />
      <GPSTracking />
      <DistrictMapArchitecture />
      <PrescriptionScannerPreview />
      <PrescriptionUpload />
      <DoctorsConsultation />
      <VaccineShowcase />
      <Testimonials />
      <DistrictBackdrop />
      <AppDownload />
      <BlogPreview />
      <LogoStrip />

      {/* Ticker - fixed just above bottom nav */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#080c18] border-t border-teal-900/40 py-1.5 px-4 flex md:hidden items-center gap-3">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-teal-400 text-[10px] font-black tracking-wider">LIVE</span>
        </div>
        <div className="overflow-x-auto flex gap-5 no-scrollbar">
          <span className="text-gray-400 text-[10px] whitespace-nowrap">Platform Updated</span>
          <span className="text-gray-500 text-[10px]">•</span>
          <span className="text-gray-400 text-[10px] whitespace-nowrap">Dispatch Active</span>
          <span className="text-gray-500 text-[10px]">•</span>
          <span className="text-gray-400 text-[10px] whitespace-nowrap">12 Pharmacies Online</span>
        </div>
      </div>
    </div>
  );
}
