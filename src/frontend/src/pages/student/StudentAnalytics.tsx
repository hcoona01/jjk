import { Badge } from "@/components/ui/badge";
import { getCGPAPlacementData, mockStudents } from "@/lib/mockData";
import { useStudentData } from "@/lib/studentData";
import type { Department } from "@/types/placement";
import {
  Award,
  BarChart3,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Colors ───────────────────────────────────────────────────────────────────
const BLUE = "oklch(0.65 0.22 261)";
const GOLD = "oklch(0.78 0.18 64)";
const GREEN = "oklch(0.68 0.18 142)";
const RED = "oklch(0.65 0.22 25)";
const TEAL = "oklch(0.65 0.16 200)";
const MUTED_GRID = "oklch(0.35 0.02 261)";
const TOOLTIP_BG = "oklch(0.18 0.02 261)";
const TOOLTIP_BORDER = "oklch(0.3 0.04 261)";
const TOOLTIP_TEXT = "oklch(0.9 0.02 261)";

const tooltipStyle = {
  background: TOOLTIP_BG,
  border: `1px solid ${TOOLTIP_BORDER}`,
  borderRadius: "8px",
  color: TOOLTIP_TEXT,
  fontSize: "12px",
};

const axisTickStyle = { fill: "oklch(0.6 0.02 261)", fontSize: 11 };

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  color: string;
  icon: React.ElementType;
  delay: number;
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
  delay,
  trend,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="kpi-card flex flex-col gap-2"
      data-ocid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}22` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        {trend && (
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded-full"
            style={{
              background:
                trend === "up"
                  ? `${GREEN}22`
                  : trend === "down"
                    ? `${RED}22`
                    : `${MUTED_GRID}33`,
              color:
                trend === "up"
                  ? GREEN
                  : trend === "down"
                    ? RED
                    : "oklch(0.6 0.02 261)",
            }}
          >
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {sub && (
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Custom scatter dot ───────────────────────────────────────────────────────

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: { isYou?: boolean };
}

function ScatterDot({ cx = 0, cy = 0, payload }: DotProps) {
  if (payload?.isYou) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={9} fill={GOLD} fillOpacity={0.25} />
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill={GOLD}
          stroke="oklch(0.9 0 0)"
          strokeWidth={1.5}
        />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={4} fill={BLUE} fillOpacity={0.6} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentAnalytics() {
  const { student, stats } = useStudentData();
  const [batchFilter, setBatchFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("batch") ?? "all";
    }
    return "all";
  });

  const handleBatchFilter = (val: string) => {
    setBatchFilter(val);
    const url = new URL(window.location.href);
    if (val === "all") url.searchParams.delete("batch");
    else url.searchParams.set("batch", val);
    window.history.replaceState({}, "", url.toString());
  };
  const peerBenchmark = stats?.peer_benchmark;

  // ─── Dept peers (with optional batch filter) ─────────────────────────────
  const deptPeers = useMemo(() => {
    if (!student) return [];
    let peers = mockStudents.filter((s) => s.department === student.department);
    if (batchFilter !== "all") {
      peers = peers.filter((s) => String(s.batch) === batchFilter);
    }
    return peers;
  }, [student, batchFilter]);

  // ─── Scatter data ────────────────────────────────────────────────────────
  const scatterData = useMemo(() => {
    if (!student) return [];
    return deptPeers.map((s) => ({
      cgpa: s.cgpa,
      package: s.package_lpa ?? 0,
      name: s.name,
      status: s.placement_status,
      isYou: s.id === student.id,
    }));
  }, [deptPeers, student]);

  const avgCGPA = useMemo(
    () =>
      deptPeers.length
        ? deptPeers.reduce((a, s) => a + s.cgpa, 0) / deptPeers.length
        : 0,
    [deptPeers],
  );
  const avgPackage = useMemo(() => {
    const placed = deptPeers.filter((s) => s.package_lpa);
    return placed.length
      ? placed.reduce((a, s) => a + (s.package_lpa ?? 0), 0) / placed.length
      : 0;
  }, [deptPeers]);

  // ─── CGPA vs placement rate ───────────────────────────────────────────────
  const cgpaPlacementData = useMemo(() => {
    const raw = getCGPAPlacementData();
    if (!student) return raw.map((r) => ({ ...r, highlight: false }));
    return raw.map((r) => {
      const inRange =
        student.cgpa >= parseRange(r.range).min &&
        student.cgpa < parseRange(r.range).max;
      return { ...r, highlight: inRange };
    });
  }, [student]);

  // ─── Skill gap (your skills vs placed peers) ─────────────────────────────
  const skillGapData = useMemo(() => {
    if (!student) return [];
    const dept = student.department as Department;
    const deptSkillPool: Record<string, string[]> = {
      CSE: [
        "React",
        "Node.js",
        "Python",
        "Java",
        "SQL",
        "AWS",
        "Docker",
        "TypeScript",
      ],
      IT: ["Python", "Django", "SQL", "Linux", "Networking", "Azure", "PHP"],
      ECE: ["C++", "MATLAB", "VLSI", "Embedded C", "IoT", "Signal Processing"],
      "AI-ML": [
        "Python",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "NLP",
        "Deep Learning",
        "R",
      ],
      CE: ["AutoCAD", "STAAD Pro", "Revit", "Project Management", "GIS"],
      ME: [
        "SolidWorks",
        "ANSYS",
        "AutoCAD",
        "CNC",
        "Manufacturing",
        "Thermodynamics",
      ],
    };
    const allSkills = deptSkillPool[dept] ?? [];

    const placedStudents = mockStudents.filter(
      (s) => s.department === dept && s.placement_status === "placed",
    );
    const placedSkillCounts: Record<string, number> = {};
    for (const ps of placedStudents) {
      for (const sk of ps.skills)
        placedSkillCounts[sk] = (placedSkillCounts[sk] ?? 0) + 1;
    }
    const totalPlaced = placedStudents.length || 1;

    return allSkills.map((skill) => ({
      skill: skill.length > 10 ? `${skill.slice(0, 10)}…` : skill,
      fullSkill: skill,
      placedRate: Math.round(
        ((placedSkillCounts[skill] ?? 0) / totalPlaced) * 100,
      ),
      youHave: student.skills.includes(skill) ? 100 : 0,
    }));
  }, [student]);

  // ─── Dept leaderboard ────────────────────────────────────────────────────
  const leaderboard = useMemo(() => {
    if (!student) return [];
    return mockStudents
      .filter((s) => s.department === student.department)
      .sort((a, b) => b.cgpa - a.cgpa)
      .slice(0, 10)
      .map((s, i) => ({ ...s, rank: i + 1 }));
  }, [student]);

  if (!student || !stats || !peerBenchmark) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <GraduationCap size={48} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">
          Please log in to view analytics.
        </p>
      </div>
    );
  }

  const deptPlacementRate = peerBenchmark.dept_placement_rate;
  const cgpaGap = +(student.cgpa - peerBenchmark.dept_avg_cgpa).toFixed(2);
  const pkgGap =
    student.package_lpa && peerBenchmark.dept_avg_package
      ? +(student.package_lpa - peerBenchmark.dept_avg_package).toFixed(1)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-6 py-7 space-y-7 max-w-7xl mx-auto"
    >
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Peer Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {student.name} · {student.department} · Batch {student.batch}
          </p>
        </div>
        {/* Batch filter synced to URL */}
        <div
          className="flex items-center gap-2 bg-card border border-border rounded-lg p-1"
          data-ocid="batch-filter"
        >
          {["all", "2021", "2022", "2023", "2024"].map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => handleBatchFilter(b)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-smooth"
              style={{
                background: batchFilter === b ? BLUE : "transparent",
                color:
                  batchFilter === b ? "oklch(0.12 0 0)" : "oklch(0.6 0.02 261)",
              }}
              data-ocid={`batch-filter-${b}`}
            >
              {b === "all" ? "All Batches" : b}
            </button>
          ))}
        </div>
      </div>

      {/* ── 1. Summary Metric Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Your CGPA vs Dept Avg"
          value={student.cgpa.toFixed(1)}
          sub={`Dept avg: ${peerBenchmark.dept_avg_cgpa.toFixed(2)} (${cgpaGap >= 0 ? "+" : ""}${cgpaGap})`}
          trend={cgpaGap > 0 ? "up" : cgpaGap < 0 ? "down" : "neutral"}
          color={BLUE}
          icon={GraduationCap}
          delay={0.05}
        />
        <StatCard
          label={
            student.package_lpa ? "Package vs Dept Avg" : "Dept Avg Package"
          }
          value={student.package_lpa ? `₹${student.package_lpa} LPA` : "—"}
          sub={
            pkgGap !== null
              ? `Dept avg: ₹${peerBenchmark.dept_avg_package} LPA (${pkgGap >= 0 ? "+" : ""}${pkgGap})`
              : peerBenchmark.dept_avg_package
                ? `Dept avg: ₹${peerBenchmark.dept_avg_package} LPA`
                : "Not placed yet"
          }
          trend={pkgGap !== null ? (pkgGap >= 0 ? "up" : "down") : "neutral"}
          color={GOLD}
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          label="Dept Placement Rate"
          value={`${deptPlacementRate.toFixed(1)}%`}
          sub={`${student.department} — ${peerBenchmark.batch_size} students`}
          trend="neutral"
          color={GREEN}
          icon={Users}
          delay={0.15}
        />
        <StatCard
          label="Your CGPA Percentile"
          value={`${peerBenchmark.dept_cgpa_percentile.toFixed(0)}th`}
          sub={`Top ${Math.max(1, 100 - peerBenchmark.dept_cgpa_percentile).toFixed(0)}% in ${student.department}`}
          trend={
            peerBenchmark.dept_cgpa_percentile >= 70
              ? "up"
              : peerBenchmark.dept_cgpa_percentile < 40
                ? "down"
                : "neutral"
          }
          color={TEAL}
          icon={Target}
          delay={0.2}
        />
      </div>

      {/* ── 2. Scatter Plot ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5"
        data-ocid="scatter-chart"
      >
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={14} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            CGPA vs Package — {student.department} Peers
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Each dot is a classmate. Your position is highlighted in gold.
        </p>
        <div className="flex items-center gap-6 mb-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg role="img" aria-label="Peer dot" width="12" height="12">
              <title>Peer dot</title>
              <circle cx="6" cy="6" r="5" fill={BLUE} fillOpacity={0.6} />
            </svg>
            Peers
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg role="img" aria-label="Your dot" width="16" height="16">
              <title>Your dot</title>
              <circle cx="8" cy="8" r="7" fill={GOLD} fillOpacity={0.3} />
              <circle cx="8" cy="8" r="4" fill={GOLD} />
            </svg>
            You
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg role="img" aria-label="Average line" width="14" height="4">
              <title>Average line</title>
              <line
                x1="0"
                y1="2"
                x2="14"
                y2="2"
                stroke={TEAL}
                strokeDasharray="3 2"
                strokeWidth="1.5"
              />
            </svg>
            Dept averages
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={MUTED_GRID}
              opacity={0.4}
            />
            <XAxis
              dataKey="cgpa"
              name="CGPA"
              type="number"
              domain={[5, 10]}
              tick={axisTickStyle}
              axisLine={false}
              tickLine={false}
              label={{
                value: "CGPA",
                position: "insideBottomRight",
                offset: -4,
                fill: "oklch(0.5 0.02 261)",
                fontSize: 11,
              }}
            />
            <YAxis
              dataKey="package"
              name="Package (LPA)"
              type="number"
              tick={axisTickStyle}
              axisLine={false}
              tickLine={false}
              label={{
                value: "₹ LPA",
                angle: -90,
                position: "insideLeft",
                fill: "oklch(0.5 0.02 261)",
                fontSize: 11,
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={tooltipStyle}
              formatter={(value: number, name: string) =>
                name === "CGPA"
                  ? [value.toFixed(1), "CGPA"]
                  : [`₹${value} LPA`, "Package"]
              }
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload as {
                  name: string;
                  cgpa: number;
                  package: number;
                  status: string;
                  isYou: boolean;
                };
                return (
                  <div style={tooltipStyle} className="px-3 py-2 rounded-lg">
                    {d.isYou && (
                      <p
                        className="text-xs font-bold mb-1"
                        style={{ color: GOLD }}
                      >
                        ⭐ You
                      </p>
                    )}
                    <p
                      className="text-xs font-semibold"
                      style={{ color: TOOLTIP_TEXT }}
                    >
                      {d.name.split(" ")[0]}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.7 0.02 261)" }}
                    >
                      CGPA: {d.cgpa.toFixed(1)}
                    </p>
                    {d.package > 0 && (
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.7 0.02 261)" }}
                      >
                        Pkg: ₹{d.package} LPA
                      </p>
                    )}
                    <p
                      className="text-xs capitalize mt-0.5"
                      style={{
                        color:
                          d.status === "placed"
                            ? GREEN
                            : d.status === "in-progress"
                              ? GOLD
                              : RED,
                      }}
                    >
                      {d.status}
                    </p>
                  </div>
                );
              }}
            />
            <ReferenceLine
              x={avgCGPA}
              stroke={TEAL}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: `Avg CGPA ${avgCGPA.toFixed(1)}`,
                fill: TEAL,
                fontSize: 10,
                position: "top",
              }}
            />
            <ReferenceLine
              y={avgPackage}
              stroke={TEAL}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: `Avg ₹${avgPackage.toFixed(1)}`,
                fill: TEAL,
                fontSize: 10,
                position: "right",
              }}
            />
            <Scatter
              data={scatterData}
              shape={(props: DotProps) => <ScatterDot {...props} />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── 3 + 4. CGPA Placement Rate + Skill Gap ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CGPA vs Placement Rate */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-5"
          data-ocid="cgpa-placement-chart"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              CGPA Bracket → Placement Rate
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Your bracket ({getCGPABracket(student.cgpa)}) highlighted in gold.
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={cgpaPlacementData} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={MUTED_GRID}
                opacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="range"
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, 100]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) =>
                  name === "rate"
                    ? [`${value}%`, "Placement Rate"]
                    : [value, "Total Students"]
                }
              />
              <Legend
                formatter={(value: string) =>
                  value === "rate" ? "Placement %" : "Total Students"
                }
                wrapperStyle={{
                  fontSize: "11px",
                  color: "oklch(0.6 0.02 261)",
                }}
              />
              <Bar
                yAxisId="right"
                dataKey="total"
                name="total"
                radius={[3, 3, 0, 0]}
              >
                {cgpaPlacementData.map((entry) => (
                  <Cell
                    key={entry.range}
                    fill={entry.highlight ? `${GOLD}55` : `${BLUE}30`}
                    stroke={entry.highlight ? GOLD : BLUE}
                    strokeWidth={entry.highlight ? 1.5 : 0.5}
                  />
                ))}
              </Bar>
              <Bar
                yAxisId="left"
                dataKey="rate"
                name="rate"
                radius={[3, 3, 0, 0]}
              >
                {cgpaPlacementData.map((entry) => (
                  <Cell
                    key={entry.range}
                    fill={entry.highlight ? GOLD : BLUE}
                    fillOpacity={entry.highlight ? 1 : 0.75}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
          data-ocid="skill-gap-chart"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Skill Gap — vs Placed Peers
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Blue = % placed students with skill. Gold = skills you have.
          </p>
          <div className="flex items-center gap-6 mb-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: BLUE }}
              />
              Placed peers
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: GOLD }}
              />
              You have
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={skillGapData.slice(0, 7)}>
              <PolarGrid stroke={MUTED_GRID} />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "oklch(0.6 0.02 261)", fontSize: 10 }}
              />
              <Radar
                name="Placed Peers %"
                dataKey="placedRate"
                stroke={BLUE}
                fill={BLUE}
                fillOpacity={0.25}
              />
              <Radar
                name="You Have"
                dataKey="youHave"
                stroke={GOLD}
                fill={GOLD}
                fillOpacity={0.3}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(
                  value: number,
                  name: string,
                  props: { payload?: { fullSkill?: string } },
                ) => [
                  name === "You Have"
                    ? value === 100
                      ? "✓ Have"
                      : "✗ Missing"
                    : `${value}%`,
                  props?.payload?.fullSkill ?? name,
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Skill gap list ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-xl p-5"
        data-ocid="skill-gap-list"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={14} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Skills Breakdown — {student.department}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {skillGapData.map((item) => {
            const have = item.youHave === 100;
            return (
              <div
                key={item.fullSkill}
                className="flex items-center gap-2.5 p-3 rounded-lg border"
                style={{
                  borderColor: have ? `${GREEN}40` : `${RED}30`,
                  background: have ? `${GREEN}10` : `${RED}08`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: have ? GREEN : RED }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {item.fullSkill}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.placedRate}% placed have it
                  </p>
                </div>
                {!have && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${RED}20`, color: RED }}
                  >
                    Gap
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 5. Dept Leaderboard ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-5"
        data-ocid="dept-leaderboard"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award size={14} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Top 10 — {student.department} by CGPA
          </h3>
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {leaderboard.length} students
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Rank", "Name", "CGPA", "Status", "Package"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((s, i) => {
                const isYou = s.id === student.id;
                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.42 + i * 0.04 }}
                    className="border-b border-border/50 last:border-0 transition-smooth"
                    style={{
                      background: isYou ? `${BLUE}15` : "transparent",
                    }}
                    data-ocid={`leaderboard-row-${s.id}`}
                  >
                    <td className="py-2.5 px-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: s.rank <= 3 ? `${GOLD}25` : `${BLUE}15`,
                          color: s.rank <= 3 ? GOLD : BLUE,
                        }}
                      >
                        {s.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-sm text-foreground font-medium">
                        {s.name.split(" ")[0]}
                        {isYou && (
                          <span
                            className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: `${BLUE}20`, color: BLUE }}
                          >
                            You
                          </span>
                        )}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-3 font-mono font-bold"
                      style={{ color: isYou ? BLUE : "oklch(0.8 0 0)" }}
                    >
                      {s.cgpa.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{
                          background:
                            s.placement_status === "placed"
                              ? `${GREEN}20`
                              : s.placement_status === "in-progress"
                                ? `${GOLD}20`
                                : `${RED}18`,
                          color:
                            s.placement_status === "placed"
                              ? GREEN
                              : s.placement_status === "in-progress"
                                ? GOLD
                                : RED,
                        }}
                      >
                        {s.placement_status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-sm text-muted-foreground">
                      {s.package_lpa ? `₹${s.package_lpa} LPA` : "—"}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseRange(range: string): { min: number; max: number } {
  if (range === "<6") return { min: 0, max: 6 };
  if (range === "9+") return { min: 9, max: 11 };
  const parts = range.split("-");
  return { min: Number.parseFloat(parts[0]), max: Number.parseFloat(parts[1]) };
}

function getCGPABracket(cgpa: number): string {
  if (cgpa < 6) return "<6";
  if (cgpa < 7) return "6-7";
  if (cgpa < 8) return "7-8";
  if (cgpa < 9) return "8-9";
  return "9+";
}
