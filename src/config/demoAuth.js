// Demo-only credentials; never use these for production authentication.
export const DEMO_CREDENTIALS = {
  admin: {
    username: "admin",
    password: "Admin@123",
    role: "admin",
  },
  student: {
    username: "student",
    password: "Student@123",
    role: "student",
  },
};

export const DEMO_SESSION_STORAGE_KEY = "jeevansetu_demo_session";
export const REMEMBERED_USERNAME_STORAGE_KEY =
  "jeevansetu_demo_remembered_username";

export function getRoleDashboardPath(role) {
  return role === "admin" ? "/admin/dashboard" : "/student/dashboard";
}
