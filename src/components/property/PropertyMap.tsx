import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat?: number;
  lng?: number;
}

export default function PropertyMap({ lat, lng }: Props) {
  if (!lat || !lng) {
    return <p className="text-gray-500">Location not available</p>;
  }

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
}