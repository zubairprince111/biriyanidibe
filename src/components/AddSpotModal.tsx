import React from "react";
import { FOOD_TYPES } from "@/types/biriyani";
import { addSpot } from "@/lib/api";
import { X, MapPin, Crosshair, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const FOOD_TYPES_BN: Record<string, string> = {
  "Kacchi Biriyani": "কাচ্চি বিরিয়ানি",
  "Tehari": "তেহারি",
  "Plain Beef": "গরুর মাংস",
  "Mutton Biriyani": "খাসির বিরিয়ানি",
  "Chicken Biriyani": "চিকেন বিরিয়ানি",
  "Mixed": "মিশ্র",
};

// Use Cloudflare's testing site key (Always passes) as fallback
// The user should set VITE_TURNSTILE_SITE_KEY in Vercel/Local .env
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

interface AddSpotModalProps {
  onClose: () => void;
  onAdded: () => void;
  prefilledLat?: number;
  prefilledLng?: number;
  initialData?: {
    masjid_name: string;
    area: string;
    food_type: string;
  };
  onRequestLocationPick?: (currentData: { masjid_name: string; area: string; food_type: string }) => void;
}

export function AddSpotModal(props: AddSpotModalProps) {
  const { onClose, onAdded, prefilledLat, prefilledLng, initialData } = props;
  const [masjidName, setMasjidName] = React.useState(initialData?.masjid_name ?? "");
  const [area, setArea] = React.useState(initialData?.area ?? "");
  const [foodType, setFoodType] = React.useState<string>(initialData?.food_type ?? FOOD_TYPES[0]);
  const [lat, setLat] = React.useState(prefilledLat?.toFixed(5) ?? "");
  const [lng, setLng] = React.useState(prefilledLng?.toFixed(5) ?? "");
  const [locating, setLocating] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [honeypot, setHoneypot] = React.useState("");
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const turnstileRef = React.useRef<TurnstileInstance>(null);

  function useGPS() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(5));
        setLng(pos.coords.longitude.toFixed(5));
        setLocating(false);
        toast.success("📍 লোকেশন পাওয়া গেছে!");
      },
      () => {
        toast.error("লোকেশন পাওয়া যায়নি");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!masjidName || !area || !lat || !lng) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    if (!captchaToken) {
      toast.error("অনুগ্রহ করে ক্যাপচা পূরণ করুন");
      return;
    }

    if (honeypot) {
      console.warn("Honeypot filled, rejecting submission.");
      toast.error("বট শনাক্ত করা হয়েছে!");
      return;
    }

    if (masjidName.length > 50 || area.length > 50) {
      toast.error("নাম বা এলাকা খুব বড় (সর্বোচ্চ ৫০ অক্ষর)");
      return;
    }

    setSubmitting(true);
    try {
      await addSpot({
        masjid_name: masjidName.trim(),
        area: area.trim(),
        food_type: foodType,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      toast.success("🎉 স্পট যোগ হয়েছে! জাযাকাল্লাহ খায়ের!");
      onAdded();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "স্পট যোগ করা যায়নি");
      // Reset captcha on error
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl slide-up" style={{ background: "white" }}>
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between rounded-t-2xl"
          style={{ background: "linear-gradient(135deg, hsl(35 95% 50%), hsl(35 85% 42%))" }}
        >
          <div>
            <h2 className="text-white font-bold text-lg">📍 বিরিয়ানি স্পট যোগ করুন</h2>
            <p className="text-white/80 text-xs">উম্মাহকে ইফতার খুঁজে পেতে সাহায্য করুন!</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Masjid Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "hsl(20 15% 50%)" }}>
              মসজিদের নাম *
            </label>
            <input
              value={masjidName}
              onChange={(e) => setMasjidName(e.target.value)}
              placeholder="যেমন: সোবহানবাগ জামে মসজিদ"
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
              style={{ borderColor: "hsl(35 25% 85%)", "--tw-ring-color": "hsl(35 95% 50%)" } as React.CSSProperties}
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "hsl(20 15% 50%)" }}>
              এলাকা / মহল্লা *
            </label>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="যেমন: ধানমন্ডি, মিরপুর, গুলশান"
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
              style={{ borderColor: "hsl(35 25% 85%)", "--tw-ring-color": "hsl(35 95% 50%)" } as React.CSSProperties}
            />
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "hsl(20 15% 50%)" }}>
              খাবারের ধরন *
            </label>
            <div className="relative">
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value as string)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 appearance-none bg-white"
                style={{ borderColor: "hsl(35 25% 85%)", "--tw-ring-color": "hsl(35 95% 50%)" } as React.CSSProperties}
              >
                {FOOD_TYPES.map((f) => (
                  <option key={f} value={f}>{FOOD_TYPES_BN[f] ?? f}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3 pointer-events-none" style={{ color: "hsl(20 15% 55%)" }} />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "hsl(20 15% 50%)" }}>
              লোকেশন *
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={useGPS}
                disabled={locating}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: "hsl(142 40% 90%)", color: "hsl(142 60% 25%)" }}
              >
                <Crosshair size={14} />
                {locating ? "নেওয়া হচ্ছে…" : "GPS লোকেশন"}
              </button>
              <button
                type="button"
                onClick={() => props.onRequestLocationPick?.({ masjid_name: masjidName, area, food_type: foodType })}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: "hsl(217 91% 91%)", color: "hsl(217 91% 32%)" }}
              >
                <MapPin size={14} />
                ম্যাপ থেকে দিন
              </button>
            </div>
            <div className="flex gap-2">
              <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="অক্ষাংশ (Lat)" className="flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none" style={{ borderColor: "hsl(35 25% 85%)" }} />
              <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="দ্রাঘিমাংশ (Lng)" className="flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none" style={{ borderColor: "hsl(35 25% 85%)" }} />
            </div>
            {prefilledLat && (
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "hsl(142 60% 32%)" }}>
                <MapPin size={11} />
                ম্যাপে পিন করা লোকেশন ব্যবহার করা হয়েছে
              </p>
            )}
          </div>

          {/* Turnstile Captcha */}
          <div className="flex justify-center p-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Turnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              onError={() => {
                toast.error("ক্যাপচা লোড করা যায়নি");
                setCaptchaToken(null);
              }}
            />
          </div>

          {/* Honeypot field (hidden from humans) */}
          <div className="opacity-0 absolute -z-10 pointer-events-none" aria-hidden="true">
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95"
            style={{
              background: submitting
                ? "hsl(35 50% 70%)"
                : "linear-gradient(135deg, hsl(35 95% 50%), hsl(35 85% 42%))",
            }}
          >
            {submitting ? "যোগ করা হচ্ছে…" : "🍛 এই স্পটটি যোগ করুন!"}
          </button>
        </form>
      </div>
    </div>
  );
}
