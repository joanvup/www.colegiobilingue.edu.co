import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useLanguage } from "../i18n";
import { CheckCircle2, Send, ArrowRight, AlertCircle, FileText, Calendar, Compass, UserCheck, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Admissions() {
  const { language, t } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    grade: "Preschool",
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

  const steps = t("admissions.steps") as { num: string; title: string; desc: string }[];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone) return;

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
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: recaptchaToken || undefined
        }),
      });

      if (res.ok) {
        setFormSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          grade: "Preschool",
          message: "",
        });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
        setTimeout(() => {
          setFormSubmitted(false);
        }, 5000);
      } else {
        const data = await res.json();
        alert(
          data.error || 
          (language === "EN" ? "Failed to send application. Please try again." : "No se pudo enviar la solicitud. Por favor intente de nuevo.")
        );
      }
    } catch (err) {
      console.error("Error sending admissions request:", err);
      alert(
        language === "EN" ? "Failed to connect to the server." : "No se pudo conectar con el servidor."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStepIcon = (num: string) => {
    switch (num) {
      case "01": return FileText;
      case "02": return Compass;
      case "03": return UserCheck;
      case "04": return CheckCircle2;
      default: return Calendar;
    }
  };

  return (
    <section id="admissions" className="py-24 bg-[#F8F6F1] text-[#1A1A1A] relative overflow-hidden border-t border-slate-200">
      {/* Decorative vectors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1B3A6B]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-sans text-[#C9A961] text-xs uppercase tracking-widest font-bold">
            {language === "EN" ? "Join Our Community" : "Únase a Nosotros"}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight text-[#1B3A6B]">
            {t("admissions.title")}
          </h2>
          <div className="h-0.5 w-16 bg-[#C9A961] mx-auto mb-6" />
          <p className="font-sans text-sm md:text-base text-slate-600 font-light leading-relaxed">
            {t("admissions.subtitle")}
          </p>


        </div>

        {/* 4 Steps Walkthrough */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, i) => {
            const Icon = getStepIcon(step.num);
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 relative hover:border-[#1B3A6B]/40 shadow-sm transition-all duration-300 text-left"
              >
                <div className="absolute -top-4 -right-2 text-6xl font-serif font-black text-[#1B3A6B]/5 select-none">
                  {step.num}
                </div>
                <div className="p-3 bg-[#1B3A6B]/5 rounded-xl inline-block text-[#C9A961] border border-[#1B3A6B]/15 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                  {step.title}
                </h4>
                <p className="font-sans text-xs text-slate-600 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Admissions Form */}
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B3A6B] via-[#C9A961] to-[#1B3A6B]" />

          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl font-bold text-[#1B3A6B] mb-2">
              {t("admissions.formTitle")}
            </h3>
            <p className="font-sans text-xs text-slate-500">
              {language === "EN"
                ? "Initiate contact and request administrative support from our executive team."
                : "Inicie el contacto y solicite acompañamiento de nuestro equipo administrativo."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                  {t("admissions.firstName")} *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                  {t("admissions.lastName")}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                  {t("admissions.email")} *
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
                  {t("admissions.phone")} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                {t("admissions.grade")}
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 focus:border-[#1B3A6B] rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none transition-colors"
              >
                <option value="Preschool">{t("nav.preschool")}</option>
                <option value="Primary">{t("nav.primary")}</option>
                <option value="High School">{t("nav.highSchool")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-sans tracking-widest text-slate-600 font-bold">
                {t("admissions.message")}
              </label>
              <textarea
                name="message"
                rows={4}
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
              disabled={submitting}
              id="admissions-submit-btn"
              className="w-full py-4 bg-[#1B3A6B] hover:bg-[#122748] text-white border border-[#C9A961]/40 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span>{language === "EN" ? "Sending..." : "Enviando..."}</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <span>{t("admissions.submit")}</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Success Dialog */}
          <AnimatePresence>
            {formSubmitted && (
              <motion.div
                id="admissions-success-toast"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center z-20"
              >
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl mb-4">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#1B3A6B] mb-2">
                  {language === "EN" ? "Submission Received" : "Solicitud Recibida"}
                </h4>
                <p className="font-sans text-sm text-slate-600 max-w-md">
                  {t("admissions.successMsg")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
