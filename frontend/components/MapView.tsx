"use client";

import dynamic from "next/dynamic";

const LeafletOverviewMap = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-sm rounded-xl">
      Loading map...
    </div>
  ),
});

interface MapViewProps {
  locations: Array<{
    id: number;
    landmark_name: string;
    latitude: number;
    longitude: number;
  }>;
}

export default function MapView({ locations }: MapViewProps) {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 relative">
      <LeafletOverviewMap locations={locations} />
    </div>
  );
}