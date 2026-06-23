"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LiveMap() {
  return (
    <MapContainer
      center={[12.9716, 77.5946] as [number, number]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[12.9716, 77.5946]}>
        <Popup>Bengaluru</Popup>
      </Marker>

      <Marker position={[12.2958, 76.6394]}>
        <Popup>Mysuru</Popup>
      </Marker>
    </MapContainer>
  );
}