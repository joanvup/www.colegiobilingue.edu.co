import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../i18n";
import { 
  Compass, MapPin, Sparkles, Move, Maximize2, X, Info, 
  BookOpen, Award, Activity, TreePine, Library as LibIcon, 
  Flame, ChevronLeft, ChevronRight, HelpCircle, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Facility {
  id: string;
  category: "academic" | "sports" | "nature" | "social";
  image: string;
  icon: any;
  areaEn: string;
  areaEs: string;
  capacityEn: string;
  capacityEs: string;
  highlightsEn: string[];
  highlightsEs: string[];
}

export default function VirtualTourSection() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"panorama" | "catalog">("panorama");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  
  // Panorama drag scroll state
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Auto-scroll panorama slightly to showcase interactiveness on mount
  useEffect(() => {
    if (activeTab === "panorama" && panoramaRef.current) {
      setTimeout(() => {
        if (panoramaRef.current) {
          panoramaRef.current.scrollTo({
            left: 200,
            behavior: "smooth"
          });
        }
      }, 1000);
    }
  }, [activeTab]);

  // Handle click-to-drag horizontal scroll for the simulated 360 panorama
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panoramaRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - panoramaRef.current.offsetLeft);
    setScrollLeft(panoramaRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !panoramaRef.current) return;
    e.preventDefault();
    setHasDragged(true);
    const x = e.pageX - panoramaRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed modifier
    panoramaRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const panLeft = () => {
    if (panoramaRef.current) {
      panoramaRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const panRight = () => {
    if (panoramaRef.current) {
      panoramaRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const resetView = () => {
    if (panoramaRef.current) {
      panoramaRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  // Detailed Facility Database with curated high-quality representations
  const facilities: Record<string, Facility> = {
    plaza: {
      id: "plaza",
      category: "nature",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
      icon: Compass,
      areaEn: "1,500 m²",
      areaEs: "1.500 m²",
      capacityEn: "400+ people",
      capacityEs: "Más de 400 personas",
      highlightsEn: [
        "Grand architectural arch welcoming students since 1980",
        "Open-air stone plaza decorated with native flowerbeds",
        "Central connection point for all academic buildings"
      ],
      highlightsEs: [
        "Gran arco arquitectónico que da la bienvenida a los estudiantes desde 1980",
        "Plaza de piedra al aire libre decorada con jardines nativos",
        "Punto de conexión central de todos los bloques académicos"
      ]
    },
    scienceLab: {
      id: "scienceLab",
      category: "academic",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
      icon: Award,
      areaEn: "180 m²",
      areaEs: "180 m²",
      capacityEn: "35 students per session",
      capacityEs: "35 estudiantes por sesión",
      highlightsEn: [
        "Dual exhaust safety fume hoods for organic synthesis",
        "Advanced electronic microscopes and digital spectroscopic analysis",
        "Fully equipped workspace exceeding all international safety standards"
      ],
      highlightsEs: [
        "Campanas de extracción de doble flujo para síntesis orgánica",
        "Microscopios electrónicos avanzados y espectroscopia digital",
        "Espacio de trabajo totalmente equipado que supera los estándares internacionales"
      ]
    },
    sportsTrack: {
      id: "sportsTrack",
      category: "sports",
      image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80",
      icon: Activity,
      areaEn: "22,000 m²",
      areaEs: "22.000 m²",
      capacityEn: "800+ active athletes",
      capacityEs: "Más de 800 atletas activos",
      highlightsEn: [
        "FIFA-regulation professional natural grass soccer pitch",
        "Multi-lane synthetic athletics track designed for running championships",
        "Benches and bleachers looking out to the beautiful Cesar landscape"
      ],
      highlightsEs: [
        "Cancha reglamentaria de fútbol con césped natural profesional",
        "Pista sintética de atletismo multi-carril para campeonatos regionales",
        "Gradas espectadoras con vista al hermoso paisaje del Cesar"
      ]
    },
    library: {
      id: "library",
      category: "social",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
      icon: LibIcon,
      areaEn: "450 m²",
      areaEs: "450 m²",
      capacityEn: "120 study spaces",
      capacityEs: "120 puestos de estudio",
      highlightsEn: [
        "Expansive bilingual catalog boasting over 12,000 publications",
        "Dedicated quiet zones, research cubicles, and student-teacher meeting spaces",
        "Full digital terminal bank for database access and global e-journals"
      ],
      highlightsEs: [
        "Amplio catálogo bilingüe con más de 12.000 títulos físicos",
        "Áreas de silencio absoluto, cubículos de investigación y salas de reunión",
        "Terminales de computo para consulta de bases de datos y revistas digitales"
      ]
    },
    primaryPark: {
      id: "primaryPark",
      category: "nature",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
      icon: TreePine,
      areaEn: "4,200 m²",
      areaEs: "4.200 m²",
      capacityEn: "150 active children",
      capacityEs: "150 niños activos",
      highlightsEn: [
        "Protected physical play structures with safety-grade rubber flooring",
        "Surrounded by ancient caracolí trees providing dense natural cool shade",
        "Fully monitored zone ensuring secure physical development and creative play"
      ],
      highlightsEs: [
        "Estructuras de juego protegidas con pisos de caucho de seguridad",
        "Rodeado de árboles ancestrales de caracolí que brindan sombra natural fresca",
        "Zona totalmente monitoreada para el desarrollo motriz y juego recreativo"
      ]
    },
    steamLab: {
      id: "steamLab",
      category: "academic",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      icon: Sparkles,
      areaEn: "120 m²",
      areaEs: "120 m²",
      capacityEn: "30 engineers-in-training",
      capacityEs: "30 ingenieros en formación",
      highlightsEn: [
        "Equipped with multi-material 3D printers and laser cutters",
        "Dedicated LEGO Mindstorms and VEX robotics kits for regional tournaments",
        "Creative collaborative workspace promoting Design Thinking methodologies"
      ],
      highlightsEs: [
        "Equipado con impresoras 3D multimaterial y cortadoras láser",
        "Kits de robótica LEGO Mindstorms y VEX para torneos nacionales",
        "Espacio colaborativo que fomenta metodologías de Design Thinking"
      ]
    },
    swimmingPool: {
      id: "swimmingPool",
      category: "sports",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      icon: Activity,
      areaEn: "1,200 m²",
      areaEs: "1.200 m²",
      capacityEn: "50 active swimmers",
      capacityEs: "50 nadadores activos",
      highlightsEn: [
        "Semi-olympic swimming pool designed for competitive swimming training",
        "Integrated dual-filtration purification and strict water quality monitoring",
        "Supervised by dedicated professional coaches and expert certified lifeguards"
      ],
      highlightsEs: [
        "Piscina semiolímpica diseñada para entrenamientos y competencias de natación",
        "Sistema integrado de filtración dual y monitoreo estricto de calidad del agua",
        "Supervisado permanentemente por entrenadores profesionales y salvavidas certificados"
      ]
    },
    artStudio: {
      id: "artStudio",
      category: "social",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
      icon: Flame,
      areaEn: "150 m²",
      areaEs: "150 m²",
      capacityEn: "40 artists",
      capacityEs: "40 artistas",
      highlightsEn: [
        "Flooded with beautiful indirect natural north-light, perfect for painting",
        "Dedicated space for oil painting, ceramic clay sculpting, and crafts",
        "Annual gallery exhibition showcasing outstanding student works of the year"
      ],
      highlightsEs: [
        "Inundado de luz natural indirecta del norte, ideal para pintar",
        "Espacio dedicado a pintura al óleo, modelado en arcilla y manualidades",
        "Exhibición anual en galería que destaca los mejores trabajos artísticos de los estudiantes"
      ]
    }
  };

  const selectedFacilityData = selectedFacility ? facilities[selectedFacility] : null;

  return (
    <div id="virtual-tour" className="relative py-2 overflow-hidden">
      {/* Absolute background accent lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A961_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />
      
      <div className="relative">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B3A6B]/5 border border-[#1B3A6B]/10 rounded-full mb-4"
          >
            <Compass className="w-4 h-4 text-[#C9A961]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#1B3A6B] font-bold">
              {language === "ES" ? "Experiencia Virtual" : "Virtual Experience"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-cinzel text-3xl md:text-4xl font-bold text-[#1B3A6B] tracking-wide mb-5"
          >
            {t("virtualTour.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-sans text-sm md:text-base text-slate-600 leading-relaxed"
          >
            {t("virtualTour.subtitle")}
          </motion.p>
        </div>

        {/* Elegant Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-none border border-slate-200">
            <button
              onClick={() => setActiveTab("panorama")}
              className={`px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "panorama"
                  ? "bg-[#1B3A6B] text-white shadow-md"
                  : "text-slate-600 hover:text-[#1B3A6B]"
              } cursor-pointer`}
            >
              {t("virtualTour.panoramicView")}
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "catalog"
                  ? "bg-[#1B3A6B] text-white shadow-md"
                  : "text-slate-600 hover:text-[#1B3A6B]"
              } cursor-pointer`}
            >
              {t("virtualTour.facilitiesCatalog")}
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <AnimatePresence mode="wait">
          {activeTab === "panorama" ? (
            <motion.div
              key="panorama-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Simulated 360° Panorama Interactive Container */}
              <div className="relative border border-[#C9A961]/30 overflow-hidden shadow-2xl bg-slate-900 group">
                
                {/* Drag instruction overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#1B3A6B]/90 backdrop-blur-md px-4 py-2 border border-[#C9A961]/40 text-white text-[10px] font-mono tracking-wider uppercase">
                  <Move className="w-3.5 h-3.5 text-[#C9A961] animate-pulse" />
                  <span>{language === "ES" ? "Arrastra para explorar" : "Drag to look around"}</span>
                </div>

                {/* Simulated drag-scroll viewport */}
                <div
                  ref={panoramaRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  className={`w-full h-[450px] overflow-x-auto overflow-y-hidden scrollbar-none select-none relative ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
                >
                  {/* Wide aspect panorama content frame */}
                  <div className="w-[2400px] h-full relative">
                    
                    {/* Cinematic wide image */}
                    <img
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2400&q=80"
                      alt="Fundación Colegio Bilingüe Panoramic View"
                      className="w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Dark luxury contrast shade overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

                    {/* Interactive Pulsing Hotspots absolutely overlaid on panoramic map coordinates */}
                    
                    {/* Hotspot 1: Main Plaza (15% X, 48% Y) */}
                    <div className="absolute left-[15%] top-[48%] -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                        <button
                          onClick={() => !isDragging && !hasDragged && setActiveHotspot(activeHotspot === "plaza" ? null : "plaza")}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1B3A6B]/85 border border-[#C9A961] shadow-[0_0_15px_#C9A961] text-[#C9A961] hover:scale-110 transition-all duration-300 relative focus:outline-none cursor-pointer"
                        >
                          <Compass className="w-5 h-5 animate-spin-slow" />
                          <span className="absolute inset-0 rounded-full border border-[#C9A961] animate-ping opacity-60" />
                        </button>
                        
                        <AnimatePresence>
                          {activeHotspot === "plaza" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-md p-4 shadow-xl border border-[#C9A961]/40 text-left z-30"
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h4 className="font-serif font-bold text-xs text-[#1B3A6B] tracking-wide uppercase">
                                  {t("virtualTour.hotspots.plaza")}
                                </h4>
                                <button onClick={() => setActiveHotspot(null)} className="text-slate-400 hover:text-slate-600">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-600 font-sans leading-relaxed mb-3">
                                {t("virtualTour.hotspots.plazaDesc")}
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedFacility("plaza");
                                  setActiveHotspot(null);
                                }}
                                className="text-[10px] font-mono font-bold tracking-wider text-[#C9A961] uppercase hover:text-[#1B3A6B] flex items-center gap-1 cursor-pointer"
                              >
                                <span>{language === "ES" ? "Explorar" : "Explore"}</span>
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Hotspot 2: Primary Playground (35% X, 35% Y) */}
                    <div className="absolute left-[35%] top-[35%] -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                        <button
                          onClick={() => !isDragging && !hasDragged && setActiveHotspot(activeHotspot === "primaryPark" ? null : "primaryPark")}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1B3A6B]/85 border border-[#C9A961] shadow-[0_0_15px_#C9A961] text-[#C9A961] hover:scale-110 transition-all duration-300 relative focus:outline-none cursor-pointer"
                        >
                          <TreePine className="w-5 h-5" />
                          <span className="absolute inset-0 rounded-full border border-[#C9A961] animate-ping opacity-60" />
                        </button>
                        
                        <AnimatePresence>
                          {activeHotspot === "primaryPark" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-md p-4 shadow-xl border border-[#C9A961]/40 text-left z-30"
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h4 className="font-serif font-bold text-xs text-[#1B3A6B] tracking-wide uppercase">
                                  {t("virtualTour.hotspots.primaryPark")}
                                </h4>
                                <button onClick={() => setActiveHotspot(null)} className="text-slate-400 hover:text-slate-600">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-600 font-sans leading-relaxed mb-3">
                                {t("virtualTour.hotspots.primaryParkDesc")}
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedFacility("primaryPark");
                                  setActiveHotspot(null);
                                }}
                                className="text-[10px] font-mono font-bold tracking-wider text-[#C9A961] uppercase hover:text-[#1B3A6B] flex items-center gap-1 cursor-pointer"
                              >
                                <span>{language === "ES" ? "Explorar" : "Explore"}</span>
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Hotspot 3: Science Labs (55% X, 52% Y) */}
                    <div className="absolute left-[55%] top-[52%] -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                        <button
                          onClick={() => !isDragging && !hasDragged && setActiveHotspot(activeHotspot === "scienceLab" ? null : "scienceLab")}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1B3A6B]/85 border border-[#C9A961] shadow-[0_0_15px_#C9A961] text-[#C9A961] hover:scale-110 transition-all duration-300 relative focus:outline-none cursor-pointer"
                        >
                          <Award className="w-5 h-5" />
                          <span className="absolute inset-0 rounded-full border border-[#C9A961] animate-ping opacity-60" />
                        </button>
                        
                        <AnimatePresence>
                          {activeHotspot === "scienceLab" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-md p-4 shadow-xl border border-[#C9A961]/40 text-left z-30"
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h4 className="font-serif font-bold text-xs text-[#1B3A6B] tracking-wide uppercase">
                                  {t("virtualTour.hotspots.scienceLab")}
                                </h4>
                                <button onClick={() => setActiveHotspot(null)} className="text-slate-400 hover:text-slate-600">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-600 font-sans leading-relaxed mb-3">
                                {t("virtualTour.hotspots.scienceLabDesc")}
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedFacility("scienceLab");
                                  setActiveHotspot(null);
                                }}
                                className="text-[10px] font-mono font-bold tracking-wider text-[#C9A961] uppercase hover:text-[#1B3A6B] flex items-center gap-1 cursor-pointer"
                              >
                                <span>{language === "ES" ? "Explorar" : "Explore"}</span>
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Hotspot 4: Library (72% X, 42% Y) */}
                    <div className="absolute left-[72%] top-[42%] -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                        <button
                          onClick={() => !isDragging && !hasDragged && setActiveHotspot(activeHotspot === "library" ? null : "library")}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1B3A6B]/85 border border-[#C9A961] shadow-[0_0_15px_#C9A961] text-[#C9A961] hover:scale-110 transition-all duration-300 relative focus:outline-none cursor-pointer"
                        >
                          <LibIcon className="w-5 h-5" />
                          <span className="absolute inset-0 rounded-full border border-[#C9A961] animate-ping opacity-60" />
                        </button>
                        
                        <AnimatePresence>
                          {activeHotspot === "library" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-md p-4 shadow-xl border border-[#C9A961]/40 text-left z-30"
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h4 className="font-serif font-bold text-xs text-[#1B3A6B] tracking-wide uppercase">
                                  {t("virtualTour.hotspots.library")}
                                </h4>
                                <button onClick={() => setActiveHotspot(null)} className="text-slate-400 hover:text-slate-600">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-600 font-sans leading-relaxed mb-3">
                                {t("virtualTour.hotspots.libraryDesc")}
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedFacility("library");
                                  setActiveHotspot(null);
                                }}
                                className="text-[10px] font-mono font-bold tracking-wider text-[#C9A961] uppercase hover:text-[#1B3A6B] flex items-center gap-1 cursor-pointer"
                              >
                                <span>{language === "ES" ? "Explorar" : "Explore"}</span>
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Hotspot 5: Sports Complex (88% X, 58% Y) */}
                    <div className="absolute left-[88%] top-[58%] -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative">
                        <button
                          onClick={() => !isDragging && !hasDragged && setActiveHotspot(activeHotspot === "sportsTrack" ? null : "sportsTrack")}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1B3A6B]/85 border border-[#C9A961] shadow-[0_0_15px_#C9A961] text-[#C9A961] hover:scale-110 transition-all duration-300 relative focus:outline-none cursor-pointer"
                        >
                          <Activity className="w-5 h-5" />
                          <span className="absolute inset-0 rounded-full border border-[#C9A961] animate-ping opacity-60" />
                        </button>
                        
                        <AnimatePresence>
                          {activeHotspot === "sportsTrack" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-md p-4 shadow-xl border border-[#C9A961]/40 text-left z-30"
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <h4 className="font-serif font-bold text-xs text-[#1B3A6B] tracking-wide uppercase">
                                  {t("virtualTour.hotspots.sportsTrack")}
                                </h4>
                                <button onClick={() => setActiveHotspot(null)} className="text-slate-400 hover:text-slate-600">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-600 font-sans leading-relaxed mb-3">
                                {t("virtualTour.hotspots.sportsTrackDesc")}
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedFacility("sportsTrack");
                                  setActiveHotspot(null);
                                }}
                                className="text-[10px] font-mono font-bold tracking-wider text-[#C9A961] uppercase hover:text-[#1B3A6B] flex items-center gap-1 cursor-pointer"
                              >
                                <span>{language === "ES" ? "Explorar" : "Explore"}</span>
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sub-bar controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900 border-t border-[#C9A961]/20 gap-4">
                  <span className="text-[11px] font-mono tracking-wide text-slate-400 text-center sm:text-left">
                    {t("virtualTour.panInstruction")}
                  </span>
                  
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={panLeft}
                      className="p-2 border border-[#C9A961]/30 text-slate-300 hover:text-[#C9A961] hover:border-[#C9A961] transition-all bg-white/5 cursor-pointer"
                      title={t("virtualTour.panLeft")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetView}
                      className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A961] border border-[#C9A961]/30 hover:border-[#C9A961] hover:bg-[#C9A961]/10 transition-all bg-white/5 cursor-pointer"
                    >
                      {t("virtualTour.reset")}
                    </button>
                    <button
                      onClick={panRight}
                      className="p-2 border border-[#C9A961]/30 text-slate-300 hover:text-[#C9A961] hover:border-[#C9A961] transition-all bg-white/5 cursor-pointer"
                      title={t("virtualTour.panRight")}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="catalog-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Category Filter Bar */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { key: "all", label: t("virtualTour.all") },
                  { key: "academic", label: t("virtualTour.academic") },
                  { key: "sports", label: t("virtualTour.sports") },
                  { key: "nature", label: t("virtualTour.nature") },
                  { key: "social", label: t("virtualTour.social") }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 text-xs font-semibold tracking-wider transition-all duration-300 border rounded-none ${
                      selectedCategory === cat.key
                        ? "bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                    } cursor-pointer`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid Layout of Facilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.values(facilities)
                  .filter(f => selectedCategory === "all" || f.category === selectedCategory)
                  .map((fac) => {
                    const hotspotTitleKey = `virtualTour.hotspots.${fac.id}`;
                    const hotspotDescKey = `virtualTour.hotspots.${fac.id}Desc`;
                    return (
                      <motion.div
                        layout
                        key={fac.id}
                        className="bg-[#F8F6F1] border border-slate-200 hover:border-[#C9A961]/50 group transition-all duration-300 flex flex-col shadow-sm"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={fac.image}
                            alt={t(hotspotTitleKey)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                              <Eye className="w-4 h-4 text-[#C9A961]" />
                              {language === "ES" ? "Explorar" : "Explore"}
                            </span>
                          </div>
                          
                          {/* Category Tag */}
                          <div className="absolute top-3 left-3 bg-[#1B3A6B]/90 backdrop-blur-md border border-[#C9A961]/35 text-white px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest shadow-md">
                            {fac.category}
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-serif font-bold text-[#1B3A6B] text-lg leading-tight tracking-wide group-hover:text-[#C9A961] transition-colors">
                              {t(hotspotTitleKey)}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {t(hotspotDescKey)}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedFacility(fac.id)}
                            className="w-full text-center py-2.5 bg-white border border-[#1B3A6B]/20 text-[#1B3A6B] group-hover:bg-[#1B3A6B] group-hover:text-white group-hover:border-[#1B3A6B] font-mono font-bold text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer"
                          >
                            {t("virtualTour.exploreBtn")}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal/Lightbox Overlay for detail specs */}
        <AnimatePresence>
          {selectedFacilityData && (() => {
            const fac = selectedFacilityData;
            const hotspotTitleKey = `virtualTour.hotspots.${fac.id}`;
            const hotspotDescKey = `virtualTour.hotspots.${fac.id}Desc`;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4 sm:p-6"
                onClick={() => setSelectedFacility(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 30 }}
                  className="bg-[#F8F6F1] border border-[#C9A961]/40 rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedFacility(null)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer"
                    title={t("virtualTour.modal.close")}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Left Column - Large Image representation */}
                  <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto">
                    <img
                      src={fac.image}
                      alt={t(hotspotTitleKey)}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="bg-[#C9A961] text-slate-950 text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1">
                        {fac.category}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-white tracking-wide mt-2">
                        {t(hotspotTitleKey)}
                      </h3>
                    </div>
                  </div>

                  {/* Right Column - Spec tables and key info items */}
                  <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-400">
                          {language === "ES" ? "Descripción General" : "Facility Overview"}
                        </span>
                        <p className="font-sans text-sm text-slate-700 leading-relaxed">
                          {t(hotspotDescKey)}
                        </p>
                      </div>

                      {/* Technical Specs Bento Area */}
                      <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#C9A961] flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" />
                            {t("virtualTour.modal.area")}
                          </span>
                          <p className="text-sm font-sans font-bold text-[#1B3A6B]">
                            {language === "ES" ? fac.areaEs : fac.areaEn}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#C9A961] flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            {t("virtualTour.modal.capacity")}
                          </span>
                          <p className="text-sm font-sans font-bold text-[#1B3A6B]">
                            {language === "ES" ? fac.capacityEs : fac.capacityEn}
                          </p>
                        </div>
                      </div>

                      {/* Bullet Highlights */}
                      <div className="space-y-3">
                        <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-400">
                          {t("virtualTour.modal.keyFeatures")}
                        </span>
                        <ul className="space-y-2.5">
                          {(language === "ES" ? fac.highlightsEs : fac.highlightsEn).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961] shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedFacility(null)}
                      className="w-full text-center py-3 bg-[#1B3A6B] hover:bg-[#C9A961] text-white hover:text-[#1B3A6B] font-mono font-bold text-[10px] uppercase tracking-widest transition-all duration-300 mt-6 cursor-pointer"
                    >
                      {t("virtualTour.modal.close")}
                    </button>
                  </div>

                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

      </div>
    </div>
  );
}
