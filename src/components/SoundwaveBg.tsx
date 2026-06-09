import { useEffect, useState } from "react";

export default function SoundwaveBg() {
  const [numLines, setNumLines] = useState(30);

  useEffect(() => {
    // Adapt lines to screen width dynamically
    const handleResize = () => {
      const computed = Math.floor(window.innerWidth / 40);
      setNumLines(Math.max(10, Math.min(60, computed)));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sci-Fi Grid Background (1px faded lines) */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(196, 192, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(196, 192, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Atmospheric Center Glow / Moving Orbs */}
      <div 
        className="absolute rounded-full bg-primary/10 blur-[130px] opacity-30 animate-pulse-glow"
        style={{
          width: "500px",
          height: "500px",
          top: "-150px",
          left: "-100px",
          animation: "floatSlow 14s infinite ease-in-out alternate"
        }}
      />
      <div 
        className="absolute rounded-full bg-secondary/15 blur-[120px] opacity-45"
        style={{
          width: "450px",
          height: "450px",
          bottom: "-100px",
          right: "-50px",
          animation: "floatSlow 18s infinite ease-in-out alternate-reverse"
        }}
      />

      {/* Embedded waves/sound bars at the bottom background */}
      <div className="absolute bottom-0 left-0 right-0 h-[250px] opacity-20 flex justify-between items-end px-4 overflow-hidden select-none grayscale contrast-125">
        {Array.from({ length: numLines }).map((_, index) => {
          // Randomized height, duration, and delay
          const heightPercent = 20 + Math.random() * 50;
          const duration = 1.2 + Math.random() * 2.0;
          const delay = -Math.random() * 3.0;

          return (
            <div
              key={index}
              style={{
                width: "2px",
                height: `${heightPercent}%`,
                background: "linear-gradient(to top, transparent, #c4c0ff, transparent)",
                animation: `floatSoundwave ${duration}s ease-in-out infinite alternate`,
                animationDelay: `${delay}s`,
              }}
              className="rounded-full mx-1 opacity-70"
            />
          );
        })}
      </div>

      <style>{`
        @keyframes floatSlow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.08); }
          100% { transform: translate(-20px, 30px) scale(0.95); }
        }
        @keyframes floatSoundwave {
          0% { height: 8%; opacity: 0.15; }
          100% { height: 65%; opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
