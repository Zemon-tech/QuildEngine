import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => ({
      coursesEnrolled: 4,
      lessonsCompleted: 47,
      hoursLearned: 23,
      streakDays: 7,
    }),
    staleTime: 60_000,
  });
}

export function useLearningProgress() {
  return useQuery({
    queryKey: ["dashboard", "progress"],
    queryFn: async () => ({
      currentCourse: "Data Structures & Algorithms",
      currentLesson: "Binary Trees — Traversal",
      progressPercent: 64,
      nextMilestone: "Complete Module 5",
    }),
    staleTime: 60_000,
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["dashboard", "events"],
    queryFn: async () => [
      {
        id: "1",
        title: "System Design Webinar",
        date: "2026-06-25",
        type: "webinar",
      },
      {
        id: "2",
        title: "Frontend Hackathon",
        date: "2026-07-01",
        type: "hackathon",
      },
    ],
    staleTime: 300_000,
  });
}
