import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  ADMIN_AMBULANCES,
  ADMIN_DRIVERS,
  ADMIN_REQUESTS,
  ADMIN_STUDENTS,
} from "../data/adminDemoData.js";
import {
  DEMO_STUDENT_REQUESTS,
  STUDENT_REQUEST_STORAGE_PREFIX,
} from "../data/studentDemoData.js";
import {
  hasActiveRequestForAmbulance,
  isAmbulanceDispatchAvailable,
} from "../utils/fleet.js";

const EmergencyRequestContext = createContext(null);
const STORAGE_KEY = "jeevansetu_dispatch_demo_store";
const EDITABLE_AMBULANCE_STATUSES = ["Available", "Maintenance"];
const EDITABLE_DRIVER_AVAILABILITY = ["Available", "Unavailable"];
const BUSY_STATUSES = ["On call", "En route", "On scene"];

const adminStatusToRequestStatus = {
  Pending: "Request received",
  Assigned: "Ambulance assigned",
  "En route": "En route",
  "On scene": "On scene",
  Completed: "Completed",
  Rejected: "Cancelled",
};

function getAdminRequestSeed(request, index) {
  const student = ADMIN_STUDENTS.find((entry) => entry.name === request.student);
  const receivedMinutes = Number(request.received.match(/\d+/)?.[0] || 0);

  return {
    id: request.id,
    username: request.student.split(" ")[0].toLowerCase(),
    studentName: request.student,
    studentId: student?.id || `STU-2024-${String(1000 + index).slice(-4)}`,
    contactNumber: student?.contactNumber || "+1 (202) 555-0199",
    emergencyType: request.emergency,
    description: `${request.emergency} reported at ${request.location}.`,
    location: request.location,
    priority: request.priority,
    status: adminStatusToRequestStatus[request.status] || "Request received",
    ambulanceId: request.ambulance === "Unassigned" ? "" : request.ambulance,
    eta: request.status === "En route" ? "4 min" : "",
    createdAt: new Date(Date.now() - receivedMinutes * 60 * 1000 - index).toISOString(),
  };
}

function getLegacyStudentRequests() {
  const legacyKey = `${STUDENT_REQUEST_STORAGE_PREFIX}_student`;
  const savedRequests = window.localStorage.getItem(legacyKey);
  if (!savedRequests) {
    return DEMO_STUDENT_REQUESTS.map((request) => ({
      ...request,
      username: "student",
    }));
  }

  try {
    const requests = JSON.parse(savedRequests);
    if (Array.isArray(requests)) {
      return requests.map((request) => ({
        ...request,
        username: request.username || "student",
      }));
    }
  } catch {
    window.localStorage.removeItem(legacyKey);
  }

  window.localStorage.removeItem(legacyKey);
  return DEMO_STUDENT_REQUESTS.map((request) => ({
    ...request,
    username: "student",
  }));
}

function createDemoStore(includeLegacyRequests = true) {
  const requests = [
    ...ADMIN_REQUESTS.map(getAdminRequestSeed),
    ...(includeLegacyRequests
      ? getLegacyStudentRequests()
      : DEMO_STUDENT_REQUESTS.map((request) => ({
          ...request,
          username: "student",
        }))),
  ].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  return normalizeStore({
    requests,
    ambulances: ADMIN_AMBULANCES,
    drivers: ADMIN_DRIVERS,
    students: ADMIN_STUDENTS,
  });
}

function normalizeStore(value) {
  const ambulances = value.ambulances.map((ambulance) => {
    const seed = ADMIN_AMBULANCES.find((item) => item.id === ambulance.id);
    return {
      ...ambulance,
      id: String(ambulance.id),
      registrationNumber: ambulance.registrationNumber || String(ambulance.id),
      vehicleModel:
        ambulance.vehicleModel || seed?.vehicleModel || "Ford Transit 350",
      area: ambulance.area || ambulance.location || "Location not set",
      location: ambulance.location || ambulance.area || "Location not set",
      status: ambulance.status || "Available",
      eta: ambulance.eta || "—",
    };
  });
  const sourceDrivers = Array.isArray(value.drivers)
    ? value.drivers
    : ADMIN_DRIVERS;
  const drivers = sourceDrivers.map((driver, index) => ({
    ...driver,
    id: driver.id || `DRV-${String(index + 1).padStart(3, "0")}`,
    contact: driver.contact || driver.contactNumber || "",
    licenseNumber: driver.licenseNumber || "",
    assignedAmbulanceId:
      driver.assignedAmbulanceId || driver.ambulance || "",
    availability: driver.availability || driver.status || "Available",
  }));
  const usedDriverIds = new Set();
  const assignedDriversByAmbulance = new Map();

  ambulances.forEach((ambulance) => {
    const assignedDriver =
      drivers.find((driver) => driver.id === ambulance.assignedDriverId) ||
      drivers.find(
        (driver) => driver.assignedAmbulanceId === ambulance.id,
      ) ||
      drivers.find((driver) => driver.ambulance === ambulance.id) ||
      drivers.find((driver) => driver.name === ambulance.driver);

    if (assignedDriver && !usedDriverIds.has(assignedDriver.id)) {
      usedDriverIds.add(assignedDriver.id);
      assignedDriversByAmbulance.set(ambulance.id, assignedDriver.id);
    }
  });

  const normalizedDrivers = drivers.map((driver) => {
    const ambulance = ambulances.find(
      (item) => assignedDriversByAmbulance.get(item.id) === driver.id,
    );
    const availability =
      ambulance && BUSY_STATUSES.includes(ambulance.status)
        ? ambulance.status
        : driver.availability;

    return {
      ...driver,
      assignedAmbulanceId: ambulance?.id || "",
      ambulance: ambulance?.id || "",
      availability,
      status: availability,
    };
  });
  const normalizedAmbulances = ambulances.map((ambulance) => {
    const driverId = assignedDriversByAmbulance.get(ambulance.id) || "";
    const driver = normalizedDrivers.find((item) => item.id === driverId);

    return {
      ...ambulance,
      assignedDriverId: driverId,
      driver: driver?.name || "Unassigned",
      driverContactNumber: driver?.contact || "",
    };
  });
  const students = (
    Array.isArray(value.students) ? value.students : ADMIN_STUDENTS
  ).map((student) => ({
    ...student,
    contactNumber: student.contactNumber || student.phone || "",
    requests: 0,
  }));

  return {
    ...value,
    requests: value.requests,
    ambulances: normalizedAmbulances,
    drivers: normalizedDrivers,
    students,
  };
}

function isValidStore(value) {
  return (
    value &&
    Array.isArray(value.requests) &&
    Array.isArray(value.ambulances) &&
    value.requests.every(
      (request) =>
        typeof request.id === "string" &&
        typeof request.studentId === "string" &&
        typeof request.status === "string",
    ) &&
    value.ambulances.every(
      (ambulance) =>
        typeof ambulance.id === "string" &&
        typeof ambulance.status === "string",
    )
  );
}

function readStore() {
  try {
    const savedStore = window.localStorage.getItem(STORAGE_KEY);
    if (savedStore) {
      try {
        const parsedStore = JSON.parse(savedStore);
        if (isValidStore(parsedStore)) {
          return { store: normalizeStore(parsedStore), storageError: "" };
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    const fallback = createDemoStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return { store: fallback, storageError: "" };
  } catch {
    return {
      store: createDemoStore(false),
      storageError: "Demo requests could not be read or saved in this browser.",
    };
  }
}

export function EmergencyRequestProvider({ children }) {
  const { user } = useAuth();
  const [storedState, setStoredState] = useState(readStore);
  const { store, storageError } = storedState;

  const commitStore = useCallback((nextStore) => {
    const normalizedStore = normalizeStore(nextStore);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedStore));
    } catch (error) {
      setStoredState((current) => ({
        ...current,
        storageError: "Demo changes could not be saved in this browser.",
      }));
      throw error;
    }
    setStoredState({ store: normalizedStore, storageError: "" });
  }, []);

  useEffect(() => {
    function syncStore(event) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      if (!event.newValue) {
        setStoredState(readStore());
        return;
      }

      try {
        const nextStore = JSON.parse(event.newValue);
        if (isValidStore(nextStore)) {
          setStoredState({
            store: normalizeStore(nextStore),
            storageError: "",
          });
        }
      } catch {
        setStoredState((current) => ({
          ...current,
          storageError: "Shared demo data could not be refreshed from another tab.",
        }));
      }
    }

    window.addEventListener("storage", syncStore);
    return () => window.removeEventListener("storage", syncStore);
  }, []);

  const addRequest = useCallback(
    (request) => {
      const studentIndex = store.students.findIndex(
        (student) =>
          student.id === request.studentId ||
          student.username === (user?.username || "student"),
      );
      const studentRecord = {
        id: request.studentId,
        name: request.studentName,
        contactNumber: request.contactNumber,
        campus: request.location.split(",")[0] || "Campus not set",
        username: user?.username || "student",
      };
      const students =
        studentIndex < 0
          ? [studentRecord, ...store.students]
          : store.students.map((student, index) =>
              index === studentIndex ? { ...student, ...studentRecord } : student,
            );
      const nextStore = {
        ...store,
        students,
        requests: [
          { ...request, username: user?.username || "student" },
          ...store.requests,
        ],
      };
      commitStore(nextStore);
      return request;
    },
    [commitStore, store, user?.username],
  );

  const updateRequestStatus = useCallback(
    (requestId, status, updates = {}) => {
      const request = store.requests.find((item) => item.id === requestId);
      if (!request) return;

      const nextRequests = store.requests.map((item) =>
        item.id === requestId ? { ...item, ...updates, status } : item,
      );
      let nextAmbulances = store.ambulances;
      let nextDrivers = store.drivers;

      if (BUSY_STATUSES.includes(status)) {
        nextAmbulances = store.ambulances.map((ambulance) =>
          ambulance.id === request.ambulanceId
            ? { ...ambulance, status }
            : ambulance,
        );
        const assignedDriverId = store.ambulances.find(
          (ambulance) => ambulance.id === request.ambulanceId,
        )?.assignedDriverId;
        nextDrivers = store.drivers.map((driver) =>
          driver.id === assignedDriverId
            ? { ...driver, availability: status, status }
            : driver,
        );
      } else if (status === "Completed" || status === "Cancelled") {
        nextAmbulances = store.ambulances.map((ambulance) =>
          ambulance.id === request.ambulanceId
            ? { ...ambulance, status: "Available", eta: "—" }
            : ambulance,
        );
        const assignedDriverId = store.ambulances.find(
          (ambulance) => ambulance.id === request.ambulanceId,
        )?.assignedDriverId;
        nextDrivers = store.drivers.map((driver) =>
          driver.id === assignedDriverId
            ? { ...driver, availability: "Available", status: "Available" }
            : driver,
        );
      }

      commitStore({
        ...store,
        requests: nextRequests,
        ambulances: nextAmbulances,
        drivers: nextDrivers,
      });
    },
    [commitStore, store],
  );

  const assignAmbulance = useCallback(
    (requestId, ambulanceId) => {
      const request = store.requests.find((item) => item.id === requestId);
      const ambulance = store.ambulances.find((item) => item.id === ambulanceId);
      const driver = store.drivers.find(
        (item) => item.id === ambulance?.assignedDriverId,
      );
      if (!request) throw new Error("The selected emergency request was not found.");
      if (!ambulance || !isAmbulanceDispatchAvailable(ambulance, store.drivers)) {
        throw new Error(
          "Select an available ambulance with an available assigned driver.",
        );
      }
      if (request.status === "Completed" || request.status === "Cancelled") {
        throw new Error("A completed or rejected request cannot be assigned.");
      }
      if (request.ambulanceId) {
        throw new Error("This request already has an ambulance assigned.");
      }

      const nextStore = {
        requests: store.requests.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status: "Ambulance assigned",
                ambulanceId,
                eta: "6 min",
              }
            : item,
        ),
        ambulances: store.ambulances.map((item) =>
          item.id === ambulanceId
            ? { ...item, status: "On call", eta: "6 min" }
            : item,
        ),
        drivers: store.drivers.map((item) =>
          item.id === driver.id
            ? { ...item, availability: "On call", status: "On call" }
            : item,
        ),
      };
      commitStore(nextStore);
    },
    [commitStore, store],
  );

  const createAmbulance = useCallback(
    (record) => {
      const id = record.registrationNumber.trim().toUpperCase();
      const assignedDriverId = record.assignedDriverId || "";
      const driver = store.drivers.find(
        (item) => item.id === assignedDriverId,
      );
      if (!id || !record.vehicleModel.trim() || !record.location.trim()) {
        throw new Error("Registration number, model, and location are required.");
      }
      if (
        store.ambulances.some(
          (ambulance) =>
            ambulance.id.toLowerCase() === id.toLowerCase(),
        )
      ) {
        throw new Error("An ambulance with that registration number already exists.");
      }
      if (!EDITABLE_AMBULANCE_STATUSES.includes(record.status)) {
        throw new Error("Choose Available or Maintenance for a new ambulance.");
      }
      if (
        assignedDriverId &&
        (!driver ||
          driver.assignedAmbulanceId ||
          driver.availability !== "Available")
      ) {
        throw new Error("Choose an unassigned driver who is available.");
      }

      const ambulance = {
        id,
        registrationNumber: id,
        vehicleModel: record.vehicleModel.trim(),
        area: record.location.trim(),
        location: record.location.trim(),
        status: record.status,
        eta: "—",
        assignedDriverId,
        driver: driver?.name || "Unassigned",
        driverContactNumber: driver?.contact || "",
      };
      const drivers = store.drivers.map((item) =>
        item.id === assignedDriverId
          ? {
              ...item,
              assignedAmbulanceId: id,
              ambulance: id,
            }
          : item,
      );

      commitStore({
        ...store,
        ambulances: [ambulance, ...store.ambulances],
        drivers,
      });
    },
    [commitStore, store],
  );

  const updateAmbulance = useCallback(
    (ambulanceId, record) => {
      const current = store.ambulances.find((item) => item.id === ambulanceId);
      if (!current) throw new Error("The ambulance could not be found.");

      const nextId = record.registrationNumber.trim().toUpperCase();
      const assignedDriverId = record.assignedDriverId || "";
      const activeRequest = hasActiveRequestForAmbulance(
        store.requests,
        ambulanceId,
      );
      const driver = store.drivers.find(
        (item) => item.id === assignedDriverId,
      );
      if (!nextId || !record.vehicleModel.trim() || !record.location.trim()) {
        throw new Error("Registration number, model, and location are required.");
      }
      if (
        store.ambulances.some(
          (ambulance) =>
            ambulance.id !== ambulanceId &&
            ambulance.id.toLowerCase() === nextId.toLowerCase(),
        )
      ) {
        throw new Error("An ambulance with that registration number already exists.");
      }
      if (
        activeRequest &&
        (nextId !== ambulanceId ||
          assignedDriverId !== current.assignedDriverId ||
          record.status !== current.status)
      ) {
        throw new Error(
          "An ambulance assigned to an active request cannot change registration, driver, or availability.",
        );
      }
      if (
        !activeRequest &&
        record.status !== current.status &&
        !EDITABLE_AMBULANCE_STATUSES.includes(record.status)
      ) {
        throw new Error("Choose Available or Maintenance for fleet availability.");
      }
      if (
        assignedDriverId &&
        (!driver ||
          (driver.assignedAmbulanceId &&
            driver.assignedAmbulanceId !== ambulanceId) ||
          (assignedDriverId !== current.assignedDriverId &&
            driver.availability !== "Available"))
      ) {
        throw new Error("Choose an unassigned driver who is available.");
      }

      const drivers = store.drivers.map((item) => {
        if (item.id === current.assignedDriverId && item.id !== assignedDriverId) {
          return { ...item, assignedAmbulanceId: "", ambulance: "" };
        }
        if (item.id === assignedDriverId) {
          return {
            ...item,
            assignedAmbulanceId: nextId,
            ambulance: nextId,
          };
        }
        return item;
      });
      const ambulances = store.ambulances
        .filter((item) => item.id !== ambulanceId)
        .map((item) =>
          item.assignedDriverId === assignedDriverId &&
          assignedDriverId !== current.assignedDriverId
            ? {
                ...item,
                assignedDriverId: "",
                driver: "Unassigned",
                driverContactNumber: "",
              }
            : item,
        );
      const updatedAmbulance = {
        ...current,
        id: nextId,
        registrationNumber: nextId,
        vehicleModel: record.vehicleModel.trim(),
        area: record.location.trim(),
        location: record.location.trim(),
        status: record.status,
        assignedDriverId,
      };
      const nextStore = {
        ...store,
        requests: store.requests.map((request) =>
          request.ambulanceId === ambulanceId
            ? { ...request, ambulanceId: nextId }
            : request,
        ),
        ambulances: [updatedAmbulance, ...ambulances],
        drivers,
      };

      commitStore(nextStore);
    },
    [commitStore, store],
  );

  const deleteAmbulance = useCallback(
    (ambulanceId) => {
      const ambulance = store.ambulances.find((item) => item.id === ambulanceId);
      if (!ambulance) throw new Error("The ambulance could not be found.");
      if (hasActiveRequestForAmbulance(store.requests, ambulanceId)) {
        throw new Error("An ambulance assigned to an active request cannot be deleted.");
      }

      commitStore({
        ...store,
        ambulances: store.ambulances.filter((item) => item.id !== ambulanceId),
        drivers: store.drivers.map((driver) =>
          driver.assignedAmbulanceId === ambulanceId
            ? { ...driver, assignedAmbulanceId: "", ambulance: "" }
            : driver,
        ),
      });
    },
    [commitStore, store],
  );

  const createDriver = useCallback(
    (record) => {
      const assignedAmbulanceId = record.assignedAmbulanceId || "";
      const target = store.ambulances.find(
        (item) => item.id === assignedAmbulanceId,
      );
      if (
        !record.name.trim() ||
        !record.contact.trim() ||
        !record.licenseNumber.trim()
      ) {
        throw new Error("Name, contact number, and licence number are required.");
      }
      if (!EDITABLE_DRIVER_AVAILABILITY.includes(record.availability)) {
        throw new Error("Choose Available or Unavailable for driver availability.");
      }
      if (
        store.drivers.some(
          (driver) =>
            driver.licenseNumber.toLowerCase() ===
            record.licenseNumber.trim().toLowerCase(),
        )
      ) {
        throw new Error("A driver with that licence number already exists.");
      }
      if (assignedAmbulanceId) {
        if (!target) throw new Error("Choose an ambulance that exists.");
        if (target.assignedDriverId) {
          throw new Error("That ambulance already has an assigned driver.");
        }
        if (
          BUSY_STATUSES.includes(target.status) ||
          hasActiveRequestForAmbulance(store.requests, target.id)
        ) {
          throw new Error("A busy ambulance cannot be assigned a different driver.");
        }
      }

      const nextSequence =
        store.drivers.reduce((highest, driver) => {
          const sequence = Number(driver.id.match(/\d+/)?.[0] || 0);
          return Math.max(highest, sequence);
        }, 0) + 1;
      const driver = {
        id: `DRV-${String(nextSequence).padStart(3, "0")}`,
        name: record.name.trim(),
        contact: record.contact.trim(),
        licenseNumber: record.licenseNumber.trim(),
        assignedAmbulanceId,
        ambulance: assignedAmbulanceId,
        availability: record.availability,
        status: record.availability,
        shift: "Unscheduled",
      };
      const ambulances = store.ambulances.map((item) =>
        item.id === assignedAmbulanceId
          ? {
              ...item,
              assignedDriverId: driver.id,
              driver: driver.name,
              driverContactNumber: driver.contact,
            }
          : item,
      );

      commitStore({
        ...store,
        drivers: [driver, ...store.drivers],
        ambulances,
      });
    },
    [commitStore, store],
  );

  const updateDriver = useCallback(
    (driverId, record) => {
      const current = store.drivers.find((item) => item.id === driverId);
      if (!current) throw new Error("The driver could not be found.");

      const assignedAmbulanceId = record.assignedAmbulanceId || "";
      const currentAmbulance = store.ambulances.find(
        (item) => item.id === current.assignedAmbulanceId,
      );
      const target = store.ambulances.find(
        (item) => item.id === assignedAmbulanceId,
      );
      const activeRequest = currentAmbulance
        ? hasActiveRequestForAmbulance(
            store.requests,
            currentAmbulance.id,
          )
        : false;
      if (
        !record.name.trim() ||
        !record.contact.trim() ||
        !record.licenseNumber.trim()
      ) {
        throw new Error("Name, contact number, and licence number are required.");
      }
      if (
        !EDITABLE_DRIVER_AVAILABILITY.includes(record.availability) &&
        record.availability !== current.availability
      ) {
        throw new Error("Choose Available or Unavailable for driver availability.");
      }
      if (
        store.drivers.some(
          (driver) =>
            driver.id !== driverId &&
            driver.licenseNumber.toLowerCase() ===
              record.licenseNumber.trim().toLowerCase(),
        )
      ) {
        throw new Error("A driver with that licence number already exists.");
      }
      if (
        activeRequest &&
        (assignedAmbulanceId !== current.assignedAmbulanceId ||
          record.availability !== current.availability)
      ) {
        throw new Error(
          "A driver assigned to an active request cannot change assignment or availability.",
        );
      }
      if (assignedAmbulanceId) {
        if (!target) throw new Error("Choose an ambulance that exists.");
        if (
          target.assignedDriverId &&
          target.assignedDriverId !== driverId
        ) {
          throw new Error("That ambulance already has an assigned driver.");
        }
        if (
          BUSY_STATUSES.includes(target.status) &&
          target.id !== current.assignedAmbulanceId
        ) {
          throw new Error("A busy ambulance cannot be assigned a different driver.");
        }
        if (
          target.id !== current.assignedAmbulanceId &&
          hasActiveRequestForAmbulance(store.requests, target.id)
        ) {
          throw new Error("An ambulance assigned to an active request is locked.");
        }
      }

      const updatedDriver = {
        ...current,
        name: record.name.trim(),
        contact: record.contact.trim(),
        licenseNumber: record.licenseNumber.trim(),
        assignedAmbulanceId,
        ambulance: assignedAmbulanceId,
        availability: record.availability,
        status: record.availability,
      };
      const drivers = store.drivers.map((driver) =>
        driver.id === driverId ? updatedDriver : driver,
      );
      const ambulances = store.ambulances.map((ambulance) => {
        if (ambulance.id === current.assignedAmbulanceId) {
          return {
            ...ambulance,
            assignedDriverId:
              ambulance.id === assignedAmbulanceId ? driverId : "",
            driver:
              ambulance.id === assignedAmbulanceId
                ? updatedDriver.name
                : "Unassigned",
            driverContactNumber:
              ambulance.id === assignedAmbulanceId
                ? updatedDriver.contact
                : "",
          };
        }
        if (ambulance.id === assignedAmbulanceId) {
          return {
            ...ambulance,
            assignedDriverId: driverId,
            driver: updatedDriver.name,
            driverContactNumber: updatedDriver.contact,
          };
        }
        return ambulance;
      });

      commitStore({ ...store, drivers, ambulances });
    },
    [commitStore, store],
  );

  const deleteDriver = useCallback(
    (driverId) => {
      const driver = store.drivers.find((item) => item.id === driverId);
      if (!driver) throw new Error("The driver could not be found.");
      if (
        driver.assignedAmbulanceId &&
        hasActiveRequestForAmbulance(
          store.requests,
          driver.assignedAmbulanceId,
        )
      ) {
        throw new Error("A driver assigned to an active request cannot be deleted.");
      }

      commitStore({
        ...store,
        drivers: store.drivers.filter((item) => item.id !== driverId),
        ambulances: store.ambulances.map((ambulance) =>
          ambulance.assignedDriverId === driverId
            ? {
                ...ambulance,
                assignedDriverId: "",
                driver: "Unassigned",
                driverContactNumber: "",
              }
            : ambulance,
        ),
      });
    },
    [commitStore, store],
  );

  const studentRequests = useMemo(
    () =>
      user?.role === "admin"
        ? store.requests
        : store.requests.filter(
            (request) => request.username === (user?.username || "student"),
          ),
    [store.requests, user?.role, user?.username],
  );

  const value = useMemo(
    () => ({
      requests: studentRequests,
      allRequests: store.requests,
      ambulances: store.ambulances,
      drivers: store.drivers,
      allStudents: store.students,
      addRequest,
      assignAmbulance,
      updateRequestStatus,
      createAmbulance,
      updateAmbulance,
      deleteAmbulance,
      createDriver,
      updateDriver,
      deleteDriver,
      storageError,
    }),
    [
      addRequest,
      assignAmbulance,
      createAmbulance,
      createDriver,
      deleteAmbulance,
      deleteDriver,
      storageError,
      store.ambulances,
      store.drivers,
      store.requests,
      store.students,
      studentRequests,
      updateAmbulance,
      updateDriver,
      updateRequestStatus,
    ],
  );

  return (
    <EmergencyRequestContext.Provider value={value}>
      {children}
    </EmergencyRequestContext.Provider>
  );
}

export function useEmergencyRequests() {
  const context = useContext(EmergencyRequestContext);
  if (!context) {
    throw new Error(
      "useEmergencyRequests must be used within an EmergencyRequestProvider.",
    );
  }
  return context;
}

export function useStudentRequests() {
  return useEmergencyRequests();
}
