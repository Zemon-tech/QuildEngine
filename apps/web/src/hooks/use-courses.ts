import { useQuery } from "@tanstack/react-query";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => [
      {
        id: "dsa-fundamentals",
        title: "DSA Fundamentals",
        progress: 64,
        totalLessons: 48,
        completedLessons: 31,
      },
      {
        id: "system-design",
        title: "System Design",
        progress: 22,
        totalLessons: 36,
        completedLessons: 8,
      },
      {
        id: "react-advanced",
        title: "React Advanced Patterns",
        progress: 89,
        totalLessons: 24,
        completedLessons: 21,
      },
    ],
    staleTime: 300_000,
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: async () => ({
      id: courseId,
      title: "DSA Fundamentals",
      description: "Master data structures and algorithms from first principles.",
      modules: [
        { id: "arrays-strings", title: "Arrays & Strings", lessons: 8 },
        { id: "linked-lists", title: "Linked Lists", lessons: 6 },
        { id: "trees-graphs", title: "Trees & Graphs", lessons: 10 },
      ],
    }),
    staleTime: 300_000,
    enabled: !!courseId,
  });
}
