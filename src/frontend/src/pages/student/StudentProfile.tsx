import { Badge } from "@/components/ui/badge";
import { useStudentData } from "@/lib/studentData";
import type { PlacementStatus } from "@/types/placement";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Mic,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

// ─── Color Helpers ────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<PlacementStatus, string> = {
  placed: "oklch(0.72 0.2 145)",
  "in-progress": "oklch(0.78 0.18 64)",
  unplaced: "oklch(0.72 0.22 25)",
};
const STATUS_BG: Record<PlacementStatus, string> = {
  placed: "oklch(0.55 0.18 145 / 0.18)",
  "in-progress": "oklch(0.62 0.18 64 / 0.18)",
  unplaced: "oklch(0.55 0.22 25 / 0.18)",
};
const STATUS_BORDER: Record<PlacementStatus, string> = {
  placed: "oklch(0.55 0.18 145 / 0.4)",
  "in-progress": "oklch(0.62 0.18 64 / 0.4)",
  unplaced: "oklch(0.55 0.22 25 / 0.4)",
};
const STATUS_LABEL: Record<PlacementStatus, string> = {
  placed: "Placed",
  "in-progress": "In Progress",
  unplaced: "Not Yet Placed",
};

function scoreColor(pct: number): string {
  if (pct >= 75) return "oklch(0.68 0.19 142)";
  if (pct >= 50) return "oklch(0.72 0.18 64)";
  return "oklch(0.65 0.22 25)";
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreBar({
  label,
  value,
  max,
}: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = scoreColor(pct);
  const isGood = pct >= 75;
  const isMid = pct >= 50;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground">/ {max}</span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ background: `${color}22`, color }}
          >
            {isGood ? "Excellent" : isMid ? "Good" : "Needs Work"}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(to right, ${color}, ${color.replace("/ 1", "")}cc)`,
          }}
        />
      </div>
    </div>
  );
}

function CircleScore({
  value,
  max,
  label,
}: { value: number; max: number; label: string }) {
  const pct = (value / max) * 100;
  const color = scoreColor(pct);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 88 88"
          role="img"
          aria-label={`${label}: ${value} out of ${max}`}
        >
          <title>{`${label}: ${value} / ${max}`}</title>
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-muted/50"
          />
          <motion.circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">{value}</span>
          <span className="text-[10px] text-muted-foreground">/{max}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function StatMiniCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-smooth"
      data-ocid="stat-mini-card"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}22` }}
      >
        <span style={{ color }}>
          <Icon size={18} />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground leading-none">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Skill category guesser ───────────────────────────────────────────────────
const PROG_SKILLS = new Set([
  "React",
  "Node.js",
  "Python",
  "Java",
  "TypeScript",
  "JavaScript",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "R",
  "Scala",
  "MATLAB",
  "Embedded C",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Django",
  "Spring",
  "Next.js",
  "Vue",
  "Angular",
]);
const TOOL_SKILLS = new Set([
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Linux",
  "Git",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Figma",
  "AutoCAD",
  "SolidWorks",
  "ANSYS",
  "STAAD Pro",
  "Revit",
  "GIS",
  "VLSI",
  "IoT",
  "CNC",
]);

function categorizeSkills(skills: string[]): {
  programming: string[];
  tools: string[];
  other: string[];
} {
  const programming: string[] = [];
  const tools: string[] = [];
  const other: string[] = [];
  for (const s of skills) {
    if (PROG_SKILLS.has(s)) programming.push(s);
    else if (TOOL_SKILLS.has(s)) tools.push(s);
    else other.push(s);
  }
  return { programming, tools, other };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentProfile() {
  const { student, stats } = useStudentData();

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <GraduationCap size={48} className="text-muted-foreground/30" />
        <h2 className="text-lg font-semibold text-foreground">
          Profile Not Found
        </h2>
        <p className="text-sm text-muted-foreground">
          Please{" "}
          <Link to="/login" className="text-primary hover:underline">
            log in
          </Link>{" "}
          again.
        </p>
      </div>
    );
  }

  const status = student.placement_status;
  const peer = stats?.peer_benchmark;
  const initials = student.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const skillCats = categorizeSkills(student.skills);

  const completedSessions =
    stats?.interview_sessions.filter((s) => s.status === "completed").length ??
    0;
  const offersReceived =
    (stats?.applications_by_status.offered ?? 0) +
    (stats?.applications_by_status.hired ?? 0);
  const practiceSessions =
    stats?.interview_sessions.filter((s) => s.type === "mock").length ?? 0;

  const cgpaPct = (student.cgpa / 10) * 100;
  const deptRank = peer
    ? `Top ${(100 - peer.dept_cgpa_percentile).toFixed(0)}% in ${student.department}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-6 py-7 space-y-6 max-w-6xl mx-auto"
    >
      {/* ── Page Title ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your academic &amp; placement profile at a glance
        </p>
      </div>

      {/* ── 1. Hero Profile Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="relative bg-card border border-border rounded-2xl overflow-hidden"
        data-ocid="profile-header-card"
      >
        {/* Decorative gradient banner */}
        <div
          className="h-28 w-full"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.32 0.18 261) 0%, oklch(0.22 0.14 280) 50%, oklch(0.18 0.1 261) 100%)",
          }}
        >
          {/* Subtle dot grid overlay */}
          <div
            className="absolute inset-0 h-28 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, oklch(0.85 0.1 261) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar — overlaps banner */}
          <div className="flex items-end justify-between -mt-10 mb-4 flex-wrap gap-4">
            <div className="flex items-end gap-4">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-card flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.5 0.22 261), oklch(0.42 0.2 280))",
                }}
              >
                {initials}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-foreground leading-tight">
                  {student.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {student.department} · {student.school} · Batch{" "}
                  {student.batch}
                </p>
              </div>
            </div>

            {/* Status badge cluster */}
            <div className="flex items-center gap-2 flex-wrap pb-1">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: STATUS_BG[status],
                  color: STATUS_COLOR[status],
                  border: `1px solid ${STATUS_BORDER[status]}`,
                }}
                data-ocid="placement-status-badge"
              >
                {status === "placed" ? (
                  <CheckCircle2 size={12} />
                ) : status === "in-progress" ? (
                  <Clock size={12} />
                ) : (
                  <AlertCircle size={12} />
                )}
                {STATUS_LABEL[status]}
              </span>
              {student.package_lpa && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold badge-chart-1">
                  <Star size={11} />₹{student.package_lpa} LPA
                </span>
              )}
              {student.placed_at && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold badge-chart-2">
                  <Building2 size={11} />
                  {student.placed_at}
                </span>
              )}
            </div>
          </div>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail size={13} className="text-primary/70" />
              {student.email}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen size={13} className="text-primary/70" />
              Roll No:{" "}
              <span className="font-semibold text-foreground ml-1">
                {student.roll_number}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={13} className="text-primary/70" />
              Section {student.section}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GraduationCap size={13} className="text-primary/70" />
              {student.programme}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Quick Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMiniCard
          icon={Briefcase}
          label="Applications Submitted"
          value={stats?.total_applications ?? 0}
          color="oklch(0.65 0.22 261)"
          delay={0.12}
        />
        <StatMiniCard
          icon={Mic}
          label="Interviews Completed"
          value={completedSessions}
          color="oklch(0.65 0.16 200)"
          delay={0.16}
        />
        <StatMiniCard
          icon={Award}
          label="Offers Received"
          value={offersReceived}
          color="oklch(0.68 0.19 142)"
          delay={0.2}
        />
        <StatMiniCard
          icon={Zap}
          label="Practice Sessions"
          value={practiceSessions}
          color="oklch(0.72 0.18 64)"
          delay={0.24}
        />
      </div>

      {/* ── 3. Main 2-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Academic info + Placement status */}
        <div className="lg:col-span-2 space-y-5">
          {/* Academic Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="bg-card border border-border rounded-xl p-5"
            data-ocid="academic-info-card"
          >
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={15} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Academic Information
              </h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: BookOpen,
                  label: "Roll Number",
                  value: student.roll_number,
                  bold: true,
                },
                {
                  icon: GraduationCap,
                  label: "Programme",
                  value: student.programme,
                  bold: false,
                },
                {
                  icon: Building2,
                  label: "School / Faculty",
                  value: student.school,
                  bold: false,
                },
                {
                  icon: Calendar,
                  label: "Batch Year",
                  value: `${student.batch}`,
                  bold: false,
                },
                {
                  icon: MapPin,
                  label: "Section",
                  value: `Section ${student.section}`,
                  bold: false,
                },
                {
                  icon: Users,
                  label: "Department",
                  value: student.department,
                  bold: false,
                },
              ].map(({ icon: Icon, label, value, bold }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon
                    size={13}
                    className="text-primary/60 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {label}
                    </span>
                    <span
                      className={`text-xs text-right truncate ${bold ? "font-bold text-primary" : "font-medium text-foreground"}`}
                    >
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Placement Status Card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-5"
            data-ocid="placement-status-card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={15} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Placement Status
              </h3>
            </div>

            {status === "placed" && (
              <div className="space-y-3">
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{
                    background: STATUS_BG.placed,
                    border: `1px solid ${STATUS_BORDER.placed}`,
                  }}
                >
                  <CheckCircle2
                    size={16}
                    style={{ color: STATUS_COLOR.placed }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: STATUS_COLOR.placed }}
                  >
                    Successfully Placed!
                  </span>
                </div>
                {student.placed_at && (
                  <div className="flex justify-between items-center py-1.5 border-b border-border">
                    <span className="text-xs text-muted-foreground">
                      Company
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {student.placed_at}
                    </span>
                  </div>
                )}
                {student.package_lpa && (
                  <div className="flex justify-between items-center py-1.5 border-b border-border">
                    <span className="text-xs text-muted-foreground">
                      CTC Package
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      ₹{student.package_lpa} LPA
                    </span>
                  </div>
                )}
                {(stats?.avg_package_dept ?? 0) > 0 && (
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-muted-foreground">
                      vs Dept. Avg
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color:
                          (student.package_lpa ?? 0) >=
                          (stats?.avg_package_dept ?? 0)
                            ? "oklch(0.68 0.19 142)"
                            : "oklch(0.65 0.22 25)",
                      }}
                    >
                      Dept avg ₹{stats?.avg_package_dept} LPA
                    </span>
                  </div>
                )}
              </div>
            )}

            {status === "in-progress" && (
              <div className="space-y-3">
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{
                    background: STATUS_BG["in-progress"],
                    border: `1px solid ${STATUS_BORDER["in-progress"]}`,
                  }}
                >
                  <Clock
                    size={16}
                    style={{ color: STATUS_COLOR["in-progress"] }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: STATUS_COLOR["in-progress"] }}
                  >
                    Placement Process Active
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-xs text-muted-foreground">
                    Active Applications
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {(stats?.applications_by_status.applied ?? 0) +
                      (stats?.applications_by_status.shortlisted ?? 0) +
                      (stats?.applications_by_status.interviewing ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-xs text-muted-foreground">
                    Scheduled Interviews
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {stats?.upcoming_interview_count ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-xs text-muted-foreground">
                    Shortlisted
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {stats?.applications_by_status.shortlisted ?? 0}
                  </span>
                </div>
              </div>
            )}

            {status === "unplaced" && (
              <div className="space-y-3">
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{
                    background: STATUS_BG.unplaced,
                    border: `1px solid ${STATUS_BORDER.unplaced}`,
                  }}
                >
                  <AlertCircle
                    size={16}
                    style={{ color: STATUS_COLOR.unplaced }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: STATUS_COLOR.unplaced }}
                  >
                    Not Yet Placed
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Recommended next steps:
                </p>
                {[
                  "Complete mock interview sessions",
                  "Improve aptitude & coding scores",
                  "Apply to upcoming campus drives",
                  "Build domain-specific skills",
                ].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                    <span className="text-xs text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: Academic Performance + Skills */}
        <div className="lg:col-span-3 space-y-5">
          {/* Academic Performance Card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="bg-card border border-border rounded-xl p-5"
            data-ocid="academic-performance-card"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Academic Performance
              </h3>
              {deptRank && (
                <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full badge-chart-2">
                  {deptRank}
                </span>
              )}
            </div>

            {/* CGPA circle + bars row */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <CircleScore value={student.cgpa} max={10} label="CGPA" />
                <div className="text-center mt-1">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${scoreColor(cgpaPct)}22`,
                      color: scoreColor(cgpaPct),
                    }}
                  >
                    {cgpaPct >= 75
                      ? "Distinction"
                      : cgpaPct >= 60
                        ? "First Class"
                        : "Pass"}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <ScoreBar
                  label="Aptitude Score"
                  value={student.aptitude_score}
                  max={100}
                />
                <ScoreBar
                  label="Programming Score"
                  value={student.programming_score}
                  max={100}
                />
                {peer && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wide font-medium">
                      vs Department Average
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          label: "CGPA",
                          mine: peer.student_cgpa,
                          avg: peer.dept_avg_cgpa,
                          pct: peer.dept_cgpa_percentile,
                          max: 10,
                        },
                        {
                          label: "Aptitude",
                          mine: peer.student_aptitude,
                          avg: peer.dept_avg_aptitude,
                          pct: peer.dept_aptitude_percentile,
                          max: 100,
                        },
                        {
                          label: "Programming",
                          mine: peer.student_programming,
                          avg: peer.dept_avg_programming,
                          pct: peer.dept_programming_percentile,
                          max: 100,
                        },
                      ].map(({ label, mine, avg, pct }) => {
                        const isAbove = mine >= avg;
                        return (
                          <div
                            key={label}
                            className="flex items-center justify-between gap-3 text-xs"
                          >
                            <span className="text-muted-foreground w-24 flex-shrink-0">
                              {label}
                            </span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full opacity-40 bg-primary"
                                style={{
                                  width: `${(avg / (label === "CGPA" ? 10 : 100)) * 100}%`,
                                }}
                              />
                            </div>
                            <span
                              className="font-semibold w-14 text-right flex-shrink-0"
                              style={{
                                color: isAbove
                                  ? "oklch(0.68 0.19 142)"
                                  : "oklch(0.65 0.22 25)",
                              }}
                            >
                              Top {(100 - pct).toFixed(0)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Skills & Competencies Card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="bg-card border border-border rounded-xl p-5"
            data-ocid="skills-card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award size={15} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Skills &amp; Competencies
              </h3>
              <Badge variant="secondary" className="ml-auto text-xs">
                {student.skills.length} skills
              </Badge>
            </div>

            <div className="space-y-4">
              {skillCats.programming.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Code2 size={10} /> Languages &amp; Frameworks
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillCats.programming.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge-chart-2"
                      >
                        <Code2 size={10} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skillCats.tools.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Zap size={10} /> Tools &amp; Platforms
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillCats.tools.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge-chart-3"
                      >
                        <Zap size={10} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skillCats.other.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Star size={10} /> Domain &amp; Soft Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillCats.other.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge-chart-5"
                      >
                        <Star size={10} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {student.skills.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No skills added yet.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
