import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, X, d as cn, D as DEPARTMENTS, k as SCHOOLS, m as mockStudents, e as monthlyTrendData, g as getDeptStats, l as getCGPAPlacementData, n as getAtRiskStudents, o as getSectionStats, p as ChevronRight, q as getTopCompanies, s as getPackageDistribution, t as getSkillGapData } from "./index-CSqV-Tvs.js";
import { F as Funnel } from "./funnel-zRavAi_H.js";
import { m as motion } from "./proxy-CwEQWttt.js";
import { T as TriangleAlert } from "./triangle-alert-H0wJ8vJ1.js";
import { R as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, b as Line, B as Bar, a as Cell } from "./generateCategoricalChart-C-v2pZKU.js";
import { L as LineChart, B as BarChart } from "./BarChart-DsGql0PG.js";
import { C as ChevronDown } from "./chevron-down-DNwSYK3o.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
function applyFilters(filters) {
  return mockStudents.filter((s) => {
    if (filters.departments.length && !filters.departments.includes(s.department))
      return false;
    if (filters.schools.length && !filters.schools.includes(s.school))
      return false;
    if (filters.batch && String(s.batch) !== filters.batch) return false;
    if (filters.section && s.section !== filters.section) return false;
    return true;
  });
}
function ChipGroup({
  options,
  selected,
  onChange,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
      label,
      ":"
    ] }),
    options.map((opt) => {
      const active = selected.includes(opt);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(
            active ? selected.filter((s) => s !== opt) : [...selected, opt]
          ),
          className: cn(
            "px-2.5 py-1 text-xs font-medium rounded-full border transition-smooth",
            active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          ),
          children: opt
        },
        opt
      );
    })
  ] });
}
function MetricCards({ students }) {
  const placed = students.filter((s) => s.placement_status === "placed");
  const unplaced = students.filter((s) => s.placement_status === "unplaced");
  const avgPkg = placed.filter((s) => s.package_lpa).reduce((a, s) => a + (s.package_lpa ?? 0), 0) / (placed.filter((s) => s.package_lpa).length || 1);
  const highPkg = Math.max(
    0,
    ...placed.filter((s) => s.package_lpa).map((s) => s.package_lpa ?? 0)
  );
  const totalApps = mockStudents.length * 2;
  const metrics = [
    {
      label: "Total Students",
      value: students.length,
      color: "oklch(0.50 0.22 261)"
    },
    { label: "Placed", value: placed.length, color: "oklch(0.58 0.18 142)" },
    { label: "Unplaced", value: unplaced.length, color: "oklch(0.55 0.22 25)" },
    {
      label: "Placement Rate",
      value: `${students.length ? (placed.length / students.length * 100).toFixed(1) : 0}%`,
      color: "oklch(0.60 0.16 200)"
    },
    {
      label: "Avg Package",
      value: `${avgPkg.toFixed(1)} LPA`,
      color: "oklch(0.72 0.18 64)"
    },
    {
      label: "Highest Package",
      value: `${highPkg.toFixed(1)} LPA`,
      color: "oklch(0.55 0.20 280)"
    },
    {
      label: "Total Applications",
      value: totalApps,
      color: "oklch(0.65 0.19 137)"
    },
    {
      label: "Conversion Rate",
      value: `${(placed.length / (totalApps || 1) * 100).toFixed(1)}%`,
      color: "oklch(0.60 0.16 200)"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-1", children: metrics.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      className: "flex-shrink-0 bg-card border border-border rounded-xl p-4 min-w-[140px]",
      "data-ocid": `metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`,
      style: { borderTopColor: m.color, borderTopWidth: 2 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium mb-1", children: m.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: m.value })
      ]
    },
    m.label
  )) });
}
function DeptComparison({ deptFilter }) {
  const allStats = getDeptStats();
  const stats = deptFilter.length ? allStats.filter((d) => deptFilter.includes(d.department)) : allStats;
  const chartData = stats.map((d) => ({
    dept: d.department,
    Placed: d.placed,
    "In-Progress": d.in_progress,
    Unplaced: d.unplaced
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, barCategoryGap: "30%", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.92 0 0)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        XAxis,
        {
          dataKey: "dept",
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
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconSize: 10, wrapperStyle: { fontSize: "11px" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Bar,
        {
          dataKey: "Placed",
          fill: "oklch(0.58 0.18 142)",
          stackId: "a",
          radius: [0, 0, 0, 0]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "In-Progress", fill: "oklch(0.72 0.18 64)", stackId: "a" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Bar,
        {
          dataKey: "Unplaced",
          fill: "oklch(0.55 0.22 25)",
          stackId: "a",
          radius: [3, 3, 0, 0]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs data-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Dept",
        "School",
        "Total",
        "Placed",
        "Rate%",
        "Avg CGPA",
        "Avg Aptitude",
        "Avg Prog.",
        "Fail%",
        "Top Skills"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: stats.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "hover:bg-muted/40 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-semibold text-foreground", children: d.department }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-muted-foreground", children: d.school }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: d.total }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-[oklch(0.58_0.18_142)] font-medium", children: d.placed }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: cn(
                  "px-3 py-2.5 font-bold",
                  d.placement_rate >= 70 ? "text-[oklch(0.58_0.18_142)]" : d.placement_rate >= 40 ? "text-[oklch(0.72_0.18_64)]" : "text-destructive"
                ),
                children: [
                  d.placement_rate,
                  "%"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: d.avg_cgpa }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: d.avg_aptitude }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: d.avg_programming }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 text-destructive", children: [
              d.failure_rate,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-muted-foreground", children: d.top_skills.join(", ") })
          ]
        },
        d.department
      )) })
    ] }) })
  ] });
}
function FailureAnalysis() {
  const cgpaData = getCGPAPlacementData();
  const atRisk = getAtRiskStudents(10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-3", children: "Placement Rate by CGPA Range" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: cgpaData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.92 0 0)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "range",
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
            unit: "%"
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
            formatter: (v) => [`${v}%`, "Placement Rate"]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            dataKey: "rate",
            fill: "oklch(0.50 0.22 261)",
            radius: [4, 4, 0, 0]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14, className: "text-[oklch(0.72_0.18_64)]" }),
        "At-Risk Students (Unplaced)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-52 overflow-y-auto pr-1", children: atRisk.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors",
          "data-ocid": `at-risk-${i}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-muted-foreground w-5", children: [
                i + 1,
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: s.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  s.department,
                  " · CGPA ",
                  s.cgpa
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-destructive", children: [
                s.risk_score.toFixed(0),
                " risk"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                "Apt:",
                s.aptitude_score
              ] })
            ] })
          ]
        },
        s.id
      )) })
    ] })
  ] });
}
function SectionDrillDown() {
  const [selectedDept, setSelectedDept] = reactExports.useState("CSE");
  const [expandedSection, setExpandedSection] = reactExports.useState(null);
  const sections = getSectionStats(selectedDept);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Select Department:" }),
      DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setSelectedDept(d);
            setExpandedSection(null);
          },
          className: cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg border transition-smooth",
            selectedDept === d ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
          ),
          children: d
        },
        d
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: sections.map((sec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border rounded-xl overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setExpandedSection(
                expandedSection === sec.section ? null : sec.section
              ),
              className: "w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/40 transition-colors",
              "data-ocid": `section-${sec.section}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: sec.section }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    sec.total,
                    " students"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[oklch(0.58_0.18_142)]", children: [
                    sec.placed,
                    " placed"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: cn(
                        "text-xs font-bold",
                        sec.placement_rate >= 70 ? "text-[oklch(0.58_0.18_142)]" : sec.placement_rate >= 40 ? "text-[oklch(0.72_0.18_64)]" : "text-destructive"
                      ),
                      children: [
                        sec.placement_rate,
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Avg CGPA: ",
                    sec.avg_cgpa
                  ] })
                ] }),
                expandedSection === sec.section ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: "text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground" })
              ]
            }
          ),
          expandedSection === sec.section && sec.students.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs data-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
              "Name",
              "CGPA",
              "Aptitude",
              "Programming",
              "Skills",
              "Status",
              "Company"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-3 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: sec.students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "hover:bg-muted/40 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: s.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: s.cgpa }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: s.aptitude_score }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: s.programming_score }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground max-w-[150px] truncate", children: s.skills.slice(0, 2).join(", ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-medium",
                        s.placement_status === "placed" ? "status-placed" : s.placement_status === "in-progress" ? "status-in-progress" : "status-unplaced"
                      ),
                      children: s.placement_status
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: s.placed_at ?? "-" })
                ]
              },
              s.id
            )) })
          ] }) })
        ]
      },
      sec.section
    )) })
  ] });
}
const PKG_COLORS = [
  "oklch(0.55 0.22 25)",
  "oklch(0.72 0.18 64)",
  "oklch(0.65 0.22 261)",
  "oklch(0.60 0.16 200)",
  "oklch(0.58 0.18 142)"
];
function CompanyAnalytics() {
  const topCompanies = getTopCompanies(8);
  const pkgDist = getPackageDistribution();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-3", children: "Top Hiring Companies" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: topCompanies.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 px-3 py-2.5 bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground w-5", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: c.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: c.departments.join(", ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-primary", children: [
              c.hired,
              " hired"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              c.avg_package,
              " LPA"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-medium",
                  c.tier === 1 ? "bg-primary/15 text-primary" : c.tier === 2 ? "bg-[oklch(0.60_0.16_200)]/15 text-[oklch(0.60_0.16_200)]" : "bg-muted text-muted-foreground"
                ),
                children: [
                  "T",
                  c.tier
                ]
              }
            )
          ]
        },
        c.name
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground mb-3", children: "Package Distribution" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: pkgDist, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0.92 0 0)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "range",
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
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", radius: [4, 4, 0, 0], name: "Students", children: pkgDist.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Cell,
          {
            fill: PKG_COLORS[i % PKG_COLORS.length]
          },
          entry.range
        )) })
      ] }) })
    ] })
  ] });
}
function SkillGapChart() {
  const data = getSkillGapData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Comparing skills companies demand vs skills students have. Larger gaps = training priorities." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data, layout: "vertical", barCategoryGap: "25%", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CartesianGrid,
        {
          strokeDasharray: "3 3",
          stroke: "oklch(0.92 0 0)",
          horizontal: false
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        XAxis,
        {
          type: "number",
          tick: { fontSize: 11, fill: "oklch(0.5 0 0)" },
          axisLine: false,
          tickLine: false
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        YAxis,
        {
          type: "category",
          dataKey: "skill",
          tick: { fontSize: 11, fill: "oklch(0.5 0 0)" },
          axisLine: false,
          tickLine: false,
          width: 90
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
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconSize: 10, wrapperStyle: { fontSize: "11px" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Bar,
        {
          dataKey: "demand",
          fill: "oklch(0.50 0.22 261)",
          name: "Company Demand",
          radius: [0, 4, 4, 0]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Bar,
        {
          dataKey: "supply",
          fill: "oklch(0.58 0.18 142)",
          name: "Student Supply",
          radius: [0, 4, 4, 0]
        }
      )
    ] }) })
  ] });
}
const MEDAL_COLORS = [
  "oklch(0.72 0.18 64)",
  "oklch(0.65 0 0)",
  "oklch(0.55 0.20 50)"
];
function Leaderboard() {
  const top10 = mockStudents.filter((s) => s.placement_status === "placed" && s.package_lpa).sort((a, b) => (b.package_lpa ?? 0) - (a.package_lpa ?? 0)).slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: top10.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: i * 0.05 },
      className: "flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary/40 transition-smooth",
      "data-ocid": `leaderboard-${i + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm",
            style: {
              background: i < 3 ? `${MEDAL_COLORS[i]}20` : "oklch(0.9 0 0 / 0.3)",
              color: i < 3 ? MEDAL_COLORS[i] : "oklch(0.5 0 0)"
            },
            children: i < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 15 }) : i + 1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            s.department,
            " · CGPA ",
            s.cgpa
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-primary", children: [
            s.package_lpa,
            " LPA"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-[100px]", children: s.placed_at })
        ] })
      ]
    },
    s.id
  )) });
}
function TrendChart({ deptFilter }) {
  const [view, setView] = reactExports.useState("monthly");
  const baseData = view === "weekly" ? monthlyTrendData.slice(0, 8).map((d, i) => ({
    ...d,
    month: `W${i + 1}`,
    applications: Math.round(d.applications / 4),
    placements: Math.round(d.placements / 4)
  })) : monthlyTrendData;
  const DEPT_COLORS = {
    CSE: "oklch(0.50 0.22 261)",
    IT: "oklch(0.60 0.16 200)",
    ECE: "oklch(0.55 0.20 280)",
    "AI-ML": "oklch(0.72 0.18 64)",
    CE: "oklch(0.58 0.18 142)",
    ME: "oklch(0.55 0.22 25)"
  };
  const activeDepts = deptFilter.length ? deptFilter : ["CSE", "IT"];
  const deptTrendData = baseData.map((point, idx) => {
    const row = { month: point.month };
    for (const dept of activeDepts) {
      const offset = ["CSE", "IT", "ECE", "AI-ML", "CE", "ME"].indexOf(dept);
      row[dept] = Math.max(
        1,
        Math.round(
          point.placements * (0.6 + offset * 0.08) + Math.sin(idx + offset) * 2
        )
      );
    }
    return row;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Placement trend per department over time" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["monthly", "weekly"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setView(v),
          className: cn(
            "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth capitalize",
            view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          ),
          children: v.charAt(0).toUpperCase() + v.slice(1, 3)
        },
        v
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: deptTrendData, children: [
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
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconSize: 10, wrapperStyle: { fontSize: "11px" } }),
      activeDepts.map((dept) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Line,
        {
          type: "monotone",
          dataKey: dept,
          stroke: DEPT_COLORS[dept],
          strokeWidth: 2,
          dot: false
        },
        dept
      ))
    ] }) })
  ] });
}
function AdminAnalytics() {
  const [filters, setFilters] = reactExports.useState({
    departments: [],
    schools: [],
    batch: "",
    section: "",
    dateRange: "year"
  });
  const [showFilters, setShowFilters] = reactExports.useState(false);
  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  function clearFilters() {
    setFilters({
      departments: [],
      schools: [],
      batch: "",
      section: "",
      dateRange: "year"
    });
  }
  const hasFilters = filters.departments.length || filters.schools.length || filters.batch || filters.section || filters.dateRange !== "year";
  const filteredStudents = reactExports.useMemo(() => applyFilters(filters), [filters]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-card border-b border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground font-display", children: "Analytics Deep-Dive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: [
            filteredStudents.length,
            " students"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: clearFilters,
              className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
              "data-ocid": "clear-filters",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
                " Clear All"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowFilters((f) => !f),
              className: cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-smooth",
                showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
              ),
              "data-ocid": "toggle-filters",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 12 }),
                " Filters ",
                hasFilters ? "(active)" : ""
              ]
            }
          )
        ] })
      ] }),
      showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          className: "space-y-3 pt-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChipGroup,
              {
                options: DEPARTMENTS,
                selected: filters.departments,
                onChange: (v) => updateFilter("departments", v),
                label: "Dept"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChipGroup,
              {
                options: SCHOOLS,
                selected: filters.schools,
                onChange: (v) => updateFilter("schools", v),
                label: "School"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Batch:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: filters.batch,
                    onChange: (e) => updateFilter("batch", e.target.value),
                    className: "text-xs bg-card border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:border-primary",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All" }),
                      [2021, 2022, 2023, 2024].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: b, children: b }, b))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Date:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["7d", "30d", "quarter", "year"].map(
                  (d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => updateFilter("dateRange", d),
                      className: cn(
                        "px-2.5 py-1 text-[11px] font-medium rounded-md transition-smooth",
                        filters.dateRange === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                      ),
                      children: d
                    },
                    d
                  )
                ) })
              ] })
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCards, { students: filteredStudents }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-1", children: "Placement Trend Over Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendChart, { deptFilter: filters.departments })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.05 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Department Comparison" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DeptComparison, { deptFilter: filters.departments })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.08 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16, className: "text-[oklch(0.72_0.18_64)]" }),
              " ",
              "Failure Analysis"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FailureAnalysis, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Section-Level Drill-Down" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionDrillDown, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.12 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Company Analytics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyAnalytics, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.14 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-2", children: "Skill Demand vs Supply" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SkillGapChart, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.16 },
          className: "bg-card border border-border rounded-xl p-5 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 16, className: "text-[oklch(0.72_0.18_64)]" }),
              " Top 10 Students by Package"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Leaderboard, {})
          ]
        }
      )
    ] })
  ] });
}
export {
  AdminAnalytics as default
};
