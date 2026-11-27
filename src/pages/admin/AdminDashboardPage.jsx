import {
  Activity,
  Ambulance,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Siren,
  Users,
} from "lucide-react";
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
import { Link } from "react-router-dom";
import AdminLiveMap from "../../components/admin/AdminLiveMap.jsx";
import { RequestTable } from "../../components/admin/AdminDataTable.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useEmergencyRequests } from "../../context/EmergencyRequestContext.jsx";
import {
  DAILY_EMERGENCY_DATA,
  WEEKLY_EMERGENCY_DATA,
} from "../../data/adminDemoData.js";
import {
  getEmergencyMetrics,
  getPriorityDistribution,
} from "../../utils/adminRequests.js";
import { getDispatchableAmbulances } from "../../utils/fleet.js";

const chartTooltipStyle = {
  border: "1px solid #e8eef5",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(30, 64, 112, 0.1)",
  fontSize: "12px",
};

export default function AdminDashboardPage() {
  const { allRequests, ambulances, drivers, storageError } =
    useEmergencyRequests();
  const overview = getEmergencyMetrics(allRequests, ambulances, drivers);
  const priorityDistribution = getPriorityDistribution(allRequests);
  const activeRequests = allRequests.filter(
    (request) =>
      request.status !== "Completed" && request.status !== "Cancelled",
  ).slice(0, 5);
  const availableUnits = getDispatchableAmbulances(ambulances, drivers);
  const statCards = [
    {
      label: "Total ambulances",
      value: overview.totalAmbulances,
      detail: "Fleet registered",
      icon: Ambulance,
      tone: "blue",
    },
    {
      label: "Available ambulances",
      value: overview.availableAmbulances,
      detail: "Ready for dispatch",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Busy ambulances",
      value: overview.busyAmbulances,
      detail: "On active calls",
      icon: Activity,
      tone: "amber",
    },
    {
      label: "Emergency requests",
      value: overview.totalRequests,
      detail: "All recorded requests",
      icon: Siren,
      tone: "blue",
    },
    {
      label: "Pending requests",
      value: overview.pendingRequests,
      detail: "Require dispatch review",
      icon: Clock3,
      tone: "red",
    },
    {
      label: "Completed requests",
      value: overview.completedRequests,
      detail: "Successfully resolved",
      icon: CheckCircle2,
      tone: "green",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            Operations center / Overview
          </p>
          <h1 className="font-display mt-1.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Admin dashboard
          </h1>
          <p className="mt-2 text-sm text-muted">
            Monitor emergency response activity and campus ambulance readiness.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800 sm:self-auto">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Demo operations data
        </div>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
        <Activity className="mt-0.5 shrink-0 text-brand-700" size={18} />
        <p className="text-xs leading-5 text-blue-950/85 sm:text-sm">
          This admin workspace uses sample data for demonstration. It is not
          connected to a dispatch service or live ambulance GPS.
        </p>
      </div>
      {storageError && (
        <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {storageError}
        </p>
      )}

      <section
        aria-label="Dashboard statistics"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
      >
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <Card
          action={
            <Link
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
              to="/admin/emergency-requests"
            >
              View requests <ArrowRight size={14} />
            </Link>
          }
          description="Requests requiring a response and currently active dispatches."
          title="Emergency request overview"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <OverviewMetric
              label="Awaiting dispatch"
              value={overview.pendingRequests}
              tone="red"
            />
            <OverviewMetric
              label="Active response"
              value={overview.activeRequests}
              tone="amber"
            />
            <OverviewMetric
              label="Resolved today"
              value="23"
              tone="green"
            />
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emergency shadow-sm">
                <Siren size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">
                  Priority dispatch queue
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {overview.pendingRequests}{" "}
                  requests are waiting for review in the sample queue.
                </p>
              </div>
            </div>
            <Button as={Link} size="sm" to="/admin/emergency-requests" variant="danger">
              Review queue
            </Button>
          </div>
        </Card>

        <Card
          action={
            <Link
              className="text-xs font-bold text-brand-700 hover:text-brand-800"
              to="/admin/ambulances"
            >
              Fleet details
            </Link>
          }
          description="Current demo fleet status."
          title="Ambulance availability"
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-3xl font-extrabold text-ink">
                {overview.availableAmbulances}
                <span className="ml-1 text-base font-semibold text-muted">
                  / {overview.totalAmbulances}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted">units ready to respond</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
              Fleet status
            </span>
          </div>
          <div
            aria-label="Ambulance availability distribution"
            className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-slate-100"
          >
            <span
              className="bg-emerald-500"
              style={{ width: `${overview.totalAmbulances ? (overview.availableAmbulances / overview.totalAmbulances) * 100 : 0}%` }}
            />
            <span
              className="bg-amber-400"
              style={{ width: `${overview.totalAmbulances ? (overview.busyAmbulances / overview.totalAmbulances) * 100 : 0}%` }}
            />
            <span
              className="bg-slate-300"
              style={{ width: `${overview.totalAmbulances ? (overview.maintenanceAmbulances / overview.totalAmbulances) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-4 space-y-3">
            <FleetStatusRow
              color="bg-emerald-500"
              label="Available"
              value={overview.availableAmbulances}
            />
            <FleetStatusRow
              color="bg-amber-400"
              label="Busy"
              value={overview.busyAmbulances}
            />
            <FleetStatusRow
              color="bg-slate-300"
              label="Maintenance"
              value={overview.maintenanceAmbulances}
            />
          </div>
        </Card>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card
          description="Sample request volume throughout today."
          title="Daily emergency statistics"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Requests by hour</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
              <ArrowUpRight size={13} /> Today
            </span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart
                data={DAILY_EMERGENCY_DATA}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dailyRequestFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#108ce0" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#108ce0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#edf2f7" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="time"
                  tick={{ fill: "#8290a4", fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tick={{ fill: "#8290a4", fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  dataKey="requests"
                  fill="url(#dailyRequestFill)"
                  name="Requests"
                  stroke="#108ce0"
                  strokeWidth={2.5}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          description="Sample emergency request volume for the last seven days."
          title="Weekly emergency statistics"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Requests by day</span>
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">
              Last 7 days
            </span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={WEEKLY_EMERGENCY_DATA}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#edf2f7" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="day"
                  tick={{ fill: "#8290a4", fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tick={{ fill: "#8290a4", fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar
                  dataKey="requests"
                  fill="#108ce0"
                  name="Requests"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.78fr)]">
        <Card
          action={
            <Link
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
              to="/admin/emergency-requests"
            >
              View all <ArrowRight size={14} />
            </Link>
          }
          description="Latest sample dispatch activity."
          title="Recent emergency requests"
        >
          <RequestTable requests={activeRequests} />
        </Card>

        <Card
          action={
            <Link
              className="text-xs font-bold text-brand-700 hover:text-brand-800"
              to="/admin/emergency-requests"
            >
              Request list
            </Link>
          }
          description="Distribution across all recorded requests."
          title="Emergency priority distribution"
        >
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(150px,0.8fr)_minmax(160px,1fr)]">
            <div className="relative mx-auto h-[190px] w-full max-w-[230px]">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    dataKey="value"
                    innerRadius={56}
                    outerRadius={82}
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
                <span className="text-[10px] font-semibold text-muted">
                  total requests
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {priorityDistribution.map((priority) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={priority.name}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: priority.color }}
                    />
                    {priority.name}
                  </span>
                  <span className="text-xs font-extrabold text-ink">
                    {priority.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <Card
          action={
            <Link
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
              to="/admin/tracking"
            >
              Open live tracking <ArrowRight size={14} />
            </Link>
          }
          description="Illustrative locations for active demo units."
          title="Active ambulance locations"
        >
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <AdminLiveMap />
          </div>
          <p className="mt-3 text-[11px] leading-5 text-muted">
            OpenStreetMap · fixed demo coordinates, not live GPS.
          </p>
        </Card>

        <Card
          action={
            <Link
              className="text-xs font-bold text-brand-700 hover:text-brand-800"
              to="/admin/ambulances"
            >
              Manage fleet
            </Link>
          }
          description="Units currently marked available in the demo fleet."
          title="Ready for dispatch"
        >
          <div className="space-y-1">
            {availableUnits.slice(0, 5).map((unit) => (
              <div
                className="flex items-center justify-between gap-3 border-b border-slate-50 py-3 last:border-0"
                key={unit.id}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Ambulance size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-ink">{unit.id}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {unit.area} · {unit.driver}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  Available
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-brand-50/70 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-800">
              <Users size={15} /> Driver coverage
            </div>
            <p className="mt-1 text-[11px] leading-5 text-slate-600">
              Demo roster includes drivers across three sample shift windows.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
  const tones = {
    blue: "bg-brand-50 text-brand-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold leading-5 text-muted">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="font-display mt-2 text-2xl font-extrabold tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-muted">{detail}</p>
    </div>
  );
}

function OverviewMetric({ label, value, tone }) {
  const tones = {
    red: "border-red-100 bg-red-50 text-red-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`rounded-xl border p-3.5 ${tones[tone]}`}>
      <p className="text-[11px] font-semibold">{label}</p>
      <p className="font-display mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function FleetStatusRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-2 text-slate-600">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        {label}
      </span>
      <span className="font-extrabold text-ink">{value} units</span>
    </div>
  );
}

