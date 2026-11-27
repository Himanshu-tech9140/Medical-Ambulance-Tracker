import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Ambulance,
  CalendarCheck,
  Clock3,
  HeartPulse,
  MapPin,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";

const stats = [
  {
    label: "Total patients",
    value: "2,486",
    change: "+12.8%",
    note: "vs. last month",
    icon: Users,
    tone: "blue",
    positive: true,
  },
  {
    label: "Appointments today",
    value: "148",
    change: "+8.2%",
    note: "vs. yesterday",
    icon: CalendarCheck,
    tone: "green",
    positive: true,
  },
  {
    label: "Available ambulances",
    value: "12",
    change: "3 active",
    note: "on emergency calls",
    icon: Ambulance,
    tone: "red",
    positive: null,
  },
  {
    label: "Avg. response time",
    value: "08:24",
    change: "-1m 12s",
    note: "vs. last week",
    icon: Clock3,
    tone: "purple",
    positive: true,
  },
];

const appointments = [
  {
    initials: "EC",
    name: "Emma Collins",
    type: "Cardiology consultation",
    time: "09:30 AM",
    doctor: "Dr. Michael Chen",
    status: "Checked in",
    color: "bg-violet-100 text-violet-700",
  },
  {
    initials: "JW",
    name: "James Wilson",
    type: "General check-up",
    time: "10:15 AM",
    doctor: "Dr. Olivia Patel",
    status: "In progress",
    color: "bg-amber-100 text-amber-700",
  },
  {
    initials: "SR",
    name: "Sophia Rodriguez",
    type: "Pediatric follow-up",
    time: "11:00 AM",
    doctor: "Dr. Noah Williams",
    status: "Upcoming",
    color: "bg-pink-100 text-pink-700",
  },
  {
    initials: "LM",
    name: "Liam Martinez",
    type: "Orthopedic review",
    time: "11:30 AM",
    doctor: "Dr. Ava Thompson",
    status: "Upcoming",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const activityBars = [38, 56, 46, 73, 54, 82, 62, 49, 91, 67, 76, 58];

function StatCard({ stat }) {
  const Icon = stat.icon;
  const iconTones = {
    blue: "bg-brand-50 text-brand-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-emergency",
    purple: "bg-violet-50 text-violet-600",
  };
  const TrendIcon = stat.positive === false ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTones[stat.tone]}`}>
          <Icon size={19} />
        </span>
        <button aria-label={`More options for ${stat.label}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <p className="mt-4 text-sm font-medium text-muted">{stat.label}</p>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
          {stat.value}
        </span>
        {stat.positive === null ? (
          <span className="text-xs font-semibold text-emergency">{stat.change}</span>
        ) : (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
            <TrendIcon size={14} />
            {stat.change}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
    </Card>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Checked in": "bg-blue-50 text-blue-700",
    "In progress": "bg-amber-50 text-amber-700",
    Upcoming: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">{today}</p>
            <h1 className="font-display mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Good morning, Jordan <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 text-sm text-muted">
              Here&apos;s what&apos;s happening across your care network today.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={17} />
            Add appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)]">
          <Card
            action={
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800">
                View all <ArrowRight size={14} />
              </button>
            }
            description="Keep track of today’s scheduled visits"
            title="Today’s appointments"
          >
            <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 pr-4">Patient</th>
                    <th className="py-3 pr-4">Appointment</th>
                    <th className="py-3 pr-4">Time</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Doctor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr className="text-sm" key={appointment.name}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${appointment.color}`}>
                            {appointment.initials}
                          </span>
                          <span className="whitespace-nowrap font-semibold text-ink">
                            {appointment.name}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                        {appointment.type}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-slate-600">
                        {appointment.time}
                      </td>
                      <td className="py-4 pr-4">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="whitespace-nowrap py-4 text-slate-500">
                        {appointment.doctor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card
              action={
                <button aria-label="More activity options" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                  <MoreHorizontal size={18} />
                </button>
              }
              description="Patient visits over the last 12 months"
              title="Patient activity"
            >
              <div className="flex items-end justify-between gap-2 pt-4">
                {activityBars.map((height, index) => (
                  <div className="flex flex-1 flex-col items-center gap-2" key={index}>
                    <div className="flex h-28 w-full items-end rounded-t-md bg-brand-50">
                      <div
                        className={`w-full rounded-t-md ${index === 8 ? "bg-brand-600" : "bg-brand-200"}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {["N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O"][index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-muted">Total this month</span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                  1,284 <span className="text-xs font-semibold text-emerald-600">+9.4%</span>
                </span>
              </div>
            </Card>

            <Card
              action={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              }
              className="border-red-100"
              description="Emergency response fleet"
              title="Ambulance status"
            >
              <div className="flex items-center gap-4 rounded-xl bg-red-50/70 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emergency shadow-sm">
                  <Ambulance size={21} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-ink">Unit AMB-04</span>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-emergency">
                      RESPONDING
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted">En route to City General Hospital</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <MapPin size={14} /> ETA
                  </div>
                  <p className="mt-1 text-sm font-bold text-ink">04 min</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <HeartPulse size={14} /> Available units
                  </div>
                  <p className="mt-1 text-sm font-bold text-ink">12 units</p>
                </div>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 text-xs font-bold text-emergency transition hover:bg-red-50">
                Track emergency response <ArrowRight size={14} />
              </button>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:items-center sm:px-5">
          <Activity className="mt-0.5 shrink-0 text-brand-600 sm:mt-0" size={18} />
          <p className="flex-1 text-xs leading-5 text-slate-600 sm:text-sm">
            <span className="font-bold text-ink">Daily health check:</span>{" "}
            All clinics are reporting normally. Your care team has 6 follow-ups due this afternoon.
          </p>
          <Button className="hidden shrink-0 sm:inline-flex" size="sm" variant="secondary">
            View report
          </Button>
        </div>
      </div>

      <Modal
        description="Create a new patient visit in your care schedule."
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title="Add an appointment"
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setModalOpen(false);
          }}
        >
          <Input autoComplete="name" label="Patient name" name="patient" placeholder="Enter patient name" required />
          <Input label="Appointment type" name="type" placeholder="e.g. General check-up" required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Date" name="date" type="date" required />
            <Input label="Time" name="time" type="time" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button type="submit">
              Save appointment
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
