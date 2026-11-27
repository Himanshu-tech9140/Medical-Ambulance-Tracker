import { AlertTriangle, MapPin, Phone, UserRound } from "lucide-react";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import RequestStatusBadge from "./RequestStatusBadge.jsx";
import { formatRequestDate } from "../../utils/studentRequests.js";

export default function RequestDetailsModal({ request, onClose }) {
  if (!request) return null;

  return (
    <Modal
      description={`Request ${request.id}`}
      onClose={onClose}
      open={Boolean(request)}
      title="Emergency request details"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
          <div>
            <p className="text-xs text-muted">Current status</p>
            <div className="mt-1.5">
              <RequestStatusBadge status={request.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Priority</p>
            <p className="mt-1 text-sm font-bold text-ink">{request.priority}</p>
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Detail icon={AlertTriangle} label="Emergency type" value={request.emergencyType} />
          <Detail icon={UserRound} label="Student" value={request.studentName} />
          <Detail icon={Phone} label="Contact" value={request.contactNumber} />
          <Detail icon={MapPin} label="Location" value={request.location} />
          <Detail label="Student ID" value={request.studentId} />
          <Detail label="Submitted" value={formatRequestDate(request.createdAt)} />
        </dl>
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="text-xs font-semibold text-muted">Description</p>
          <p className="mt-1.5 text-sm leading-6 text-ink">{request.description}</p>
        </div>
        {request.ambulanceId && (
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
            <p className="text-xs font-semibold text-brand-700">Assigned ambulance</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {request.ambulanceId}
              {request.eta ? ` · estimated arrival ${request.eta}` : ""}
            </p>
          </div>
        )}
        <div className="flex justify-end pt-1">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-slate-100 p-3">
      {Icon && <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-brand-600" size={16} />}
      <div className="min-w-0">
        <dt className="text-[11px] font-medium text-muted">{label}</dt>
        <dd className="mt-1 break-words text-sm font-semibold text-ink">{value || "—"}</dd>
      </div>
    </div>
  );
}
