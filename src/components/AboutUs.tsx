import { useState, useEffect } from "react";
import { useLanguage } from "../i18n";
import { Helmet } from "react-helmet-async";
import { BookOpen, Award, Shield, Users, Calendar, ArrowRight, Heart, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AboutUsProps {
  subTab?: string;
}

type TabType = "history" | "pillars" | "profiles";

export default function AboutUs({ subTab }: AboutUsProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("history");
  const [activeProfileTab, setActiveProfileTab] = useState<"teacher" | "student">("teacher");

  useEffect(() => {
    if (subTab) {
      if (subTab === "history") {
        setActiveTab("history");
      } else if (subTab === "mission-vision" || subTab === "quality") {
        setActiveTab("pillars");
      } else if (subTab === "teacher-profile") {
        setActiveTab("profiles");
        setActiveProfileTab("teacher");
      } else if (subTab === "student-profile") {
        setActiveTab("profiles");
        setActiveProfileTab("student");
      }
    }
  }, [subTab]);

  const historyFamilies = t("history.families") as string[];
  const qualityObjectives = t("quality.objectives") as string[];
  const teacherPoints = t("profiles.teacher.points") as string[];
  const studentPoints = t("profiles.student.points") as string[];

  const tabs: { id: TabType; labelEN: string; labelES: string; icon: any }[] = [
    { id: "history", labelEN: "Our Legacy", labelES: "Nuestro Legado", icon: BookOpen },
    { id: "pillars", labelEN: "Philosophy & Quality", labelES: "Filosofía y Calidad", icon: Shield },
    { id: "profiles", labelEN: "Bilingüista Community", labelES: "Comunidad Bilingüista", icon: Users },
  ];

  // Dynamic SEO specific for the About Us sub-tabs
  const getTabSeoData = () => {
    if (language === "EN") {
      switch (activeTab) {
        case "history":
          return {
            title: "Our Legacy & History | Fundación Colegio Bilingüe",
            description: "Learn about the founding families, our expansion, and the rich history of Fundación Colegio Bilingüe de Valledupar since 1980.",
          };
        case "pillars":
          return {
            title: "Mission, Vision & Quality | Fundación Colegio Bilingüe",
            description: "Discover our institutional mission, our vision for 2030, and the core quality policies that drive our bilingual education.",
          };
        case "profiles":
          return {
            title: "Teacher & Student Profiles | Fundación Colegio Bilingüe",
            description: "Meet the Bilingüista community. Learn about the ethical, bilingual, and leadership profiles of our students and teachers.",
          };
      }
    } else {
      switch (activeTab) {
        case "history":
          return {
            title: "Nuestro Legado e Historia | Fundación Colegio Bilingüe",
            description: "Conoce a las familias fundadoras, nuestra expansión y la rica historia de la Fundación Colegio Bilingüe de Valledupar desde 1980.",
          };
        case "pillars":
          return {
            title: "Misión, Visión y Calidad | Fundación Colegio Bilingüe",
            description: "Descubre nuestra misión institucional, nuestra visión para el 2030 y las políticas de calidad que impulsan nuestra educación bilingüe.",
          };
        case "profiles":
          return {
            title: "Perfiles de Docentes y Estudiantes | Fundación Colegio Bilingüe",
            description: "Conoce a la comunidad Bilingüista. Descubre el perfil ético, bilingüe y de liderazgo de nuestros estudiantes y docentes.",
          };
      }
    }
  };

  const seo = getTabSeoData();

  return (
    <section id="about-us" className="py-24 bg-[#F8F6F1] text-[#1A1A1A] relative overflow-hidden">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
      </Helmet>

      {/* Decorative glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#1B3A6B]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#C9A961]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-sans text-[#C9A961] text-xs uppercase tracking-widest font-bold">
            {language === "EN" ? "Institutional Profile" : "Perfil Institucional"}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight text-[#1B3A6B]">
            {language === "EN" ? "About Our Institution" : "Sobre Nuestra Institución"}
          </h2>
          <div className="h-0.5 w-16 bg-[#C9A961] mx-auto mb-6" />
          <p className="font-sans text-sm md:text-base text-slate-600 font-light leading-relaxed">
            {language === "EN"
              ? "Over 45 years of forging visionary, ethical, and fully bilingual leaders in Valledupar."
              : "Más de 45 años forjando líderes visionarios, éticos y completamente bilingües en Valledupar."}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-16 border-b border-slate-200 pb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-sans font-medium transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#1B3A6B] text-white border border-[#C9A961]/50 shadow-md shadow-[#1B3A6B]/20"
                    : "bg-white border border-slate-200 text-slate-500 hover:text-[#1B3A6B]"
                }`}
              >
                <Icon className="w-4 h-4 text-[#C9A961]" />
                <span>{language === "EN" ? tab.labelEN : tab.labelES}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === "history" && (
            <motion.div
              key="history-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* History Intro */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1B3A6B] mb-6 flex items-center gap-2.5">
                    <Calendar className="w-6 h-6 text-[#C9A961]" />
                    <span>{t("history.foundingTitle")}</span>
                  </h3>
                  <div className="space-y-4 font-sans text-sm md:text-base text-slate-600 font-light leading-relaxed">
                    <p>{t("history.foundingText1")}</p>
                    <p>{t("history.foundingText2")}</p>
                    <p>{t("history.foundingText3")}</p>
                  </div>
                </div>

                {/* Founding Families Panel */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xl">
                  <h4 className="font-serif text-lg font-bold text-[#1B3A6B] mb-4 pb-3 border-b border-slate-100">
                    {t("history.foundingFamilies")}
                  </h4>
                  <p className="font-sans text-xs text-slate-500 mb-6 italic">
                    {t("history.foundingFamiliesIntro")}
                  </p>
                  <ul className="grid gap-3 font-sans text-xs md:text-sm text-slate-700">
                    {historyFamilies.map((fam, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A961] shrink-0 mt-0.5" />
                        <span>{fam}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Chronology & Relocation */}
              <div className="border-t border-slate-200 pt-16 grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="font-serif text-xl font-bold text-[#1B3A6B] flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#C9A961]" />
                    <span>{t("history.expansionTitle")}</span>
                  </h4>
                  <div className="space-y-4 font-sans text-sm text-slate-600 font-light leading-relaxed">
                    <p>{t("history.expansionText1")}</p>
                    <p>{t("history.expansionText2")}</p>
                    <p>{t("history.expansionText3")}</p>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#1B3A6B] rounded-2xl p-6 lg:p-8 flex flex-col justify-center shadow-lg">
                  <h5 className="font-serif text-base font-bold text-[#1B3A6B] mb-2 uppercase tracking-wide">
                    {language === "EN" ? "Initial Investment" : "Inversión Inicial"}
                  </h5>
                  <p className="font-sans text-xs text-slate-600 mb-4 leading-relaxed">
                    {language === "EN"
                      ? "First registrations began at $1,000, later adjusted to $20,000, allowing recruitment of premier Colombian and North American faculties."
                      : "Las matrículas iniciales comenzaron en $1,000, ajustadas luego a $20,000, permitiendo la vinculación de profesores colombianos y estadounidenses de primer nivel."}
                  </p>
                  <div className="text-xs font-mono text-[#C9A961] font-semibold mt-2">
                    {language === "EN" ? "→ Led by Victor More, Rector" : "→ Dirigido por Victor More, Rector"}
                  </div>
                </div>
              </div>

              {/* Expansion to current site */}
              <div className="border-t border-slate-200 pt-16 space-y-8">
                <h4 className="font-serif text-xl font-bold text-[#1B3A6B] flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#C9A961]" />
                  <span>{t("history.academicYearTitle")}</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-8 font-sans text-sm text-slate-600 font-light leading-relaxed">
                  <p>{t("history.academicText1")}</p>
                  <p>{t("history.academicText2")}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 font-sans text-sm text-slate-600 font-light leading-relaxed">
                  <p>{t("history.academicText3")}</p>
                  <p>{t("history.academicText4")}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "pillars" && (
            <motion.div
              key="pillars-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* Mission & Vision Side by Side */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg hover:border-[#1B3A6B] transition-colors duration-300">
                  <div className="p-3 bg-[#1B3A6B]/10 rounded-xl inline-block mb-6 border border-[#1B3A6B]/20">
                    <Shield className="w-6 h-6 text-[#C9A961]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#1B3A6B] mb-4">
                    {t("missionVision.mission.title")}
                  </h3>
                  <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
                    {t("missionVision.mission.text")}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg hover:border-[#1B3A6B] transition-colors duration-300">
                  <div className="p-3 bg-[#1B3A6B]/10 rounded-xl inline-block mb-6 border border-[#1B3A6B]/20">
                    <Sparkles className="w-6 h-6 text-[#C9A961]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#1B3A6B] mb-4">
                    {t("missionVision.vision.title")}
                  </h3>
                  <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
                    {t("missionVision.vision.text")}
                  </p>
                </div>
              </div>

              {/* Quality Policy */}
              <div className="border-t border-slate-200 pt-16 grid lg:grid-cols-5 gap-12 items-center">
                <div className="lg:col-span-3 space-y-6">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1B3A6B]">
                    {t("quality.policyTitle")}
                  </h3>
                  <div className="space-y-4 font-sans text-sm md:text-base text-slate-600 font-light leading-relaxed">
                    <p>{t("quality.policyText1")}</p>
                    <p className="p-5 bg-white border-l-4 border-[#C9A961] shadow-sm italic text-slate-600 text-sm rounded-r-2xl">
                      {t("quality.policyText2")}
                    </p>
                  </div>
                </div>

                {/* Quality Objectives List */}
                <div className="lg:col-span-2 space-y-6 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-xl">
                  <h4 className="font-serif text-lg font-bold text-[#1B3A6B]">
                    {t("quality.qualityTitle")}
                  </h4>
                  <div className="space-y-4 font-sans text-xs md:text-sm text-slate-600">
                    {qualityObjectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border border-[#C9A961]/30">
                          {i + 1}
                        </span>
                        <p className="leading-relaxed">{obj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "profiles" && (
            <motion.div
              key="profiles-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Profile sub-navigation */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setActiveProfileTab("teacher")}
                  className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    activeProfileTab === "teacher"
                      ? "bg-[#C9A961] text-[#1B3A6B] shadow-md font-bold"
                      : "bg-white border border-slate-200 text-slate-500 hover:text-[#1B3A6B]"
                  }`}
                >
                  {language === "EN" ? "The Teacher Profile" : "Perfil del Docente"}
                </button>
                <button
                  onClick={() => setActiveProfileTab("student")}
                  className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    activeProfileTab === "student"
                      ? "bg-[#C9A961] text-[#1B3A6B] shadow-md font-bold"
                      : "bg-white border border-slate-200 text-slate-500 hover:text-[#1B3A6B]"
                  }`}
                >
                  {language === "EN" ? "The Student Profile" : "Perfil del Estudiante"}
                </button>
              </div>

              {/* Profiles details */}
              <AnimatePresence mode="wait">
                {activeProfileTab === "teacher" ? (
                  <motion.div
                    key="teacher-profile"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="grid lg:grid-cols-5 gap-12 items-start"
                  >
                    <div className="lg:col-span-2 space-y-6">
                      <div className="relative aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
                        {/* Background Image of Teachers */}
                        <img
                          src="/src/assets/images/school_teachers_group.jpg"
                          alt="Bilingüista Educators"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Elegant vector graphical avatar for educators with overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A6B]/95 via-[#1B3A6B]/80 to-[#122748]/60 flex flex-col items-center justify-center p-8 text-center">
                          <Users className="w-16 h-16 text-[#C9A961] mb-4 drop-shadow-md" />
                          <h4 className="font-serif text-lg font-bold text-white uppercase tracking-wider drop-shadow-md">
                            {language === "EN" ? "Bilingüista Educators" : "Educadores Bilingüistas"}
                          </h4>
                          <p className="font-sans text-xs text-slate-200 mt-2 leading-relaxed drop-shadow-sm font-medium">
                            {language === "EN"
                              ? "Guiding students with high academic rigor and warm human empathy."
                              : "Orientando al estudiante con alto rigor académico y empatía humana."}
                          </p>
                        </div>
                      </div>
                      <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
                        {t("profiles.teacher.intro")}
                      </p>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                      <h4 className="font-serif text-xl font-bold text-[#1B3A6B] pb-3 border-b border-slate-200">
                        {t("profiles.teacher.title")}
                      </h4>
                      <div className="grid gap-4">
                        {teacherPoints.map((pt, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#1B3A6B]/50 transition-colors flex gap-3 items-start shadow-sm"
                          >
                            <span className="p-1 bg-[#1B3A6B]/10 rounded-lg text-[#C9A961] mt-0.5">
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                            <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                              {pt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="student-profile"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid lg:grid-cols-5 gap-12 items-start"
                  >
                    <div className="lg:col-span-2 space-y-6">
                      <div className="relative aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
                        {/* Background Image of Students */}
                        <img
                          src="/src/assets/images/school_students_group.jpg"
                          alt="Bilingüista Students"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Student visual layout with overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A6B]/95 via-[#1B3A6B]/80 to-[#122748]/60 flex flex-col items-center justify-center p-8 text-center">
                          <Users className="w-16 h-16 text-[#C9A961] mb-4 drop-shadow-md" />
                          <h4 className="font-serif text-lg font-bold text-white uppercase tracking-wider drop-shadow-md">
                            {language === "EN" ? "The Bilingüista Leader" : "El Líder Bilingüista"}
                          </h4>
                          <p className="font-sans text-xs text-slate-200 mt-2 leading-relaxed drop-shadow-sm font-medium">
                            {language === "EN"
                              ? "Prepared for multicultural and technologically advanced environments."
                              : "Preparado para entornos multiculturales y de alta vanguardia tecnológica."}
                          </p>
                        </div>
                      </div>
                      <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
                        {t("profiles.student.intro")}
                      </p>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                      <h4 className="font-serif text-xl font-bold text-[#1B3A6B] pb-3 border-b border-slate-200">
                        {t("profiles.student.title")}
                      </h4>
                      <div className="grid gap-3">
                        {studentPoints.map((pt, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#1B3A6B]/50 transition-colors flex gap-3 items-start shadow-sm"
                          >
                            <span className="p-1 bg-[#1B3A6B]/10 rounded-lg text-[#C9A961] mt-0.5">
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                            <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                              {pt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
