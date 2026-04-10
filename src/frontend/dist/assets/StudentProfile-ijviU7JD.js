import { c as createLucideIcon, j as jsxRuntimeExports, L as Link, B as Building2, Z as Zap, U as Users } from "./index-CSqV-Tvs.js";
import { u as useStudentData, B as Badge } from "./studentData-eQPEN3Xp.js";
import { G as GraduationCap } from "./graduation-cap-B8IByoLM.js";
import { m as motion } from "./proxy-CwEQWttt.js";
import { C as CircleCheck } from "./circle-check-B0n-UOmI.js";
import { C as Clock, S as Star } from "./star-BeJNHjEv.js";
import { C as CircleAlert } from "./circle-alert-Ypvn_1ON.js";
import { B as BookOpen } from "./book-open-Dy2xt3aw.js";
import { B as Briefcase } from "./briefcase-CebdH36b.js";
import { M as Mic } from "./mic-BhrYS_94.js";
import { A as Award } from "./award-mvM1f5RN.js";
import { C as Calendar } from "./calendar-DBn2fGBd.js";
import { T as TrendingUp } from "./trending-up-Bxh-st7e.js";
import "./index-CLMp4i3a.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
  ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
  ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
];
const CodeXml = createLucideIcon("code-xml", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode);
const STATUS_COLOR = {
  placed: "oklch(0.72 0.2 145)",
  "in-progress": "oklch(0.78 0.18 64)",
  unplaced: "oklch(0.72 0.22 25)"
};
const STATUS_BG = {
  placed: "oklch(0.55 0.18 145 / 0.18)",
  "in-progress": "oklch(0.62 0.18 64 / 0.18)",
  unplaced: "oklch(0.55 0.22 25 / 0.18)"
};
const STATUS_BORDER = {
  placed: "oklch(0.55 0.18 145 / 0.4)",
  "in-progress": "oklch(0.62 0.18 64 / 0.4)",
  unplaced: "oklch(0.55 0.22 25 / 0.4)"
};
const STATUS_LABEL = {
  placed: "Placed",
  "in-progress": "In Progress",
  unplaced: "Not Yet Placed"
};
function scoreColor(pct) {
  if (pct >= 75) return "oklch(0.68 0.19 142)";
  if (pct >= 50) return "oklch(0.72 0.18 64)";
  return "oklch(0.65 0.22 25)";
}
function ScoreBar({
  label,
  value,
  max
}) {
  const pct = value / max * 100;
  const color = scoreColor(pct);
  const isGood = pct >= 75;
  const isMid = pct >= 50;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "/ ",
          max
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
            style: { background: `${color}22`, color },
            children: isGood ? "Excellent" : isMid ? "Good" : "Needs Work"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { width: 0 },
        animate: { width: `${pct}%` },
        transition: { duration: 1, ease: "easeOut", delay: 0.3 },
        className: "h-full rounded-full",
        style: {
          background: `linear-gradient(to right, ${color}, ${color.replace("/ 1", "")}cc)`
        }
      }
    ) })
  ] });
}
function CircleScore({
  value,
  max,
  label
}) {
  const pct = value / max * 100;
  const color = scoreColor(pct);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = pct / 100 * circumference;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-24 h-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          className: "w-full h-full -rotate-90",
          viewBox: "0 0 88 88",
          role: "img",
          "aria-label": `${label}: ${value} out of ${max}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: `${label}: ${value} / ${max}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "44",
                cy: "44",
                r: radius,
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "7",
                className: "text-muted/50"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.circle,
              {
                cx: "44",
                cy: "44",
                r: radius,
                fill: "none",
                stroke: color,
                strokeWidth: "7",
                strokeLinecap: "round",
                strokeDasharray: `${circumference}`,
                initial: { strokeDashoffset: circumference },
                animate: { strokeDashoffset: circumference - strokeDash },
                transition: { duration: 1.2, ease: "easeOut", delay: 0.4 }
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-foreground", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
          "/",
          max
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label })
  ] });
}
function StatMiniCard({
  icon: Icon,
  label,
  value,
  color,
  delay
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay },
      className: "bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-smooth",
      "data-ocid": "stat-mini-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            style: { background: `${color}22` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground leading-none", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: label })
        ] })
      ]
    }
  );
}
const PROG_SKILLS = /* @__PURE__ */ new Set([
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
  "Angular"
]);
const TOOL_SKILLS = /* @__PURE__ */ new Set([
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
  "CNC"
]);
function categorizeSkills(skills) {
  const programming = [];
  const tools = [];
  const other = [];
  for (const s of skills) {
    if (PROG_SKILLS.has(s)) programming.push(s);
    else if (TOOL_SKILLS.has(s)) tools.push(s);
    else other.push(s);
  }
  return { programming, tools, other };
}
function StudentProfile() {
  const { student, stats } = useStudentData();
  if (!student) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-96 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 48, className: "text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Profile Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Please",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "log in" }),
        " ",
        "again."
      ] })
    ] });
  }
  const status = student.placement_status;
  const peer = stats == null ? void 0 : stats.peer_benchmark;
  const initials = student.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const skillCats = categorizeSkills(student.skills);
  const completedSessions = (stats == null ? void 0 : stats.interview_sessions.filter((s) => s.status === "completed").length) ?? 0;
  const offersReceived = ((stats == null ? void 0 : stats.applications_by_status.offered) ?? 0) + ((stats == null ? void 0 : stats.applications_by_status.hired) ?? 0);
  const practiceSessions = (stats == null ? void 0 : stats.interview_sessions.filter((s) => s.type === "mock").length) ?? 0;
  const cgpaPct = student.cgpa / 10 * 100;
  const deptRank = peer ? `Top ${(100 - peer.dept_cgpa_percentile).toFixed(0)}% in ${student.department}` : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "px-6 py-7 space-y-6 max-w-6xl mx-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "My Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Your academic & placement profile at a glance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.08 },
            className: "relative bg-card border border-border rounded-2xl overflow-hidden",
            "data-ocid": "profile-header-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-28 w-full",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.32 0.18 261) 0%, oklch(0.22 0.14 280) 50%, oklch(0.18 0.1 261) 100%)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0 h-28 opacity-20",
                      style: {
                        backgroundImage: "radial-gradient(circle, oklch(0.85 0.1 261) 1px, transparent 1px)",
                        backgroundSize: "24px 24px"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between -mt-10 mb-4 flex-wrap gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-20 h-20 rounded-2xl border-4 border-card flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.5 0.22 261), oklch(0.42 0.2 280))"
                        },
                        children: initials
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground leading-tight", children: student.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                        student.department,
                        " · ",
                        student.school,
                        " · Batch",
                        " ",
                        student.batch
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap pb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                        style: {
                          background: STATUS_BG[status],
                          color: STATUS_COLOR[status],
                          border: `1px solid ${STATUS_BORDER[status]}`
                        },
                        "data-ocid": "placement-status-badge",
                        children: [
                          status === "placed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }) : status === "in-progress" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
                          STATUS_LABEL[status]
                        ]
                      }
                    ),
                    student.package_lpa && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold badge-chart-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 11 }),
                      "₹",
                      student.package_lpa,
                      " LPA"
                    ] }),
                    student.placed_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold badge-chart-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 11 }),
                      student.placed_at
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 13, className: "text-primary/70" }),
                    student.email
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 13, className: "text-primary/70" }),
                    "Roll No:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground ml-1", children: student.roll_number })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13, className: "text-primary/70" }),
                    "Section ",
                    student.section
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 13, className: "text-primary/70" }),
                    student.programme
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatMiniCard,
            {
              icon: Briefcase,
              label: "Applications Submitted",
              value: (stats == null ? void 0 : stats.total_applications) ?? 0,
              color: "oklch(0.65 0.22 261)",
              delay: 0.12
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatMiniCard,
            {
              icon: Mic,
              label: "Interviews Completed",
              value: completedSessions,
              color: "oklch(0.65 0.16 200)",
              delay: 0.16
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatMiniCard,
            {
              icon: Award,
              label: "Offers Received",
              value: offersReceived,
              color: "oklch(0.68 0.19 142)",
              delay: 0.2
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatMiniCard,
            {
              icon: Zap,
              label: "Practice Sessions",
              value: practiceSessions,
              color: "oklch(0.72 0.18 64)",
              delay: 0.24
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -16 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.4, delay: 0.14 },
                className: "bg-card border border-border rounded-xl p-5",
                "data-ocid": "academic-info-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 15, className: "text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Academic Information" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
                    {
                      icon: BookOpen,
                      label: "Roll Number",
                      value: student.roll_number,
                      bold: true
                    },
                    {
                      icon: GraduationCap,
                      label: "Programme",
                      value: student.programme,
                      bold: false
                    },
                    {
                      icon: Building2,
                      label: "School / Faculty",
                      value: student.school,
                      bold: false
                    },
                    {
                      icon: Calendar,
                      label: "Batch Year",
                      value: `${student.batch}`,
                      bold: false
                    },
                    {
                      icon: MapPin,
                      label: "Section",
                      value: `Section ${student.section}`,
                      bold: false
                    },
                    {
                      icon: Users,
                      label: "Department",
                      value: student.department,
                      bold: false
                    }
                  ].map(({ icon: Icon, label, value, bold }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Icon,
                      {
                        size: 13,
                        className: "text-primary/60 mt-0.5 flex-shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex items-baseline justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0", children: label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-xs text-right truncate ${bold ? "font-bold text-primary" : "font-medium text-foreground"}`,
                          children: value
                        }
                      )
                    ] })
                  ] }, label)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -16 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.4, delay: 0.2 },
                className: "bg-card border border-border rounded-xl p-5",
                "data-ocid": "placement-status-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 15, className: "text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Placement Status" })
                  ] }),
                  status === "placed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-2 px-3 py-2.5 rounded-lg",
                        style: {
                          background: STATUS_BG.placed,
                          border: `1px solid ${STATUS_BORDER.placed}`
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CircleCheck,
                            {
                              size: 16,
                              style: { color: STATUS_COLOR.placed }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-sm font-semibold",
                              style: { color: STATUS_COLOR.placed },
                              children: "Successfully Placed!"
                            }
                          )
                        ]
                      }
                    ),
                    student.placed_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1.5 border-b border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Company" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: student.placed_at })
                    ] }),
                    student.package_lpa && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1.5 border-b border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "CTC Package" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
                        "₹",
                        student.package_lpa,
                        " LPA"
                      ] })
                    ] }),
                    ((stats == null ? void 0 : stats.avg_package_dept) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "vs Dept. Avg" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-xs font-semibold",
                          style: {
                            color: (student.package_lpa ?? 0) >= ((stats == null ? void 0 : stats.avg_package_dept) ?? 0) ? "oklch(0.68 0.19 142)" : "oklch(0.65 0.22 25)"
                          },
                          children: [
                            "Dept avg ₹",
                            stats == null ? void 0 : stats.avg_package_dept,
                            " LPA"
                          ]
                        }
                      )
                    ] })
                  ] }),
                  status === "in-progress" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-2 px-3 py-2.5 rounded-lg",
                        style: {
                          background: STATUS_BG["in-progress"],
                          border: `1px solid ${STATUS_BORDER["in-progress"]}`
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Clock,
                            {
                              size: 16,
                              style: { color: STATUS_COLOR["in-progress"] }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-sm font-semibold",
                              style: { color: STATUS_COLOR["in-progress"] },
                              children: "Placement Process Active"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1.5 border-b border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Active Applications" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: ((stats == null ? void 0 : stats.applications_by_status.applied) ?? 0) + ((stats == null ? void 0 : stats.applications_by_status.shortlisted) ?? 0) + ((stats == null ? void 0 : stats.applications_by_status.interviewing) ?? 0) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1.5 border-b border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Scheduled Interviews" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: (stats == null ? void 0 : stats.upcoming_interview_count) ?? 0 })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Shortlisted" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: (stats == null ? void 0 : stats.applications_by_status.shortlisted) ?? 0 })
                    ] })
                  ] }),
                  status === "unplaced" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-2 px-3 py-2.5 rounded-lg",
                        style: {
                          background: STATUS_BG.unplaced,
                          border: `1px solid ${STATUS_BORDER.unplaced}`
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CircleAlert,
                            {
                              size: 16,
                              style: { color: STATUS_COLOR.unplaced }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-sm font-semibold",
                              style: { color: STATUS_COLOR.unplaced },
                              children: "Not Yet Placed"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-1", children: "Recommended next steps:" }),
                    [
                      "Complete mock interview sessions",
                      "Improve aptitude & coding scores",
                      "Apply to upcoming campus drives",
                      "Build domain-specific skills"
                    ].map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: step })
                    ] }, step))
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 16 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.4, delay: 0.14 },
                className: "bg-card border border-border rounded-xl p-5",
                "data-ocid": "academic-performance-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 15, className: "text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Academic Performance" }),
                    deptRank && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full badge-chart-2", children: deptRank })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-6 items-start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleScore, { value: student.cgpa, max: 10, label: "CGPA" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                          style: {
                            background: `${scoreColor(cgpaPct)}22`,
                            color: scoreColor(cgpaPct)
                          },
                          children: cgpaPct >= 75 ? "Distinction" : cgpaPct >= 60 ? "First Class" : "Pass"
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-4 w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ScoreBar,
                        {
                          label: "Aptitude Score",
                          value: student.aptitude_score,
                          max: 100
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ScoreBar,
                        {
                          label: "Programming Score",
                          value: student.programming_score,
                          max: 100
                        }
                      ),
                      peer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-border", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-2 uppercase tracking-wide font-medium", children: "vs Department Average" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
                          {
                            label: "CGPA",
                            mine: peer.student_cgpa,
                            avg: peer.dept_avg_cgpa,
                            pct: peer.dept_cgpa_percentile,
                            max: 10
                          },
                          {
                            label: "Aptitude",
                            mine: peer.student_aptitude,
                            avg: peer.dept_avg_aptitude,
                            pct: peer.dept_aptitude_percentile,
                            max: 100
                          },
                          {
                            label: "Programming",
                            mine: peer.student_programming,
                            avg: peer.dept_avg_programming,
                            pct: peer.dept_programming_percentile,
                            max: 100
                          }
                        ].map(({ label, mine, avg, pct }) => {
                          const isAbove = mine >= avg;
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "flex items-center justify-between gap-3 text-xs",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-24 flex-shrink-0", children: label }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className: "h-full rounded-full opacity-40 bg-primary",
                                    style: {
                                      width: `${avg / (label === "CGPA" ? 10 : 100) * 100}%`
                                    }
                                  }
                                ) }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    className: "font-semibold w-14 text-right flex-shrink-0",
                                    style: {
                                      color: isAbove ? "oklch(0.68 0.19 142)" : "oklch(0.65 0.22 25)"
                                    },
                                    children: [
                                      "Top ",
                                      (100 - pct).toFixed(0),
                                      "%"
                                    ]
                                  }
                                )
                              ]
                            },
                            label
                          );
                        }) })
                      ] })
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 16 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.4, delay: 0.22 },
                className: "bg-card border border-border rounded-xl p-5",
                "data-ocid": "skills-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 15, className: "text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Skills & Competencies" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
                      student.skills.length,
                      " skills"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    skillCats.programming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { size: 10 }),
                        " Languages & Frameworks"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: skillCats.programming.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge-chart-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { size: 10 }),
                            skill
                          ]
                        },
                        skill
                      )) })
                    ] }),
                    skillCats.tools.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 10 }),
                        " Tools & Platforms"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: skillCats.tools.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge-chart-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 10 }),
                            skill
                          ]
                        },
                        skill
                      )) })
                    ] }),
                    skillCats.other.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10 }),
                        " Domain & Soft Skills"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: skillCats.other.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium badge-chart-5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10 }),
                            skill
                          ]
                        },
                        skill
                      )) })
                    ] }),
                    student.skills.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No skills added yet." })
                  ] })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  StudentProfile as default
};
