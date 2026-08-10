import { useState, useEffect } from "react";
import { useLanguage } from "../i18n";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink } from "lucide-react";

export default function FloatingAccessButtons() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide buttons when scrolled down, show when at the very top (scrollY < 20)
      setIsVisible(window.scrollY < 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const buttons = [
    {
      id: "phidias",
      img: "/src/assets/images/phidias-logo.png",
      url: "https://colegiobilingue.phidias.co/",
      labelES: "Plataforma Phidias",
      labelEN: "Phidias Platform",
      bg: "bg-transparent",
      borderColor: "border-transparent",
    },
    {
      id: "cafeteria",
      img: "/src/assets/images/logo-recargas-cafeteria.png",
      url: "https://www.abcpagos.com/realpos/login",
      labelES: "Recargas Cafetería",
      labelEN: "Cafeteria Recharges",
      bg: "bg-transparent",
      borderColor: "border-transparent",
    },
    {
      id: "davibank",
      img: "/src/assets/images/logo-davibank.png",
      url: "https://www.psecomercio.scotiabankcolpatria.com/payment/10020",
      labelES: "Pagos Davibank / PSE",
      labelEN: "Davibank / PSE Payments",
      bg: "bg-transparent",
      borderColor: "border-transparent",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed right-4 md:right-6 top-[115px] md:top-1/2 md:-translate-y-1/2 z-50 flex flex-col gap-3 md:gap-4 pointer-events-auto"
          id="floating-access-container"
        >
          {buttons.map((btn, index) => {
            const label = language === "ES" ? btn.labelES : btn.labelEN;
            const isFullCircle = btn.id === "phidias" || btn.id === "cafeteria" || btn.id === "davibank";
            return (
              <motion.a
                key={btn.id}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`group relative w-11 h-11 md:w-16 md:h-16 ${btn.bg} rounded-full shadow-lg ${isFullCircle ? 'border-0' : `border ${btn.borderColor}`} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 overflow-hidden`}
                title={label}
                id={`floating-btn-${btn.id}`}
              >
                {/* Image centered and enmasked as a circle with zero borders and zero padding */}
                <div className={`w-full h-full rounded-full overflow-hidden ${isFullCircle ? 'p-0' : 'p-1'} bg-white flex items-center justify-center`}>
                  <img
                    src={btn.img}
                    alt={label}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full ${isFullCircle ? 'object-cover' : 'object-contain'} rounded-full transition-transform duration-300 group-hover:scale-105`}
                  />
                </div>

                {/* Floating tooltip label that slides left on hover */}
                <span className="absolute right-[115%] top-1/2 -translate-y-1/2 bg-[#1B3A6B] text-white text-[11px] font-sans font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300 flex items-center gap-1.5 border border-[#C9A961]/20">
                  <span>{label}</span>
                  <ExternalLink className="w-3 h-3 text-[#C9A961]" />
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
