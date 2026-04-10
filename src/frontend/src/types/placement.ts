export type PlacementStatus = "placed" | "unplaced" | "in-progress";
export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interviewing"
  | "offered"
  | "hired"
  | "rejected";
export type DriveStatus = "upcoming" | "completed" | "ongoing";
export type CompanyTier = 1 | 2 | 3;
export type Department = "CSE" | "IT" | "ECE" | "AI-ML" | "CE" | "ME";
export type School = "SCOPE" | "SENSE" | "SITE" | "SMEC";
export type DateRange = "7d" | "30d" | "quarter" | "year" | "custom";

export interface Student {
  id: string;
  name: string;
  department: Department;
  school: School;
  programme: string;
  batch: number;
  section: string;
  cgpa: number;
  aptitude_score: number;
  programming_score: number;
  placement_status: PlacementStatus;
  skills: string[];
  placed_at?: string;
  package_lpa?: number;
  email: string;
  roll_number: string;
}

export interface Company {
  id: string;
  name: string;
  tier: CompanyTier;
  avg_package: number;
  max_package: number;
  departments_hiring: Department[];
  open_positions: number;
  logo?: string;
  industry: string;
  hired_count: number;
}

export interface Application {
  id: string;
  student_id: string;
  company_id: string;
  status: ApplicationStatus;
  date: string;
  role: string;
  package_offered?: number;
  interview_date?: string;
  notes?: string;
}

export interface JobPosting {
  id: string;
  company_id: string;
  title: string;
  skills_required: string[];
  eligible_branches: Department[];
  positions: number;
  min_cgpa: number;
  package_range: string;
  deadline: string;
}

export interface PlacementDrive {
  id: string;
  company_id: string;
  company_name: string;
  date: string;
  department: Department[];
  status: DriveStatus;
  positions: number;
  tier: CompanyTier;
}

export interface Referral {
  id: string;
  student_id: string;
  student_name: string;
  referrer: string;
  company: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
}

export interface DeptStats {
  department: Department;
  school: School;
  total: number;
  placed: number;
  unplaced: number;
  in_progress: number;
  placement_rate: number;
  avg_cgpa: number;
  avg_aptitude: number;
  avg_programming: number;
  failure_rate: number;
  top_company: string;
  top_skills: string[];
}

export interface BatchStats {
  batch: number;
  total: number;
  placed: number;
  unplaced: number;
  in_progress: number;
  placement_rate: number;
  avg_package: number;
  by_department: Partial<Record<Department, { placed: number; total: number }>>;
}

export interface ActivityItem {
  id: string;
  type: "application" | "offer" | "referral" | "drive" | "hire";
  message: string;
  student?: string;
  company?: string;
  timestamp: string;
  badge?: string;
}

export interface PipelineStage {
  stage: ApplicationStatus;
  label: string;
  count: number;
  percent: number;
  conversion: number;
}

export interface MonthlyTrend {
  month: string;
  applications: number;
  placements: number;
  shortlisted: number;
}

export interface SkillGap {
  skill: string;
  demand: number;
  supply: number;
  gap: number;
}

export interface PackageDistribution {
  range: string;
  count: number;
  min: number;
  max: number;
}

export interface FilterState {
  departments: Department[];
  schools: School[];
  programme: string;
  batch: string;
  section: string;
  dateRange: DateRange;
  customStart?: string;
  customEnd?: string;
}

// ─── Interview & Student Analytics Types ─────────────────────────────────────

export interface InterviewSession {
  id: string;
  student_id: string;
  company: string;
  role: string;
  date: string;
  type: "technical" | "hr" | "aptitude" | "group-discussion" | "mock";
  score: number; // 0-100
  duration_minutes: number;
  questions_answered: number;
  questions_total: number;
  feedback?: string;
  status: "scheduled" | "completed" | "cancelled";
  round: number;
}

export interface PeerBenchmark {
  student_cgpa: number;
  dept_avg_cgpa: number;
  dept_cgpa_percentile: number;
  student_aptitude: number;
  dept_avg_aptitude: number;
  dept_aptitude_percentile: number;
  student_programming: number;
  dept_avg_programming: number;
  dept_programming_percentile: number;
  student_package?: number;
  dept_avg_package?: number;
  dept_package_percentile?: number;
  dept_placement_rate: number;
  batch_size: number;
}

export interface StudentStats {
  total_applications: number;
  applications_by_status: Record<ApplicationStatus, number>;
  cgpa_percentile: number;
  upcoming_interview_count: number;
  skill_count: number;
  avg_package_dept: number;
  top_company_applied?: string;
  interview_sessions: InterviewSession[];
  peer_benchmark: PeerBenchmark;
}

export interface UpcomingDrive {
  id: string;
  company_id: string;
  company_name: string;
  date: string;
  tier: CompanyTier;
  roles: string[];
  min_cgpa: number;
  package_range: string;
  eligible_branches: Department[];
  positions: number;
}
