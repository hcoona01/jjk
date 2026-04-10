import KPICard from "@/components/admin/KPICard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getActivityFeed,
  getStudentApplications,
  getUpcomingDrives,
  mockCompanies,
} from "@/lib/mockData";
import { useStudentData } from "@/lib/studentData";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/placement";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  MessageSquare,
  RefreshCw,
  Star,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────

type TrendView = "weekly" | "monthly";

const TIER_COLORS = [
  "oklch(0.50 0.22 261)",
  "oklch(0.60 0.16 200)",
  "oklch(0.55 0.20 280)",
];

const TIER_LABELS: Record<number, { label: string; range: string }> = {
  1: { label: "Tier 1", range: "18–60 LPA" },
  2: { label: "Tier 2", range: "8–18 LPA" },
  3: { label: "Tier 3", range: "4–8 LPA" },
};

const APP_STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: "oklch(0.65 0.22 261)",
  shortlisted: "oklch(0.60 0.16 200)",
  interviewing: "oklch(0.72 0.18 64)",
  offered: "oklch(0.58 0.18 142)",
  hired: "oklch(0.48 0.16 142)",
  rejected: "oklch(0.55 0.22 25)",
};

const APP_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interviewing: "Interviewing",
  offered: "Offered",
  hired: "Hired",
  rejected: "Rejected",
};

const ACTIVITY_ICON_MAP = {
  application: { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  offer: {
    icon: Award,
    color: "text-[oklch(0.72_0.18_64)]",
    bg: "bg-[oklch(0.72_0.18_64)]/10",
  },
  hire: {
    icon: UserCheck,
    color: "text-[oklch(0.58_0.18_142)]",
    bg: "bg-[oklch(0.58_0.18_142)]/10",
  },
  referral: {
    icon: Star,
    color: "text-[oklch(0.55_0.20_280)]",
    bg: "bg-[oklch(0.55_0.20_280)]/10",
  },
  drive: {
    icon: Building2,
    color: "text-[oklch(0.60_0.16_200)]",
    bg: "bg-[oklch(0.60_0.16_200)]/10",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function buildTrendData(view: TrendView, cgpa: number) {
  const cohortBase =
    cgpa >= 8
      ? [48, 52, 55, 59, 63, 66]
      : cgpa >= 7
        ? [38, 42, 44, 48, 51, 54]
        : [28, 31, 34, 37, 39, 42];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

  if (view === "weekly") {
    return weeks.map((w, i) => ({
      label: w,
      rate: Math.round(cohortBase[Math.floor(i / 2)] + (i % 2) * 1.5),
    }));
  }
  return months.map((m, i) => ({ label: m, rate: cohortBase[i] }));
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

function StudentActivityFeed({ studentId }: { studentId: string }) {
  const [items] = useState(() => {
    const apps = getStudentApplications(studentId);
    const base = getActivityFeed(6);

    const appEvents = apps.slice(0, 4).map((app, i) => {
      const company = mockCompanies.find((c) => c.id === app.company_id);
      const typeMap: Record<string, (typeof base)[0]["type"]> = {
        applied: "application",
        shortlisted: "application",
        offered: "offer",
        hired: "hire",
        interviewing: "application",
        rejected: "application",
      };
      return {
        id: `MY-${app.id}`,
        type: typeMap[app.status] ?? ("application" as const),
        message: `You ${app.status === "applied" ? "applied to" : app.status === "shortlisted" ? "were shortlisted at" : app.status === "offered" ? "received offer from" : app.status === "hired" ? "were hired by" : "updated status at"} ${company?.name ?? "a company"} for ${app.role}`,
        timestamp: new Date(
          new Date(app.date).getTime() - i * 3600000 * 6,
        ).toISOString(),
        badge: `${app.status.charAt(0).toUpperCase()}${app.status.slice(1)}`,
      };
    });

    const driveEvents = base.slice(0, 3).map((item) => ({
      ...item,
      type: "drive" as const,
      message: `New placement drive posted: ${item.company}`,
    }));

    return [...appEvents, ...driveEvents].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  });

  const [refreshing, setRefreshing] = useState(false);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Recent Activity
        </h3>
        <button
          type="button"
          onClick={refresh}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Refresh activity"
          data-ocid="activity-refresh"
        >
          <RefreshCw
            size={14}
            className={cn(
              "transition-transform duration-500",
              refreshing && "animate-spin",
            )}
          />
        </button>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto max-h-72 pr-1">
        {items.map((item, i) => {
          const cfg =
            ACTIVITY_ICON_MAP[item.type] ?? ACTIVITY_ICON_MAP.application;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                  cfg.bg,
                )}
              >
                <Icon size={13} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-snug">
                  {item.message}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    {timeAgo(item.timestamp)}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Application Pipeline ─────────────────────────────────────────────────────

function AppPipeline({
  appsByStatus,
}: {
  appsByStatus: Record<ApplicationStatus, number>;
}) {
  const stages: ApplicationStatus[] = [
    "applied",
    "shortlisted",
    "interviewing",
    "offered",
    "hired",
  ];
  const max = Math.max(...stages.map((s) => appsByStatus[s] ?? 0), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-32 px-2">
      {stages.map((stage, i) => {
        const count = appsByStatus[stage] ?? 0;
        const height = (count / max) * 100;
        return (
          <div key={stage} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-foreground">
              {count}
            </span>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              style={{
                height: `${Math.max(height, 4)}%`,
                background: APP_STATUS_COLORS[stage],
                originY: 1,
                minHeight: 4,
              }}
              className="w-full rounded-t-sm"
            />
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide text-center leading-tight">
              {APP_STATUS_LABELS[stage]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Placement Trend Chart ─────────────────────────────────────────────────────

function PlacementTrendChart({
  cgpa,
}: {
  cgpa: number;
}) {
  const [view, setView] = useState<TrendView>("monthly");
  const data = buildTrendData(view, cgpa);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="xl:col-span-7 bg-card border border-border rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Cohort Placement Rate
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            % of students placed in your cohort over time
          </p>
        </div>
        <div className="flex gap-1">
          {(["weekly", "monthly"] as TrendView[]).map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setView(v)}
              data-ocid={`trend-${v}`}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth capitalize",
                view === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {v.charAt(0).toUpperCase() + v.slice(1, 2)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="grad-cohort" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="oklch(0.50 0.22 261)"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="oklch(0.50 0.22 261)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 80]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
            formatter={(v) => [`${v}%`, "Placement Rate"]}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="oklch(0.50 0.22 261)"
            strokeWidth={2.5}
            fill="url(#grad-cohort)"
            name="Placement Rate"
            dot={{ r: 3, fill: "oklch(0.50 0.22 261)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// ─── Tier Eligibility Donut ────────────────────────────────────────────────────

function TierEligibilityChart({ cgpa }: { cgpa: number }) {
  const tier1 =
    cgpa >= 8.5 ? mockCompanies.filter((c) => c.tier === 1).length : 0;
  const tier2 =
    cgpa >= 7.5 ? mockCompanies.filter((c) => c.tier === 2).length : 0;
  const tier3 =
    cgpa >= 6.0 ? mockCompanies.filter((c) => c.tier === 3).length : 0;

  const tierData = [
    { name: "Tier 1", value: tier1, ...TIER_LABELS[1] },
    { name: "Tier 2", value: tier2, ...TIER_LABELS[2] },
    { name: "Tier 3", value: tier3, ...TIER_LABELS[3] },
  ].filter((t) => t.value > 0);

  if (tierData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
        <GraduationCap size={32} className="text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground text-center">
          Improve your CGPA to unlock company eligibility
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <PieChart width={150} height={150}>
          <Pie
            data={tierData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={65}
            paddingAngle={3}
          >
            {tierData.map((entry, i) => (
              <Cell key={`tier-${entry.name}`} fill={TIER_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </div>
      <div className="flex-1 space-y-3">
        {tierData.map((t, i) => (
          <div key={t.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: TIER_COLORS[i] }}
              />
              <span className="text-xs font-medium text-foreground">
                {t.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-foreground">
                {t.value} cos.
              </span>
              <p className="text-[10px] text-muted-foreground">{t.range}</p>
            </div>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground pt-1">
          Based on your CGPA {cgpa.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

const STUDENT_QUICK_ACTIONS = [
  {
    label: "Update Resume",
    icon: FileText,
    path: "/student/resume",
    color: "oklch(0.65 0.22 261)",
    bg: "oklch(0.65 0.22 261 / 0.10)",
  },
  {
    label: "Browse Opportunities",
    icon: Briefcase,
    path: "/student/applications",
    color: "oklch(0.60 0.16 200)",
    bg: "oklch(0.60 0.16 200 / 0.10)",
  },
  {
    label: "Practice Interview",
    icon: MessageSquare,
    path: "/student/mock-interview",
    color: "oklch(0.72 0.18 64)",
    bg: "oklch(0.72 0.18 64 / 0.10)",
  },
  {
    label: "View Analytics",
    icon: BarChart3,
    path: "/student/analytics",
    color: "oklch(0.55 0.20 280)",
    bg: "oklch(0.55 0.20 280 / 0.10)",
  },
];

// ─── Upcoming Drive Card ──────────────────────────────────────────────────────

const TIER_BADGE: Record<number, string> = {
  1: "bg-primary/10 text-primary border border-primary/30",
  2: "bg-[oklch(0.60_0.16_200)]/10 text-[oklch(0.60_0.16_200)] border border-[oklch(0.60_0.16_200)]/30",
  3: "bg-[oklch(0.55_0.20_280)]/10 text-[oklch(0.55_0.20_280)] border border-[oklch(0.55_0.20_280)]/30",
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { student, stats } = useStudentData();

  const studentApplications = useMemo(
    () => (student ? getStudentApplications(student.id) : []),
    [student],
  );

  const upcomingDrives = useMemo(
    () => (student ? getUpcomingDrives(student.department).slice(0, 5) : []),
    [student],
  );

  if (!student || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-6">
        <GraduationCap size={48} className="text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">
          Profile Not Found
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          We couldn't find your student profile. Please log in again.
        </p>
        <Link
          to="/login"
          className="text-sm text-primary hover:underline transition-colors"
        >
          Back to Login →
        </Link>
      </div>
    );
  }

  const isPlaced = student.placement_status === "placed";
  const isInProgress = student.placement_status === "in-progress";
  const pendingApps =
    (stats.applications_by_status.applied ?? 0) +
    (stats.applications_by_status.shortlisted ?? 0) +
    (stats.applications_by_status.interviewing ?? 0);

  const topSkills = student.skills.slice(0, 3).join(", ");

  // ── Sparkline data ──
  const appSparkline = [1, 2, 2, 3, 3, 4, 4, studentApplications.length];
  const cgpaSparkline = [
    student.cgpa - 0.8,
    student.cgpa - 0.6,
    student.cgpa - 0.4,
    student.cgpa - 0.3,
    student.cgpa - 0.2,
    student.cgpa - 0.1,
    student.cgpa,
    student.cgpa,
  ];
  const skillSparkline = [
    2,
    2,
    3,
    3,
    4,
    4,
    student.skills.length,
    student.skills.length,
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Welcome back, {student.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground/80 mr-2">
              {student.roll_number}
            </span>
            {student.department} · {student.school} · Batch {student.batch}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isPlaced
                ? "bg-[oklch(0.58_0.18_142)] animate-pulse"
                : isInProgress
                  ? "bg-[oklch(0.72_0.18_64)] animate-pulse"
                  : "bg-muted-foreground",
            )}
          />
          <span className="text-xs text-muted-foreground">
            {isPlaced
              ? "Placed ✓"
              : isInProgress
                ? "Actively Searching"
                : "Seeking Placement"}
          </span>
        </div>
      </div>

      {/* Placed banner */}
      {isPlaced && student.placed_at && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-xl p-4 flex items-center gap-4 bg-[oklch(0.55_0.18_145/0.1)] border border-[oklch(0.55_0.18_145/0.3)]"
          data-ocid="placement-banner"
        >
          <div className="w-11 h-11 rounded-full bg-[oklch(0.55_0.18_145/0.2)] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} style={{ color: "oklch(0.72 0.2 145)" }} />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              🎉 Congratulations! Placed at {student.placed_at}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Offered package: ₹{student.package_lpa} LPA · Top{" "}
              {100 - (stats.peer_benchmark.dept_package_percentile ?? 80)}% in
              your department
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            title: "CGPA",
            value: student.cgpa,
            icon: GraduationCap,
            color: "blue" as const,
            trend: student.cgpa >= 7.5 ? ("up" as const) : ("neutral" as const),
            trendPercent: student.cgpa >= 7.5 ? 3 : undefined,
            sparklineData: cgpaSparkline,
            suffix: "",
            "data-ocid": "kpi-cgpa",
          },
          {
            title: "Applications",
            value: stats.total_applications,
            icon: Briefcase,
            color: "cyan" as const,
            trend:
              stats.total_applications > 3
                ? ("up" as const)
                : ("neutral" as const),
            trendPercent: stats.total_applications > 3 ? 15 : undefined,
            sparklineData: appSparkline,
            "data-ocid": "kpi-applications",
          },
          {
            title: "Placement Status",
            value: isPlaced ? "Placed" : isInProgress ? "Active" : "Seeking",
            icon: isPlaced ? UserCheck : isInProgress ? Clock : TrendingUp,
            color: isPlaced
              ? ("green" as const)
              : isInProgress
                ? ("amber" as const)
                : ("red" as const),
            "data-ocid": "kpi-status",
          },
          {
            title: "Interviews",
            value: stats.upcoming_interview_count,
            icon: CalendarDays,
            color: "purple" as const,
            trend:
              stats.upcoming_interview_count > 0
                ? ("up" as const)
                : ("neutral" as const),
            sparklineData: [
              0,
              0,
              1,
              1,
              2,
              2,
              2,
              stats.upcoming_interview_count,
            ],
            "data-ocid": "kpi-interviews",
          },
          {
            title: "Skills",
            value: stats.skill_count,
            icon: Zap,
            color: "amber" as const,
            trend: "up" as const,
            trendPercent: 10,
            sparklineData: skillSparkline,
            "data-ocid": "kpi-skills",
          },
          {
            title: "Dept Avg Pkg",
            value: stats.avg_package_dept,
            icon: Award,
            color: "green" as const,
            suffix: " LPA",
            trend: "up" as const,
            trendPercent: 8,
            sparklineData: [
              8,
              9,
              9.5,
              10,
              10.5,
              11,
              11.5,
              stats.avg_package_dept,
            ],
            "data-ocid": "kpi-avg-package",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}
          >
            <KPICard {...card} />
          </motion.div>
        ))}
      </div>

      {/* ── Row 2: Trend Chart + Tier Eligibility ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <PlacementTrendChart cgpa={student.cgpa} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-5 bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Company Tier Eligibility
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Companies you qualify for based on your CGPA
            </p>
          </div>
          <TierEligibilityChart cgpa={student.cgpa} />
        </motion.div>
      </div>

      {/* ── Row 3: Pipeline + Activity Feed ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Application Status Pipeline
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your applications by stage
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {stats.total_applications} total · {pendingApps} active
            </span>
          </div>
          <AppPipeline appsByStatus={stats.applications_by_status} />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(
              Object.entries(stats.applications_by_status) as [
                ApplicationStatus,
                number,
              ][]
            )
              .filter(([, count]) => count > 0)
              .map(([status, count]) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-foreground"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: APP_STATUS_COLORS[status] }}
                  />
                  {APP_STATUS_LABELS[status]}: {count}
                </span>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
          data-ocid="activity-feed"
        >
          <StudentActivityFeed studentId={student.id} />
        </motion.div>
      </div>

      {/* ── Row 4: Peer Benchmark Bar Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="bg-card border border-border rounded-xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Peer Benchmark
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your scores vs department average — top{" "}
              {100 - stats.peer_benchmark.dept_cgpa_percentile}% CGPA in{" "}
              {student.department}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-xs"
            data-ocid="peer-percentile-badge"
          >
            {stats.peer_benchmark.dept_cgpa_percentile}th percentile
          </Badge>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={[
              {
                metric: "CGPA (×10)",
                You: stats.peer_benchmark.student_cgpa * 10,
                "Dept Avg": stats.peer_benchmark.dept_avg_cgpa * 10,
              },
              {
                metric: "Aptitude",
                You: stats.peer_benchmark.student_aptitude,
                "Dept Avg": stats.peer_benchmark.dept_avg_aptitude,
              },
              {
                metric: "Programming",
                You: stats.peer_benchmark.student_programming,
                "Dept Avg": stats.peer_benchmark.dept_avg_programming,
              },
            ]}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
            <XAxis
              dataKey="metric"
              tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
            <Bar
              dataKey="You"
              fill="oklch(0.50 0.22 261)"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="Dept Avg"
              fill="oklch(0.60 0.16 200)"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Row 5: Upcoming Drives ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Upcoming Placement Drives
          </h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            {upcomingDrives.length} eligible
          </Badge>
        </div>

        {upcomingDrives.length === 0 ? (
          <div
            className="bg-card border border-border rounded-xl py-12 text-center"
            data-ocid="empty-drives"
          >
            <CalendarDays
              size={32}
              className="mx-auto text-muted-foreground/30 mb-3"
            />
            <p className="text-sm font-medium text-foreground">
              No upcoming drives
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Check back soon for new placement drives.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {upcomingDrives.map((drive, i) => (
              <motion.div
                key={drive.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.28 + i * 0.07 }}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-smooth group"
                data-ocid={`drive-card-${drive.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-smooth">
                    <Building2 size={16} className="text-primary" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      TIER_BADGE[drive.tier],
                    )}
                  >
                    Tier {drive.tier}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">
                  {drive.company_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(drive.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {drive.positions} positions · Min CGPA {drive.min_cgpa}
                </p>
                <p className="text-xs font-medium text-primary mt-1">
                  {drive.package_range}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {drive.roles.slice(0, 2).map((role) => (
                    <span
                      key={role}
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-xs h-7"
                  data-ocid={`drive-view-${drive.id}`}
                >
                  View Details
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Row 6: Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-5 shadow-sm"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STUDENT_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                data-ocid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 transition-smooth group cursor-pointer"
                style={{ background: action.bg }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${action.color}20` }}
                >
                  <Icon size={20} style={{ color: action.color }} />
                </div>
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors text-center">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ── Row 7: Skills + Profile Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.32 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">My Skills</h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              {student.skills.length} mastered
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Top skills:{" "}
            <span className="text-foreground font-medium">{topSkills}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {student.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.33 + i * 0.04 }}
                className="inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 text-center"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.34 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Academic Profile
            </h3>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "CGPA",
                value: student.cgpa.toFixed(1),
                bar: (student.cgpa / 10) * 100,
                color: "oklch(0.50 0.22 261)",
              },
              {
                label: "Aptitude Score",
                value: `${student.aptitude_score}/100`,
                bar: student.aptitude_score,
                color: "oklch(0.60 0.16 200)",
              },
              {
                label: "Programming",
                value: `${student.programming_score}/100`,
                bar: student.programming_score,
                color: "oklch(0.58 0.18 142)",
              },
            ].map(({ label, value, bar, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-semibold text-foreground">
                    {value}
                  </span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bar}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Department
              </p>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {student.department}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Programme
              </p>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {student.programme}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Batch
              </p>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {student.batch}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Section
              </p>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {student.section}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
