"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
});

interface Location {
  id: number;
  landmark_name: string;
  latitude: number;
  longitude: number;
}

function FitBoundsToMarkers({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], 10);
      return;
    }

    const bounds = L.latLngBounds(
      locations.map((loc) => [loc.latitude, loc.longitude])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [locations, map]);

  return null;
}

export default function MapContent({ locations }: { locations: Location[] }) {
  if (locations.length === 0) return null;

  return (
    <MapContainer
      key={locations.map((l) => l.id).join("-")}
      center={[locations[0].latitude, locations[0].longitude]}
      zoom={2}
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={true}
      attributionControl={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBoundsToMarkers locations={locations} />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={customIcon}>
          <Tooltip permanent direction="top" offset={[0, -30]} opacity={0.9}>
            {loc.landmark_name}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}