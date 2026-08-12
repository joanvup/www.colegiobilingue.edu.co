/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Language, LanguageContext, translations } from "./i18n";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import School from "./components/School";
import CalendarSection from "./components/CalendarSection";
import Admissions from "./components/Admissions";
import Contact from "./components/Contact";
import WhatsAppButton from "./components/WhatsAppButton";
import Chatbot from "./components/Chatbot";
import FloatingAccessButtons from "./components/FloatingAccessButtons";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import GalleryModal from "./components/GalleryModal";

export default function App() {
  // Try to determine initial language from URL or browser preference
  const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get("lang")?.toUpperCase();
      if (langParam === "ES" || langParam === "EN") {
        return langParam as Language;
      }
    }
    return "EN"; // Force English by default as requested
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage());
  
  // Custom setLanguage wrapper to update state and browser URL query parameter
  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("lang", newLang.toLowerCase());
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

  const [activeSection, setActiveSection] = useState("home");
  const [subTab, setSubTab] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Branded animation duration (simulated network lag for smooth UX feel)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    const handleLoad = () => {
      // Ensure the user sees the luxury animation for at least a short beat to keep it polished
      setTimeout(() => setIsLoading(false), 900);
    };

    if (document.readyState === "complete") {
      // already complete
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Translation helper function
  const t = (key: string) => {
    const keys = key.split(".");
    let current: any = translations[language];
    for (const k of keys) {
      if (current[k] === undefined) {
        return key; // Fallback to raw key if not found
      }
      current = current[k];
    }
    return current;
  };

  // Smooth scroll and active tab orchestration
  const handleNavigate = (sectionId: string, requestedSubTab?: string) => {
    if (requestedSubTab === "gallery") {
      setIsGalleryOpen(true);
      return;
    }

    setSubTab(requestedSubTab);
    setActiveSection(sectionId);

    // Use a small timeout to let the DOM settle (especially on mobile when closing the menu and changing active subtabs)
    setTimeout(() => {
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -80; // Compensate for sticky header
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }, 150); // 150ms is perfect: it allows mobile menu closing transitions and sub-tab layout shifts to stabilize
  };

  // Scrollspy to detect currently visible screen section
  useEffect(() => {
    const sections = ["home", "about-us", "the-school", "calendar", "admissions", "contact"];
    
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180; // Add margin for header trigger
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const topOffset = el.offsetTop;
          const sectionHeight = el.offsetHeight;
          
          if (scrollPosition >= topOffset && scrollPosition < topOffset + sectionHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Secret backdoor keyboard shortcut: Ctrl+Shift+A (or Cmd+Shift+A) to open Admin Portal
    const handleAdminBackdoor = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    window.addEventListener("keydown", handleAdminBackdoor);
    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
      window.removeEventListener("keydown", handleAdminBackdoor);
    };
  }, []);

  // Dynamic SEO definitions based on active section and language
  const getSeoData = () => {
    if (language === "EN") {
      switch (activeSection) {
        case "about-us":
          return {
            title: "About Us | Fundación Colegio Bilingüe de Valledupar",
            description: "Discover our history, mission, vision, quality policies, and the profile of our exceptional teachers and students."
          };
        case "the-school":
          return {
            title: "The School | Academic Programs & Symbols",
            description: "Explore our academic levels (Preschool, Primary, High School), institutional symbols, anthem, and student handbook."
          };
        case "calendar":
          return {
            title: "Activities Calendar | Colegio Bilingüe",
            description: "Stay up to date with our bilingual school activities calendar, events, and important dates."
          };
        case "admissions":
          return {
            title: "Admissions 2026-2027 | Join Our School",
            description: "Apply now for the 2026-2027 academic year. Learn about our bilingual admissions process, requirements, and steps."
          };
        case "contact":
          return {
            title: "Contact Us | Location & Support",
            description: "Get in touch with Fundación Colegio Bilingüe de Valledupar. Find our location, phone, email, and dynamic contact form."
          };
        case "home":
        default:
          return {
            title: "Home | Fundación Colegio Bilingüe de Valledupar",
            description: "Forming bilingual global leaders with solid ethical principles since 1980. Bilingual education of high quality in Valledupar."
          };
      }
    } else {
      switch (activeSection) {
        case "about-us":
          return {
            title: "Nosotros | Fundación Colegio Bilingüe de Valledupar",
            description: "Descubre nuestra historia, misión, visión, política de calidad y el perfil de nuestros docentes y estudiantes."
          };
        case "the-school":
          return {
            title: "El Colegio | Programas Académicos y Símbolos",
            description: "Explora nuestros niveles académicos (Preescolar, Primaria, Bachillerato), símbolos institucionales, himno y manual de convivencia."
          };
        case "calendar":
          return {
            title: "Calendario de Actividades | Colegio Bilingüe",
            description: "Mantente al día con nuestro calendario de actividades escolares, eventos y fechas importantes."
          };
        case "admissions":
          return {
            title: "Admisiones 2026-2027 | Únete a Nuestro Colegio",
            description: "Inicia tu proceso de postulación para el año académico 2026-2027. Conoce los pasos, requisitos y agenda tu visita."
          };
        case "contact":
          return {
            title: "Contacto | Ubicación y Soporte",
            description: "Ponte en contacto con la Fundación Colegio Bilingüe de Valledupar. Encuentra nuestra dirección, teléfono, correo y formulario de contacto."
          };
        case "home":
        default:
          return {
            title: "Inicio | Fundación Colegio Bilingüe de Valledupar",
            description: "Formando líderes globales bilingües con sólidos principios éticos desde 1980. Educación bilingüe de alta calidad en Valledupar."
          };
      }
    }
  };

  const seo = getSeoData();

  return (
    <HelmetProvider>
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <Helmet>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
          <meta property="og:title" content={seo.title} />
          <meta property="og:description" content={seo.description} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.title} />
          <meta name="twitter:description" content={seo.description} />
        </Helmet>

        {/* Elegant Branded Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              id="branded-splash-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
              className="fixed inset-0 bg-[#1B3A6B] z-[99999] flex flex-col items-center justify-center p-6 select-none"
            >
              {/* Luxury Gold/Navy glowing ambient radial background */}
              <div id="splash-glow" className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,97,0.1)_0%,transparent_70%)] pointer-events-none" />
              
              <div id="splash-content-wrapper" className="relative flex flex-col items-center max-w-md w-full text-center">
                {/* School Seal Logo with Breathing/Breathing Scale & Golden Glow */}
                <motion.div
                  id="splash-logo-container"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ 
                    scale: [0.95, 1.02, 0.95],
                    opacity: 1
                  }}
                  transition={{
                    scale: {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    },
                    opacity: { duration: 0.8 }
                  }}
                  className="w-32 h-32 md:w-40 md:h-40 mb-8 flex items-center justify-center filter drop-shadow-[0_10px_25px_rgba(201,169,97,0.25)]"
                >
                  <img
                    src="/src/assets/images/Logo_FCBV.svg"
                    alt="Colegio Bilingüe Logo"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Majestic Display Title */}
                <motion.h1
                  id="splash-title"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-cinzel text-lg md:text-xl font-bold tracking-widest text-white mb-2"
                >
                  FUNDACIÓN COLEGIO BILINGÜE
                </motion.h1>
                
                <motion.p
                  id="splash-subtitle"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="font-cinzel text-xs md:text-sm tracking-[0.25em] text-[#C9A961] font-semibold uppercase mb-10"
                >
                  Valledupar • Founded 1980
                </motion.p>

                {/* Polished Golden Loading Bar Indicator */}
                <div id="splash-loader-bar-bg" className="w-48 h-[3px] bg-white/10 rounded-full overflow-hidden relative mb-4">
                  <motion.div
                    id="splash-loader-bar-fill"
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 bottom-0 w-1/2 bg-[#C9A961] rounded-full shadow-[0_0_8px_#C9A961]"
                  />
                </div>

                {/* Slogan Loading Label */}
                <motion.span
                  id="splash-loading-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-[10px] font-mono tracking-widest text-slate-300 uppercase"
                >
                  {language === "ES" ? "Iniciando experiencia bilingüe..." : "Initiating bilingual experience..."}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div id="school-landing-app" className="bg-[#F8F6F1] min-h-screen text-[#1A1A1A] selection:bg-[#C9A961] selection:text-slate-950 font-sans overflow-x-hidden antialiased">
        
        {/* Luxury Sticky Header Navigation */}
        <Header onNavigate={handleNavigate} activeSection={activeSection} />

        {/* Cinematographic Hero Cover */}
        <Hero onExplore={(secId) => handleNavigate(secId)} />

        {/* Section 1: About Us (History, Mission, Vision, Quality, Profiles) */}
        <AboutUs subTab={subTab} isActive={activeSection === "about-us"} />

        {/* Section 2: Academic Levels, Symbols, Anthem & Student Handbook */}
        <School subTab={subTab} isActive={activeSection === "the-school"} />

        {/* Section 2.5: Google Calendar synchronized Activities Calendar */}
        <CalendarSection />

        {/* Section 3: Professional Admissions Stepper & Form */}
        <Admissions />

        {/* Section 4: Contact details, Stylized Map & Social Networks */}
        <Contact />

        {/* Intelligent Institutional RAG Chatbot (Manual de Convivencia & PEI) */}
        {language === "ES" && <Chatbot />}

        {/* Persistent Floating WhatsApp Help Desk Button */}
        <WhatsAppButton />

        {/* Floating portals access buttons (Phidias, Cafeteria, Davibank) */}
        <FloatingAccessButtons />

        {/* Scroll To Top Arrow Button */}
        <ScrollToTopButton />

        {/* Certified footer */}
        <Footer onNavigate={handleNavigate} onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* Administrative settings & submissions portal */}
        <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

        {/* Dynamic Minimalist Gallery Popup */}
        <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

      </div>
    </LanguageContext.Provider>
    </HelmetProvider>
  );
}
