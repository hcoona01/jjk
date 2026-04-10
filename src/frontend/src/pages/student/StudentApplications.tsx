import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { mockApplicationsAll, mockCompanies } from "@/lib/mockData";
import { useStudentData } from "@/lib/studentData";
import type {
  Application,
  ApplicationStatus,
  CompanyTier,
} from "@/types/placement";
import {
  ArrowDownUp,
  ArrowUpDown,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Filter,
  GraduationCap,
  Search,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SortKey = "date" | "company" | "status";
type SortDir = "asc" | "desc";
type TierFilter = "all" | "1" | "2" | "3";

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; classes: string; icon: React.ElementType; step: number }
> = {
  applied: {
    label: "Applied",
    classes: "bg-muted/60 text-muted-foreground border border-border",
    icon: Clock,
    step: 0,
  },
  shortlisted: {
    label: "Shortlisted",
    classes: "badge-chart-2",
    icon: Filter,
    step: 1,
  },
  interviewing: {
    label: "Interviewing",
    classes: "status-in-progress",
    icon: Briefcase,
    step: 2,
  },
  offered: {
    label: "Offered",
    classes: "status-placed",
    icon: CheckCircle2,
    step: 3,
  },
  hired: {
    label: "Hired",
    classes: "status-placed",
    icon: CheckCircle2,
    step: 4,
  },
  rejected: {
    label: "Rejected",
    classes: "status-unplaced",
    icon: XCircle,
    step: -1,
  },
};

const TIER_CLASSES: Record<CompanyTier, string> = {
  1: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  2: "badge-chart-2",
  3: "bg-muted/60 text-muted-foreground border border-border",
};

const STATUS_TIMELINE: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
];

const ALL_STATUSES: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
  "rejected",
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  index,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ?? "bg-primary/10"}`}
      >
        <Icon size={18} className="text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-foreground leading-tight">
          {value}
        </p>
        <p className="text-xs text-muted-foreground truncate">{label}</p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}
    >
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function TierBadge({ tier }: { tier: CompanyTier }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${TIER_CLASSES[tier]}`}
    >
      {tier === 1 && <Star size={8} className="mr-1" />}
      Tier {tier}
    </span>
  );
}

function SortButton({
  active,
  dir,
  onClick,
  children,
}: {
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const Icon = active
    ? dir === "asc"
      ? ArrowUpDown
      : ArrowDownUp
    : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 text-xs font-medium transition-colors duration-150 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
      <Icon size={12} className="flex-shrink-0" />
    </button>
  );
}

// ─── Detail Sheet ──────────────────────────────────────────────────────────────

function ApplicationDetailSheet({
  app,
  onClose,
}: {
  app: Application | null;
  onClose: () => void;
}) {
  const company = app
    ? mockCompanies.find((c) => c.id === app.company_id)
    : null;
  const currentStep = app ? STATUS_CONFIG[app.status].step : -2;

  return (
    <Sheet open={!!app} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[440px] sm:max-w-[440px] overflow-y-auto bg-card border-border p-0"
        data-ocid="sheet-app-detail"
      >
        {app && company && (
          <>
            {/* Sheet Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border bg-card">
              <SheetHeader className="mb-0">
                <SheetTitle className="text-base font-semibold text-foreground sr-only">
                  Application Details
                </SheetTitle>
              </SheetHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-base truncate">
                    {company.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {company.industry}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <TierBadge tier={company.tier} />
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Application Info */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Your Application
                </h3>
                <div className="bg-background border border-border rounded-lg divide-y divide-border">
                  <InfoRow icon={Briefcase} label="Role" value={app.role} />
                  <InfoRow
                    icon={CalendarDays}
                    label="Applied"
                    value={new Date(app.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  />
                  {app.interview_date && (
                    <InfoRow
                      icon={Clock}
                      label="Interview"
                      value={new Date(app.interview_date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                      highlight
                    />
                  )}
                  {app.package_offered && (
                    <InfoRow
                      icon={DollarSign}
                      label="Package"
                      value={`₹${app.package_offered} LPA`}
                      highlight
                    />
                  )}
                </div>
              </section>

              {/* Company Info */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Company Details
                </h3>
                <div className="bg-background border border-border rounded-lg divide-y divide-border">
                  <InfoRow
                    icon={TrendingUp}
                    label="Avg Package"
                    value={`₹${company.avg_package} LPA`}
                  />
                  <InfoRow
                    icon={DollarSign}
                    label="Max Package"
                    value={`₹${company.max_package} LPA`}
                  />
                  <InfoRow
                    icon={GraduationCap}
                    label="Open Positions"
                    value={String(company.open_positions)}
                  />
                </div>
              </section>

              {/* Status Timeline */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Application Progress
                </h3>
                {app.status === "rejected" ? (
                  <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full status-unplaced flex items-center justify-center flex-shrink-0">
                      <XCircle size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Application Rejected
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This application did not proceed further.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="relative space-y-0">
                      {STATUS_TIMELINE.map((s, i) => {
                        const cfg = STATUS_CONFIG[s];
                        const StepIcon = cfg.icon;
                        const done = i < currentStep || app.status === s;
                        const active = app.status === s;
                        const isLast = i === STATUS_TIMELINE.length - 1;
                        return (
                          <div key={s} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : done
                                      ? "border-primary/40 bg-primary/10 text-primary"
                                      : "border-border bg-muted/30 text-muted-foreground/40"
                                }`}
                              >
                                <StepIcon size={12} />
                              </div>
                              {!isLast && (
                                <div
                                  className={`w-0.5 h-6 mt-0.5 rounded-full transition-all duration-300 ${
                                    done && !active
                                      ? "bg-primary/30"
                                      : "bg-border"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="pb-1 pt-0.5">
                              <p
                                className={`text-sm font-medium ${
                                  active
                                    ? "text-primary"
                                    : done
                                      ? "text-foreground"
                                      : "text-muted-foreground/50"
                                }`}
                              >
                                {cfg.label}
                              </p>
                              {active && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Current stage
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* Notes */}
              {app.notes && (
                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Notes / Feedback
                  </h3>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {app.notes}
                    </p>
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <Icon size={14} className="text-muted-foreground flex-shrink-0" />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <span
        className={`text-xs font-semibold ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function StudentApplications() {
  const { student } = useStudentData();

  // URL-persisted filters via local state synced manually (TanStack router searchParams)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [tierMenuOpen, setTierMenuOpen] = useState(false);

  // Get applications for current student
  const applications = useMemo(() => {
    if (!student) return [];
    return mockApplicationsAll.filter((a) => a.student_id === student.id);
  }, [student]);

  // Counts per status
  const counts = useMemo(() => {
    const base: Record<ApplicationStatus | "all", number> = {
      all: applications.length,
      applied: 0,
      shortlisted: 0,
      interviewing: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    };
    for (const a of applications) base[a.status]++;
    return base;
  }, [applications]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const active = applications.filter((a) => a.status !== "rejected").length;
    const shortlisted = counts.shortlisted + counts.interviewing;
    const offers = counts.offered + counts.hired;
    return { total: applications.length, active, shortlisted, offers };
  }, [applications, counts]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = applications.filter((a) => {
      const company = mockCompanies.find((c) => c.id === a.company_id);
      const matchSearch =
        !search ||
        a.role.toLowerCase().includes(search.toLowerCase()) ||
        (company?.name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchTier =
        tierFilter === "all" || String(company?.tier ?? "") === tierFilter;
      return matchSearch && matchStatus && matchTier;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortKey === "company") {
        const ca = mockCompanies.find((c) => c.id === a.company_id)?.name ?? "";
        const cb = mockCompanies.find((c) => c.id === b.company_id)?.name ?? "";
        cmp = ca.localeCompare(cb);
      } else if (sortKey === "status") {
        cmp = STATUS_CONFIG[a.status].step - STATUS_CONFIG[b.status].step;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [applications, search, statusFilter, tierFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <GraduationCap size={48} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">
          Please log in to view your applications.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-4 sm:px-6 py-7 space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My Applications
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track all your job applications in one place
          </p>
        </div>
        <Badge variant="secondary" className="text-sm font-semibold">
          {applications.length} total
        </Badge>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Applications"
          value={summaryStats.total}
          icon={FileText}
          index={0}
        />
        <StatCard
          label="Active (not rejected)"
          value={summaryStats.active}
          icon={TrendingUp}
          index={1}
          accent="bg-blue-500/10"
        />
        <StatCard
          label="In Pipeline"
          value={summaryStats.shortlisted}
          icon={Filter}
          index={2}
          accent="bg-cyan-500/10"
        />
        <StatCard
          label="Offers Received"
          value={summaryStats.offers}
          icon={CheckCircle2}
          index={3}
          accent="bg-green-500/10"
        />
      </div>

      {/* Sticky Filter/Search Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border border-border rounded-xl p-3 space-y-3 shadow-sm">
        {/* Row 1: search + tier + sort */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              placeholder="Search company or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-muted/30 border-border"
              data-ocid="input-app-search"
            />
          </div>

          {/* Tier filter dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setTierMenuOpen((v) => !v)}
              data-ocid="filter-tier-btn"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-smooth ${
                tierFilter !== "all"
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 size={12} />
              {tierFilter === "all" ? "All Tiers" : `Tier ${tierFilter}`}
              <ChevronDown
                size={12}
                className={`transition-transform ${tierMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {tierMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1 left-0 bg-popover border border-border rounded-lg shadow-lg z-20 min-w-[120px] py-1"
                >
                  {(["all", "1", "2", "3"] as TierFilter[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTierFilter(t);
                        setTierMenuOpen(false);
                      }}
                      data-ocid={`tier-option-${t}`}
                      className={`w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted/40 ${
                        tierFilter === t
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      }`}
                    >
                      {t === "all" ? "All Tiers" : `Tier ${t}`}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Sort:
            </span>
            <SortButton
              active={sortKey === "date"}
              dir={sortDir}
              onClick={() => toggleSort("date")}
            >
              Date
            </SortButton>
            <SortButton
              active={sortKey === "company"}
              dir={sortDir}
              onClick={() => toggleSort("company")}
            >
              Company
            </SortButton>
            <SortButton
              active={sortKey === "status"}
              dir={sortDir}
              onClick={() => toggleSort("status")}
            >
              Status
            </SortButton>
          </div>
        </div>

        {/* Row 2: Status filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...ALL_STATUSES] as (ApplicationStatus | "all")[]).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                data-ocid={`filter-status-${s}`}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-smooth ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                    statusFilter === s
                      ? "bg-primary-foreground/20"
                      : "bg-background/60"
                  }`}
                >
                  {s === "all" ? counts.all : counts[s]}
                </span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[2fr_1.5fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border bg-muted/20">
          <SortButton
            active={sortKey === "company"}
            dir={sortDir}
            onClick={() => toggleSort("company")}
          >
            Company / Role
          </SortButton>
          <div className="text-xs font-medium text-muted-foreground">Role</div>
          <SortButton
            active={sortKey === "date"}
            dir={sortDir}
            onClick={() => toggleSort("date")}
          >
            Applied
          </SortButton>
          <SortButton
            active={sortKey === "status"}
            dir={sortDir}
            onClick={() => toggleSort("status")}
          >
            Status
          </SortButton>
          <div className="text-xs font-medium text-muted-foreground">Tier</div>
          <div className="text-xs font-medium text-muted-foreground text-right">
            Package / Action
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="empty-applications"
            >
              <Briefcase size={36} className="text-muted-foreground/25" />
              <p className="font-semibold text-foreground text-sm">
                No applications found
              </p>
              <p className="text-xs text-muted-foreground">
                {search || statusFilter !== "all" || tierFilter !== "all"
                  ? "Try adjusting your filters or search term."
                  : "Start applying to companies to see your applications here."}
              </p>
              {(search || statusFilter !== "all" || tierFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setTierFilter("all");
                  }}
                  className="mt-1 text-xs"
                  data-ocid="btn-clear-filters"
                >
                  Clear all filters
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-border"
            >
              {filtered.map((app, i) => {
                const company = mockCompanies.find(
                  (c) => c.id === app.company_id,
                );
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: Math.min(i * 0.035, 0.5),
                      duration: 0.3,
                    }}
                    data-ocid={`app-row-${app.id}`}
                    className="group"
                  >
                    {/* Desktop row */}
                    <div className="hidden sm:grid grid-cols-[2fr_1.5fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-muted/20 transition-smooth">
                      {/* Company */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-muted/60 border border-border flex items-center justify-center flex-shrink-0">
                          <Building2
                            size={14}
                            className="text-muted-foreground"
                          />
                        </div>
                        <span className="text-sm font-semibold text-foreground truncate">
                          {company?.name ?? app.company_id}
                        </span>
                      </div>
                      {/* Role */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm text-foreground/80 truncate">
                          {app.role}
                        </span>
                        {app.interview_date && (
                          <span className="flex items-center gap-1 text-[10px] text-primary/80 bg-primary/5 border border-primary/20 px-1.5 py-0.5 rounded flex-shrink-0">
                            <Clock size={8} />
                            {new Date(app.interview_date).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short" },
                            )}
                          </span>
                        )}
                      </div>
                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <CalendarDays size={11} />
                        {new Date(app.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>
                      {/* Status */}
                      <StatusBadge status={app.status} />
                      {/* Tier */}
                      {company ? <TierBadge tier={company.tier} /> : <span />}
                      {/* Package + Action */}
                      <div className="flex items-center gap-2 justify-end">
                        {app.package_offered ? (
                          <span className="text-xs font-semibold text-primary">
                            ₹{app.package_offered}L
                          </span>
                        ) : (
                          <span />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                          data-ocid={`btn-view-detail-${app.id}`}
                          className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-smooth"
                        >
                          <ExternalLink size={12} className="mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>

                    {/* Mobile row */}
                    <button
                      type="button"
                      className="sm:hidden w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-smooth cursor-pointer text-left"
                      onClick={() => setSelectedApp(app)}
                      data-ocid={`app-row-mobile-${app.id}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border flex items-center justify-center flex-shrink-0">
                        <Building2
                          size={15}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {company?.name ?? app.company_id}
                          </p>
                          {app.package_offered && (
                            <span className="text-xs text-primary font-medium">
                              ₹{app.package_offered}L
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground truncate">
                            {app.role}
                          </span>
                          <span className="text-muted-foreground/30 text-xs">
                            ·
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(app.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <StatusBadge status={app.status} />
                        {company && <TierBadge tier={company.tier} />}
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-muted/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {applications.length} applications
            </p>
            {filtered.length !== applications.length && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setTierFilter("all");
                }}
                data-ocid="btn-show-all"
              >
                Show all
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Application Detail Sheet */}
      <ApplicationDetailSheet
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </motion.div>
  );
}
