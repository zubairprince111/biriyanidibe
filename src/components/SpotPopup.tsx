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

interface SpotPopupProps {
  spot: BiriyaniSpot;
  onVoted: () => void;
}

export function SpotPopup({ spot, onVoted }: SpotPopupProps) {
  const [voting, setVoting] = React.useState<"upvote" | "downvote" | null>(null);
  const netScore = spot.upvotes - spot.downvotes;
  const isVerified = netScore >= TRUST_THRESHOLD;
  const isSuspect = netScore <= -3;

  const timeAgo = React.useMemo(() => {
    const diff = Date.now() - new Date(spot.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "এইমাত্র";
    if (mins < 60) return `${mins} মিনিট আগে`;
    return `${Math.floor(mins / 60)} ঘন্টা আগে`;
  }, [spot.created_at]);

  async function handleVote(type: "upvote" | "downvote") {
    if (voting) return;
    setVoting(type);
    try {
      await voteSpot(spot.id, type);
      toast.success(type === "upvote" ? "✅ নিশ্চিত করা হয়েছে!" : "🚩 ভুয়া হিসেবে রিপোর্ট করা হয়েছে");
      onVoted();
    } catch {
      toast.error("ভোট দেওয়া যায়নি");
    } finally {
      setVoting(null);
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ minWidth: 220 }}>
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{
          background: isVerified
            ? "hsl(142 60% 32%)"
            : isSuspect
            ? "hsl(0 70% 55%)"
            : "hsl(35 95% 50%)",
        }}
      >
        <div className="flex items-center gap-1 mb-1">
          <MapPin size={13} className="text-white opacity-80" />
          <span className="text-white text-xs opacity-80 font-medium">{spot.area}</span>
          {isVerified && (
            <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">✓ নিশ্চিত</span>
          )}
          {isSuspect && (
            <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">⚠ সন্দেহজনক</span>
          )}
        </div>
        <h3 className="text-white font-bold text-sm leading-tight">{spot.masjid_name}</h3>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base">
            {FOOD_EMOJI[spot.food_type] ?? "🍽️"}{" "}
            <span className="font-semibold text-sm" style={{ color: "hsl(20 30% 20%)" }}>
              {FOOD_BN[spot.food_type] ?? spot.food_type}
            </span>
          </span>
          <div className="flex items-center gap-1 text-xs" style={{ color: "hsl(20 15% 55%)" }}>
            <Clock size={11} />
            {timeAgo}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("upvote")}
            disabled={!!voting}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: "hsl(142 40% 90%)",
              color: "hsl(142 60% 25%)",
              opacity: voting && voting !== "upvote" ? 0.5 : 1,
            }}
          >
            <ThumbsUp size={13} />
            {voting === "upvote" ? "…" : `${spot.upvotes} সত্যি`}
          </button>
          <button
            onClick={() => handleVote("downvote")}
            disabled={!!voting}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: "hsl(0 60% 92%)",
              color: "hsl(0 70% 40%)",
              opacity: voting && voting !== "downvote" ? 0.5 : 1,
            }}
          >
            <ThumbsDown size={13} />
            {voting === "downvote" ? "…" : `${spot.downvotes} ভুয়া`}
          </button>
        </div>
      </div>
    </div>
  );
}
