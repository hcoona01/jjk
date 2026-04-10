import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUpcomingDrives } from "@/lib/mockData";
import { useStudentData } from "@/lib/studentData";
import type { InterviewSession, UpcomingDrive } from "@/types/placement";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Mic2,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function tierColor(tier: number): string {
  if (tier === 1) return "badge-chart-1";
  if (tier === 2) return "badge-chart-2";
  return "badge-chart-3";
}

const ROUND_LABELS: Record<InterviewSession["type"], string> = {
  technical: "Technical",
  hr: "HR",
  aptitude: "Aptitude",
  "group-discussion": "Group Discussion",
  mock: "Mock",
};

const ROUND_COLORS: Record<InterviewSession["type"], string> = {
  technical: "oklch(0.65 0.22 261)",
  hr: "oklch(0.68 0.19 137)",
  aptitude: "oklch(0.72 0.18 64)",
  "group-discussion": "oklch(0.6 0.16 200)",
  mock: "oklch(0.68 0.15 150)",
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  delay,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down" | "neutral";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="kpi-card flex flex-col gap-3"
      data-ocid={`kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}22` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        {trend === "up" && (
          <TrendingUp size={14} className="text-[oklch(0.68_0.19_137)]" />
        )}
        {trend === "down" && (
          <TrendingDown size={14} className="text-[oklch(0.72_0.22_25)]" />
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}

// ─── Upcoming Drive Row ────────────────────────────────────────────────────────

function DriveRow({ drive, delay }: { drive: UpcomingDrive; delay: number }) {
  const days = daysUntil(drive.date);
  const isUrgent = days <= 5 && days >= 0;
  const isPast = days < 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
      data-ocid={`drive-row-${drive.id}`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Briefcase size={12} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {drive.company_name}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {drive.roles.slice(0, 2).join(" · ")}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {fmtDate(drive.date)}
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isUrgent
              ? "status-unplaced"
              : isPast
                ? "badge-chart-3"
                : "badge-chart-2"
          }`}
        >
          {isPast ? (
            <>Done</>
          ) : isUrgent ? (
            <>
              <Clock size={8} />
              {days}d left
            </>
          ) : (
            <>
              <Calendar size={8} />
              in {days}d
            </>
          )}
        </span>
      </td>
      <td className="py-3 px-4">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tierColor(drive.tier)}`}
        >
          Tier {drive.tier}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {drive.positions} pos · ≥{drive.min_cgpa} CGPA
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {drive.package_range}
      </td>
      <td className="py-3 px-4">
        <Link
          to="/student/mock-interview"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-smooth"
          data-ocid={`btn-prepare-${drive.id}`}
        >
          Prepare <ChevronRight size={11} />
        </Link>
      </td>
    </motion.tr>
  );
}

// ─── History Row ──────────────────────────────────────────────────────────────

function HistoryRow({
  session,
  delay,
}: {
  session: InterviewSession;
  delay: number;
}) {
  const resultColor =
    session.status === "scheduled"
      ? "badge-chart-2"
      : session.score >= 70
        ? "badge-chart-1"
        : "status-unplaced";
  const resultLabel =
    session.status === "scheduled"
      ? "Scheduled"
      : session.score >= 70
        ? "Pass"
        : "Needs Work";

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
      data-ocid={`history-row-${session.id}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-medium text-foreground">{session.company}</p>
        <p className="text-[10px] text-muted-foreground">{session.role}</p>
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {fmtDate(session.date)}
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
          {ROUND_LABELS[session.type]}
        </span>
      </td>
      <td className="py-3 px-4">
        {session.status === "completed" ? (
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${session.score}%`,
                  background: ROUND_COLORS[session.type],
                }}
              />
            </div>
            <span className="text-xs font-bold text-foreground">
              {session.score}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="py-3 px-4">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${resultColor}`}
        >
          {resultLabel}
        </span>
      </td>
      <td className="py-3 px-4">
        {session.feedback ? (
          <p
            className="text-[10px] text-muted-foreground max-w-[180px] truncate"
            title={session.feedback}
          >
            {session.feedback}
          </p>
        ) : (
          <span className="text-[10px] text-muted-foreground/40">—</span>
        )}
      </td>
    </motion.tr>
  );
}

// ─── Prep Tip Card ────────────────────────────────────────────────────────────

function PrepTip({
  title,
  items,
  icon: Icon,
  color,
  delay,
}: {
  title: string;
  items: string[];
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-smooth"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={14} style={{ color }} />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-xs text-muted-foreground"
          >
            <CheckCircle2
              size={11}
              className="mt-0.5 shrink-0"
              style={{ color }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type RoundFilter = "all" | InterviewSession["type"];

const CHART_LINE_COLORS = {
  technical: "#6b97ff",
  hr: "#6bcf8f",
  aptitude: "#f5c842",
} as const;

export default function StudentInterviewPrep() {
  const { student, stats } = useStudentData();
  const [roundFilter, setRoundFilter] = useState<RoundFilter>("all");
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  const sessions: InterviewSession[] = stats?.interview_sessions ?? [];
  const completed = sessions.filter((s) => s.status === "completed");

  // Drives from student's department
  const upcomingDrives = useMemo(() => {
    if (!student) return [];
    return getUpcomingDrives(student.department);
  }, [student]);

  // KPI computations
  const kpis = useMemo(() => {
    const byType = (type: InterviewSession["type"]) =>
      completed.filter((s) => s.type === type);

    const avg = (arr: InterviewSession[]) =>
      arr.length
        ? Math.round(arr.reduce((a, s) => a + s.score, 0) / arr.length)
        : 0;

    const successRate = completed.length
      ? Math.round(
          (completed.filter((s) => s.score >= 70).length / completed.length) *
            100,
        )
      : 0;

    return {
      aptitudeAvg: avg(byType("aptitude")),
      technicalAvg: avg(byType("technical")),
      hrAvg: avg(byType("hr")),
      successRate,
    };
  }, [completed]);

  // Weakest round type for recommendations
  const weakest = useMemo(() => {
    const candidates = [
      { type: "aptitude" as const, score: kpis.aptitudeAvg },
      { type: "technical" as const, score: kpis.technicalAvg },
      { type: "hr" as const, score: kpis.hrAvg },
    ].filter((c) => c.score > 0);
    if (!candidates.length) return "technical";
    return candidates.sort((a, b) => a.score - b.score)[0].type;
  }, [kpis]);

  // Chart: performance over time
  const chartData = useMemo(() => {
    const filtered =
      roundFilter === "all"
        ? completed
        : completed.filter((s) => s.type === roundFilter);

    return filtered
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((s) => ({
        date: new Date(s.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        technical: s.type === "technical" ? s.score : undefined,
        hr: s.type === "hr" ? s.score : undefined,
        aptitude: s.type === "aptitude" ? s.score : undefined,
        score: s.score,
        type: s.type,
        company: s.company,
      }));
  }, [completed, roundFilter]);

  // Skill-success chart
  const skillData = useMemo(() => {
    if (!student) return [];
    const skills = student.skills.slice(0, 8);
    return skills.map((skill, i) => ({
      skill,
      success: Math.min(95, 55 + i * 6 + (kpis.successRate > 50 ? 12 : 0)),
    }));
  }, [student, kpis.successRate]);

  // Prep tips by round type
  const PREP_TIPS: Record<
    string,
    { icon: React.ElementType; color: string; items: string[] }
  > = {
    technical: {
      icon: Target,
      color: "oklch(0.65 0.22 261)",
      items: [
        "Practice 2-3 LeetCode problems daily (Easy→Medium)",
        "Review data structures: trees, graphs, dynamic programming",
        "Learn to explain time/space complexity clearly",
        "Study 2-3 system design patterns (LRU, consistent hashing)",
      ],
    },
    aptitude: {
      icon: Zap,
      color: "oklch(0.72 0.18 64)",
      items: [
        "Time-box aptitude drills to 90s per question",
        "Focus on percentages, ratios, and number series patterns",
        "Practice verbal reasoning with daily reading exercises",
        "Use elimination strategy for tricky logic questions",
      ],
    },
    hr: {
      icon: Mic2,
      color: "oklch(0.68 0.19 137)",
      items: [
        "Prepare STAR format answers for behavioral questions",
        'Craft a compelling "Tell me about yourself" (< 2 min)',
        "Research company culture and recent news before each interview",
        "Prepare 2-3 thoughtful questions to ask the interviewer",
      ],
    },
    "group-discussion": {
      icon: BookOpen,
      color: "oklch(0.6 0.16 200)",
      items: [
        "Practice structured argument: Point → Reasoning → Example",
        "Work on active listening — reference others' points",
        "Keep volume and tone measured, avoid dominating",
        "Summarize the group's consensus at the end",
      ],
    },
  };

  const COMPANY_TOPICS = upcomingDrives.slice(0, 3).map((d) => ({
    company: d.company_name,
    topics:
      d.tier === 1
        ? ["DSA (Hard)", "System Design", "Behavioral"]
        : ["DSA (Medium)", "SQL", "OOP Concepts"],
  }));

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <GraduationCap size={48} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">
          Please log in to continue.
        </p>
      </div>
    );
  }

  const tips =
    PREP_TIPS[weakest as keyof typeof PREP_TIPS] ?? PREP_TIPS.technical;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-6 py-7 space-y-8 max-w-7xl mx-auto"
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Interview Prep Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track performance, prepare strategically, and ace every round.
          </p>
        </div>
        <Link to="/student/mock-interview" data-ocid="btn-launch-mock">
          <Button className="gap-2">
            <Video size={14} />
            Launch Mock Interview
          </Button>
        </Link>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Aptitude Avg"
          value={kpis.aptitudeAvg || "—"}
          sub={kpis.aptitudeAvg ? "out of 100" : "No data yet"}
          icon={Zap}
          color="oklch(0.72 0.18 64)"
          trend={kpis.aptitudeAvg >= 70 ? "up" : "down"}
          delay={0}
        />
        <KpiCard
          label="Technical Avg"
          value={kpis.technicalAvg || "—"}
          sub={kpis.technicalAvg ? "out of 100" : "No data yet"}
          icon={Target}
          color="oklch(0.65 0.22 261)"
          trend={kpis.technicalAvg >= 70 ? "up" : "down"}
          delay={0.07}
        />
        <KpiCard
          label="HR Avg"
          value={kpis.hrAvg || "—"}
          sub={kpis.hrAvg ? "out of 100" : "No data yet"}
          icon={Mic2}
          color="oklch(0.68 0.19 137)"
          trend={kpis.hrAvg >= 70 ? "up" : "down"}
          delay={0.14}
        />
        <KpiCard
          label="Success Rate"
          value={`${kpis.successRate}%`}
          sub="rounds passed (≥70)"
          icon={Star}
          color="oklch(0.78 0.18 85)"
          trend={kpis.successRate >= 60 ? "up" : "down"}
          delay={0.21}
        />
      </div>

      {/* ── Performance Chart ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="bg-card border border-border rounded-xl p-5"
        data-ocid="chart-performance"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Performance Over Time
            </h2>
            <p className="text-xs text-muted-foreground">
              Score trend by round type
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "technical", "hr", "aptitude"] as const).map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setRoundFilter(f)}
                data-ocid={`filter-round-${f}`}
                className={`text-[11px] font-medium px-3 py-1 rounded-full transition-smooth ${
                  roundFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {f === "all" ? "All Rounds" : ROUND_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <AlertTriangle size={28} className="text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              No completed interviews to display.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 8, bottom: 4, left: -16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.4 0 0 / 0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "oklch(0.9 0 0)",
                }}
                cursor={{ stroke: "oklch(0.5 0.22 261 / 0.3)" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              {roundFilter === "all" || roundFilter === "technical" ? (
                <Line
                  type="monotone"
                  dataKey="technical"
                  name="Technical"
                  stroke={CHART_LINE_COLORS.technical}
                  strokeWidth={2}
                  dot={{ r: 3, fill: CHART_LINE_COLORS.technical }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              ) : null}
              {roundFilter === "all" || roundFilter === "hr" ? (
                <Line
                  type="monotone"
                  dataKey="hr"
                  name="HR"
                  stroke={CHART_LINE_COLORS.hr}
                  strokeWidth={2}
                  dot={{ r: 3, fill: CHART_LINE_COLORS.hr }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              ) : null}
              {roundFilter === "all" || roundFilter === "aptitude" ? (
                <Line
                  type="monotone"
                  dataKey="aptitude"
                  name="Aptitude"
                  stroke={CHART_LINE_COLORS.aptitude}
                  strokeWidth={2}
                  dot={{ r: 3, fill: CHART_LINE_COLORS.aptitude }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── Two-column: Skill Success + Recommended Prep ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Skill success chart */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
          data-ocid="chart-skills"
        >
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Skill-wise Interview Success
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Skills correlated with positive interview outcomes
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={skillData}
              layout="vertical"
              margin={{ top: 0, right: 12, bottom: 0, left: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.4 0 0 / 0.1)"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="skill"
                tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "oklch(0.9 0 0)",
                }}
                formatter={(v: number) => [`${v}%`, "Success Rate"]}
              />
              <Bar
                dataKey="success"
                name="Success Rate"
                fill="oklch(0.65 0.22 261)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recommended prep */}
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4"
          data-ocid="section-recommended-prep"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Recommended Prep
              </h2>
              <p className="text-xs text-muted-foreground">
                Based on your weakest area:{" "}
                <span className="text-foreground font-medium capitalize">
                  {ROUND_LABELS[weakest]}
                </span>
              </p>
            </div>
            <Link to="/student/mock-interview" data-ocid="btn-practice-now">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Video size={12} />
                Practice Now
              </Button>
            </Link>
          </div>

          <ul className="space-y-2">
            {tips.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2
                  size={13}
                  className="mt-0.5 shrink-0"
                  style={{ color: tips.color }}
                />
                <span className="text-xs text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          {COMPANY_TOPICS.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-foreground mb-2.5">
                Upcoming Company Focus Areas
              </p>
              <div className="space-y-2">
                {COMPANY_TOPICS.map(({ company, topics }) => (
                  <div key={company} className="flex items-start gap-2">
                    <Briefcase
                      size={11}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-foreground">
                        {company}:{" "}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {topics.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Upcoming Drives + History Tables ─────────────────────── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Tab header */}
        <div className="flex border-b border-border">
          {(["upcoming", "history"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-ocid={`tab-${tab}`}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-smooth ${
                activeTab === tab
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "upcoming" ? (
                <>
                  <Calendar size={13} />
                  Upcoming Drives
                  {upcomingDrives.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5"
                    >
                      {upcomingDrives.length}
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <CheckCircle2 size={13} />
                  Interview History
                  {sessions.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5"
                    >
                      {sessions.length}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Upcoming Drives table */}
        {activeTab === "upcoming" && (
          <div className="overflow-x-auto" data-ocid="table-upcoming-drives">
            {upcomingDrives.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <Calendar size={32} className="text-muted-foreground/25" />
                <p className="text-sm font-medium text-foreground">
                  No upcoming drives for your department
                </p>
                <p className="text-xs text-muted-foreground">
                  Check back soon — new drives are posted regularly.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    {[
                      "Company",
                      "Date",
                      "Status",
                      "Tier",
                      "Eligibility",
                      "Package",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="py-2.5 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcomingDrives.map((d, i) => (
                    <DriveRow key={d.id} drive={d} delay={i * 0.06} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* History table */}
        {activeTab === "history" && (
          <div className="overflow-x-auto" data-ocid="table-interview-history">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <Mic2 size={32} className="text-muted-foreground/25" />
                <p className="text-sm font-medium text-foreground">
                  No interviews yet
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Start with a mock interview to build your history.
                </p>
                <Link to="/student/mock-interview">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    data-ocid="btn-start-mock"
                  >
                    <Video size={13} />
                    Start Mock Interview
                  </Button>
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    {[
                      "Company",
                      "Date",
                      "Round",
                      "Score",
                      "Result",
                      "Feedback",
                    ].map((h) => (
                      <th
                        key={h}
                        className="py-2.5 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .map((s, i) => (
                      <HistoryRow key={s.id} session={s} delay={i * 0.05} />
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ── Topic Prep Cards ──────────────────────────────────────── */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-4"
        >
          <BookOpen size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Prep by Round Type
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["technical", "aptitude", "hr", "group-discussion"] as const).map(
            (type, i) => {
              const t = PREP_TIPS[type];
              return (
                <PrepTip
                  key={type}
                  title={ROUND_LABELS[type]}
                  items={t.items}
                  icon={t.icon}
                  color={t.color}
                  delay={i * 0.08}
                />
              );
            },
          )}
        </div>
      </div>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary/10 border border-primary/25 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4"
        data-ocid="cta-mock-interview"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
            <TrendingUp size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ready to practice?
            </p>
            <p className="text-xs text-muted-foreground">
              Simulate a live interview with AI feedback, voice coaching, and
              scoring.
            </p>
          </div>
        </div>
        <Link to="/student/mock-interview" data-ocid="btn-cta-mock">
          <Button className="gap-2">
            <Video size={14} />
            Start Mock Interview
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
