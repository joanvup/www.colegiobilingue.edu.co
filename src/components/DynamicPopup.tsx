import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink } from "lucide-react";

export default function DynamicPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Check if we already showed it this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
    if (hasSeenPopup) return;

    fetch("/api/popup")
      .then(res => res.json())
      .then(data => {
        if (!data.enabled || !data.imageBase64) return;

        const now = new Date();
        now.setHours(0, 0, 0, 0); // Strip time for date comparisons
        const start = data.startDate ? new Date(data.startDate + "T00:00:00") : null;
        let end = data.endDate ? new Date(data.endDate + "T00:00:00") : null;
        
        if (end) {
          // Set end date to end of the day
          end.setHours(23, 59, 59, 999);
        }
        
        // Ensure date range matches if specified
        if (start && now < start) return;
        if (end && now > end) return;

        setConfig(data);
        setIsOpen(true);
        sessionStorage.setItem("hasSeenPopup", "true");
      })
      .catch(err => console.error("Failed to load popup config", err));
  }, []);

  if (!isOpen || !config) return null;

  const handleClose = () => setIsOpen(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="relative max-w-5xl w-auto flex flex-col bg-transparent rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative overflow-hidden group flex items-center justify-center max-h-[85vh]">
            {config.linkUrl ? (
              <a href={config.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full outline-none">
                <img 
                  src={config.imageBase64} 
                  alt="Aviso Institucional" 
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                  <span className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full font-medium text-sm border border-white/30 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Abrir enlace
                  </span>
                </div>
              </a>
            ) : (
              <img 
                src={config.imageBase64} 
                alt="Aviso Institucional" 
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
