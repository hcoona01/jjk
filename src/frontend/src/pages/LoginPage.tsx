import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAsAdmin, loginAsStudent, saveSession } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  Cpu,
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Role = "admin" | "student";

const features = [
  { icon: TrendingUp, text: "Real-time placement analytics" },
  { icon: Users, text: "120+ student profiles & tracking" },
  { icon: Award, text: "Company tie-ups & package insights" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const session =
      role === "admin"
        ? loginAsAdmin(email, password)
        : loginAsStudent(rollNumber, password);

    setLoading(false);

    if (!session) {
      setError(
        role === "admin"
          ? "Invalid email or password. Please try again."
          : "Roll number not found or incorrect password.",
      );
      return;
    }

    saveSession(session);
    void navigate({
      to: role === "admin" ? "/admin/dashboard" : "/student/dashboard",
    });
  }

  function switchRole(newRole: Role) {
    setRole(newRole);
    setError("");
    setEmail("");
    setRollNumber("");
    setPassword("");
  }

  return (
    <div className="min-h-screen flex dark bg-background">
      {/* Left Panel — Decorative */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.08 261) 0%, oklch(0.14 0.12 265) 40%, oklch(0.12 0.06 250) 100%)",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.65 0.22 261)" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "oklch(0.65 0.22 261)" }}
          >
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-white tracking-tight">Nexus</p>
            <p className="text-xs text-white/50">Placement Intelligence</p>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Your placement
            <br />
            <span style={{ color: "oklch(0.72 0.2 261)" }}>war room.</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xs">
            Comprehensive analytics, student tracking, and company management —
            all in one intelligent dashboard.
          </p>
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.65 0.22 261 / 0.25)" }}
                >
                  <Icon size={14} style={{ color: "oklch(0.78 0.2 261)" }} />
                </div>
                <span className="text-white/70 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "oklch(0.65 0.22 261 / 0.15)",
              border: "1px solid oklch(0.65 0.22 261 / 0.3)",
              color: "oklch(0.78 0.18 261)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            VIT University — Placement Portal 2024
          </div>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center p-6 sm:p-10"
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.65 0.22 261)" }}
            >
              <Cpu size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">Nexus</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="text-muted-foreground text-sm">
              Choose your role to continue
            </p>
          </div>

          {/* Role Toggle */}
          <div className="relative flex rounded-lg border border-border bg-muted p-1">
            <motion.div
              className="absolute inset-1 rounded-md"
              style={{ background: "oklch(0.65 0.22 261)" }}
              animate={{
                left: role === "admin" ? "4px" : "50%",
                right: role === "admin" ? "50%" : "4px",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              type="button"
              data-ocid="role-toggle-admin"
              onClick={() => switchRole("admin")}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                role === "admin"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield size={15} />
              Admin Login
            </button>
            <button
              type="button"
              data-ocid="role-toggle-student"
              onClick={() => switchRole("student")}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                role === "student"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap size={15} />
              Student Login
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {role === "admin" ? (
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground text-sm font-medium"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="input-email"
                    placeholder="admin@nexus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="bg-muted border-input focus:border-primary"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label
                    htmlFor="rollNumber"
                    className="text-foreground text-sm font-medium"
                  >
                    Roll Number
                  </Label>
                  <Input
                    id="rollNumber"
                    type="text"
                    data-ocid="input-roll-number"
                    placeholder="e.g. 2021CSE0001"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                    autoComplete="username"
                    className="bg-muted border-input focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    data-ocid="input-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-muted border-input focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm rounded-lg px-3 py-2.5"
                    style={{
                      background: "oklch(0.6 0.22 25 / 0.12)",
                      color: "oklch(0.72 0.22 25)",
                      border: "1px solid oklch(0.6 0.22 25 / 0.3)",
                    }}
                    data-ocid="login-error"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                data-ocid="btn-sign-in"
                disabled={loading}
                className="w-full font-semibold"
                style={{ background: "oklch(0.65 0.22 261)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Demo hint */}
              <div
                className="rounded-lg p-3 text-xs space-y-2"
                style={{
                  background: "oklch(0.65 0.22 261 / 0.08)",
                  border: "1px solid oklch(0.65 0.22 261 / 0.2)",
                }}
              >
                <p
                  className="font-semibold"
                  style={{ color: "oklch(0.72 0.18 261)" }}
                >
                  Demo credentials
                </p>
                {role === "admin" ? (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Click to fill:</p>
                    <button
                      type="button"
                      data-ocid="demo-fill-admin"
                      onClick={() => {
                        setEmail("admin@nexus.edu");
                        setPassword("admin123");
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-md transition-colors"
                      style={{
                        background: "oklch(0.65 0.22 261 / 0.12)",
                        border: "1px solid oklch(0.65 0.22 261 / 0.25)",
                        color: "oklch(0.78 0.18 261)",
                      }}
                    >
                      admin@nexus.edu / admin123
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground">
                      Login uses{" "}
                      <strong className="text-foreground">Roll Number</strong> —
                      click any to fill:
                    </p>
                    {[
                      {
                        roll: "DEMO001",
                        label: "Arjun Sharma (CSE, placed @ Google)",
                      },
                      {
                        roll: "DEMO002",
                        label: "Priya Patel (AI-ML, placed @ Microsoft)",
                      },
                      {
                        roll: "DEMO003",
                        label: "Rohan Kumar (IT, in-progress)",
                      },
                    ].map(({ roll, label }) => (
                      <button
                        key={roll}
                        type="button"
                        data-ocid={`demo-fill-${roll.toLowerCase()}`}
                        onClick={() => {
                          setRollNumber(roll);
                          setPassword("student123");
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-md transition-colors"
                        style={{
                          background: "oklch(0.65 0.22 261 / 0.12)",
                          border: "1px solid oklch(0.65 0.22 261 / 0.25)",
                          color: "oklch(0.78 0.18 261)",
                        }}
                      >
                        <span className="font-mono font-bold">{roll}</span>
                        <span className="text-muted-foreground ml-1.5">
                          — {label}
                        </span>
                      </button>
                    ))}
                    <p className="text-muted-foreground pt-0.5">
                      Password for all:{" "}
                      <span className="font-mono font-bold text-foreground">
                        student123
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
