import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, X, AlertCircle } from "lucide-react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setLoading(false);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Enable camera access to scan monuments. Check your browser settings and try again.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("No camera found on this device. Try uploading a photo instead.");
        } else if (err.name === "NotReadableError") {
          setError("Camera is in use by another app. Close it and try again.");
        } else {
          setError(err.message || "Failed to access camera. Try uploading a photo instead.");
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        onCapture(file);
      },
      "image/jpeg",
      0.9
    );
  }, [onCapture]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400/50 mb-3" />
          <p className="text-white font-semibold">Camera Error</p>
          <p className="text-white/40 text-sm mt-1 max-w-xs">{error}</p>
          <button
            onClick={onClose}
            className="mt-6 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="flex-1 w-full object-cover" />

          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <button onClick={onClose} className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="glass rounded-full px-4 py-1.5">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Camera className="w-4 h-4" /> Position monument in frame
              </span>
            </div>
            <div className="w-10" />
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            </div>
          )}

          {!loading && (
            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-center z-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCapture}
                className="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-white" />
              </motion.button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}