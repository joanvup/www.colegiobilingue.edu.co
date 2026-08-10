import { useLanguage } from "../i18n";
import { Award, Shield, FileCheck, MapPin } from "lucide-react";

interface FooterProps {
  onNavigate: (sectionId: string, subTab?: string) => void;
  onOpenAdmin?: () => void;
}

export default function Footer({ onNavigate, onOpenAdmin }: FooterProps) {
  const { language, t } = useLanguage();

  const links = [
    { label: t("nav.home"), target: "home" },
    { label: t("nav.aboutUs"), target: "about-us" },
    { label: t("nav.theSchool"), target: "the-school" },
    { label: t("nav.calendar"), target: "calendar" },
    { label: t("nav.admissions"), target: "admissions" },
    { label: t("nav.contact"), target: "contact" },
  ];

  // Keep track of sequential clicks to open the hidden admin panel (5 clicks required)
  let clickCount = 0;
  let clickTimeout: NodeJS.Timeout;

  const handleSecretLogoClick = () => {
    clickCount++;
    if (clickCount >= 5) {
      if (onOpenAdmin) onOpenAdmin();
      clickCount = 0;
    }
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      clickCount = 0;
    }, 1500); // Reset clicks if not sequential within 1.5s
  };

  return (
    <footer id="app-footer" className="bg-[#1B3A6B] text-slate-200 border-t-4 border-[#C9A961] py-16 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Information Column */}
        <div className="md:col-span-5 space-y-6 text-left">
          <button
            onClick={() => {
              onNavigate("home");
              handleSecretLogoClick();
            }}
            id="footer-logo-btn"
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img
                src="/src/assets/images/Logo_FCBV.svg"
                alt="Logo Colegio Bilingüe de Valledupar"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-sm font-bold text-white group-hover:text-[#C9A961] transition-colors duration-200">
                Fundación Colegio Bilingüe de Valledupar
              </span>
              <span className="font-cinzel text-[10px] tracking-wider text-[#C9A961] font-semibold mt-0.5">
                Founded 1980
              </span>
            </div>
          </button>
          <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed max-w-sm">
            {language === "EN"
              ? "Dedicated to the formation of bilingual citizens with high ethical principles and social commitment for over four decades."
              : "Dedicados a la formación de ciudadanos bilingües de sólidos principios éticos y compromiso social por más de cuatro décadas."}
          </p>
          <div className="flex flex-wrap gap-6 items-center pt-2">
            <div className="flex items-center h-24">
              <img
                src="/src/assets/images/Cognia-300x300.png"
                alt="Cognia Accredited"
                className="h-full w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <a
              href="/src/assets/documents/certificado_icontec.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center h-24 hover:opacity-80 transition-opacity cursor-pointer"
              title="Ver Certificado Icontec ISO 9001"
            >
              <img
                src="/src/assets/images/logo-icontec.png"
                alt="Icontec Certified"
                className="h-full w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h5 className="font-serif text-sm font-bold text-white uppercase tracking-widest">
            {t("footer.quickLinks")}
          </h5>
          <ul className="space-y-2">
            {links.map((link, i) => (
              <li key={i}>
                <button
                  onClick={() => onNavigate(link.target)}
                  className="text-xs md:text-sm text-slate-200 hover:text-[#C9A961] transition-colors cursor-pointer text-left focus:outline-none"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h5 className="font-serif text-sm font-bold text-white uppercase tracking-widest">
            {language === "EN" ? "Inquiries & Registry" : "Contacto y Registro"}
          </h5>
          <p className="text-xs text-slate-200 font-light leading-relaxed">
            {language === "EN"
              ? "For admissions, scheduling campus tours, or administrative requests, contact us:"
              : "Para admisiones, programación de recorridos, o solicitudes administrativas:"}
          </p>
          <div className="space-y-2 text-xs font-mono text-slate-200">
            <div className="flex items-start gap-2 text-slate-200">
              <MapPin className="w-4 h-4 text-[#C9A961] shrink-0 mt-0.5" />
              <span className="font-sans leading-tight">{t("contact.address")}</span>
            </div>
            <div>Cel: +57 311 412 9884</div>
            <div>Email: contactenos@colegiobilingue.edu.co</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
        <span className="text-slate-300">{t("footer.rights")}</span>
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-300">
          <span className="font-serif tracking-wide italic">
            {t("footer.designed")}
          </span>
        </div>
      </div>
    </footer>
  );
}
