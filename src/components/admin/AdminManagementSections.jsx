import {
  Edit3,
  Eye,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PriorityBadge, StatusBadge } from "./AdminDataTable.jsx";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Modal from "../ui/Modal.jsx";
import { useEmergencyRequests } from "../../context/EmergencyRequestContext.jsx";
import { formatRequestDate } from "../../utils/studentRequests.js";
import { getAdminRequestStatusLabel } from "../../utils/adminRequests.js";
import { hasActiveRequestForAmbulance } from "../../utils/fleet.js";

const tableHeaderClass =
  "border-y border-slate-100 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400";
const fieldClass =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-ink focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100";

const ambulanceInitialForm = {
  registrationNumber: "",
  vehicleModel: "",
  location: "",
  status: "Available",
  assignedDriverId: "",
};

const driverInitialForm = {
  name: "",
  contact: "",
  licenseNumber: "",
  assignedAmbulanceId: "",
  availability: "Available",
};

export function AmbulanceManagementSection() {
  const {
    ambulances,
    drivers,
    allRequests,
    createAmbulance,
    updateAmbulance,
    deleteAmbulance,
  } = useEmergencyRequests();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [form, setForm] = useState(ambulanceInitialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [deletingAmbulance, setDeletingAmbulance] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const filteredAmbulances = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ambulances.filter((ambulance) => {
      const matchesStatus =
        statusFilter === "All" || ambulance.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          ambulance.registrationNumber,
          ambulance.vehicleModel,
          ambulance.area,
          ambulance.driver,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [ambulances, query, statusFilter]);

  function openCreateForm() {
    setEditingAmbulance(null);
    setForm({ ...ambulanceInitialForm });
    setErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(ambulance) {
    setEditingAmbulance(ambulance);
    setForm({
      registrationNumber: ambulance.registrationNumber || ambulance.id,
      vehicleModel: ambulance.vehicleModel || "",
      location: ambulance.area || ambulance.location || "",
      status: ambulance.status,
      assignedDriverId: ambulance.assignedDriverId || "",
    });
    setErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  }

  function submitForm(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.registrationNumber.trim().length < 3) {
      nextErrors.registrationNumber = "Enter a registration number.";
    }
    if (form.vehicleModel.trim().length < 2) {
      nextErrors.vehicleModel = "Enter the vehicle model.";
    }
    if (form.location.trim().length < 2) {
      nextErrors.location = "Enter the ambulance's current location.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setFormError("");
    try {
      if (editingAmbulance) {
        updateAmbulance(editingAmbulance.id, form);
      } else {
        createAmbulance(form);
      }
      setFormOpen(false);
    } catch (error) {
      setFormError(error.message || "The ambulance could not be saved.");
    }
  }

  function confirmDelete() {
    setDeleteError("");
    try {
      deleteAmbulance(deletingAmbulance.id);
      setDeletingAmbulance(null);
    } catch (error) {
      setDeleteError(error.message || "The ambulance could not be deleted.");
    }
  }

  const activeRequest = editingAmbulance
    ? hasActiveRequestForAmbulance(allRequests, editingAmbulance.id)
    : false;
  const eligibleDrivers = drivers.filter(
    (driver) =>
      (driver.availability === "Available" ||
        driver.id === editingAmbulance?.assignedDriverId) &&
      (!driver.assignedAmbulanceId ||
        driver.id === editingAmbulance?.assignedDriverId),
  );
  const currentStatusIsBusy =
    editingAmbulance &&
    !["Available", "Maintenance"].includes(editingAmbulance.status);

  return (
    <>
      <Card
        action={
          <Button onClick={openCreateForm} size="sm">
            <Plus size={15} /> Add ambulance
          </Button>
        }
        description="Manage fleet details and keep driver links in sync with dispatch."
        title="Ambulance fleet"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            label="Search ambulances"
            onChange={setQuery}
            placeholder="Registration, model, location, driver..."
            value={query}
          />
          <FilterSelect
            label="Availability"
            onChange={setStatusFilter}
            options={[
              "All",
              "Available",
              "On call",
              "En route",
              "On scene",
              "Maintenance",
            ]}
            value={statusFilter}
          />
        </div>
        <ManagementTable
          columns={[
            "Registration",
            "Vehicle model",
            "Current location",
            "Assigned driver",
            "Availability",
            "Actions",
          ]}
          emptyMessage="No ambulances match your search."
          minWidth="900px"
          rowCount={filteredAmbulances.length}
        >
          {filteredAmbulances.map((ambulance) => {
            const busy = hasActiveRequestForAmbulance(
              allRequests,
              ambulance.id,
            );
            const assignedDriver = drivers.find(
              (driver) => driver.id === ambulance.assignedDriverId,
            );
            return (
              <tr className="text-xs text-slate-600" key={ambulance.id}>
                <td className="py-4 pr-4 font-extrabold text-ink">
                  {ambulance.registrationNumber || ambulance.id}
                </td>
                <td className="py-4 pr-4">{ambulance.vehicleModel}</td>
                <td className="py-4 pr-4">{ambulance.area}</td>
                <td className="py-4 pr-4">
                  <span className="font-semibold text-ink">{ambulance.driver}</span>
                  {!ambulance.assignedDriverId && (
                    <span className="mt-1 block text-[10px] font-semibold text-amber-700">
                      Not dispatchable until staffed
                    </span>
                  )}
                  {assignedDriver?.availability === "Unavailable" && (
                    <span className="mt-1 block text-[10px] font-semibold text-amber-700">
                      Assigned driver is unavailable
                    </span>
                  )}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={ambulance.status} />
                </td>
                <td className="py-4">
                  <ActionButtons
                    onDelete={() => {
                      setDeleteError("");
                      setDeletingAmbulance(ambulance);
                    }}
                    onEdit={() => openEditForm(ambulance)}
                    deleteDisabled={busy}
                    deleteLabel={`Delete ambulance ${ambulance.id}`}
                    editLabel={`Edit ambulance ${ambulance.id}`}
                  />
                </td>
              </tr>
            );
          })}
        </ManagementTable>
      </Card>

      <ResourceFormModal
        description={
          editingAmbulance
            ? "Update the demo vehicle record and its assigned driver."
            : "Create a demo fleet record. An available driver is required for dispatch."
        }
        error={formError}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
        open={formOpen}
        submitLabel={editingAmbulance ? "Save changes" : "Add ambulance"}
        title={editingAmbulance ? "Edit ambulance" : "Add ambulance"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            disabled={activeRequest}
            error={errors.registrationNumber}
            label="Registration number"
            name="registrationNumber"
            onChange={updateForm}
            required
            value={form.registrationNumber}
          />
          <Input
            error={errors.vehicleModel}
            label="Vehicle model"
            name="vehicleModel"
            onChange={updateForm}
            required
            value={form.vehicleModel}
          />
          <Input
            className="sm:col-span-2"
            error={errors.location}
            label="Current location"
            name="location"
            onChange={updateForm}
            required
            value={form.location}
          />
          <FormSelect
            disabled={activeRequest}
            label="Availability status"
            name="status"
            onChange={updateForm}
            options={[
              { label: "Available", value: "Available" },
              { label: "Maintenance", value: "Maintenance" },
              ...(currentStatusIsBusy
                ? [{ label: form.status, value: form.status }]
                : []),
            ]}
            value={form.status}
          />
          <FormSelect
            disabled={activeRequest}
            label="Assigned driver"
            name="assignedDriverId"
            onChange={updateForm}
            options={[
              { label: "Unassigned", value: "" },
              ...eligibleDrivers.map((driver) => ({
                label: `${driver.name} · ${driver.availability}`,
                value: driver.id,
              })),
            ]}
            value={form.assignedDriverId}
          />
        </div>
        {activeRequest && (
          <p className="mt-3 text-xs leading-5 text-amber-800">
            This ambulance has an active request. Registration, driver, and availability are locked until it is completed.
          </p>
        )}
      </ResourceFormModal>

      <ConfirmationModal
        description={`Delete ${deletingAmbulance?.registrationNumber || deletingAmbulance?.id}? Its driver will be unassigned. This cannot be undone.`}
        error={deleteError}
        onCancel={() => setDeletingAmbulance(null)}
        onConfirm={confirmDelete}
        open={Boolean(deletingAmbulance)}
        title="Delete ambulance?"
        confirmLabel="Delete ambulance"
      />
    </>
  );
}

export function DriverManagementSection() {
  const {
    drivers,
    ambulances,
    allRequests,
    createDriver,
    updateDriver,
    deleteDriver,
  } = useEmergencyRequests();
  const [query, setQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [form, setForm] = useState(driverInitialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [deletingDriver, setDeletingDriver] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const filteredDrivers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return drivers.filter((driver) => {
      const matchesAvailability =
        availabilityFilter === "All" ||
        driver.availability === availabilityFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          driver.name,
          driver.contact,
          driver.licenseNumber,
          driver.assignedAmbulanceId,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesAvailability && matchesQuery;
    });
  }, [availabilityFilter, drivers, query]);

  function openCreateForm() {
    setEditingDriver(null);
    setForm({ ...driverInitialForm });
    setErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(driver) {
    setEditingDriver(driver);
    setForm({
      name: driver.name,
      contact: driver.contact,
      licenseNumber: driver.licenseNumber,
      assignedAmbulanceId: driver.assignedAmbulanceId || "",
      availability: driver.availability,
    });
    setErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  }

  function submitForm(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter the driver's name.";
    }
    if (!/^\+?[\d\s().-]{7,20}$/.test(form.contact.trim())) {
      nextErrors.contact = "Enter a valid contact number.";
    }
    if (form.licenseNumber.trim().length < 4) {
      nextErrors.licenseNumber = "Enter a demo licence number.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setFormError("");
    try {
      if (editingDriver) {
        updateDriver(editingDriver.id, form);
      } else {
        createDriver(form);
      }
      setFormOpen(false);
    } catch (error) {
      setFormError(error.message || "The driver could not be saved.");
    }
  }

  function confirmDelete() {
    setDeleteError("");
    try {
      deleteDriver(deletingDriver.id);
      setDeletingDriver(null);
    } catch (error) {
      setDeleteError(error.message || "The driver could not be deleted.");
    }
  }

  const activeRequest = editingDriver?.assignedAmbulanceId
    ? hasActiveRequestForAmbulance(
        allRequests,
        editingDriver.assignedAmbulanceId,
      )
    : false;
  const assignedAmbulance = editingDriver?.assignedAmbulanceId
    ? ambulances.find(
        (ambulance) =>
          ambulance.id === editingDriver.assignedAmbulanceId,
      )
    : null;
  const eligibleAmbulances = ambulances.filter(
    (ambulance) =>
      (!ambulance.assignedDriverId ||
        ambulance.assignedDriverId === editingDriver?.id) &&
      (!["On call", "En route", "On scene"].includes(ambulance.status) ||
        ambulance.id === editingDriver?.assignedAmbulanceId),
  );
  const currentAvailabilityIsBusy =
    editingDriver &&
    !["Available", "Unavailable"].includes(editingDriver.availability);

  return (
    <>
      <Card
        action={
          <Button onClick={openCreateForm} size="sm">
            <Plus size={15} /> Add driver
          </Button>
        }
        description="Manage contacts and licence numbers (fictional demo data), and keep vehicle assignments one-to-one."
        title="Driver roster"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            label="Search drivers"
            onChange={setQuery}
            placeholder="Name, contact, licence, ambulance..."
            value={query}
          />
          <FilterSelect
            label="Availability"
            onChange={setAvailabilityFilter}
            options={[
              "All",
              "Available",
              "Unavailable",
              "On call",
              "En route",
              "On scene",
            ]}
            value={availabilityFilter}
          />
        </div>
        <ManagementTable
          columns={[
            "Driver",
            "Contact number",
            "Licence number",
            "Assigned ambulance",
            "Availability",
            "Actions",
          ]}
          emptyMessage="No drivers match your search."
          minWidth="900px"
          rowCount={filteredDrivers.length}
        >
          {filteredDrivers.map((driver) => {
            const busy = driver.assignedAmbulanceId
              ? hasActiveRequestForAmbulance(
                  allRequests,
                  driver.assignedAmbulanceId,
                )
              : false;
            return (
              <tr className="text-xs text-slate-600" key={driver.id}>
                <td className="py-4 pr-4">
                  <span className="block font-extrabold text-ink">
                    {driver.name}
                  </span>
                  <span className="mt-1 block text-[10px] text-muted">
                    {driver.id}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <a
                    className="font-semibold text-brand-700 hover:text-brand-800"
                    href={`tel:${driver.contact.replace(/[^\d+]/g, "")}`}
                  >
                    {driver.contact}
                  </a>
                </td>
                <td className="py-4 pr-4">{driver.licenseNumber}</td>
                <td className="py-4 pr-4">
                  {driver.assignedAmbulanceId || "Unassigned"}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={driver.availability} />
                </td>
                <td className="py-4">
                  <ActionButtons
                    deleteDisabled={busy}
                    deleteLabel={`Delete driver ${driver.name}`}
                    editLabel={`Edit driver ${driver.name}`}
                    onDelete={() => {
                      setDeleteError("");
                      setDeletingDriver(driver);
                    }}
                    onEdit={() => openEditForm(driver)}
                  />
                </td>
              </tr>
            );
          })}
        </ManagementTable>
      </Card>

      <ResourceFormModal
        description="Driver contact and licence values are fictional demo information."
        error={formError}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
        open={formOpen}
        submitLabel={editingDriver ? "Save changes" : "Add driver"}
        title={editingDriver ? "Edit driver" : "Add driver"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.name}
            label="Driver name"
            name="name"
            onChange={updateForm}
            required
            value={form.name}
          />
          <Input
            autoComplete="tel"
            error={errors.contact}
            label="Contact number"
            name="contact"
            onChange={updateForm}
            required
            type="tel"
            value={form.contact}
          />
          <Input
            error={errors.licenseNumber}
            hint="Demo data only; do not enter a real licence number."
            label="Driving licence number"
            name="licenseNumber"
            onChange={updateForm}
            required
            value={form.licenseNumber}
          />
          <FormSelect
            disabled={activeRequest}
            label="Driver availability"
            name="availability"
            onChange={updateForm}
            options={[
              { label: "Available", value: "Available" },
              { label: "Unavailable", value: "Unavailable" },
              ...(currentAvailabilityIsBusy
                ? [{ label: form.availability, value: form.availability }]
                : []),
            ]}
            value={form.availability}
          />
          <FormSelect
            className="sm:col-span-2"
            disabled={activeRequest}
            label="Assigned ambulance"
            name="assignedAmbulanceId"
            onChange={updateForm}
            options={[
              { label: "Unassigned", value: "" },
              ...eligibleAmbulances.map((ambulance) => ({
                label: `${ambulance.registrationNumber || ambulance.id} · ${ambulance.vehicleModel}`,
                value: ambulance.id,
              })),
            ]}
            value={form.assignedAmbulanceId}
          />
        </div>
        {activeRequest && (
          <p className="mt-3 text-xs leading-5 text-amber-800">
            This driver is assigned to an active request. Availability and vehicle assignment are locked until it is completed.
          </p>
        )}
        {assignedAmbulance?.status === "Maintenance" && (
          <p className="mt-3 text-xs leading-5 text-amber-800">
            The assigned ambulance is in maintenance and cannot be dispatched.
          </p>
        )}
      </ResourceFormModal>

      <ConfirmationModal
        description={`Delete ${deletingDriver?.name}? Their ambulance will remain in the fleet but become unassigned. This cannot be undone.`}
        error={deleteError}
        onCancel={() => setDeletingDriver(null)}
        onConfirm={confirmDelete}
        open={Boolean(deletingDriver)}
        title="Delete driver?"
        confirmLabel="Delete driver"
      />
    </>
  );
}

export function StudentDirectorySection() {
  const { allStudents, allRequests } = useEmergencyRequests();
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const normalizedQuery = query.trim().toLowerCase();

  const students = useMemo(
    () =>
      allStudents
        .map((student) => {
          const requests = allRequests
            .filter(
              (request) =>
                request.studentId === student.id ||
                (student.username &&
                  request.username === student.username),
            )
            .sort(
              (left, right) =>
                new Date(right.createdAt) - new Date(left.createdAt),
            );
          return { ...student, requestHistory: requests };
        })
        .filter((student) =>
          [student.name, student.id]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        ),
    [allRequests, allStudents, normalizedQuery],
  );

  return (
    <>
      <Card
        action={
          <span className="text-xs font-semibold text-muted">
            {students.length} students
          </span>
        }
        description="View registered student contact details and their emergency request history."
        title="Student directory"
      >
        <div className="mb-4">
          <SearchInput
            label="Search students by name or roll number"
            onChange={setQuery}
            placeholder="Student name or roll number..."
            value={query}
          />
        </div>
        <ManagementTable
          columns={[
            "Student",
            "Roll number / student ID",
            "Campus",
            "Contact",
            "Requests",
            "Profile",
          ]}
          emptyMessage="No registered students match your search."
          minWidth="850px"
          rowCount={students.length}
        >
          {students.map((student) => (
            <tr className="text-xs text-slate-600" key={student.id}>
              <td className="py-4 pr-4 font-extrabold text-ink">
                {student.name}
              </td>
              <td className="py-4 pr-4">{student.id}</td>
              <td className="py-4 pr-4">{student.campus || "—"}</td>
              <td className="py-4 pr-4">
                {student.contactNumber ? (
                  <a
                    className="font-semibold text-brand-700 hover:text-brand-800"
                    href={`tel:${student.contactNumber.replace(/[^\d+]/g, "")}`}
                  >
                    {student.contactNumber}
                  </a>
                ) : (
                  "Not provided"
                )}
              </td>
              <td className="py-4 pr-4 font-bold text-ink">
                {student.requestHistory.length}
              </td>
              <td className="py-4">
                <Button
                  aria-label={`View profile for ${student.name}`}
                  onClick={() => setSelectedStudent(student)}
                  size="sm"
                  variant="secondary"
                >
                  <Eye size={14} /> View profile
                </Button>
              </td>
            </tr>
          ))}
        </ManagementTable>
      </Card>

      <StudentProfileModal
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
      />
    </>
  );
}

function StudentProfileModal({ onClose, student }) {
  const requests = student?.requestHistory || [];

  return (
    <Modal
      className="max-w-3xl"
      description="Registered student contact information and emergency history."
      onClose={onClose}
      open={Boolean(student)}
      title="Student profile"
    >
      {student && (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700">
              <UserRound size={19} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-extrabold text-ink">
                {student.name}
              </h3>
              <p className="mt-1 text-xs text-muted">
                Roll number / Student ID · {student.id}
              </p>
              <p className="mt-1 text-xs text-muted">
                Campus · {student.campus || "Not provided"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileDetail label="Contact number">
              {student.contactNumber ? (
                <a
                  className="text-brand-700 hover:underline"
                  href={`tel:${student.contactNumber.replace(/[^\d+]/g, "")}`}
                >
                  {student.contactNumber}
                </a>
              ) : (
                "Not provided"
              )}
            </ProfileDetail>
            <ProfileDetail label="Email">
              {student.email || "Not provided"}
            </ProfileDetail>
            <ProfileDetail label="Total emergency requests">
              {requests.length}
            </ProfileDetail>
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-ink">Request history</h3>
              <span className="text-xs text-muted">{requests.length} records</span>
            </div>
            <ManagementTable
              columns={[
                "Request",
                "Emergency / pickup",
                "Priority",
                "Submitted",
                "Status",
              ]}
              emptyMessage="This student has no emergency request history."
              minWidth="720px"
              rowCount={requests.length}
            >
              {requests.map((request) => (
                <tr className="text-xs text-slate-600" key={request.id}>
                  <td className="py-3 pr-4 font-bold text-ink">{request.id}</td>
                  <td className="py-3 pr-4">
                    <span className="block font-semibold text-ink">
                      {request.emergencyType}
                    </span>
                    <span className="mt-1 block max-w-[190px] truncate text-[10px] text-muted">
                      {request.location}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <PriorityBadge priority={request.priority} />
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4">
                    {formatRequestDate(request.createdAt)}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge
                      status={getAdminRequestStatusLabel(request.status)}
                    />
                  </td>
                </tr>
              ))}
            </ManagementTable>
          </section>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function ResourceFormModal({
  children,
  description,
  error,
  onClose,
  onSubmit,
  open,
  submitLabel,
  title,
}) {
  return (
    <Modal
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
      description={description}
      onClose={onClose}
      open={open}
      title={title}
    >
      <form className="space-y-5" noValidate onSubmit={onSubmit}>
        {error && (
          <p
            className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        {children}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Modal>
  );
}

function ConfirmationModal({
  confirmLabel,
  description,
  error,
  onCancel,
  onConfirm,
  open,
  title,
}) {
  return (
    <Modal
      description={description}
      onClose={onCancel}
      open={open}
      title={title}
    >
      {error && (
        <p
          className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="danger">
          <Trash2 size={15} /> {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

function ManagementTable({
  children,
  columns,
  emptyMessage,
  minWidth = "700px",
  rowCount,
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className={tableHeaderClass}>
            {columns.map((column) => (
              <th className="whitespace-nowrap py-3 pr-4" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rowCount ? (
            children
          ) : (
            <tr>
              <td
                className="py-10 text-center text-xs text-muted"
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActionButtons({
  deleteDisabled = false,
  deleteLabel,
  editLabel,
  onDelete,
  onEdit,
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        aria-label={editLabel}
        onClick={onEdit}
        size="sm"
        variant="ghost"
      >
        <Edit3 size={14} /> Edit
      </Button>
      <Button
        aria-label={deleteLabel}
        disabled={deleteDisabled}
        onClick={onDelete}
        size="sm"
        variant="ghost"
      >
        <Trash2 className="text-red-600" size={14} /> Delete
      </Button>
    </div>
  );
}

function SearchInput({ label, onChange, placeholder, value }) {
  return (
    <Input
      aria-label={label}
      className="min-h-10 sm:max-w-sm"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
}

function FilterSelect({ label, onChange, options, value }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
      {label}
      <select
        className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormSelect({
  className = "",
  disabled = false,
  label,
  name,
  onChange,
  options,
  value,
}) {
  return (
    <div className={className}>
      <label
        className="mb-2 block text-sm font-semibold text-slate-700"
        htmlFor={name}
      >
        {label}
      </label>
      <select
        className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500`}
        disabled={disabled}
        id={name}
        name={name}
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProfileDetail({ children, label }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{children}</p>
    </div>
  );
}
