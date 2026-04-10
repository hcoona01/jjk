import { cn } from "@/lib/utils";
import {
  Brain,
  ChevronRight,
  Clock,
  MessageSquare,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  Star,
  Target,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type InterviewRole =
  | "Software Engineer"
  | "Data Scientist"
  | "ML Engineer"
  | "System Design"
  | "Behavioral";
type InterviewLevel = "Entry" | "Mid" | "Senior";
type MessageRole = "interviewer" | "candidate";

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  feedback?: string;
  score?: number;
}

interface QuestionSet {
  role: InterviewRole;
  level: InterviewLevel;
  questions: string[];
}

// ─── Mock questions bank ─────────────────────────────────────────────────────
const QUESTION_BANK: QuestionSet[] = [
  {
    role: "Software Engineer",
    level: "Entry",
    questions: [
      "Tell me about yourself and why you want to be a software engineer.",
      "Explain the difference between a stack and a queue. When would you use each?",
      "What is Big-O notation? Give examples of O(1), O(n), and O(n²) operations.",
      "Describe the MVC architecture and its benefits.",
      "Write a function to reverse a linked list. Walk me through your approach.",
      "What is the difference between synchronous and asynchronous programming?",
      "Explain REST API principles. How is GET different from POST?",
    ],
  },
  {
    role: "Data Scientist",
    level: "Entry",
    questions: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain overfitting and how you would prevent it.",
      "What is cross-validation? Why is it important?",
      "Describe a project where you applied machine learning to solve a real problem.",
      "What is the bias-variance tradeoff?",
      "Explain precision vs recall. When would you optimize for each?",
      "How would you handle missing data in a dataset?",
    ],
  },
  {
    role: "ML Engineer",
    level: "Mid",
    questions: [
      "How would you deploy a machine learning model to production?",
      "What is MLOps and why is it important?",
      "Explain the transformer architecture and its attention mechanism.",
      "How do you monitor model performance in production? What metrics would you track?",
      "Describe feature engineering techniques you've used. How do you select features?",
      "What is gradient descent? Explain Adam optimizer.",
      "How would you scale a recommendation system to handle millions of users?",
    ],
  },
  {
    role: "System Design",
    level: "Senior",
    questions: [
      "Design a URL shortening service like bit.ly. What are the key components?",
      "How would you design a real-time notification system for 10 million users?",
      "Design a distributed caching layer. How would you handle cache invalidation?",
      "Explain CAP theorem. How does it affect your system design decisions?",
      "Design a ride-sharing system. Focus on matching drivers to riders efficiently.",
      "How would you design a social media feed that handles viral posts?",
      "Design a distributed job scheduler. How do you prevent duplicate execution?",
    ],
  },
  {
    role: "Behavioral",
    level: "Entry",
    questions: [
      "Tell me about a time you faced a challenging technical problem. How did you solve it?",
      "Describe a situation where you had to work with a difficult team member.",
      "Give an example of when you had to learn a new technology quickly under pressure.",
      "How do you prioritize tasks when you have multiple deadlines?",
      "Tell me about a project you're most proud of. What was your specific contribution?",
      "Describe a time when you failed. What did you learn from it?",
      "How do you stay up to date with the latest developments in technology?",
    ],
  },
];

// ─── Simulated AI feedback generator ──────────────────────────────────────────
function generateFeedback(
  answer: string,
  _question: string,
): { feedback: string; score: number } {
  const wordCount = answer.trim().split(/\s+/).length;
  const hasStructure =
    answer.includes("first") ||
    answer.includes("then") ||
    answer.includes("because") ||
    answer.includes("example");
  const hasTechnical =
    /[A-Z]{2,}|algorithm|function|array|data|system|model/i.test(answer);
  const isTooShort = wordCount < 20;
  const isGood = wordCount > 50 && (hasStructure || hasTechnical);

  let score = 5;
  if (isTooShort) score = 3;
  else if (isGood) score = wordCount > 100 ? 9 : 7;

  const feedbacks = {
    short: [
      "Your answer is quite brief. Try to elaborate more with specific examples or technical details. Aim for a structured response using the STAR method (Situation, Task, Action, Result).",
      "Good start, but expand on your answer. Interviewers typically expect 1-2 minutes of thoughtful response. Add examples from your experience.",
    ],
    medium: [
      "Decent answer! You covered the basics but could strengthen it with concrete examples. Consider mentioning specific technologies or frameworks you've used.",
      "Good response overall. To score higher, add quantifiable outcomes — e.g., 'reduced load time by 40%' or 'handled 10k requests/second'.",
    ],
    good: [
      "Excellent answer! You demonstrated clear understanding with well-structured reasoning. The specific examples you used are exactly what interviewers look for.",
      "Strong response! You showed both technical depth and practical experience. Keep highlighting the impact of your work with numbers and results.",
    ],
  };

  const set = isTooShort
    ? feedbacks.short
    : isGood
      ? feedbacks.good
      : feedbacks.medium;
  const feedback = set[Math.floor(Math.random() * set.length)];

  return { feedback, score };
}

const THINKING_MESSAGES = [
  "Analyzing your response...",
  "Evaluating technical accuracy...",
  "Assessing communication clarity...",
  "Preparing feedback...",
];

// ─── Role / Level Selector ────────────────────────────────────────────────────
function InterviewSetup({
  onStart,
}: { onStart: (role: InterviewRole, level: InterviewLevel) => void }) {
  const [selectedRole, setSelectedRole] =
    useState<InterviewRole>("Software Engineer");
  const [selectedLevel, setSelectedLevel] = useState<InterviewLevel>("Entry");

  const ROLES: InterviewRole[] = [
    "Software Engineer",
    "Data Scientist",
    "ML Engineer",
    "System Design",
    "Behavioral",
  ];
  const LEVELS: InterviewLevel[] = ["Entry", "Mid", "Senior"];

  const ROLE_ICONS: Record<InterviewRole, string> = {
    "Software Engineer": "💻",
    "Data Scientist": "📊",
    "ML Engineer": "🤖",
    "System Design": "🏗️",
    Behavioral: "🤝",
  };

  const LEVEL_DESC: Record<InterviewLevel, string> = {
    Entry: "0-2 years experience",
    Mid: "2-5 years experience",
    Senior: "5+ years experience",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Brain size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground font-display mb-2">
          AI Mock Interview
        </h2>
        <p className="text-muted-foreground">
          Practice with AI-powered questions and get instant feedback on your
          answers.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Select Interview Type
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ROLES.map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => setSelectedRole(role)}
                data-ocid={`role-${role.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-smooth",
                  selectedRole === role
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted",
                )}
              >
                <span className="text-xl">{ROLE_ICONS[role]}</span>
                <span className="text-center leading-tight">{role}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Experience Level
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => setSelectedLevel(level)}
                data-ocid={`level-${level.toLowerCase()}`}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-smooth",
                  selectedLevel === level
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted",
                )}
              >
                <span className="font-bold text-sm">{level}</span>
                <span className="text-[10px] text-center">
                  {LEVEL_DESC[level]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-muted/40 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-semibold text-foreground">
            What to expect:
          </h4>
          <ul className="space-y-1">
            {[
              "7 curated questions for your role and level",
              "Real-time AI feedback after each answer",
              "Score from 1-10 with actionable suggestions",
              "Session summary with improvement tips",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <ChevronRight
                  size={12}
                  className="text-primary flex-shrink-0"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onStart(selectedRole, selectedLevel)}
          data-ocid="start-interview"
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-smooth"
        >
          Start Interview →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "text-[oklch(0.58_0.18_142)]"
      : score >= 6
        ? "text-[oklch(0.72_0.18_64)]"
        : "text-destructive";
  const bg =
    score >= 8
      ? "bg-[oklch(0.58_0.18_142)]/10"
      : score >= 6
        ? "bg-[oklch(0.72_0.18_64)]/10"
        : "bg-destructive/10";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
        bg,
        color,
      )}
    >
      <Star size={11} fill="currentColor" /> {score}/10
    </span>
  );
}

// ─── Interview Session ────────────────────────────────────────────────────────
function InterviewSession({
  role,
  level,
  onEnd,
}: {
  role: InterviewRole;
  level: InterviewLevel;
  onEnd: (messages: Message[]) => void;
}) {
  const questionSet =
    QUESTION_BANK.find((q) => q.role === role) ?? QUESTION_BANK[0];
  const questions = questionSet.questions;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "q0",
      role: "interviewer",
      text: `Welcome! I'll be your ${role} interviewer today. Let's begin with the first question:\n\n${questions[0]}`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  function handleMicToggle() {
    setIsListening((l) => !l);
    if (!isListening) {
      setTimeout(() => {
        setInput(
          (prev) =>
            `${prev}${prev ? " " : ""}I would approach this problem by first analyzing the requirements, then designing a solution...`,
        );
        setIsListening(false);
      }, 2000);
    }
  }

  async function handleSubmit() {
    if (!input.trim() || isThinking || done) return;
    const userMsg: Message = {
      id: `u${qIndex}`,
      role: "candidate",
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    let step = 0;
    const interval = setInterval(() => {
      setThinkingMsg(THINKING_MESSAGES[step % THINKING_MESSAGES.length]);
      step++;
    }, 700);

    await new Promise((r) => setTimeout(r, 2800));
    clearInterval(interval);

    const { feedback, score } = generateFeedback(
      userMsg.text,
      questions[qIndex],
    );
    const feedbackMsg: Message = {
      id: `f${qIndex}`,
      role: "interviewer",
      text: "",
      timestamp: new Date(),
      feedback,
      score,
    };

    const nextQ = qIndex + 1;
    if (nextQ < questions.length) {
      feedbackMsg.text = `${feedback}\n\nNext question:\n\n${questions[nextQ]}`;
      setQIndex(nextQ);
    } else {
      feedbackMsg.text = `${feedback}\n\nThat concludes our interview! You answered all ${questions.length} questions. Let me prepare your session summary.`;
      setDone(true);
    }

    setMessages((prev) => [...prev, feedbackMsg]);
    setIsThinking(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  const progress = ((qIndex + (done ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Progress Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-semibold text-foreground">{role}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{level} Level</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Q {Math.min(qIndex + 1, questions.length)}/{questions.length}
          </span>
          <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        {done && (
          <button
            type="button"
            onClick={() => onEnd(messages)}
            className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
            data-ocid="view-summary"
          >
            View Summary
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3",
              msg.role === "candidate" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                msg.role === "interviewer"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {msg.role === "interviewer" ? "AI" : "You"}
            </div>
            <div
              className={cn(
                "max-w-[78%] space-y-2",
                msg.role === "candidate" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                  msg.role === "interviewer"
                    ? "bg-card border border-border text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm",
                )}
              >
                {msg.text}
              </div>
              {msg.score !== undefined && (
                <div className="flex items-center gap-2">
                  <ScoreBadge score={msg.score} />
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              AI
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.15,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {thinkingMsg}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      {!done && (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 items-end">
            <button
              type="button"
              onClick={handleMicToggle}
              aria-label={isListening ? "Stop recording" : "Start recording"}
              data-ocid="mic-toggle"
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-smooth",
                isListening
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here... (Enter to submit, Shift+Enter for new line)"
              rows={3}
              data-ocid="answer-input"
              className="flex-1 resize-none bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
            />
            <button
              type="button"
              onClick={() => {
                void handleSubmit();
              }}
              disabled={!input.trim() || isThinking}
              aria-label="Submit answer"
              data-ocid="submit-answer"
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-smooth"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Press Enter to submit · Shift+Enter for new line · Use mic for voice
            input
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Session Summary ──────────────────────────────────────────────────────────
function SessionSummary({
  messages,
  role,
  onRestart,
}: { messages: Message[]; role: InterviewRole; onRestart: () => void }) {
  const scored = messages.filter((m) => m.score !== undefined);
  const avgScore = scored.length
    ? scored.reduce((a, m) => a + (m.score ?? 0), 0) / scored.length
    : 0;
  const grade =
    avgScore >= 8
      ? "Excellent"
      : avgScore >= 6
        ? "Good"
        : avgScore >= 4
          ? "Fair"
          : "Needs Work";
  const gradeColor =
    avgScore >= 8
      ? "text-[oklch(0.58_0.18_142)]"
      : avgScore >= 6
        ? "text-primary"
        : avgScore >= 4
          ? "text-[oklch(0.72_0.18_64)]"
          : "text-destructive";

  const TIPS: Record<InterviewRole, string[]> = {
    "Software Engineer": [
      "Practice LeetCode medium difficulty daily",
      "Study system design fundamentals",
      "Prepare STAR format behavioral stories",
    ],
    "Data Scientist": [
      "Brush up on statistics and probability",
      "Practice SQL query optimization",
      "Study feature engineering techniques",
    ],
    "ML Engineer": [
      "Learn MLOps tools (MLflow, Kubeflow)",
      "Practice model deployment on cloud",
      "Study distributed training techniques",
    ],
    "System Design": [
      "Study high-level design of 10 popular systems",
      "Practice capacity estimation",
      "Learn about consistency vs availability tradeoffs",
    ],
    Behavioral: [
      "Prepare 10 STAR stories covering common themes",
      "Practice out loud, not just in your head",
      "Research the company culture beforehand",
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-5"
    >
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Star size={28} className={gradeColor} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-foreground font-display mb-1">
          Interview Complete!
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          {role} · {scored.length} questions answered
        </p>
        <div className="flex items-center justify-center gap-6">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {avgScore.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className={cn("text-xl font-bold", gradeColor)}>{grade}</p>
            <p className="text-xs text-muted-foreground">Performance</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xl font-bold text-foreground">{scored.length}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Question-by-Question Scores
        </h3>
        <div className="space-y-2">
          {scored.map((msg, i) => (
            <div key={msg.id} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-6">
                Q{i + 1}
              </span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((msg.score ?? 0) / 10) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={cn(
                    "h-full rounded-full",
                    (msg.score ?? 0) >= 8
                      ? "bg-[oklch(0.58_0.18_142)]"
                      : (msg.score ?? 0) >= 6
                        ? "bg-primary"
                        : "bg-[oklch(0.72_0.18_64)]",
                  )}
                />
              </div>
              <ScoreBadge score={msg.score ?? 0} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target size={14} className="text-primary" /> Improvement Tips for{" "}
          {role}
        </h3>
        <ul className="space-y-2">
          {(TIPS[role] ?? TIPS.Behavioral).map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <ChevronRight
                size={14}
                className="text-primary flex-shrink-0 mt-0.5"
              />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onRestart}
        data-ocid="restart-interview"
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2"
      >
        <RefreshCw size={16} /> Start New Interview
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Stage = "setup" | "interview" | "summary";

export default function MockInterview() {
  const [stage, setStage] = useState<Stage>("setup");
  const [role, setRole] = useState<InterviewRole>("Software Engineer");
  const [level, setLevel] = useState<InterviewLevel>("Entry");
  const [finalMessages, setFinalMessages] = useState<Message[]>([]);

  function handleStart(r: InterviewRole, l: InterviewLevel) {
    setRole(r);
    setLevel(l);
    setStage("interview");
  }

  function handleEnd(msgs: Message[]) {
    setFinalMessages(msgs);
    setStage("summary");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare size={16} className="text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">
              Mock Interview
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-powered interview practice
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {stage !== "setup" && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{role}</span>
            </div>
          )}
          {stage === "interview" && (
            <button
              type="button"
              onClick={() => setStage("setup")}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-smooth"
              data-ocid="exit-interview"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn(stage === "interview" ? "overflow-hidden" : "p-6")}>
        <AnimatePresence mode="wait">
          {stage === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InterviewSetup onStart={handleStart} />
            </motion.div>
          )}
          {stage === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InterviewSession role={role} level={level} onEnd={handleEnd} />
            </motion.div>
          )}
          {stage === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SessionSummary
                messages={finalMessages}
                role={role}
                onRestart={() => setStage("setup")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
