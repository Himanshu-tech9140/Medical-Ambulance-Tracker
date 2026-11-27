import {
  Ambulance,
  AlertTriangle,
  Check,
  CheckCircle2,
  Eye,
  Search,
  Siren,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Modal from "../../components/ui/Modal.jsx";
import RequestDetailsModal from "../../components/student/RequestDetailsModal.jsx";
import { PriorityBadge, StatusBadge } from "../../components/admin/AdminDataTable.jsx";
import { useEmergencyRequests } from "../../context/EmergencyRequestContext.jsx";
import {
  PRIORITY_LEVELS,
} from "../../data/studentDemoData.js";
import {
  ADMIN_REQUEST_STATUS_OPTIONS,
  getAdminRequestStatusLabel,
  getRequestStatusValue,
  getEmergencyMetrics,
} from "../../utils/adminRequests.js";
import { formatRequestDate } from "../../utils/studentRequests.js";
import { getDispatchableAmbulances } from "../../utils/fleet.js";

const isFinalStatus = (status) =>
  status === "Completed" || status === "Cancelled";

export default function AdminEmergencyRequestsPage() {
  const {
    allRequests,
    ambulances,
    drivers,
    assignAmbulance,
    storageError,
    updateRequestStatus,
  } = useEmergencyRequests();
  const [query, setQuery] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [detailsRequest, setDetailsRequest] = useState(null);
  const [assignmentRequest, setAssignmentRequest] = useState(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState("");
  const [actionError, setActionError] = useState("");
  const availableAmbulances = getDispatchableAmbulances(ambulances, drivers);
  const metrics = getEmergencyMetrics(allRequests, ambulances, drivers);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredRequests = useMemo(
    () =>
      allRequests.filter((request) => {
        const requestDate = new Date(request.createdAt);
        const matchesQuery =
          !normalizedQuery ||
          [request.studentName, request.studentId, request.id]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesEmergency =
          emergencyFilter === "All" ||
          request.emergencyType === emergencyFilter;
        const matchesPriority =
          priorityFilter === "All" || request.priority === priorityFilter;
        const matchesStatus =
          statusFilter === "All" ||
          getAdminRequestStatusLabel(request.status) === statusFilter;
        const localRequestDate = Number.isNaN(requestDate.getTime())
          ? ""
          : `${requestDate.getFullYear()}-${String(requestDate.getMonth() + 1).padStart(2, "0")}-${String(requestDate.getDate()).padStart(2, "0")}`;
        const matchesDate = !dateFilter || localRequestDate === dateFilter;

        return (
          matchesQuery &&
          matchesEmergency &&
          matchesPriority &&
          matchesStatus &&
          matchesDate
        );
      }),
    [
      allRequests,
      dateFilter,
      emergencyFilter,
      normalizedQuery,
      priorityFilter,
      statusFilter,
    ],
  );

  function runStatusAction(request, status) {
    setActionError("");
    try {
      updateRequestStatus(request.id, status);
    } catch {
      setActionError("The request update could not be saved. Check browser storage and try again.");
    }
  }

  function openAssignment(request) {
    setActionError("");
    setSelectedAmbulanceId("");
    setAssignmentRequest(request);
  }

  function confirmAssignment(event) {
    event.preventDefault();
    if (!assignmentRequest || !selectedAmbulanceId) return;
    setActionError("");
    try {
      assignAmbulance(assignmentRequest.id, selectedAmbulanceId);
      setAssignmentRequest(null);
      setSelectedAmbulanceId("");
    } catch (error) {
      setActionError(error.message || "The ambulance could not be assigned.");
    }
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            Operations / Emergency dispatch
          </p>
          <h1 className="font-display mt-1.5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Emergency requests
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Review student reports, coordinate available demo ambulances, and
            update request status.
          </p>
        </div>
        <span className="flex items-center gap-2 self-start rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-800 sm:self-auto">
          <Siren size={15} /> Frontend demo dispatch
        </span>
      </header>

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5">
        <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={18} />
        <p className="text-xs leading-5 text-amber-950/85 sm:text-sm">
          Actions update shared browser demo data only. No ambulance is actually
          dispatched and no emergency service is contacted.
        </p>
      </div>

      {(storageError || actionError) && (
        <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {actionError || storageError}
        </p>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="All requests"
          tone="blue"
          value={metrics.totalRequests}
        />
        <SummaryCard
          label="Pending review"
          tone="amber"
          value={metrics.pendingRequests}
        />
        <SummaryCard
          label="Active response"
          tone="red"
          value={metrics.activeRequests}
        />
        <SummaryCard
          label="Completed"
          tone="green"
          value={metrics.completedRequests}
        />
      </div>

      <Card
        action={
          <span className="text-xs font-semibold text-muted">
            {filteredRequests.length} of {allRequests.length} requests
          </span>
        }
        description="Search by student name, roll number, or request ID. Filters can be combined."
        title="Student emergency request queue"
      >
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              aria-label="Search by student name, roll number, or request ID"
              className="min-h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, roll number, request ID..."
              value={query}
            />
          </div>
          <FilterSelect
            label="Emergency type"
            onChange={setEmergencyFilter}
            options={["All", ...new Set(allRequests.map((request) => request.emergencyType))]}
            value={emergencyFilter}
          />
          <FilterSelect
            label="Priority"
            onChange={setPriorityFilter}
            options={["All", ...PRIORITY_LEVELS]}
            value={priorityFilter}
          />
          <FilterSelect
            label="Request status"
            onChange={setStatusFilter}
            options={["All", ...ADMIN_REQUEST_STATUS_OPTIONS]}
            value={statusFilter}
          />
          <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-600">
            Request date
            <input
              aria-label="Filter by request date"
              className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-ink outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              onChange={(event) => setDateFilter(event.target.value)}
              type="date"
              value={dateFilter}
            />
          </label>
        </div>

        {filteredRequests.length ? (
          <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
            <table className="w-full min-w-[1450px] border-collapse text-left">
              <thead>
                <tr className="border-y border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 pr-4">Request ID</th>
                  <th className="py-3 pr-4">Student / roll number</th>
                  <th className="py-3 pr-4">Contact</th>
                  <th className="py-3 pr-4">Emergency type</th>
                  <th className="py-3 pr-4">Priority</th>
                  <th className="py-3 pr-4">Pickup location</th>
                  <th className="py-3 pr-4">Request time</th>
                  <th className="py-3 pr-4">Current status</th>
                  <th className="py-3 text-right">Admin actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <RequestRow
                    availableAmbulances={availableAmbulances}
                    key={request.id}
                    onAccept={() => runStatusAction(request, "Request accepted")}
                    onAssign={() => openAssignment(request)}
                    onComplete={() => runStatusAction(request, "Completed")}
                    onReject={() => runStatusAction(request, "Cancelled")}
                    onStatusChange={(status) => runStatusAction(request, status)}
                    onView={() => setDetailsRequest(request)}
                    request={request}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Search size={22} />
            </span>
            <p className="mt-3 text-sm font-bold text-ink">No matching requests</p>
            <p className="mt-1 text-xs text-muted">
              Adjust your search or filters to see other demo requests.
            </p>
          </div>
        )}
      </Card>

      <RequestDetailsModal
        onClose={() => setDetailsRequest(null)}
        request={detailsRequest}
      />
      <AmbulanceAssignmentModal
        availableAmbulances={availableAmbulances}
        onClose={() => setAssignmentRequest(null)}
        onConfirm={confirmAssignment}
        onSelectionChange={setSelectedAmbulanceId}
        request={assignmentRequest}
        selectedAmbulanceId={selectedAmbulanceId}
      />
    </div>
  );
}

function RequestRow({
  request,
  availableAmbulances,
  onView,
  onAccept,
  onReject,
  onAssign,
  onStatusChange,
  onComplete,
}) {
  const isPending = request.status === "Request received";
  const isActive = !isFinalStatus(request.status);
  const canAssign = isActive && !request.ambulanceId;
  const canComplete = isActive && Boolean(request.ambulanceId);
  const nextStatusOptions = {
    "Ambulance assigned": ["En route"],
    "En route": ["On scene"],
  }[request.status] || [];

  return (
    <tr className="align-top text-xs">
      <td className="py-4 pr-4 font-extrabold text-ink">{request.id}</td>
      <td className="py-4 pr-4">
        <span className="block whitespace-nowrap font-bold text-ink">
          {request.studentName}
        </span>
        <span className="mt-1 block whitespace-nowrap text-[11px] text-muted">
          {request.studentId}
        </span>
      </td>
      <td className="whitespace-nowrap py-4 pr-4 text-slate-600">
        {request.contactNumber}
      </td>
      <td className="py-4 pr-4 font-semibold text-ink">{request.emergencyType}</td>
      <td className="py-4 pr-4">
        <PriorityBadge priority={request.priority} />
      </td>
      <td className="py-4 pr-4 text-slate-600">{request.location}</td>
      <td className="whitespace-nowrap py-4 pr-4 text-[11px] text-muted">
        {formatRequestDate(request.createdAt)}
      </td>
      <td className="py-4 pr-4">
        <StatusBadge status={getAdminRequestStatusLabel(request.status)} />
        {request.ambulanceId && (
          <span className="mt-1.5 block whitespace-nowrap text-[10px] font-semibold text-slate-500">
            {request.ambulanceId}
          </span>
        )}
      </td>
      <td className="py-3.5">
        <div className="flex min-w-[310px] flex-wrap justify-end gap-1.5">
          <ActionButton
            icon={Eye}
            label="View Details"
            onClick={onView}
            variant="secondary"
          />
          {isPending && (
            <ActionButton
              icon={Check}
              label="Accept Request"
              onClick={onAccept}
            />
          )}
          {isActive && (
            <ActionButton
              icon={X}
              label="Reject Request"
              onClick={onReject}
              variant="danger"
            />
          )}
          {canAssign && (
            <ActionButton
              disabled={!availableAmbulances.length}
              icon={AmbulanceIcon}
              label="Assign Ambulance"
              onClick={onAssign}
              variant="secondary"
            />
          )}
          {nextStatusOptions.length > 0 && (
            <select
              aria-label={`Update status for ${request.id}`}
              className="min-h-8 max-w-[136px] rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-semibold text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              onChange={(event) => {
                if (event.target.value) onStatusChange(event.target.value);
              }}
              value=""
            >
              <option disabled value="">Update Status</option>
              {nextStatusOptions.map((status) => (
                <option
                  key={status}
                  value={getRequestStatusValue(status)}
                >
                  {status}
                </option>
              ))}
            </select>
          )}
          {canComplete && (
            <ActionButton
              icon={CheckCircle2}
              label="Mark Completed"
              onClick={onComplete}
              variant="secondary"
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function AmbulanceIcon({ size = 14 }) {
  return <Ambulance size={size} />;
}

function ActionButton({ icon: Icon, label, onClick, variant = "ghost", disabled }) {
  return (
    <Button
      className="min-h-8 whitespace-nowrap px-2 py-1 text-[10px]"
      disabled={disabled}
      onClick={onClick}
      size="sm"
      variant={variant}
    >
      <Icon size={13} /> {label}
    </Button>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-600">
      {label}
      <select
        aria-label={label}
        className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All" ? "All" : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryCard({ label, value, tone }) {
  const styles = {
    blue: "border-brand-100 bg-brand-50 text-brand-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    red: "border-red-100 bg-red-50 text-red-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="font-display mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function AmbulanceAssignmentModal({
  request,
  availableAmbulances,
  selectedAmbulanceId,
  onSelectionChange,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      className="max-w-xl"
      description="Only ambulances currently marked available can be selected."
      onClose={onClose}
      open={Boolean(request)}
      title="Assign an ambulance"
    >
      {request && (
        <form className="space-y-5" onSubmit={onConfirm}>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold text-ink">
              {request.id} · {request.studentName}
            </p>
            <p className="mt-1 text-xs text-muted">
              {request.emergencyType} · {request.location}
            </p>
          </div>
          {availableAmbulances.length ? (
            <label className="block text-sm font-semibold text-slate-700">
              Available ambulance
              <select
                autoFocus
                className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                onChange={(event) => onSelectionChange(event.target.value)}
                required
                value={selectedAmbulanceId}
              >
                <option disabled value="">Choose an available ambulance</option>
                {availableAmbulances.map((ambulance) => (
                  <option key={ambulance.id} value={ambulance.id}>
                    {ambulance.id} · {ambulance.driver} · {ambulance.area}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
              No ambulances are currently available in the demo fleet.
            </p>
          )}
          <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button disabled={!availableAmbulances.length || !selectedAmbulanceId} type="submit">
              <AmbulanceIcon size={16} /> Assign ambulance
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
