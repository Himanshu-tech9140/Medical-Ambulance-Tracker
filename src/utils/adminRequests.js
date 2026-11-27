import { getDispatchableAmbulances } from "./fleet.js";

const adminStatusLabels = {
  "Request received": "Pending",
  "Request accepted": "Accepted",
  "Ambulance assigned": "Assigned",
  "En route": "En route",
  "On scene": "On scene",
  Completed: "Completed",
  Cancelled: "Rejected",
};

const requestStatusValues = {
  Pending: "Request received",
  Accepted: "Request accepted",
  Assigned: "Ambulance assigned",
  "En route": "En route",
  "On scene": "On scene",
  Completed: "Completed",
  Rejected: "Cancelled",
};

export const ADMIN_REQUEST_STATUS_OPTIONS = Object.keys(requestStatusValues);

export function getAdminRequestStatusLabel(status) {
  return adminStatusLabels[status] || status;
}

export function getRequestStatusValue(label) {
  return requestStatusValues[label] || label;
}

export function getEmergencyMetrics(requests, ambulances, drivers = []) {
  const pendingRequests = requests.filter(
    (request) => request.status === "Request received",
  ).length;
  const completedRequests = requests.filter(
    (request) => request.status === "Completed",
  ).length;
  const activeRequests = requests.filter(
    (request) =>
      request.status !== "Request received" &&
      request.status !== "Completed" &&
      request.status !== "Cancelled",
  ).length;

  return {
    totalRequests: requests.length,
    pendingRequests,
    activeRequests,
    completedRequests,
    totalAmbulances: ambulances.length,
    availableAmbulances: drivers.length
      ? getDispatchableAmbulances(ambulances, drivers).length
      : ambulances.filter((ambulance) => ambulance.status === "Available")
          .length,
    busyAmbulances: ambulances.filter(
      (ambulance) =>
        ambulance.status !== "Available" &&
        ambulance.status !== "Maintenance",
    ).length,
    maintenanceAmbulances: ambulances.filter(
      (ambulance) => ambulance.status === "Maintenance",
    ).length,
  };
}

export function getPriorityDistribution(requests) {
  const colors = {
    Critical: "#e5484d",
    High: "#f97316",
    Medium: "#f4b740",
    Low: "#108ce0",
  };

  return Object.entries(colors).map(([name, color]) => ({
    name,
    color,
    value: requests.filter((request) => request.priority === name).length,
  }));
}
