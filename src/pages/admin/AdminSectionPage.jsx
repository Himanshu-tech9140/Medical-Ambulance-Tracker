import {
  Activity,
  Ambulance,
  BarChart3,
  BellRing,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  Settings2,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLiveMap from "../../components/admin/AdminLiveMap.jsx";
import Card from "../../components/ui/Card.jsx";
import { RequestTable, StatusBadge } from "../../components/admin/AdminDataTable.jsx";
import {
  AmbulanceManagementSection,
  DriverManagementSection,
  StudentDirectorySection,
} from "../../components/admin/AdminManagementSections.jsx";
import { useEmergencyRequests } from "../../context/EmergencyRequestContext.jsx";
import {
  DAILY_EMERGENCY_DATA,
  WEEKLY_EMERGENCY_DATA,
} from "../../data/adminDemoData.js";
import {
  getAdminRequestStatusLabel,
  getEmergencyMetrics,
  getPriorityDistribution,
} from "../../utils/adminRequests.js";

const sectionInfo = {
  requests: {
    eyebrow: "Operations / Emergency requests",
    title: "Emergency requests",
    description: "Review incoming reports and monitor their demo dispatch status.",
    icon: Siren,
  },
  ambulances: {
    eyebrow: "Operations / Fleet",
    title: "Ambulance management",
    description: "Add and maintain vehicles, locations, availability, and driver assignments.",
    icon: Ambulance,
  },
  drivers: {
    eyebrow: "Operations / People",
    title: "Driver management",
    description: "Maintain driver contacts, demo licence records, availability, and vehicle assignments.",
    icon: Users,
  },
  students: {
    eyebrow: "Operations / People",
    title: "Student management",
    description: "Search registered students and review contact details and request history.",
    icon: Users,
  },
  tracking: {
    eyebrow: "Operations / Live tracking",
    title: "Ambulance live tracking",
    description: "View illustrative locations for active demo response units.",
    icon: MapPin,
  },
  reports: {
    eyebrow: "Insights / Reports & analytics",
    title: "Reports & analytics",
    description: "Explore demo emergency response volume and priority trends.",
    icon: BarChart3,
  },
  settings: {
    eyebrow: "Workspace / Settings",
    title: "Admin settings",
    description: "Manage local demo preferences for the admin workspace.",
    icon: Settings2,
  },
};

const chartTooltipStyle = {
  border: "1px solid #e8eef5",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(30, 64, 112, 0.1)",
  fontSize: "12px",
};

export default function AdminSectionPage({ section }) {
  const { allRequests, ambulances, drivers, storageError } =
    useEmergencyRequests();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [preferences, setPreferences] = useState({
    criticalAlerts: true,
    dailySummary: true,
    soundAlerts: false,
  });
  const info = sectionInfo[section];
  const normalizedQuery = query.trim().toLowerCase();
  const overview = getEmergencyMetrics(allRequests, ambulances, drivers);
  const priorityDistribution = getPriorityDistribution(allRequests);

  const filteredRequests = useMemo(
    () =>
      allRequests.filter((request) => {
        const matchesFilter =
          filter === "All" ||
          getAdminRequestStatusLabel(request.status) === filter;
        const matchesQuery =
          !normalizedQuery ||
          [
            request.id,
            request.studentName,
            request.studentId,
            request.emergencyType,
            request.location,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      }),
    [allRequests, filter, normalizedQuery],
  );
  const activeAmbulances = ambulances.filter(
    (ambulance) => ["On call", "En route", "On scene"].includes(ambulance.status),
  );

  if (!info) {
    return null;
  }

  const Icon = info.icon;

  return (
    <div className="mx-auto max-w-[1500px]">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            {info.eyebrow}
          </p>
          <h1 className="font-display mt-1.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {info.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {info.description}
          </p>
        </div>
        {section !== "settings" && (
          <div className="flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-brand-800 sm:self-auto">
            <Icon size={15} /> Demo data
          </div>
        )}
      </header>
      {storageError && (
        <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {storageError}
        </p>
      )}

      {section === "requests" && (
        <RequestsSection
          filter={filter}
          overview={overview}
          onFilterChange={setFilter}
          onQueryChange={setQuery}
          query={query}
          requests={filteredRequests}
        />
      )}
      {section === "ambulances" && <AmbulanceManagementSection />}
      {section === "drivers" && <DriverManagementSection />}
      {section === "students" && <StudentDirectorySection />}
      {section === "tracking" && (
        <TrackingSection ambulances={activeAmbulances} />
      )}
      {section === "reports" && (
        <ReportsSection
          overview={overview}
          priorityDistribution={priorityDistribution}
        />
      )}
      {section === "settings" && (
        <SettingsSection
          onPreferenceChange={(name) =>
            setPreferences((current) => ({
              ...current,
              [name]: !current[name],
            }))
          }
          preferences={preferences}
        />
      )}
    </div>
  );
}

function RequestsSection({
  requests,
  filter,
  onFilterChange,
  query,
  onQueryChange,
  overview,
}) {
  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={Clock3}
          label="Pending"
          tone="amber"
          value={overview.pendingRequests}
        />
        <SummaryCard
          icon={Activity}
          label="Active response"
          tone="blue"
          value={overview.activeRequests}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          tone="green"
          value={overview.completedRequests}
        />
      </div>
      <Card
        action={
          <span className="text-xs font-semibold text-muted">
            {requests.length} shown
          </span>
        }
        description="Sample queue data. No dispatch action is sent from this demo."
        title="Request queue"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchField
            label="Search emergency requests"
            onChange={onQueryChange}
            placeholder="Search ID, student, location..."
            value={query}
          />
          <SelectField
            label="Request status"
            onChange={onFilterChange}
            options={["All", "Pending", "Assigned", "En route", "Completed"]}
            value={filter}
          />
        </div>
        {requests.length ? (
          <RequestTable requests={requests} />
        ) : (
          <EmptyState message="No sample requests match those filters." />
        )}
      </Card>
    </>
  );
}

function TrackingSection({ ambulances }) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
      <Card
        description="OpenStreetMap base layer with fixed sample coordinates."
        title="Active response map"
      >
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <AdminLiveMap fullHeight />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
            Active demo ambulance
          </span>
          <span>Map positions are illustrative, not live GPS.</span>
        </div>
      </Card>
      <div className="space-y-5">
        <SummaryCard
          icon={Activity}
          label="Active demo vehicles"
          tone="blue"
          value={ambulances.length}
        />
        <Card
          description="Sample unit locations and response statuses."
          title="Active units"
        >
          <div className="space-y-1">
            {ambulances.map((unit) => (
              <div
                className="flex items-center justify-between gap-3 border-b border-slate-50 py-3 last:border-0"
                key={unit.id}
              >
                <div>
                  <p className="text-xs font-extrabold text-ink">{unit.id}</p>
                  <p className="mt-1 text-[11px] text-muted">{unit.driver}</p>
                </div>
                <StatusBadge status={unit.status} />
              </div>
            ))}
          </div>
        </Card>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
            <MapPin size={15} /> Simulation notice
          </div>
          <p className="mt-2 text-xs leading-5 text-amber-900/80">
            Vehicle markers use static demo coordinates around the sample campus.
            No live location is collected or shown.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportsSection({ overview, priorityDistribution }) {
  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={Siren}
          label="Total requests"
          tone="blue"
          value={overview.totalRequests}
        />
        <SummaryCard
          icon={Clock3}
          label="Awaiting response"
          tone="amber"
          value={overview.pendingRequests}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          tone="green"
          value={overview.completedRequests}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card
          description="Sample response volume by hour for today."
          title="Daily requests"
        >
          <div className="h-[280px]">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={DAILY_EMERGENCY_DATA} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportDailyFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#108ce0" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#108ce0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#edf2f7" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tick={{ fill: "#8290a4", fontSize: 11 }} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tick={{ fill: "#8290a4", fontSize: 11 }} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area dataKey="requests" fill="url(#reportDailyFill)" name="Requests" stroke="#108ce0" strokeWidth={2.5} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card
          description="Sample request volume across the last seven days."
          title="Weekly requests"
        >
          <div className="h-[280px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={WEEKLY_EMERGENCY_DATA} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#edf2f7" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tick={{ fill: "#8290a4", fontSize: 11 }} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tick={{ fill: "#8290a4", fontSize: 11 }} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="requests" fill="#108ce0" name="Requests" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card
        className="mt-5"
        description="Priority mix for the demo request dataset."
        title="Priority breakdown"
      >
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[minmax(220px,0.65fr)_minmax(0,1fr)]">
          <div className="relative mx-auto h-[230px] w-full max-w-[280px]">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  dataKey="value"
                  innerRadius={66}
                  outerRadius={98}
                  paddingAngle={3}
                  stroke="none"
                >
                  {priorityDistribution.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-extrabold text-ink">
                {overview.totalRequests}
              </span>
              <span className="text-[10px] font-semibold text-muted">requests</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {priorityDistribution.map((priority) => (
              <div
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                key={priority.name}
              >
                <p className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: priority.color }} />
                  {priority.name} priority
                </p>
                <p className="font-display mt-2 text-2xl font-extrabold text-ink">{priority.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

function SettingsSection({ preferences, onPreferenceChange }) {
  const settings = [
    {
      id: "criticalAlerts",
      title: "Critical request alerts",
      description: "Show an in-app alert for critical demo requests.",
      icon: Siren,
    },
    {
      id: "dailySummary",
      title: "Daily operations summary",
      description: "Include a sample daily summary in this admin workspace.",
      icon: BarChart3,
    },
    {
      id: "soundAlerts",
      title: "Sound notifications",
      description: "Toggle the local demo preference for sound notifications.",
      icon: BellRing,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)]">
      <Card
        description="These preferences apply to this page session only."
        title="Notification preferences"
      >
        <div className="divide-y divide-slate-100">
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <label
                className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                key={setting.id}
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon size={17} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{setting.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">
                      {setting.description}
                    </span>
                  </span>
                </span>
                <input
                  checked={preferences[setting.id]}
                  className="h-4 w-4 shrink-0 accent-brand-600"
                  onChange={() => onPreferenceChange(setting.id)}
                  type="checkbox"
                />
              </label>
            );
          })}
        </div>
      </Card>
      <div className="space-y-5">
        <Card
          description="Role and security details for this demo environment."
          title="Account & security"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-emerald-600" size={18} />
              <div>
                <p className="text-xs font-bold text-ink">Demo admin access</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Role-based routes are protected in the frontend. This is not
                  production authentication.
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-muted">Workspace data</p>
              <p className="mt-1 text-xs leading-5 text-ink">
                Demo changes are saved in this browser's localStorage; no
                backend or database is connected.
              </p>
            </div>
          </div>
        </Card>
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <p className="text-xs font-extrabold text-brand-900">JeevanSetu Admin</p>
          <p className="mt-1 text-xs leading-5 text-brand-800/80">
            Responsive dispatch workspace · Frontend demo
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  const toneStyles = {
    blue: "border-brand-100 bg-brand-50 text-brand-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };
  return (
    <div className={`flex items-center gap-3 rounded-2xl border p-4 ${toneStyles[tone]}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
        <Icon size={19} />
      </span>
      <span>
        <span className="block text-xs font-semibold">{label}</span>
        <span className="font-display mt-0.5 block text-xl font-extrabold">{value}</span>
      </span>
    </div>
  );
}

function SearchField({ label, onChange, placeholder, value }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        aria-hidden="true"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        size={16}
      />
      <input
        aria-label={label}
        className="min-h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

function SelectField({ label, onChange, options, value }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
      {label}
      <select
        className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-xs text-muted">
      {message}
    </div>
  );
}
