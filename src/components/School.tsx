import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../i18n";
import { Helmet } from "react-helmet-async";
import { BookOpen, Award, Shield, FileText, ChevronRight, CheckCircle2, Download, Eye, X, Book, Feather, Lightbulb, Music, Play, Pause, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import VirtualTourSection from "./VirtualTourSection";

interface SchoolProps {
  subTab?: string;
}

type SchoolView = "levels" | "symbols" | "virtual-tour";
type LevelType = "preschool" | "primary" | "high-school";

export default function School({ subTab }: SchoolProps) {
  const { language, t } = useLanguage();
  const [activeView, setActiveView] = useState<SchoolView>("levels");
  const [activeLevel, setActiveLevel] = useState<LevelType>("preschool");
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioObj = new Audio("/src/assets/mp3/Himno-FCBV.mp3");
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    audioObj.addEventListener("ended", handleEnded);
    audioRef.current = audioObj;

    return () => {
      audioObj.pause();
      audioObj.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
      });
    }
  };

  useEffect(() => {
    if (subTab) {
      if (subTab === "preschool" || subTab === "primary" || subTab === "high-school") {
        setActiveView("levels");
        setActiveLevel(subTab as LevelType);
      } else if (subTab === "symbols") {
        setActiveView("symbols");
      } else if (subTab === "handbook") {
        setIsHandbookOpen(true);
      } else if (subTab === "virtual-tour") {
        setActiveView("virtual-tour");
      }
    }
  }, [subTab]);

  const hsActivities = t("school.highSchool.activities") as { name: string; detail: string }[];
  const anthemLyrics = t("symbols.anthemLyrics") as string[];

  // Image assets
  const imgPreschool = "/src/assets/images/preschool_learning_1783475772229.jpg";
  const imgPrimary = "/src/assets/images/primary_students_1783475784824.jpg";
  const imgHighSchool = "/src/assets/images/high_school_mun_1783475798390.jpg";

  // Dynamic SEO specific for the School sub-tabs
  const getTabSeoData = () => {
    if (language === "EN") {
      switch (activeView) {
        case "levels":
          if (activeLevel === "preschool") return { title: "Preschool | Academic Levels | Fundación Colegio Bilingüe", description: "Discover our Preschool program, fostering curiosity and foundational bilingual skills." };
          if (activeLevel === "primary") return { title: "Primary | Academic Levels | Fundación Colegio Bilingüe", description: "Explore our Primary education, building strong academic and ethical foundations." };
          return { title: "High School | Academic Levels | Fundación Colegio Bilingüe", description: "Learn about our High School program and international models like MUN." };
        case "symbols":
          return {
            title: "Institutional Symbols & Anthem | Fundación Colegio Bilingüe",
            description: "Learn about our school shield, flag, and anthem that represent our core values.",
          };
        case "virtual-tour":
          return {
            title: "Virtual Tour | Campus | Fundación Colegio Bilingüe",
            description: "Take a 360 virtual tour of our modern campus, classrooms, and sports facilities.",
          };
      }
    } else {
      switch (activeView) {
        case "levels":
          if (activeLevel === "preschool") return { title: "Preescolar | Niveles Académicos | Fundación Colegio Bilingüe", description: "Descubre nuestro programa de Preescolar, fomentando la curiosidad y las bases bilingües." };
          if (activeLevel === "primary") return { title: "Primaria | Niveles Académicos | Fundación Colegio Bilingüe", description: "Explora nuestra educación Primaria, construyendo sólida formación académica y ética." };
          return { title: "Bachillerato | Niveles Académicos | Fundación Colegio Bilingüe", description: "Conoce nuestro programa de Bachillerato y modelos internacionales como MUN." };
        case "symbols":
          return {
            title: "Símbolos Institucionales e Himno | Fundación Colegio Bilingüe",
            description: "Conoce nuestro escudo, bandera e himno que representan nuestros valores fundamentales.",
          };
        case "virtual-tour":
          return {
            title: "Recorrido Virtual | Campus | Fundación Colegio Bilingüe",
            description: "Realiza un recorrido virtual 360 de nuestro moderno campus, aulas y áreas deportivas.",
          };
      }
    }
  };

  const seo = getTabSeoData();

  return (
    <section id="the-school" className="py-24 bg-white text-[#1A1A1A] relative overflow-hidden border-t border-b border-slate-200">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
      </Helmet>
      
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#1B3A6B]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-[#C9A961]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-sans text-[#C9A961] text-xs uppercase tracking-widest font-bold">
            {language === "EN" ? "Inside FCBV" : "La Vida en el Colegio"}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-4 tracking-tight text-[#1B3A6B]">
            {t("school.title")}
          </h2>
          <div className="h-0.5 w-16 bg-[#C9A961] mx-auto mb-6" />
          <p className="font-sans text-sm md:text-base text-slate-600 font-light leading-relaxed">
            {t("school.subtitle")}
          </p>
        </div>

        {/* View togglers: Levels vs Symbols vs Virtual Tour */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveView("levels")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-sans font-medium transition-all duration-300 cursor-pointer ${
              activeView === "levels"
                ? "bg-[#1B3A6B] text-white border border-[#C9A961]/40"
                : "bg-white border border-slate-200 text-slate-500 hover:text-[#1B3A6B]"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C9A961]" />
            <span>{language === "EN" ? "Academic Levels" : "Niveles Académicos"}</span>
          </button>
          <button
            onClick={() => setActiveView("symbols")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-sans font-medium transition-all duration-300 cursor-pointer ${
              activeView === "symbols"
                ? "bg-[#1B3A6B] text-white border border-[#C9A961]/40"
                : "bg-white border border-slate-200 text-slate-500 hover:text-[#1B3A6B]"
            }`}
          >
            <Shield className="w-4 h-4 text-[#C9A961]" />
            <span>{language === "EN" ? "Institutional Symbols" : "Símbolos e Himno"}</span>
          </button>
          <button
            onClick={() => setActiveView("virtual-tour")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-sans font-medium transition-all duration-300 cursor-pointer ${
              activeView === "virtual-tour"
                ? "bg-[#1B3A6B] text-white border border-[#C9A961]/40"
                : "bg-white border border-slate-200 text-slate-500 hover:text-[#1B3A6B]"
            }`}
          >
            <Compass className="w-4 h-4 text-[#C9A961]" />
            <span>{language === "EN" ? "Virtual Tour" : "Recorrido Virtual"}</span>
          </button>
        </div>

        {/* Main interactive panel */}
        <AnimatePresence mode="wait">
          {activeView === "levels" && (
            <motion.div
              key="levels-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Secondary togglers for levels */}
              <div className="flex flex-wrap justify-center gap-3">
                {(["preschool", "primary", "high-school"] as LevelType[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      activeLevel === level
                        ? "bg-[#C9A961] text-[#1B3A6B] shadow-md font-bold"
                        : "bg-white border border-slate-200 text-slate-500 hover:text-[#1B3A6B]"
                    }`}
                  >
                    {level === "preschool" && t("nav.preschool")}
                    {level === "primary" && t("nav.primary")}
                    {level === "high-school" && t("nav.highSchool")}
                  </button>
                ))}
              </div>

              {/* Levels display */}
              <AnimatePresence mode="wait">
                {activeLevel === "preschool" && (
                  <motion.div
                    key="preschool-content"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid lg:grid-cols-12 gap-12 items-start"
                  >
                    <div className="lg:col-span-5 space-y-6">
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group">
                        <img
                          src={imgPreschool}
                          alt="Preschool Learning"
                          className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                        <div className="absolute bottom-4 left-6">
                          <span className="font-serif text-sm text-[#C9A961] font-semibold tracking-wide">
                            Learning Center & Playgrounds
                          </span>
                        </div>
                      </div>
                      <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
                        {t("school.preschool.desc")}
                      </p>
                      <div className="p-5 bg-[#1B3A6B]/5 border border-[#1B3A6B]/20 rounded-2xl">
                        <h4 className="font-serif text-sm font-bold text-[#1B3A6B] mb-2 uppercase tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-[#C9A961]" />
                          <span>{t("school.preschool.teamTitle")}</span>
                        </h4>
                        <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
                          {t("school.preschool.teamDesc")}
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                      {/* Features bento */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                            {t("school.preschool.valuesTitle")}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                            {t("school.preschool.valuesDesc")}
                          </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                            {t("school.preschool.centerTitle")}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                            {t("school.preschool.centerDesc")}
                          </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                            {t("school.preschool.readingTitle")}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                            {t("school.preschool.readingDesc")}
                          </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                            {t("school.preschool.activitiesTitle")}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                            {t("school.preschool.activitiesDesc")}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                        <span className="font-sans text-xs text-slate-500 italic">
                          💡 {t("school.preschool.comfortsDesc")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeLevel === "primary" && (
                  <motion.div
                    key="primary-content"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid lg:grid-cols-12 gap-12 items-start"
                  >
                    <div className="lg:col-span-5 space-y-6">
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group">
                        <img
                          src={imgPrimary}
                          alt="Primary Students"
                          className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                        <div className="absolute bottom-4 left-6">
                          <span className="font-serif text-sm text-[#C9A961] font-semibold tracking-wide">
                            Values & Human Quality Program
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4 font-sans text-sm text-slate-600 font-light leading-relaxed">
                        <p>{t("school.primary.desc1")}</p>
                        <p>{t("school.primary.desc2")}</p>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                      <div className="grid gap-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                            {t("school.primary.mottoTitle")}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                            {t("school.primary.mottoDesc")}
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                            {t("school.primary.teamworkTitle")}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                            {t("school.primary.teamworkDesc")}
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="font-serif text-base font-bold text-[#1B3A6B] mb-2">
                            {t("school.primary.ecologyTitle")}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                            {t("school.primary.ecologyDesc")}
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-5 bg-[#1B3A6B]/5 border border-[#1B3A6B]/20 rounded-2xl">
                            <h5 className="font-serif text-sm font-bold text-[#1B3A6B] mb-2 uppercase tracking-wider">
                              {t("school.primary.saberTitle")}
                            </h5>
                            <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
                              {t("school.primary.saberDesc")}
                            </p>
                          </div>
                          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-center">
                            <h5 className="font-serif text-sm font-bold text-[#1B3A6B] mb-2">
                              {t("school.primary.communicationTitle")}
                            </h5>
                            <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
                              {t("school.primary.communicationDesc")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeLevel === "high-school" && (
                  <motion.div
                    key="high-school-content"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid lg:grid-cols-12 gap-12 items-start"
                  >
                    <div className="lg:col-span-5 space-y-6">
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group">
                        <img
                          src={imgHighSchool}
                          alt="Model United Nations Debate"
                          className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                        <div className="absolute bottom-4 left-6">
                          <span className="font-serif text-sm text-[#C9A961] font-semibold tracking-wide">
                            Model United Nations (MUN)
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4 font-sans text-sm text-slate-600 font-light leading-relaxed">
                        <p>{t("school.highSchool.desc1")}</p>
                        <p>{t("school.highSchool.desc2")}</p>
                      </div>

                      <div className="p-5 bg-[#1B3A6B]/5 border border-[#1B3A6B]/20 rounded-2xl">
                        <h4 className="font-serif text-sm font-bold text-[#1B3A6B] mb-2 uppercase tracking-wide flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-[#C9A961]" />
                          <span>{t("school.highSchool.orientationTitle")}</span>
                        </h4>
                        <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
                          {t("school.highSchool.orientationDesc")}
                        </p>
                      </div>

                      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <h4 className="font-serif text-sm font-bold text-[#1B3A6B] mb-2 flex items-center gap-2">
                          <span>{t("school.highSchool.saberTitle")}</span>
                        </h4>
                        <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
                          {t("school.highSchool.saberDesc")}
                        </p>
                      </div>
                    </div>

                    {/* Co-curricular high school list */}
                    <div className="lg:col-span-7 space-y-6">
                      <h4 className="font-serif text-lg font-bold text-[#1B3A6B]">
                        {t("school.highSchool.activitiesTitle")}
                      </h4>
                      <p className="font-sans text-xs text-slate-500 italic">
                        {t("school.highSchool.activitiesIntro")}
                      </p>

                      <div className="grid gap-3">
                        {hsActivities.map((act, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#1B3A6B]/50 transition-colors shadow-sm"
                          >
                            <span className="font-serif text-sm font-bold text-[#1B3A6B] block mb-1">
                              {act.name}
                            </span>
                            <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
                              {act.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Student Handbook Callout */}
              <div className="border-t border-slate-200 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#1B3A6B]/5 p-6 rounded-2xl border border-[#1B3A6B]/10">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-[#1B3A6B]/10 rounded-xl text-[#C9A961] shrink-0 border border-[#1B3A6B]/20">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1B3A6B] mb-1">
                      {language === "EN" ? "Student Handbook" : "Manual de Convivencia"}
                    </h4>
                    <p className="font-sans text-xs text-slate-600 max-w-xl text-left">
                      {language === "EN"
                        ? "Discover the rights, responsibilities, and guidelines that govern our harmonious academic community."
                        : "Descubra los derechos, deberes y pautas que rigen el comportamiento armónico en nuestra comunidad."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHandbookOpen(true)}
                  id="open-handbook-btn"
                  className="px-6 py-3 bg-[#1B3A6B] hover:bg-[#122748] text-white rounded-full text-xs font-bold tracking-wider uppercase border border-[#C9A961]/40 transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{language === "EN" ? "Open Handbook Visor" : "Abrir Visor del Manual"}</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeView === "symbols" && (
            <motion.div
              key="symbols-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {/* Logo / Coat of arms shield symbols details */}
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-64 h-64 bg-white rounded-full p-0 flex items-center justify-center shadow-2xl overflow-hidden">
                    <img
                      src="/src/assets/images/Logo_FCBV.svg"
                      alt="Logo FCBV"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-[#1B3A6B]">
                    {t("symbols.logoTitle")}
                  </h3>
                  <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
                    {t("symbols.logoDesc")}
                  </p>

                  {/* Symbols Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex gap-3 shadow-sm">
                      <div className="p-2 bg-[#1B3A6B]/5 rounded-xl text-[#C9A961] shrink-0 mt-0.5 border border-[#1B3A6B]/15">
                        <Book className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-serif text-sm font-bold text-[#1B3A6B] block mb-1">
                          {language === "EN" ? "The Book" : "El Libro"}
                        </span>
                        <p className="font-sans text-xs text-slate-500 font-light">
                          {language === "EN" ? "Studying and investigation." : "Estudio e investigación."}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex gap-3 shadow-sm">
                      <div className="p-2 bg-[#1B3A6B]/5 rounded-xl text-[#C9A961] shrink-0 mt-0.5 border border-[#1B3A6B]/15">
                        <Feather className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-serif text-sm font-bold text-[#1B3A6B] block mb-1">
                          {language === "EN" ? "The Quill" : "La Pluma"}
                        </span>
                        <p className="font-sans text-xs text-slate-500 font-light">
                          {language === "EN" ? "Responsible and creative work." : "Trabajo responsable."}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex gap-3 shadow-sm">
                      <div className="p-2 bg-[#1B3A6B]/5 rounded-xl text-[#C9A961] shrink-0 mt-0.5 border border-[#1B3A6B]/15">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-serif text-sm font-bold text-[#1B3A6B] block mb-1">
                          {language === "EN" ? "The Lamp" : "La Lámpara"}
                        </span>
                        <p className="font-sans text-xs text-slate-500 font-light">
                          {language === "EN" ? "Knowledge and light that guides." : "Conocimiento y luz que ilumina el camino."}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex gap-3 shadow-sm">
                      <div className="p-2 bg-[#1B3A6B]/5 rounded-xl text-[#C9A961] shrink-0 mt-0.5 border border-[#1B3A6B]/15">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-serif text-sm font-bold text-[#1B3A6B] block mb-1">
                          {language === "EN" ? "The Mortarboard" : "El Birrete"}
                        </span>
                        <p className="font-sans text-xs text-slate-500 font-light">
                          {language === "EN" ? "Prize of the force and consecration." : "Premio al esfuerzo y consagración."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Flag colors */}
              <div className="border-t border-slate-200 pt-16 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <h3 className="font-serif text-2xl font-bold text-[#1B3A6B] mb-4">
                    {t("symbols.flagTitle")}
                  </h3>
                  <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
                    {t("symbols.flagDesc")}
                  </p>
                </div>
                {/* Horizontal Flag representation */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-xl flex flex-col">
                  <div className="h-1/3 bg-red-700" />
                  <div className="h-1/3 bg-white" />
                  <div className="h-1/3 bg-[#1B3A6B]" />
                </div>
              </div>

              {/* School Anthem Lyrics Sheet */}
              <div className="border-t border-slate-200 pt-16 max-w-3xl mx-auto">
                <div className="bg-[#1B3A6B] border-4 border-[#C9A961]/40 rounded-2xl p-8 md:p-12 shadow-2xl relative">
                  <button
                    onClick={togglePlay}
                    className="absolute top-4 right-6 p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl border border-white/20 text-[#C9A961] transition-all duration-300 cursor-pointer flex items-center gap-2 group"
                    title={isPlaying ? (language === "EN" ? "Pause Hymn" : "Pausar Himno") : (language === "EN" ? "Play Hymn" : "Escuchar Himno")}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 animate-pulse text-white" />
                        <span className="text-xs text-white font-sans font-bold">{language === "EN" ? "Pause" : "Pausar"}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform text-[#C9A961]" />
                        <span className="text-xs text-white font-sans font-bold">{language === "EN" ? "Play Hymn" : "Escuchar Himno"}</span>
                      </>
                    )}
                  </button>
                  <div className="text-center space-y-8">
                    <h3 className="font-serif text-3xl font-bold text-white">
                      {t("symbols.anthemTitle")}
                    </h3>
                    <div className="h-0.5 w-12 bg-[#C9A961] mx-auto" />

                    <div className="font-serif text-sm md:text-base leading-loose tracking-wide text-slate-100 italic whitespace-pre-line max-w-md mx-auto font-medium">
                      {anthemLyrics.join("\n")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "virtual-tour" && (
            <motion.div
              key="virtual-tour-content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <VirtualTourSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Student Handbook visor Modal */}
      <AnimatePresence>
        {isHandbookOpen && (
          <motion.div
            id="handbook-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
          >
            <motion.div
              id="handbook-modal-container"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-[#F8F6F1] border-2 border-[#1B3A6B] w-full max-w-4xl h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 bg-[#1B3A6B] border-b border-[#C9A961] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#C9A961]" />
                  <div className="text-left">
                    <h3 className="font-serif text-sm md:text-base font-bold text-white leading-tight">
                      {t("handbook.title")}
                    </h3>
                    <p className="text-[10px] font-sans text-[#C9A961] uppercase tracking-widest font-bold">
                      Fundación Colegio Bilingüe
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHandbookOpen(false)}
                  id="close-handbook-modal"
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Visor Area */}
              <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                {/* PDF Banner warning */}
                <div className="p-4 bg-[#1B3A6B]/5 border-b border-[#C9A961]/25 text-center space-y-1 z-10 shadow-sm">
                  <span className="text-xs text-[#C9A961] font-mono font-bold block tracking-wider">⚠️ VISOR INSTITUCIONAL EN LÍNEA</span>
                  <p className="text-xs text-slate-600 font-sans">{t("handbook.disclaimer")}</p>
                </div>

                {/* Embedded PDF iframe */}
                <div className="flex-1 w-full h-full bg-slate-200 relative">
                  <iframe
                    src="/src/assets/documents/MC_2026-2027_v1.2.pdf"
                    className="absolute inset-0 w-full h-full border-none"
                    title="Manual de Convivencia"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#1B3A6B] border-t border-[#C9A961] flex items-center justify-between">
                <span className="text-xs text-slate-200 font-mono">
                  MC_2026-2027_v1.2
                </span>
                <a
                  href="/src/assets/documents/MC_2026-2027_v1.2.pdf"
                  download="Manual_Convivencia_2026-2027_v1.2.pdf"
                  id="download-pdf-btn"
                  className="px-4 py-2 bg-[#C9A961] hover:bg-amber-600 text-[#1B3A6B] hover:text-white rounded-full text-xs font-bold tracking-wider transition-colors flex items-center gap-2 cursor-pointer text-center justify-center"
                >
                  <Download className="w-4 h-4" />
                  <span>{t("handbook.download")}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
