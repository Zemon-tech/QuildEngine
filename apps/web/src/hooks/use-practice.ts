import { useQuery } from "@tanstack/react-query";

export function useDSAProblems() {
  return useQuery({
    queryKey: ["practice", "dsa"],
    queryFn: async () => ({
      total: 284,
      solved: 97,
      categories: [
        { name: "Arrays", total: 48, solved: 31 },
        { name: "Strings", total: 36, solved: 24 },
        { name: "Linked List", total: 28, solved: 18 },
        { name: "Trees", total: 42, solved: 14 },
        { name: "Graphs", total: 38, solved: 7 },
        { name: "Dynamic Programming", total: 52, solved: 3 },
      ],
    }),
    staleTime: 60_000,
  });
}

export function useQuestions() {
  return useQuery({
    queryKey: ["practice", "qa"],
    queryFn: async () => ({
      total: 120,
      attempted: 44,
      categories: [
        { name: "Technical Interview", total: 60, attempted: 28 },
        { name: "Behavioral", total: 40, attempted: 12 },
        { name: "AI Generated", total: 20, attempted: 4 },
      ],
    }),
    staleTime: 60_000,
  });
}

export function useCaseStudies() {
  return useQuery({
    queryKey: ["practice", "case-studies"],
    queryFn: async () => ({
      total: 36,
      completed: 8,
    }),
    staleTime: 300_000,
  });
}

export function useTests() {
  return useQuery({
    queryKey: ["practice", "tests"],
    queryFn: async () => ({
      mockTests: 12,
      assessments: 5,
      weeklyChallenge: {
        active: true,
        title: "Week 25 Challenge — Graph Traversal",
        endsIn: "3d 14h",
      },
    }),
    staleTime: 300_000,
  });
}
