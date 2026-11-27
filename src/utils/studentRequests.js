export function createDemoRequestId() {
  const suffix =
    window.crypto?.randomUUID?.().slice(0, 8).toUpperCase() ||
    Date.now().toString(36).toUpperCase();
  return `MT-${new Date().getFullYear()}-${suffix}`;
}

export function formatRequestDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function isActiveRequest(request) {
  return request.status !== "Completed" && request.status !== "Cancelled";
}
