import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ==========================================
// Interfaces & Types
// ==========================================

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  isHidden: boolean;
}

export interface ProblemSolution {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  isOptimized: boolean;
}

export interface DsaProblem {
  id: string;
  title: string;
  slug: string;
  statement: string;
  description: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  notes: string;
  hints: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  topics: string[];
  tags: string[];
  timeComplexity: string;
  spaceComplexity: string;
  testCases: TestCase[];
  solutions: ProblemSolution[];
  templates: Record<string, string>; // language -> code template
  status: "published" | "draft" | "archived";
  solvesCount: number;
  acceptanceRate: number;
  discussionCount: number;
  isDiscussionLocked?: boolean;
}

export interface QaAnswer {
  id: string;
  content: string;
  author: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface QaQuestion {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  isLocked: boolean;
  isPinned: boolean;
  createdAt: string;
  answers: QaAnswer[];
}

export interface CaseStudyVersion {
  version: number;
  date: string;
  author: string;
  changes: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: "Technical" | "Startup" | "Product" | "Industry";
  overview: string;
  problemStatement: string;
  analysis: string;
  solutions: string;
  outcomes: string;
  resources: string[];
  tags: string[];
  status: "published" | "draft";
  versionHistory: CaseStudyVersion[];
}

export interface TestAttempt {
  id: string;
  user: string;
  scorePercent: number;
  timeTakenMinutes: number;
  date: string;
  status: "passed" | "failed";
}

export interface TestAssessment {
  id: string;
  title: string;
  type: "Technical" | "Aptitude" | "Mock Interview" | "Assessment";
  timeLimit: number; // minutes
  passingCriteria: number; // percent
  difficultyDistribution: { easy: number; medium: number; hard: number };
  isRandomized: boolean;
  proctoringEnabled: boolean;
  attemptsCount: number;
  averageScorePercent: number;
  passRatePercent: number;
  completedTimeAvg: number; // minutes
  questionPoolSize: number;
  status: "published" | "draft";
  recentAttempts?: TestAttempt[];
}

export interface CodingContest {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  registrationCount: number;
  rules: string;
  penalties: string;
  problems: string[]; // Problem titles/ids
  winners: string[];
  status: "upcoming" | "active" | "completed";
}

export interface PracticeDatabase {
  problems: DsaProblem[];
  questions: QaQuestion[];
  caseStudies: CaseStudy[];
  tests: TestAssessment[];
  contests: CodingContest[];
}

// ==========================================
// Initial Seed Data
// ==========================================

const INITIAL_DB: PracticeDatabase = {
  problems: [
    {
      id: "prob-1",
      title: "Two Sum",
      slug: "two-sum",
      statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      description: "You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
      constraints: "- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9",
      inputFormat: "An integer array nums and a target integer.",
      outputFormat: "Indices of the two numbers that sum to target.",
      sampleInput: "nums = [2,7,11,15], target = 9",
      sampleOutput: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      notes: "A hash map provides an O(n) solution instead of the O(n^2) brute force search.",
      hints: ["Try using a hash map to look up targets in O(1) time.", "Iterate once: check if (target - num) exists in map."],
      difficulty: "Easy",
      topics: ["Arrays", "Hash Table", "Two Pointer"],
      tags: ["Amazon", "Google", "Standard"],
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      testCases: [
        { id: "tc-1", input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isSample: true, isHidden: false },
        { id: "tc-2", input: "[3,2,4]\n6", expectedOutput: "[1,2]", isSample: true, isHidden: false },
        { id: "tc-3", input: "[3,3]\n6", expectedOutput: "[0,1]", isSample: false, isHidden: true },
      ],
      solutions: [
        {
          id: "sol-1",
          title: "One-pass Hash Map",
          description: "We use a hash map to keep track of elements and their indices as we iterate.",
          code: "function twoSum(nums: number[], target: number[]): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
          language: "TypeScript",
          isOptimized: true,
        },
      ],
      templates: {
        "TypeScript": "function twoSum(nums: number[], target: number): number[] {\n    // Write your code here\n};",
        "Python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
        "C++": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
      },
      status: "published",
      solvesCount: 14820,
      acceptanceRate: 48.6,
      discussionCount: 12,
    },
    {
      id: "prob-2",
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      statement: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      description: "An input string is valid if open brackets are closed by the same type of brackets, and closed in the correct order.",
      constraints: "1 <= s.length <= 10^4\ns consists of parentheses only.",
      inputFormat: "A single string containing brackets.",
      outputFormat: "boolean (true if valid, false otherwise)",
      sampleInput: "s = \"()[]{}\"",
      sampleOutput: "true",
      explanation: "Each opening bracket is closed immediately in correct matching order.",
      notes: "Using a stack is the optimal way to match brackets.",
      hints: ["Use a stack to keep track of opening brackets.", "When a closing bracket is found, pop and check if it matches."],
      difficulty: "Easy",
      topics: ["Stack", "Strings"],
      tags: ["Microsoft", "Facebook"],
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      testCases: [
        { id: "tc-4", input: "\"()\"", expectedOutput: "true", isSample: true, isHidden: false },
        { id: "tc-5", input: "\"(]\"", expectedOutput: "false", isSample: true, isHidden: false },
      ],
      solutions: [],
      templates: {
        "TypeScript": "function isValid(s: string): boolean {\n    \n};",
      },
      status: "published",
      solvesCount: 9480,
      acceptanceRate: 40.2,
      discussionCount: 3,
    },
    {
      id: "prob-3",
      title: "Merge K Sorted Lists",
      slug: "merge-k-sorted-lists",
      statement: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      description: "Convert list array nodes into a single consolidated, sorted output list.",
      constraints: "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500",
      inputFormat: "An array of linked list head pointers.",
      outputFormat: "Merged sorted list head.",
      sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]",
      sampleOutput: "[1,1,2,3,4,4,5,6]",
      explanation: "Merged and sorted into 1->1->2->3->4->4->5->6.",
      notes: "Min heap is optimal to poll elements dynamically in O(N log k) time.",
      hints: ["Divide and conquer or a priority queue/min-heap can be used.", "Compare heads of lists and push into a min heap."],
      difficulty: "Hard",
      topics: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
      tags: ["Google", "Uber", "Apple"],
      timeComplexity: "O(N log K)",
      spaceComplexity: "O(K)",
      testCases: [],
      solutions: [],
      templates: {},
      status: "draft",
      solvesCount: 1204,
      acceptanceRate: 31.8,
      discussionCount: 0,
    },
  ],
  questions: [
    {
      id: "qa-1",
      title: "Why does closures cause memory leaks in JavaScript?",
      slug: "js-closures-memory-leaks",
      content: "I understand closures hold references to parent scopes. But under what conditions do modern engines fail to garbage collect them?",
      category: "technical",
      author: "sarah_94",
      status: "approved",
      votes: 42,
      isLocked: false,
      isPinned: false,
      createdAt: "3 days ago",
      answers: [
        {
          id: "ans-1",
          content: "In modern engines like V8, memory leaks usually happen when closures are attached to long-lived objects (like event listeners or globals) that reference large variables in their parent lexical environments. If the listener is never removed, the entire lexical environment is retained.",
          author: "lexical_master",
          votes: 18,
          isAccepted: true,
          createdAt: "2 days ago",
        },
      ],
    },
    {
      id: "qa-2",
      title: "How to safely prevent CORS errors on a serverless backend?",
      slug: "cors-errors-serverless",
      content: "I keep getting preflight CORS issues when invoking AWS Lambda endpoints. How should headers be mapped in API Gateway?",
      category: "technical",
      author: "backend_dev",
      status: "pending",
      votes: 12,
      isLocked: false,
      isPinned: false,
      createdAt: "12h ago",
      answers: [],
    },
    {
      id: "qa-3",
      title: "Is it okay to use Tailwind for an enterprise library?",
      slug: "tailwind-enterprise-library",
      content: "We are designing a shared components library. Will Tailwind classes conflict with client applications?",
      category: "product",
      author: "ui_architect",
      status: "approved",
      votes: 8,
      isLocked: true,
      isPinned: true,
      createdAt: "1 week ago",
      answers: [],
    },
  ],
  caseStudies: [
    {
      id: "cs-1",
      title: "E-Commerce Cart Optimization",
      category: "Product",
      overview: "An analysis of friction in checkout funnels for a high-traffic retail app.",
      problemStatement: "The mobile app experienced a 48% checkout drop-off at the payment methods step.",
      analysis: "User session audits showed confusion around saved cards and heavy latency fetching validation keys.",
      solutions: "Implemented progressive profiling, single-click saved options, and DNS pre-caching for gateways.",
      outcomes: "Conversion rates increased by 14.2%, and checkout load times dropped by 340ms.",
      resources: ["Checkout friction PDF", "Heatmap analysis sheets"],
      tags: ["Ecommerce", "UX Research", "Conversion Optimization"],
      status: "published",
      versionHistory: [
        { version: 1, date: "2026-05-10", author: "Sarah Jane", changes: "Initial publication" },
      ],
    },
    {
      id: "cs-2",
      title: "WhatsApp Scale Chat Service",
      category: "Technical",
      overview: "Architecting a web-socket based concurrent messaging topology for 10M active connections.",
      problemStatement: "High connection churn rates and state sync delays on mobile nodes during network transitions.",
      analysis: "Connection multiplexing limits on API gateways and thread allocation blocks under Node.js.",
      solutions: "Switched to Erlang/Elixir nodes running on distributed actor nodes with Redis Pub/Sub buffers.",
      outcomes: "Average delay dropped to <50ms and resource footprints decreased by 60%.",
      resources: ["Distributed actor whitepaper", "Benchmarking graphs"],
      tags: ["WebSockets", "Elixir", "System Design"],
      status: "draft",
      versionHistory: [
        { version: 1, date: "2026-06-15", author: "Alex Chen", changes: "Draft outline" },
      ],
    },
  ],
  tests: [
    {
      id: "test-1",
      title: "Senior Frontend Mock Test",
      type: "Mock Interview",
      timeLimit: 180,
      passingCriteria: 70,
      difficultyDistribution: { easy: 1, medium: 2, hard: 1 },
      isRandomized: true,
      proctoringEnabled: true,
      attemptsCount: 148,
      averageScorePercent: 68.4,
      passRatePercent: 52.1,
      completedTimeAvg: 142,
      questionPoolSize: 12,
      status: "published",
      recentAttempts: [
        { id: "att-1", user: "dev_john", scorePercent: 82, timeTakenMinutes: 135, date: "2h ago", status: "passed" },
        { id: "att-2", user: "code_jennifer", scorePercent: 55, timeTakenMinutes: 172, date: "5h ago", status: "failed" },
      ],
    },
    {
      id: "test-2",
      title: "JavaScript Advanced Internals",
      type: "Assessment",
      timeLimit: 60,
      passingCriteria: 80,
      difficultyDistribution: { easy: 5, medium: 5, hard: 0 },
      isRandomized: false,
      proctoringEnabled: false,
      attemptsCount: 890,
      averageScorePercent: 82.5,
      passRatePercent: 78.4,
      completedTimeAvg: 41,
      questionPoolSize: 10,
      status: "published",
    },
  ],
  contests: [
    {
      id: "contest-1",
      title: "Week 25: Graph Traversal Speedrun",
      startDate: "2026-06-28T10:00:00",
      endDate: "2026-06-28T12:00:00",
      registrationCount: 412,
      rules: "Standard ACM-ICPC rules. 50-minute penalty per wrong submission.",
      penalties: "50 points deduction per fail.",
      problems: ["Two Sum", "Merge K Sorted Lists"],
      winners: [],
      status: "upcoming",
    },
    {
      id: "contest-2",
      title: "Week 24: Dynamic Programming Knapsack",
      startDate: "2026-06-21T10:00:00",
      endDate: "2026-06-21T12:00:00",
      registrationCount: 680,
      rules: "Speed-based contest, tie-breaker resolved by submission time.",
      penalties: "None",
      problems: ["Valid Parentheses"],
      winners: ["user_dijkstra", "stack_overflow_fan"],
      status: "completed",
    },
  ],
};

// ==========================================
// DB Store Engine
// ==========================================

const LOCAL_STORAGE_KEY = "quild_practice_db";

function getDB(): PracticeDatabase {
  if (typeof window === "undefined") return INITIAL_DB;
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DB));
    return INITIAL_DB;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_DB;
  }
}

function saveDB(db: PracticeDatabase) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
}

// ==========================================
// React Query Hooks
// ==========================================

// 1. Problems Hooks
export function useDsaProblems() {
  return useQuery({
    queryKey: ["admin", "practice", "problems"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return getDB().problems;
    },
  });
}

export function useSaveDsaProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (problem: DsaProblem) => {
      const db = getDB();
      const index = db.problems.findIndex((p) => p.id === problem.id);
      if (index > -1) {
        db.problems[index] = problem;
      } else {
        db.problems.push(problem);
      }
      saveDB(db);
      return problem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "problems"] });
    },
  });
}

export function useDeleteDsaProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getDB();
      db.problems = db.problems.filter((p) => p.id !== id);
      saveDB(db);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "problems"] });
    },
  });
}

// 2. Q&A Hooks
export function useQaQuestions() {
  return useQuery({
    queryKey: ["admin", "practice", "questions"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return getDB().questions;
    },
  });
}

export function useUpdateQaQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (question: QaQuestion) => {
      const db = getDB();
      const index = db.questions.findIndex((q) => q.id === question.id);
      if (index > -1) {
        db.questions[index] = question;
      } else {
        db.questions.push(question);
      }
      saveDB(db);
      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "questions"] });
    },
  });
}

export function useDeleteQaQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getDB();
      db.questions = db.questions.filter((q) => q.id !== id);
      saveDB(db);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "questions"] });
    },
  });
}

// 3. Case Studies Hooks
export function useCaseStudies() {
  return useQuery({
    queryKey: ["admin", "practice", "caseStudies"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return getDB().caseStudies;
    },
  });
}

export function useSaveCaseStudy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (caseStudy: CaseStudy) => {
      const db = getDB();
      const index = db.caseStudies.findIndex((c) => c.id === caseStudy.id);
      if (index > -1) {
        db.caseStudies[index] = caseStudy;
      } else {
        db.caseStudies.push(caseStudy);
      }
      saveDB(db);
      return caseStudy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "caseStudies"] });
    },
  });
}

export function useDeleteCaseStudy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getDB();
      db.caseStudies = db.caseStudies.filter((c) => c.id !== id);
      saveDB(db);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "caseStudies"] });
    },
  });
}

// 4. Tests & Contests Hooks
export function useTestsAndContests() {
  return useQuery({
    queryKey: ["admin", "practice", "testsContests"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      const db = getDB();
      return {
        tests: db.tests,
        contests: db.contests,
      };
    },
  });
}

export function useSaveTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (test: TestAssessment) => {
      const db = getDB();
      const index = db.tests.findIndex((t) => t.id === test.id);
      if (index > -1) {
        db.tests[index] = test;
      } else {
        db.tests.push(test);
      }
      saveDB(db);
      return test;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "testsContests"] });
    },
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getDB();
      db.tests = db.tests.filter((t) => t.id !== id);
      saveDB(db);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "testsContests"] });
    },
  });
}

export function useSaveContest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contest: CodingContest) => {
      const db = getDB();
      const index = db.contests.findIndex((c) => c.id === contest.id);
      if (index > -1) {
        db.contests[index] = contest;
      } else {
        db.contests.push(contest);
      }
      saveDB(db);
      return contest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "testsContests"] });
    },
  });
}

export function useDeleteContest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getDB();
      db.contests = db.contests.filter((c) => c.id !== id);
      saveDB(db);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practice", "testsContests"] });
    },
  });
}
