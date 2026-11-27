import {
  Activity,
  Ambulance,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Hospital,
  MapPin,
  Navigation,
  Pause,
  PhoneCall,
  Play,
  Radio,
  RefreshCw,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import L from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import RequestStatusBadge from "../../components/student/RequestStatusBadge.jsx";
import StudentPageHeading from "../../components/student/StudentPageHeading.jsx";
import { useStudentRequests } from "../../context/EmergencyRequestContext.jsx";
import {
  DEMO_AMBULANCE,
  DEMO_TRACKING_COORDINATES,
} from "../../data/studentDemoData.js";
import {
  formatRequestDate,
  isActiveRequest,
} from "../../utils/studentRequests.js";

const timeline = [
  {
    title: "Request Submitted",
    status: "Request received",
    description: "Your emergency details were recorded.",
  },
  {
    title: "Request Accepted",
    status: "Request accepted",
    description: "The demo response team accepted the request.",
  },
  {
    title: "Ambulance Assigned",
    status: "Ambulance assigned",
    description: "A demo ambulance and driver were assigned.",
  },
  {
    title: "Ambulance On The Way",
    status: "En route",
    description: "The simulated ambulance is heading to pickup.",
  },
  {
    title: "Ambulance Arrived",
    status: "On scene",
    description: "The simulated ambulance reached pickup.",
  },
  {
    title: "Emergency Completed",
    status: "Completed",
    description: "The demo response journey is complete.",
  },
];

const stageProgress = [0, 0.12, 0.3, 0.48, 0.6, 1];
const routeCoordinates = DEMO_TRACKING_COORDINATES.route;

function getStageIndex(status) {
  const index = timeline.findIndex((step) => step.status === status);
  return index < 0 ? 0 : index;
}

function positionAlongRoute(progress) {
  const lastSegment = routeCoordinates.length - 1;
  const routePosition = Math.min(progress, 1) * lastSegment;
  const segmentIndex = Math.min(Math.floor(routePosition), lastSegment - 1);
  const segmentProgress = routePosition - segmentIndex;
  const start = routeCoordinates[segmentIndex];
  const end = routeCoordinates[segmentIndex + 1];

  return [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress,
  ];
}

function createMapIcon(kind, label) {
  return L.divIcon({
    className: "jeevansetu-map-icon",
    html: `<span class="jeevansetu-map-pin jeevansetu-map-pin--${kind}">${label}</span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -19],
  });
}

const pickupIcon = createMapIcon("pickup", "P");
const ambulanceIcon = createMapIcon("ambulance", "A");
const hospitalIcon = createMapIcon("hospital", "H");

export default function StudentTrackPage() {
  const { requests, ambulances, updateRequestStatus } = useStudentRequests();
  const activeRequest = requests.find(isActiveRequest);
  const currentRequest =
    activeRequest ||
    (requests[0]?.status === "Completed" ? requests[0] : null);
  const [stageIndex, setStageIndex] = useState(() =>
    getStageIndex(currentRequest?.status),
  );
  const [routeProgress, setRouteProgress] = useState(
    () => stageProgress[getStageIndex(currentRequest?.status)],
  );
  const [simulationPlaying, setSimulationPlaying] = useState(true);
  const [mapViewVersion, setMapViewVersion] = useState(0);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    if (!currentRequest) return;
    const nextStage = getStageIndex(currentRequest.status);
    setStageIndex(nextStage);
    setRouteProgress(stageProgress[nextStage]);
  }, [currentRequest?.id, currentRequest?.status]);

  useEffect(() => {
    if (
      !currentRequest ||
      currentRequest.status === "Completed" ||
      !simulationPlaying ||
      stageIndex >= timeline.length - 1
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setStageIndex((current) => Math.min(current + 1, timeline.length - 1));
    }, 15000);

    return () => window.clearTimeout(timer);
  }, [currentRequest?.id, currentRequest?.status, simulationPlaying, stageIndex]);

  useEffect(() => {
    if (!currentRequest) return;
    if (currentRequest.status === timeline[stageIndex].status) return;

    try {
      updateRequestStatus(currentRequest.id, timeline[stageIndex].status);
      setStorageError("");
    } catch {
      setStorageError(
        "The demo status could not be saved in this browser. Check local storage settings.",
      );
    }
  }, [currentRequest?.id, stageIndex, updateRequestStatus]);

  useEffect(() => {
    const target = stageProgress[stageIndex];
    const timer = window.setInterval(() => {
      setRouteProgress((current) => {
        const difference = target - current;
        if (Math.abs(difference) < 0.015) return target;
        return current + Math.sign(difference) * Math.min(0.015, Math.abs(difference));
      });
    }, 250);

    return () => window.clearInterval(timer);
  }, [stageIndex]);

  const currentPosition = positionAlongRoute(routeProgress);
  const currentStage = timeline[stageIndex];
  const assignedAmbulance = ambulances.find(
    (ambulance) => ambulance.id === currentRequest?.ambulanceId,
  );
  const ambulanceRegistration =
    assignedAmbulance?.id || DEMO_AMBULANCE.registrationNumber;
  const driverName = assignedAmbulance?.driver || DEMO_AMBULANCE.driverName;
  const driverContactNumber =
    assignedAmbulance?.driverContactNumber ||
    DEMO_AMBULANCE.driverContactNumber;
  const isDemoComplete = stageIndex >= timeline.length - 1;
  const driverAssigned = stageIndex >= 2;
  const driverAvailable = driverAssigned && stageIndex < timeline.length - 1;
  const eta =
    stageIndex === timeline.length - 1
      ? "Completed"
      : stageIndex >= 4
        ? "Arrived"
        : stageIndex === 3
          ? "3 min"
        : currentRequest?.eta || assignedAmbulance?.eta || DEMO_AMBULANCE.eta;

  function advanceSimulation() {
    if (stageIndex < timeline.length - 1) {
      setStageIndex((current) => Math.min(current + 1, timeline.length - 1));
    }
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <StudentPageHeading
        description="Follow the ambulance route and response timeline in this simulated tracking view."
        eyebrow="Student workspace / Track ambulance"
        title="Live ambulance tracking"
        action={
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-amber-800 sm:self-auto">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Demo simulation
          </span>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
        <ShieldAlert className="mt-0.5 shrink-0 text-amber-700" size={18} />
        <p className="text-xs leading-5 text-amber-950/85 sm:text-sm">
          This map uses fixed mock coordinates and a controlled status simulation. It does not show actual GPS data or contact emergency services.
        </p>
      </div>

      {currentRequest ? (
        <>
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)]">
            <Card className="overflow-hidden p-0">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted">
                    Request · {currentRequest.id}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-base font-extrabold text-ink">
                      {currentRequest.emergencyType}
                    </h2>
                    <RequestStatusBadge status={currentStage.status} />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    className="min-h-9 px-3 text-xs"
                    disabled={isDemoComplete}
                    onClick={() => setSimulationPlaying((playing) => !playing)}
                    variant="secondary"
                  >
                    {isDemoComplete ? (
                      <CheckCircle2 size={14} />
                    ) : simulationPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                    {isDemoComplete
                      ? "Demo complete"
                      : simulationPlaying
                        ? "Pause demo"
                        : "Resume demo"}
                  </Button>
                  <Button
                    aria-label="Advance demo tracking status"
                    className="min-h-9 px-3 text-xs"
                    disabled={isDemoComplete}
                    onClick={advanceSimulation}
                    variant="secondary"
                  >
                    <ArrowRight size={14} /> Next update
                  </Button>
                </div>
              </div>

              <div className="relative">
                <MapContainer
                  center={DEMO_TRACKING_COORDINATES.pickup}
                  className="h-[340px] w-full sm:h-[440px]"
                  key={currentRequest.id}
                  scrollWheelZoom={false}
                  zoom={14}
                  zoomControl
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    maxZoom={19}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    pathOptions={{
                      color: "#168ce0",
                      dashArray: "10 9",
                      lineCap: "round",
                      opacity: 0.9,
                      weight: 5,
                    }}
                    positions={routeCoordinates}
                  />
                  <Marker
                    alt="Student pickup location"
                    icon={pickupIcon}
                    position={DEMO_TRACKING_COORDINATES.pickup}
                    title="Student pickup"
                  >
                    <Popup>
                      <strong>Student pickup</strong>
                      <br />
                      {currentRequest.location}
                    </Popup>
                  </Marker>
                  <Marker
                    alt="Simulated ambulance location"
                    icon={ambulanceIcon}
                    position={currentPosition}
                    title="Simulated ambulance"
                  >
                    <Popup>
                      <strong>Demo ambulance</strong>
                      <br />
                      {ambulanceRegistration}
                    </Popup>
                  </Marker>
                  <Marker
                    alt="Hospital destination"
                    icon={hospitalIcon}
                    position={DEMO_TRACKING_COORDINATES.hospital}
                    title="Hospital destination"
                  >
                    <Popup>
                      <strong>City General Hospital</strong>
                      <br />
                      Demo destination
                    </Popup>
                  </Marker>
                  <FitRoute version={mapViewVersion} />
                </MapContainer>
                <button
                  aria-label="Fit route in map"
                  className="absolute right-3 top-3 z-[1000] flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-brand-50 hover:text-brand-700"
                  onClick={() => setMapViewVersion((version) => version + 1)}
                  type="button"
                >
                  <RefreshCw size={17} />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 px-4 py-3.5 sm:px-5">
                <MapLegend color="bg-brand-600" label="Ambulance" />
                <MapLegend color="bg-emerald-500" label="Pickup location" />
                <MapLegend color="bg-emergency" label="Hospital destination" />
                <span className="ml-auto text-[10px] text-slate-400">
                  OpenStreetMap · illustrative route
                </span>
              </div>
            </Card>

            <div className="space-y-5">
              <Card
                action={
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Simulated
                  </span>
                }
                description="Assigned response vehicle and driver"
                title="Ambulance details"
              >
                <div className="flex items-center gap-3 rounded-xl bg-brand-50/70 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
                    <Ambulance size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Registration number</p>
                    <p className="mt-0.5 text-base font-extrabold text-ink">
                      {driverAssigned ? ambulanceRegistration : "Awaiting assignment"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <DetailRow
                    icon={UserRound}
                    label="Driver name"
                    value={driverAssigned ? driverName : "Assigned at next demo step"}
                  />
                  <DetailRow
                    icon={PhoneCall}
                    label="Driver contact number"
                    value={
                      driverAssigned
                        ? driverContactNumber
                        : "Available after assignment"
                    }
                  />
                  <DetailRow
                    icon={Activity}
                    label="Ambulance status"
                    value={currentStage.title}
                  />
                  <DetailRow
                    icon={Clock3}
                    label="Estimated arrival"
                    value={eta}
                  />
                </div>
                {driverAvailable ? (
                  <Button
                    as="a"
                    className="mt-5 w-full"
                    href={`tel:${driverContactNumber.replace(/[^\d+]/g, "")}`}
                    variant="secondary"
                  >
                    <PhoneCall size={16} /> Contact driver
                  </Button>
                ) : (
                  <Button className="mt-5 w-full" disabled variant="secondary">
                    <PhoneCall size={16} /> Contact driver
                  </Button>
                )}
              </Card>

              <Card
                description={`Submitted ${formatRequestDate(currentRequest.createdAt)}`}
                title="Emergency request details"
              >
                <div className="space-y-3">
                  <DetailRow icon={Radio} label="Request ID" value={currentRequest.id} />
                  <DetailRow
                    icon={ShieldAlert}
                    label="Emergency type"
                    value={currentRequest.emergencyType}
                  />
                  <DetailRow
                    icon={MapPin}
                    label="Pickup location"
                    value={currentRequest.location}
                  />
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <p className="text-[11px] font-semibold text-muted">Description</p>
                    <p className="mt-1 text-xs leading-5 text-slate-700">
                      {currentRequest.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-muted">Priority</span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                      {currentRequest.priority}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card
            action={
              <span className="text-xs font-semibold text-muted">
                Step {stageIndex + 1} of {timeline.length}
              </span>
            }
            className="mt-6"
            description="Updates advance automatically in this demo. Pause or step through them whenever you like."
            title="Emergency tracking timeline"
          >
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {timeline.map((step, index) => {
                const isComplete = index < stageIndex;
                const isCurrent = index === stageIndex;
                return (
                  <li
                    aria-current={isCurrent ? "step" : undefined}
                    className={`flex gap-3 rounded-xl border p-3.5 transition ${
                      isCurrent
                        ? "border-brand-200 bg-brand-50/70"
                        : isComplete
                          ? "border-emerald-100 bg-emerald-50/40"
                          : "border-slate-100 bg-white"
                    }`}
                    key={step.title}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isCurrent
                          ? "bg-brand-600 text-white"
                          : isComplete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isComplete ? (
                        <Check size={16} strokeWidth={2.5} />
                      ) : (
                        <span className="text-xs font-extrabold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-ink">{step.title}</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted">
                        {isCurrent ? "Current stage · " : ""}
                        {step.description}
                      </p>
                    </div>
                    <span className="ml-auto mt-1 shrink-0">
                      {isComplete ? (
                        <CheckCircle2 className="text-emerald-600" size={16} />
                      ) : isCurrent ? (
                        <span className="block h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500" />
                      ) : (
                        <span className="block h-2.5 w-2.5 rounded-full border border-slate-300" />
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
            {storageError && (
              <p
                className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700"
                role="alert"
              >
                {storageError}
              </p>
            )}
            <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-4 text-[11px] leading-5 text-muted">
              <Navigation className="mt-0.5 shrink-0 text-brand-600" size={14} />
              Demo-only: timeline and marker movement use sample values. No live location is collected or shared.
            </p>
          </Card>
        </>
      ) : (
        <Card className="mx-auto max-w-2xl py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <ShieldAlert size={26} />
          </span>
          <h2 className="font-display mt-4 text-lg font-extrabold text-ink">
            No active ambulance to track
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Submit a demo request to see the map, response vehicle, and status timeline.
          </p>
          <Button as={Link} className="mt-5" to="/student/request">
            Request ambulance <ArrowRight size={15} />
          </Button>
        </Card>
      )}
    </div>
  );
}

function FitRoute({ version }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(routeCoordinates, { padding: [36, 36] });
  }, [map, version]);

  return null;
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 shrink-0 text-brand-600" size={15} />
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <span className="shrink-0 text-[11px] text-muted">{label}</span>
        <span className="break-all text-right text-xs font-semibold text-ink">
          {value}
        </span>
      </div>
    </div>
  );
}

function MapLegend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}
