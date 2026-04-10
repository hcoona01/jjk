import KPICard from "@/components/admin/KPICard";
import {
  getActivityFeed,
  getBatchStats,
  getDeptStats,
  getPipelineFunnel,
  mockApplications,
  mockCompanies,
  mockStudents,
  monthlyTrendData,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { DeptStats } from "@/types/placement";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  RefreshCw,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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

// ─── Derived KPIs ─────────────────────────────────────────────────────────────
const totalStudents = mockStudents.length;
const placedStudents = mockStudents.filter(
  (s) => s.placement_status === "placed",
).length;
const placementRate = ((placedStudents / totalStudents) * 100).toFixed(1);
const activeCompanies = mockCompanies.length;
const openPositions = mockCompanies.reduce((a, c) => a + c.open_positions, 0);
const totalApplications = mockApplications.length;

const sparklineBase = [12, 18, 15, 22, 25, 28, 20, 30, 32, 35, 38, 42];

// ─── Pie chart colors ─────────────────────────────────────────────────────────
const TIER_COLORS = [
  "oklch(0.50 0.22 261)",
  "oklch(0.60 0.16 200)",
  "oklch(0.55 0.20 280)",
];
const tierDist = [1, 2, 3].map((t) => ({
  name: `Tier ${t}`,
  value: mockCompanies.filter((c) => c.tier === t).length,
  packages: t === 1 ? "18-60 LPA" : t === 2 ? "6-15 LPA" : "4-7 LPA",
}));

// ─── Sortable Department Table ────────────────────────────────────────────────
type SortKey = keyof DeptStats;
type SortDir = "asc" | "desc";

function DeptTable() {
  const [sortKey, setSortKey] = useState<SortKey>("placement_rate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const data = getDeptStats();

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "desc" ? bv - av : av - bv;
    }
    return sortDir === "desc"
      ? String(bv).localeCompare(String(av))
      : String(av).localeCompare(String(bv));
  });

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (k !== sortKey) return <span className="w-3" />;
    return sortDir === "desc" ? (
      <ChevronDown size={13} className="text-primary" />
    ) : (
      <ChevronUp size={13} className="text-primary" />
    );
  };

  function rateColor(rate: number) {
    if (rate >= 70) return "text-[oklch(0.58_0.18_142)]";
    if (rate >= 40) return "text-[oklch(0.72_0.18_64)]";
    return "text-destructive";
  }

  function progressColor(rate: number) {
    if (rate >= 70) return "bg-[oklch(0.58_0.18_142)]";
    if (rate >= 40) return "bg-[oklch(0.72_0.18_64)]";
    return "bg-destructive";
  }

  const cols: { key: SortKey; label: string; align?: string }[] = [
    { key: "department", label: "Dept" },
    { key: "school", label: "School" },
    { key: "total", label: "Total", align: "right" },
    { key: "placed", label: "Placed", align: "right" },
    { key: "unplaced", label: "Unplaced", align: "right" },
    { key: "placement_rate", label: "Rate %", align: "right" },
    { key: "avg_cgpa", label: "Avg CGPA", align: "right" },
    { key: "top_company", label: "Top Company" },
    { key: "failure_rate", label: "Fail %", align: "right" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm data-table">
        <thead>
          <tr className="border-b border-border">
            {cols.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                onClick={() => handleSort(col.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSort(col.key);
                }}
                aria-sort={
                  sortKey === col.key
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                className={cn(
                  "px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors",
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label} <SortIcon k={col.key} />
                </span>
              </th>
            ))}
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progress
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((row, i) => (
            <motion.tr
              key={row.department}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="hover:bg-muted/40 transition-colors"
            >
              <td className="px-3 py-3 font-semibold text-foreground">
                {row.department}
              </td>
              <td className="px-3 py-3 text-muted-foreground">{row.school}</td>
              <td className="px-3 py-3 text-right">{row.total}</td>
              <td className="px-3 py-3 text-right text-[oklch(0.58_0.18_142)] font-medium">
                {row.placed}
              </td>
              <td className="px-3 py-3 text-right text-destructive">
                {row.unplaced}
              </td>
              <td
                className={cn(
                  "px-3 py-3 text-right font-bold",
                  rateColor(row.placement_rate),
                )}
              >
                {row.placement_rate}%
              </td>
              <td className="px-3 py-3 text-right">{row.avg_cgpa}</td>
              <td className="px-3 py-3 text-muted-foreground truncate max-w-[120px]">
                {row.top_company}
              </td>
              <td className="px-3 py-3 text-right text-destructive">
                {row.failure_rate}%
              </td>
              <td className="px-3 py-3 w-28">
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      progressColor(row.placement_rate),
                    )}
                    style={{ width: `${row.placement_rate}%` }}
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Live Activity Feed ────────────────────────────────────────────────────────
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
    icon: Users,
    color: "text-[oklch(0.55_0.20_280)]",
    bg: "bg-[oklch(0.55_0.20_280)]/10",
  },
  drive: {
    icon: Building2,
    color: "text-[oklch(0.60_0.16_200)]",
    bg: "bg-[oklch(0.60_0.16_200)]/10",
  },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function ActivityFeed() {
  const [items, setItems] = useState(getActivityFeed(12));
  const [refreshing, setRefreshing] = useState(false);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setItems(getActivityFeed(12));
      setRefreshing(false);
    }, 600);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Live Activity
        </h3>
        <button
          type="button"
          onClick={refresh}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Refresh activity feed"
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
                <p className="text-xs text-foreground leading-snug truncate">
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

// ─── Batch Chart ──────────────────────────────────────────────────────────────
function BatchChart() {
  const data = getBatchStats().map((b) => ({
    batch: String(b.batch),
    Placed: b.placed,
    Unplaced: b.unplaced,
    "In-Progress": b.in_progress,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
        <XAxis
          dataKey="batch"
          tick={{ fontSize: 12, fill: "oklch(0.5 0 0)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
          axisLine={false}
          tickLine={false}
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
          dataKey="Placed"
          fill="oklch(0.58 0.18 142)"
          radius={[3, 3, 0, 0]}
        />
        <Bar
          dataKey="In-Progress"
          fill="oklch(0.72 0.18 64)"
          radius={[3, 3, 0, 0]}
        />
        <Bar
          dataKey="Unplaced"
          fill="oklch(0.55 0.22 25)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Pipeline Funnel ──────────────────────────────────────────────────────────
function PipelineFunnel() {
  const stages = getPipelineFunnel();
  const max = Math.max(...stages.map((s) => s.count));
  const STAGE_COLORS: Record<string, string> = {
    applied: "oklch(0.65 0.22 261)",
    shortlisted: "oklch(0.60 0.20 261)",
    interviewing: "oklch(0.72 0.18 64)",
    offered: "oklch(0.60 0.16 200)",
    hired: "oklch(0.58 0.18 142)",
    rejected: "oklch(0.55 0.22 25)",
  };

  return (
    <div className="flex items-end justify-between gap-2 h-32 px-2">
      {stages.map((stage, i) => {
        const height = max > 0 ? (stage.count / max) * 100 : 0;
        return (
          <div
            key={stage.stage}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <span className="text-[10px] font-bold text-foreground">
              {stage.count}
            </span>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              style={{
                height: `${height}%`,
                background: STAGE_COLORS[stage.stage],
                originY: 1,
                minHeight: 4,
              }}
              className="w-full rounded-t-sm"
            />
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide leading-tight">
                {stage.label}
              </p>
              <p className="text-[10px] font-medium text-foreground">
                {stage.percent}%
              </p>
              {i > 0 && stage.stage !== "rejected" && (
                <p className="text-[9px] text-primary">
                  {stage.conversion}% conv.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: "Students",
    icon: Users,
    path: "/admin/students",
    color: "oklch(0.50 0.22 261)",
    bg: "oklch(0.50 0.22 261 / 0.12)",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
    color: "oklch(0.60 0.16 200)",
    bg: "oklch(0.60 0.16 200 / 0.12)",
  },
  {
    label: "Companies",
    icon: Building2,
    path: "/admin/companies",
    color: "oklch(0.55 0.20 280)",
    bg: "oklch(0.55 0.20 280 / 0.12)",
  },
  {
    label: "Training Cell",
    icon: Zap,
    path: "/admin/users",
    color: "oklch(0.72 0.18 64)",
    bg: "oklch(0.72 0.18 64 / 0.12)",
  },
  {
    label: "Resume Editor",
    icon: BookOpen,
    path: "/admin/resume",
    color: "oklch(0.58 0.18 142)",
    bg: "oklch(0.58 0.18 142 / 0.12)",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
    color: "oklch(0.5 0 0)",
    bg: "oklch(0.5 0 0 / 0.08)",
  },
];

// ─── View Toggle ──────────────────────────────────────────────────────────────
type TrendView = "monthly" | "weekly" | "quarterly";

function trendForView(view: TrendView) {
  if (view === "quarterly") {
    const q = ["Q1", "Q2", "Q3", "Q4"];
    return q.map((qname, i) => {
      const slice = monthlyTrendData.slice(i * 3, i * 3 + 3);
      return {
        month: qname,
        applications: slice.reduce((a, d) => a + d.applications, 0),
        placements: slice.reduce((a, d) => a + d.placements, 0),
      };
    });
  }
  if (view === "weekly") {
    return monthlyTrendData.slice(0, 8).map((d, i) => ({
      month: `W${i + 1}`,
      applications: Math.round(d.applications / 4),
      placements: Math.round(d.placements / 4),
    }));
  }
  return monthlyTrendData;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [trendView, setTrendView] = useState<TrendView>("monthly");
  const chartData = trendForView(trendView);

  const animRef = useRef(false);
  useEffect(() => {
    animRef.current = true;
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Placement War Room
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time placement intelligence dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.18_142)] animate-pulse" />
          <span className="text-xs text-muted-foreground">Live data</span>
        </div>
      </div>

      {/* Row 1 — KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            title: "Total Students",
            value: totalStudents,
            icon: Users,
            color: "blue" as const,
            trend: "up" as const,
            trendPercent: 8,
            sparklineData: sparklineBase,
            "data-ocid": "kpi-total-students",
          },
          {
            title: "Placed Students",
            value: placedStudents,
            icon: UserCheck,
            color: "green" as const,
            trend: "up" as const,
            trendPercent: 12,
            sparklineData: sparklineBase.map((v) => Math.round(v * 0.6)),
            "data-ocid": "kpi-placed",
          },
          {
            title: "Placement Rate",
            value: Number(placementRate),
            suffix: "%",
            icon: TrendingUp,
            color: "cyan" as const,
            trend: "up" as const,
            trendPercent: 5,
            sparklineData: [50, 55, 58, 60, 63, 65, 64, 66],
            "data-ocid": "kpi-rate",
          },
          {
            title: "Active Companies",
            value: activeCompanies,
            icon: Building2,
            color: "purple" as const,
            trend: "up" as const,
            trendPercent: 3,
            sparklineData: [14, 15, 16, 16, 17, 18, 19, 20],
            "data-ocid": "kpi-companies",
          },
          {
            title: "Open Positions",
            value: openPositions,
            icon: Briefcase,
            color: "amber" as const,
            trend: "neutral" as const,
            sparklineData: [280, 310, 290, 320, 295, 340, 310, openPositions],
            "data-ocid": "kpi-positions",
          },
          {
            title: "Total Applications",
            value: totalApplications,
            icon: FileText,
            color: "blue" as const,
            trend: "up" as const,
            trendPercent: 18,
            sparklineData: [
              120,
              140,
              160,
              175,
              190,
              200,
              210,
              totalApplications,
            ],
            "data-ocid": "kpi-applications",
          },
        ].map((card) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <KPICard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Row 2 — Trend + Pie */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-7 bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Monthly Placement Trend
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Applications vs Placements over time
              </p>
            </div>
            <div className="flex gap-1">
              {(["weekly", "monthly", "quarterly"] as TrendView[]).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setTrendView(v)}
                  data-ocid={`trend-${v}`}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth capitalize",
                    trendView === v
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1, 3)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad-apps" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.50 0.22 261)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.50 0.22 261)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="grad-place" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.58 0.18 142)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.58 0.18 142)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
                axisLine={false}
                tickLine={false}
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
              <Area
                type="monotone"
                dataKey="applications"
                stroke="oklch(0.50 0.22 261)"
                strokeWidth={2}
                fill="url(#grad-apps)"
                name="Applications"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="placements"
                stroke="oklch(0.58 0.18 142)"
                strokeWidth={2}
                fill="url(#grad-place)"
                name="Placements"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Company Tier Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-5 bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Company Tier Distribution
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <PieChart width={150} height={150}>
                <Pie
                  data={tierDist}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {tierDist.map((tier) => (
                    <Cell
                      key={tier.name}
                      fill={TIER_COLORS[tierDist.indexOf(tier)]}
                    />
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
              {tierDist.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: TIER_COLORS[i] }}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {t.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-foreground">
                      {t.value} cos.
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {t.packages}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3 — Department Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Department Performance
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click columns to sort
            </p>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.58_0.18_142)]" />
              ≥70% Good
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_64)]" />
              40-70% Fair
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              &lt;40% Risk
            </span>
          </div>
        </div>
        <DeptTable />
      </motion.div>

      {/* Row 4 — Batch Chart + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Batch-wise Analysis
          </h3>
          <BatchChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <ActivityFeed />
        </motion.div>
      </div>

      {/* Row 5 — Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-xl p-5 shadow-sm"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action) => {
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
                <ArrowUpRight
                  size={12}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Row 6 — Application Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="bg-card border border-border rounded-xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Application Status Pipeline
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Funnel: Applied → Shortlisted → Interviewing → Offered → Hired
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {totalApplications} total applications
          </span>
        </div>
        <PipelineFunnel />
      </motion.div>
    </div>
  );
}
