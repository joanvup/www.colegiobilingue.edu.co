import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useLanguage } from "../i18n";
import { MapPin, Phone, Mail, Send, CheckCircle2, Copy, Check, Instagram, Youtube, HelpCircle, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // reCAPTCHA settings and verification states
  const [recaptchaConfig, setRecaptchaConfig] = useState<{ enabled: boolean; siteKey: string } | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/recaptcha-config");
        if (res.ok) {
          const data = await res.json();
          setRecaptchaConfig(data);
        }
      } catch (err) {
        console.error("Error fetching recaptcha config:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("Fundación Colegio Bilingüe, Calle 3 # 19B 105, Valledupar, Cesar, Colombia, Zip code 200005");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    if (recaptchaConfig?.enabled && !recaptchaToken) {
      alert(
        language === "EN"
          ? "Please complete the reCAPTCHA security check to prevent spam."
          : "Por favor complete el control de seguridad reCAPTCHA para evitar el spam."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: recaptchaToken || undefined
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        const data = await res.json();
        alert(
          data.error || 
          (language === "EN" ? "Failed to send message. Please try again." : "No se pudo enviar el mensaje. Por favor intente de nuevo.")
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert(language === "EN" ? "Network error. Please try again." : "Error de red. Por favor intente de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-[#F8F6F1] text-[#1A1A1A] relative border-t border-slate-200">
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1B3A6B]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-sans text-[#C9A961] text-xs uppercase tracking-widest font-bold">
            {language === "EN" ? "Connect with Us" : "Canales de Atención"}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight text-[#1B3A6B]">
            {t("contact.title")}
          </h2>
          <div className="h-0.5 w-16 bg-[#C9A961] mx-auto mb-6" />
          <p className="font-sans text-sm md:text-base text-slate-600 font-light leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Info & Map Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {/* Card Address */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl flex gap-4 shadow-sm text-left">
                <div className="p-3 bg-[#1B3A6B]/5 rounded-xl text-[#C9A961] border border-[#1B3A6B]/15 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-sm font-bold text-[#1B3A6B] block">
                    {language === "EN" ? "Our Campus Address" : "Dirección del Campus"}
                  </span>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed font-light">
                    {t("contact.address")}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    id="copy-address-btn"
                    className="mt-2 flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-[#C9A961] hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Phone */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl flex gap-4 shadow-sm text-left">
                <div className="p-3 bg-[#1B3A6B]/5 rounded-xl text-[#C9A961] border border-[#1B3A6B]/15 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-sm font-bold text-[#1B3A6B] block">
                    {t("contact.phoneLabel")}
                  </span>
                  <p className="font-sans text-xs text-slate-700 leading-relaxed font-mono font-medium">
                    +57 311 412 9884
                  </p>
                </div>
              </div>

              {/* Card Email */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl flex gap-4 shadow-sm text-left">
                <div className="p-3 bg-[#1B3A6B]/5 rounded-xl text-[#C9A961] border border-[#1B3A6B]/15 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-sm font-bold text-[#1B3A6B] block">
                    {t("contact.emailLabel")}
                  </span>
                  <p className="font-sans text-xs text-slate-700 leading-relaxed font-mono font-medium">
                    contactenos@colegiobilingue.edu.co
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Google Map */}
            <div className="rounded-2xl border border-slate-200 bg-slate-100 shadow-xl overflow-hidden h-80 relative">
              <iframe
                src="https://maps.google.com/maps?q=10.489403370732772,-73.26942285366744&z=16&output=embed"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fundación Colegio Bilingüe de Valledupar Map"
              />
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B3A6B] to-[#C9A961]" />

            <h3 className="font-serif text-xl font-bold text-[#1B3A6B] mb-6 text-left">
              {t("contact.formTitle")}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                  {t("contact.name")} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                    {t("contact.email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                    {t("contact.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                  {t("contact.message")} *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors resize-none"
                />
              </div>

              {recaptchaConfig?.enabled && (
                <div className="space-y-3 py-1">
                  <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold block">
                    {language === "EN" ? "Security Verification" : "Verificación de Seguridad"} *
                  </label>
                  
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 inline-block">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={recaptchaConfig.siteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                      onChange={(token) => setRecaptchaToken(token)}
                      onExpired={() => setRecaptchaToken(null)}
                    />
                  </div>

                  {!recaptchaConfig.siteKey && (
                    <div className="p-3 bg-[#F8F6F1] border border-[#C9A961]/45 rounded-xl text-[10px] text-slate-600 flex items-start gap-2 max-w-sm">
                      <AlertTriangle className="w-4 h-4 text-[#C9A961] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">
                          {language === "EN" ? "reCAPTCHA Demo Mode" : "reCAPTCHA en Modo Demo"}
                        </span>
                        <span>
                          {language === "EN" 
                            ? "Using Google's public testing credentials. Save your private site/secret keys in the Admin Panel." 
                            : "Utilizando credenciales públicas de prueba. Guarde sus claves reales en el panel de administración."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                id="contact-submit-btn"
                disabled={submitting}
                className={`w-full py-4 bg-[#1B3A6B] hover:bg-[#122748] text-white border border-[#C9A961]/40 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <span>{language === "EN" ? "Sending..." : "Enviando..."}</span>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>{t("contact.submit")}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Success Dialog */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  id="contact-success-toast"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center z-20"
                >
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl mb-4">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#1B3A6B] mb-2">
                    {language === "EN" ? "Inquiry Dispatched" : "Consulta Enviada"}
                  </h4>
                  <p className="font-sans text-sm text-slate-600 max-w-md">
                    {t("contact.successMsg")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Social media connections */}
        <div className="border-t border-slate-200 mt-20 pt-12 text-center space-y-6">
          <h4 className="font-serif text-lg font-bold text-[#C9A961]">
            {t("contact.followUs")}
          </h4>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/fundacioncolegiobilingue"
              target="_blank"
              rel="noopener noreferrer"
              id="social-instagram-link"
              className="p-3.5 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full transition-all duration-300 group shadow-md hover:scale-110 hover:shadow-[0_4px_20px_rgba(238,42,123,0.5)] cursor-pointer"
              title="Instagram"
            >
              <Instagram className="w-5.5 h-5.5 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="https://www.youtube.com/@ColegioBilingueVpar"
              target="_blank"
              rel="noopener noreferrer"
              id="social-youtube-link"
              className="p-3.5 bg-[#FF0000] text-white rounded-full transition-all duration-300 group shadow-md hover:scale-110 hover:shadow-[0_4px_20px_rgba(255,0,0,0.5)] cursor-pointer"
              title="YouTube"
            >
              <Youtube className="w-5.5 h-5.5 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="https://www.tiktok.com/@fundacioncolegiobilingue"
              target="_blank"
              rel="noopener noreferrer"
              id="social-tiktok-link"
              className="p-3.5 bg-black text-white rounded-full transition-all duration-300 group shadow-md hover:scale-110 hover:shadow-[0_4px_20px_rgba(0,242,234,0.5)] cursor-pointer"
              title="TikTok"
            >
              <svg className="w-5.5 h-5.5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.99 1.15 2.37 1.93 3.86 2.19.01 1.34 0 2.68-.01 4.02-1.57-.03-3.11-.53-4.41-1.42-.14-.09-.27-.19-.4-.29v6.52c0 1.31-.26 2.6-.77 3.81-.55 1.25-1.39 2.35-2.45 3.19-1.25.99-2.82 1.52-4.42 1.51-1.54.01-3.05-.44-4.29-1.3-1.29-.89-2.22-2.19-2.65-3.69-.47-1.5-.39-3.13.23-4.57.65-1.47 1.83-2.67 3.32-3.37 1.28-.59 2.7-.82 4.1-.64v4.06c-.84-.13-1.72.03-2.44.52-.66.44-1.12 1.14-1.27 1.93-.19.92.12 1.89.8 2.53.68.61 1.62.88 2.52.71.93-.17 1.71-.88 1.99-1.79.1-.34.13-.69.13-1.04V.02z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
