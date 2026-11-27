import { formatRequestDate } from "../../utils/studentRequests.js";
import { getAdminRequestStatusLabel } from "../../utils/adminRequests.js";

export function RequestTable({ requests }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
      <table className="w-full min-w-[790px] border-collapse text-left">
        <thead>
          <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3 pr-4">Request / student</th>
            <th className="py-3 pr-4">Emergency / location</th>
            <th className="py-3 pr-4">Priority</th>
            <th className="py-3 pr-4">Received</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 text-right">Unit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((request) => (
            <tr className="text-xs" key={request.id}>
              <td className="py-3.5 pr-4">
                <span className="block font-extrabold text-ink">{request.id}</span>
                <span className="mt-1 block text-[11px] text-muted">
                {request.studentName || request.student}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <span className="block font-semibold text-ink">
                {request.emergencyType || request.emergency}
                </span>
                <span className="mt-1 block max-w-[200px] truncate text-[11px] text-muted">
                  {request.location}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <PriorityBadge priority={request.priority} />
              </td>
              <td className="whitespace-nowrap py-3.5 pr-4 text-[11px] text-muted">
                {request.received || formatRequestDate(request.createdAt)}
              </td>
              <td className="py-3.5 pr-4">
                <StatusBadge
                  status={getAdminRequestStatusLabel(request.status)}
                />
              </td>
              <td className="py-3.5 text-right font-semibold text-slate-600">
                {request.ambulanceId || request.ambulance || "Unassigned"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PriorityBadge({ priority }) {
  const style =
    priority === "Critical"
      ? "bg-red-50 text-red-700"
      : priority === "High"
        ? "bg-orange-50 text-orange-700"
        : priority === "Medium"
          ? "bg-amber-50 text-amber-700"
          : "bg-brand-50 text-brand-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${style}`}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-800",
    Accepted: "bg-cyan-50 text-cyan-700",
    Assigned: "bg-violet-50 text-violet-700",
    "On call": "bg-blue-50 text-blue-700",
    "En route": "bg-orange-50 text-orange-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Available: "bg-emerald-50 text-emerald-700",
    Unavailable: "bg-slate-100 text-slate-600",
    Maintenance: "bg-slate-100 text-slate-600",
    Active: "bg-brand-50 text-brand-700",
    "On scene": "bg-orange-50 text-orange-700",
    Rejected: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status !== "Completed" && status !== "Available" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {status}
    </span>
  );
}
