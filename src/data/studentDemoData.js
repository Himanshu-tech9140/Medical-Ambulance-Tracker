export const STUDENT_PROFILE = {
  name: "Ava Morgan",
  studentId: "STU-2024-0186",
  phone: "+1 (202) 555-0148",
  email: "student@jeevansetu.demo",
  campus: "North Campus",
  defaultLocation: "North Campus, Main Library",
};

const minutesAgo = (minutes) =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();
const daysAgo = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_STUDENT_REQUESTS = [
  {
    id: "MT-2026-1048",
    studentName: STUDENT_PROFILE.name,
    studentId: STUDENT_PROFILE.studentId,
    contactNumber: STUDENT_PROFILE.phone,
    emergencyType: "Injury",
    description: "Ankle injury during sports practice; student is conscious.",
    location: "North Campus Athletics Field",
    priority: "High",
    status: "Ambulance assigned",
    ambulanceId: "MT-AMB-12",
    eta: "6 min",
    createdAt: minutesAgo(12),
  },
  {
    id: "MT-2026-1021",
    studentName: STUDENT_PROFILE.name,
    studentId: STUDENT_PROFILE.studentId,
    contactNumber: STUDENT_PROFILE.phone,
    emergencyType: "Breathing Problem",
    description: "Student felt short of breath after walking between classes.",
    location: "Science Building, East Entrance",
    priority: "Medium",
    status: "Completed",
    ambulanceId: "AMB-03",
    eta: "",
    createdAt: daysAgo(5),
  },
  {
    id: "MT-2026-0984",
    studentName: STUDENT_PROFILE.name,
    studentId: STUDENT_PROFILE.studentId,
    contactNumber: STUDENT_PROFILE.phone,
    emergencyType: "Injury",
    description: "Minor cut requiring first aid at the student center.",
    location: "Student Center, Ground Floor",
    priority: "Low",
    status: "Completed",
    ambulanceId: "AMB-02",
    eta: "",
    createdAt: daysAgo(18),
  },
];

export const EMERGENCY_TYPES = [
  "Accident",
  "Heart Attack",
  "Breathing Problem",
  "Injury",
  "Other",
];

export const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low"];

export const STUDENT_REQUEST_STORAGE_PREFIX = "jeevansetu_student_requests";

export const DEMO_AMBULANCE = {
  registrationNumber: "MT-AMB-007",
  driverName: "Marcus Reed",
  driverContactNumber: "+1 (202) 555-0147",
  eta: "6 min",
};

export const DEMO_TRACKING_COORDINATES = {
  ambulanceStart: [43.6507, -79.3854],
  pickup: [43.6541, -79.3792],
  hospital: [43.6606, -79.3702],
  route: [
    [43.6507, -79.3854],
    [43.6521, -79.3838],
    [43.6532, -79.3811],
    [43.6541, -79.3792],
    [43.6572, -79.3753],
    [43.6606, -79.3702],
  ],
};
