import React from "react";
import { BiriyaniMap } from "@/components/BiriyaniMap";
import { BottomSheet } from "@/components/BottomSheet";
import { AddSpotModal } from "@/components/AddSpotModal";
import { SupportModal } from "@/components/SupportModal";
import { BiriyaniSpot } from "@/types/biriyani";
import { fetchSpots } from "@/lib/api";
import { Plus, Search, X, Wifi, Heart } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Index = () => {
  const [spots, setSpots] = React.useState<BiriyaniSpot[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [showSupportModal, setShowSupportModal] = React.useState(false);
  const [pendingLat, setPendingLat] = React.useState<number | undefined>();
  const [pendingLng, setPendingLng] = React.useState<number | undefined>();
  const [search, setSearch] = React.useState("");
  const mapRef = React.useRef<L.Map | null>(null);

  const [draftSpot, setDraftSpot] = React.useState<{
    masjid_name: string;
    area: string;
    food_type: string;
  } | null>(null);
  const [isPickingLocation, setIsPickingLocation] = React.useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = React.useState(false);

  React.useEffect(() => {
    // Clean up old localStorage if it exists
    localStorage.removeItem("support_modal_shown");

    // Show support modal after 1 second if not shown in this session
    const hasShown = sessionStorage.getItem("support_modal_shown");
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowSupportModal(true);
        sessionStorage.setItem("support_modal_shown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // ... (existing code)



  const loadSpots = React.useCallback(async () => {
    try {
      const data = await fetchSpots();
      setSpots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSpots();
  }, [loadSpots]);

  function handleMapClick(lat: number, lng: number) {
    if (isPickingLocation) {
      setPendingLat(lat);
      setPendingLng(lng);
      setShowModal(true);
      setIsPickingLocation(false);
    } else {
      setPendingLat(lat);
      setPendingLng(lng);
      setShowModal(true);
      setDraftSpot(null); // Clear draft if starting fresh from map click
    }
  }

  function handleFABClick() {
    setPendingLat(undefined);
    setPendingLng(undefined);
    setDraftSpot(null);
    setShowModal(true);
    setIsPickingLocation(false);
  }

  function handleSpotClick(spot: BiriyaniSpot) {
    if (mapRef.current) {
      mapRef.current.flyTo([spot.lat, spot.lng], 16, { duration: 0.8 });
    }
  }

  function handleRequestLocationPick(currentData: { masjid_name: string; area: string; food_type: string }) {
    setDraftSpot(currentData);
    setShowModal(false);
    setIsPickingLocation(true);
    // Show toast instruction
    // toast("📍 ম্যাপের যেকোনো জায়গায় ট্যাপ করে লোকেশন সেট করুন"); 
    // We need to import toast first if not available, or use Sonner locally if possible, 
    // but Index.tsx doesn't have toast imported yet. 
    // For now rely on UI cue or assume user knows. 
    // Let's add a visual cue overlay? 
  }

  const filteredSpots = React.useMemo(() => {
    if (!search.trim()) return spots;
    const q = search.toLowerCase();
    return spots.filter(
      (s) =>
        s.masjid_name.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.food_type.toLowerCase().includes(q)
    );
  }, [spots, search]);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "hsl(40 33% 97%)" }}>
      {/* ─── Header ─── */}
      <div
        className="absolute top-0 left-0 right-0 z-[1001] px-3 pt-3 pb-2"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.97) 70%, transparent)",
          pointerEvents: "none",
        }}
      >
        <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
          {/* Logo */}
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-xl shadow-md flex-shrink-0 overflow-hidden"
            style={{ background: "white", border: "1.5px solid hsl(142 76% 26%)" }}
          >
            <img src="/cropped_circle_image.jpg" alt="বিরিয়ানি দিবে" className="h-8 w-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold leading-none text-emerald-800">বিরিয়ানি</span>
              <span className="text-[10px] font-bold leading-none text-emerald-600">দিবে</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(142 60% 36%)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="মসজিদ বা এলাকা খুঁজুন…"
              className="w-full pl-8 pr-8 py-2.5 rounded-xl text-sm shadow-md focus:outline-none focus:ring-2"
              style={{
                background: "white",
                border: "1.5px solid hsl(142 30% 88%)",
                "--tw-ring-color": "hsl(142 60% 36%)",
                color: "hsl(142 70% 15%)",
              } as React.CSSProperties}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full" style={{ color: "hsl(142 60% 36%)" }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl shadow-md flex-shrink-0" style={{ background: "white", border: "1.5px solid hsl(35 30% 88%)" }}>
            <Wifi size={12} className="live-pulse" style={{ color: "hsl(142 60% 32%)" }} />
            <span className="text-xs font-bold" style={{ color: "hsl(142 60% 32%)" }}>
              সরাসরি
            </span>
          </div>


          {/* Support Button */}
          <button
            onClick={() => setShowSupportModal(true)}
            className="flex items-center justify-center p-2.5 rounded-xl shadow-md bg-white border border-red-100 text-red-500 active:scale-90 transition-all"
          >
            <Heart size={16} className="fill-red-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 mt-2 px-1">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full shadow-sm" style={{ background: "linear-gradient(135deg, hsl(142 76% 26%), hsl(142 70% 36%))", color: "white" }}>
            🍛 সর্বমোট স্পট: {spots.length}টি
          </span>
          {spots.filter((s) => s.upvotes - s.downvotes >= 3).length > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full shadow-sm" style={{ background: "hsl(142 40% 90%)", color: "hsl(142 60% 25%)" }}>
              ✓ নিশ্চিত: {spots.filter((s) => s.upvotes - s.downvotes >= 3).length}টি
            </span>
          )}
          <span className="text-xs ml-auto" style={{ color: "hsl(20 15% 55%)" }}>
            ম্যাপে ট্যাপ করুন
          </span>
        </div>
      </div>

      {/* ─── Map ─── */}
      <div className="absolute inset-0">
        {!loading ? (
          <BiriyaniMap spots={filteredSpots} onMapClick={handleMapClick} onVoted={loadSpots} mapRef={mapRef} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-4 animate-bounce">🍛</div>
              <p className="font-bold text-lg" style={{ color: "hsl(35 95% 45%)" }}>ইফতার ম্যাপ লোড হচ্ছে…</p>
              <p className="text-sm" style={{ color: "hsl(20 15% 55%)" }}>ঢাকায় বিরিয়ানি খোঁজা হচ্ছে</p>
            </div>
          </div>
        )}
      </div>

      {/* Picking Location Overlay Hint */}
      {isPickingLocation && (
        <div className="absolute inset-0 z-[1000] pointer-events-none flex items-center justify-center bg-black/10">
          <div className="bg-black/70 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md animate-pulse shadow-2xl">
            📍 ম্যাপের যেকোনো জায়গায় ট্যাপ করুন
          </div>
        </div>
      )}

      {/* ─── FAB ─── */}
      {!isPickingLocation && !isSheetExpanded && (
        <button
          onClick={handleFABClick}
          className="absolute z-[1001] right-4 bottom-[235px] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "linear-gradient(135deg, hsl(35 95% 50%), hsl(35 82% 40%))" }}
          aria-label="বিরিয়ানি স্পট যোগ করুন"
        >
          <Plus size={26} className="text-white" strokeWidth={2.5} />
        </button>
      )}

      {/* ─── Bottom Sheet ─── */}
      <BottomSheet
        spots={filteredSpots}
        onClose={() => { }}
        onSpotClick={handleSpotClick}
        onVoted={loadSpots}
        expanded={isSheetExpanded}
        onExpandChange={setIsSheetExpanded}
      />

      {/* ─── Modal ─── */}
      {showModal && (
        <AddSpotModal
          onClose={() => setShowModal(false)}
          onAdded={loadSpots}
          prefilledLat={pendingLat}
          prefilledLng={pendingLng}
          initialData={draftSpot || undefined}
          onRequestLocationPick={handleRequestLocationPick}
        />
      )}
      {showSupportModal && (
        <SupportModal onClose={() => setShowSupportModal(false)} />
      )}
      {/* ─── Footer ─── */}
      <div className="absolute bottom-2 left-0 right-0 z-[1002] text-center pointer-events-none">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm shadow-sm" style={{ color: "hsl(142 60% 20%)" }}>
          made by <a href="https://www.facebook.com/jubair.prince009" target="_blank" rel="noopener noreferrer" className="hover:underline pointer-events-auto">Jubair Prince</a>
        </span>
      </div>
    </div>
  );
};

export default Index;
