import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import AdminLayout from "./components/admin/AdminLayout";
import StudentLayout from "./components/student/StudentLayout";
import { loadSession } from "./lib/auth";

// ─── Lazy Pages ───────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const MockInterview = lazy(() => import("./pages/admin/MockInterview"));
const ResumeEditor = lazy(() => import("./pages/admin/ResumeEditor"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const StudentApplications = lazy(
  () => import("./pages/student/StudentApplications"),
);
const StudentInterviewPrep = lazy(
  () => import("./pages/student/StudentInterviewPrep"),
);
const StudentAnalytics = lazy(() => import("./pages/student/StudentAnalytics"));

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return () => (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ─── Route Definitions ────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      const session = loadSession();
      if (session) {
        throw redirect({
          to:
            session.role === "admin"
              ? "/admin/dashboard"
              : "/student/dashboard",
        });
      }
      throw redirect({ to: "/login" });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: withSuspense(LoginPage),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
  beforeLoad: () => {
    const session = loadSession();
    if (!session || session.role !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: () => <Navigate to="/admin/dashboard" />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "dashboard",
  component: withSuspense(AdminDashboard),
});

const analyticsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "analytics",
  component: withSuspense(AdminAnalytics),
});

const interviewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "interview",
  component: withSuspense(MockInterview),
});

const resumeRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "resume",
  component: withSuspense(ResumeEditor),
});

const usersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "users",
  component: () => <PlaceholderPage title="Placement Training Cell" />,
});

const studentsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "students",
  component: () => <PlaceholderPage title="Manage Students" />,
});

const companiesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "companies",
  component: () => <PlaceholderPage title="Company Registration" />,
});

const settingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "settings",
  component: () => <PlaceholderPage title="Settings" />,
});

// ─── Student Routes ───────────────────────────────────────────────────────────
const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/student",
  component: StudentLayout,
  beforeLoad: () => {
    const session = loadSession();
    if (!session || session.role !== "student") {
      throw redirect({ to: "/login" });
    }
  },
});

const studentIndexRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "/",
  component: () => <Navigate to="/student/dashboard" />,
});

const studentDashboardRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "dashboard",
  component: withSuspense(StudentDashboard),
});

const studentProfileRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "profile",
  component: withSuspense(StudentProfile),
});

const studentApplicationsRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "applications",
  component: withSuspense(StudentApplications),
});

const studentInterviewPrepRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "interview-prep",
  component: withSuspense(StudentInterviewPrep),
});

const studentAnalyticsRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "analytics",
  component: withSuspense(StudentAnalytics),
});

const studentResumeRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "resume",
  component: withSuspense(ResumeEditor),
});

const studentMockInterviewRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: "mock-interview",
  component: withSuspense(MockInterview),
});

// ─── Router ───────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  loginRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    dashboardRoute,
    analyticsRoute,
    interviewRoute,
    resumeRoute,
    usersRoute,
    studentsRoute,
    companiesRoute,
    settingsRoute,
  ]),
  studentRoute.addChildren([
    studentIndexRoute,
    studentDashboardRoute,
    studentProfileRoute,
    studentApplicationsRoute,
    studentInterviewPrepRoute,
    studentAnalyticsRoute,
    studentResumeRoute,
    studentMockInterviewRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return <RouterProvider router={router} />;
}
