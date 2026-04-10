import type { PlacementStatus } from "../types/placement";
import { mockStudents } from "./mockData";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type UserRole = "admin" | "student";

export interface AuthSession {
  role: UserRole;
  userId: string;
  name: string;
  email?: string;
  rollNumber?: string;
  department?: string;
}

interface AdminCredential {
  email: string;
  password: string;
  name: string;
  id: string;
}

// ─── Mock Credentials ──────────────────────────────────────────────────────────
export const mockAdminCredentials: AdminCredential[] = [
  {
    id: "ADMIN001",
    email: "admin@nexus.edu",
    password: "admin123",
    name: "Dr. Placement Admin",
  },
  {
    id: "ADMIN002",
    email: "placement@nexus.edu",
    password: "placement123",
    name: "Prof. Anand Kumar",
  },
  {
    id: "ADMIN003",
    email: "coordinator@nexus.edu",
    password: "coord2024",
    name: "Dr. Meera Singh",
  },
];

// ─── Auth Functions ────────────────────────────────────────────────────────────
export function loginAsAdmin(
  email: string,
  password: string,
): AuthSession | null {
  const admin = mockAdminCredentials.find(
    (a) => a.email === email && a.password === password,
  );
  if (!admin) return null;
  return {
    role: "admin",
    userId: admin.id,
    name: admin.name,
    email: admin.email,
  };
}

export function loginAsStudent(
  rollNumber: string,
  password: string,
): AuthSession | null {
  if (password !== "student123") return null;
  const student = mockStudents.find(
    (s) =>
      s.roll_number?.toLowerCase() === rollNumber.toLowerCase() ||
      s.id.toLowerCase() === rollNumber.toLowerCase(),
  );
  if (!student) return null;
  return {
    role: "student",
    userId: student.id,
    name: student.name,
    email: student.email,
    rollNumber: student.roll_number,
    department: student.department,
  };
}

// ─── Session Helpers ───────────────────────────────────────────────────────────
const SESSION_KEY = "nexus_session";

export function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Re-export for updateStudentStatus compatibility ──────────────────────────
export type { PlacementStatus };
