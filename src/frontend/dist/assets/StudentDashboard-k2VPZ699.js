import { r as reactExports, A as getStudentApplications, E as getUpcomingDrives, j as jsxRuntimeExports, L as Link, d as cn, Z as Zap, B as Building2, F as FileText, M as MessageSquare, C as ChartColumn, a as mockCompanies, h as getActivityFeed } from "./index-CSqV-Tvs.js";
import { U as UserCheck, K as KPICard, A as AreaChart, P as PieChart, a as Pie } from "./KPICard-ZJTCAujo.js";
import { u as useStudentData, B as Badge } from "./studentData-eQPEN3Xp.js";
import { B as Button } from "./button-BmzyXuFv.js";
import { G as GraduationCap } from "./graduation-cap-B8IByoLM.js";
import { m as motion } from "./proxy-CwEQWttt.js";
import { C as CircleCheck } from "./circle-check-B0n-UOmI.js";
import { B as Briefcase } from "./briefcase-CebdH36b.js";
import { C as Clock, S as Star } from "./star-BeJNHjEv.js";
import { T as TrendingUp } from "./trending-up-Bxh-st7e.js";
import { C as CalendarDays } from "./calendar-days-BhbXdcKy.js";
import { A as Award } from "./award-mvM1f5RN.js";
import { R as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, B as Bar, a as Cell } from "./generateCategoricalChart-C-v2pZKU.js";
import { B as BarChart } from "./BarChart-DsGql0PG.js";
import { B as BookOpen } from "./book-open-Dy2xt3aw.js";
import { A as Area } from "./Area-FMEm7lCb.js";
import { R as RefreshCw } from "./refresh-cw-CXGb4LBS.js";
import "./trending-down-DuwQ70N6.js";
import "./index-CLMp4i3a.js";
const TIER_COLORS = [
  "oklch(0.50 0.22 261)",
  "oklch(0.60 0.16 200)",
  "oklch(0.55 0.20 280)"
];
const TIER_LABELS = {
  1: { label: "Tier 1", range: "18–60 LPA" },
  2: { label: "Tier 2", range: "8–18 LPA" },
  3: { label: "Tier 3", range: "4–8 LPA" }
};
const APP_STATUS_COLORS = {
  applied: "oklch(0.65 0.22 261)",
  shortlisted: "oklch(0.60 0.16 200)",
  interviewing: "oklch(0.72 0.18 64)",
  offered: "oklch(0.58 0.18 142)",
  hired: "oklch(0.48 0.16 142)",
  rejected: "oklch(0.55 0.22 25)"
};
const APP_STATUS_LABELS = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interviewing: "Interviewing",
  offered: "Offered",
  hired: "Hired",
  rejected: "Rejected"
};
const ACTIVITY_ICON_MAP = {
  application: { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  offer: {
    icon: Award,
    color: "text-[oklch(0.72_0.18_64)]",
    bg: "bg-[oklch(0.72_0.18_64)]/10"
  },
  hire: {
    icon: UserCheck,
    color: "text-[oklch(0.58_0.18_142)]",
    bg: "bg-[oklch(0.58_0.18_142)]/10"
  },
  referral: {
    icon: Star,
    color: "text-[oklch(0.55_0.20_280)]",
    bg: "bg-[oklch(0.55_0.20_280)]/10"
  },
  drive: {
    icon: Building2,
    color: "text-[oklch(0.60_0.16_200)]",
    bg: "bg-[oklch(0.60_0.16_200)]/10"
  }
};
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}
function buildTrendData(view, cgpa) {
  const cohortBase = cgpa >= 8 ? [48, 52, 55, 59, 63, 66] : cgpa >= 7 ? [38, 42, 44, 48, 51, 54] : [28, 31, 34, 37, 39, 42];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  if (view === "weekly") {
    return weeks.map((w, i) => ({
      label: w,
      rate: Math.round(cohortBase[Math.floor(i / 2)] + i % 2 * 1.5)
    }));
  }
  return months.map((m, i) => ({ label: m, rate: cohortBase[i] }));
}
function StudentActivityFeed({ studentId }) {
  const [items] = reactExports.useState(() => {
    const apps = getStudentApplications(studentId);
    const base = getActivityFeed(6);
    const appEvents = apps.slice(0, 4).map((app, i) => {
      const company = mockCompanies.find((c) => c.id === app.company_id);
      const typeMap = {
        applied: "application",
        shortlisted: "application",
        offered: "offer",
        hired: "hire",
        interviewing: "application",
        rejected: "application"
      };
      return {
        id: `MY-${app.id}`,
        type: typeMap[app.status] ?? "application",
        message: `You ${app.status === "applied" ? "applied to" : app.status === "shortlisted" ? "were shortlisted at" : app.status === "offered" ? "received offer from" : app.status === "hired" ? "were hired by" : "updated status at"} ${(company == null ? void 0 : company.name) ?? "a company"} for ${app.role}`,
        timestamp: new Date(
          new Date(app.date).getTime() - i * 36e5 * 6
        ).toISOString(),
        badge: `${app.status.charAt(0).toUpperCase()}${app.status.slice(1)}`
      };
    });
    const driveEvents = base.slice(0, 3).map((item) => ({
      ...item,
      type: "drive",
      message: `New placement drive posted: ${item.company}`
    }));
    return [...appEvents, ...driveEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });
  const [refreshing, setRefreshing] = reactExports.useState(false);
  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground uppercase tracking-wider", children: "Recent Activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: refresh,
          className: "p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
          "aria-label": "Refresh activity",
          "data-ocid": "activity-refresh",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefreshCw,
            {
              size: 14,
              className: cn(
                "transition-transform duration-500",
                refreshing && "animate-spin"
              )
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-2 overflow-y-auto max-h-72 pr-1", children: items.map((item, i) => {
      const cfg = ACTIVITY_ICON_MAP[item.type] ?? ACTIVITY_ICON_MAP.application;
      const Icon = cfg.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: i * 0.04 },
          className: "flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                  cfg.bg
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13, className: cfg.color })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-snug", children: item.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: timeAgo(item.timestamp) }),
                item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-medium", children: item.badge })
              ] })
            ] })
          ]
        },
        item.id
      );
    }) })
  ] });
}
function AppPipeline({
  appsByStatus
}) {
  const stages = [
    "applied",
    "shortlisted",
    "interviewing",
    "offered",
    "hired"
  ];
  const max = Math.max(...stages.map((s) => appsByStatus[s] ?? 0), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between gap-2 h-32 px-2", children: stages.map((stage, i) => {
    const count = appsByStatus[stage] ?? 0;
    const height = count / max * 100;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground", children: count }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { scaleY: 0 },
          animate: { scaleY: 1 },
          transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
          style: {
            height: `${Math.max(height, 4)}%`,
            background: APP_STATUS_COLORS[stage],
            originY: 1,
            minHeight: 4
          },
          className: "w-full rounded-t-sm"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wide text-center leading-tight", children: APP_STATUS_LABELS[stage] })
    ] }, stage);
  }) });
}
function PlacementTrendChart({
  cgpa
}) {
  const [view, setView] = reactExports.useState("monthly");
  const data = buildTrendData(view, cgpa);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.1 },
      className: "xl:col-span-7 bg-card border border-border rounded-xl p-5 shadow-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Cohort Placement Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "% of students placed in your cohort over time" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["weekly", "monthly"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setView(v),
              "data-ocid": `trend-${v}`,
              className: cn(
                "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth capitalize",
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              ),
              children: v.charAt(0).toUpperCase() + v.slice(1, 2)
            },
            v
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "grad-cohort", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "5%",
                stopColor: "oklch(0.50 0.22 261)",
                stopOpacity: 0.35
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "95%",
                stopColor: "oklch(0.50 0.22 261)",
                stopOpacity: 0
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.92 0 0)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            XAxis,
            {
              dataKey: "label",
              tick: { fontSize: 11, fill: "oklch(0.5 0 0)" },
              axisLine: false,
              tickLine: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            YAxis,
            {
              tick: { fontSize: 11, fill: "oklch(0.5 0 0)" },
              axisLine: false,
              tickLine: false,
              domain: [0, 80],
              tickFormatter: (v) => `${v}%`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              contentStyle: {
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px"
              },
              labelStyle: { color: "var(--foreground)", fontWeight: 600 },
              formatter: (v) => [`${v}%`, "Placement Rate"]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Area,
            {
              type: "monotone",
              dataKey: "rate",
              stroke: "oklch(0.50 0.22 261)",
              strokeWidth: 2.5,
              fill: "url(#grad-cohort)",
              name: "Placement Rate",
              dot: { r: 3, fill: "oklch(0.50 0.22 261)" }
            }
          )
        ] }) })
      ]
    }
  );
}
function TierEligibilityChart({ cgpa }) {
  const tier1 = cgpa >= 8.5 ? mockCompanies.filter((c) => c.tier === 1).length : 0;
  const tier2 = cgpa >= 7.5 ? mockCompanies.filter((c) => c.tier === 2).length : 0;
  const tier3 = cgpa >= 6 ? mockCompanies.filter((c) => c.tier === 3).length : 0;
  const tierData = [
    { name: "Tier 1", value: tier1, ...TIER_LABELS[1] },
    { name: "Tier 2", value: tier2, ...TIER_LABELS[2] },
    { name: "Tier 3", value: tier3, ...TIER_LABELS[3] }
  ].filter((t) => t.value > 0);
  if (tierData.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-2 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 32, className: "text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Improve your CGPA to unlock company eligibility" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { width: 150, height: 150, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Pie,
        {
          data: tierData,
          dataKey: "value",
          cx: "50%",
          cy: "50%",
          innerRadius: 42,
          outerRadius: 65,
          paddingAngle: 3,
          children: tierData.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: TIER_COLORS[i] }, `tier-${entry.name}`))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Tooltip,
        {
          contentStyle: {
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "12px"
          }
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
      tierData.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
              style: { background: TIER_COLORS[i] }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: t.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
            t.value,
            " cos."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: t.range })
        ] })
      ] }, t.name)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground pt-1", children: [
        "Based on your CGPA ",
        cgpa.toFixed(1)
      ] })
    ] })
  ] });
}
const STUDENT_QUICK_ACTIONS = [
  {
    label: "Update Resume",
    icon: FileText,
    path: "/student/resume",
    color: "oklch(0.65 0.22 261)",
    bg: "oklch(0.65 0.22 261 / 0.10)"
  },
  {
    label: "Browse Opportunities",
    icon: Briefcase,
    path: "/student/applications",
    color: "oklch(0.60 0.16 200)",
    bg: "oklch(0.60 0.16 200 / 0.10)"
  },
  {
    label: "Practice Interview",
    icon: MessageSquare,
    path: "/student/mock-interview",
    color: "oklch(0.72 0.18 64)",
    bg: "oklch(0.72 0.18 64 / 0.10)"
  },
  {
    label: "View Analytics",
    icon: ChartColumn,
    path: "/student/analytics",
    color: "oklch(0.55 0.20 280)",
    bg: "oklch(0.55 0.20 280 / 0.10)"
  }
];
const TIER_BADGE = {
  1: "bg-primary/10 text-primary border border-primary/30",
  2: "bg-[oklch(0.60_0.16_200)]/10 text-[oklch(0.60_0.16_200)] border border-[oklch(0.60_0.16_200)]/30",
  3: "bg-[oklch(0.55_0.20_280)]/10 text-[oklch(0.55_0.20_280)] border border-[oklch(0.55_0.20_280)]/30"
};
function StudentDashboard() {
  const { student, stats } = useStudentData();
  const studentApplications = reactExports.useMemo(
    () => student ? getStudentApplications(student.id) : [],
    [student]
  );
  const upcomingDrives = reactExports.useMemo(
    () => student ? getUpcomingDrives(student.department).slice(0, 5) : [],
    [student]
  );
  if (!student || !stats) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-screen gap-4 text-center px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 48, className: "text-muted-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Profile Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "We couldn't find your student profile. Please log in again." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/login",
          className: "text-sm text-primary hover:underline transition-colors",
          children: "Back to Login →"
        }
      )
    ] });
  }
  const isPlaced = student.placement_status === "placed";
  const isInProgress = student.placement_status === "in-progress";
  const pendingApps = (stats.applications_by_status.applied ?? 0) + (stats.applications_by_status.shortlisted ?? 0) + (stats.applications_by_status.interviewing ?? 0);
  const topSkills = student.skills.slice(0, 3).join(", ");
  const appSparkline = [1, 2, 2, 3, 3, 4, 4, studentApplications.length];
  const cgpaSparkline = [
    student.cgpa - 0.8,
    student.cgpa - 0.6,
    student.cgpa - 0.4,
    student.cgpa - 0.3,
    student.cgpa - 0.2,
    student.cgpa - 0.1,
    student.cgpa,
    student.cgpa
  ];
  const skillSparkline = [
    2,
    2,
    3,
    3,
    4,
    4,
    student.skills.length,
    student.skills.length
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground font-display", children: [
          "Welcome back, ",
          student.name.split(" ")[0],
          "!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground/80 mr-2", children: student.roll_number }),
          student.department,
          " · ",
          student.school,
          " · Batch ",
          student.batch
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-2 h-2 rounded-full",
              isPlaced ? "bg-[oklch(0.58_0.18_142)] animate-pulse" : isInProgress ? "bg-[oklch(0.72_0.18_64)] animate-pulse" : "bg-muted-foreground"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isPlaced ? "Placed ✓" : isInProgress ? "Actively Searching" : "Seeking Placement" })
      ] })
    ] }),
    isPlaced && student.placed_at && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.05 },
        className: "rounded-xl p-4 flex items-center gap-4 bg-[oklch(0.55_0.18_145/0.1)] border border-[oklch(0.55_0.18_145/0.3)]",
        "data-ocid": "placement-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full bg-[oklch(0.55_0.18_145/0.2)] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 22, style: { color: "oklch(0.72 0.2 145)" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
              "🎉 Congratulations! Placed at ",
              student.placed_at
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "Offered package: ₹",
              student.package_lpa,
              " LPA · Top",
              " ",
              100 - (stats.peer_benchmark.dept_package_percentile ?? 80),
              "% in your department"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4", children: [
      {
        title: "CGPA",
        value: student.cgpa,
        icon: GraduationCap,
        color: "blue",
        trend: student.cgpa >= 7.5 ? "up" : "neutral",
        trendPercent: student.cgpa >= 7.5 ? 3 : void 0,
        sparklineData: cgpaSparkline,
        suffix: "",
        "data-ocid": "kpi-cgpa"
      },
      {
        title: "Applications",
        value: stats.total_applications,
        icon: Briefcase,
        color: "cyan",
        trend: stats.total_applications > 3 ? "up" : "neutral",
        trendPercent: stats.total_applications > 3 ? 15 : void 0,
        sparklineData: appSparkline,
        "data-ocid": "kpi-applications"
      },
      {
        title: "Placement Status",
        value: isPlaced ? "Placed" : isInProgress ? "Active" : "Seeking",
        icon: isPlaced ? UserCheck : isInProgress ? Clock : TrendingUp,
        color: isPlaced ? "green" : isInProgress ? "amber" : "red",
        "data-ocid": "kpi-status"
      },
      {
        title: "Interviews",
        value: stats.upcoming_interview_count,
        icon: CalendarDays,
        color: "purple",
        trend: stats.upcoming_interview_count > 0 ? "up" : "neutral",
        sparklineData: [
          0,
          0,
          1,
          1,
          2,
          2,
          2,
          stats.upcoming_interview_count
        ],
        "data-ocid": "kpi-interviews"
      },
      {
        title: "Skills",
        value: stats.skill_count,
        icon: Zap,
        color: "amber",
        trend: "up",
        trendPercent: 10,
        sparklineData: skillSparkline,
        "data-ocid": "kpi-skills"
      },
      {
        title: "Dept Avg Pkg",
        value: stats.avg_package_dept,
        icon: Award,
        color: "green",
        suffix: " LPA",
        trend: "up",
        trendPercent: 8,
        sparklineData: [
          8,
          9,
          9.5,
          10,
          10.5,
          11,
          11.5,
          stats.avg_package_dept
        ],
        "data-ocid": "kpi-avg-package"
      }
    ].map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.05 + i * 0.06 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { ...card })
      },
      card.title
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-12 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PlacementTrendChart, { cgpa: student.cgpa }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 },
          className: "xl:col-span-5 bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Company Tier Eligibility" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Companies you qualify for based on your CGPA" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TierEligibilityChart, { cgpa: student.cgpa })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.18 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Application Status Pipeline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Your applications by stage" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                stats.total_applications,
                " total · ",
                pendingApps,
                " active"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AppPipeline, { appsByStatus: stats.applications_by_status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: Object.entries(stats.applications_by_status).filter(([, count]) => count > 0).map(([status, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-1.5 h-1.5 rounded-full",
                      style: { background: APP_STATUS_COLORS[status] }
                    }
                  ),
                  APP_STATUS_LABELS[status],
                  ": ",
                  count
                ]
              },
              status
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          "data-ocid": "activity-feed",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(StudentActivityFeed, { studentId: student.id })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.22 },
        className: "bg-card border border-border rounded-xl p-5 shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Peer Benchmark" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Your scores vs department average — top",
                " ",
                100 - stats.peer_benchmark.dept_cgpa_percentile,
                "% CGPA in",
                " ",
                student.department
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "text-xs",
                "data-ocid": "peer-percentile-badge",
                children: [
                  stats.peer_benchmark.dept_cgpa_percentile,
                  "th percentile"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            BarChart,
            {
              data: [
                {
                  metric: "CGPA (×10)",
                  You: stats.peer_benchmark.student_cgpa * 10,
                  "Dept Avg": stats.peer_benchmark.dept_avg_cgpa * 10
                },
                {
                  metric: "Aptitude",
                  You: stats.peer_benchmark.student_aptitude,
                  "Dept Avg": stats.peer_benchmark.dept_avg_aptitude
                },
                {
                  metric: "Programming",
                  You: stats.peer_benchmark.student_programming,
                  "Dept Avg": stats.peer_benchmark.dept_avg_programming
                }
              ],
              barCategoryGap: "25%",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.92 0 0)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "metric",
                    tick: { fontSize: 11, fill: "oklch(0.5 0 0)" },
                    axisLine: false,
                    tickLine: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    tick: { fontSize: 11, fill: "oklch(0.5 0 0)" },
                    axisLine: false,
                    tickLine: false,
                    domain: [0, 100]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    contentStyle: {
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px"
                    },
                    labelStyle: { color: "var(--foreground)", fontWeight: 600 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconSize: 10, wrapperStyle: { fontSize: "11px" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    dataKey: "You",
                    fill: "oklch(0.50 0.22 261)",
                    radius: [3, 3, 0, 0]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    dataKey: "Dept Avg",
                    fill: "oklch(0.60 0.16 200)",
                    radius: [3, 3, 0, 0]
                  }
                )
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.25 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 16, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Upcoming Placement Drives" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
              upcomingDrives.length,
              " eligible"
            ] })
          ] }),
          upcomingDrives.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl py-12 text-center",
              "data-ocid": "empty-drives",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CalendarDays,
                  {
                    size: 32,
                    className: "mx-auto text-muted-foreground/30 mb-3"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No upcoming drives" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Check back soon for new placement drives." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4", children: upcomingDrives.map((drive, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: 0.28 + i * 0.07 },
              className: "bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-smooth group",
              "data-ocid": `drive-card-${drive.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        TIER_BADGE[drive.tier]
                      ),
                      children: [
                        "Tier ",
                        drive.tier
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: drive.company_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: new Date(drive.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  drive.positions,
                  " positions · Min CGPA ",
                  drive.min_cgpa
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-primary mt-1", children: drive.package_range }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: drive.roles.slice(0, 2).map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[9px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground",
                    children: role
                  },
                  role
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "w-full mt-3 text-xs h-7",
                    "data-ocid": `drive-view-${drive.id}`,
                    children: "View Details"
                  }
                )
              ]
            },
            drive.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 },
        className: "bg-card border border-border rounded-xl p-5 shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Quick Actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: STUDENT_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: action.path,
                "data-ocid": `quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`,
                className: "flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 transition-smooth group cursor-pointer",
                style: { background: action.bg },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-xl flex items-center justify-center",
                      style: { background: `${action.color}20` },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20, style: { color: action.color } })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground group-hover:text-primary transition-colors text-center", children: action.label })
                ]
              },
              action.path
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -16 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.32 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "My Skills" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
                student.skills.length,
                " mastered"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
              "Top skills:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: topSkills })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: student.skills.map((skill, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.span,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: 0.33 + i * 0.04 },
                className: "inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 text-center",
                children: skill
              },
              skill
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 16 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.34 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Academic Profile" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
              {
                label: "CGPA",
                value: student.cgpa.toFixed(1),
                bar: student.cgpa / 10 * 100,
                color: "oklch(0.50 0.22 261)"
              },
              {
                label: "Aptitude Score",
                value: `${student.aptitude_score}/100`,
                bar: student.aptitude_score,
                color: "oklch(0.60 0.16 200)"
              },
              {
                label: "Programming",
                value: `${student.programming_score}/100`,
                bar: student.programming_score,
                color: "oklch(0.58 0.18 142)"
              }
            ].map(({ label, value, bar, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: value })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-border rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${bar}%` },
                  transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
                  className: "h-full rounded-full",
                  style: { background: color }
                }
              ) })
            ] }, label)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mt-0.5", children: student.department })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Programme" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mt-0.5", children: student.programme })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Batch" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mt-0.5", children: student.batch })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Section" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mt-0.5", children: student.section })
              ] })
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  StudentDashboard as default
};
