import Hero from '../../components/home/Hero.jsx';
import { StatsCounter, Categories } from '../../components/home/HomeSectionsA.jsx';
import { FeaturedMedicines, KaraikalPharmacies } from '../../components/home/HomeSectionsB.jsx';
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
} from '../../components/home/HomeSectionsC.jsx';
import LiveActivityPulse from '../../components/home/LiveActivityPulse.jsx';
import DistrictMapArchitecture from '../../components/home/DistrictMapArchitecture.jsx';
import PrescriptionScannerPreview from '../../components/home/PrescriptionScannerPreview.jsx';
import { motion, useScroll, useSpring } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation.js';
import SEO from '../../components/common/SEO.jsx';

export default function Landing() {
  useScrollAnimation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative overflow-x-hidden flex flex-col min-h-screen">
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

      {/* Back to Top */}
      <motion.button
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
         className="fixed bottom-48 right-6 md:bottom-8 md:right-8 h-14 w-14 bg-[#0a1628] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-[#028090] transition-all z-50 focus:outline-none"
      >
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6" />
         </svg>
      </motion.button>
    </div>
  );
}
