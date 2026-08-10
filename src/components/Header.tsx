import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../i18n";
import { Menu, X, ChevronDown, Globe, BookOpen, Award, Users, FileText, ArrowRight, Shield, Image, Search, Home, Calendar, Phone, Sparkles, AlertCircle, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ColombiaFlag = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 rounded-full overflow-hidden shadow-sm border border-black/10 shrink-0 inline-block">
    <rect width="24" height="12" fill="#FCD116" />
    <rect y="12" width="24" height="6" fill="#003893" />
    <rect y="18" width="24" height="6" fill="#CE1126" />
  </svg>
);

const USFlag = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 rounded-full overflow-hidden shadow-sm border border-black/10 shrink-0 inline-block">
    <rect width="24" height="24" fill="#FFFFFF" />
    <rect y="0" width="24" height="1.85" fill="#B22234" />
    <rect y="3.7" width="24" height="1.85" fill="#B22234" />
    <rect y="7.4" width="24" height="1.85" fill="#B22234" />
    <rect y="11.1" width="24" height="1.85" fill="#B22234" />
    <rect y="14.8" width="24" height="1.85" fill="#B22234" />
    <rect y="18.5" width="24" height="1.85" fill="#B22234" />
    <rect y="22.15" width="24" height="1.85" fill="#B22234" />
    <rect width="11" height="12.95" fill="#3C3B6E" />
    <circle cx="2.75" cy="3.2" r="0.7" fill="#FFFFFF" />
    <circle cx="5.5" cy="3.2" r="0.7" fill="#FFFFFF" />
    <circle cx="8.25" cy="3.2" r="0.7" fill="#FFFFFF" />
    <circle cx="4.12" cy="6.4" r="0.7" fill="#FFFFFF" />
    <circle cx="6.87" cy="6.4" r="0.7" fill="#FFFFFF" />
    <circle cx="2.75" cy="9.6" r="0.7" fill="#FFFFFF" />
    <circle cx="5.5" cy="9.6" r="0.7" fill="#FFFFFF" />
    <circle cx="8.25" cy="9.6" r="0.7" fill="#FFFFFF" />
  </svg>
);

// Comprehensive index of all school sections and academic programs
const searchDatabase = [
  {
    id: "home",
    sectionId: "home",
    icon: Home,
    titleEn: "Home / Welcome Page",
    titleEs: "Inicio / Bienvenida",
    descEn: "Fundación Colegio Bilingüe de Valledupar landing page. Founded in 1980.",
    descEs: "Página de inicio, presentación del Colegio Bilingüe fundado en 1980.",
    keywordsEn: "home main welcome start presentation intro school founded 1980",
    keywordsEs: "inicio principal bienvenida portada presentacion colegio fundado 1980"
  },
  {
    id: "history",
    sectionId: "about-us",
    subTab: "history",
    icon: BookOpen,
    titleEn: "Our History & Genesis",
    titleEs: "Nuestra Historia y Génesis",
    descEn: "Our founding in 1979-1980, the first 7 families, and legacy of engineer Julio Villazón Baquero.",
    descEs: "Conoce la fundación en 1979-1980, las primeras 7 familias y el legado de Julio Villazón Baquero.",
    keywordsEn: "history genesis founding families founders villazon 1980 legacy genesis",
    keywordsEs: "historia genesis fundacion familias fundadores villazon legado"
  },
  {
    id: "mission-vision",
    sectionId: "about-us",
    subTab: "mission-vision",
    icon: Shield,
    titleEn: "Mission, Vision & Philosophy",
    titleEs: "Misión, Visión y Filosofía",
    descEn: "Our institutional goals for 2030, leadership values, ethical principles, and global perspective.",
    descEs: "Nuestros objetivos institucionales para 2030, valores de liderazgo y principios éticos.",
    keywordsEn: "mission vision philosophy values goals future 2030 ethics leadership purpose",
    keywordsEs: "mision vision filosofia valores metas futuro liderazgo etica proposito"
  },
  {
    id: "quality",
    sectionId: "about-us",
    subTab: "quality",
    icon: Award,
    titleEn: "Quality Policy & Objectives",
    titleEs: "Política de Calidad y Objetivos",
    descEn: "Continuous educational improvement, ISO 9001:2015 certification, and Cognia accreditation.",
    descEs: "Compromiso con la mejora continua, certificación ISO 9001:2015 y acreditación Cognia.",
    keywordsEn: "quality policy objectives improvement iso certified certification cognia standard quality",
    keywordsEs: "calidad politica objetivos mejora iso certificado acreditacion cognia norma"
  },
  {
    id: "teacher-profile",
    sectionId: "about-us",
    subTab: "teacher-profile",
    icon: Users,
    titleEn: "Teacher Profile",
    titleEs: "Perfil del Docente",
    descEn: "Our highly trained bilingual educators, commitment to pedagogical vanguard, and academic excellence.",
    descEs: "Nuestros educadores bilingües altamente capacitados y su compromiso con la vanguardia pedagógica.",
    keywordsEn: "teacher profile educators staff faculty professors pedagogy teaching excellence",
    keywordsEs: "docente profesor maestro educadores perfil personal docentes ensenanza"
  },
  {
    id: "student-profile",
    sectionId: "about-us",
    subTab: "student-profile",
    icon: Users,
    titleEn: "Student Profile",
    titleEs: "Perfil del Estudiante",
    descEn: "Forming bilingual global leaders, ethical principles, solidarity, and critical thinking.",
    descEs: "Formación de líderes globales bilingües, principios éticos, solidaridad y pensamiento crítico.",
    keywordsEn: "student profile graduates learners skills leadership ethics solidarity profiles",
    keywordsEs: "estudiante perfil egresado alumnos valores liderazgo etica solidaridad perfiles"
  },
  {
    id: "preschool",
    sectionId: "the-school",
    subTab: "preschool",
    icon: BookOpen,
    titleEn: "Preschool (Early Childhood)",
    titleEs: "Preescolar (Educación Inicial)",
    descEn: "A safe, fun, and fully bilingual environment for early stimulation, play, and language discovery.",
    descEs: "Ambiente bilingüe, seguro y divertido para la estimulación temprana y el descubrimiento del inglés.",
    keywordsEn: "preschool early childhood preescolar kindergarten nursery play kids level program",
    keywordsEs: "preescolar jardin transicion parbulo niños estimulacion inicial ingles"
  },
  {
    id: "primary",
    sectionId: "the-school",
    subTab: "primary",
    icon: Award,
    titleEn: "Primary Education (Elementary)",
    titleEs: "Educación Primaria (Básica)",
    descEn: "Solid bilingual foundation, development of social, academic, and creative skills in early grades.",
    descEs: "Bases sólidas de bilingüismo, desarrollo de habilidades sociales, académicas y creativas.",
    keywordsEn: "primary elementary school grades kids education children basic classroom",
    keywordsEs: "primaria basica escuela grados educacion niños elemental salon de clases"
  },
  {
    id: "high-school",
    sectionId: "the-school",
    subTab: "high-school",
    icon: Shield,
    titleEn: "High School (Secondary Education)",
    titleEs: "Bachillerato (Media y Secundaria)",
    descEn: "Preparation for higher education, academic rigor, critical thinking, and international standards.",
    descEs: "Preparación para la educación superior, rigor académico, pensamiento crítico y estándares internacionales.",
    keywordsEn: "high school middle secondary bachillerato university preparation icfes standard",
    keywordsEs: "bachillerato secundaria media icfes universidad preparacion jovenes"
  },
  {
    id: "symbols",
    sectionId: "the-school",
    subTab: "symbols",
    icon: Award,
    titleEn: "Institutional Symbols & Anthem",
    titleEs: "Símbolos Institucionales e Himno",
    descEn: "The shield, flag, history of our colors, and the lyrics of the school's solemn anthem.",
    descEs: "El escudo, la bandera, historia de nuestros colores y la letra del solemne himno escolar.",
    keywordsEn: "symbols anthem flag shield lyrics colors identity song himno",
    keywordsEs: "simbolos himno bandera escudo letra colores identidad cancion"
  },
  {
    id: "handbook",
    sectionId: "the-school",
    subTab: "handbook",
    icon: FileText,
    titleEn: "Student Handbook & Coexistence",
    titleEs: "Manual de Convivencia",
    descEn: "Institutional rules, student rights, duties, and coexistence guidelines for harmony.",
    descEs: "Normas institucionales, derechos, deberes de los estudiantes y pautas de convivencia.",
    keywordsEn: "handbook manual rules student handbook regulations rights duties coexistence discipline",
    keywordsEs: "manual de convivencia normas reglamento derechos deberes convivencia disciplina"
  },
  {
    id: "gallery",
    sectionId: "the-school",
    subTab: "gallery",
    icon: Image,
    titleEn: "Photo Gallery (Multi-language)",
    titleEs: "Galería de fotos (multiidioma)",
    descEn: "Visual journey through school activities, community life, and learning moments.",
    descEs: "Recorrido visual por las actividades escolares, vida comunitaria y momentos de aprendizaje.",
    keywordsEn: "gallery photos images albums moments pictures visual memories photo galeria de fotos",
    keywordsEs: "galeria de fotos fotos imagenes albumes momentos recuerdos foto"
  },
  {
    id: "calendar",
    sectionId: "calendar",
    icon: Calendar,
    titleEn: "Activities Calendar",
    titleEs: "Calendario de Actividades",
    descEn: "Upcoming events, holidays, academic dates, and institutional activities synchronized.",
    descEs: "Próximos eventos, vacaciones, fechas académicas y actividades institucionales sincronizadas.",
    keywordsEn: "calendar schedule events activities dates holidays days academic",
    keywordsEs: "calendario actividades eventos fechas festivos agenda cronograma"
  },
  {
    id: "admissions",
    sectionId: "admissions",
    icon: ArrowRight,
    titleEn: "Admissions 2026-2027",
    titleEs: "Admisiones 2026-2027",
    descEn: "Process, requirements, age guide, and online registration form to join our family.",
    descEs: "Proceso, requisitos, guía de edades y formulario de inscripción en línea.",
    keywordsEn: "admissions enroll join process requirements registration apply application age cost",
    keywordsEs: "admisiones cupo inscripcion proceso requisitos postularse postular matricularse"
  },
  {
    id: "contact",
    sectionId: "contact",
    icon: Phone,
    titleEn: "Contact Us & Location",
    titleEs: "Contacto y Ubicación",
    descEn: "Dynamic contact form, telephone numbers, emails, and physical address in Valledupar.",
    descEs: "Formulario de contacto dinámico, números de teléfono, correos y dirección física.",
    keywordsEn: "contact location phone email address map reach us help contact form send",
    keywordsEs: "contacto ubicacion mapa direccion de contacto telefono correo escribir buzon"
  },
  {
    id: "virtual-tour",
    sectionId: "virtual-tour",
    icon: Compass,
    titleEn: "Interactive Virtual Tour",
    titleEs: "Recorrido Virtual Interactivo",
    descEn: "Explore our premium 60-acre campus, academic laboratories, sports areas, and library in 360°.",
    descEs: "Explore nuestro campus premium de 60 acres, laboratorios académicos, áreas deportivas y biblioteca en 360°.",
    keywordsEn: "virtual tour campus 360 panorama slider layout facilities sports labs map classroom science",
    keywordsEs: "recorrido virtual campus 360 panorama slider mapa instalaciones laboratorios deportes aulas ciencia biblioteca"
  }
];

interface HeaderProps {
  onNavigate: (sectionId: string, subTab?: string) => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K opens, Escape closes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      // Small timeout to guarantee DOM is fully rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  const handleDropdownItemClick = (sectionId: string, subTab: string) => {
    onNavigate(sectionId, subTab);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleSearchResultClick = (sectionId: string, subTab?: string) => {
    onNavigate(sectionId, subTab);
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: t("nav.home") },
    {
      id: "about-us",
      label: t("nav.aboutUs"),
      hasDropdown: true,
      dropdownItems: [
        { key: "history", label: t("nav.history"), icon: BookOpen },
        { key: "mission-vision", label: t("nav.missionVision"), icon: Shield },
        { key: "quality", label: t("nav.quality"), icon: Award },
        { key: "teacher-profile", label: t("nav.teacherProfile"), icon: Users },
        { key: "student-profile", label: t("nav.studentProfile"), icon: Users },
      ],
    },
    {
      id: "the-school",
      label: t("nav.theSchool"),
      hasDropdown: true,
      dropdownItems: [
        { key: "preschool", label: t("nav.preschool"), icon: BookOpen },
        { key: "primary", label: t("nav.primary"), icon: Award },
        { key: "high-school", label: t("nav.highSchool"), icon: Shield },
        { key: "symbols", label: t("nav.symbols"), icon: Award },
        { key: "handbook", label: t("nav.handbook"), icon: FileText },
        { key: "gallery", label: t("nav.gallery"), icon: Image },
        { key: "virtual-tour", label: t("nav.virtualTour"), icon: Compass },
      ],
    },
    { id: "calendar", label: t("nav.calendar") },
    { id: "admissions", label: t("nav.admissions") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 w-full z-50"
    >
      {/* Top Brand Bar - Visible on desktop when NOT scrolled */}
      {!isScrolled && (
        <div className="bg-white border-b border-[#1B3A6B]/25 py-4 text-center relative hidden lg:block shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Left Brand Badge and Search Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("home")}
                className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
              >
                <div className="relative w-20 h-20 -my-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/src/assets/images/Logo_FCBV.svg"
                    alt="Logo Colegio Bilingüe de Valledupar"
                    className="w-full h-full object-contain"
                  />
                </div>
              </button>

              {/* Elegant Search Button next to logo */}
              <button
                onClick={() => setIsSearchOpen(true)}
                title={language === "ES" ? "Buscar secciones (Ctrl+K)" : "Search sections (Ctrl+K)"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1B3A6B]/20 bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-xs font-bold tracking-wider text-[#1B3A6B] transition-all duration-300 cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-[#C9A961]" />
                <span>{language === "ES" ? "Buscar" : "Search"}</span>
              </button>
            </div>

            {/* Stately Center Brand Title */}
            <div className="text-center select-none absolute left-1/2 -translate-x-1/2 w-[550px]">
              <h1 className="font-cinzel text-2xl lg:text-3xl font-bold tracking-wider text-[#1B3A6B] leading-tight">
                Fundación Colegio Bilingüe de Valledupar
              </h1>
              <p className="text-[11px] uppercase font-cinzel tracking-[0.3em] text-[#C9A961] font-bold mt-1">
                Founded 1980
              </p>
            </div>

            {/* Right Quick Toggles & Logos */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1B3A6B]/20 bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-xs font-bold tracking-wider text-[#1B3A6B] transition-all duration-300 cursor-pointer"
              >
                {language === "ES" ? <ColombiaFlag /> : <USFlag />}
                <span>{language}</span>
              </button>
              
              <div className="flex items-center gap-3.5 h-16">
                <img
                  src="/src/assets/images/Cognia-300x300.png"
                  alt="Cognia"
                  className="h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <a
                  href="/src/assets/documents/certificado_icontec.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-full hover:opacity-80 transition-opacity cursor-pointer block"
                  title={language === "EN" ? "View Icontec Certificate" : "Ver Certificado Icontec"}
                >
                  <img
                    src="/src/assets/images/logo-icontec.png"
                    alt="Icontec"
                    className="h-full w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-350 ${
          isScrolled
            ? "bg-[#1B3A6B]/20 backdrop-blur-md py-1 shadow-md"
            : "bg-transparent py-1"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo brand and search when scrolled OR on tablet/mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("home")}
              id="logo-brand-btn"
              className={`flex items-center gap-3 text-left focus:outline-none group cursor-pointer ${
                !isScrolled ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"
              } transition-all duration-300`}
            >
              <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/src/assets/images/Logo_FCBV.svg"
                  alt="Logo Colegio Bilingüe de Valledupar"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-xs md:text-sm font-bold tracking-wider text-white group-hover:text-[#C9A961] transition-colors duration-300">
                  Fundación Colegio Bilingüe de Valledupar
                </span>
                <span className="font-cinzel text-[10px] md:text-[11px] tracking-widest text-[#C9A961] font-semibold mt-0.5">
                  Founded 1980
                </span>
              </div>
            </button>

            {/* Search button next to the logo for desktop/tablet, hidden on mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              title={language === "ES" ? "Buscar secciones (Ctrl+K)" : "Search sections (Ctrl+K)"}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 hover:border-[#C9A961] text-xs font-semibold tracking-wider text-slate-200 hover:text-white transition-all duration-300 cursor-pointer shrink-0 ${
                !isScrolled ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#C9A961]" />
              <span>{language === "ES" ? "Buscar" : "Search"}</span>
            </button>
          </div>

          {/* Desktop Nav Items - Centered if not scrolled */}
          <nav
            id="desktop-nav"
            className={`hidden lg:flex items-center gap-8 ${
              !isScrolled ? "w-full justify-center" : ""
            } transition-all duration-350`}
          >
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
              >
                <button
                  onClick={() => !item.hasDropdown && onNavigate(item.id)}
                  className={`flex items-center gap-1 py-2 font-sans text-xs uppercase tracking-widest font-bold transition-colors duration-300 cursor-pointer ${
                    activeSection === item.id
                      ? "text-[#C9A961]"
                      : "text-slate-100 hover:text-[#C9A961]"
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </button>

                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSectionUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A961]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Dropdown Panel */}
                {item.hasDropdown && activeDropdown === item.id && (
                  <div
                    id={`dropdown-${item.id}`}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72 z-50"
                  >
                    <div className="bg-[#1B3A6B] border border-[#C9A961]/30 rounded-none shadow-2xl p-4 overflow-hidden backdrop-blur-lg">
                      <div className="grid gap-2">
                        {item.dropdownItems?.map((drop) => {
                          const Icon = drop.icon;
                          return (
                            <button
                              key={drop.key}
                              onClick={() => handleDropdownItemClick(item.id, drop.key)}
                              className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-all duration-200 group/item cursor-pointer"
                            >
                              <div className="p-1.5 bg-white/10 rounded-lg group-hover/item:bg-[#C9A961]/25 transition-colors duration-200">
                                <Icon className="w-4 h-4 text-[#C9A961]" />
                              </div>
                              <span className="text-xs font-sans font-medium">
                                {drop.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Header Actions - Only visible on desktop when scrolled */}
          <div
            id="header-actions"
            className={`hidden lg:flex items-center gap-5 transition-all duration-350 ${
              isScrolled ? "opacity-100" : "opacity-0 pointer-events-none w-0 overflow-hidden"
            }`}
          >
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
              id="lang-toggle-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 hover:border-[#C9A961] text-xs font-semibold tracking-wider text-slate-200 hover:text-white transition-all duration-300 cursor-pointer"
            >
              {language === "ES" ? <ColombiaFlag /> : <USFlag />}
              <span>{language}</span>
            </button>

            {/* Accreditations in scrolled state */}
            <div className="flex items-center gap-2.5 h-8">
              <img
                src="/src/assets/images/Cognia-300x300.png"
                alt="Cognia"
                className="h-full w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <a
                href="/src/assets/documents/certificado_icontec.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="h-full hover:opacity-80 transition-opacity cursor-pointer block"
                title={language === "EN" ? "View Icontec Certificate" : "Ver Certificado Icontec"}
              >
                <img
                  src="/src/assets/images/logo-icontec.png"
                  alt="Icontec"
                  className="h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Language toggle for mobile */}
            <button
              onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
              id="mobile-lang-toggle-btn"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 bg-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              {language === "ES" ? <ColombiaFlag /> : <USFlag />}
              <span>{language}</span>
            </button>

            {/* Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 text-slate-100 hover:text-[#C9A961] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden w-full bg-[#1B3A6B] border-t border-[#C9A961]/35 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 space-y-6">
              {navItems.map((item) => (
                <div key={item.id} className="space-y-3">
                  <button
                    onClick={() => {
                      if (!item.hasDropdown) {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      } else {
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      }
                    }}
                    className={`flex items-center justify-between w-full text-left font-serif text-lg font-medium tracking-wide ${
                      activeSection === item.id ? "text-[#C9A961]" : "text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          activeDropdown === item.id ? "rotate-180 text-[#C9A961]" : "text-slate-300"
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown items */}
                  {item.hasDropdown && activeDropdown === item.id && (
                    <div className="pl-4 border-l border-[#C9A961]/30 space-y-2 py-1">
                      {item.dropdownItems?.map((drop) => (
                        <button
                          key={drop.key}
                          onClick={() => handleDropdownItemClick(item.id, drop.key)}
                          className="flex items-center gap-3 py-2 w-full text-left text-slate-200 hover:text-white cursor-pointer"
                        >
                          <drop.icon className="w-4 h-4 text-[#C9A961] shrink-0" />
                          <span className="text-sm font-sans">{drop.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-5 h-10 py-1">
                  <img
                    src="/src/assets/images/Cognia-300x300.png"
                    alt="Cognia"
                    className="h-full w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <a
                    href="/src/assets/documents/certificado_icontec.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-full hover:opacity-80 transition-opacity cursor-pointer block"
                    title={language === "EN" ? "View Icontec Certificate" : "Ver Certificado Icontec"}
                  >
                    <img
                      src="/src/assets/images/logo-icontec.png"
                      alt="Icontec"
                      className="h-full w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                </div>
                
                <button
                  onClick={() => {
                    onNavigate("admissions");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center border border-white/20 bg-white/10 hover:bg-white/20 text-slate-100 rounded-full text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  {t("nav.apply")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[9999] flex items-start justify-center pt-[10vh] px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              id="search-modal-box"
              initial={{ scale: 0.95, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#F8F6F1] max-w-2xl w-full border border-[#C9A961]/40 shadow-2xl flex flex-col max-h-[75vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Bar Input Header */}
              <div className="relative border-b border-[#1B3A6B]/15 bg-white p-4 flex items-center">
                <Search className="absolute left-6 w-5 h-5 text-[#C9A961]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === "ES"
                      ? "Buscar secciones, niveles académicos, manual..."
                      : "Search sections, academic levels, handbook..."
                  }
                  className="w-full pl-12 pr-10 py-3 bg-slate-50 text-[#1B3A6B] placeholder-slate-400 border border-[#1B3A6B]/15 focus:outline-none focus:border-[#C9A961] focus:bg-white text-base font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-16 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={language === "ES" ? "Limpiar" : "Clear"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-4 p-2 text-[#1B3A6B]/70 hover:text-[#1B3A6B] hover:bg-[#1B3A6B]/5 transition-colors font-sans text-sm font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === "ES" ? "Cerrar" : "Close"}</span>
                </button>
              </div>

              {/* Search Results Area */}
              <div className="overflow-y-auto p-6 space-y-4 flex-1">
                {searchQuery.trim() === "" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A961] mb-3">
                        {language === "ES" ? "Enlaces Rápidos" : "Quick Links"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          searchDatabase.find(item => item.id === "admissions"),
                          searchDatabase.find(item => item.id === "preschool"),
                          searchDatabase.find(item => item.id === "handbook"),
                          searchDatabase.find(item => item.id === "history"),
                          searchDatabase.find(item => item.id === "gallery"),
                        ].filter((item): item is NonNullable<typeof item> => !!item).map((item) => {
                          const IconComponent = item.icon;
                          const title = language === "ES" ? item.titleEs : item.titleEn;
                          const desc = language === "ES" ? item.descEs : item.descEn;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSearchResultClick(item.sectionId, item.subTab)}
                              className="flex items-start gap-3 p-3 bg-white hover:bg-[#1B3A6B]/5 border border-[#1B3A6B]/10 hover:border-[#C9A961] transition-all duration-200 text-left group cursor-pointer"
                            >
                              <div className="p-2 bg-[#C9A961]/10 rounded-lg group-hover:bg-[#C9A961]/20 transition-colors shrink-0">
                                <IconComponent className="w-4 h-4 text-[#1B3A6B]" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[#1B3A6B] group-hover:text-[#C9A961] transition-colors truncate">
                                  {title}
                                </h4>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-500 bg-white p-3 border border-[#1B3A6B]/5">
                      <Sparkles className="w-4 h-4 text-[#C9A961] shrink-0" />
                      <span>
                        {language === "ES"
                          ? "Escribe palabras clave como 'preescolar', 'admisiones' o 'historia' para buscar en toda la web."
                          : "Type keywords like 'preschool', 'admissions' or 'history' to search across our entire school portal."}
                      </span>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const query = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const results = searchDatabase.filter(item => {
                      const matchTitleEn = item.titleEn.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
                      const matchTitleEs = item.titleEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
                      const matchDescEn = item.descEn.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
                      const matchDescEs = item.descEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
                      const matchKeywordsEn = item.keywordsEn.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
                      const matchKeywordsEs = item.keywordsEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query);
                      return matchTitleEn || matchTitleEs || matchDescEn || matchDescEs || matchKeywordsEn || matchKeywordsEs;
                    });

                    if (results.length > 0) {
                      return (
                        <div className="space-y-3">
                          <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#C9A961] mb-2">
                            {language === "ES"
                              ? `Se encontraron ${results.length} resultados`
                              : `Found ${results.length} results`}
                          </h3>
                          <div className="space-y-2">
                            {results.map((item) => {
                              const IconComponent = item.icon;
                              const title = language === "ES" ? item.titleEs : item.titleEn;
                              const desc = language === "ES" ? item.descEs : item.descEn;
                              
                              // Dynamic breadcrumb display
                              let breadcrumb = "";
                              if (item.sectionId === "home") {
                                breadcrumb = language === "ES" ? "Inicio" : "Home";
                              } else if (item.sectionId === "about-us") {
                                breadcrumb = (language === "ES" ? "Nosotros" : "About Us") + (item.subTab ? ` > ${item.subTab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}` : "");
                              } else if (item.sectionId === "the-school") {
                                breadcrumb = (language === "ES" ? "El Colegio" : "The School") + (item.subTab ? ` > ${item.subTab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}` : "");
                              } else {
                                breadcrumb = item.sectionId.charAt(0).toUpperCase() + item.sectionId.slice(1);
                              }

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => handleSearchResultClick(item.sectionId, item.subTab)}
                                  className="flex items-start gap-4 p-4 w-full text-left bg-white border border-[#1B3A6B]/10 hover:border-[#C9A961] transition-all duration-250 group cursor-pointer"
                                >
                                  <div className="p-2.5 bg-[#C9A961]/10 rounded-lg group-hover:bg-[#C9A961]/25 transition-colors shrink-0">
                                    <IconComponent className="w-5 h-5 text-[#1B3A6B]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono font-semibold tracking-wider text-[#C9A961] uppercase">
                                        {breadcrumb}
                                      </span>
                                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#C9A961] group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                    <h4 className="text-sm font-bold text-[#1B3A6B] group-hover:text-[#C9A961] transition-colors mt-0.5">
                                      {title}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                      {desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="py-12 text-center space-y-3">
                          <div className="inline-flex p-3 bg-red-50 text-red-500 rounded-full">
                            <AlertCircle className="w-6 h-6" />
                          </div>
                          <h4 className="text-sm font-bold text-[#1B3A6B]">
                            {language === "ES" ? "Sin resultados" : "No results found"}
                          </h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            {language === "ES"
                              ? `No encontramos coincidencias para "${searchQuery}". Revisa la ortografía o intenta buscar otra palabra.`
                              : `We couldn't find any content matching "${searchQuery}". Please check your spelling or search for another term.`}
                          </p>
                        </div>
                      );
                    }
                  })()
                )}
              </div>

              {/* Search Footer info */}
              <div className="bg-[#1B3A6B] px-6 py-2.5 flex items-center justify-between text-[10px] text-slate-200 font-mono">
                <span>
                  {language === "ES" ? "ESC para salir • Ctrl+K para abrir" : "ESC to exit • Ctrl+K to open"}
                </span>
                <span>
                  {language === "ES"
                    ? "Colegio Bilingüe • Buscador Inteligente"
                    : "Colegio Bilingüe • Smart Search"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
