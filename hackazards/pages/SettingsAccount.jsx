import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, FileText, Loader2, Check, Calendar, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/LanguageContext";

const PRIVACY_KEY = "explorear_privacy";
const CALENDARIFIC_KEY = "calendarific_api_key";

export default function SettingsAccount() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [privacy, setPrivacy] = useState({ location_history: false, analytics: false });
  const [calendarificKey, setCalendarificKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then((u) => {
        setUser(u);
        setPhone(u.phone || localStorage.getItem("explorear_phone") || "");
        setBio(u.bio || localStorage.getItem("explorear_bio") || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    try {
      const savedPrivacy = JSON.parse(localStorage.getItem(PRIVACY_KEY) || "null");
      if (savedPrivacy) setPrivacy(savedPrivacy);
    } catch {}

    setCalendarificKey(localStorage.getItem(CALENDARIFIC_KEY) || "");
  }, []);

  const handleSaveKey = () => {
    if (calendarificKey.trim()) {
      localStorage.setItem(CALENDARIFIC_KEY, calendarificKey.trim());
    } else {
      localStorage.removeItem(CALENDARIFIC_KEY);
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Try to persist via updateMe (works for custom fields on User entity)
      await base44.auth.updateMe({ phone, bio });
    } catch {
      // Fallback to localStorage if updateMe doesn't support these fields
      localStorage.setItem("explorear_phone", phone);
      localStorage.setItem("explorear_bio", bio);
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const togglePrivacy = (key) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    localStorage.setItem(PRIVACY_KEY, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] pb-28">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white font-heading">{t("page.account")}</h1>
      </div>

      {/* Profile Info */}
      <div className="px-4 mt-4">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{t("account.profile_info")}</p>
        <div className="glass-card rounded-2xl p-4 space-y-4">
          {/* Name (read-only) */}
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white/40 text-xs">Name</p>
              <p className="text-white text-sm font-medium">{user?.full_name || "—"}</p>
            </div>
          </div>
          {/* Email (read-only) */}
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white/40 text-xs">Email</p>
              <p className="text-white text-sm font-medium truncate">{user?.email || "—"}</p>
            </div>
          </div>
          {/* Phone (editable) */}
          <div>
            <label className="text-white/40 text-xs flex items-center gap-1 mb-1">
              <Phone className="w-3 h-3" /> {t("account.phone")}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none"
            />
          </div>
          {/* Bio (editable) */}
          <div>
            <label className="text-white/40 text-xs flex items-center gap-1 mb-1">
              <FileText className="w-3 h-3" /> {t("account.bio")}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
            {saved ? t("account.saved") : t("account.save_changes")}
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="px-4 mt-6">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{t("account.connected")}</p>
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Google</p>
            <p className="text-white/40 text-xs">{user?.email ? "Connected" : "Not connected"}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${user?.email ? "bg-teal-500/10 text-teal-300" : "bg-white/5 text-white/40"}`}>
            {user?.email ? "Active" : "—"}
          </span>
        </div>
      </div>

      {/* Privacy */}
      <div className="px-4 mt-6">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{t("account.privacy")}</p>
        <div className="glass-card rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{t("account.location_history")}</p>
            </div>
            <Switch checked={privacy.location_history} onCheckedChange={() => togglePrivacy("location_history")} />
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{t("account.analytics")}</p>
            </div>
            <Switch checked={privacy.analytics} onCheckedChange={() => togglePrivacy("analytics")} />
          </div>
        </div>
      </div>

      {/* Calendarific API Key — for festival/holiday data */}
      <div className="px-4 mt-6">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Festival Data (Calendarific)</p>
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-medium">Calendarific API Key</p>
              <p className="text-white/40 text-xs mt-0.5">
                Enter your key to fetch real holiday data for your location. Without a key, the app falls back to Nager.Date (limited coverage).
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={calendarificKey}
              onChange={(e) => setCalendarificKey(e.target.value)}
              placeholder="Enter your Calendarific API key..."
              className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/30"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2"
            >
              {keySaved ? <Check className="w-4 h-4" /> : null}
              {keySaved ? "Saved" : "Save"}
            </button>
          </div>
          <a
            href="https://calendarific.com/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400/70 text-xs flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            Get a free API key at calendarific.com <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}