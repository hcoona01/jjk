import {
  DEPARTMENTS,
  SCHOOLS,
  getAtRiskStudents,
  getCGPAPlacementData,
  getDeptStats,
  getPackageDistribution,
  getSectionStats,
  getSkillGapData,
  getTopCompanies,
  mockCompanies,
  mockStudents,
  monthlyTrendData,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { Department, School, Student } from "@/types/placement";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Filter,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Filter types ────────────────────────────────────────────────────────────
type DateRange = "7d" | "30d" | "quarter" | "year";

interface Filters {
  departments: Department[];
  schools: School[];
  batch: string;
  section: string;
  dateRange: DateRange;
}

// ─── Filter helpers ───────────────────────────────────────────────────────────
function applyFilters(filters: Filters): Student[] {
  return mockStudents.filter((s) => {
    if (
      filters.departments.length &&
      !filters.departments.includes(s.department)
    )
      return false;
    if (filters.schools.length && !filters.schools.includes(s.school))
      return false;
    if (filters.batch && String(s.batch) !== filters.batch) return false;
    if (filters.section && s.section !== filters.section) return false;
    return true;
  });
}

// ─── Multi-select chip toggle ─────────────────────────────────────────────────
function ChipGroup<T extends string>({
  options,
  selected,
  onChange,
  label,
}: {
  options: T[];
  selected: T[];
  onChange: (vals: T[]) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}:
      </span>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() =>
              onChange(
                active ? selected.filter((s) => s !== opt) : [...selected, opt],
              )
            }
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-full border transition-smooth",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Metric Cards Row ─────────────────────────────────────────────────────────
function MetricCards({ students }: { students: Student[] }) {
  const placed = students.filter((s) => s.placement_status === "placed");
  const unplaced = students.filter((s) => s.placement_status === "unplaced");
  const avgPkg =
    placed
      .filter((s) => s.package_lpa)
      .reduce((a, s) => a + (s.package_lpa ?? 0), 0) /
    (placed.filter((s) => s.package_lpa).length || 1);
  const highPkg = Math.max(
    0,
    ...placed.filter((s) => s.package_lpa).map((s) => s.package_lpa ?? 0),
  );
  const totalApps = mockStudents.length * 2;

  const metrics = [
    {
      label: "Total Students",
      value: students.length,
      color: "oklch(0.50 0.22 261)",
    },
    { label: "Placed", value: placed.length, color: "oklch(0.58 0.18 142)" },
    { label: "Unplaced", value: unplaced.length, color: "oklch(0.55 0.22 25)" },
    {
      label: "Placement Rate",
      value: `${students.length ? ((placed.length / students.length) * 100).toFixed(1) : 0}%`,
      color: "oklch(0.60 0.16 200)",
    },
    {
      label: "Avg Package",
      value: `${avgPkg.toFixed(1)} LPA`,
      color: "oklch(0.72 0.18 64)",
    },
    {
      label: "Highest Package",
      value: `${highPkg.toFixed(1)} LPA`,
      color: "oklch(0.55 0.20 280)",
    },
    {
      label: "Total Applications",
      value: totalApps,
      color: "oklch(0.65 0.19 137)",
    },
    {
      label: "Conversion Rate",
      value: `${((placed.length / (totalApps || 1)) * 100).toFixed(1)}%`,
      color: "oklch(0.60 0.16 200)",
    },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {metrics.map((m) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 bg-card border border-border rounded-xl p-4 min-w-[140px]"
          data-ocid={`metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
          style={{ borderTopColor: m.color, borderTopWidth: 2 }}
        >
          <p className="text-xs text-muted-foreground font-medium mb-1">
            {m.label}
          </p>
          <p className="text-xl font-bold text-foreground">{m.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Department stacked bar + table ───────────────────────────────────────────
function DeptComparison({ deptFilter }: { deptFilter: Department[] }) {
  const allStats = getDeptStats();
  const stats = deptFilter.length
    ? allStats.filter((d) => deptFilter.includes(d.department))
    : allStats;

  const chartData = stats.map((d) => ({
    dept: d.department,
    Placed: d.placed,
    "In-Progress": d.in_progress,
    Unplaced: d.unplaced,
  }));

  return (
    <div className="space-y-5">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
          <XAxis
            dataKey="dept"
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
          />
          <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
          <Bar
            dataKey="Placed"
            fill="oklch(0.58 0.18 142)"
            stackId="a"
            radius={[0, 0, 0, 0]}
          />
          <Bar dataKey="In-Progress" fill="oklch(0.72 0.18 64)" stackId="a" />
          <Bar
            dataKey="Unplaced"
            fill="oklch(0.55 0.22 25)"
            stackId="a"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="overflow-x-auto">
        <table className="w-full text-xs data-table">
          <thead>
            <tr className="border-b border-border">
              {[
                "Dept",
                "School",
                "Total",
                "Placed",
                "Rate%",
                "Avg CGPA",
                "Avg Aptitude",
                "Avg Prog.",
                "Fail%",
                "Top Skills",
              ].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stats.map((d) => (
              <tr
                key={d.department}
                className="hover:bg-muted/40 transition-colors"
              >
                <td className="px-3 py-2.5 font-semibold text-foreground">
                  {d.department}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {d.school}
                </td>
                <td className="px-3 py-2.5">{d.total}</td>
                <td className="px-3 py-2.5 text-[oklch(0.58_0.18_142)] font-medium">
                  {d.placed}
                </td>
                <td
                  className={cn(
                    "px-3 py-2.5 font-bold",
                    d.placement_rate >= 70
                      ? "text-[oklch(0.58_0.18_142)]"
                      : d.placement_rate >= 40
                        ? "text-[oklch(0.72_0.18_64)]"
                        : "text-destructive",
                  )}
                >
                  {d.placement_rate}%
                </td>
                <td className="px-3 py-2.5">{d.avg_cgpa}</td>
                <td className="px-3 py-2.5">{d.avg_aptitude}</td>
                <td className="px-3 py-2.5">{d.avg_programming}</td>
                <td className="px-3 py-2.5 text-destructive">
                  {d.failure_rate}%
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {d.top_skills.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Failure Analysis ─────────────────────────────────────────────────────────
function FailureAnalysis() {
  const cgpaData = getCGPAPlacementData();
  const atRisk = getAtRiskStudents(10);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* CGPA vs Placement Rate */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Placement Rate by CGPA Range
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cgpaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(v: number) => [`${v}%`, "Placement Rate"]}
            />
            <Bar
              dataKey="rate"
              fill="oklch(0.50 0.22 261)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* At-Risk Students */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-[oklch(0.72_0.18_64)]" />
          At-Risk Students (Unplaced)
        </h4>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {atRisk.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors"
              data-ocid={`at-risk-${i}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-muted-foreground w-5">
                  {i + 1}.
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {s.department} · CGPA {s.cgpa}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-bold text-destructive">
                  {s.risk_score.toFixed(0)} risk
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Apt:{s.aptitude_score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section Drill-Down ───────────────────────────────────────────────────────
function SectionDrillDown() {
  const [selectedDept, setSelectedDept] = useState<Department>("CSE");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const sections = getSectionStats(selectedDept);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Select Department:
        </span>
        {DEPARTMENTS.map((d) => (
          <button
            type="button"
            key={d}
            onClick={() => {
              setSelectedDept(d);
              setExpandedSection(null);
            }}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-smooth",
              selectedDept === d
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50",
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sections.map((sec) => (
          <div
            key={sec.section}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedSection(
                  expandedSection === sec.section ? null : sec.section,
                )
              }
              className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/40 transition-colors"
              data-ocid={`section-${sec.section}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">
                  {sec.section}
                </span>
                <span className="text-xs text-muted-foreground">
                  {sec.total} students
                </span>
                <span className="text-xs text-[oklch(0.58_0.18_142)]">
                  {sec.placed} placed
                </span>
                <span
                  className={cn(
                    "text-xs font-bold",
                    sec.placement_rate >= 70
                      ? "text-[oklch(0.58_0.18_142)]"
                      : sec.placement_rate >= 40
                        ? "text-[oklch(0.72_0.18_64)]"
                        : "text-destructive",
                  )}
                >
                  {sec.placement_rate}%
                </span>
                <span className="text-xs text-muted-foreground">
                  Avg CGPA: {sec.avg_cgpa}
                </span>
              </div>
              {expandedSection === sec.section ? (
                <ChevronDown size={14} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={14} className="text-muted-foreground" />
              )}
            </button>

            {expandedSection === sec.section && sec.students.length > 0 && (
              <div className="border-t border-border overflow-x-auto">
                <table className="w-full text-xs data-table">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {[
                        "Name",
                        "CGPA",
                        "Aptitude",
                        "Programming",
                        "Skills",
                        "Status",
                        "Company",
                      ].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-3 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sec.students.map((s: Student) => (
                      <tr
                        key={s.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-3 py-2 font-medium text-foreground">
                          {s.name}
                        </td>
                        <td className="px-3 py-2">{s.cgpa}</td>
                        <td className="px-3 py-2">{s.aptitude_score}</td>
                        <td className="px-3 py-2">{s.programming_score}</td>
                        <td className="px-3 py-2 text-muted-foreground max-w-[150px] truncate">
                          {s.skills.slice(0, 2).join(", ")}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-medium",
                              s.placement_status === "placed"
                                ? "status-placed"
                                : s.placement_status === "in-progress"
                                  ? "status-in-progress"
                                  : "status-unplaced",
                            )}
                          >
                            {s.placement_status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {s.placed_at ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Company Analytics ────────────────────────────────────────────────────────
const PKG_COLORS = [
  "oklch(0.55 0.22 25)",
  "oklch(0.72 0.18 64)",
  "oklch(0.65 0.22 261)",
  "oklch(0.60 0.16 200)",
  "oklch(0.58 0.18 142)",
];

function CompanyAnalytics() {
  const topCompanies = getTopCompanies(8);
  const pkgDist = getPackageDistribution();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Top Companies */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Top Hiring Companies
        </h4>
        <div className="space-y-2">
          {topCompanies.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-3 px-3 py-2.5 bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors"
            >
              <span className="text-xs font-bold text-muted-foreground w-5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {c.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {c.departments.join(", ")}
                </p>
              </div>
              <span className="text-xs font-medium text-primary">
                {c.hired} hired
              </span>
              <span className="text-xs text-muted-foreground">
                {c.avg_package} LPA
              </span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-medium",
                  c.tier === 1
                    ? "bg-primary/15 text-primary"
                    : c.tier === 2
                      ? "bg-[oklch(0.60_0.16_200)]/15 text-[oklch(0.60_0.16_200)]"
                      : "bg-muted text-muted-foreground",
                )}
              >
                T{c.tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Package Distribution */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Package Distribution
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={pkgDist}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
            <XAxis
              dataKey="range"
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
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students">
              {pkgDist.map((entry, i) => (
                <Cell
                  key={entry.range}
                  fill={PKG_COLORS[i % PKG_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Skill Gap Chart ──────────────────────────────────────────────────────────
function SkillGapChart() {
  const data = getSkillGapData();
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">
        Comparing skills companies demand vs skills students have. Larger gaps =
        training priorities.
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" barCategoryGap="25%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.92 0 0)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="skill"
            tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
          <Bar
            dataKey="demand"
            fill="oklch(0.50 0.22 261)"
            name="Company Demand"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="supply"
            fill="oklch(0.58 0.18 142)"
            name="Student Supply"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
const MEDAL_COLORS = [
  "oklch(0.72 0.18 64)",
  "oklch(0.65 0 0)",
  "oklch(0.55 0.20 50)",
];

function Leaderboard() {
  const top10 = mockStudents
    .filter((s) => s.placement_status === "placed" && s.package_lpa)
    .sort((a, b) => (b.package_lpa ?? 0) - (a.package_lpa ?? 0))
    .slice(0, 10);

  return (
    <div className="space-y-2">
      {top10.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary/40 transition-smooth"
          data-ocid={`leaderboard-${i + 1}`}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
            style={{
              background:
                i < 3 ? `${MEDAL_COLORS[i]}20` : "oklch(0.9 0 0 / 0.3)",
              color: i < 3 ? MEDAL_COLORS[i] : "oklch(0.5 0 0)",
            }}
          >
            {i < 3 ? <Trophy size={15} /> : i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {s.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {s.department} · CGPA {s.cgpa}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-primary">
              {s.package_lpa} LPA
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[100px]">
              {s.placed_at}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Trend Line Chart ─────────────────────────────────────────────────────────
function TrendChart({ deptFilter }: { deptFilter: Department[] }) {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  const baseData =
    view === "weekly"
      ? monthlyTrendData.slice(0, 8).map((d, i) => ({
          ...d,
          month: `W${i + 1}`,
          applications: Math.round(d.applications / 4),
          placements: Math.round(d.placements / 4),
        }))
      : monthlyTrendData;

  const DEPT_COLORS: Record<Department, string> = {
    CSE: "oklch(0.50 0.22 261)",
    IT: "oklch(0.60 0.16 200)",
    ECE: "oklch(0.55 0.20 280)",
    "AI-ML": "oklch(0.72 0.18 64)",
    CE: "oklch(0.58 0.18 142)",
    ME: "oklch(0.55 0.22 25)",
  };

  const activeDepts = deptFilter.length
    ? deptFilter
    : (["CSE", "IT"] as Department[]);

  // Build per-department trend data
  const deptTrendData = baseData.map((point, idx) => {
    const row: Record<string, number | string> = { month: point.month };
    for (const dept of activeDepts) {
      // Vary by dept to make lines look different
      const offset = ["CSE", "IT", "ECE", "AI-ML", "CE", "ME"].indexOf(dept);
      row[dept] = Math.max(
        1,
        Math.round(
          point.placements * (0.6 + offset * 0.08) + Math.sin(idx + offset) * 2,
        ),
      );
    }
    return row;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          Placement trend per department over time
        </p>
        <div className="flex gap-1">
          {(["monthly", "weekly"] as const).map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth capitalize",
                view === v
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
        <LineChart data={deptTrendData}>
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
          />
          <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
          {activeDepts.map((dept) => (
            <Line
              key={dept}
              type="monotone"
              dataKey={dept}
              stroke={DEPT_COLORS[dept]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main Analytics Page ──────────────────────────────────────────────────────
export default function AdminAnalytics() {
  const [filters, setFilters] = useState<Filters>({
    departments: [],
    schools: [],
    batch: "",
    section: "",
    dateRange: "year",
  });
  const [showFilters, setShowFilters] = useState(false);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({
      departments: [],
      schools: [],
      batch: "",
      section: "",
      dateRange: "year",
    });
  }

  const hasFilters =
    filters.departments.length ||
    filters.schools.length ||
    filters.batch ||
    filters.section ||
    filters.dateRange !== "year";
  const filteredStudents = useMemo(() => applyFilters(filters), [filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-foreground font-display">
                Analytics Deep-Dive
              </h1>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {filteredStudents.length} students
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  data-ocid="clear-filters"
                >
                  <X size={12} /> Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilters((f) => !f)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-smooth",
                  showFilters
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
                data-ocid="toggle-filters"
              >
                <Filter size={12} /> Filters {hasFilters ? "(active)" : ""}
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pt-2"
            >
              <ChipGroup
                options={DEPARTMENTS}
                selected={filters.departments}
                onChange={(v) => updateFilter("departments", v)}
                label="Dept"
              />
              <ChipGroup
                options={SCHOOLS}
                selected={filters.schools}
                onChange={(v) => updateFilter("schools", v)}
                label="School"
              />
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Batch:
                  </span>
                  <select
                    value={filters.batch}
                    onChange={(e) => updateFilter("batch", e.target.value)}
                    className="text-xs bg-card border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">All</option>
                    {[2021, 2022, 2023, 2024].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Date:
                  </span>
                  <div className="flex gap-1">
                    {(["7d", "30d", "quarter", "year"] as DateRange[]).map(
                      (d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => updateFilter("dateRange", d)}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth",
                            filters.dateRange === d
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {d}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Row 1 — Metric Cards */}
        <MetricCards students={filteredStudents} />

        {/* Row 2 — Trend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Placement Trend Over Time
          </h3>
          <TrendChart deptFilter={filters.departments} />
        </motion.div>

        {/* Row 3 — Department Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Department Comparison
          </h3>
          <DeptComparison deptFilter={filters.departments} />
        </motion.div>

        {/* Row 4 — Failure Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-[oklch(0.72_0.18_64)]" />{" "}
            Failure Analysis
          </h3>
          <FailureAnalysis />
        </motion.div>

        {/* Row 5 — Section Drill-Down */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Section-Level Drill-Down
          </h3>
          <SectionDrillDown />
        </motion.div>

        {/* Row 6 — Company Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Company Analytics
          </h3>
          <CompanyAnalytics />
        </motion.div>

        {/* Row 7 — Skill Gap */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Skill Demand vs Supply
          </h3>
          <SkillGapChart />
        </motion.div>

        {/* Row 8 — Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-[oklch(0.72_0.18_64)]" /> Top 10
            Students by Package
          </h3>
          <Leaderboard />
        </motion.div>
      </div>
    </div>
  );
}
