import type {
  ActivityItem,
  Application,
  BatchStats,
  Company,
  CompanyTier,
  Department,
  DeptStats,
  InterviewSession,
  JobPosting,
  MonthlyTrend,
  PackageDistribution,
  PeerBenchmark,
  PipelineStage,
  PlacementDrive,
  Referral,
  School,
  SkillGap,
  Student,
  UpcomingDrive,
} from "../types/placement";

// ─── Students ────────────────────────────────────────────────────────────────

const DEPARTMENTS: Department[] = ["CSE", "IT", "ECE", "AI-ML", "CE", "ME"];
const SCHOOLS: School[] = ["SCOPE", "SENSE", "SITE", "SMEC"];
const DEPT_SCHOOL: Record<Department, School> = {
  CSE: "SCOPE",
  IT: "SCOPE",
  "AI-ML": "SCOPE",
  ECE: "SENSE",
  CE: "SITE",
  ME: "SMEC",
};
const SKILLS_BY_DEPT: Record<Department, string[]> = {
  CSE: [
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "AWS",
    "Docker",
    "TypeScript",
  ],
  IT: ["Python", "Django", "SQL", "Linux", "Networking", "Azure", "PHP"],
  ECE: ["C++", "MATLAB", "VLSI", "Embedded C", "IoT", "Signal Processing"],
  "AI-ML": [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "NLP",
    "Deep Learning",
    "R",
  ],
  CE: ["AutoCAD", "STAAD Pro", "Revit", "Project Management", "GIS"],
  ME: [
    "SolidWorks",
    "ANSYS",
    "AutoCAD",
    "CNC",
    "Manufacturing",
    "Thermodynamics",
  ],
};
const COMPANIES_BY_DEPT: Record<Department, string[]> = {
  CSE: ["Google", "Microsoft", "Amazon", "Infosys", "TCS"],
  IT: ["Wipro", "HCL", "Cognizant", "Capgemini", "Tech Mahindra"],
  ECE: ["Qualcomm", "Intel", "Samsung", "L&T", "Bosch"],
  "AI-ML": ["Google", "Microsoft", "OpenAI", "Fractal Analytics", "Mu Sigma"],
  CE: ["L&T Construction", "Gammon India", "Shapoorji Pallonji", "AECOM"],
  ME: ["Tata Motors", "Maruti", "Bosch", "Mahindra", "ISRO"],
};
const FIRST_NAMES = [
  "Aarav",
  "Aditi",
  "Arjun",
  "Ananya",
  "Dhruv",
  "Disha",
  "Kabir",
  "Kavya",
  "Rohan",
  "Priya",
  "Siddharth",
  "Sneha",
  "Vivek",
  "Riya",
  "Aditya",
  "Pooja",
  "Kartik",
  "Meera",
  "Rahul",
  "Neha",
  "Ishaan",
  "Shreya",
  "Nikhil",
  "Tanvi",
  "Yash",
  "Divya",
  "Pranav",
  "Isha",
  "Akash",
  "Simran",
  "Harsh",
  "Preeti",
  "Arnav",
  "Sakshi",
  "Varun",
  "Anjali",
  "Karan",
  "Swati",
  "Tejas",
  "Nidhi",
  "Aakash",
  "Pallavi",
  "Chirag",
  "Deepika",
  "Amit",
  "Rupali",
];
const LAST_NAMES = [
  "Sharma",
  "Patel",
  "Singh",
  "Kumar",
  "Gupta",
  "Shah",
  "Mehta",
  "Joshi",
  "Verma",
  "Reddy",
  "Nair",
  "Iyer",
  "Kapoor",
  "Malhotra",
  "Bose",
  "Das",
  "Pillai",
  "Rao",
  "Mishra",
  "Srivastava",
];

function rand(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min;
  return decimals ? Number.parseFloat(val.toFixed(decimals)) : Math.floor(val);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const SECTIONS = ["K21EA", "K21EB", "K21EC"];
const BATCHES = [2021, 2022, 2023, 2024];

function generateStudents(): Student[] {
  const students: Student[] = [];
  let id = 1;

  // Distribute: CSE=30, IT=20, ECE=20, AI-ML=20, CE=15, ME=15
  const counts: Record<Department, number> = {
    CSE: 30,
    IT: 20,
    ECE: 20,
    "AI-ML": 20,
    CE: 15,
    ME: 15,
  };

  for (const dept of DEPARTMENTS) {
    const n = counts[dept];
    for (let i = 0; i < n; i++) {
      const cgpa = rand(5.5, 9.8, 1);
      const aptitude = rand(40, 95);
      const programming = rand(40, 95);
      const score = (cgpa * 10 + aptitude * 0.4 + programming * 0.5) / 20;

      let placement_status: Student["placement_status"];
      if (score > 7.5 && Math.random() > 0.2) placement_status = "placed";
      else if (score > 5.5 && Math.random() > 0.4)
        placement_status = "in-progress";
      else placement_status = "unplaced";

      const skillPool = SKILLS_BY_DEPT[dept];
      const skills = shuffle(skillPool).slice(
        0,
        rand(2, Math.min(5, skillPool.length)),
      );

      const firstName = pick(FIRST_NAMES);
      const lastName = pick(LAST_NAMES);
      const batch = pick(BATCHES);

      students.push({
        id: `STU${String(id).padStart(4, "0")}`,
        name: `${firstName} ${lastName}`,
        department: dept,
        school: DEPT_SCHOOL[dept],
        programme: "B.Tech",
        batch,
        section: pick(SECTIONS),
        cgpa,
        aptitude_score: aptitude,
        programming_score: programming,
        placement_status,
        skills,
        placed_at:
          placement_status === "placed"
            ? pick(COMPANIES_BY_DEPT[dept])
            : undefined,
        package_lpa:
          placement_status === "placed" ? rand(35, 180) / 10 : undefined,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@vit.ac.in`,
        roll_number: `${batch}${dept.replace("-", "")}${String(id).padStart(4, "0")}`,
      });
      id++;
    }
  }

  return students;
}

// ─── Hardcoded Demo Students (always present, easy roll numbers) ──────────────
const demoStudents: Student[] = [
  {
    id: "DEMO001",
    name: "Arjun Sharma",
    department: "CSE",
    school: "SCOPE",
    programme: "B.Tech",
    batch: 2021,
    section: "K21EA",
    cgpa: 8.7,
    aptitude_score: 85,
    programming_score: 90,
    placement_status: "placed",
    skills: ["React", "Node.js", "Python", "TypeScript"],
    placed_at: "Google",
    package_lpa: 28.5,
    email: "arjun.sharma.demo@vit.ac.in",
    roll_number: "DEMO001",
  },
  {
    id: "DEMO002",
    name: "Priya Patel",
    department: "AI-ML",
    school: "SCOPE",
    programme: "B.Tech",
    batch: 2022,
    section: "K21EB",
    cgpa: 9.1,
    aptitude_score: 92,
    programming_score: 88,
    placement_status: "placed",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP"],
    placed_at: "Microsoft",
    package_lpa: 22.0,
    email: "priya.patel.demo@vit.ac.in",
    roll_number: "DEMO002",
  },
  {
    id: "DEMO003",
    name: "Rohan Kumar",
    department: "IT",
    school: "SCOPE",
    programme: "B.Tech",
    batch: 2021,
    section: "K21EC",
    cgpa: 7.8,
    aptitude_score: 78,
    programming_score: 82,
    placement_status: "in-progress",
    skills: ["Python", "Django", "SQL", "Azure"],
    email: "rohan.kumar.demo@vit.ac.in",
    roll_number: "DEMO003",
  },
];

export const mockStudents: Student[] = [...demoStudents, ...generateStudents()];

// ─── Companies ───────────────────────────────────────────────────────────────

export const mockCompanies: Company[] = [
  {
    id: "C001",
    name: "Google",
    tier: 1,
    avg_package: 28.5,
    max_package: 45,
    departments_hiring: ["CSE", "AI-ML"],
    open_positions: 8,
    industry: "Tech",
    hired_count: 12,
  },
  {
    id: "C002",
    name: "Microsoft",
    tier: 1,
    avg_package: 22.0,
    max_package: 38,
    departments_hiring: ["CSE", "IT", "AI-ML"],
    open_positions: 10,
    industry: "Tech",
    hired_count: 15,
  },
  {
    id: "C003",
    name: "Amazon",
    tier: 1,
    avg_package: 20.5,
    max_package: 32,
    departments_hiring: ["CSE", "IT"],
    open_positions: 12,
    industry: "E-Commerce",
    hired_count: 10,
  },
  {
    id: "C004",
    name: "Qualcomm",
    tier: 1,
    avg_package: 18.0,
    max_package: 28,
    departments_hiring: ["ECE"],
    open_positions: 5,
    industry: "Semiconductor",
    hired_count: 7,
  },
  {
    id: "C005",
    name: "OpenAI",
    tier: 1,
    avg_package: 35.0,
    max_package: 60,
    departments_hiring: ["AI-ML", "CSE"],
    open_positions: 4,
    industry: "AI",
    hired_count: 3,
  },
  {
    id: "C006",
    name: "Infosys",
    tier: 2,
    avg_package: 8.5,
    max_package: 12,
    departments_hiring: ["CSE", "IT", "ECE", "AI-ML"],
    open_positions: 30,
    industry: "IT Services",
    hired_count: 28,
  },
  {
    id: "C007",
    name: "TCS",
    tier: 2,
    avg_package: 7.0,
    max_package: 10,
    departments_hiring: ["CSE", "IT", "ECE"],
    open_positions: 35,
    industry: "IT Services",
    hired_count: 32,
  },
  {
    id: "C008",
    name: "Wipro",
    tier: 2,
    avg_package: 6.5,
    max_package: 9,
    departments_hiring: ["CSE", "IT"],
    open_positions: 25,
    industry: "IT Services",
    hired_count: 22,
  },
  {
    id: "C009",
    name: "Cognizant",
    tier: 2,
    avg_package: 7.5,
    max_package: 11,
    departments_hiring: ["IT", "CSE"],
    open_positions: 20,
    industry: "IT Services",
    hired_count: 18,
  },
  {
    id: "C010",
    name: "HCL Technologies",
    tier: 2,
    avg_package: 8.0,
    max_package: 12,
    departments_hiring: ["CSE", "IT", "ECE"],
    open_positions: 22,
    industry: "IT Services",
    hired_count: 20,
  },
  {
    id: "C011",
    name: "Intel",
    tier: 1,
    avg_package: 16.0,
    max_package: 24,
    departments_hiring: ["ECE", "CSE"],
    open_positions: 6,
    industry: "Semiconductor",
    hired_count: 5,
  },
  {
    id: "C012",
    name: "Samsung R&D",
    tier: 1,
    avg_package: 15.0,
    max_package: 22,
    departments_hiring: ["ECE", "AI-ML"],
    open_positions: 8,
    industry: "Electronics",
    hired_count: 6,
  },
  {
    id: "C013",
    name: "L&T",
    tier: 2,
    avg_package: 7.5,
    max_package: 12,
    departments_hiring: ["CE", "ME", "ECE"],
    open_positions: 18,
    industry: "Engineering",
    hired_count: 15,
  },
  {
    id: "C014",
    name: "Tata Motors",
    tier: 2,
    avg_package: 8.0,
    max_package: 14,
    departments_hiring: ["ME", "ECE"],
    open_positions: 15,
    industry: "Automotive",
    hired_count: 12,
  },
  {
    id: "C015",
    name: "Fractal Analytics",
    tier: 2,
    avg_package: 12.0,
    max_package: 18,
    departments_hiring: ["AI-ML", "CSE"],
    open_positions: 10,
    industry: "Analytics",
    hired_count: 8,
  },
  {
    id: "C016",
    name: "Capgemini",
    tier: 2,
    avg_package: 7.0,
    max_package: 10,
    departments_hiring: ["IT", "CSE"],
    open_positions: 20,
    industry: "IT Services",
    hired_count: 16,
  },
  {
    id: "C017",
    name: "Tech Mahindra",
    tier: 2,
    avg_package: 6.5,
    max_package: 9.5,
    departments_hiring: ["IT", "CSE", "ECE"],
    open_positions: 18,
    industry: "IT Services",
    hired_count: 14,
  },
  {
    id: "C018",
    name: "ISRO",
    tier: 1,
    avg_package: 10.0,
    max_package: 14,
    departments_hiring: ["ME", "ECE"],
    open_positions: 4,
    industry: "Aerospace",
    hired_count: 4,
  },
  {
    id: "C019",
    name: "Bosch",
    tier: 2,
    avg_package: 9.5,
    max_package: 15,
    departments_hiring: ["ME", "ECE"],
    open_positions: 12,
    industry: "Automotive",
    hired_count: 9,
  },
  {
    id: "C020",
    name: "Mu Sigma",
    tier: 3,
    avg_package: 5.5,
    max_package: 8,
    departments_hiring: ["AI-ML", "CSE", "IT"],
    open_positions: 15,
    industry: "Analytics",
    hired_count: 11,
  },
];

// ─── Applications ─────────────────────────────────────────────────────────────

const APPLICATION_STATUSES: Application["status"][] = [
  "applied",
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
  "rejected",
];
const ROLES = [
  "Software Engineer",
  "Data Engineer",
  "ML Engineer",
  "Systems Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Product Analyst",
  "Site Reliability Engineer",
  "Research Analyst",
  "QA Engineer",
];

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return d.toISOString().split("T")[0];
}

export const mockApplications: Application[] = Array.from(
  { length: 220 },
  (_, i) => {
    const student = mockStudents[i % mockStudents.length];
    const company = mockCompanies[i % mockCompanies.length];
    const statusWeights = [0.2, 0.18, 0.15, 0.1, 0.22, 0.15];
    const r = Math.random();
    let cumulative = 0;
    let status: Application["status"] = "applied";
    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j];
      if (r < cumulative) {
        status = APPLICATION_STATUSES[j];
        break;
      }
    }
    return {
      id: `APP${String(i + 1).padStart(4, "0")}`,
      student_id: student.id,
      company_id: company.id,
      status,
      date: randomDate(rand(1, 180)),
      role: pick(ROLES),
      package_offered:
        status === "offered" || status === "hired"
          ? rand(50, 350) / 10
          : undefined,
    };
  },
);

// ─── Demo student specific applications ───────────────────────────────────────
const demoApplicationsBase: Application[] = [
  {
    id: "APP_D001",
    student_id: "DEMO001",
    company_id: "C001",
    status: "hired",
    date: randomDate(45),
    role: "Software Engineer",
    package_offered: 28.5,
  },
  {
    id: "APP_D002",
    student_id: "DEMO001",
    company_id: "C002",
    status: "offered",
    date: randomDate(60),
    role: "Full Stack Developer",
    package_offered: 22.0,
  },
  {
    id: "APP_D003",
    student_id: "DEMO001",
    company_id: "C005",
    status: "interviewing",
    date: randomDate(20),
    role: "ML Engineer",
    interview_date: randomDate(-7),
  },
  {
    id: "APP_D004",
    student_id: "DEMO001",
    company_id: "C003",
    status: "shortlisted",
    date: randomDate(15),
    role: "Software Engineer",
  },
  {
    id: "APP_D005",
    student_id: "DEMO001",
    company_id: "C006",
    status: "rejected",
    date: randomDate(90),
    role: "Software Engineer",
  },
  // DEMO002
  {
    id: "APP_D006",
    student_id: "DEMO002",
    company_id: "C002",
    status: "hired",
    date: randomDate(30),
    role: "ML Engineer",
    package_offered: 22.0,
  },
  {
    id: "APP_D007",
    student_id: "DEMO002",
    company_id: "C005",
    status: "offered",
    date: randomDate(40),
    role: "Research Analyst",
    package_offered: 35.0,
  },
  {
    id: "APP_D008",
    student_id: "DEMO002",
    company_id: "C015",
    status: "shortlisted",
    date: randomDate(10),
    role: "Data Engineer",
  },
  {
    id: "APP_D009",
    student_id: "DEMO002",
    company_id: "C001",
    status: "interviewing",
    date: randomDate(5),
    role: "ML Engineer",
    interview_date: randomDate(-3),
  },
  // DEMO003
  {
    id: "APP_D010",
    student_id: "DEMO003",
    company_id: "C008",
    status: "applied",
    date: randomDate(7),
    role: "Full Stack Developer",
  },
  {
    id: "APP_D011",
    student_id: "DEMO003",
    company_id: "C009",
    status: "shortlisted",
    date: randomDate(14),
    role: "Systems Engineer",
  },
  {
    id: "APP_D012",
    student_id: "DEMO003",
    company_id: "C010",
    status: "interviewing",
    date: randomDate(21),
    role: "DevOps Engineer",
    interview_date: randomDate(-5),
  },
  {
    id: "APP_D013",
    student_id: "DEMO003",
    company_id: "C007",
    status: "rejected",
    date: randomDate(50),
    role: "Software Engineer",
  },
];

// Merge demo applications at the front so they're always present
export const mockApplicationsAll: Application[] = [
  ...demoApplicationsBase,
  ...mockApplications,
];

// ─── Interview Sessions ────────────────────────────────────────────────────────

const INTERVIEW_FEEDBACK = [
  "Strong problem-solving skills, needs improvement in system design.",
  "Excellent communication, coding could be faster.",
  "Good domain knowledge, work on behavioral questions.",
  "Impressive portfolio, strengthen DSA fundamentals.",
  "Team player, needs to articulate technical decisions better.",
];

export const mockInterviewSessions: InterviewSession[] = [
  // DEMO001
  {
    id: "INT_D001",
    student_id: "DEMO001",
    company: "Google",
    role: "Software Engineer",
    date: randomDate(44),
    type: "technical",
    score: 88,
    duration_minutes: 60,
    questions_answered: 4,
    questions_total: 4,
    feedback: "Excellent DSA solutions. Impress with system design approach.",
    status: "completed",
    round: 2,
  },
  {
    id: "INT_D002",
    student_id: "DEMO001",
    company: "Google",
    role: "Software Engineer",
    date: randomDate(46),
    type: "hr",
    score: 92,
    duration_minutes: 45,
    questions_answered: 8,
    questions_total: 8,
    feedback: "Strong cultural fit. Articulates goals clearly.",
    status: "completed",
    round: 3,
  },
  {
    id: "INT_D003",
    student_id: "DEMO001",
    company: "OpenAI",
    role: "ML Engineer",
    date: randomDate(-7),
    type: "technical",
    score: 0,
    duration_minutes: 90,
    questions_answered: 0,
    questions_total: 5,
    feedback: undefined,
    status: "scheduled",
    round: 1,
  },
  // DEMO002
  {
    id: "INT_D004",
    student_id: "DEMO002",
    company: "Microsoft",
    role: "ML Engineer",
    date: randomDate(29),
    type: "technical",
    score: 91,
    duration_minutes: 75,
    questions_answered: 5,
    questions_total: 5,
    feedback: "Outstanding ML knowledge. Would be a strong hire.",
    status: "completed",
    round: 2,
  },
  {
    id: "INT_D005",
    student_id: "DEMO002",
    company: "Google",
    role: "ML Engineer",
    date: randomDate(-3),
    type: "technical",
    score: 0,
    duration_minutes: 60,
    questions_answered: 0,
    questions_total: 4,
    feedback: undefined,
    status: "scheduled",
    round: 1,
  },
  // DEMO003
  {
    id: "INT_D006",
    student_id: "DEMO003",
    company: "HCL Technologies",
    role: "DevOps Engineer",
    date: randomDate(-5),
    type: "technical",
    score: 0,
    duration_minutes: 60,
    questions_answered: 0,
    questions_total: 4,
    feedback: undefined,
    status: "scheduled",
    round: 1,
  },
  {
    id: "INT_D007",
    student_id: "DEMO003",
    company: "Wipro",
    role: "Full Stack Developer",
    date: randomDate(20),
    type: "aptitude",
    score: 74,
    duration_minutes: 30,
    questions_answered: 20,
    questions_total: 25,
    feedback: "Good aptitude score. Work on speed.",
    status: "completed",
    round: 1,
  },
  // generic sessions for other students
  ...Array.from({ length: 30 }, (_, i) => {
    const student = mockStudents[i + 3];
    return {
      id: `INT_G${String(i + 1).padStart(3, "0")}`,
      student_id: student.id,
      company: pick(mockCompanies).name,
      role: pick(ROLES),
      date: randomDate(rand(1, 60)),
      type: pick([
        "technical",
        "hr",
        "aptitude",
        "mock",
      ] as InterviewSession["type"][]),
      score: rand(50, 95),
      duration_minutes: rand(30, 90),
      questions_answered: rand(3, 8),
      questions_total: rand(4, 10),
      feedback: pick(INTERVIEW_FEEDBACK),
      status: "completed" as InterviewSession["status"],
      round: rand(1, 3),
    };
  }),
];

// ─── Job Postings ─────────────────────────────────────────────────────────────

export const mockJobPostings: JobPosting[] = mockCompanies
  .slice(0, 15)
  .flatMap((c, i) => {
    const dept = c.departments_hiring[0];
    const skills = SKILLS_BY_DEPT[dept].slice(0, 3);
    return [
      {
        id: `JP${String(i * 2 + 1).padStart(3, "0")}`,
        company_id: c.id,
        title: pick(ROLES),
        skills_required: skills,
        eligible_branches: c.departments_hiring,
        positions: c.open_positions,
        min_cgpa: 6.5 + Math.random() * 1.5,
        package_range: `${(c.avg_package - 2).toFixed(0)}-${(c.avg_package + 2).toFixed(0)} LPA`,
        deadline: randomDate(-rand(10, 60)),
      },
      {
        id: `JP${String(i * 2 + 2).padStart(3, "0")}`,
        company_id: c.id,
        title: pick(ROLES),
        skills_required: skills.slice(0, 2),
        eligible_branches: c.departments_hiring.slice(0, 1),
        positions: Math.ceil(c.open_positions / 2),
        min_cgpa: 7.0,
        package_range: `${c.avg_package.toFixed(0)}-${(c.avg_package + 4).toFixed(0)} LPA`,
        deadline: randomDate(-rand(5, 30)),
      },
    ];
  });

// ─── Placement Drives ─────────────────────────────────────────────────────────

export const mockPlacementDrives: PlacementDrive[] = mockCompanies
  .slice(0, 15)
  .map((c, i) => ({
    id: `PD${String(i + 1).padStart(3, "0")}`,
    company_id: c.id,
    company_name: c.name,
    date: randomDate(i < 5 ? -rand(7, 30) : rand(1, 45)),
    department: c.departments_hiring,
    status: i < 8 ? "completed" : i < 10 ? "ongoing" : "upcoming",
    positions: c.open_positions,
    tier: c.tier as CompanyTier,
  }));

// ─── Upcoming Drives (student-facing) ─────────────────────────────────────────

export const mockUpcomingDrives: UpcomingDrive[] = [
  {
    id: "UD001",
    company_id: "C001",
    company_name: "Google",
    date: randomDate(-14),
    tier: 1,
    roles: ["Software Engineer", "Full Stack Developer"],
    min_cgpa: 7.5,
    package_range: "25-45 LPA",
    eligible_branches: ["CSE", "AI-ML"],
    positions: 8,
  },
  {
    id: "UD002",
    company_id: "C002",
    company_name: "Microsoft",
    date: randomDate(-21),
    tier: 1,
    roles: ["ML Engineer", "Data Engineer"],
    min_cgpa: 7.0,
    package_range: "20-38 LPA",
    eligible_branches: ["CSE", "IT", "AI-ML"],
    positions: 10,
  },
  {
    id: "UD003",
    company_id: "C005",
    company_name: "OpenAI",
    date: randomDate(-28),
    tier: 1,
    roles: ["Research Analyst", "ML Engineer"],
    min_cgpa: 8.0,
    package_range: "30-60 LPA",
    eligible_branches: ["AI-ML", "CSE"],
    positions: 4,
  },
  {
    id: "UD004",
    company_id: "C015",
    company_name: "Fractal Analytics",
    date: randomDate(-10),
    tier: 2,
    roles: ["Data Analyst", "Product Analyst"],
    min_cgpa: 6.5,
    package_range: "10-18 LPA",
    eligible_branches: ["AI-ML", "CSE", "IT"],
    positions: 10,
  },
  {
    id: "UD005",
    company_id: "C003",
    company_name: "Amazon",
    date: randomDate(-35),
    tier: 1,
    roles: ["Software Development Engineer", "Site Reliability Engineer"],
    min_cgpa: 7.0,
    package_range: "18-32 LPA",
    eligible_branches: ["CSE", "IT"],
    positions: 12,
  },
  {
    id: "UD006",
    company_id: "C006",
    company_name: "Infosys",
    date: randomDate(-7),
    tier: 2,
    roles: ["Systems Engineer", "Associate"],
    min_cgpa: 6.0,
    package_range: "6-12 LPA",
    eligible_branches: ["CSE", "IT", "ECE", "AI-ML"],
    positions: 30,
  },
];

// ─── Referrals ────────────────────────────────────────────────────────────────

const REFERRERS = [
  "Prof. Anand Kumar",
  "Dr. Meera Singh",
  "Alumni: Rahul Sharma",
  "Alumni: Priya Patel",
  "Prof. Suresh Rao",
  "Dr. Lakshmi Iyer",
  "Alumni: Vikram Gupta",
];

export const mockReferrals: Referral[] = Array.from({ length: 50 }, (_, i) => {
  const student = mockStudents[i % mockStudents.length];
  return {
    id: `REF${String(i + 1).padStart(3, "0")}`,
    student_id: student.id,
    student_name: student.name,
    referrer: pick(REFERRERS),
    company: pick(mockCompanies).name,
    date: randomDate(rand(1, 90)),
    status: pick(["pending", "accepted", "rejected"] as Referral["status"][]),
  };
});

// ─── Monthly Trend ────────────────────────────────────────────────────────────

const MONTH_LABELS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

export const monthlyTrendData: MonthlyTrend[] = MONTH_LABELS.map(
  (month, i) => ({
    month,
    applications:
      15 + Math.floor(Math.sin(i * 0.6) * 8 + Math.random() * 12 + i * 2),
    placements:
      4 + Math.floor(Math.sin(i * 0.6) * 4 + Math.random() * 6 + i * 0.8),
    shortlisted:
      8 + Math.floor(Math.sin(i * 0.6) * 5 + Math.random() * 8 + i * 1.2),
  }),
);

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getPlacementRate(dept?: string): number {
  const students = dept
    ? mockStudents.filter((s) => s.department === dept)
    : mockStudents;
  if (!students.length) return 0;
  return Number.parseFloat(
    (
      (students.filter((s) => s.placement_status === "placed").length /
        students.length) *
      100
    ).toFixed(1),
  );
}

export function getDeptStats(): DeptStats[] {
  return DEPARTMENTS.map((dept) => {
    const students = mockStudents.filter((s) => s.department === dept);
    const placed = students.filter((s) => s.placement_status === "placed");
    const unplaced = students.filter((s) => s.placement_status === "unplaced");
    const inProgress = students.filter(
      (s) => s.placement_status === "in-progress",
    );
    const rate = students.length ? (placed.length / students.length) * 100 : 0;
    const avgCGPA = students.length
      ? students.reduce((a, s) => a + s.cgpa, 0) / students.length
      : 0;
    const avgAptitude = students.length
      ? students.reduce((a, s) => a + s.aptitude_score, 0) / students.length
      : 0;
    const avgProg = students.length
      ? students.reduce((a, s) => a + s.programming_score, 0) / students.length
      : 0;

    const companyCounts: Record<string, number> = {};
    for (const s of placed) {
      if (s.placed_at)
        companyCounts[s.placed_at] = (companyCounts[s.placed_at] ?? 0) + 1;
    }
    const topCompany =
      Object.entries(companyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    const skillCounts: Record<string, number> = {};
    for (const s of placed) {
      for (const sk of s.skills) {
        skillCounts[sk] = (skillCounts[sk] ?? 0) + 1;
      }
    }
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((e) => e[0]);

    return {
      department: dept,
      school: DEPT_SCHOOL[dept],
      total: students.length,
      placed: placed.length,
      unplaced: unplaced.length,
      in_progress: inProgress.length,
      placement_rate: Number.parseFloat(rate.toFixed(1)),
      avg_cgpa: Number.parseFloat(avgCGPA.toFixed(2)),
      avg_aptitude: Number.parseFloat(avgAptitude.toFixed(1)),
      avg_programming: Number.parseFloat(avgProg.toFixed(1)),
      failure_rate: Number.parseFloat((100 - rate).toFixed(1)),
      top_company: topCompany,
      top_skills: topSkills,
    };
  });
}

export function getBatchStats(): BatchStats[] {
  return BATCHES.map((batch) => {
    const students = mockStudents.filter((s) => s.batch === batch);
    const placed = students.filter((s) => s.placement_status === "placed");
    const unplaced = students.filter((s) => s.placement_status === "unplaced");
    const inProgress = students.filter(
      (s) => s.placement_status === "in-progress",
    );

    const byDept: BatchStats["by_department"] = {};
    for (const dept of DEPARTMENTS) {
      const dStudents = students.filter((s) => s.department === dept);
      if (dStudents.length) {
        byDept[dept] = {
          placed: dStudents.filter((s) => s.placement_status === "placed")
            .length,
          total: dStudents.length,
        };
      }
    }

    const packages = placed
      .filter((s) => s.package_lpa)
      .map((s) => s.package_lpa!);
    const avgPkg = packages.length
      ? packages.reduce((a, b) => a + b, 0) / packages.length
      : 0;

    return {
      batch,
      total: students.length,
      placed: placed.length,
      unplaced: unplaced.length,
      in_progress: inProgress.length,
      placement_rate: students.length
        ? Number.parseFloat(
            ((placed.length / students.length) * 100).toFixed(1),
          )
        : 0,
      avg_package: Number.parseFloat(avgPkg.toFixed(1)),
      by_department: byDept,
    };
  });
}

export function getTopCompanies(n = 10) {
  return mockCompanies
    .sort((a, b) => b.hired_count - a.hired_count)
    .slice(0, n)
    .map((c) => ({
      name: c.name,
      tier: c.tier,
      hired: c.hired_count,
      avg_package: c.avg_package,
      departments: c.departments_hiring,
    }));
}

export function getSkillGapData(): SkillGap[] {
  const demandCounts: Record<string, number> = {};
  for (const jp of mockJobPostings) {
    for (const sk of jp.skills_required) {
      demandCounts[sk] = (demandCounts[sk] ?? 0) + jp.positions;
    }
  }

  const supplyCounts: Record<string, number> = {};
  for (const s of mockStudents) {
    for (const sk of s.skills) {
      supplyCounts[sk] = (supplyCounts[sk] ?? 0) + 1;
    }
  }

  const allSkills = new Set([
    ...Object.keys(demandCounts),
    ...Object.keys(supplyCounts),
  ]);
  return Array.from(allSkills)
    .map((skill) => ({
      skill,
      demand: demandCounts[skill] ?? 0,
      supply: supplyCounts[skill] ?? 0,
      gap: (demandCounts[skill] ?? 0) - (supplyCounts[skill] ?? 0),
    }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 12);
}

const ACTIVITY_TEMPLATES = [
  (s: Student, c: string) => `${s.name} applied to ${c}`,
  (s: Student, c: string) => `${s.name} received offer from ${c}`,
  (s: Student, c: string) => `${s.name} shortlisted at ${c}`,
  (s: Student, c: string) => `${s.name} hired by ${c}`,
  (s: Student, c: string) => `Referral: ${s.name} → ${c}`,
];
const ACTIVITY_TYPES: ActivityItem["type"][] = [
  "application",
  "offer",
  "application",
  "hire",
  "referral",
];

export function getActivityFeed(limit = 20): ActivityItem[] {
  return Array.from({ length: limit }, (_, i) => {
    const student = mockStudents[i % mockStudents.length];
    const company = mockCompanies[i % mockCompanies.length];
    const typeIdx = i % ACTIVITY_TEMPLATES.length;
    const minutesAgo = i * rand(3, 15);
    const time = new Date(Date.now() - minutesAgo * 60000);

    return {
      id: `ACT${i + 1}`,
      type: ACTIVITY_TYPES[typeIdx],
      message: ACTIVITY_TEMPLATES[typeIdx](student, company.name),
      student: student.name,
      company: company.name,
      timestamp: time.toISOString(),
      badge: student.department,
    };
  });
}

export function getPipelineFunnel(): PipelineStage[] {
  const stages: Application["status"][] = [
    "applied",
    "shortlisted",
    "interviewing",
    "offered",
    "hired",
    "rejected",
  ];
  const labels: Record<Application["status"], string> = {
    applied: "Applied",
    shortlisted: "Shortlisted",
    interviewing: "Interviewing",
    offered: "Offered",
    hired: "Hired",
    rejected: "Rejected",
  };

  const counts = stages.reduce(
    (acc, s) => {
      acc[s] = mockApplications.filter((a) => a.status === s).length;
      return acc;
    },
    {} as Record<Application["status"], number>,
  );

  const total = counts.applied;
  let prevCount = total;

  return stages.map((stage) => {
    const count = counts[stage];
    const conversion =
      prevCount > 0 && stage !== "applied"
        ? Number.parseFloat(((count / prevCount) * 100).toFixed(1))
        : 100;
    prevCount = stage !== "rejected" ? count : prevCount;
    return {
      stage,
      label: labels[stage],
      count,
      percent:
        total > 0 ? Number.parseFloat(((count / total) * 100).toFixed(1)) : 0,
      conversion,
    };
  });
}

export function getPackageDistribution(): PackageDistribution[] {
  const ranges = [
    { range: "3-5 LPA", min: 3, max: 5 },
    { range: "5-8 LPA", min: 5, max: 8 },
    { range: "8-12 LPA", min: 8, max: 12 },
    { range: "12-20 LPA", min: 12, max: 20 },
    { range: "20+ LPA", min: 20, max: 999 },
  ];
  const packages = mockStudents
    .filter((s) => s.package_lpa)
    .map((s) => s.package_lpa!);
  return ranges.map((r) => ({
    ...r,
    count: packages.filter((p) => p >= r.min && p < r.max).length,
  }));
}

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export const MOCK_ADMIN_USERS = [
  {
    id: "ADMIN001",
    email: "admin@nexus.edu",
    name: "Dr. Placement Admin",
    role: "admin" as const,
  },
  {
    id: "ADMIN002",
    email: "placement@nexus.edu",
    name: "Prof. Anand Kumar",
    role: "admin" as const,
  },
  {
    id: "ADMIN003",
    email: "coordinator@nexus.edu",
    name: "Dr. Meera Singh",
    role: "admin" as const,
  },
];

export function getStudentByRollNumber(
  rollNumber: string,
): Student | undefined {
  return mockStudents.find(
    (s) =>
      s.roll_number?.toLowerCase() === rollNumber.toLowerCase() ||
      s.id.toLowerCase() === rollNumber.toLowerCase(),
  );
}

export function updateStudentStatus(
  id: string,
  status: Student["placement_status"],
  packageLPA?: number,
): void {
  const idx = mockStudents.findIndex((s) => s.id === id);
  if (idx === -1) return;
  mockStudents[idx] = {
    ...mockStudents[idx],
    placement_status: status,
    package_lpa: packageLPA ?? mockStudents[idx].package_lpa,
  };
}

export function getCGPAPlacementData() {
  const ranges = [
    { range: "<6", min: 0, max: 6 },
    { range: "6-7", min: 6, max: 7 },
    { range: "7-8", min: 7, max: 8 },
    { range: "8-9", min: 8, max: 9 },
    { range: "9+", min: 9, max: 10 },
  ];
  return ranges.map((r) => {
    const students = mockStudents.filter(
      (s) => s.cgpa >= r.min && s.cgpa < r.max,
    );
    const placed = students.filter((s) => s.placement_status === "placed");
    return {
      range: r.range,
      total: students.length,
      placed: placed.length,
      rate: students.length
        ? Number.parseFloat(
            ((placed.length / students.length) * 100).toFixed(1),
          )
        : 0,
    };
  });
}

export function getAtRiskStudents(limit = 15) {
  return mockStudents
    .filter((s) => s.placement_status !== "placed")
    .map((s) => ({
      ...s,
      risk_score:
        100 -
        (s.cgpa * 5 + s.aptitude_score * 0.25 + s.programming_score * 0.25),
    }))
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, limit);
}

export function getSectionStats(department: Department) {
  return SECTIONS.map((section) => {
    const students = mockStudents.filter(
      (s) => s.department === department && s.section === section,
    );
    const placed = students.filter((s) => s.placement_status === "placed");
    return {
      section,
      total: students.length,
      placed: placed.length,
      placement_rate: students.length
        ? Number.parseFloat(
            ((placed.length / students.length) * 100).toFixed(1),
          )
        : 0,
      avg_cgpa: students.length
        ? Number.parseFloat(
            (
              students.reduce((a, s) => a + s.cgpa, 0) / students.length
            ).toFixed(2),
          )
        : 0,
      students,
    };
  });
}

// ─── Student-specific Helper Functions ────────────────────────────────────────

export function getStudentApplications(studentId: string): Application[] {
  return mockApplicationsAll.filter((a) => a.student_id === studentId);
}

export function getStudentInterviews(studentId: string): InterviewSession[] {
  return mockInterviewSessions.filter((i) => i.student_id === studentId);
}

export function getUpcomingDrives(dept?: Department): UpcomingDrive[] {
  if (!dept) return mockUpcomingDrives;
  return mockUpcomingDrives.filter((d) => d.eligible_branches.includes(dept));
}

export function getPeerBenchmark(studentId: string): PeerBenchmark {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) {
    return {
      student_cgpa: 0,
      dept_avg_cgpa: 0,
      dept_cgpa_percentile: 0,
      student_aptitude: 0,
      dept_avg_aptitude: 0,
      dept_aptitude_percentile: 0,
      student_programming: 0,
      dept_avg_programming: 0,
      dept_programming_percentile: 0,
      dept_placement_rate: 0,
      batch_size: 0,
    };
  }

  const peers = mockStudents.filter(
    (s) => s.department === student.department && s.id !== studentId,
  );

  const calcPercentile = (arr: number[], val: number) => {
    if (!arr.length) return 50;
    const below = arr.filter((v) => v < val).length;
    return Number.parseFloat(((below / arr.length) * 100).toFixed(1));
  };

  const cgpas = peers.map((p) => p.cgpa);
  const aptitudes = peers.map((p) => p.aptitude_score);
  const programmings = peers.map((p) => p.programming_score);

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const placedPeers = peers.filter((p) => p.placement_status === "placed");
  const packages = placedPeers
    .filter((p) => p.package_lpa)
    .map((p) => p.package_lpa!);

  return {
    student_cgpa: student.cgpa,
    dept_avg_cgpa: Number.parseFloat(avg(cgpas).toFixed(2)),
    dept_cgpa_percentile: calcPercentile(cgpas, student.cgpa),
    student_aptitude: student.aptitude_score,
    dept_avg_aptitude: Number.parseFloat(avg(aptitudes).toFixed(1)),
    dept_aptitude_percentile: calcPercentile(aptitudes, student.aptitude_score),
    student_programming: student.programming_score,
    dept_avg_programming: Number.parseFloat(avg(programmings).toFixed(1)),
    dept_programming_percentile: calcPercentile(
      programmings,
      student.programming_score,
    ),
    student_package: student.package_lpa,
    dept_avg_package: packages.length
      ? Number.parseFloat(avg(packages).toFixed(1))
      : undefined,
    dept_package_percentile:
      student.package_lpa && packages.length
        ? calcPercentile(packages, student.package_lpa)
        : undefined,
    dept_placement_rate: Number.parseFloat(
      ((placedPeers.length / (peers.length || 1)) * 100).toFixed(1),
    ),
    batch_size: peers.length + 1,
  };
}

export { DEPARTMENTS, SCHOOLS };
