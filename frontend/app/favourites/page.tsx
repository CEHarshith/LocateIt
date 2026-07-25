"use client";

import { useState, useEffect } from "react";
import { Heart, MapPin } from "lucide-react";
import MapView from "@/components/MapView";
import { supabase } from "@/lib/supabase";
import { authClient } from "@/lib/auth-client";

interface FavoriteItem {
  id: string;
  landmark_id: number;
  landmark_name: string;
  city?: string;
  country?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
}

export default function FavoritesPage() {
  const { data: session, isPending } = authClient.useSession();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setFavorites(data || []);
      }

      setIsLoading(false);
    }

    if (!isPending) {
      loadFavorites();
    }
  }, [session?.user?.id, isPending]);

  const removeFavorite = async (id: string, landmarkId: number) => {
    if (!session?.user?.id) return;

    setFavorites(favorites.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", session.user.id)
      .eq("landmark_id", landmarkId);

    if (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <span className="text-xl font-bold text-gray-700">Loading your saved places...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <span className="text-xl font-bold text-gray-700">Please sign in to view your favorites.</span>
      </div>
    );
  }

  const mappable = favorites.filter((item) => item.latitude && item.longitude);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your Saved Places</h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage your favorite travel destinations.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
            Error: {errorMessage}
          </div>
        )}

        {mappable.length > 0 && (
          <div className="mb-8">
            <MapView locations={mappable as any} />
          </div>
        )}

        {favorites.length === 0 && !errorMessage ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-slate-500 font-medium">You have not saved any locations yet.</p>
            <p className="text-slate-400 text-sm mt-1">Search for a landmark and click the heart icon to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col"
              >
                {item.image_url && (
                  <div className="h-40 w-full overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.landmark_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-4 flex items-center justify-between flex-grow bg-white z-10 relative">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{item.landmark_name}</h3>
                    {item.city && item.country && (
                      <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.city}, {item.country}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFavorite(item.id, item.landmark_id)}
                    className="p-1.5 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0 ml-2"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}