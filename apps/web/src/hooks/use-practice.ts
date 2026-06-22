import { useQuery } from "@tanstack/react-query";
import { dsaCategories } from "#/lib/dsa-db";
import { assessmentsDb, caseStudiesDb, interviewQADb } from "#/lib/practice-db";

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

export function useDSACategories() {
  return useQuery({
    queryKey: ["dsa", "categories"],
    queryFn: async () => dsaCategories,
    staleTime: 300_000,
  });
}

export function useDSACategory(topicId: string) {
  return useQuery({
    queryKey: ["dsa", "category", topicId],
    queryFn: async () => {
      const cat = dsaCategories.find((c) => c.id === topicId);
      if (!cat) throw new Error(`Category not found: ${topicId}`);
      return cat;
    },
    staleTime: 300_000,
  });
}

export function useInterviewQA() {
  return useQuery({
    queryKey: ["practice", "interview-qa"],
    queryFn: async () => Object.values(interviewQADb),
    staleTime: 300_000,
  });
}

export function useInterviewQACategory(type: string) {
  return useQuery({
    queryKey: ["practice", "interview-qa", type],
    queryFn: async () => {
      const cat = interviewQADb[type];
      if (!cat) throw new Error(`Interview Q&A category not found: ${type}`);
      return cat;
    },
    staleTime: 300_000,
  });
}

export function useCaseStudiesCategories() {
  return useQuery({
    queryKey: ["practice", "case-studies-categories"],
    queryFn: async () => Object.values(caseStudiesDb),
    staleTime: 300_000,
  });
}

export function useCaseStudiesCategory(type: string) {
  return useQuery({
    queryKey: ["practice", "case-studies-category", type],
    queryFn: async () => {
      const cat = caseStudiesDb[type];
      if (!cat) throw new Error(`Case Studies category not found: ${type}`);
      return cat;
    },
    staleTime: 300_000,
  });
}

export function useAssessmentsCategories() {
  return useQuery({
    queryKey: ["practice", "assessments-categories"],
    queryFn: async () => Object.values(assessmentsDb),
    staleTime: 300_000,
  });
}

export function useAssessmentsCategory(type: string) {
  return useQuery({
    queryKey: ["practice", "assessments-category", type],
    queryFn: async () => {
      const cat = assessmentsDb[type];
      if (!cat) throw new Error(`Assessments category not found: ${type}`);
      return cat;
    },
    staleTime: 300_000,
  });
}
