"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { authClient } from "@/lib/auth-client";
import { getCoordinatesForPlace } from "@/components/geocoder";

interface Result {
  landmark_id: number;
  landmark_name: string;
  confidence: number;
}

interface ResultCardProps {
  isLoading: boolean;
  prediction: { results: Result[] } | null;
}

export default function ResultCard({ isLoading, prediction }: ResultCardProps) {
  const { data: session } = authClient.useSession();
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadFavoriteIds() {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("landmark_id")
        .eq("user_id", session.user.id);

      if (!error && data) {
        setSavedIds(data.map((row) => row.landmark_id));
      }
    }

    loadFavoriteIds();
  }, [session?.user?.id]);

  const toggleFavorite = async (result: Result) => {
    if (!session?.user?.id) {
      alert("Please sign in to save favorites.");
      return;
    }

    const isFavorited = savedIds.includes(result.landmark_id);

    if (isFavorited) {
      setSavedIds(savedIds.filter((id) => id !== result.landmark_id));

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("landmark_id", result.landmark_id);

      if (error) {
        setSavedIds((prev) => [...prev, result.landmark_id]);
        console.error("Failed to remove favorite:", error);
      }
    } else {
      setSavedIds([...savedIds, result.landmark_id]);

      let latitude: number | null = null;
      let longitude: number | null = null;

      try {
        const coords = await getCoordinatesForPlace(result.landmark_name);
        latitude = coords.lat;
        longitude = coords.lon;
      } catch (err) {
        console.error("Could not geocode landmark:", err);
      }

      const { error } = await supabase.from("favorites").insert({
        user_id: session.user.id,
        landmark_id: result.landmark_id,
        landmark_name: result.landmark_name,
        latitude,
        longitude,
      });

      if (error) {
        setSavedIds((prev) => prev.filter((id) => id !== result.landmark_id));
        console.error("Failed to save favorite:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">Loading...</span>
      </div>
    );
  }

  if (!prediction || !prediction.results) {
    return (
      <div className="flex items-center justify-center min-h-[80px]">
        <span className="text-xl font-bold text-gray-700">No match found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {prediction.results.map((result, index) => {
        const isFavorited = savedIds.includes(result.landmark_id);

        return (
          <div
            key={result.landmark_id}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-medium w-4">#{index + 1}</span>
              <h3 className="text-lg font-semibold text-green-700">
                {result.landmark_name}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-gray-500 text-sm">
                {(result.confidence * 100).toFixed(1)}%
              </p>

              <button
                onClick={() => toggleFavorite(result)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Save to favorites"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}