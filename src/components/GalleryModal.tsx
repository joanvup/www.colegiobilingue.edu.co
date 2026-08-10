import { useState, useEffect } from "react";
import { useLanguage } from "../i18n";
import { X, ChevronLeft, ChevronRight, Loader2, Folder, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Subfolder {
  name: string;
  images: string[];
}

interface Album {
  id: string;
  name: string;
  subfolders?: Subfolder[];
  images: string[];
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatSubfolderName = (name: string, lang: string) => {
  if (/^\d{6}$/.test(name)) {
    const year = name.substring(0, 4);
    const monthCode = name.substring(4, 6);
    const monthsEN: Record<string, string> = {
      "01": "January", "02": "February", "03": "March", "04": "April",
      "05": "May", "06": "June", "07": "July", "08": "August",
      "09": "September", "10": "October", "11": "November", "12": "December"
    };
    const monthsES: Record<string, string> = {
      "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
      "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
      "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre"
    };
    const monthName = lang === "EN" ? monthsEN[monthCode] : monthsES[monthCode];
    if (monthName) {
      return `${monthName} ${year}`;
    }
  }
  return name;
};

export default function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const { language, t } = useLanguage();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbumId, setActiveAlbumId] = useState<string>("");
  const [activeSubfolderName, setActiveSubfolderName] = useState<string>("ALL");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 6;

  // Fetch albums and images from our server-side API
  useEffect(() => {
    if (!isOpen) return;

    const fetchGallery = async () => {
      try {
        setLoading(true);
        let data: Album[] = [];
        try {
          const response = await fetch("/api/gallery");
          if (response.ok) {
            data = await response.json();
          } else {
            // Fallback for static cPanel servers without Node.js
            const fallbackResponse = await fetch("/gallery.json");
            if (fallbackResponse.ok) {
              data = await fallbackResponse.json();
            }
          }
        } catch (err) {
          console.warn("API fetch failed, trying static gallery.json:", err);
          const fallbackResponse = await fetch("/gallery.json");
          if (fallbackResponse.ok) {
            data = await fallbackResponse.json();
          }
        }

        setAlbums(data);
        if (data.length > 0) {
          setActiveAlbumId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [isOpen]);

  // Reset page and subfolder when active album changes
  useEffect(() => {
    setCurrentPage(1);
    setActiveSubfolderName("ALL");
    setActivePhotoIndex(null);
  }, [activeAlbumId]);

  // Reset page when subfolder changes
  useEffect(() => {
    setCurrentPage(1);
    setActivePhotoIndex(null);
  }, [activeSubfolderName]);

  const activeAlbum = albums.find((a) => a.id === activeAlbumId);
  
  // Computed list of images based on active album and active subfolder filter
  const visibleImages = (() => {
    if (!activeAlbum) return [];
    if (activeSubfolderName === "ALL") return activeAlbum.images;
    const sub = activeAlbum.subfolders?.find(sf => sf.name === activeSubfolderName);
    return sub ? sub.images : [];
  })();

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (visibleImages.length === 0) return;

      if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) => (prev !== null && prev < visibleImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : visibleImages.length - 1));
      } else if (e.key === "Escape") {
        setActivePhotoIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, visibleImages]);

  // Pagination math
  const totalPages = Math.ceil(visibleImages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedImages = visibleImages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="gallery-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1527]/90 backdrop-blur-md p-4 sm:p-6 md:p-10"
        >
          {/* Main Gallery Container */}
          <motion.div
            id="gallery-modal-container"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-6xl h-[85vh] flex flex-col bg-[#F8F6F1] border border-[#C9A961]/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1B3A6B]/10 bg-white">
              <h3 className="font-serif text-lg md:text-xl font-bold text-[#1B3A6B] tracking-wide">
                {t("nav.galleryTitle")}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-[#1B3A6B] hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                title={t("nav.galleryClose")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-500">
                  <Loader2 className="w-8 h-8 text-[#C9A961] animate-spin" />
                  <p className="text-xs font-sans tracking-widest uppercase">{t("nav.galleryLoading")}</p>
                </div>
              ) : albums.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400 text-center">
                  <Folder className="w-12 h-12 stroke-[1.5] text-slate-300" />
                  <p className="text-sm font-sans">{t("nav.galleryNoImages")}</p>
                </div>
              ) : (
                <>
                  {/* Category/Album Selectors */}
                  <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                    {albums.map((album) => (
                      <button
                        key={album.id}
                        onClick={() => {
                          setActiveAlbumId(album.id);
                        }}
                        className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all duration-300 rounded-none border ${
                          activeAlbumId === album.id
                            ? "bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-md"
                            : "bg-white text-slate-600 border-slate-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                        } cursor-pointer`}
                      >
                        {album.name} ({album.images.length})
                      </button>
                    ))}
                  </div>

                  {/* Subfolders/Months selector */}
                  {activeAlbum && activeAlbum.subfolders && activeAlbum.subfolders.length > 0 && (
                    <div className="flex flex-col gap-2.5 bg-slate-100/50 p-4 border border-slate-200/60 rounded-none">
                      <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-bold">
                        {language === "EN" ? "Filter by period / folder:" : "Filtrar por período / carpeta:"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setActiveSubfolderName("ALL")}
                          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                            activeSubfolderName === "ALL"
                              ? "bg-[#C9A961] text-white shadow-sm"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-[#C9A961] hover:text-[#C9A961]"
                          } cursor-pointer`}
                        >
                          {language === "EN" ? "All Photos" : "Todas las Fotos"} ({activeAlbum.images.length})
                        </button>
                        {activeAlbum.subfolders.map((sub) => (
                          <button
                            key={sub.name}
                            onClick={() => setActiveSubfolderName(sub.name)}
                            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                              activeSubfolderName === sub.name
                                ? "bg-[#C9A961] text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-[#C9A961] hover:text-[#C9A961]"
                            } cursor-pointer`}
                          >
                            {formatSubfolderName(sub.name, language)} ({sub.images.length})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Grid */}
                  {visibleImages.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center gap-3 text-slate-400">
                      <ImageIcon className="w-10 h-10 stroke-[1.5] text-slate-300" />
                      <p className="text-xs font-sans">{t("nav.galleryNoImages")}</p>
                    </div>
                  ) : (
                    <>
                      <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                      >
                        {paginatedImages.map((imagePath, index) => {
                          const realIndex = startIndex + index;
                          return (
                            <motion.div
                              key={imagePath}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              onClick={() => setActivePhotoIndex(realIndex)}
                              className="group relative aspect-[4/3] rounded-none overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                              <img
                                src={imagePath}
                                alt={`${activeAlbum?.name} ${realIndex + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Minimalist Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <span className="text-white text-xs font-medium tracking-wide uppercase">
                                  {activeAlbum?.name} {activeSubfolderName !== "ALL" ? `— ${formatSubfolderName(activeSubfolderName, language)}` : ""} — {realIndex + 1}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-200">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-none border border-slate-200 bg-white text-slate-600 hover:text-[#1B3A6B] hover:border-[#1B3A6B] disabled:opacity-30 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                            title={language === "EN" ? "Previous Page" : "Página Anterior"}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 flex items-center justify-center text-xs font-sans font-bold transition-all duration-300 border ${
                                  currentPage === page
                                    ? "bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                                } cursor-pointer`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-none border border-slate-200 bg-white text-slate-600 hover:text-[#1B3A6B] hover:border-[#1B3A6B] disabled:opacity-30 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                            title={language === "EN" ? "Next Page" : "Página Siguiente"}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Immersive Lightbox Overlay */}
          <AnimatePresence>
            {activePhotoIndex !== null && activeAlbum && (
              <motion.div
                id="gallery-lightbox-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/95 p-4 select-none"
              >
                {/* Close Lightbox */}
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer z-50"
                  title={language === "EN" ? "Close" : "Cerrar"}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Left Arrow */}
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : visibleImages.length - 1
                    )
                  }
                  className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-all duration-300 cursor-pointer z-40"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Image Container with Dynamic Transition */}
                <div className="relative w-full max-w-4xl h-[55vh] md:h-[62vh] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activePhotoIndex}
                      src={visibleImages[activePhotoIndex]}
                      alt={`${activeAlbum.name} ${activePhotoIndex + 1}`}
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="max-w-full max-h-full object-contain shadow-2xl border border-white/10"
                    />
                  </AnimatePresence>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev !== null && prev < visibleImages.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-all duration-300 cursor-pointer z-40"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                {/* Horizontal Sliding Filmstrip of Thumbnails */}
                <div className="absolute bottom-24 left-0 right-0 flex justify-center px-6">
                  <div className="flex items-center gap-2 max-w-2xl overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {visibleImages.map((img, idx) => (
                      <button
                        key={img}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`relative flex-shrink-0 w-16 h-12 border-2 transition-all duration-300 ${
                          activePhotoIndex === idx
                            ? "border-[#C9A961] scale-105 shadow-md shadow-[#C9A961]/30"
                            : "border-transparent opacity-40 hover:opacity-100"
                        } overflow-hidden cursor-pointer`}
                      >
                        <img
                          src={img}
                          alt={`${activeAlbum.name} thumbnail ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-center">
                  <span className="text-[#C9A961] text-xs font-bold tracking-widest uppercase">
                    {activeAlbum.name} {activeSubfolderName !== "ALL" ? `— ${formatSubfolderName(activeSubfolderName, language)}` : ""}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {activePhotoIndex + 1} / {visibleImages.length}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
