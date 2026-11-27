import {
  Activity,
  ArrowRight,
  Ambulance,
  CalendarClock,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MapPin,
  Siren,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import RequestStatusBadge from "../../components/student/RequestStatusBadge.jsx";
import StudentPageHeading from "../../components/student/StudentPageHeading.jsx";
import { STUDENT_PROFILE } from "../../data/studentDemoData.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useStudentRequests } from "../../context/EmergencyRequestContext.jsx";
import {
  formatRequestDate,
  isActiveRequest,
} from "../../utils/studentRequests.js";

const iconStyles = {
  blue: "bg-brand-50 text-brand-600",
  red: "bg-red-50 text-emergency",
  green: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
};

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { requests } = useStudentRequests();
  const activeRequests = requests.filter(isActiveRequest);
  const completedRequests = requests.filter(
    (request) => request.status === "Completed",
  );
  const currentRequest = activeRequests[0];
  const studentName = user?.username === "student" ? STUDENT_PROFILE.name : user?.username;

  const stats = [
    {
      label: "Total requests",
      value: requests.length,
      icon: Users,
      tone: "blue",
      detail: "All time",
    },
    {
      label: "Active requests",
      value: activeRequests.length,
      icon: Ambulance,
      tone: "red",
      detail: "Requiring attention",
    },
    {
      label: "Completed requests",
      value: completedRequests.length,
      icon: CheckCircle2,
      tone: "green",
      detail: "Successfully resolved",
    },
    {
      label: "Current emergency status",
      value: currentRequest ? currentRequest.status : "All clear",
      icon: HeartPulse,
      tone: currentRequest ? "red" : "violet",
      detail: currentRequest ? currentRequest.id : "No active requests",
    },
  ];

  const recentRequests = requests.slice(0, 4);

  return (
    <div className="mx-auto max-w-[1440px]">
      <StudentPageHeading
        description="Your personal emergency response overview."
        eyebrow="Student workspace"
        title={`Welcome back, ${studentName}`}
        action={
          <Button
            as={Link}
            className="min-h-12 rounded-xl bg-emergency shadow-red-600/15 hover:bg-red-600 focus-visible:ring-red-200"
            to="/student/request?priority=Critical"
            variant="danger"
          >
            <Siren size={18} /> Emergency SOS
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card className="p-4 sm:p-5" key={stat.label}>
            <div className="flex items-start justify-between gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyles[stat.tone]}`}>
                <stat.icon size={19} />
              </span>
              <span className="text-xs font-medium text-slate-400">{stat.detail}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-muted">{stat.label}</p>
            <p className={`font-display mt-1.5 truncate text-2xl font-extrabold tracking-tight ${
              stat.label === "Current emergency status" && currentRequest
                ? "text-emergency"
                : "text-ink"
            }`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="relative overflow-hidden border-brand-100 bg-gradient-to-br from-brand-600 to-[#0b5b9e] p-5 text-white sm:p-6">
              <div className="absolute -right-7 -top-8 h-32 w-32 rounded-full border border-white/10" />
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <Siren size={21} />
                </span>
                <h2 className="font-display mt-5 text-lg font-extrabold">
                  Need emergency help?
                </h2>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  Send a request with your location and follow its status from your dashboard.
                </p>
                <Button
                  as={Link}
                  className="mt-5 min-h-10 bg-white px-3.5 text-xs text-brand-700 hover:bg-blue-50 focus-visible:ring-white/40"
                  to="/student/request"
                  variant="secondary"
                >
                  Request an ambulance <ArrowRight size={15} />
                </Button>
              </div>
            </Card>

            <Card
              action={
                currentRequest ? (
                  <RequestStatusBadge status={currentRequest.status} />
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    All clear
                  </span>
                )
              }
              className="p-5 sm:p-6"
              description={
                currentRequest
                  ? `Request ${currentRequest.id}`
                  : "You currently have no active emergencies."
              }
              title="Current request status"
            >
              {currentRequest ? (
                <>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <Ambulance size={20} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">
                          {currentRequest.emergencyType}
                        </p>
                        <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-muted">
                          <MapPin className="mt-0.5 shrink-0" size={13} />
                          {currentRequest.location}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="text-xs text-muted">
                        {currentRequest.ambulanceId
                          ? `${currentRequest.ambulanceId} · ETA ${currentRequest.eta || "updating"}`
                          : "Dispatch team notified"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                        <Clock3 size={13} />
                        {currentRequest.ambulanceId ? currentRequest.eta : "Now"}
                      </span>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    className="mt-4 w-full"
                    to="/student/track-ambulance"
                    variant="secondary"
                  >
                    Track ambulance <ArrowRight size={15} />
                  </Button>
                </>
              ) : (
                <div className="rounded-xl bg-emerald-50/70 p-4">
                  <p className="text-sm font-semibold text-emerald-800">
                    You&apos;re all set.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Your latest request updates will appear here.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <Card
            action={
              <Link
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
                to="/student/requests"
              >
                View all <ArrowRight size={14} />
              </Link>
            }
            description="A quick look at your recent activity"
            title="Recent emergency requests"
          >
            {recentRequests.length > 0 ? (
              <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 pr-4">Request</th>
                      <th className="py-3 pr-4">Emergency type</th>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentRequests.map((request) => (
                      <tr className="text-sm" key={request.id}>
                        <td className="py-4 pr-4">
                          <Link
                            className="font-bold text-brand-700 hover:text-brand-800"
                            to="/student/requests"
                          >
                            {request.id}
                          </Link>
                          <p className="mt-1 text-xs text-slate-400">{request.priority} priority</p>
                        </td>
                        <td className="whitespace-nowrap py-4 pr-4 text-slate-600">
                          {request.emergencyType}
                        </td>
                        <td className="whitespace-nowrap py-4 pr-4 text-xs text-slate-500">
                          {formatRequestDate(request.createdAt)}
                        </td>
                        <td className="py-4">
                          <RequestStatusBadge status={request.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyRequests />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            className="border-amber-100 bg-amber-50/60"
            description="Keep these steps in mind while you wait for help."
            title="Emergency assistance"
          >
            <div className="space-y-4">
              <AssistanceTip
                icon={Activity}
                title="Stay somewhere safe"
                text="Move away from immediate hazards if you can do so safely."
              />
              <AssistanceTip
                icon={CalendarClock}
                title="Keep your phone nearby"
                text="Responders may call to confirm your location or details."
              />
              <AssistanceTip
                icon={ShieldAlert}
                title="Immediate danger?"
                text="Contact your local emergency services directly."
                urgent
              />
            </div>
            <p className="mt-5 border-t border-amber-200/70 pt-4 text-[11px] leading-5 text-amber-900/80">
              JeevanSetu is a frontend demo and does not dispatch emergency services.
            </p>
          </Card>

          <Card
            className="border-slate-100"
            description="Your demo student account details"
            title="Student information"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">
                {studentName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{STUDENT_PROFILE.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  Student ID · {STUDENT_PROFILE.studentId}
                </p>
              </div>
            </div>
            <Link
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
              to="/student/profile"
            >
              View my profile <ArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AssistanceTip({ icon: Icon, title, text, urgent = false }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          urgent ? "bg-red-100 text-emergency" : "bg-white text-brand-600"
        }`}
      >
        <Icon size={16} />
      </span>
      <div>
        <p className={`text-sm font-bold ${urgent ? "text-red-800" : "text-ink"}`}>
          {title}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function EmptyRequests() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Ambulance size={21} />
      </span>
      <p className="mt-3 text-sm font-semibold text-ink">No requests yet</p>
      <p className="mt-1 text-xs text-muted">Your requests will appear here.</p>
    </div>
  );
}
