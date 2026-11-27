import {
  BadgeCheck,
  Building2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import StudentPageHeading from "../../components/student/StudentPageHeading.jsx";
import { STUDENT_PROFILE } from "../../data/studentDemoData.js";

export default function StudentProfilePage() {
  const profileDetails = [
    { label: "Full name", value: STUDENT_PROFILE.name, icon: UserRound },
    { label: "Student ID", value: STUDENT_PROFILE.studentId, icon: BadgeCheck },
    { label: "Contact number", value: STUDENT_PROFILE.phone, icon: Phone },
    { label: "Email address", value: STUDENT_PROFILE.email, icon: Mail },
    { label: "Campus", value: STUDENT_PROFILE.campus, icon: Building2 },
    {
      label: "Default location",
      value: STUDENT_PROFILE.defaultLocation,
      icon: MapPin,
    },
  ];

  return (
    <div className="mx-auto max-w-[1000px]">
      <StudentPageHeading
        description="Your profile details are used to prefill the demo emergency request form."
        eyebrow="Student workspace / My profile"
        title="My profile"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card className="h-fit text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 font-display text-2xl font-extrabold text-brand-700">
            AM
          </span>
          <h2 className="font-display mt-4 text-lg font-extrabold text-ink">
            {STUDENT_PROFILE.name}
          </h2>
          <p className="mt-1 text-sm text-muted">Student · {STUDENT_PROFILE.campus}</p>
          <span className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
            <BadgeCheck size={14} /> Demo profile
          </span>
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-muted">
            This sample profile is for the frontend demo. Profile changes are not connected to a backend.
          </p>
        </Card>

        <Card
          description="Review the student information associated with this demo account."
          title="Student information"
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            {profileDetails.map(({ label, value, icon: Icon }) => (
              <div className="rounded-xl border border-slate-100 p-4" key={label}>
                <dt className="flex items-center gap-2 text-xs font-medium text-muted">
                  <Icon className="text-brand-600" size={15} />
                  {label}
                </dt>
                <dd className="mt-2 break-words text-sm font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
