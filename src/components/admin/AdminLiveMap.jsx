import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ACTIVE_AMBULANCE_LOCATIONS } from "../../data/adminDemoData.js";
import { useEmergencyRequests } from "../../context/EmergencyRequestContext.jsx";
import "leaflet/dist/leaflet.css";

const ambulanceIcon = L.divIcon({
  className: "jeevansetu-admin-map-icon",
  html: '<span class="jeevansetu-admin-map-pin">A</span>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -16],
});

export default function AdminLiveMap({ fullHeight = false }) {
  const { ambulances } = useEmergencyRequests();
  const activeAmbulances = ambulances.filter(
    (ambulance) =>
      ["On call", "En route", "On scene"].includes(ambulance.status),
  );
  const fallbackPositions = [
    [43.6523, -79.3748],
    [43.6464, -79.3817],
    [43.6585, -79.3911],
    [43.6496, -79.3698],
  ];

  return (
    <MapContainer
      center={[43.6541, -79.3792]}
      className={`w-full ${fullHeight ? "h-[500px] sm:h-[600px]" : "h-[280px] sm:h-[320px]"}`}
      scrollWheelZoom={false}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {activeAmbulances.map((ambulance, index) => {
        const demoLocation = ACTIVE_AMBULANCE_LOCATIONS.find(
          (location) => location.id === ambulance.id,
        );
        return (
          <Marker
            alt={`Demo ambulance ${ambulance.id}`}
            icon={ambulanceIcon}
            key={ambulance.id}
            position={
              demoLocation?.position ||
              fallbackPositions[index % fallbackPositions.length]
            }
            title={ambulance.id}
          >
            <Popup>
              <strong>{ambulance.id}</strong>
              <br />
              Driver: {ambulance.driver}
              <br />
              Status: {ambulance.status}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
