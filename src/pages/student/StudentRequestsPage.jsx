import { ClipboardList, Eye, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import RequestDetailsModal from "../../components/student/RequestDetailsModal.jsx";
import RequestStatusBadge from "../../components/student/RequestStatusBadge.jsx";
import StudentPageHeading from "../../components/student/StudentPageHeading.jsx";
import { useStudentRequests } from "../../context/EmergencyRequestContext.jsx";
import {
  formatRequestDate,
  isActiveRequest,
} from "../../utils/studentRequests.js";

export default function StudentRequestsPage() {
  const { requests } = useStudentRequests();
  const [filter, setFilter] = useState("All requests");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [search, setSearch] = useState("");

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus =
        filter === "All requests" ||
        (filter === "Active" && isActiveRequest(request)) ||
        (filter === "Completed" && request.status === "Completed");
      const matchesSearch =
        !normalizedSearch ||
        [
          request.id,
          request.emergencyType,
          request.location,
          request.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [filter, requests, search]);

  return (
    <div className="mx-auto max-w-[1440px]">
      <StudentPageHeading
        action={
          <Button as={Link} to="/student/request">
            <Plus size={17} /> New request
          </Button>
        }
        description="Review the status and details of your emergency requests."
        eyebrow="Student workspace / My requests"
        title="My emergency requests"
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="All requests"
          value={requests.length}
          tone="blue"
        />
        <SummaryCard
          label="Active"
          value={requests.filter(isActiveRequest).length}
          tone="amber"
        />
        <SummaryCard
          label="Completed"
          value={requests.filter((request) => request.status === "Completed").length}
          tone="green"
        />
      </div>

      <Card
        action={
          <span className="text-xs font-medium text-muted">
            {filteredRequests.length} shown
          </span>
        }
        description="Demo requests are saved locally in this browser."
        title="Request history"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              aria-label="Search requests"
              className="min-h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ID, type, location..."
              value={search}
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            Status
            <select
              className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              onChange={(event) => setFilter(event.target.value)}
              value={filter}
            >
              <option>All requests</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </label>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
            <table className="w-full min-w-[790px] border-collapse text-left">
              <thead>
                <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 pr-4">Request ID</th>
                  <th className="py-3 pr-4">Emergency type</th>
                  <th className="py-3 pr-4">Submitted</th>
                  <th className="py-3 pr-4">Priority</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <tr className="text-sm" key={request.id}>
                    <td className="py-4 pr-4 font-bold text-ink">{request.id}</td>
                    <td className="py-4 pr-4 text-slate-600">
                      <span className="block font-semibold text-ink">
                        {request.emergencyType}
                      </span>
                      <span className="mt-1 block max-w-[220px] truncate text-xs text-muted">
                        {request.location}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 text-xs text-slate-500">
                      {formatRequestDate(request.createdAt)}
                    </td>
                    <td className="py-4 pr-4">
                      <PriorityBadge priority={request.priority} />
                    </td>
                    <td className="py-4 pr-4">
                      <RequestStatusBadge status={request.status} />
                    </td>
                    <td className="py-4 text-right">
                      <button
                        aria-label={`View request ${request.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-50"
                        onClick={() => setSelectedRequest(request)}
                        type="button"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <ClipboardList size={23} />
            </span>
            <p className="mt-3 text-sm font-bold text-ink">No matching requests</p>
            <p className="mt-1 text-xs text-muted">
              Try a different search or submit a new request.
            </p>
            <Button as={Link} className="mt-4" size="sm" to="/student/request">
              Create a request <Plus size={14} />
            </Button>
          </div>
        )}
      </Card>

      <RequestDetailsModal
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  const tones = {
    blue: "border-brand-100 bg-brand-50 text-brand-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="font-display mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const style =
    priority === "Critical" || priority === "High"
      ? "bg-red-50 text-red-700"
      : priority === "Medium"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${style}`}>
      {priority}
    </span>
  );
}
