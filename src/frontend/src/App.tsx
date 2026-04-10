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

// ─── Lazy Pages ───────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const MockInterview = lazy(() => import("./pages/admin/MockInterview"));
const ResumeEditor = lazy(() => import("./pages/admin/ResumeEditor"));

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
      throw redirect({ to: "/admin/dashboard" });
    }
  },
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
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

// ─── Router ───────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
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
