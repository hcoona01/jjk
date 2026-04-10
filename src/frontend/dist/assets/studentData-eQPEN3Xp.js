import { j as jsxRuntimeExports, d as cn, r as reactExports, T as loadSession, m as mockStudents, A as getStudentApplications, W as getStudentInterviews, E as getUpcomingDrives, Y as getPeerBenchmark, a as mockCompanies } from "./index-CSqV-Tvs.js";
import { S as Slot, b as cva } from "./index-CLMp4i3a.js";
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function useStudentData() {
  const session = reactExports.useMemo(() => loadSession(), []);
  const student = reactExports.useMemo(() => {
    if (!session || session.role !== "student") return null;
    return mockStudents.find(
      (s) => {
        var _a, _b;
        return s.id === session.userId || ((_a = s.roll_number) == null ? void 0 : _a.toLowerCase()) === ((_b = session.rollNumber) == null ? void 0 : _b.toLowerCase());
      }
    ) ?? null;
  }, [session]);
  const stats = reactExports.useMemo(() => {
    var _a;
    if (!student) return null;
    const applications = getStudentApplications(student.id);
    const interviews = getStudentInterviews(student.id);
    const upcomingDrives = getUpcomingDrives(student.department);
    const peerBenchmark = getPeerBenchmark(student.id);
    const applicationsByStatus = {
      applied: 0,
      shortlisted: 0,
      interviewing: 0,
      offered: 0,
      hired: 0,
      rejected: 0
    };
    for (const app of applications) {
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] ?? 0) + 1;
    }
    const companyCounts = {};
    for (const app of applications) {
      const company = mockCompanies.find((c) => c.id === app.company_id);
      if (company) {
        companyCounts[company.name] = (companyCounts[company.name] ?? 0) + 1;
      }
    }
    const topCompanyApplied = (_a = Object.entries(companyCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]) == null ? void 0 : _a[0];
    const deptPlaced = mockStudents.filter(
      (s) => s.department === student.department && s.package_lpa
    );
    const avgPackageDept = deptPlaced.length ? Number.parseFloat(
      (deptPlaced.reduce((a, s) => a + (s.package_lpa ?? 0), 0) / deptPlaced.length).toFixed(1)
    ) : 0;
    const upcomingInterviewCount = upcomingDrives.filter(
      (d) => d.eligible_branches.includes(student.department) && d.min_cgpa <= student.cgpa
    ).length + interviews.filter((i) => i.status === "scheduled").length;
    return {
      total_applications: applications.length,
      applications_by_status: applicationsByStatus,
      cgpa_percentile: peerBenchmark.dept_cgpa_percentile,
      upcoming_interview_count: upcomingInterviewCount,
      skill_count: student.skills.length,
      avg_package_dept: avgPackageDept,
      top_company_applied: topCompanyApplied,
      interview_sessions: interviews,
      peer_benchmark: peerBenchmark
    };
  }, [student]);
  return {
    student,
    stats,
    isLoaded: true
  };
}
export {
  Badge as B,
  useStudentData as u
};
