import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon as ImageIconLucide, MapPin } from "lucide-react";

// Elegant travel illustration for when no image is available
export default function EmptyIllustration({ icon: Icon = ImageIconLucide, label = "No image available", className = "" }) {
  return (
    <div className={`bg-gradient-to-br from-blue-500/10 via-teal-500/5 to-purple-500/10 flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2"
      >
        <Icon className="w-8 h-8 text-white/20" />
      </motion.div>
      <p className="text-white/20 text-xs">{label}</p>
    </div>
  );
}

// Animated swipeable image carousel
export function ImageCarousel({ images, alt = "" }) {
  const [index, setIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  const validImages = images?.filter((_, i) => !imgErrors[i]) || [];
  const current = validImages[index % validImages.length];

  const handleError = (i) => {
    setImgErrors(prev => ({ ...prev, [i]: true }));
  };

  if (!validImages.length) {
    return <EmptyIllustration icon={MapPin} label="Image unavailable" className="w-full h-full" />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        src={current}
        alt={alt}
        onError={() => handleError(index)}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {validImages.length > 1 && (
        <>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {validImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setIndex(prev => (prev - 1 + validImages.length) % validImages.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center z-10"
          >
            <span className="text-white">‹</span>
          </button>
          <button
            onClick={() => setIndex(prev => (prev + 1) % validImages.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center z-10"
          >
            <span className="text-white">›</span>
          </button>
        </>
      )}
    </div>
  );
}