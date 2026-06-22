export interface DSASubtopic {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  problemsCount: number;
  status: "completed" | "in_progress" | "not_started";
}

export interface DSACategory {
  id: string;
  name: string;
  description: string;
  totalProblems: number;
  solvedProblems: number;
  subtopics: DSASubtopic[];
}

export const dsaCategories: DSACategory[] = [
  {
    id: "arrays",
    name: "Arrays",
    description:
      "Learn sequential data storage, search, sorting, multi-dimensional grids, and contiguous memory access techniques.",
    totalProblems: 48,
    solvedProblems: 31,
    subtopics: [
      {
        name: "Basics",
        difficulty: "Easy",
        problemsCount: 12,
        status: "completed",
      },
      {
        name: "Traversal",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "Insertion",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Deletion",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Searching",
        difficulty: "Easy",
        problemsCount: 10,
        status: "in_progress",
      },
      {
        name: "Sorting",
        difficulty: "Medium",
        problemsCount: 15,
        status: "in_progress",
      },
      {
        name: "Prefix Sum",
        difficulty: "Medium",
        problemsCount: 8,
        status: "not_started",
      },
      {
        name: "Sliding Window",
        difficulty: "Medium",
        problemsCount: 12,
        status: "not_started",
      },
      {
        name: "Two Pointer",
        difficulty: "Medium",
        problemsCount: 10,
        status: "not_started",
      },
      {
        name: "Kadane's Algorithm",
        difficulty: "Medium",
        problemsCount: 6,
        status: "not_started",
      },
      {
        name: "Merge Intervals",
        difficulty: "Medium",
        problemsCount: 8,
        status: "not_started",
      },
      {
        name: "Matrix Problems",
        difficulty: "Hard",
        problemsCount: 14,
        status: "not_started",
      },
    ],
  },
  {
    id: "strings",
    name: "Strings",
    description:
      "Master string manipulation, pattern matching algorithms, parsing techniques, and sequence operations.",
    totalProblems: 36,
    solvedProblems: 24,
    subtopics: [
      {
        name: "Basics",
        difficulty: "Easy",
        problemsCount: 10,
        status: "completed",
      },
      {
        name: "Palindrome",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "Anagrams",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Substring Search",
        difficulty: "Medium",
        problemsCount: 12,
        status: "in_progress",
      },
      {
        name: "String Manipulation",
        difficulty: "Medium",
        problemsCount: 15,
        status: "not_started",
      },
      {
        name: "Regex/Parsing",
        difficulty: "Hard",
        problemsCount: 8,
        status: "not_started",
      },
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    description:
      "Understand node pointer representations, single/double links, cyclic detection, and fast/slow pointer algorithms.",
    totalProblems: 28,
    solvedProblems: 18,
    subtopics: [
      {
        name: "Singly Linked List",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "Doubly Linked List",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Reverse List",
        difficulty: "Easy",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "Detect Loop",
        difficulty: "Medium",
        problemsCount: 6,
        status: "in_progress",
      },
      {
        name: "Merge Lists",
        difficulty: "Medium",
        problemsCount: 8,
        status: "not_started",
      },
      {
        name: "LRU Cache",
        difficulty: "Hard",
        problemsCount: 4,
        status: "not_started",
      },
    ],
  },
  {
    id: "stack",
    name: "Stack",
    description:
      "Apply Last-In-First-Out (LIFO) access patterns for parentheses matching, recursion simulation, and parsing expressions.",
    totalProblems: 25,
    solvedProblems: 12,
    subtopics: [
      {
        name: "Basics",
        difficulty: "Easy",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "Valid Parentheses",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "Next Greater Element",
        difficulty: "Medium",
        problemsCount: 10,
        status: "in_progress",
      },
      {
        name: "Min Stack",
        difficulty: "Medium",
        problemsCount: 6,
        status: "not_started",
      },
      {
        name: "Monotonic Stack",
        difficulty: "Hard",
        problemsCount: 8,
        status: "not_started",
      },
    ],
  },
  {
    id: "queue",
    name: "Queue",
    description:
      "Understand First-In-First-Out (FIFO) buffers, circular queues, deque structures, and scheduling models.",
    totalProblems: 20,
    solvedProblems: 10,
    subtopics: [
      {
        name: "Basics",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Circular Queue",
        difficulty: "Easy",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "Queue using Stacks",
        difficulty: "Easy",
        problemsCount: 4,
        status: "completed",
      },
      {
        name: "Sliding Window Maximum",
        difficulty: "Hard",
        problemsCount: 8,
        status: "not_started",
      },
    ],
  },
  {
    id: "recursion",
    name: "Recursion",
    description:
      "Master call stack operations, base cases, structural induction, and divide-and-conquer methodologies.",
    totalProblems: 18,
    solvedProblems: 12,
    subtopics: [
      {
        name: "Basics",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "Factorial & Fibonacci",
        difficulty: "Easy",
        problemsCount: 4,
        status: "completed",
      },
      {
        name: "Subset Sum",
        difficulty: "Medium",
        problemsCount: 10,
        status: "in_progress",
      },
      {
        name: "Tower of Hanoi",
        difficulty: "Medium",
        problemsCount: 5,
        status: "not_started",
      },
      {
        name: "Permutations",
        difficulty: "Hard",
        problemsCount: 8,
        status: "not_started",
      },
    ],
  },
  {
    id: "hashing",
    name: "Hashing",
    description:
      "Learn hash table design, collision resolution, hash maps, sets, and constant-time search patterns.",
    totalProblems: 22,
    solvedProblems: 14,
    subtopics: [
      {
        name: "Design HashMap",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Two Sum",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "Longest Consecutive Sequence",
        difficulty: "Medium",
        problemsCount: 10,
        status: "in_progress",
      },
      {
        name: "Subarray Sum Equals K",
        difficulty: "Medium",
        problemsCount: 12,
        status: "not_started",
      },
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description:
      "Divide search space in half to achieve logarithmic search time on sorted collections and arrays.",
    totalProblems: 24,
    solvedProblems: 15,
    subtopics: [
      {
        name: "Basics",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "Search in Rotated Array",
        difficulty: "Medium",
        problemsCount: 10,
        status: "in_progress",
      },
      {
        name: "Search 2D Matrix",
        difficulty: "Medium",
        problemsCount: 6,
        status: "not_started",
      },
      {
        name: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        problemsCount: 5,
        status: "not_started",
      },
    ],
  },
  {
    id: "trees",
    name: "Trees",
    description:
      "Explore hierarchical representations, binary trees, traversing (pre, in, post order), and tree diameters.",
    totalProblems: 42,
    solvedProblems: 14,
    subtopics: [
      {
        name: "Tree Basics",
        difficulty: "Easy",
        problemsCount: 10,
        status: "completed",
      },
      {
        name: "DFS",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "BFS",
        difficulty: "Medium",
        problemsCount: 12,
        status: "in_progress",
      },
      {
        name: "Preorder Traversal",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Inorder Traversal",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Postorder Traversal",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Level Order Traversal",
        difficulty: "Medium",
        problemsCount: 8,
        status: "in_progress",
      },
      {
        name: "Lowest Common Ancestor",
        difficulty: "Medium",
        problemsCount: 10,
        status: "not_started",
      },
      {
        name: "Diameter of Tree",
        difficulty: "Medium",
        problemsCount: 8,
        status: "not_started",
      },
      {
        name: "Binary Tree Problems",
        difficulty: "Hard",
        problemsCount: 15,
        status: "not_started",
      },
    ],
  },
  {
    id: "binary-search-tree",
    name: "Binary Search Tree",
    description:
      "Implement ordered hierarchies where elements maintain sorted structural invariants for quick insertion and search.",
    totalProblems: 18,
    solvedProblems: 9,
    subtopics: [
      {
        name: "BST Search",
        difficulty: "Easy",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "BST Insert",
        difficulty: "Easy",
        problemsCount: 4,
        status: "completed",
      },
      {
        name: "Validate BST",
        difficulty: "Medium",
        problemsCount: 8,
        status: "in_progress",
      },
      {
        name: "BST Delete",
        difficulty: "Medium",
        problemsCount: 6,
        status: "not_started",
      },
      {
        name: "Kth Smallest in BST",
        difficulty: "Medium",
        problemsCount: 8,
        status: "not_started",
      },
    ],
  },
  {
    id: "heap",
    name: "Heap",
    description:
      "Master priority queue designs, min/max heap operations, array-based implementations, and k-way merging.",
    totalProblems: 16,
    solvedProblems: 8,
    subtopics: [
      {
        name: "Min Heap Basics",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Max Heap Basics",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Kth Largest Element",
        difficulty: "Medium",
        problemsCount: 10,
        status: "in_progress",
      },
      {
        name: "Merge K Sorted Lists",
        difficulty: "Hard",
        problemsCount: 8,
        status: "not_started",
      },
    ],
  },
  {
    id: "graph",
    name: "Graph",
    description:
      "Understand networks, vertices, edges, DFS/BFS traversals, topological sorts, and shortest-path algorithms.",
    totalProblems: 38,
    solvedProblems: 7,
    subtopics: [
      {
        name: "Graph Basics",
        difficulty: "Easy",
        problemsCount: 8,
        status: "completed",
      },
      {
        name: "BFS",
        difficulty: "Easy",
        problemsCount: 10,
        status: "completed",
      },
      {
        name: "DFS",
        difficulty: "Easy",
        problemsCount: 10,
        status: "completed",
      },
      {
        name: "Topological Sort",
        difficulty: "Medium",
        problemsCount: 12,
        status: "in_progress",
      },
      {
        name: "Dijkstra",
        difficulty: "Medium",
        problemsCount: 14,
        status: "in_progress",
      },
      {
        name: "Bellman Ford",
        difficulty: "Medium",
        problemsCount: 8,
        status: "not_started",
      },
      {
        name: "Floyd Warshall",
        difficulty: "Medium",
        problemsCount: 6,
        status: "not_started",
      },
      {
        name: "MST (Prim/Kruskal)",
        difficulty: "Medium",
        problemsCount: 10,
        status: "not_started",
      },
      {
        name: "Union Find",
        difficulty: "Medium",
        problemsCount: 12,
        status: "not_started",
      },
      {
        name: "Shortest Path Problems",
        difficulty: "Hard",
        problemsCount: 15,
        status: "not_started",
      },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    description:
      "Solve complex problems by breaking them into overlapping subproblems, memoizing, and using tabulating bottom-up approaches.",
    totalProblems: 52,
    solvedProblems: 3,
    subtopics: [
      {
        name: "Fibonacci Numbers",
        difficulty: "Easy",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "Climbing Stairs",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "0/1 Knapsack",
        difficulty: "Medium",
        problemsCount: 12,
        status: "in_progress",
      },
      {
        name: "Longest Common Subsequence",
        difficulty: "Medium",
        problemsCount: 15,
        status: "not_started",
      },
      {
        name: "Longest Increasing Subsequence",
        difficulty: "Medium",
        problemsCount: 12,
        status: "not_started",
      },
      {
        name: "Edit Distance",
        difficulty: "Hard",
        problemsCount: 10,
        status: "not_started",
      },
    ],
  },
  {
    id: "greedy",
    name: "Greedy",
    description:
      "Make locally optimal choices at each stage with the goal of finding a global optimum.",
    totalProblems: 15,
    solvedProblems: 7,
    subtopics: [
      {
        name: "Activity Selection",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Fractional Knapsack",
        difficulty: "Easy",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "Job Sequencing",
        difficulty: "Medium",
        problemsCount: 8,
        status: "in_progress",
      },
      {
        name: "Huffman Coding",
        difficulty: "Medium",
        problemsCount: 6,
        status: "not_started",
      },
    ],
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description:
      "Systematically explore paths of decisions, rolling back choices that violate path validity.",
    totalProblems: 14,
    solvedProblems: 5,
    subtopics: [
      {
        name: "N-Queens",
        difficulty: "Hard",
        problemsCount: 6,
        status: "not_started",
      },
      {
        name: "Sudoku Solver",
        difficulty: "Hard",
        problemsCount: 4,
        status: "not_started",
      },
      {
        name: "Word Search",
        difficulty: "Medium",
        problemsCount: 8,
        status: "in_progress",
      },
      {
        name: "Generate Parentheses",
        difficulty: "Medium",
        problemsCount: 8,
        status: "completed",
      },
    ],
  },
  {
    id: "tries",
    name: "Tries",
    description:
      "Build efficient prefix tree data structures for spelling checks, autocompletion engines, and IP routing.",
    totalProblems: 12,
    solvedProblems: 4,
    subtopics: [
      {
        name: "Trie Insert/Search",
        difficulty: "Medium",
        problemsCount: 6,
        status: "in_progress",
      },
      {
        name: "Prefix Search",
        difficulty: "Medium",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "Word Search II",
        difficulty: "Hard",
        problemsCount: 8,
        status: "not_started",
      },
    ],
  },
  {
    id: "segment-tree",
    name: "Segment Tree",
    description:
      "Perform range query operations and point modifications in logarithmic intervals on mutable arrays.",
    totalProblems: 10,
    solvedProblems: 0,
    subtopics: [
      {
        name: "Range Query",
        difficulty: "Hard",
        problemsCount: 8,
        status: "not_started",
      },
      {
        name: "Point Update",
        difficulty: "Hard",
        problemsCount: 6,
        status: "not_started",
      },
      {
        name: "Lazy Propagation",
        difficulty: "Hard",
        problemsCount: 5,
        status: "not_started",
      },
    ],
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    description:
      "Operate on individual binary digits to achieve micro-optimized operations and mask storage indices.",
    totalProblems: 18,
    solvedProblems: 11,
    subtopics: [
      {
        name: "Count Bits",
        difficulty: "Easy",
        problemsCount: 6,
        status: "completed",
      },
      {
        name: "Single Number",
        difficulty: "Easy",
        problemsCount: 5,
        status: "completed",
      },
      {
        name: "Power of Two",
        difficulty: "Easy",
        problemsCount: 4,
        status: "completed",
      },
      {
        name: "Subsets",
        difficulty: "Medium",
        problemsCount: 8,
        status: "in_progress",
      },
    ],
  },
];
