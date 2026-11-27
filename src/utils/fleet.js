export function isAmbulanceDispatchAvailable(ambulance, drivers) {
  const driver = drivers.find(
    (item) => item.id === ambulance.assignedDriverId,
  );

  return (
    ambulance.status === "Available" &&
    Boolean(driver) &&
    driver.availability === "Available"
  );
}

export function getDispatchableAmbulances(ambulances, drivers) {
  return ambulances.filter((ambulance) =>
    isAmbulanceDispatchAvailable(ambulance, drivers),
  );
}

export function hasActiveRequestForAmbulance(requests, ambulanceId) {
  return requests.some(
    (request) =>
      request.ambulanceId === ambulanceId &&
      request.status !== "Completed" &&
      request.status !== "Cancelled",
  );
}
