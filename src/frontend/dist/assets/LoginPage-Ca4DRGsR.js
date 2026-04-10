import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, d as cn, v as useNavigate, w as Cpu, U as Users, x as loginAsAdmin, y as loginAsStudent, z as saveSession } from "./index-CSqV-Tvs.js";
import { B as Button } from "./button-BmzyXuFv.js";
import { I as Input } from "./input-DmQ9nmEe.js";
import { c as createSlot } from "./index-CLMp4i3a.js";
import { m as motion } from "./proxy-CwEQWttt.js";
import { T as TrendingUp } from "./trending-up-Bxh-st7e.js";
import { A as Award } from "./award-mvM1f5RN.js";
import { G as GraduationCap } from "./graduation-cap-B8IByoLM.js";
import { A as AnimatePresence } from "./index-BJtEWfxE.js";
import { E as Eye } from "./eye-ZV-MVCwA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const features = [
  { icon: TrendingUp, text: "Real-time placement analytics" },
  { icon: Users, text: "120+ student profiles & tracking" },
  { icon: Award, text: "Company tie-ups & package insights" }
];
function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = reactExports.useState("admin");
  const [email, setEmail] = reactExports.useState("");
  const [rollNumber, setRollNumber] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const session = role === "admin" ? loginAsAdmin(email, password) : loginAsStudent(rollNumber, password);
    setLoading(false);
    if (!session) {
      setError(
        role === "admin" ? "Invalid email or password. Please try again." : "Roll number not found or incorrect password."
      );
      return;
    }
    saveSession(session);
    void navigate({
      to: role === "admin" ? "/admin/dashboard" : "/student/dashboard"
    });
  }
  function switchRole(newRole) {
    setRole(newRole);
    setError("");
    setEmail("");
    setRollNumber("");
    setPassword("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex dark bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
        className: "hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden",
        style: {
          background: "linear-gradient(135deg, oklch(0.18 0.08 261) 0%, oklch(0.14 0.12 265) 40%, oklch(0.12 0.06 250) 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 opacity-[0.06]",
              style: {
                backgroundImage: "linear-gradient(oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20",
              style: { background: "oklch(0.65 0.22 261)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                style: { background: "oklch(0.65 0.22 261)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { size: 20, className: "text-white" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-white tracking-tight", children: "Nexus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50", children: "Placement Intelligence" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold leading-tight text-white", children: [
              "Your placement",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.2 261)" }, children: "war room." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-base leading-relaxed max-w-xs", children: "Comprehensive analytics, student tracking, and company management — all in one intelligent dashboard." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: features.map(({ icon: Icon, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                  style: { background: "oklch(0.65 0.22 261 / 0.25)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, style: { color: "oklch(0.78 0.2 261)" } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 text-sm", children: text })
            ] }, text)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              style: {
                background: "oklch(0.65 0.22 261 / 0.15)",
                border: "1px solid oklch(0.65 0.22 261 / 0.3)",
                color: "oklch(0.78 0.18 261)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-current animate-pulse" }),
                "VIT University — Placement Portal 2024"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.15, ease: "easeOut" },
        className: "flex-1 flex items-center justify-center p-6 sm:p-10",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex lg:hidden items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-9 h-9 rounded-xl flex items-center justify-center",
                style: { background: "oklch(0.65 0.22 261)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { size: 18, className: "text-white" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-foreground", children: "Nexus" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Sign in" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Choose your role to continue" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex rounded-lg border border-border bg-muted p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "absolute inset-1 rounded-md",
                style: { background: "oklch(0.65 0.22 261)" },
                animate: {
                  left: role === "admin" ? "4px" : "50%",
                  right: role === "admin" ? "50%" : "4px"
                },
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "role-toggle-admin",
                onClick: () => switchRole("admin"),
                className: `relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${role === "admin" ? "text-white" : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 15 }),
                  "Admin Login"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "role-toggle-student",
                onClick: () => switchRole("student"),
                className: `relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${role === "student" ? "text-white" : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { size: 15 }),
                  "Student Login"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.form,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              transition: { duration: 0.2 },
              onSubmit: handleSubmit,
              className: "space-y-5",
              children: [
                role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "email",
                      className: "text-foreground text-sm font-medium",
                      children: "Email address"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "email",
                      type: "email",
                      "data-ocid": "input-email",
                      placeholder: "admin@nexus.edu",
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      required: true,
                      autoComplete: "email",
                      className: "bg-muted border-input focus:border-primary"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "rollNumber",
                      className: "text-foreground text-sm font-medium",
                      children: "Roll Number"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "rollNumber",
                      type: "text",
                      "data-ocid": "input-roll-number",
                      placeholder: "e.g. 2021CSE0001",
                      value: rollNumber,
                      onChange: (e) => setRollNumber(e.target.value),
                      required: true,
                      autoComplete: "username",
                      className: "bg-muted border-input focus:border-primary"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "password",
                      className: "text-foreground text-sm font-medium",
                      children: "Password"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "password",
                        type: showPassword ? "text" : "password",
                        "data-ocid": "input-password",
                        placeholder: "••••••••",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        required: true,
                        autoComplete: "current-password",
                        className: "bg-muted border-input focus:border-primary pr-10"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": showPassword ? "Hide password" : "Show password",
                        onClick: () => setShowPassword((p) => !p),
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                        children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    exit: { opacity: 0, height: 0 },
                    className: "text-sm rounded-lg px-3 py-2.5",
                    style: {
                      background: "oklch(0.6 0.22 25 / 0.12)",
                      color: "oklch(0.72 0.22 25)",
                      border: "1px solid oklch(0.6 0.22 25 / 0.3)"
                    },
                    "data-ocid": "login-error",
                    children: error
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    "data-ocid": "btn-sign-in",
                    disabled: loading,
                    className: "w-full font-semibold",
                    style: { background: "oklch(0.65 0.22 261)" },
                    children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" }),
                      "Signing in…"
                    ] }) : "Sign In"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-lg p-3 text-xs space-y-2",
                    style: {
                      background: "oklch(0.65 0.22 261 / 0.08)",
                      border: "1px solid oklch(0.65 0.22 261 / 0.2)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-semibold",
                          style: { color: "oklch(0.72 0.18 261)" },
                          children: "Demo credentials"
                        }
                      ),
                      role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Click to fill:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": "demo-fill-admin",
                            onClick: () => {
                              setEmail("admin@nexus.edu");
                              setPassword("admin123");
                            },
                            className: "w-full text-left px-2 py-1.5 rounded-md transition-colors",
                            style: {
                              background: "oklch(0.65 0.22 261 / 0.12)",
                              border: "1px solid oklch(0.65 0.22 261 / 0.25)",
                              color: "oklch(0.78 0.18 261)"
                            },
                            children: "admin@nexus.edu / admin123"
                          }
                        )
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                          "Login uses",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Roll Number" }),
                          " — click any to fill:"
                        ] }),
                        [
                          {
                            roll: "DEMO001",
                            label: "Arjun Sharma (CSE, placed @ Google)"
                          },
                          {
                            roll: "DEMO002",
                            label: "Priya Patel (AI-ML, placed @ Microsoft)"
                          },
                          {
                            roll: "DEMO003",
                            label: "Rohan Kumar (IT, in-progress)"
                          }
                        ].map(({ roll, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            "data-ocid": `demo-fill-${roll.toLowerCase()}`,
                            onClick: () => {
                              setRollNumber(roll);
                              setPassword("student123");
                            },
                            className: "w-full text-left px-2 py-1.5 rounded-md transition-colors",
                            style: {
                              background: "oklch(0.65 0.22 261 / 0.12)",
                              border: "1px solid oklch(0.65 0.22 261 / 0.25)",
                              color: "oklch(0.78 0.18 261)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold", children: roll }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1.5", children: [
                                "— ",
                                label
                              ] })
                            ]
                          },
                          roll
                        )),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground pt-0.5", children: [
                          "Password for all:",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-foreground", children: "student123" })
                        ] })
                      ] })
                    ]
                  }
                )
              ]
            },
            role
          ) })
        ] })
      }
    )
  ] });
}
export {
  LoginPage as default
};
