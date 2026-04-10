import { useMemo } from "react";
import type {
  ApplicationStatus,
  Department,
  Student,
  StudentStats,
} from "../types/placement";
import { loadSession } from "./auth";
import {
  getPeerBenchmark,
  getStudentApplications,
  getStudentInterviews,
  getUpcomingDrives,
  mockCompanies,
  mockStudents,
} from "./mockData";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseStudentDataResult {
  student: Student | null;
  stats: StudentStats | null;
  isLoaded: boolean;
}

export function useStudentData(): UseStudentDataResult {
  // loadSession() reads from localStorage — call once, store result stable across renders
  const session = useMemo(() => loadSession(), []);

  const student = useMemo<Student | null>(() => {
    if (!session || session.role !== "student") return null;
    return (
      mockStudents.find(
        (s) =>
          s.id === session.userId ||
          s.roll_number?.toLowerCase() === session.rollNumber?.toLowerCase(),
      ) ?? null
    );
  }, [session]);

  const stats = useMemo<StudentStats | null>(() => {
    if (!student) return null;

    const applications = getStudentApplications(student.id);
    const interviews = getStudentInterviews(student.id);
    const upcomingDrives = getUpcomingDrives(student.department as Department);
    const peerBenchmark = getPeerBenchmark(student.id);

    // Applications by status
    const applicationsByStatus: Record<ApplicationStatus, number> = {
      applied: 0,
      shortlisted: 0,
      interviewing: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    };
    for (const app of applications) {
      applicationsByStatus[app.status] =
        (applicationsByStatus[app.status] ?? 0) + 1;
    }

    // Most applied company
    const companyCounts: Record<string, number> = {};
    for (const app of applications) {
      const company = mockCompanies.find((c) => c.id === app.company_id);
      if (company) {
        companyCounts[company.name] = (companyCounts[company.name] ?? 0) + 1;
      }
    }
    const topCompanyApplied = Object.entries(companyCounts).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];

    // Department avg package
    const deptPlaced = mockStudents.filter(
      (s) => s.department === student.department && s.package_lpa,
    );
    const avgPackageDept = deptPlaced.length
      ? Number.parseFloat(
          (
            deptPlaced.reduce((a, s) => a + (s.package_lpa ?? 0), 0) /
            deptPlaced.length
          ).toFixed(1),
        )
      : 0;

    // Upcoming interview count (scheduled in upcoming drives that student is eligible for)
    const upcomingInterviewCount =
      upcomingDrives.filter(
        (d) =>
          d.eligible_branches.includes(student.department as Department) &&
          d.min_cgpa <= student.cgpa,
      ).length + interviews.filter((i) => i.status === "scheduled").length;

    return {
      total_applications: applications.length,
      applications_by_status: applicationsByStatus,
      cgpa_percentile: peerBenchmark.dept_cgpa_percentile,
      upcoming_interview_count: upcomingInterviewCount,
      skill_count: student.skills.length,
      avg_package_dept: avgPackageDept,
      top_company_applied: topCompanyApplied,
      interview_sessions: interviews,
      peer_benchmark: peerBenchmark,
    };
  }, [student]);

  return {
    student,
    stats,
    isLoaded: true,
  };
}

// ─── Standalone helper (non-hook, for use outside components) ─────────────────

export function getStudentStats(studentId: string): StudentStats | null {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return null;

  const applications = getStudentApplications(student.id);
  const interviews = getStudentInterviews(student.id);
  const upcomingDrives = getUpcomingDrives(student.department as Department);
  const peerBenchmark = getPeerBenchmark(student.id);

  const applicationsByStatus: Record<ApplicationStatus, number> = {
    applied: 0,
    shortlisted: 0,
    interviewing: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
  };
  for (const app of applications) {
    applicationsByStatus[app.status] =
      (applicationsByStatus[app.status] ?? 0) + 1;
  }

  const companyCounts: Record<string, number> = {};
  for (const app of applications) {
    const company = mockCompanies.find((c) => c.id === app.company_id);
    if (company) {
      companyCounts[company.name] = (companyCounts[company.name] ?? 0) + 1;
    }
  }
  const topCompanyApplied = Object.entries(companyCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  const deptPlaced = mockStudents.filter(
    (s) => s.department === student.department && s.package_lpa,
  );
  const avgPackageDept = deptPlaced.length
    ? Number.parseFloat(
        (
          deptPlaced.reduce((a, s) => a + (s.package_lpa ?? 0), 0) /
          deptPlaced.length
        ).toFixed(1),
      )
    : 0;

  const upcomingInterviewCount =
    upcomingDrives.filter(
      (d) =>
        d.eligible_branches.includes(student.department as Department) &&
        d.min_cgpa <= student.cgpa,
    ).length + interviews.filter((i) => i.status === "scheduled").length;

  return {
    total_applications: applications.length,
    applications_by_status: applicationsByStatus,
    cgpa_percentile: peerBenchmark.dept_cgpa_percentile,
    upcoming_interview_count: upcomingInterviewCount,
    skill_count: student.skills.length,
    avg_package_dept: avgPackageDept,
    top_company_applied: topCompanyApplied,
    interview_sessions: interviews,
    peer_benchmark: peerBenchmark,
  };
}
