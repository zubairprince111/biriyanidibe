import React from "react";
import { BiriyaniSpot, TRUST_THRESHOLD } from "@/types/biriyani";
import { voteSpot } from "@/lib/api";
import { ThumbsUp, ThumbsDown, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

const FOOD_EMOJI: Record<string, string> = {
  "Kacchi Biriyani": "🍛",
  "Tehari": "🍚",
  "Plain Beef": "🥩",
  "Mutton Biriyani": "🐑",
  "Chicken Biriyani": "🍗",
  "Mixed": "🍽️",
};

const FOOD_BN: Record<string, string> = {
  "Kacchi Biriyani": "কাচ্চি বিরিয়ানি",
  "Tehari": "তেহারি",
  "Plain Beef": "গরুর মাংস",
  "Mutton Biriyani": "খাসির বিরিয়ানি",
  "Chicken Biriyani": "চিকেন বিরিয়ানি",
  "Mixed": "মিশ্র",
};

interface BottomSheetProps {
  spots: BiriyaniSpot[];
  onClose: () => void;
  onSpotClick: (spot: BiriyaniSpot) => void;
  onVoted: () => void;
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

function SpotCard({ spot, onClick, onVoted }: { spot: BiriyaniSpot; onClick: () => void; onVoted: () => void }) {
  const [voting, setVoting] = React.useState<"upvote" | "downvote" | null>(null);
  const netScore = spot.upvotes - spot.downvotes;
  const isVerified = netScore >= TRUST_THRESHOLD;

  const timeAgo = React.useMemo(() => {
    const diff = Date.now() - new Date(spot.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "এইমাত্র";
    if (mins < 60) return `${mins} মি আগে`;
    return `${Math.floor(mins / 60)} ঘ আগে`;
  }, [spot.created_at]);

  async function handleVote(e: React.MouseEvent, type: "upvote" | "downvote") {
    e.stopPropagation();
    if (voting) return;
    setVoting(type);
    try {
      await voteSpot(spot.id, type);
      toast.success(type === "upvote" ? "✅ নিশ্চিত!" : "🚩 রিপোর্ট করা হয়েছে");
      onVoted();
    } catch {
      toast.error("ভোট দেওয়া যায়নি");
    } finally {
      setVoting(null);
    }
  }

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
      style={{ background: "hsl(40 33% 97%)" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: isVerified ? "hsl(142 40% 90%)" : "hsl(35 85% 90%)" }}
      >
        {FOOD_EMOJI[spot.food_type] ?? "🍽️"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-bold text-sm truncate" style={{ color: "hsl(20 30% 15%)" }}>
            {spot.masjid_name}
          </span>
          {isVerified && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold flex-shrink-0" style={{ background: "hsl(142 40% 90%)", color: "hsl(142 60% 25%)" }}>
              ✓
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(20 15% 50%)" }}>
          <span className="flex items-center gap-0.5"><MapPin size={10} />{spot.area}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5"><Clock size={10} />{timeAgo}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <button
            onClick={(e) => handleVote(e, "upvote")}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: "hsl(142 40% 90%)", color: "hsl(142 60% 25%)" }}
          >
            <ThumbsUp size={10} />{spot.upvotes} সত্যি
          </button>
          <button
            onClick={(e) => handleVote(e, "downvote")}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: "hsl(0 60% 92%)", color: "hsl(0 70% 40%)" }}
          >
            <ThumbsDown size={10} />{spot.downvotes} ভুয়া
          </button>
          <span className="ml-auto text-xs font-semibold" style={{ color: "hsl(35 95% 42%)" }}>
            {FOOD_BN[spot.food_type] ?? spot.food_type}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BottomSheet({ spots, onClose, onSpotClick, onVoted, expanded, onExpandChange }: BottomSheetProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-[1000] rounded-t-2xl shadow-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, hsl(142 76% 26%), hsl(142 70% 36%))",
        maxHeight: expanded ? "70vh" : "220px"
      }}
    >
      {/* Handle */}
      <div className="flex flex-col items-center py-3 cursor-pointer" onClick={() => onExpandChange(!expanded)}>
        <div className="w-10 h-1 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.3)" }} />
        <div className="flex items-center justify-between w-full px-4">
          <span className="font-bold text-sm text-white">
            🍛 আজকের সক্রিয় স্পট
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
              {spots.length}টি সরাসরি
            </span>
            <span className="text-xs text-white/80">{expanded ? "▼" : "▲"}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto px-3 pb-6 space-y-2" style={{ maxHeight: expanded ? "calc(70vh - 80px)" : "130px" }}>
        {spots.length === 0 ? (
          <div className="text-center py-8" style={{ color: "hsl(20 15% 60%)" }}>
            <div className="text-3xl mb-2">🕌</div>
            <p className="text-sm font-medium">আজকে এখনো কোনো স্পট নেই</p>
            <p className="text-xs mt-1">প্রথম স্পট যোগ করুন!</p>
          </div>
        ) : (
          spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} onClick={() => onSpotClick(spot)} onVoted={onVoted} />
          ))
        )}
      </div>
    </div>
  );
}
