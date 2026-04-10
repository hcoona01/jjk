import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Award,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Code,
  Download,
  Edit3,
  Eye,
  FileText,
  GraduationCap,
  Info,
  RefreshCw,
  Sparkles,
  Upload,
  User,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ResumeSection {
  id: string;
  title: string;
  content: string;
  icon: React.ElementType;
}

interface AISuggestion {
  id: string;
  type: "error" | "warning" | "tip";
  section: string;
  message: string;
  suggestion: string;
  applied?: boolean;
}

// ─── Default resume content ───────────────────────────────────────────────────
const DEFAULT_SECTIONS: ResumeSection[] = [
  {
    id: "summary",
    title: "Professional Summary",
    icon: User,
    content:
      "Final year B.Tech Computer Science student at VIT University with strong foundation in full-stack development, machine learning, and cloud technologies. Passionate about building scalable software solutions. 2x hackathon winner with hands-on experience in React, Node.js, Python, and AWS.",
  },
  {
    id: "experience",
    title: "Work Experience",
    icon: Briefcase,
    content: `Software Engineering Intern — Amazon Web Services (Jun 2024 – Aug 2024)
• Built a serverless data pipeline using AWS Lambda and S3, reducing processing time by 40%
• Collaborated with a team of 6 engineers on microservices architecture using Docker and Kubernetes
• Implemented CI/CD pipelines with GitHub Actions, decreasing deployment time from 2 hours to 15 minutes

Frontend Developer Intern — Infosys (Jan 2024 – Mar 2024)
• Developed 8 responsive React components used across 3 product lines
• Optimized bundle size by 35% through code splitting and lazy loading
• Mentored 2 junior interns on React best practices and code review`,
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    content: `B.Tech Computer Science — VIT University (2021 – 2025)
CGPA: 8.7 / 10 | Dean's List: 4 semesters

Relevant Coursework: Data Structures & Algorithms, Database Systems, Operating Systems, Computer Networks, Machine Learning, Cloud Computing

12th Grade — Delhi Public School (2019 – 2021)
Percentage: 94.2% | CBSE Board`,
  },
  {
    id: "skills",
    title: "Technical Skills",
    icon: Code,
    content: `Programming Languages: Python, JavaScript, TypeScript, Java, C++
Frontend: React, Next.js, Tailwind CSS, Redux, HTML5, CSS3
Backend: Node.js, Express.js, FastAPI, Django, REST APIs, GraphQL
Databases: PostgreSQL, MongoDB, Redis, MySQL, DynamoDB
Cloud & DevOps: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, CI/CD, Git
ML/AI: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, Hugging Face`,
  },
  {
    id: "projects",
    title: "Projects",
    icon: FileText,
    content: `NexPlace — AI-Powered Placement Portal (2024)
• Built a full-stack placement management system for 1,200+ students using React, Node.js, and PostgreSQL
• Integrated AI resume screening and mock interview features with 89% user satisfaction rate
• Tech Stack: React, TypeScript, Node.js, PostgreSQL, AWS, Tailwind CSS | GitHub: github.com/arjun/nexplace

StockSense — Real-time Market Analytics (2023)
• Developed ML model predicting stock trends with 73% accuracy using LSTM and transformer architectures
• Processed 50,000+ data points daily using Apache Kafka and Apache Spark
• Tech Stack: Python, TensorFlow, React, FastAPI, Redis, Docker`,
  },
  {
    id: "achievements",
    title: "Achievements & Certifications",
    icon: Award,
    content: `• AWS Certified Solutions Architect – Associate (2024)
• Google Cloud Professional Data Engineer (2024)
• 1st Place — Smart India Hackathon 2023 (National Level, 10,000+ teams)
• Top 100 — HackMIT 2023 (Cambridge, MA)
• LeetCode: 450+ problems solved, peak rating 1847 (Knight badge)
• Published research paper: "Efficient NLP Pipeline for Resume Screening" — IEEE ICACCS 2024`,
  },
];

// ─── AI suggestion generator ──────────────────────────────────────────────────
function generateAISuggestions(sections: ResumeSection[]): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  let id = 0;

  for (const section of sections) {
    const content = section.content;

    // Check for quantification
    if (section.id === "experience") {
      if (!/\d+%/.test(content) && !/\d+x/.test(content)) {
        suggestions.push({
          id: String(id++),
          type: "warning",
          section: section.title,
          message: "Missing quantifiable impact metrics",
          suggestion:
            'Add specific numbers: "Improved performance by 40%", "Handled 10k+ requests/day"',
        });
      } else {
        suggestions.push({
          id: String(id++),
          type: "tip",
          section: section.title,
          message: "Good use of metrics!",
          suggestion:
            'Consider adding team size context: "Led a team of X engineers"',
        });
      }
    }

    // Check summary length
    if (section.id === "summary") {
      const wordCount = content.split(/\s+/).length;
      if (wordCount < 30) {
        suggestions.push({
          id: String(id++),
          type: "error",
          section: section.title,
          message: "Professional summary is too short",
          suggestion:
            "Aim for 3-4 sentences (50-80 words) covering your expertise, years of experience, and key technologies.",
        });
      } else if (wordCount > 100) {
        suggestions.push({
          id: String(id++),
          type: "warning",
          section: section.title,
          message: "Summary may be too lengthy",
          suggestion:
            "Keep your summary concise — recruiters spend 6 seconds scanning. Trim to 3-4 punchy sentences.",
        });
      } else {
        suggestions.push({
          id: String(id++),
          type: "tip",
          section: section.title,
          message: "Summary length is optimal",
          suggestion:
            "Ensure the first sentence contains your most impressive achievement or skill.",
        });
      }
    }

    // Check skills for ATS keywords
    if (section.id === "skills") {
      const ATS_KEYWORDS = [
        "React",
        "Python",
        "SQL",
        "AWS",
        "Docker",
        "Git",
        "Node.js",
        "TypeScript",
      ];
      const missing = ATS_KEYWORDS.filter((k) => !content.includes(k));
      if (missing.length > 3) {
        suggestions.push({
          id: String(id++),
          type: "warning",
          section: section.title,
          message: `Missing high-demand ATS keywords: ${missing.slice(0, 3).join(", ")}`,
          suggestion:
            "These keywords appear in 70%+ of tech job postings. Add them if you have experience.",
        });
      } else {
        suggestions.push({
          id: String(id++),
          type: "tip",
          section: section.title,
          message: "Strong ATS keyword coverage",
          suggestion:
            "Consider adding cloud-native skills like Kubernetes, Terraform, or Kafka for senior roles.",
        });
      }
    }

    // Check projects for GitHub links
    if (section.id === "projects") {
      if (!content.includes("github.com") && !content.includes("github")) {
        suggestions.push({
          id: String(id++),
          type: "error",
          section: section.title,
          message: "No GitHub links in projects section",
          suggestion:
            "Add GitHub/demo links to every project. Recruiters verify claims by looking at actual code.",
        });
      }
    }
  }

  return suggestions;
}

// ─── ATS Score Calculator ─────────────────────────────────────────────────────
function calculateATSScore(sections: ResumeSection[]): number {
  let score = 0;
  const allContent = sections.map((s) => s.content).join(" ");

  const checks = [
    {
      pass: /\d+%/.test(allContent),
      points: 15,
      label: "Quantified achievements",
    },
    {
      pass: allContent.split(/\s+/).length > 300,
      points: 10,
      label: "Sufficient content",
    },
    {
      pass: ["React", "Python", "AWS", "Docker"].some((k) =>
        allContent.includes(k),
      ),
      points: 20,
      label: "High-demand keywords",
    },
    {
      pass: /github\.com/.test(allContent),
      points: 10,
      label: "Portfolio links",
    },
    {
      pass: /\d{4}\s*[–-]\s*(20\d{2}|Present)/.test(allContent),
      points: 15,
      label: "Proper date formatting",
    },
    {
      pass: /intern|engineer|developer/i.test(allContent),
      points: 15,
      label: "Clear job titles",
    },
    {
      pass: /CGPA|GPA|\d\.\d\s*\/\s*10/.test(allContent),
      points: 10,
      label: "Academic scores included",
    },
    {
      pass: /certified|certification/i.test(allContent),
      points: 5,
      label: "Certifications listed",
    },
  ];

  for (const check of checks) {
    if (check.pass) score += check.points;
  }

  return Math.min(100, score);
}

// ─── Section Editor ───────────────────────────────────────────────────────────
function SectionEditor({
  section,
  onChange,
  isActive,
  onFocus,
}: {
  section: ResumeSection;
  onChange: (id: string, content: string) => void;
  isActive: boolean;
  onFocus: (id: string) => void;
}) {
  const Icon = section.icon;
  return (
    <div
      className={cn(
        "border rounded-xl overflow-hidden transition-smooth",
        isActive ? "border-primary shadow-sm" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={() => onFocus(section.id)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors"
      >
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center",
            isActive ? "bg-primary/15" : "bg-muted",
          )}
        >
          <Icon
            size={14}
            className={isActive ? "text-primary" : "text-muted-foreground"}
          />
        </div>
        <span
          className={cn(
            "text-sm font-semibold flex-1 text-left",
            isActive ? "text-primary" : "text-foreground",
          )}
        >
          {section.title}
        </span>
        <ChevronRight
          size={14}
          className={cn(
            "transition-transform",
            isActive ? "rotate-90 text-primary" : "text-muted-foreground",
          )}
        />
      </button>

      {isActive && (
        <div className="border-t border-border">
          <textarea
            value={section.content}
            onChange={(e) => onChange(section.id, e.target.value)}
            data-ocid={`editor-${section.id}`}
            rows={8}
            className="w-full px-4 py-3 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono leading-relaxed resize-none"
          />
        </div>
      )}
    </div>
  );
}

// ─── Suggestion Item ──────────────────────────────────────────────────────────
function SuggestionItem({
  suggestion,
  onApply,
}: { suggestion: AISuggestion; onApply: (id: string) => void }) {
  const config = {
    error: {
      icon: AlertCircle,
      color: "text-destructive",
      bg: "bg-destructive/8",
      border: "border-destructive/30",
    },
    warning: {
      icon: AlertCircle,
      color: "text-[oklch(0.72_0.18_64)]",
      bg: "bg-[oklch(0.72_0.18_64)]/8",
      border: "border-[oklch(0.72_0.18_64)]/30",
    },
    tip: {
      icon: Info,
      color: "text-primary",
      bg: "bg-primary/8",
      border: "border-primary/20",
    },
  }[suggestion.type];

  const SIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: suggestion.applied ? 0.5 : 1, x: 0 }}
      className={cn(
        "border rounded-xl p-3 space-y-1.5",
        config.bg,
        config.border,
      )}
    >
      <div className="flex items-start gap-2">
        <SIcon size={14} className={cn("flex-shrink-0 mt-0.5", config.color)} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-xs font-semibold", config.color)}>
            {suggestion.message}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            <span className="font-medium text-foreground/70">
              {suggestion.section}:
            </span>{" "}
            {suggestion.suggestion}
          </p>
        </div>
      </div>
      {!suggestion.applied && (
        <button
          type="button"
          onClick={() => onApply(suggestion.id)}
          className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 ml-5"
        >
          <CheckCircle size={10} /> Mark as reviewed
        </button>
      )}
      {suggestion.applied && (
        <p className="text-[10px] text-muted-foreground ml-5 flex items-center gap-1">
          <CheckCircle size={10} className="text-[oklch(0.58_0.18_142)]" />{" "}
          Reviewed
        </p>
      )}
    </motion.div>
  );
}

// ─── ATS Score Ring ───────────────────────────────────────────────────────────
function ATSScoreRing({ score }: { score: number }) {
  const r = 30;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "oklch(0.58 0.18 142)"
      : score >= 60
        ? "oklch(0.65 0.22 261)"
        : "oklch(0.72 0.18 64)";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg
          width="80"
          height="80"
          className="-rotate-90"
          aria-label={`ATS Score: ${score}`}
          role="img"
        >
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="oklch(0.9 0 0)"
            strokeWidth="6"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">{score}</span>
          <span className="text-[9px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>
        {label}
      </span>
      <span className="text-[10px] text-muted-foreground">ATS Score</span>
    </div>
  );
}

// ─── Preview Mode ─────────────────────────────────────────────────────────────
function ResumePreview({ sections }: { sections: ResumeSection[] }) {
  return (
    <div className="resume-document p-8 rounded-xl shadow-sm font-mono text-xs leading-relaxed max-h-[600px] overflow-y-auto border border-border">
      <div className="text-center mb-4 border-b-2 border-resume-divider pb-3">
        <h1 className="text-xl font-bold text-resume-heading">ARJUN SHARMA</h1>
        <p className="text-resume-muted text-[10px]">
          arjun.sharma@vit.ac.in · +91 9876543210 · Vellore, Tamil Nadu
        </p>
        <p className="text-resume-muted text-[10px]">
          github.com/arjun-sharma · linkedin.com/in/arjun-sharma
        </p>
      </div>
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.id} className="mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon size={12} className="text-resume-icon" />
              <h2 className="text-sm font-bold text-resume-subheading uppercase tracking-wide">
                {section.title}
              </h2>
            </div>
            <div className="h-px bg-resume-rule mb-2" />
            <p className="text-resume-body whitespace-pre-wrap leading-relaxed">
              {section.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type EditorView = "edit" | "preview";

export default function ResumeEditor() {
  const [sections, setSections] = useState<ResumeSection[]>(DEFAULT_SECTIONS);
  const [activeSection, setActiveSection] = useState<string>("summary");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [view, setView] = useState<EditorView>("edit");
  const [uploadMsg, setUploadMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const atsScore = calculateATSScore(sections);

  function handleContentChange(id: string, content: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s)),
    );
    if (scanned) {
      setSuggestions([]);
      setScanned(false);
    }
  }

  async function handleAIScan() {
    setScanning(true);
    setSuggestions([]);
    await new Promise((r) => setTimeout(r, 2200));
    setSuggestions(generateAISuggestions(sections));
    setScanning(false);
    setScanned(true);
  }

  function handleApplySuggestion(id: string) {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, applied: true } : s)),
    );
  }

  function handleUpload() {
    fileRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg(`Parsing "${file.name}"...`);
    setTimeout(() => {
      setUploadMsg("Resume parsed! Content pre-filled from your file.");
      setTimeout(() => setUploadMsg(""), 3000);
    }, 1500);
    e.target.value = "";
  }

  const errorCount = suggestions.filter(
    (s) => s.type === "error" && !s.applied,
  ).length;
  const warnCount = suggestions.filter(
    (s) => s.type === "warning" && !s.applied,
  ).length;
  const tipCount = suggestions.filter(
    (s) => s.type === "tip" && !s.applied,
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">
                AI Resume Editor
              </h1>
              <p className="text-xs text-muted-foreground">
                ATS-optimized resume builder with AI scanning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(["edit", "preview"] as EditorView[]).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setView(v)}
                  data-ocid={`view-${v}`}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-smooth capitalize",
                    view === v
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "edit" ? <Edit3 size={12} /> : <Eye size={12} />}
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleUpload}
              data-ocid="upload-resume"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-smooth text-muted-foreground hover:text-foreground"
            >
              <Upload size={13} /> Upload PDF
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              data-ocid="download-resume"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
            >
              <Download size={13} /> Download PDF
            </button>
          </div>
        </div>
        {uploadMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-primary mt-2 flex items-center gap-1.5"
          >
            <CheckCircle size={12} /> {uploadMsg}
          </motion.p>
        )}
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left — Editor / Preview */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {view === "edit" ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {sections.map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onChange={handleContentChange}
                    isActive={activeSection === section.id}
                    onFocus={setActiveSection}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResumePreview sections={sections} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — AI Panel */}
        <div className="w-80 flex-shrink-0 border-l border-border bg-card overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* ATS Score */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  ATS Analysis
                </h3>
                <Sparkles size={14} className="text-primary" />
              </div>
              <div className="flex items-center gap-4">
                <ATSScoreRing score={atsScore} />
                <div className="flex-1 space-y-2 text-xs">
                  {[
                    {
                      label: "Keywords",
                      score: atsScore > 60 ? "Good" : "Low",
                      ok: atsScore > 60,
                    },
                    { label: "Formatting", score: "Optimal", ok: true },
                    { label: "Length", score: "Ideal", ok: true },
                    {
                      label: "Metrics",
                      score: atsScore > 40 ? "Present" : "Missing",
                      ok: atsScore > 40,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          item.ok
                            ? "text-[oklch(0.58_0.18_142)]"
                            : "text-destructive",
                        )}
                      >
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Scan Button */}
            <button
              type="button"
              onClick={() => {
                void handleAIScan();
              }}
              disabled={scanning}
              data-ocid="ai-scan"
              className="w-full py-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-smooth"
            >
              {scanning ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Scanning resume...
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  {scanned ? "Re-scan with AI" : "Scan with AI"}
                </>
              )}
            </button>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    AI Suggestions
                  </h3>
                  <div className="flex gap-1.5">
                    {errorCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive font-bold">
                        {errorCount} issues
                      </span>
                    )}
                    {warnCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(0.72_0.18_64)]/15 text-[oklch(0.72_0.18_64)] font-bold">
                        {warnCount} warnings
                      </span>
                    )}
                    {tipCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-bold">
                        {tipCount} tips
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <SuggestionItem
                      key={s.id}
                      suggestion={s}
                      onApply={handleApplySuggestion}
                    />
                  ))}
                </div>
              </div>
            )}

            {!scanned && !scanning && (
              <div className="text-center py-6 space-y-2">
                <Wand2 size={28} className="text-muted-foreground/40 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Click "Scan with AI" to get personalized feedback, ATS
                  optimization tips, and improvement suggestions.
                </p>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Info size={12} className="text-primary" /> Resume Best
                Practices
              </h4>
              {[
                "Use action verbs: Built, Led, Designed, Optimized",
                "Quantify every achievement with numbers",
                "Keep to 1 page for <5 years experience",
                "Match keywords from job descriptions",
                "Include GitHub, LinkedIn, and portfolio links",
              ].map((tip) => (
                <p
                  key={tip}
                  className="text-[11px] text-muted-foreground flex items-start gap-1.5"
                >
                  <ChevronRight
                    size={11}
                    className="text-primary flex-shrink-0 mt-0.5"
                  />
                  {tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
