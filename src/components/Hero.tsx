import { useState, useEffect } from "react";
import { useLanguage } from "../i18n";
import { ArrowRight, ChevronDown, Award, Calendar, Users, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onExplore: (sectionId: string) => void;
}

interface CounterProps {
  value: string;
}

function AnimatedCounter({ value }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const match = value.match(/(\d+)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(match[1], 10);
    const suffix = value.replace(match[1], "");

    // Snappy start value: count from 100 below for large numbers, or from 0
    const startVal = targetNumber > 1000 ? targetNumber - 100 : 0;
    const duration = 1500; // 1.5 seconds counting transition
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing: outQuad
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(startVal + easeProgress * (targetNumber - startVal));
      
      setDisplayValue(`${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    const animFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrame);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function Hero({ onExplore }: HeroProps) {
  const { language, t } = useLanguage();

  // Selected image path from generated assets
  const campusHeroImg = "/src/assets/images/graduates-2025-2026.jpg";

  const stats = [
    {
      icon: Calendar,
      val: "1980",
      lblEN: "Founded",
      lblES: "Fundación",
      iconBg: "bg-amber-500/15 border border-amber-500/30 group-hover:bg-amber-500/25",
      iconColor: "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
      accentGlow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-500/50",
    },
    {
      icon: Users,
      val: "750+",
      lblEN: "Students",
      lblES: "Estudiantes",
      iconBg: "bg-sky-500/15 border border-sky-500/30 group-hover:bg-sky-500/25",
      iconColor: "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]",
      accentGlow: "hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:border-sky-500/50",
    },
    {
      icon: GraduationCap,
      val: "70+",
      lblEN: "Educators",
      lblES: "Docentes",
      iconBg: "bg-emerald-500/15 border border-emerald-500/30 group-hover:bg-emerald-500/25",
      iconColor: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]",
      accentGlow: "hover:shadow-[0_0_25px_rgba(52,211,153,0.15)] hover:border-emerald-500/50",
    },
    {
      icon: Award,
      val: "Superior",
      lblEN: "Saber 11",
      lblES: "Pruebas Saber",
      iconBg: "bg-rose-500/15 border border-rose-500/30 group-hover:bg-rose-500/25",
      iconColor: "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]",
      accentGlow: "hover:shadow-[0_0_25px_rgba(251,113,133,0.15)] hover:border-rose-500/50",
    }
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-[#1B3A6B] text-white overflow-hidden pt-20"
    >
      {/* Background image overlay or looped background video with cinematic navy film */}
      <div className="absolute inset-0 z-0">
        <video
          src="/src/assets/videos/backweb.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster={campusHeroImg}
          className="w-full h-full object-cover object-center opacity-70 scale-102"
        />
        {/* Deep luxurious navy overlay with lighter midtones for crisp video visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A6B]/90 via-[#1B3A6B]/30 to-[#1B3A6B]/60 z-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-44 pb-20 md:pt-52 lg:pt-60 flex flex-col items-center text-center">


        {/* Title & Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight text-white max-w-5xl leading-[1.1] mb-4 italic"
        >
          {t("hero.title")}
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-lg md:text-2xl text-[#C9A961] font-medium tracking-wide mb-6"
        >
          {t("hero.subtitle")}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-sans text-sm md:text-lg text-slate-200 max-w-2xl font-light leading-relaxed mb-10"
        >
          {t("hero.tagline")}
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full mb-20"
        >
          <button
            onClick={() => onExplore("admissions")}
            id="hero-primary-cta"
            className="w-full sm:w-auto px-8 py-4 bg-[#C9A961] hover:bg-white text-[#1B3A6B] hover:text-[#1B3A6B] rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-2 border border-transparent"
          >
            <span>{t("hero.ctaPrimary")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onExplore("about-us")}
            id="hero-secondary-cta"
            className="w-full sm:w-auto px-8 py-4 border border-white text-white bg-transparent hover:bg-white hover:text-[#1B3A6B] rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
          >
            {t("hero.ctaSecondary")}
          </button>
        </motion.div>

        {/* Floating Stat Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl border-t border-[#C9A961]/30 pt-10"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center transition-all duration-500 group ${stat.accentGlow}`}
              >
                <div className={`p-3 rounded-xl mb-3 transition-colors ${stat.iconBg}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="font-serif text-2xl md:text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={stat.val} />
                </span>
                <span className="text-[10px] uppercase font-sans tracking-widest text-slate-300 group-hover:text-[#C9A961] font-semibold text-center transition-colors duration-350">
                  {language === "EN" ? stat.lblEN : stat.lblES}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Floating Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <button
          onClick={() => onExplore("about-us")}
          id="hero-scroll-indicator"
          className="p-1 text-slate-400 hover:text-[#C9A961] transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
