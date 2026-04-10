import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, U as Users, m as mockStudents, B as Building2, a as mockCompanies, b as mockApplications, F as FileText, d as cn, C as ChartColumn, Z as Zap, S as Settings, L as Link, e as monthlyTrendData, g as getDeptStats, f as getBatchStats, h as getActivityFeed, i as getPipelineFunnel } from "./index-CSqV-Tvs.js";
import { U as UserCheck, K as KPICard, A as AreaChart, P as PieChart, a as Pie } from "./KPICard-ZJTCAujo.js";
import { T as TrendingUp } from "./trending-up-Bxh-st7e.js";
import { B as Briefcase } from "./briefcase-CebdH36b.js";
import { m as motion } from "./proxy-CwEQWttt.js";
import { R as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, a as Cell, B as Bar } from "./generateCategoricalChart-C-v2pZKU.js";
import { A as Area } from "./Area-FMEm7lCb.js";
import { B as BookOpen } from "./book-open-Dy2xt3aw.js";
import { B as BarChart } from "./BarChart-DsGql0PG.js";
import { R as RefreshCw } from "./refresh-cw-CXGb4LBS.js";
import { A as Award } from "./award-mvM1f5RN.js";
import { C as ChevronDown } from "./chevron-down-DNwSYK3o.js";
import "./trending-down-DuwQ70N6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode);
const totalStudents = mockStudents.length;
const placedStudents = mockStudents.filter(
  (s) => s.placement_status === "placed"
).length;
const placementRate = (placedStudents / totalStudents * 100).toFixed(1);
const activeCompanies = mockCompanies.length;
const openPositions = mockCompanies.reduce((a, c) => a + c.open_positions, 0);
const totalApplications = mockApplications.length;
const sparklineBase = [12, 18, 15, 22, 25, 28, 20, 30, 32, 35, 38, 42];
const TIER_COLORS = [
  "oklch(0.50 0.22 261)",
  "oklch(0.60 0.16 200)",
  "oklch(0.55 0.20 280)"
];
const tierDist = [1, 2, 3].map((t) => ({
  name: `Tier ${t}`,
  value: mockCompanies.filter((c) => c.tier === t).length,
  packages: t === 1 ? "18-60 LPA" : t === 2 ? "6-15 LPA" : "4-7 LPA"
}));
function DeptTable() {
  const [sortKey, setSortKey] = reactExports.useState("placement_rate");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const data = getDeptStats();
  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "desc" ? bv - av : av - bv;
    }
    return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
  });
  function handleSort(key) {
    if (key === sortKey) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }
  const SortIcon = ({ k }) => {
    if (k !== sortKey) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3" });
    return sortDir === "desc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13, className: "text-primary" });
  };
  function rateColor(rate) {
    if (rate >= 70) return "text-[oklch(0.58_0.18_142)]";
    if (rate >= 40) return "text-[oklch(0.72_0.18_64)]";
    return "text-destructive";
  }
  function progressColor(rate) {
    if (rate >= 70) return "bg-[oklch(0.58_0.18_142)]";
    if (rate >= 40) return "bg-[oklch(0.72_0.18_64)]";
    return "bg-destructive";
  }
  const cols = [
    { key: "department", label: "Dept" },
    { key: "school", label: "School" },
    { key: "total", label: "Total", align: "right" },
    { key: "placed", label: "Placed", align: "right" },
    { key: "unplaced", label: "Unplaced", align: "right" },
    { key: "placement_rate", label: "Rate %", align: "right" },
    { key: "avg_cgpa", label: "Avg CGPA", align: "right" },
    { key: "top_company", label: "Top Company" },
    { key: "failure_rate", label: "Fail %", align: "right" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm data-table", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
      cols.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          onClick: () => handleSort(col.key),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") handleSort(col.key);
          },
          "aria-sort": sortKey === col.key ? sortDir === "asc" ? "ascending" : "descending" : "none",
          className: cn(
            "px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors",
            col.align === "right" ? "text-right" : "text-left"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            col.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { k: col.key })
          ] })
        },
        String(col.key)
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Progress" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: sorted.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.tr,
      {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: i * 0.05 },
        className: "hover:bg-muted/40 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-semibold text-foreground", children: row.department }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground", children: row.school }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right", children: row.total }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right text-[oklch(0.58_0.18_142)] font-medium", children: row.placed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right text-destructive", children: row.unplaced }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              className: cn(
                "px-3 py-3 text-right font-bold",
                rateColor(row.placement_rate)
              ),
              children: [
                row.placement_rate,
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right", children: row.avg_cgpa }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground truncate max-w-[120px]", children: row.top_company }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 text-right text-destructive", children: [
            row.failure_rate,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 w-28", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-border rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-full rounded-full transition-all",
                progressColor(row.placement_rate)
              ),
              style: { width: `${row.placement_rate}%` }
            }
          ) }) })
        ]
      },
      row.department
    )) })
  ] }) });
}
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
    icon: Users,
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
function ActivityFeed() {
  const [items, setItems] = reactExports.useState(getActivityFeed(12));
  const [refreshing, setRefreshing] = reactExports.useState(false);
  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setItems(getActivityFeed(12));
      setRefreshing(false);
    }, 600);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground uppercase tracking-wider", children: "Live Activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: refresh,
          className: "p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
          "aria-label": "Refresh activity feed",
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-snug truncate", children: item.message }),
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
function BatchChart() {
  const data = getBatchStats().map((b) => ({
    batch: String(b.batch),
    Placed: b.placed,
    Unplaced: b.unplaced,
    "In-Progress": b.in_progress
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data, barCategoryGap: "25%", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.9 0 0)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      XAxis,
      {
        dataKey: "batch",
        tick: { fontSize: 12, fill: "oklch(0.5 0 0)" },
        axisLine: false,
        tickLine: false
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      YAxis,
      {
        tick: { fontSize: 11, fill: "oklch(0.5 0 0)" },
        axisLine: false,
        tickLine: false
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
        dataKey: "Placed",
        fill: "oklch(0.58 0.18 142)",
        radius: [3, 3, 0, 0]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Bar,
      {
        dataKey: "In-Progress",
        fill: "oklch(0.72 0.18 64)",
        radius: [3, 3, 0, 0]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Bar,
      {
        dataKey: "Unplaced",
        fill: "oklch(0.55 0.22 25)",
        radius: [3, 3, 0, 0]
      }
    )
  ] }) });
}
function PipelineFunnel() {
  const stages = getPipelineFunnel();
  const max = Math.max(...stages.map((s) => s.count));
  const STAGE_COLORS = {
    applied: "oklch(0.65 0.22 261)",
    shortlisted: "oklch(0.60 0.20 261)",
    interviewing: "oklch(0.72 0.18 64)",
    offered: "oklch(0.60 0.16 200)",
    hired: "oklch(0.58 0.18 142)",
    rejected: "oklch(0.55 0.22 25)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between gap-2 h-32 px-2", children: stages.map((stage, i) => {
    const height = max > 0 ? stage.count / max * 100 : 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center gap-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground", children: stage.count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scaleY: 0 },
              animate: { scaleY: 1 },
              transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
              style: {
                height: `${height}%`,
                background: STAGE_COLORS[stage.stage],
                originY: 1,
                minHeight: 4
              },
              className: "w-full rounded-t-sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wide leading-tight", children: stage.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-medium text-foreground", children: [
              stage.percent,
              "%"
            ] }),
            i > 0 && stage.stage !== "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-primary", children: [
              stage.conversion,
              "% conv."
            ] })
          ] })
        ]
      },
      stage.stage
    );
  }) });
}
const QUICK_ACTIONS = [
  {
    label: "Students",
    icon: Users,
    path: "/admin/students",
    color: "oklch(0.50 0.22 261)",
    bg: "oklch(0.50 0.22 261 / 0.12)"
  },
  {
    label: "Analytics",
    icon: ChartColumn,
    path: "/admin/analytics",
    color: "oklch(0.60 0.16 200)",
    bg: "oklch(0.60 0.16 200 / 0.12)"
  },
  {
    label: "Companies",
    icon: Building2,
    path: "/admin/companies",
    color: "oklch(0.55 0.20 280)",
    bg: "oklch(0.55 0.20 280 / 0.12)"
  },
  {
    label: "Training Cell",
    icon: Zap,
    path: "/admin/users",
    color: "oklch(0.72 0.18 64)",
    bg: "oklch(0.72 0.18 64 / 0.12)"
  },
  {
    label: "Resume Editor",
    icon: BookOpen,
    path: "/admin/resume",
    color: "oklch(0.58 0.18 142)",
    bg: "oklch(0.58 0.18 142 / 0.12)"
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
    color: "oklch(0.5 0 0)",
    bg: "oklch(0.5 0 0 / 0.08)"
  }
];
function trendForView(view) {
  if (view === "quarterly") {
    const q = ["Q1", "Q2", "Q3", "Q4"];
    return q.map((qname, i) => {
      const slice = monthlyTrendData.slice(i * 3, i * 3 + 3);
      return {
        month: qname,
        applications: slice.reduce((a, d) => a + d.applications, 0),
        placements: slice.reduce((a, d) => a + d.placements, 0)
      };
    });
  }
  if (view === "weekly") {
    return monthlyTrendData.slice(0, 8).map((d, i) => ({
      month: `W${i + 1}`,
      applications: Math.round(d.applications / 4),
      placements: Math.round(d.placements / 4)
    }));
  }
  return monthlyTrendData;
}
function AdminDashboard() {
  const [trendView, setTrendView] = reactExports.useState("monthly");
  const chartData = trendForView(trendView);
  const animRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    animRef.current = true;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground font-display", children: "Placement War Room" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Real-time placement intelligence dashboard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-[oklch(0.58_0.18_142)] animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Live data" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4", children: [
      {
        title: "Total Students",
        value: totalStudents,
        icon: Users,
        color: "blue",
        trend: "up",
        trendPercent: 8,
        sparklineData: sparklineBase,
        "data-ocid": "kpi-total-students"
      },
      {
        title: "Placed Students",
        value: placedStudents,
        icon: UserCheck,
        color: "green",
        trend: "up",
        trendPercent: 12,
        sparklineData: sparklineBase.map((v) => Math.round(v * 0.6)),
        "data-ocid": "kpi-placed"
      },
      {
        title: "Placement Rate",
        value: Number(placementRate),
        suffix: "%",
        icon: TrendingUp,
        color: "cyan",
        trend: "up",
        trendPercent: 5,
        sparklineData: [50, 55, 58, 60, 63, 65, 64, 66],
        "data-ocid": "kpi-rate"
      },
      {
        title: "Active Companies",
        value: activeCompanies,
        icon: Building2,
        color: "purple",
        trend: "up",
        trendPercent: 3,
        sparklineData: [14, 15, 16, 16, 17, 18, 19, 20],
        "data-ocid": "kpi-companies"
      },
      {
        title: "Open Positions",
        value: openPositions,
        icon: Briefcase,
        color: "amber",
        trend: "neutral",
        sparklineData: [280, 310, 290, 320, 295, 340, 310, openPositions],
        "data-ocid": "kpi-positions"
      },
      {
        title: "Total Applications",
        value: totalApplications,
        icon: FileText,
        color: "blue",
        trend: "up",
        trendPercent: 18,
        sparklineData: [
          120,
          140,
          160,
          175,
          190,
          200,
          210,
          totalApplications
        ],
        "data-ocid": "kpi-applications"
      }
    ].map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.05 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { ...card })
      },
      card.title
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-12 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "xl:col-span-7 bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Monthly Placement Trend" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Applications vs Placements over time" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["weekly", "monthly", "quarterly"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setTrendView(v),
                  "data-ocid": `trend-${v}`,
                  className: cn(
                    "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth capitalize",
                    trendView === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  ),
                  children: v.charAt(0).toUpperCase() + v.slice(1, 3)
                },
                v
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "grad-apps", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "stop",
                    {
                      offset: "5%",
                      stopColor: "oklch(0.50 0.22 261)",
                      stopOpacity: 0.3
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
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "grad-place", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "stop",
                    {
                      offset: "5%",
                      stopColor: "oklch(0.58 0.18 142)",
                      stopOpacity: 0.3
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "stop",
                    {
                      offset: "95%",
                      stopColor: "oklch(0.58 0.18 142)",
                      stopOpacity: 0
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.92 0 0)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "month",
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
                  tickLine: false
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
                Area,
                {
                  type: "monotone",
                  dataKey: "applications",
                  stroke: "oklch(0.50 0.22 261)",
                  strokeWidth: 2,
                  fill: "url(#grad-apps)",
                  name: "Applications",
                  dot: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Area,
                {
                  type: "monotone",
                  dataKey: "placements",
                  stroke: "oklch(0.58 0.18 142)",
                  strokeWidth: 2,
                  fill: "url(#grad-place)",
                  name: "Placements",
                  dot: false
                }
              )
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 },
          className: "xl:col-span-5 bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Company Tier Distribution" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { width: 150, height: 150, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Pie,
                  {
                    data: tierDist,
                    dataKey: "value",
                    cx: "50%",
                    cy: "50%",
                    innerRadius: 42,
                    outerRadius: 65,
                    paddingAngle: 3,
                    children: tierDist.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Cell,
                      {
                        fill: TIER_COLORS[tierDist.indexOf(tier)]
                      },
                      tier.name
                    ))
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-3", children: tierDist.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-2.5 h-2.5 rounded-full",
                      style: { background: TIER_COLORS[i] }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: t.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
                    t.value,
                    " cos."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: t.packages })
                ] })
              ] }, t.name)) })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.18 },
        className: "bg-card border border-border rounded-xl shadow-sm overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Department Performance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Click columns to sort" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(0.58_0.18_142)]" }),
                "≥70% Good"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(0.72_0.18_64)]" }),
                "40-70% Fair"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-destructive" }),
                "<40% Risk"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DeptTable, {})
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Batch-wise Analysis" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BatchChart, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.22 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityFeed, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.25 },
        className: "bg-card border border-border rounded-xl p-5 shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Quick Actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3", children: QUICK_ACTIONS.map((action) => {
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground group-hover:text-primary transition-colors text-center", children: action.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ArrowUpRight,
                    {
                      size: 12,
                      className: "text-muted-foreground group-hover:text-primary transition-colors"
                    }
                  )
                ]
              },
              action.path
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.28 },
        className: "bg-card border border-border rounded-xl p-5 shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Application Status Pipeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Funnel: Applied → Shortlisted → Interviewing → Offered → Hired" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              totalApplications,
              " total applications"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineFunnel, {})
        ]
      }
    )
  ] });
}
export {
  AdminDashboard as default
};
