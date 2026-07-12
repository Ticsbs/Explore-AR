import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2, MapPin, Navigation, AlertCircle, Loader2, Plus, X,
  Phone, MessageCircle, User as UserIcon, Trash2
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

export default function ShareLocationCard({ location, error, onRefreshLocation }) {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [sharing, setSharing] = useState(false);

  const fetchContacts = useCallback(async () => {
    setContactsLoading(true);
    try {
      const result = await base44.entities.EmergencyContact.list("-created_date", 20);
      setContacts(result);
    } catch {
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Generate a Google Maps link with real GPS coordinates
  const getMapsLink = useCallback(() => {
    if (!location) return null;
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  }, [location]);

  const getShareText = useCallback(() => {
    if (!location) return "";
    const place = location.city ? `${location.city}${location.country ? `, ${location.country}` : ""}` : "my location";
    return `I'm sharing my live location from ${place}: ${getMapsLink()}`;
  }, [location, getMapsLink]);

  // Open the native OS share sheet (Web Share API)
  const handleShare = useCallback(async () => {
    if (!location) return;
    setSharing(true);
    const shareData = {
      title: t("safety.share_location"),
      text: getShareText(),
      url: getMapsLink(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(getShareText());
      }
    } catch {
      // User cancelled — no action needed
    } finally {
      setSharing(false);
    }
  }, [location, getShareText, getMapsLink, t]);

  // Quick-share with a specific emergency contact via WhatsApp or SMS
  const handleQuickShare = useCallback((contact, method) => {
    if (!location) return;
    const text = encodeURIComponent(getShareText());
    const phone = contact.phone.replace(/[^0-9]/g, "");
    if (method === "whatsapp") {
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    } else if (method === "sms") {
      window.location.href = `sms:${phone}?body=${text}`;
    } else if (method === "call") {
      window.location.href = `tel:${phone}`;
    }
  }, [location, getShareText]);

  const handleAddContact = useCallback(async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    try {
      await base44.entities.EmergencyContact.create({
        name: newContact.name.trim(),
        phone: newContact.phone.trim(),
      });
      setNewContact({ name: "", phone: "" });
      setShowAddForm(false);
      fetchContacts();
    } catch {
      // Error creating contact
    }
  }, [newContact, fetchContacts]);

  const handleDeleteContact = useCallback(async (id) => {
    try {
      await base44.entities.EmergencyContact.delete(id);
      fetchContacts();
    } catch {}
  }, [fetchContacts]);

  // Permission denied state
  if (error) {
    return (
      <div className="mx-4 glass-card rounded-3xl p-6 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-orange-500/15 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-orange-400" />
        </div>
        <p className="text-white font-semibold text-sm">{t("safety.share_location")}</p>
        <p className="text-white/40 text-xs max-w-[240px]">{t("safety.enable_location")}</p>
        <button
          onClick={onRefreshLocation}
          className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" /> {t("safety.enable_location")}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 space-y-3">
      {/* Main Share Card — styled: icon left, title + subtitle, share icon right */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
        disabled={!location || sharing}
        className="w-full glass-card rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
          {sharing ? (
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          ) : (
            <Share2 className="w-5 h-5 text-blue-400" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-white text-sm font-medium">{t("safety.share_location")}</p>
          <p className="text-white/40 text-xs">
            {location ? t("safety.location_ready") : t("common.loading")}
          </p>
        </div>
        <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
      </motion.button>

      {/* Quick Share with Emergency Contacts */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">{t("safety.quick_share")}</p>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-blue-400 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> {t("safety.add_contact")}
          </button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={t("safety.contact_name")}
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/30"
                />
                <input
                  type="tel"
                  placeholder={t("safety.contact_phone")}
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/30"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddContact}
                    className="flex-1 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium"
                  >
                    {t("common.save")}
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-sm"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {contactsLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
          </div>
        ) : contacts.length === 0 ? (
          <p className="text-white/30 text-xs text-center py-4">{t("safety.no_contacts")}</p>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-2 bg-white/[0.03] rounded-xl p-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{contact.name}</p>
                  <p className="text-white/40 text-xs truncate">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleQuickShare(contact, "whatsapp")}
                  disabled={!location}
                  className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center disabled:opacity-30"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  onClick={() => handleQuickShare(contact, "sms")}
                  disabled={!location}
                  className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center disabled:opacity-30"
                  title="SMS"
                >
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleQuickShare(contact, "call")}
                  disabled={!location}
                  className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center disabled:opacity-30"
                  title="Call"
                >
                  <Phone className="w-4 h-4 text-teal-400" />
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}