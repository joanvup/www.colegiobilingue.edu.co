import { MessageCircle } from "lucide-react";
import { useLanguage } from "../i18n";

export default function WhatsAppButton() {
  const { language } = useLanguage();

  const phoneNumber = "573114129884";
  const text = language === "EN"
    ? "Hello! I am interested in admission information for the Fundación Colegio Bilingüe de Valledupar."
    : "¡Hola! Estoy interesado en recibir información sobre admisiones para la Fundación Colegio Bilingüe de Valledupar.";

  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      id="floating-whatsapp-btn"
      className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl transition-all duration-300 group hover:scale-110 flex items-center justify-center border border-emerald-400/20"
      aria-label="Contact support on WhatsApp"
    >
      <div className="relative">
        {/* Radar pulsing rings */}
        <span className="absolute inset-0 w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping -z-10" />
        <MessageCircle className="w-6 h-6 fill-white stroke-[#25D366] group-hover:rotate-6 transition-transform" />
      </div>
      {/* Mini hover text label */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pl-2 transition-all duration-300 font-sans text-xs font-semibold tracking-wider whitespace-nowrap">
        {language === "EN" ? "Chat with Admissions" : "Admisiones WhatsApp"}
      </span>
    </a>
  );
}
