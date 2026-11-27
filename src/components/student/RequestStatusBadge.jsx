const statusStyles = {
  "Request received": "bg-blue-50 text-blue-700",
  "Request accepted": "bg-cyan-50 text-cyan-700",
  "Ambulance assigned": "bg-violet-50 text-violet-700",
  "En route": "bg-amber-50 text-amber-700",
  "On scene": "bg-orange-50 text-orange-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-slate-100 text-slate-600",
};

export default function RequestStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status !== "Completed" && status !== "Cancelled" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {status}
    </span>
  );
}
