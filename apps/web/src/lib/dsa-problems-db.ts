export interface DSAProblem {
  id: string;
  name: string;
  category: string; // e.g. "arrays", "strings"
  subCategory: string; // e.g. "Basics", "Prefix Sum"
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: number;
  tags: string[];
  status: "completed" | "in_progress" | "not_started";
  bookmarked: boolean;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  companies: string[];
  hints: string[];
  relatedTopics: string[];
}

export const dsaProblems: Record<string, DSAProblem[]> = {
  arrays: [
    // --- Basics ---
    {
      id: "two-sum",
      name: "Two Sum",
      category: "arrays",
      subCategory: "Basics",
      difficulty: "Easy",
      acceptance: 49.5,
      tags: ["Array", "Hash Table"],
      status: "completed",
      bookmarked: true,
      description:
        "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
      companies: ["Google", "Amazon", "Meta", "Microsoft"],
      hints: [
        "A really brute force way would be to search for all possible pairs of numbers but that would be O(N^2). Is there a way to do it faster?",
        "Try using a hash map to store the values and indices as we traverse. What key-value representation would help?",
      ],
      relatedTopics: ["Hash Table", "Two Pointers"],
    },
    {
      id: "contains-duplicate",
      name: "Contains Duplicate",
      category: "arrays",
      subCategory: "Basics",
      difficulty: "Easy",
      acceptance: 61.2,
      tags: ["Array", "Hash Table", "Sorting"],
      status: "completed",
      bookmarked: false,
      description:
        "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
      examples: [
        {
          input: "nums = [1,2,3,1]",
          output: "true",
        },
        {
          input: "nums = [1,2,3,4]",
          output: "false",
        },
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      companies: ["Google", "Amazon", "Uber", "Microsoft"],
      hints: [
        "If we sort the array, duplicate elements will be adjacent. What is the time complexity of that?",
        "Can we check for duplicates in O(N) time using a Hash Set to track seen numbers?",
      ],
      relatedTopics: ["Hash Table", "Sorting"],
    },
    {
      id: "missing-number",
      name: "Missing Number",
      category: "arrays",
      subCategory: "Basics",
      difficulty: "Easy",
      acceptance: 63.4,
      tags: ["Array", "Math", "Bit Manipulation"],
      status: "completed",
      bookmarked: false,
      description:
        "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
      examples: [
        {
          input: "nums = [3,0,1]",
          output: "2",
          explanation:
            "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.",
        },
      ],
      constraints: [
        "n == nums.length",
        "1 <= n <= 10^4",
        "0 <= nums[i] <= n",
        "All the numbers of nums are unique.",
      ],
      companies: ["Amazon", "Meta", "Microsoft"],
      hints: [
        "What is the mathematical sum of all numbers from 0 to N? Can we compute the actual sum of elements in `nums`?",
        "Is there a bitwise XOR approach that can find the missing number without causing integer overflow?",
      ],
      relatedTopics: ["Math", "Bit Manipulation"],
    },
    {
      id: "majority-element",
      name: "Majority Element",
      category: "arrays",
      subCategory: "Basics",
      difficulty: "Easy",
      acceptance: 63.9,
      tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting"],
      status: "completed",
      bookmarked: false,
      description:
        "Given an array `nums` of size `n`, return the majority element.\n\nThe majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.",
      examples: [
        {
          input: "nums = [3,2,3]",
          output: "3",
        },
        {
          input: "nums = [2,2,1,1,1,2,2]",
          output: "2",
        },
      ],
      constraints: [
        "n == nums.length",
        "1 <= n <= 5 * 10^4",
        "-10^9 <= nums[i] <= 10^9",
      ],
      companies: ["Google", "Amazon", "Atlassian", "Meta"],
      hints: [
        "Can we solve this in O(1) space? Research Boyer-Moore Majority Vote Algorithm.",
        "How does tracking a candidate majority element and its count help find the answer in a single pass?",
      ],
      relatedTopics: ["Boyer-Moore Voting", "Hash Table"],
    },
    // --- Prefix Sum ---
    {
      id: "running-sum-of-1d-array",
      name: "Running Sum of 1D Array",
      category: "arrays",
      subCategory: "Prefix Sum",
      difficulty: "Easy",
      acceptance: 88.5,
      tags: ["Array", "Prefix Sum"],
      status: "completed",
      bookmarked: false,
      description:
        "Given an array `nums`. We define a running sum of an array as `runningSum[i] = sum(nums[0]…nums[i])`.\n\nReturn the running sum of `nums`.",
      examples: [
        {
          input: "nums = [1,2,3,4]",
          output: "[1,3,6,10]",
          explanation:
            "Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4].",
        },
      ],
      constraints: ["1 <= nums.length <= 1000", "-10^6 <= nums[i] <= 10^6"],
      companies: ["Google", "Amazon"],
      hints: [
        "We can update the array in-place. Try adding elements as we traverse.",
        "How is prefix sum used to perform range queries in constant time?",
      ],
      relatedTopics: ["Prefix Sum"],
    },
    {
      id: "subarray-sum-equals-k",
      name: "Subarray Sum Equals K",
      category: "arrays",
      subCategory: "Prefix Sum",
      difficulty: "Medium",
      acceptance: 44.1,
      tags: ["Array", "Hash Table", "Prefix Sum"],
      status: "in_progress",
      bookmarked: true,
      description:
        "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
      examples: [
        {
          input: "nums = [1,1,1], k = 2",
          output: "2",
        },
        {
          input: "nums = [1,2,3], k = 3",
          output: "2",
        },
      ],
      constraints: [
        "1 <= nums.length <= 2 * 10^4",
        "-1000 <= nums[i] <= 1000",
        "-10^7 <= k <= 10^7",
      ],
      companies: ["Google", "Meta", "Uber", "Amazon"],
      hints: [
        "If we store prefix sums in a map, how can we check if a previous prefix sum equals (current_sum - k)?",
        "Explain how mapping prefix sum frequencies helps handle negative numbers in the array.",
      ],
      relatedTopics: ["Hash Table", "Prefix Sum"],
    },
    {
      id: "product-of-array-except-self",
      name: "Product of Array Except Self",
      category: "arrays",
      subCategory: "Prefix Sum",
      difficulty: "Medium",
      acceptance: 65.2,
      tags: ["Array", "Prefix Sum"],
      status: "not_started",
      bookmarked: false,
      description:
        "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.",
      examples: [
        {
          input: "nums = [1,2,3,4]",
          output: "[24,12,8,6]",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^5",
        "-30 <= nums[i] <= 30",
        "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
      ],
      companies: ["Meta", "Amazon", "Microsoft", "Uber", "Atlassian"],
      hints: [
        "Think of using two arrays: left prefix products and right suffix products.",
        "Can we optimize space further by constructing the prefix product in the result array and calculating suffixes dynamically?",
      ],
      relatedTopics: ["Prefix Sum", "Space Optimization"],
    },
    // --- Two Pointers ---
    {
      id: "container-with-most-water",
      name: "Container With Most Water",
      category: "arrays",
      subCategory: "Two Pointers",
      difficulty: "Medium",
      acceptance: 54.3,
      tags: ["Array", "Two Pointers", "Greedy"],
      status: "completed",
      bookmarked: false,
      description:
        "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
      examples: [
        {
          input: "height = [1,8,6,2,5,4,8,3,7]",
          output: "49",
          explanation:
            "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
        },
      ],
      constraints: [
        "n == height.length",
        "2 <= n <= 10^5",
        "0 <= height[i] <= 10^4",
      ],
      companies: ["Google", "Amazon", "Meta", "Atlassian"],
      hints: [
        "Use two pointers, one at each end. Calculate the area and store the maximum.",
        "Which pointer should we move inward to maximize the area: the shorter one or the longer one? Why?",
      ],
      relatedTopics: ["Two Pointers", "Greedy"],
    },
    {
      id: "3sum",
      name: "3Sum",
      category: "arrays",
      subCategory: "Two Pointers",
      difficulty: "Medium",
      acceptance: 32.8,
      tags: ["Array", "Two Pointers", "Sorting"],
      status: "in_progress",
      bookmarked: true,
      description:
        "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
      examples: [
        {
          input: "nums = [-1,0,1,2,-1,-4]",
          output: "[[-1,-1,2],[-1,0,1]]",
        },
      ],
      constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
      companies: ["Meta", "Amazon", "Google", "Uber", "Microsoft"],
      hints: [
        "If we sort the array first, can we fix one element and use the Two Sum Two Pointers approach for the remaining two?",
        "How do we skip duplicates efficiently when adjusting pointers to avoid duplicate triplets in the output?",
      ],
      relatedTopics: ["Two Pointers", "Sorting"],
    },
    {
      id: "4sum",
      name: "4Sum",
      category: "arrays",
      subCategory: "Two Pointers",
      difficulty: "Medium",
      acceptance: 36.1,
      tags: ["Array", "Two Pointers", "Sorting"],
      status: "not_started",
      bookmarked: false,
      description:
        "Given an array `nums` of `n` integers, return an array of all the unique triplets `[nums[a], nums[b], nums[c], nums[d]]` such that:\n\n* `0 <= a, b, c, d < n`\n* `a, b, c, and d` are distinct.\n* `nums[a] + nums[b] + nums[c] + nums[d] == target`\n\nYou may return the answer in any order.",
      examples: [
        {
          input: "nums = [1,0,-1,0,-2,2], target = 0",
          output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
        },
      ],
      constraints: [
        "1 <= nums.length <= 200",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
      ],
      companies: ["Amazon", "Google", "Atlassian"],
      hints: [
        "This is an extension of 3Sum. Fix the first two elements and then apply Two Pointers.",
        "How can we generalize this to k-Sum recursively?",
      ],
      relatedTopics: ["Two Pointers", "Sorting"],
    },
    // --- Sliding Window ---
    {
      id: "maximum-average-subarray",
      name: "Maximum Average Subarray I",
      category: "arrays",
      subCategory: "Sliding Window",
      difficulty: "Easy",
      acceptance: 43.8,
      tags: ["Array", "Sliding Window"],
      status: "completed",
      bookmarked: false,
      description:
        "You are given an integer array `nums` consisting of `n` elements, and an integer `k`.\n\nFind a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value. Any answer with a calculation error less than `10^-5` will be accepted.",
      examples: [
        {
          input: "nums = [1,12,-5,-6,50,3], k = 4",
          output: "12.75",
          explanation:
            "Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75",
        },
      ],
      constraints: [
        "n == nums.length",
        "1 <= k <= n <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
      ],
      companies: ["Google", "Amazon", "Meta"],
      hints: [
        "Initialize the sum of the first k elements.",
        "Slide the window by subtracting the left element and adding the new right element to calculate the sum in O(1) time per shift.",
      ],
      relatedTopics: ["Sliding Window"],
    },
    {
      id: "minimum-size-subarray-sum",
      name: "Minimum Size Subarray Sum",
      category: "arrays",
      subCategory: "Sliding Window",
      difficulty: "Medium",
      acceptance: 45.2,
      tags: ["Array", "Two Pointers", "Sliding Window", "Binary Search"],
      status: "not_started",
      bookmarked: false,
      description:
        "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.",
      examples: [
        {
          input: "target = 7, nums = [2,3,1,2,4,3]",
          output: "2",
          explanation:
            "The subarray [4,3] has the minimal length under the problem constraint.",
        },
      ],
      constraints: [
        "1 <= target <= 10^9",
        "1 <= nums.length <= 10^5",
        "1 <= nums[i] <= 10^4",
      ],
      companies: ["Google", "Microsoft", "Amazon", "Meta"],
      hints: [
        "Use a dynamic sliding window. Keep extending the right pointer.",
        "Once sum is greater than or equal to target, shrink the window from the left to find the minimum length.",
      ],
      relatedTopics: ["Sliding Window", "Two Pointers"],
    },
    {
      id: "sliding-window-maximum",
      name: "Sliding Window Maximum",
      category: "arrays",
      subCategory: "Sliding Window",
      difficulty: "Hard",
      acceptance: 46.5,
      tags: [
        "Array",
        "Queue",
        "Sliding Window",
        "Heap (Priority Queue)",
        "Monotonic Queue",
      ],
      status: "not_started",
      bookmarked: false,
      description:
        "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.",
      examples: [
        {
          input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
          output: "[3,3,5,5,6,7]",
          explanation:
            "Window position:\n[1 3 -1] -3 5 3 6 7 -> 3\n1 [3 -1 -3] 5 3 6 7 -> 3\n1 3 [-1 -3 5] 3 6 7 -> 5\n1 3 -1 [-3 5 3] 6 7 -> 5\n1 3 -1 -3 [5 3 6] 7 -> 6\n1 3 -1 -3 5 [3 6 7] -> 7",
        },
      ],
      constraints: [
        "1 <= nums.length <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
        "1 <= k <= nums.length",
      ],
      companies: ["Google", "Amazon", "Meta", "Uber", "Microsoft", "Atlassian"],
      hints: [
        "A double-ended queue (deque) can be used to store indices of potential maximum values.",
        "Keep the deque elements in descending order (monotonic deque). Remove indices that are outside the current window range.",
      ],
      relatedTopics: ["Monotonic Queue", "Sliding Window", "Heap"],
    },
    // --- Binary Search ---
    {
      id: "search-insert-position",
      name: "Search Insert Position",
      category: "arrays",
      subCategory: "Binary Search",
      difficulty: "Easy",
      acceptance: 44.2,
      tags: ["Array", "Binary Search"],
      status: "completed",
      bookmarked: false,
      description:
        "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
      examples: [
        {
          input: "nums = [1,3,5,6], target = 5",
          output: "2",
        },
        {
          input: "nums = [1,3,5,6], target = 2",
          output: "1",
        },
      ],
      constraints: [
        "1 <= nums.length <= 10^4",
        "-10^4 <= nums[i] <= 10^4",
        "nums contains distinct values sorted in ascending order.",
        "-10^4 <= target <= 10^4",
      ],
      companies: ["Google", "Amazon", "Microsoft"],
      hints: [
        "Use binary search logic to locate target. Keep tracking the mid index.",
        "If target is not found, what does the boundary pointers low/high represent?",
      ],
      relatedTopics: ["Binary Search"],
    },
    {
      id: "search-in-rotated-sorted-array",
      name: "Search in Rotated Sorted Array",
      category: "arrays",
      subCategory: "Binary Search",
      difficulty: "Medium",
      acceptance: 39.8,
      tags: ["Array", "Binary Search"],
      status: "not_started",
      bookmarked: false,
      description:
        "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (0-indexed).\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
      examples: [
        {
          input: "nums = [4,5,6,7,0,1,2], target = 0",
          output: "4",
        },
      ],
      constraints: [
        "1 <= nums.length <= 5000",
        "-10^4 <= nums[i] <= 10^4",
        "All values of nums are unique.",
        "nums is an ascending array that is possibly rotated.",
        "-10^4 <= target <= 10^4",
      ],
      companies: ["Google", "Microsoft", "Meta", "Amazon", "Uber"],
      hints: [
        "Even after rotation, one half of the array will always remain sorted.",
        "Check which half is sorted, then check if the target lies within the boundaries of that sorted half to adjust search range.",
      ],
      relatedTopics: ["Binary Search"],
    },
    {
      id: "find-peak-element",
      name: "Find Peak Element",
      category: "arrays",
      subCategory: "Binary Search",
      difficulty: "Medium",
      acceptance: 46.3,
      tags: ["Array", "Binary Search"],
      status: "not_started",
      bookmarked: false,
      description:
        "A peak element is an element that is strictly greater than its neighbors.\n\nGiven a 0-indexed integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\n\nYou may imagine that `nums[-1] = nums[n] = -∞`.\n\nYou must write an algorithm that runs in `O(log n)` time.",
      examples: [
        {
          input: "nums = [1,2,3,1]",
          output: "2",
          explanation:
            "3 is a peak element and your function should return the index number 2.",
        },
      ],
      constraints: [
        "1 <= nums.length <= 1000",
        "-2^31 <= nums[i] <= 2^31 - 1",
        "nums[i] != nums[i + 1] for all valid i.",
      ],
      companies: ["Google", "Meta", "Amazon"],
      hints: [
        "Can we check if mid is on an ascending slope? If nums[mid] < nums[mid + 1], a peak must lie on the right side.",
        "What happens if mid is on a descending slope? Can we search the left half?",
      ],
      relatedTopics: ["Binary Search"],
    },
    // --- Matrix Problems ---
    {
      id: "spiral-matrix",
      name: "Spiral Matrix",
      category: "arrays",
      subCategory: "Matrix Problems",
      difficulty: "Medium",
      acceptance: 47.1,
      tags: ["Array", "Matrix", "Simulation"],
      status: "not_started",
      bookmarked: false,
      description:
        "Given an `m x n` `matrix`, return all elements of the `matrix` in spiral order.",
      examples: [
        {
          input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
          output: "[1,2,3,6,9,8,7,4,5]",
        },
      ],
      constraints: [
        "m == matrix.length",
        "n == matrix[i].length",
        "1 <= m, n <= 10",
        "-100 <= matrix[i][j] <= 100",
      ],
      companies: ["Google", "Amazon", "Microsoft", "Meta", "Uber"],
      hints: [
        "Set boundary pointers for top, bottom, left, right rows/columns.",
        "Traverse from left-to-right, top-to-bottom, right-to-left, bottom-to-top, adjusting indices at each step.",
      ],
      relatedTopics: ["Matrix", "Simulation"],
    },
    {
      id: "rotate-image",
      name: "Rotate Image",
      category: "arrays",
      subCategory: "Matrix Problems",
      difficulty: "Medium",
      acceptance: 72.1,
      tags: ["Array", "Math", "Matrix"],
      status: "not_started",
      bookmarked: false,
      description:
        "You are given an `n x n` 2D `matrix` representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.",
      examples: [
        {
          input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
          output: "[[7,4,1],[8,5,2],[9,6,3]]",
        },
      ],
      constraints: [
        "n == matrix.length == matrix[i].length",
        "1 <= n <= 20",
        "-1000 <= matrix[i][j] <= 1000",
      ],
      companies: ["Microsoft", "Google", "Amazon", "Atlassian"],
      hints: [
        "Can we transpose the matrix (swap matrix[i][j] and matrix[j][i])?",
        "After transposing, how does reversing each row give a 90-degree clockwise rotation?",
      ],
      relatedTopics: ["Matrix", "Math"],
    },
    {
      id: "set-matrix-zeroes",
      name: "Set Matrix Zeroes",
      category: "arrays",
      subCategory: "Matrix Problems",
      difficulty: "Medium",
      acceptance: 53.4,
      tags: ["Array", "Hash Table", "Matrix"],
      status: "not_started",
      bookmarked: false,
      description:
        "Given an `m x n` integer matrix `matrix`, if an element is 0, set its entire row and column to 0's.\n\nYou must do it in place.",
      examples: [
        {
          input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
          output: "[[1,0,1],[0,0,0],[1,0,1]]",
        },
      ],
      constraints: [
        "m == matrix.length",
        "n == matrix[0].length",
        "1 <= m, n <= 200",
        "-2^31 <= matrix[i][j] <= 2^31 - 1",
      ],
      companies: ["Google", "Amazon", "Microsoft", "Meta"],
      hints: [
        "Instead of separate markers, can we use the first cell of each row and column as flags?",
        "Keep track of whether the first row or first column needs to be zeroed out separately.",
      ],
      relatedTopics: ["Matrix", "Space Optimization"],
    },
  ],
  strings: [
    {
      id: "reverse-string",
      name: "Reverse String",
      category: "strings",
      subCategory: "Basics",
      difficulty: "Easy",
      acceptance: 87.2,
      tags: ["Two Pointers", "String"],
      status: "completed",
      bookmarked: false,
      description:
        "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with `O(1)` extra memory.",
      examples: [
        {
          input: 's = ["h","e","l","l","o"]',
          output: '["o","l","l","e","h"]',
        },
      ],
      constraints: [
        "1 <= s.length <= 10^5",
        "s[i] is a printable ascii character.",
      ],
      companies: ["Google", "Amazon"],
      hints: [
        "Use two pointers at indices 0 and length-1 and swap values.",
        "Move pointers closer until they meet.",
      ],
      relatedTopics: ["Two Pointers", "String"],
    },
    {
      id: "valid-palindrome",
      name: "Valid Palindrome",
      category: "strings",
      subCategory: "Basics",
      difficulty: "Easy",
      acceptance: 45.6,
      tags: ["Two Pointers", "String"],
      status: "completed",
      bookmarked: false,
      description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
      examples: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: "true",
          explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
      ],
      constraints: [
        "1 <= s.length <= 2 * 10^5",
        "s consists only of printable ASCII characters.",
      ],
      companies: ["Meta", "Amazon", "Microsoft"],
      hints: [
        "Convert all letters to lowercase first.",
        "Filter out all non-alphanumeric characters, then reverse compare.",
      ],
      relatedTopics: ["Two Pointers", "String"],
    },
    {
      id: "longest-substring-without-repeating",
      name: "Longest Substring Without Repeating Characters",
      category: "strings",
      subCategory: "Pattern Matching",
      difficulty: "Medium",
      acceptance: 33.8,
      tags: ["Sliding Window", "Hash Table", "String"],
      status: "in_progress",
      bookmarked: true,
      description:
        "Given a string `s`, find the length of the longest substring without repeating characters.",
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: "The answer is 'abc', with the length of 3.",
        },
      ],
      constraints: [
        "0 <= s.length <= 5 * 10^4",
        "s consists of English letters, digits, symbols and spaces.",
      ],
      companies: ["Google", "Amazon", "Meta", "Uber", "Microsoft"],
      hints: [
        "Use a sliding window map containing character frequencies.",
        "Extend right pointer. Shrink left pointer when duplicate is found.",
      ],
      relatedTopics: ["Sliding Window", "Hash Table"],
    },
  ],
  "linked-list": [
    {
      id: "reverse-linked-list",
      name: "Reverse Linked List",
      category: "linked-list",
      subCategory: "Operations",
      difficulty: "Easy",
      acceptance: 73.5,
      tags: ["Linked List", "Recursion"],
      status: "completed",
      bookmarked: false,
      description:
        "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[5,4,3,2,1]",
        },
      ],
      constraints: [
        "The number of nodes in the list is the range [0, 5000].",
        "-5000 <= Node.val <= 5000",
      ],
      companies: ["Google", "Amazon", "Meta"],
      hints: [
        "Keep track of prev, curr, and next nodes as we loop.",
        "Reverse pointers iteratively.",
      ],
      relatedTopics: ["Linked List", "Pointers"],
    },
    {
      id: "linked-list-cycle",
      name: "Linked List Cycle",
      category: "linked-list",
      subCategory: "Advanced",
      difficulty: "Easy",
      acceptance: 47.9,
      tags: ["Linked List", "Two Pointers"],
      status: "completed",
      bookmarked: true,
      description:
        "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to. Note that `pos` is not passed as a parameter.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`. ",
      examples: [
        {
          input: "head = [3,2,0,-4], pos = 1",
          output: "true",
          explanation:
            "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
        },
      ],
      constraints: [
        "The number of nodes in the list is in the range [0, 10^4].",
        "-10^5 <= Node.val <= 10^5",
      ],
      companies: ["Amazon", "Microsoft", "Meta"],
      hints: [
        "Can you solve this in O(1) memory? Think of fast and slow pointer speed ratios.",
        "Floyd's Tortoise and Hare cycle detection algorithm works best here.",
      ],
      relatedTopics: ["Two Pointers", "Cycle Detection"],
    },
  ],
  trees: [
    {
      id: "invert-binary-tree",
      name: "Invert Binary Tree",
      category: "trees",
      subCategory: "BST",
      difficulty: "Easy",
      acceptance: 75.2,
      tags: ["Tree", "DFS", "BFS"],
      status: "completed",
      bookmarked: false,
      description:
        "Given the `root` of a binary tree, invert the tree, and return its root.",
      examples: [
        {
          input: "root = [4,2,7,1,3,6,9]",
          output: "[4,7,2,9,6,3,1]",
        },
      ],
      constraints: [
        "The number of nodes in the tree is in the range [0, 100].",
        "-100 <= Node.val <= 100",
      ],
      companies: ["Google", "Amazon"],
      hints: [
        "Think recursively. Swap left and right subtrees.",
        "Return root after recursing on subnodes.",
      ],
      relatedTopics: ["Binary Tree", "Recursion"],
    },
    {
      id: "binary-tree-level-order",
      name: "Binary Tree Level Order Traversal",
      category: "trees",
      subCategory: "Traversals",
      difficulty: "Medium",
      acceptance: 65.3,
      tags: ["Tree", "BFS"],
      status: "in_progress",
      bookmarked: true,
      description:
        "Given the `root` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "[[3],[9,20],[15,7]]",
        },
      ],
      constraints: [
        "The number of nodes in the tree is in the range [0, 2000].",
        "-1000 <= Node.val <= 1000",
      ],
      companies: ["Google", "Amazon", "Meta", "Microsoft"],
      hints: [
        "Use a queue to process nodes level by level.",
        "Keep track of level sizes during queue iteration.",
      ],
      relatedTopics: ["BFS", "Tree"],
    },
  ],
  graphs: [
    {
      id: "clone-graph",
      name: "Clone Graph",
      category: "graphs",
      subCategory: "Traversals",
      difficulty: "Medium",
      acceptance: 52.8,
      tags: ["Graph", "BFS", "DFS", "Hash Table"],
      status: "completed",
      bookmarked: false,
      description:
        "Given a reference of a node in a connected undirected graph.\n\nReturn a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (int) and a list (List[Node]) of its neighbors.",
      examples: [
        {
          input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
          output: "[[2,4],[1,3],[2,4],[1,3]]",
          explanation:
            "There are 4 nodes in the graph.\n1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).\n3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).",
        },
      ],
      constraints: [
        "The number of nodes in the graph is between 0 and 100.",
        "1 <= Node.val <= 100",
        "Node.val is unique for each node.",
      ],
      companies: ["Google", "Amazon", "Meta", "Microsoft"],
      hints: [
        "Use a map to store the mapping from original nodes to cloned nodes.",
        "Perform DFS or BFS to traverse the graph and construct clones.",
      ],
      relatedTopics: ["DFS", "BFS", "Graph"],
    },
  ],
  "dynamic-programming": [
    {
      id: "climbing-stairs",
      name: "Climbing Stairs",
      category: "dynamic-programming",
      subCategory: "Basics",
      difficulty: "Easy",
      acceptance: 52.1,
      tags: ["Math", "Dynamic Programming"],
      status: "completed",
      bookmarked: false,
      description:
        "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      examples: [
        {
          input: "n = 2",
          output: "2",
          explanation:
            "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
        },
      ],
      constraints: ["1 <= n <= 45"],
      companies: ["Google", "Amazon", "Meta"],
      hints: [
        "The problem is equivalent to finding the n-th Fibonacci number.",
        "Define state: dp[i] = dp[i-1] + dp[i-2].",
      ],
      relatedTopics: ["Fibonacci", "Dynamic Programming"],
    },
  ],
};
