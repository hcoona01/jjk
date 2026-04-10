import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStudentData } from "@/lib/studentData";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  ScrollText,
  Sparkles,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ResumeSection {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ResumeProject {
  id: string;
  name: string;
  tech: string;
  description: string;
}

// ─── ATS Score ring ────────────────────────────────────────────────────────────
function ATSRing({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 80
      ? "oklch(0.72 0.2 145)"
      : score >= 60
        ? "oklch(0.78 0.18 64)"
        : "oklch(0.72 0.22 25)";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="-rotate-90"
          aria-label={`ATS Score: ${score}`}
          role="img"
        >
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ stroke: color }}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${circ}` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{score}</span>
          <span className="text-[9px] text-muted-foreground">ATS</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>
        {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"}
      </span>
    </div>
  );
}

// ─── Section row editor ────────────────────────────────────────────────────────
function ExperienceRow({
  item,
  onChange,
  onRemove,
}: {
  item: ResumeSection;
  onChange: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-muted/20 border border-border rounded-lg p-4 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Company"
          value={item.company}
          onChange={(e) => onChange(item.id, "company", e.target.value)}
          className="h-8 text-xs bg-background"
        />
        <Input
          placeholder="Role"
          value={item.role}
          onChange={(e) => onChange(item.id, "role", e.target.value)}
          className="h-8 text-xs bg-background"
        />
      </div>
      <Input
        placeholder="Duration (e.g. Jun 2023 – Aug 2023)"
        value={item.duration}
        onChange={(e) => onChange(item.id, "duration", e.target.value)}
        className="h-8 text-xs bg-background"
      />
      <Textarea
        placeholder="Describe your role and achievements…"
        value={item.description}
        onChange={(e) => onChange(item.id, "description", e.target.value)}
        className="text-xs bg-background resize-none"
        rows={2}
      />
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="flex items-center gap-1 text-[10px] text-destructive/70 hover:text-destructive transition-colors"
      >
        <Trash2 size={11} />
        Remove
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function StudentResume() {
  const { student } = useStudentData();

  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Chennai, Tamil Nadu");
  const [summary, setSummary] = useState(
    student
      ? `${student.programme} student at VIT University specializing in ${student.department}. Proficient in ${student.skills.slice(0, 3).join(", ")}. Seeking opportunities to apply technical skills in a challenging role.`
      : "",
  );

  const defaultExperience: ResumeSection[] = [
    {
      id: "exp1",
      company: "Infosys InfyTQ",
      role: "Intern – Software Development",
      duration: "May 2023 – Jul 2023",
      description:
        "Built RESTful APIs using Spring Boot. Contributed to a microservices migration project reducing latency by 18%.",
    },
  ];
  const [experience, setExperience] =
    useState<ResumeSection[]>(defaultExperience);

  const defaultProjects: ResumeProject[] = [
    {
      id: "proj1",
      name: "Campus Placement Tracker",
      tech: student?.skills.slice(0, 3).join(", ") ?? "React, Node.js",
      description:
        "Full-stack web app to track placement drives, application statuses, and analytics for 500+ students.",
    },
  ];
  const [projects, setProjects] = useState<ResumeProject[]>(defaultProjects);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const atsScore = useMemo(() => {
    if (!student) return 0;
    let score = 50;
    if (summary.length > 80) score += 10;
    if (experience.some((e) => e.description.length > 50)) score += 15;
    if (projects.length >= 1) score += 10;
    if (student.skills.length >= 4) score += 10;
    if (phone && location) score += 5;
    return Math.min(100, score);
  }, [student, summary, experience, projects, phone, location]);

  function handleScanAI() {
    setIsScanning(true);
    setTimeout(() => {
      setAiSuggestion(
        `Suggestion: Quantify your impact in experience descriptions (e.g., "increased performance by 30%"). Add more keywords matching current ${student?.department ?? ""} job postings — consider adding "${student?.skills[0] ?? "relevant skill"}" projects to your portfolio section.`,
      );
      setIsScanning(false);
    }, 1500);
  }

  function updateExp(id: string, field: string, value: string) {
    setExperience((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  }
  function removeExp(id: string) {
    setExperience((prev) => prev.filter((e) => e.id !== id));
  }
  function addExp() {
    setExperience((prev) => [
      ...prev,
      {
        id: `exp${Date.now()}`,
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ]);
  }

  function updateProj(id: string, field: string, value: string) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }
  function removeProj(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }
  function addProj() {
    setProjects((prev) => [
      ...prev,
      { id: `proj${Date.now()}`, name: "", tech: "", description: "" },
    ]);
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <GraduationCap size={48} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Please log in again.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-6 py-7 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Build, edit, and get AI-powered suggestions for your resume
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleScanAI}
            disabled={isScanning}
            data-ocid="btn-scan-ai"
            className="gap-1.5 text-xs"
          >
            <Sparkles size={13} />
            {isScanning ? "Scanning…" : "AI Scan"}
          </Button>
          <Button
            size="sm"
            data-ocid="btn-download-resume"
            className="gap-1.5 text-xs"
            onClick={() => window.print()}
          >
            <Download size={13} />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Editor column ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Suggestion */}
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex gap-3"
            >
              <Sparkles
                size={16}
                className="text-primary flex-shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary mb-1">
                  AI Suggestion
                </p>
                <p className="text-xs text-foreground/80">{aiSuggestion}</p>
              </div>
              <button
                type="button"
                onClick={() => setAiSuggestion(null)}
                className="text-muted-foreground hover:text-foreground transition-colors ml-auto flex-shrink-0"
                aria-label="Dismiss suggestion"
              >
                ×
              </button>
            </motion.div>
          )}

          {/* Contact info */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Personal Info
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="input-name"
                  className="text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Full Name
                </label>
                <Input
                  id="input-name"
                  value={student.name}
                  disabled
                  className="h-8 text-xs bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="input-email"
                  className="text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Email
                </label>
                <Input
                  id="input-email"
                  value={student.email}
                  disabled
                  className="h-8 text-xs bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="input-phone"
                  className="text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Phone
                </label>
                <Input
                  id="input-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-8 text-xs"
                  data-ocid="input-phone"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="input-location"
                  className="text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Location
                </label>
                <Input
                  id="input-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-8 text-xs"
                  data-ocid="input-location"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ScrollText size={14} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Summary</h3>
            </div>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="text-xs resize-none"
              rows={3}
              data-ocid="textarea-summary"
              placeholder="Write a brief professional summary…"
            />
          </div>

          {/* Experience */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Experience & Internships
              </h3>
              <button
                type="button"
                onClick={addExp}
                data-ocid="btn-add-experience"
                className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus size={12} />
                Add
              </button>
            </div>
            {experience.map((e) => (
              <ExperienceRow
                key={e.id}
                item={e}
                onChange={updateExp}
                onRemove={removeExp}
              />
            ))}
          </div>

          {/* Projects */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Projects
              </h3>
              <button
                type="button"
                onClick={addProj}
                data-ocid="btn-add-project"
                className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus size={12} />
                Add
              </button>
            </div>
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-muted/20 border border-border rounded-lg p-4 space-y-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Project Name"
                    value={p.name}
                    onChange={(e) => updateProj(p.id, "name", e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                  <Input
                    placeholder="Technologies used"
                    value={p.tech}
                    onChange={(e) => updateProj(p.id, "tech", e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <Textarea
                  placeholder="Brief project description…"
                  value={p.description}
                  onChange={(e) =>
                    updateProj(p.id, "description", e.target.value)
                  }
                  className="text-xs bg-background resize-none"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => removeProj(p.id)}
                  className="flex items-center gap-1 text-[10px] text-destructive/70 hover:text-destructive transition-colors"
                >
                  <Trash2 size={11} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sidebar: ATS + preview ── */}
        <div className="space-y-5">
          {/* ATS score */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-4"
          >
            <h3 className="text-sm font-semibold text-foreground self-start">
              ATS Score
            </h3>
            <ATSRing score={atsScore} />
            <div className="w-full space-y-2 text-xs">
              {[
                { label: "Professional Summary", done: summary.length > 80 },
                {
                  label: "Work Experience",
                  done: experience.some((e) => e.description.length > 50),
                },
                { label: "Projects", done: projects.length >= 1 },
                { label: "4+ Skills", done: student.skills.length >= 4 },
                { label: "Contact Info", done: !!(phone && location) },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2
                    size={13}
                    className={
                      done ? "text-green-400" : "text-muted-foreground/40"
                    }
                  />
                  <span
                    className={
                      done ? "text-foreground/80" : "text-muted-foreground/50"
                    }
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award size={14} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Skills</h3>
              <Badge variant="secondary" className="ml-auto text-xs">
                {student.skills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium badge-chart-2"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Resume preview snapshot */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-xl p-5 space-y-3"
          >
            <h3 className="text-sm font-semibold text-foreground">
              Preview Snapshot
            </h3>
            <div className="bg-background border border-border rounded-lg p-3 text-[10px] space-y-2 font-mono">
              <p className="font-bold text-foreground text-xs">
                {student.name}
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Mail size={9} />
                {student.email}
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Phone size={9} />
                {phone}
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin size={9} />
                {location}
              </p>
              <hr className="border-border" />
              <p className="text-foreground/70 italic line-clamp-2">
                {summary}
              </p>
              <hr className="border-border" />
              <p className="font-bold text-foreground uppercase tracking-wide text-[9px]">
                Skills
              </p>
              <p className="text-muted-foreground">
                {student.skills.join(", ")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
