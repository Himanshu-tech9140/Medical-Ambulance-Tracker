import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";
import StudentPageHeading from "../../components/student/StudentPageHeading.jsx";
import { STUDENT_PROFILE, EMERGENCY_TYPES, PRIORITY_LEVELS } from "../../data/studentDemoData.js";
import { useStudentRequests } from "../../context/EmergencyRequestContext.jsx";
import { createDemoRequestId } from "../../utils/studentRequests.js";

const initialForm = (priorityFromUrl) => ({
  studentName: STUDENT_PROFILE.name,
  studentId: STUDENT_PROFILE.studentId,
  contactNumber: STUDENT_PROFILE.phone,
  emergencyType: "",
  description: "",
  location: STUDENT_PROFILE.defaultLocation,
  priority: PRIORITY_LEVELS.includes(priorityFromUrl)
    ? priorityFromUrl
    : "Medium",
});

const inputClass =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-ink focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100";

export default function StudentRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addRequest } = useStudentRequests();
  const [form, setForm] = useState(() =>
    initialForm(searchParams.get("priority")),
  );
  const [errors, setErrors] = useState({});
  const [storageError, setStorageError] = useState("");
  const [submittedRequest, setSubmittedRequest] = useState(null);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStorageError("");
  }

  function validateForm() {
    const nextErrors = {};
    if (form.studentName.trim().length < 2) {
      nextErrors.studentName = "Enter the student’s full name.";
    }
    if (!form.studentId.trim()) {
      nextErrors.studentId = "Enter your student ID.";
    }
    if (!/^\+?[\d\s().-]{7,20}$/.test(form.contactNumber.trim())) {
      nextErrors.contactNumber = "Enter a valid contact number.";
    }
    if (!EMERGENCY_TYPES.includes(form.emergencyType)) {
      nextErrors.emergencyType = "Choose an emergency type.";
    }
    if (form.description.trim().length < 10) {
      nextErrors.description = "Add at least 10 characters of helpful detail.";
    }
    if (!form.location.trim()) {
      nextErrors.location = "Enter your current location.";
    }
    if (!PRIORITY_LEVELS.includes(form.priority)) {
      nextErrors.priority = "Choose a priority level.";
    }
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    setStorageError("");
    if (Object.keys(nextErrors).length > 0) return;

    const request = {
      id: createDemoRequestId(),
      ...form,
      studentName: form.studentName.trim(),
      studentId: form.studentId.trim(),
      contactNumber: form.contactNumber.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      status: "Request received",
      ambulanceId: "",
      eta: "",
      createdAt: new Date().toISOString(),
    };

    try {
      addRequest(request);
      setSubmittedRequest(request);
    } catch {
      setStorageError(
        "Your request could not be saved in this browser. Check local storage settings and try again.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-[1080px]">
      <StudentPageHeading
        description="Share a few details so the response team can understand how to help."
        eyebrow="Student workspace / Request ambulance"
        title="Request emergency assistance"
        action={
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand-700"
            to="/student/dashboard"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="p-5 sm:p-7">
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600">
              <ClipboardCheck size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Request details</p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Fields marked with an asterisk are required. Submitting creates a demo request only.
              </p>
            </div>
          </div>

          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                autoComplete="name"
                error={errors.studentName}
                label="Student name *"
                name="studentName"
                onChange={updateField}
                placeholder="Your full name"
                value={form.studentName}
              />
              <Input
                error={errors.studentId}
                label="Roll number / Student ID *"
                name="studentId"
                onChange={updateField}
                placeholder="e.g. STU-2024-0186"
                value={form.studentId}
              />
              <Input
                autoComplete="tel"
                error={errors.contactNumber}
                label="Contact number *"
                name="contactNumber"
                onChange={updateField}
                placeholder="+1 (555) 010-1234"
                type="tel"
                value={form.contactNumber}
              />
              <SelectField
                error={errors.emergencyType}
                label="Emergency type *"
                name="emergencyType"
                onChange={updateField}
                options={EMERGENCY_TYPES}
                placeholder="Select an emergency type"
                value={form.emergencyType}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="description"
              >
                Emergency description *
              </label>
              <textarea
                aria-describedby={errors.description ? "description-error" : undefined}
                aria-invalid={Boolean(errors.description)}
                className={`min-h-28 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 ${
                  errors.description ? "border-red-300" : "border-slate-200"
                }`}
                id="description"
                maxLength={500}
                name="description"
                onChange={updateField}
                placeholder="Describe what happened and any immediate concerns..."
                value={form.description}
              />
              <FieldError id="description-error" error={errors.description} />
              <p className="mt-1 text-right text-[11px] text-slate-400">
                {form.description.length}/500
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                error={errors.location}
                label="Current location *"
                leadingIcon={MapPin}
                name="location"
                onChange={updateField}
                placeholder="Building, floor, or nearby landmark"
                value={form.location}
              />
              <SelectField
                error={errors.priority}
                label="Priority level *"
                name="priority"
                onChange={updateField}
                options={PRIORITY_LEVELS}
                value={form.priority}
              />
            </div>

            {storageError && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                {storageError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                onClick={() => navigate("/student/dashboard")}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button className="min-h-12" type="submit" variant={form.priority === "Critical" ? "danger" : "primary"}>
                <ShieldAlert size={17} /> Submit emergency request
              </Button>
            </div>
          </form>
        </Card>

        <Card className="border-amber-100 bg-amber-50/70 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600">
            <ShieldAlert size={20} />
          </span>
          <h2 className="font-display mt-4 text-base font-extrabold text-ink">
            Immediate danger?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Contact your local emergency services directly. This demo form does not dispatch an ambulance.
          </p>
          <div className="mt-5 space-y-3 border-t border-amber-200/70 pt-4 text-xs leading-5 text-amber-950/80">
            <p>Stay in a safe, accessible place if possible.</p>
            <p>Keep your phone nearby for follow-up questions.</p>
            <p>Share nearby landmarks in your location details.</p>
          </div>
        </Card>
      </div>

      <Modal
        description="Your demo request was saved to this browser."
        onClose={() => {
          setSubmittedRequest(null);
          navigate("/student/dashboard");
        }}
        open={Boolean(submittedRequest)}
        title="Request submitted"
      >
        {submittedRequest && (
          <div>
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
              <div>
                <p className="text-sm font-bold text-emerald-900">
                  Your request is in the demo queue.
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  Reference ID: <span className="font-bold">{submittedRequest.id}</span>
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                onClick={() => {
                  setSubmittedRequest(null);
                  navigate("/student/dashboard");
                }}
                variant="secondary"
              >
                Dashboard
              </Button>
              <Button
                as={Link}
                onClick={() => setSubmittedRequest(null)}
                to="/student/requests"
              >
                View my requests
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SelectField({
  error,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-semibold text-slate-700"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <select
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={Boolean(error)}
          className={`${inputClass} appearance-none pr-10 ${
            error ? "border-red-300" : ""
          }`}
          id={name}
          name={name}
          onChange={onChange}
          value={value}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
      </div>
      <FieldError error={error} id={`${name}-error`} />
    </div>
  );
}

function FieldError({ error, id }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-red-600" id={id}>
      {error}
    </p>
  );
}
