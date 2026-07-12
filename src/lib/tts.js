// Text-to-Speech utility using browser API
export function speak(text, lang = "en") {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

export function stopSpeaking() {
  try {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  } catch {}
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}