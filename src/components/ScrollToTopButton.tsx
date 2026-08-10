import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      id="scroll-to-top-btn"
      className={`fixed bottom-24 right-6 z-50 p-4 bg-[#1B3A6B] hover:bg-[#C9A961] text-white hover:text-[#1B3A6B] rounded-full shadow-2xl transition-all duration-500 hover:scale-110 flex items-center justify-center border border-[#C9A961]/30 hover:border-[#1B3A6B]/30 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-75 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient pulsing ring matching the gold accent */}
        {isVisible && (
          <span className="absolute inset-0 w-full h-full rounded-full bg-[#C9A961] opacity-50 animate-ping -z-10" />
        )}
        <ArrowUp className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" />
      </div>
    </button>
  );
}
