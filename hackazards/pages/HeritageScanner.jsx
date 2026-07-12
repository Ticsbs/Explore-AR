import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, MapPin, Calendar, BookOpen, Sparkles, RotateCcw,
  AlertCircle, Lightbulb, ScanLine, X, Check
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import CameraCapture from "@/components/explore/CameraCapture";

export default function HeritageScanner() {
  const [state, setState] = useState("idle");
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, etc.)");
      setState("error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image is too large. Please use an image under 10MB.");
      setState("error");
      return;
    }

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setState("uploading");
    setErrorMessage("");

    try {
      let uploadRes;
      try {
        uploadRes = await base44.integrations.Core.UploadFile({ file });
        if (!uploadRes?.file_url) {
          throw new Error("File upload failed — no URL returned");
        }
      } catch (uploadErr) {
        console.error("[HeritageScanner] Upload error:", uploadErr);
        throw new Error("Failed to upload image. Please check your connection and try again.");
      }

      setState("analyzing");

      let aiRes;
      try {
        aiRes = await base44.integrations.Core.InvokeLLM({
          prompt: `You are an expert heritage and monument identification AI. Analyze this image and identify the monument or heritage site.

If you can confidently identify it, respond with identified=true and provide:
- name: The official name of the monument/site
- location: City, Country
- year_built: Approximate year or period of construction
- history: A concise 150-word historical summary
- facts: 3 interesting facts about it

If you cannot confidently identify it (unclear photo, not a monument, or you're unsure), respond with identified=false and provide:
- alternative_suggestions: 2-3 possible monument names it could be, or empty array if truly unknown

Be honest — do not guess or fabricate information.`,
          file_urls: [uploadRes.file_url],
          response_json_schema: {
            type: "object",
            properties: {
              identified: { type: "boolean" },
              name: { type: "string" },
              location: { type: "string" },
              year_built: { type: "string" },
              history: { type: "string" },
              facts: { type: "array", items: { type: "string" } },
              alternative_suggestions: { type: "array", items: { type: "string" } }
            }
          }
        });
      } catch (aiErr) {
        console.error("[HeritageScanner] AI identification error:", aiErr);
        throw new Error("AI analysis failed. The image was uploaded successfully, but the AI couldn't process it. Please try again.");
      }

      if (!aiRes || typeof aiRes !== "object") {
        console.error("[HeritageScanner] Invalid AI response type:", typeof aiRes, aiRes);
        throw new Error("AI returned an invalid response. Please try again.");
      }

      if (typeof aiRes.identified !== "boolean") {
        console.error("[HeritageScanner] Missing 'identified' field in AI response:", aiRes);
        throw new Error("AI returned an unexpected response format. Please try again.");
      }

      setResult(aiRes);
      setState("results");
    } catch (err) {
      console.error("[HeritageScanner] Full error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setState("error");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setImagePreview(null);
    setResult(null);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (state === "idle") {
    return (
      <>
        <div className="min-h-screen bg-[#0B1220] pb-28">
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-teal-400" />
              <h1 className="text-2xl font-bold text-white font-heading">Heritage Scanner</h1>
            </div>
            <p className="text-white/40 text-sm mt-1">Identify any monument or heritage site with AI</p>
          </div>

          <div className="px-4 mt-6">
            <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-white/10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center mb-4"
              >
                <Camera className="w-10 h-10 text-teal-400" />
              </motion.div>
              <p className="text-white font-semibold text-lg">Scan a Monument</p>
              <p className="text-white/40 text-sm mt-1 text-center max-w-xs">
                Take a photo or upload an image of any heritage site, and AI will identify it for you
              </p>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCameraOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-semibold flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Take Photo
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl glass text-white/60 text-sm font-medium flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Upload
                </motion.button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="px-4 mt-6">
            <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-white/40 text-xs">
                Camera access will be requested when you tap "Take Photo". You can also upload from your gallery.
              </p>
            </div>
          </div>

          <div className="px-4 mt-6">
            <h3 className="text-white/60 text-sm font-semibold mb-3">How it works</h3>
            <div className="space-y-2">
              {[
                { step: "1", text: "Take or upload a photo of a monument", icon: Camera },
                { step: "2", text: "AI analyzes the image with vision", icon: ScanLine },
                { step: "3", text: "Get name, history, and fun facts", icon: Sparkles },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3 glass-card rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold">
                    {s.step}
                  </div>
                  <s.icon className="w-4 h-4 text-white/30" />
                  <p className="text-white/60 text-sm">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {cameraOpen && (
            <CameraCapture
              onCapture={(file) => {
                setCameraOpen(false);
                handleFile(file);
              }}
              onClose={() => setCameraOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  if (state === "uploading" || state === "analyzing") {
    return (
      <div className="min-h-screen bg-[#0B1220] pb-28 flex flex-col items-center justify-center px-4">
        {imagePreview && (
          <img src={imagePreview} alt="Uploaded monument" className="w-64 h-64 object-cover rounded-3xl mb-8 shadow-2xl" />
        )}
        <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin mb-4" />
        <p className="text-white font-semibold text-lg">
          {state === "uploading" ? "Uploading photo..." : "Identifying monument..."}
        </p>
        <p className="text-white/40 text-sm mt-1">
          {state === "uploading" ? "Preparing your image" : "AI is analyzing the heritage site"}
        </p>
      </div>
    );
  }

  if (state === "results" && result) {
    return (
      <div className="min-h-screen bg-[#0B1220] pb-28">
        <div className="relative h-72 sm:h-80">
          <img src={imagePreview} alt="Monument" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
          <button onClick={reset} className="absolute top-4 left-4 glass rounded-full w-9 h-9 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="px-4 -mt-6 relative z-10">
          {result.identified ? (
            <div className="glass-card rounded-3xl p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-teal-400" />
                  </div>
                  <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">Identified</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-heading">{result.name}</h2>
                {result.location && (
                  <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {result.location}
                  </p>
                )}
              </div>

              {result.year_built && (
                <div className="flex items-center gap-3 bg-white/[0.03] rounded-2xl p-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white/30 text-xs">Year Built</p>
                    <p className="text-white text-sm font-medium">{result.year_built}</p>
                  </div>
                </div>
              )}

              {result.history && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <h3 className="text-white/60 text-sm font-semibold">History</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{result.history}</p>
                </div>
              )}

              {result.facts?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-white/60 text-sm font-semibold">Interesting Facts</h3>
                  </div>
                  <div className="space-y-2">
                    {result.facts.map((fact, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white/[0.03] rounded-xl p-3">
                        <span className="text-yellow-400 text-sm mt-0.5">✦</span>
                        <p className="text-white/60 text-sm">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white font-heading">Couldn't Identify</h2>
              <p className="text-white/40 text-sm mt-2 max-w-xs mx-auto">
                We couldn't confidently identify this monument. Try a clearer photo from a different angle.
              </p>
              {result.alternative_suggestions?.length > 0 && (
                <div className="mt-6">
                  <p className="text-white/30 text-xs mb-2">Did you mean?</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.alternative_suggestions.map((s) => (
                      <span key={s} className="px-3 py-1.5 rounded-full bg-white/5 text-white/60 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={reset}
            className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 glow-blue"
          >
            <RotateCcw className="w-4 h-4" /> Scan Another Monument
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28 flex flex-col items-center justify-center px-4">
      <AlertCircle className="w-12 h-12 text-red-400/50 mx-auto mb-3" />
      <p className="text-white font-semibold">Something went wrong</p>
      <p className="text-white/40 text-sm mt-1 text-center max-w-xs">
        {errorMessage || "Please try again"}
      </p>
      <button
        onClick={reset}
        className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-semibold"
      >
        Try Again
      </button>
    </div>
  );
}