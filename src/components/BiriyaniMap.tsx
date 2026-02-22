import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { BiriyaniSpot, TRUST_THRESHOLD } from "@/types/biriyani";
import { SpotPopup } from "./SpotPopup";

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createCustomIcon(spot: BiriyaniSpot): L.DivIcon {
  const net = spot.upvotes - spot.downvotes;
  const isVerified = net >= TRUST_THRESHOLD;
  const isSuspect = net <= -3;

  const emoji =
    spot.food_type === "Kacchi Biriyani" ? "🍛"
    : spot.food_type === "Tehari" ? "🍚"
    : spot.food_type === "Plain Beef" ? "🥩"
    : spot.food_type === "Mutton Biriyani" ? "🐑"
    : spot.food_type === "Chicken Biriyani" ? "🍗"
    : "🍽️";

  const bg = isVerified ? "#2d8a4e" : isSuspect ? "#d63031" : "#f5a623";

  return L.divIcon({
    html: `
      <div style="
        background: ${bg};
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        border: 2.5px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 17px; line-height: 1;">${emoji}</span>
      </div>
    `,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -40],
  });
}

interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface BiriyaniMapProps {
  spots: BiriyaniSpot[];
  onMapClick: (lat: number, lng: number) => void;
  onVoted: () => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}

export function BiriyaniMap({ spots, onMapClick, onVoted, mapRef }: BiriyaniMapProps) {
  return (
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={13}
      className="w-full h-full"
      zoomControl={true}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />

      <MapClickHandler onClick={onMapClick} />

      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createCustomIcon(spot)}
        >
          <Popup>
            <SpotPopup spot={spot} onVoted={onVoted} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
