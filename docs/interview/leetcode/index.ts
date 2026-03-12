// Array Problems
export * from "./array/problems/01-remove-duplicates-from-sorted-array";
export * from "./array/problems/02-best-time-to-buy-and-sell-stock-ii";
export * from "./array/problems/03-rotate-array";
export * from "./array/problems/04-two-sum";
export * from "./array/problems/05-contains-duplicate";
export * from "./array/problems/06-single-number";
export * from "./array/problems/07-intersection-of-two-arrays-ii";
export * from "./array/problems/08-plus-one";
export * from "./array/problems/09-move-zeroes";
export * from "./array/problems/10-valid-sudoku";
export * from "./array/problems/11-rotate-image";
export * from "./array/problems/12-3sum";
export * from "./array/problems/13-set-matrix-zeroes";
export * from "./array/problems/14-increasing-triplet-subsequence";
export * from "./array/problems/15-missing-ranges";
export * from "./array/problems/16-count-and-say";
export * from "./array/problems/17-product-of-array-except-self";
export * from "./array/problems/18-container-with-most-water";
export * from "./array/problems/19-merge-intervals";
export * from "./array/problems/20-trapping-rain-water";
export * from "./array/problems/21-merge-intervals";
export * from "./array/problems/22-meeting-rooms-ii";
export * from "./array/problems/23-insert-interval";
export * from "./array/problems/24-three-sum-closest";
export * from "./array/problems/25-four-sum";
export * from "./array/problems/26-remove-duplicates-from-sorted-array-ii";

// String Problems
export * from "./string/problems/01-reverse-string";
export * from "./string/problems/02-reverse-integer";
export * from "./string/problems/03-first-unique-character-in-a-string";
export * from "./string/problems/04-valid-anagram";
export * from "./string/problems/05-valid-palindrome";
export * from "./string/problems/06-string-to-integer-atoi";
export * from "./string/problems/07-implement-strstr";
export * from "./string/problems/08-longest-common-prefix";
export * from "./string/problems/09-group-anagrams";
export * from "./string/problems/10-longest-substring-without-repeating-characters";
export * from "./string/problems/11-longest-palindromic-substring";
export * from "./string/problems/12-roman-to-integer";
export * from "./string/problems/13-integer-to-roman";
export * from "./string/problems/14-zigzag-conversion";
export * from "./string/problems/15-minimum-window-substring";
export * from "./string/problems/16-valid-palindrome-ii";
export * from "./string/problems/17-sliding-window-maximum";
export * from "./string/problems/18-longest-substring-with-at-most-k-distinct";
export * from "./string/problems/19-find-all-anagrams-in-string";

// Linked List Problems
export * from "./linked-list/problems/01-reverse-linked-list";
export * from "./linked-list/problems/02-merge-two-sorted-lists";
export * from "./linked-list/problems/03-palindrome-linked-list";
export * from "./linked-list/problems/04-remove-nth-node-from-end-of-list";
export * from "./linked-list/problems/05-delete-node-in-a-linked-list";
export * from "./linked-list/problems/06-linked-list-cycle";
export * from "./linked-list/problems/07-add-two-numbers";
export * from "./linked-list/problems/08-odd-even-linked-list";
export * from "./linked-list/problems/09-intersection-of-two-linked-lists";
export * from "./linked-list/problems/10-merge-k-sorted-lists";
export * from "./linked-list/problems/11-copy-list-with-random-pointer";

// Tree/Graph Problems
export * from "./tree-graph/problems/01-maximum-depth-of-binary-tree";
export * from "./tree-graph/problems/02-validate-binary-search-tree";
export * from "./tree-graph/problems/03-binary-tree-level-order-traversal";
export * from "./tree-graph/problems/04-symmetric-tree";
export * from "./tree-graph/problems/05-convert-sorted-array-to-binary-search-tree";
export * from "./tree-graph/problems/06-binary-tree-inorder-traversal";
export * from "./tree-graph/problems/13-word-ladder";
export * from "./tree-graph/problems/14-serialize-deserialize-binary-tree";
export * from "./tree-graph/problems/15-course-schedule-ii";
export * from "./tree-graph/problems/16-lowest-common-ancestor-binary-tree";
export * from "./tree-graph/problems/17-binary-tree-maximum-path-sum";
export * from "./tree-graph/problems/18-alien-dictionary";

// Design Problems
export * from "./design/problems/01-min-stack";
export * from "./design/problems/09-lru-cache";

// Dynamic Programming Problems
export * from "./dp/problems/01-climbing-stairs";
export * from "./dp/problems/09-longest-common-subsequence";
export * from "./dp/problems/10-edit-distance";
export * from "./dp/problems/11-regular-expression-matching";

// Backtracking Problems
export * from "./backtracking/problems/01-letter-combinations-of-a-phone-number";
export * from "./backtracking/problems/02-subsets";
export * from "./backtracking/problems/03-permutations";
export * from "./backtracking/problems/04-generate-parentheses";
export * from "./backtracking/problems/05-combination-sum";
export * from "./backtracking/problems/06-word-search";
export * from "./backtracking/problems/07-n-queens";
export * from "./backtracking/problems/08-sudoku-solver";
export * from "./backtracking/problems/09-word-search-ii";
export * from "./backtracking/problems/10-palindrome-partitioning";
export * from "./backtracking/problems/11-restore-ip-addresses";

// Math Problems
export * from "./math/problems/01-fizz-buzz";
export * from "./math/problems/02-pow-x-n";
export * from "./math/problems/03-sqrt-x";

// Sorting & Searching Problems
export * from "./sorting-searching/problems/01-merge-sorted-array";
export * from "./sorting-searching/problems/02-find-k-largest-elements";
export * from "./sorting-searching/problems/03-search-in-rotated-sorted-array";
export * from "./sorting-searching/problems/04-median-of-two-sorted-arrays";

// Others Problems
export * from "./others/problems/01-valid-parentheses";

// Main export function to run all tests
export function runAllTests() {
  console.log("Running all LeetCode problem tests...\n");

  // Array Tests
  console.log("=== ARRAY PROBLEMS ===");
  // testRemoveDuplicates();
  // testMaxProfit();
  // testRotate();
  // testTwoSum();
  // testContainsDuplicate();
  // testSingleNumber();
  // testIntersect();
  // testPlusOne();
  // testMoveZeroes();
  // testIsValidSudoku();
  // testRotateImage();
  // testThreeSum();
  // testSetZeroes();
  // testIncreasingTriplet();
  // testMissingRanges();
  // testCountAndSay();

  // String Tests
  console.log("\n=== STRING PROBLEMS ===");
  // testReverseString();
  // testReverseInteger();
  // testFirstUniqChar();
  // testIsAnagram();
  // testIsPalindromeString();
  // testMyAtoi();
  // testStrStr();
  // testLongestCommonPrefix();
  // testGroupAnagrams();
  // testLengthOfLongestSubstring();
  // testLongestPalindrome();
  // testRomanToInt();
  // testIntToRoman();
  // testConvert();

  // Linked List Tests
  console.log("\n=== LINKED LIST PROBLEMS ===");
  // testReverseList();
  // testMergeTwoLists();
  // testIsPalindromeLinkedList();
  // testRemoveNthFromEnd();
  // testDeleteNode();
  // testHasCycle();
  // testAddTwoNumbers();
  // testOddEvenList();
  // testGetIntersectionNode();

  // Tree/Graph Tests
  console.log("\n=== TREE/GRAPH PROBLEMS ===");
  // testMaxDepth();
  // testIsValidBST();
  // testLevelOrder();
  // testIsSymmetric();
  // testSortedArrayToBST();
  // testInorderTraversal();

  // Design Tests
  console.log("\n=== DESIGN PROBLEMS ===");
  // testMinStack();

  // DP Tests
  console.log("\n=== DYNAMIC PROGRAMMING PROBLEMS ===");
  // testClimbStairs();

  // Backtracking Tests
  console.log("\n=== BACKTRACKING PROBLEMS ===");
  // testLetterCombinations();
  // testSubsets();
  // testPermute();
  // testGenerateParenthesis();
  // testCombinationSum();
  // testExist();
  // testSolveNQueens();
  // testSolveSudoku();

  // Math Tests
  console.log("\n=== MATH PROBLEMS ===");
  // testFizzBuzz();

  // Sorting & Searching Tests
  console.log("\n=== SORTING & SEARCHING PROBLEMS ===");
  // testMerge();

  // Others Tests
  console.log("\n=== OTHERS PROBLEMS ===");
  // testIsValid();

  console.log("\nAll tests completed!");
}

// Export all problem categories for easy access
export const problemCategories = {
  array: {
    name: "Array Problems",
    problems: [
      "Remove Duplicates from Sorted Array",
      "Best Time to Buy and Sell Stock II",
      "Rotate Array",
      "Two Sum",
      "Contains Duplicate",
      "Single Number",
      "Intersection of Two Arrays II",
      "Plus One",
      "Move Zeroes",
      "Valid Sudoku",
      "Rotate Image",
      "3Sum",
      "Set Matrix Zeroes",
      "Increasing Triplet Subsequence",
      "Missing Ranges",
      "Count and Say",
      "Product of Array Except Self",
      "Container With Most Water",
      "Merge Intervals",
      "Trapping Rain Water", 
      "Merge Intervals (Advanced)",
      "Meeting Rooms II",
      "Insert Interval",
      "3Sum Closest",
      "4Sum",
      "Remove Duplicates from Sorted Array II",
    ],
  },
  string: {
    name: "String Problems",
    problems: [
      "Reverse String",
      "Reverse Integer",
      "First Unique Character in a String",
      "Valid Anagram",
      "Valid Palindrome",
      "String to Integer (atoi)",
      "Implement strStr()",
      "Longest Common Prefix",
      "Group Anagrams",
      "Longest Substring Without Repeating Characters",
      "Longest Palindromic Substring",
      "Roman to Integer",
      "Integer to Roman",
      "ZigZag Conversion",
      "Minimum Window Substring",
      "Valid Palindrome II",
      "Sliding Window Maximum",
      "Longest Substring with At Most K Distinct Characters",
      "Find All Anagrams in a String",
    ],
  },
  linkedList: {
    name: "Linked List Problems",
    problems: [
      "Reverse Linked List",
      "Merge Two Sorted Lists",
      "Palindrome Linked List",
      "Remove Nth Node From End of List",
      "Delete Node in a Linked List",
      "Linked List Cycle",
      "Add Two Numbers",
      "Odd Even Linked List",
      "Intersection of Two Linked Lists",
      "Merge k Sorted Lists",
      "Copy List with Random Pointer",
    ],
  },
  treeGraph: {
    name: "Tree/Graph Problems",
    problems: [
      "Maximum Depth of Binary Tree",
      "Validate Binary Search Tree",
      "Binary Tree Level Order Traversal",
      "Symmetric Tree",
      "Convert Sorted Array to Binary Search Tree",
      "Binary Tree Inorder Traversal",
      "Word Ladder",
      "Serialize and Deserialize Binary Tree",
      "Course Schedule II",
      "Lowest Common Ancestor of Binary Tree",
      "Binary Tree Maximum Path Sum",
      "Alien Dictionary",
    ],
  },
  design: {
    name: "Design Problems",
    problems: ["Min Stack", "LRU Cache"],
  },
  dp: {
    name: "Dynamic Programming Problems",
    problems: ["Climbing Stairs", "Longest Common Subsequence", "Edit Distance", "Regular Expression Matching"],
  },
  backtracking: {
    name: "Backtracking Problems",
    problems: [
      "Letter Combinations of a Phone Number",
      "Subsets",
      "Permutations",
      "Generate Parentheses",
      "Combination Sum",
      "Word Search",
      "N-Queens",
      "Sudoku Solver",
      "Word Search II",
      "Palindrome Partitioning",
      "Restore IP Addresses",
    ],
  },
  math: {
    name: "Math Problems",
    problems: ["Fizz Buzz", "Pow(x, n)", "Sqrt(x)"],
  },
  sortingSearching: {
    name: "Sorting & Searching Problems",
    problems: ["Merge Sorted Array", "Kth Largest Element in Array", "Search in Rotated Sorted Array", "Median of Two Sorted Arrays"],
  },
  others: {
    name: "Others Problems",
    problems: ["Valid Parentheses"],
  },
};
