import KPICard from "@/components/admin/KPICard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEPARTMENTS,
  SCHOOLS,
  mockApplications,
  mockCompanies,
  mockStudents,
  updateStudentStatus,
} from "@/lib/mockData";
import type { Department, PlacementStatus, Student } from "@/types/placement";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

const STATUS_COLORS: Record<
  PlacementStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  placed: {
    bg: "bg-[oklch(0.58_0.18_142)]/15",
    text: "text-[oklch(0.58_0.18_142)]",
    dot: "bg-[oklch(0.58_0.18_142)]",
    label: "Placed",
  },
  "in-progress": {
    bg: "bg-[oklch(0.72_0.18_64)]/15",
    text: "text-[oklch(0.72_0.18_64)]",
    dot: "bg-[oklch(0.72_0.18_64)]",
    label: "In Progress",
  },
  unplaced: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    dot: "bg-destructive",
    label: "Unplaced",
  },
};

const APP_STATUS_COLORS: Record<string, string> = {
  applied: "text-muted-foreground",
  shortlisted: "text-[oklch(0.60_0.16_200)]",
  interviewing: "text-[oklch(0.72_0.18_64)]",
  offered: "text-[oklch(0.58_0.18_142)]",
  hired: "text-[oklch(0.58_0.18_142)]",
  rejected: "text-destructive",
};

const BATCHES = ["2021", "2022", "2023", "2024"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({
  status,
  size = "sm",
}: { status: PlacementStatus; size?: "sm" | "lg" }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${
        size === "lg" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      <span
        className={`rounded-full flex-shrink-0 ${c.dot} ${size === "lg" ? "w-2 h-2" : "w-1.5 h-1.5"}`}
      />
      {c.label}
    </span>
  );
}

function ScoreBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-semibold text-foreground">{value}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function IconCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 flex-shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconX({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 mr-1.5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onHide }: { message: string; onHide: () => void }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2500);
    return () => clearTimeout(t);
  }, [onHide]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      // biome-ignore lint/a11y/useSemanticElements: motion.div cannot be converted to output element
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-[oklch(0.58_0.18_142)] text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium"
    >
      <IconCheck />
      {message}
    </motion.div>
  );
}

// ─── Edit Status Modal ────────────────────────────────────────────────────────

interface EditModalProps {
  student: Student;
  onClose: () => void;
  onSave: (id: string, status: PlacementStatus, pkg?: number) => void;
}

function EditStatusModal({ student, onClose, onSave }: EditModalProps) {
  const [status, setStatus] = useState<PlacementStatus>(
    student.placement_status,
  );
  const [packageLPA, setPackageLPA] = useState<string>(
    student.package_lpa ? String(student.package_lpa) : "",
  );
  const packageId = `pkg-${student.id}`;
  const statusId = `status-group-${student.id}`;

  function handleSave() {
    const pkg =
      status === "placed" && packageLPA
        ? Number.parseFloat(packageLPA)
        : undefined;
    onSave(student.id, status, pkg);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close modal backdrop"
        tabIndex={-1}
      />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        data-ocid="edit-status-modal"
        // biome-ignore lint/a11y/useSemanticElements: motion.div cannot be converted to dialog element
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal header */}
        <div className="border-b border-border px-6 py-5 flex items-start justify-between">
          <div>
            <h3
              id="modal-title"
              className="font-semibold text-foreground text-base"
            >
              Update Placement Status
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-xs">
              {student.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
            data-ocid="modal-close"
          >
            <IconX />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-4">
          <fieldset>
            <legend
              id={statusId}
              className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2"
            >
              Placement Status
            </legend>
            <div
              className="flex gap-2"
              // biome-ignore lint/a11y/useSemanticElements: group role needed for ARIA
              role="group"
              aria-labelledby={statusId}
            >
              {(["placed", "in-progress", "unplaced"] as PlacementStatus[]).map(
                (s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    onKeyDown={(e) => e.key === "Enter" && setStatus(s)}
                    data-ocid={`status-option-${s}`}
                    aria-pressed={status === s}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                      status === s
                        ? `${STATUS_COLORS[s].bg} ${STATUS_COLORS[s].text} border-current`
                        : "border-border text-muted-foreground hover:border-border hover:bg-muted"
                    }`}
                  >
                    {STATUS_COLORS[s].label}
                  </button>
                ),
              )}
            </div>
          </fieldset>

          <AnimatePresence>
            {status === "placed" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label
                  htmlFor={packageId}
                  className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2"
                >
                  Package (₹ LPA)
                </label>
                <Input
                  id={packageId}
                  type="number"
                  min={0}
                  step={0.1}
                  value={packageLPA}
                  onChange={(e) => setPackageLPA(e.target.value)}
                  placeholder="e.g. 12.5"
                  className="bg-background"
                  data-ocid="package-input"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal footer */}
        <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            data-ocid="modal-cancel"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} data-ocid="modal-save">
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Student Detail Slide-Over ────────────────────────────────────────────────

interface SlideOverProps {
  student: Student;
  onClose: () => void;
  onEditStatus: (student: Student) => void;
}

function StudentSlideOver({ student, onClose, onEditStatus }: SlideOverProps) {
  const studentApps = mockApplications
    .filter((a) => a.student_id === student.id)
    .slice(0, 5);

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const offeredApp = studentApps.find(
    (a) => a.status === "hired" || a.status === "offered",
  );
  const offeredCompany = offeredApp
    ? mockCompanies.find((c) => c.id === offeredApp.company_id)?.name
    : undefined;
  const companyName = student.placed_at ?? offeredCompany;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      data-ocid="slideover"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close panel"
        tabIndex={-1}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="relative z-10 w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden"
        // biome-ignore lint/a11y/useSemanticElements: motion.div cannot be converted to dialog element
        role="dialog"
        aria-modal="true"
        aria-label={`Student details for ${student.name}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {student.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {student.roll_number}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Close panel"
            data-ocid="slideover-close"
          >
            <IconX />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground truncate">
                {student.email}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {student.department}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {student.school}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {student.programme}
                </Badge>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>
                  Batch{" "}
                  <strong className="text-foreground">{student.batch}</strong>
                </span>
                <span>
                  Sec{" "}
                  <strong className="text-foreground">{student.section}</strong>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-2xl font-bold text-foreground font-display">
                {student.cgpa}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                CGPA
              </span>
            </div>
          </div>

          {/* Scores */}
          <div className="space-y-3 bg-muted/30 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assessment Scores
            </p>
            <ScoreBar
              label="Aptitude"
              value={student.aptitude_score}
              color={
                student.aptitude_score >= 70
                  ? "bg-[oklch(0.58_0.18_142)]"
                  : "bg-[oklch(0.72_0.18_64)]"
              }
            />
            <ScoreBar
              label="Programming"
              value={student.programming_score}
              color={
                student.programming_score >= 70
                  ? "bg-primary"
                  : "bg-[oklch(0.72_0.18_64)]"
              }
            />
          </div>

          {/* Skills */}
          {student.skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Placement Info */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Placement Info
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={student.placement_status} size="lg" />
            </div>
            {companyName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Company</span>
                <span className="text-sm font-semibold text-foreground">
                  {companyName}
                </span>
              </div>
            )}
            {student.package_lpa && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Package</span>
                <span className="text-sm font-bold text-[oklch(0.58_0.18_142)]">
                  ₹{student.package_lpa} LPA
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Applications
              </span>
              <span className="text-sm font-semibold text-foreground">
                {studentApps.length}
              </span>
            </div>
          </div>

          {/* Recent Applications */}
          {studentApps.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Recent Applications
              </p>
              <div className="space-y-2">
                {studentApps.map((app) => {
                  const company = mockCompanies.find(
                    (c) => c.id === app.company_id,
                  );
                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {company?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.role}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-3">
                        <span
                          className={`text-xs font-semibold capitalize ${APP_STATUS_COLORS[app.status] ?? ""}`}
                        >
                          {app.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {app.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex-shrink-0">
          <Button
            type="button"
            onClick={() => onEditStatus(student)}
            className="w-full"
            data-ocid="slideover-edit-btn"
          >
            <IconPencil />
            <span className="ml-2">Edit Placement Status</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sort Indicator ───────────────────────────────────────────────────────────

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: "name" | "cgpa" | "package_lpa";
  sortKey: "name" | "cgpa" | "package_lpa";
  sortDir: "asc" | "desc";
}) {
  if (sortKey !== col)
    return (
      <span className="ml-1 text-muted-foreground/40" aria-hidden="true">
        ↕
      </span>
    );
  return (
    <span className="ml-1 text-primary" aria-hidden="true">
      {sortDir === "asc" ? "↑" : "↓"}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ManageStudents() {
  // Filter state
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<Department[]>([]);
  const [statusFilter, setStatusFilter] = useState<PlacementStatus | "all">(
    "all",
  );
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");

  // Sort state
  const [sortKey, setSortKey] = useState<"name" | "cgpa" | "package_lpa">(
    "name",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);

  // UI state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Local students (to reflect updates without full re-render)
  const [students, setStudents] = useState<Student[]>(() => [...mockStudents]);

  // Unused ref kept to avoid breaking contracts
  const _ref = useRef<null>(null);

  const hasFilters =
    search !== "" ||
    deptFilter.length > 0 ||
    statusFilter !== "all" ||
    batchFilter !== "all" ||
    schoolFilter !== "all";

  // KPI counts
  const totalCount = students.length;
  const placedCount = students.filter(
    (s) => s.placement_status === "placed",
  ).length;
  const inProgressCount = students.filter(
    (s) => s.placement_status === "in-progress",
  ).length;
  const unplacedCount = students.filter(
    (s) => s.placement_status === "unplaced",
  ).length;

  // Filtered + sorted list
  const filteredStudents = useMemo(() => {
    let result = students;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.roll_number.toLowerCase().includes(q),
      );
    }

    if (deptFilter.length > 0) {
      result = result.filter((s) => deptFilter.includes(s.department));
    }

    if (statusFilter !== "all") {
      result = result.filter((s) => s.placement_status === statusFilter);
    }

    if (batchFilter !== "all") {
      result = result.filter((s) => String(s.batch) === batchFilter);
    }

    if (schoolFilter !== "all") {
      result = result.filter((s) => s.school === schoolFilter);
    }

    return [...result].sort((a, b) => {
      if (sortKey === "name") {
        return sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortKey === "cgpa") {
        return sortDir === "asc" ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
      }
      // package_lpa
      const av = a.package_lpa ?? 0;
      const bv = b.package_lpa ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [
    students,
    search,
    deptFilter,
    statusFilter,
    batchFilter,
    schoolFilter,
    sortKey,
    sortDir,
  ]);

  // Paginated slice
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const pageStudents = filteredStudents.slice(pageStart, pageEnd);

  // Reset to page 1 on filter change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [search, deptFilter, statusFilter, batchFilter, schoolFilter]);

  function toggleSort(key: "name" | "cgpa" | "package_lpa") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleDept(dept: Department) {
    setDeptFilter((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  }

  function handleSaveStatus(id: string, status: PlacementStatus, pkg?: number) {
    updateStudentStatus(id, status, pkg);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              placement_status: status,
              package_lpa: pkg ?? s.package_lpa,
            }
          : s,
      ),
    );
    if (selectedStudent?.id === id) {
      setSelectedStudent((prev) =>
        prev
          ? {
              ...prev,
              placement_status: status,
              package_lpa: pkg ?? prev.package_lpa,
            }
          : prev,
      );
    }
    setToast("Placement status updated successfully!");
  }

  function clearFilters() {
    setSearch("");
    setDeptFilter([]);
    setStatusFilter("all");
    setBatchFilter("all");
    setSchoolFilter("all");
  }

  function exportCSV() {
    const headers = [
      "Roll Number",
      "Name",
      "Email",
      "Department",
      "School",
      "Batch",
      "Section",
      "CGPA",
      "Status",
      "Package (LPA)",
    ];
    const rows = filteredStudents.map((s) => [
      s.roll_number,
      s.name,
      s.email,
      s.department,
      s.school,
      s.batch,
      s.section,
      s.cgpa,
      s.placement_status,
      s.package_lpa ?? "",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const kpiVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const kpiItem = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 28 },
    },
  };

  // Suppress the unused ref warning
  void _ref;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-5 sticky top-0 z-30">
        <h1 className="text-xl font-bold text-foreground font-display">
          Manage Students
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {totalCount} students across {DEPARTMENTS.length} departments
        </p>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
        {/* KPI Cards */}
        <motion.div
          variants={kpiVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div variants={kpiItem}>
            <KPICard
              title="Total Students"
              value={totalCount}
              color="blue"
              trend="neutral"
              data-ocid="kpi-total"
            />
          </motion.div>
          <motion.div variants={kpiItem}>
            <KPICard
              title="Placed"
              value={placedCount}
              color="green"
              trend="up"
              trendPercent={8}
              data-ocid="kpi-placed"
            />
          </motion.div>
          <motion.div variants={kpiItem}>
            <KPICard
              title="In Progress"
              value={inProgressCount}
              color="amber"
              trend="neutral"
              data-ocid="kpi-in-progress"
            />
          </motion.div>
          <motion.div variants={kpiItem}>
            <KPICard
              title="Unplaced"
              value={unplacedCount}
              color="red"
              trend="down"
              trendPercent={3}
              data-ocid="kpi-unplaced"
            />
          </motion.div>
        </motion.div>

        {/* Filter Bar */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 sticky top-[73px] z-20 shadow-sm">
          {/* Row 1: search + export */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <IconSearch />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or roll number..."
                className="pl-9 bg-background"
                data-ocid="student-search"
                aria-label="Search students"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  data-ocid="clear-filters"
                  className="text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={exportCSV}
                data-ocid="export-csv"
              >
                <IconDownload />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Row 2: filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status chips */}
            <div
              className="flex gap-1.5"
              // biome-ignore lint/a11y/useSemanticElements: group role needed for ARIA
              role="group"
              aria-label="Filter by status"
            >
              {(["all", "placed", "in-progress", "unplaced"] as const).map(
                (s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    onKeyDown={(e) => e.key === "Enter" && setStatusFilter(s)}
                    data-ocid={`status-filter-${s}`}
                    aria-pressed={statusFilter === s}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s === "all"
                      ? "All"
                      : STATUS_COLORS[s as PlacementStatus].label}
                  </button>
                ),
              )}
            </div>

            <div className="w-px h-5 bg-border" aria-hidden="true" />

            {/* Department multi-select */}
            <div
              className="flex flex-wrap gap-1"
              // biome-ignore lint/a11y/useSemanticElements: group role needed for ARIA
              role="group"
              aria-label="Filter by department"
            >
              {DEPARTMENTS.map((dept) => (
                <button
                  type="button"
                  key={dept}
                  onClick={() => toggleDept(dept)}
                  onKeyDown={(e) => e.key === "Enter" && toggleDept(dept)}
                  data-ocid={`dept-filter-${dept}`}
                  aria-pressed={deptFilter.includes(dept)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    deptFilter.includes(dept)
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div
              className="w-px h-5 bg-border hidden sm:block"
              aria-hidden="true"
            />

            {/* Batch filter */}
            <label htmlFor="batch-filter" className="sr-only">
              Filter by batch
            </label>
            <select
              id="batch-filter"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="text-xs border border-border bg-background rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              data-ocid="batch-filter"
            >
              <option value="all">All Batches</option>
              {BATCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* School filter */}
            <label htmlFor="school-filter" className="sr-only">
              Filter by school
            </label>
            <select
              id="school-filter"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="text-xs border border-border bg-background rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              data-ocid="school-filter"
            >
              <option value="all">All Schools</option>
              {SCHOOLS.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {pageStudents.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="empty-state"
            >
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="w-10 h-10 text-muted-foreground"
                  aria-hidden="true"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 24h16M24 16v16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 31l14-14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-foreground">
                No students found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                No students match your current filters. Try adjusting your
                search or filter criteria.
              </p>
              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th
                      scope="col"
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-10"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="text-left px-0 py-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort("name")}
                        className="w-full text-left px-4 py-3 hover:text-foreground transition-colors select-none"
                        aria-label={`Sort by name ${sortKey === "name" ? (sortDir === "asc" ? "descending" : "ascending") : "ascending"}`}
                      >
                        Name{" "}
                        <SortIcon
                          col="name"
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell"
                    >
                      Dept
                    </th>
                    <th
                      scope="col"
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell"
                    >
                      Batch
                    </th>
                    <th
                      scope="col"
                      className="text-left px-0 py-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort("cgpa")}
                        className="w-full text-left px-4 py-3 hover:text-foreground transition-colors select-none"
                        aria-label={`Sort by CGPA ${sortKey === "cgpa" ? (sortDir === "asc" ? "descending" : "ascending") : "ascending"}`}
                      >
                        CGPA{" "}
                        <SortIcon
                          col="cgpa"
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="text-left px-0 py-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort("package_lpa")}
                        className="w-full text-left px-4 py-3 hover:text-foreground transition-colors select-none"
                        aria-label={`Sort by package ${sortKey === "package_lpa" ? (sortDir === "asc" ? "descending" : "ascending") : "ascending"}`}
                      >
                        Package{" "}
                        <SortIcon
                          col="package_lpa"
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {pageStudents.map((student, idx) => (
                      <motion.tr
                        key={student.id}
                        layout
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.18, delay: idx * 0.025 }}
                        className={`border-b border-border last:border-0 transition-colors hover:bg-primary/5 ${
                          idx % 2 === 0 ? "" : "bg-muted/20"
                        }`}
                        data-ocid={`student-row-${student.id}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {pageStart + idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate max-w-[160px]">
                                {student.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                {student.roll_number}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-semibold"
                          >
                            {student.department}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {student.batch}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-bold tabular-nums ${
                              student.cgpa >= 8.5
                                ? "text-[oklch(0.58_0.18_142)]"
                                : student.cgpa >= 7
                                  ? "text-foreground"
                                  : "text-destructive"
                            }`}
                          >
                            {student.cgpa.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={student.placement_status} />
                        </td>
                        <td className="px-4 py-3">
                          {student.package_lpa ? (
                            <span className="text-sm font-semibold text-[oklch(0.58_0.18_142)]">
                              ₹{student.package_lpa} LPA
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(student)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`View ${student.name}`}
                              data-ocid={`view-btn-${student.id}`}
                            >
                              <IconEye />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStudent(student)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`Edit status for ${student.name}`}
                              data-ocid={`edit-btn-${student.id}`}
                            >
                              <IconPencil />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="border-t border-border px-4 py-3 flex items-center justify-between bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {pageStart + 1}–{Math.min(pageEnd, filteredStudents.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {filteredStudents.length}
                </span>{" "}
                students
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  data-ocid="prev-page"
                  className="h-7 text-xs px-2.5"
                >
                  ← Prev
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  {safePage} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  data-ocid="next-page"
                  className="h-7 text-xs px-2.5"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentSlideOver
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onEditStatus={(s) => {
              setEditingStudent(s);
              setSelectedStudent(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingStudent && (
          <EditStatusModal
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={handleSaveStatus}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onHide={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
