import { r as reactExports, E as getUpcomingDrives, j as jsxRuntimeExports, L as Link, V as Video, Z as Zap, N as MicVocal, p as ChevronRight } from "./index-CSqV-Tvs.js";
import { u as useStudentData, B as Badge } from "./studentData-eQPEN3Xp.js";
import { B as Button } from "./button-BmzyXuFv.js";
import { G as GraduationCap } from "./graduation-cap-B8IByoLM.js";
import { m as motion } from "./proxy-CwEQWttt.js";
import { T as Target } from "./target-D4p9sgE4.js";
import { S as Star, C as Clock } from "./star-BeJNHjEv.js";
import { T as TriangleAlert } from "./triangle-alert-H0wJ8vJ1.js";
import { R as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, b as Line, B as Bar } from "./generateCategoricalChart-C-v2pZKU.js";
import { L as LineChart, B as BarChart } from "./BarChart-DsGql0PG.js";
import { B as BookOpen } from "./book-open-Dy2xt3aw.js";
import { C as CircleCheck } from "./circle-check-B0n-UOmI.js";
import { B as Briefcase } from "./briefcase-CebdH36b.js";
import { C as Calendar } from "./calendar-DBn2fGBd.js";
import { T as TrendingUp } from "./trending-up-Bxh-st7e.js";
import { T as TrendingDown } from "./trending-down-DuwQ70N6.js";
import "./index-CLMp4i3a.js";
function daysUntil(dateStr) {
  const now = /* @__PURE__ */ new Date();
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
}
function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function tierColor(tier) {
  if (tier === 1) return "badge-chart-1";
  if (tier === 2) return "badge-chart-2";
  return "badge-chart-3";
}
const ROUND_LABELS = {
  technical: "Technical",
  hr: "HR",
  aptitude: "Aptitude",
  "group-discussion": "Group Discussion",
  mock: "Mock"
};
const ROUND_COLORS = {
  technical: "oklch(0.65 0.22 261)",
  hr: "oklch(0.68 0.19 137)",
  aptitude: "oklch(0.72 0.18 64)",
  "group-discussion": "oklch(0.6 0.16 200)",
  mock: "oklch(0.68 0.15 150)"
};
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  delay
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.35 },
      className: "kpi-card flex flex-col gap-3",
      "data-ocid": `kpi-${label.toLowerCase().replace(/\s+/g, "-")}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-9 h-9 rounded-lg flex items-center justify-center",
              style: { background: `${color}22` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, style: { color } })
            }
          ),
          trend === "up" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14, className: "text-[oklch(0.68_0.19_137)]" }),
          trend === "down" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 14, className: "text-[oklch(0.72_0.22_25)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: value }),
          sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: label })
      ]
    }
  );
}
function DriveRow({ drive, delay }) {
  const days = daysUntil(drive.date);
  const isUrgent = days <= 5 && days >= 0;
  const isPast = days < 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      transition: { delay },
      className: "border-b border-border/50 hover:bg-muted/30 transition-colors group",
      "data-ocid": `drive-row-${drive.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 12, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-tight", children: drive.company_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: drive.roles.slice(0, 2).join(" · ") })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-xs text-muted-foreground", children: fmtDate(drive.date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isUrgent ? "status-unplaced" : isPast ? "badge-chart-3" : "badge-chart-2"}`,
            children: isPast ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Done" }) : isUrgent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 8 }),
              days,
              "d left"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 8 }),
              "in ",
              days,
              "d"
            ] })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${tierColor(drive.tier)}`,
            children: [
              "Tier ",
              drive.tier
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4 text-xs text-muted-foreground", children: [
          drive.positions,
          " pos · ≥",
          drive.min_cgpa,
          " CGPA"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-xs text-muted-foreground", children: drive.package_range }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/student/mock-interview",
            className: "inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-smooth",
            "data-ocid": `btn-prepare-${drive.id}`,
            children: [
              "Prepare ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 11 })
            ]
          }
        ) })
      ]
    }
  );
}
function HistoryRow({
  session,
  delay
}) {
  const resultColor = session.status === "scheduled" ? "badge-chart-2" : session.score >= 70 ? "badge-chart-1" : "status-unplaced";
  const resultLabel = session.status === "scheduled" ? "Scheduled" : session.score >= 70 ? "Pass" : "Needs Work";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      transition: { delay },
      className: "border-b border-border/50 hover:bg-muted/30 transition-colors",
      "data-ocid": `history-row-${session.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: session.company }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: session.role })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-xs text-muted-foreground", children: fmtDate(session.date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded", children: ROUND_LABELS[session.type] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: session.status === "completed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full",
              style: {
                width: `${session.score}%`,
                background: ROUND_COLORS[session.type]
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: session.score })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${resultColor}`,
            children: resultLabel
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: session.feedback ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-[10px] text-muted-foreground max-w-[180px] truncate",
            title: session.feedback,
            children: session.feedback
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/40", children: "—" }) })
      ]
    }
  );
}
function PrepTip({
  title,
  items,
  icon: Icon,
  color,
  delay
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay },
      className: "bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-8 h-8 rounded-lg flex items-center justify-center",
              style: { background: `${color}20` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, style: { color } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-start gap-2 text-xs text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleCheck,
                {
                  size: 11,
                  className: "mt-0.5 shrink-0",
                  style: { color }
                }
              ),
              item
            ]
          },
          item
        )) })
      ]
    }
  );
}
const CHART_LINE_COLORS = {
  technical: "#6b97ff",
  hr: "#6bcf8f",
  aptitude: "#f5c842"
};
function StudentInterviewPrep() {
  const { student, stats } = useStudentData();
  const [roundFilter, setRoundFilter] = reactExports.useState("all");
  const [activeTab, setActiveTab] = reactExports.useState(
    "upcoming"
  );
  const sessions = (stats == null ? void 0 : stats.interview_sessions) ?? [];
  const completed = sessions.filter((s) => s.status === "completed");
  const upcomingDrives = reactExports.useMemo(() => {
    if (!student) return [];
    return getUpcomingDrives(student.department);
  }, [student]);
  const kpis = reactExports.useMemo(() => {
    const byType = (type) => completed.filter((s) => s.type === type);
    const avg = (arr) => arr.length ? Math.round(arr.reduce((a, s) => a + s.score, 0) / arr.length) : 0;
    const successRate = completed.length ? Math.round(
      completed.filter((s) => s.score >= 70).length / completed.length * 100
    ) : 0;
    return {
      aptitudeAvg: avg(byType("aptitude")),
      technicalAvg: avg(byType("technical")),
      hrAvg: avg(byType("hr")),
      successRate
    };
  }, [completed]);
  const weakest = reactExports.useMemo(() => {
    const candidates = [
      { type: "aptitude", score: kpis.aptitudeAvg },
      { type: "technical", score: kpis.technicalAvg },
      { type: "hr", score: kpis.hrAvg }
    ].filter((c) => c.score > 0);
    if (!candidates.length) return "technical";
    return candidates.sort((a, b) => a.score - b.score)[0].type;
  }, [kpis]);
  const chartData = reactExports.useMemo(() => {
    const filtered = roundFilter === "all" ? completed : completed.filter((s) => s.type === roundFilter);
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      }),
      technical: s.type === "technical" ? s.score : void 0,
      hr: s.type === "hr" ? s.score : void 0,
      aptitude: s.type === "aptitude" ? s.score : void 0,
      score: s.score,
      type: s.type,
      company: s.company
    }));
  }, [completed, roundFilter]);
  const skillData = reactExports.useMemo(() => {
    if (!student) return [];
    const skills = student.skills.slice(0, 8);
    return skills.map((skill, i) => ({
      skill,
      success: Math.min(95, 55 + i * 6 + (kpis.successRate > 50 ? 12 : 0))
    }));
  }, [student, kpis.successRate]);
  const PREP_TIPS = {
    technical: {
      icon: Target,
      color: "oklch(0.65 0.22 261)",
      items: [
        "Practice 2-3 LeetCode problems daily (Easy→Medium)",
        "Review data structures: trees, graphs, dynamic programming",
        "Learn to explain time/space complexity clearly",
        "Study 2-3 system design patterns (LRU, consistent hashing)"
      ]
    },
    aptitude: {
      icon: Zap,
      color: "oklch(0.72 0.18 64)",
      items: [
        "Time-box aptitude drills to 90s per question",
        "Focus on percentages, ratios, and number series patterns",
        "Practice verbal reasoning with daily reading exercises",
        "Use elimination strategy for tricky logic questions"
      ]
    },
    hr: {
      icon: MicVocal,
      color: "oklch(0.68 0.19 137)",
      items: [
        "Prepare STAR format answers for behavioral questions",
        'Craft a compelling "Tell me about yourself" (< 2 min)',
        "Research company culture and recent news before each interview",
        "Prepare 2-3 thoughtful questions to ask the interviewer"
      ]
    },
    "group-discussion": {
      icon: BookOpen,
      color: "oklch(0.6 0.16 200)",
      items: [
        "Practice structured argument: Point → Reasoning → Example",
        "Work on active listening — reference others' points",
        "Keep volume and tone measured, avoid dominating",
        "Summarize the group's consensus at the end"
      ]
    }
  };
  const COMPANY_TOPICS = upcomingDrives.slice(0, 3).map((d) => ({
    company: d.company_name,
    topics: d.tier === 1 ? ["DSA (Hard)", "System Design", "Behavioral"] : ["DSA (Medium)", "SQL", "OOP Concepts"]
  }));
  if (!student) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-96 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 48, className: "text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Please log in to continue." })
    ] });
  }
  const tips = PREP_TIPS[weakest] ?? PREP_TIPS.technical;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "px-6 py-7 space-y-8 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Interview Prep Hub" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Track performance, prepare strategically, and ace every round." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/student/mock-interview", "data-ocid": "btn-launch-mock", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 14 }),
            "Launch Mock Interview"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "Aptitude Avg",
              value: kpis.aptitudeAvg || "—",
              sub: kpis.aptitudeAvg ? "out of 100" : "No data yet",
              icon: Zap,
              color: "oklch(0.72 0.18 64)",
              trend: kpis.aptitudeAvg >= 70 ? "up" : "down",
              delay: 0
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "Technical Avg",
              value: kpis.technicalAvg || "—",
              sub: kpis.technicalAvg ? "out of 100" : "No data yet",
              icon: Target,
              color: "oklch(0.65 0.22 261)",
              trend: kpis.technicalAvg >= 70 ? "up" : "down",
              delay: 0.07
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "HR Avg",
              value: kpis.hrAvg || "—",
              sub: kpis.hrAvg ? "out of 100" : "No data yet",
              icon: MicVocal,
              color: "oklch(0.68 0.19 137)",
              trend: kpis.hrAvg >= 70 ? "up" : "down",
              delay: 0.14
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KpiCard,
            {
              label: "Success Rate",
              value: `${kpis.successRate}%`,
              sub: "rounds passed (≥70)",
              icon: Star,
              color: "oklch(0.78 0.18 85)",
              trend: kpis.successRate >= 60 ? "up" : "down",
              delay: 0.21
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 14 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.25, duration: 0.4 },
            className: "bg-card border border-border rounded-xl p-5",
            "data-ocid": "chart-performance",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Performance Over Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Score trend by round type" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: ["all", "technical", "hr", "aptitude"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setRoundFilter(f),
                    "data-ocid": `filter-round-${f}`,
                    className: `text-[11px] font-medium px-3 py-1 rounded-full transition-smooth ${roundFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
                    children: f === "all" ? "All Rounds" : ROUND_LABELS[f]
                  },
                  f
                )) })
              ] }),
              chartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-40 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 28, className: "text-muted-foreground/30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No completed interviews to display." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                LineChart,
                {
                  data: chartData,
                  margin: { top: 4, right: 8, bottom: 4, left: -16 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CartesianGrid,
                      {
                        strokeDasharray: "3 3",
                        stroke: "oklch(0.4 0 0 / 0.15)",
                        vertical: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "date",
                        tick: { fontSize: 10, fill: "oklch(0.6 0 0)" },
                        axisLine: false,
                        tickLine: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      YAxis,
                      {
                        domain: [0, 100],
                        tick: { fontSize: 10, fill: "oklch(0.6 0 0)" },
                        axisLine: false,
                        tickLine: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Tooltip,
                      {
                        contentStyle: {
                          background: "oklch(0.16 0 0)",
                          border: "1px solid oklch(0.25 0 0)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "oklch(0.9 0 0)"
                        },
                        cursor: { stroke: "oklch(0.5 0.22 261 / 0.3)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "11px", paddingTop: "8px" } }),
                    roundFilter === "all" || roundFilter === "technical" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "technical",
                        name: "Technical",
                        stroke: CHART_LINE_COLORS.technical,
                        strokeWidth: 2,
                        dot: { r: 3, fill: CHART_LINE_COLORS.technical },
                        activeDot: { r: 5 },
                        connectNulls: true
                      }
                    ) : null,
                    roundFilter === "all" || roundFilter === "hr" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "hr",
                        name: "HR",
                        stroke: CHART_LINE_COLORS.hr,
                        strokeWidth: 2,
                        dot: { r: 3, fill: CHART_LINE_COLORS.hr },
                        activeDot: { r: 5 },
                        connectNulls: true
                      }
                    ) : null,
                    roundFilter === "all" || roundFilter === "aptitude" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "aptitude",
                        name: "Aptitude",
                        stroke: CHART_LINE_COLORS.aptitude,
                        strokeWidth: 2,
                        dot: { r: 3, fill: CHART_LINE_COLORS.aptitude },
                        activeDot: { r: 5 },
                        connectNulls: true
                      }
                    ) : null
                  ]
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -14 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              className: "bg-card border border-border rounded-xl p-5",
              "data-ocid": "chart-skills",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-1", children: "Skill-wise Interview Success" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Skills correlated with positive interview outcomes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  BarChart,
                  {
                    data: skillData,
                    layout: "vertical",
                    margin: { top: 0, right: 12, bottom: 0, left: 4 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CartesianGrid,
                        {
                          strokeDasharray: "3 3",
                          stroke: "oklch(0.4 0 0 / 0.1)",
                          horizontal: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        XAxis,
                        {
                          type: "number",
                          domain: [0, 100],
                          tick: { fontSize: 10, fill: "oklch(0.6 0 0)" },
                          axisLine: false,
                          tickLine: false,
                          tickFormatter: (v) => `${v}%`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        YAxis,
                        {
                          type: "category",
                          dataKey: "skill",
                          tick: { fontSize: 10, fill: "oklch(0.6 0 0)" },
                          axisLine: false,
                          tickLine: false,
                          width: 80
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tooltip,
                        {
                          contentStyle: {
                            background: "oklch(0.16 0 0)",
                            border: "1px solid oklch(0.25 0 0)",
                            borderRadius: "8px",
                            fontSize: "11px",
                            color: "oklch(0.9 0 0)"
                          },
                          formatter: (v) => [`${v}%`, "Success Rate"]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Bar,
                        {
                          dataKey: "success",
                          name: "Success Rate",
                          fill: "oklch(0.65 0.22 261)",
                          radius: [0, 4, 4, 0]
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
              initial: { opacity: 0, x: 14 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-4",
              "data-ocid": "section-recommended-prep",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Recommended Prep" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Based on your weakest area:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium capitalize", children: ROUND_LABELS[weakest] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/student/mock-interview", "data-ocid": "btn-practice-now", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 12 }),
                    "Practice Now"
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: tips.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleCheck,
                    {
                      size: 13,
                      className: "mt-0.5 shrink-0",
                      style: { color: tips.color }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: item })
                ] }, item)) }),
                COMPANY_TOPICS.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-2.5", children: "Upcoming Company Focus Areas" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: COMPANY_TOPICS.map(({ company, topics }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Briefcase,
                      {
                        size: 11,
                        className: "mt-0.5 text-primary shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-foreground", children: [
                        company,
                        ":",
                        " "
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: topics.join(", ") })
                    ] })
                  ] }, company)) })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border", children: ["upcoming", "history"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab(tab),
              "data-ocid": `tab-${tab}`,
              className: `flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-smooth ${activeTab === tab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`,
              children: tab === "upcoming" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13 }),
                "Upcoming Drives",
                upcomingDrives.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-[10px] h-4 px-1.5",
                    children: upcomingDrives.length
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
                "Interview History",
                sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-[10px] h-4 px-1.5",
                    children: sessions.length
                  }
                )
              ] })
            },
            tab
          )) }),
          activeTab === "upcoming" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-ocid": "table-upcoming-drives", children: upcomingDrives.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-14 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 32, className: "text-muted-foreground/25" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No upcoming drives for your department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Check back soon — new drives are posted regularly." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/50", children: [
              "Company",
              "Date",
              "Status",
              "Tier",
              "Eligibility",
              "Package",
              ""
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "py-2.5 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: upcomingDrives.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(DriveRow, { drive: d, delay: i * 0.06 }, d.id)) })
          ] }) }),
          activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-ocid": "table-interview-history", children: sessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-14 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { size: 32, className: "text-muted-foreground/25" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No interviews yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Start with a mock interview to build your history." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/student/mock-interview", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5",
                "data-ocid": "btn-start-mock",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 13 }),
                  "Start Mock Interview"
                ]
              }
            ) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/50", children: [
              "Company",
              "Date",
              "Round",
              "Score",
              "Result",
              "Feedback"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "py-2.5 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sessions.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryRow, { session: s, delay: i * 0.05 }, s.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "flex items-center gap-2 mb-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 15, className: "text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Prep by Round Type" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: ["technical", "aptitude", "hr", "group-discussion"].map(
            (type, i) => {
              const t = PREP_TIPS[type];
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                PrepTip,
                {
                  title: ROUND_LABELS[type],
                  items: t.items,
                  icon: t.icon,
                  color: t.color,
                  delay: i * 0.08
                },
                type
              );
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            className: "bg-primary/10 border border-primary/25 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4",
            "data-ocid": "cta-mock-interview",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Ready to practice?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Simulate a live interview with AI feedback, voice coaching, and scoring." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/student/mock-interview", "data-ocid": "btn-cta-mock", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 14 }),
                "Start Mock Interview"
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  StudentInterviewPrep as default
};
