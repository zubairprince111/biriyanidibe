import { supabase } from "@/integrations/supabase/client";
import { BiriyaniSpot, FOOD_TYPES } from "@/types/biriyani";

const REPORT_THRESHOLD = 50; // Hide if 50+ reports
const MAX_LENGTH = 100;

export async function fetchSpots(): Promise<BiriyaniSpot[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const { data, error } = await supabase
      .from("biriyani_spots")
      .select("*")
      .order("created_at", { ascending: false })
      .abortSignal(controller.signal);

    clearTimeout(timeout);

    if (error) {
      console.error("fetchSpots error:", error);
      return [];
    }

    // Filter out spam/rogue data
    const filtered = (data ?? []).filter(spot => {
      const isValidFood = FOOD_TYPES.includes(spot.food_type as any);
      const isNotFlaggedAsFake = spot.downvotes < REPORT_THRESHOLD;

      return isValidFood && isNotFlaggedAsFake;
    });

    return filtered as BiriyaniSpot[];
  } catch (e) {
    console.error("fetchSpots exception:", e);
    return [];
  }
}

export async function addSpot(spot: Omit<BiriyaniSpot, "id" | "upvotes" | "downvotes" | "created_at">): Promise<void> {
  // Strict Validation
  if (!FOOD_TYPES.includes(spot.food_type as any)) {
    throw new Error("Invalid food type");
  }
  if (spot.masjid_name.length > MAX_LENGTH || spot.area.length > MAX_LENGTH) {
    throw new Error("Text too long");
  }

  // Coordinate Validation (Dhaka area)
  const isWithinDhaka =
    spot.lat >= 23.0 && spot.lat <= 24.5 &&
    spot.lng >= 90.0 && spot.lng <= 91.0;

  if (!isWithinDhaka) {
    throw new Error("Invalid location. Please pick a spot within Dhaka.");
  }

  console.log("Adding spot to Supabase:", spot);
  try {
    const { data, error } = await supabase
      .from("biriyani_spots")
      .insert([spot])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }
  } catch (e) {
    console.error("addSpot exception:", e);
    throw e;
  }
}

export async function voteSpot(id: string, type: "upvote" | "downvote"): Promise<void> {
  const column = type === "upvote" ? "upvotes" : "downvotes";

  const { data, error: fetchError } = await supabase
    .from("biriyani_spots")
    .select(column)
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const currentVal = (data as Record<string, number>)[column] ?? 0;

  const { error } = await supabase
    .from("biriyani_spots")
    .update({ [column]: currentVal + 1 })
    .eq("id", id);

  if (error) throw error;
}
