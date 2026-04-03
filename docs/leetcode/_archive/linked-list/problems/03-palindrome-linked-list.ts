/**
 * 234. Palindrome Linked List
 *
 * Problem:
 * Given the head of a singly linked list, return true if it is a palindrome or false otherwise.
 *
 * Example:
 * Input: head = [1,2,2,1]
 * Output: true
 *
 * Input: head = [1,2]
 * Output: false
 *
 * LeetCode: https://leetcode.com/problems/palindrome-linked-list/
 */

// ListNode class definition
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Solution 1: Reverse Second Half (Optimal)
 *
 * Approach:
 * - Find middle of linked list using fast/slow pointers
 * - Reverse second half
 * - Compare first half with reversed second half
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isPalindrome(head: ListNode | null): boolean {
  if (!head || !head.next) return true;

  // Find middle using fast/slow pointers
  let slow = head;
  let fast = head;

  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // Reverse second half
  let secondHalf = reverseList(slow.next);
  let firstHalf = head;

  // Compare first half with reversed second half
  while (secondHalf) {
    if (firstHalf.val !== secondHalf.val) {
      return false;
    }
    firstHalf = firstHalf.next!;
    secondHalf = secondHalf.next;
  }

  return true;
}

/**
 * Solution 2: Using Array
 *
 * Approach:
 * - Convert linked list to array
 * - Use two pointers to check palindrome
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isPalindromeArray(head: ListNode | null): boolean {
  if (!head || !head.next) return true;

  const values: number[] = [];
  let current = head;

  while (current) {
    values.push(current.val);
    current = current.next;
  }

  // Check palindrome using two pointers
  let left = 0;
  let right = values.length - 1;

  while (left < right) {
    if (values[left] !== values[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

/**
 * Solution 3: Recursive Approach
 *
 * Approach:
 * - Use recursion to reach end of list
 * - Compare with front pointer during backtracking
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function isPalindromeRecursive(head: ListNode | null): boolean {
  let frontPointer = head;

  function recursivelyCheck(currentNode: ListNode | null): boolean {
    if (currentNode) {
      if (!recursivelyCheck(currentNode.next)) {
        return false;
      }
      if (currentNode.val !== frontPointer!.val) {
        return false;
      }
      frontPointer = frontPointer!.next;
    }
    return true;
  }

  return recursivelyCheck(head);
}

/**
 * Solution 4: Using Stack
 *
 * Approach:
 * - Push all elements to stack
 * - Pop and compare with original list
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isPalindromeStack(head: ListNode | null): boolean {
  if (!head || !head.next) return true;

  const stack: number[] = [];
  let current = head;

  // Push all elements to stack
  while (current) {
    stack.push(current.val);
    current = current.next;
  }

  // Pop and compare
  current = head;
  while (current) {
    if (current.val !== stack.pop()) {
      return false;
    }
    current = current.next;
  }

  return true;
}

/**
 * Solution 5: Using String Conversion
 *
 * Approach:
 * - Convert linked list to string
 * - Check if string is palindrome
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isPalindromeString(head: ListNode | null): boolean {
  if (!head || !head.next) return true;

  let str = "";
  let current = head;

  while (current) {
    str += current.val;
    current = current.next;
  }

  // Check if string is palindrome
  return str === str.split("").reverse().join("");
}

/**
 * Solution 6: Using Two Pointers with Reversal
 *
 * Approach:
 * - Find middle and reverse first half
 * - Compare reversed first half with second half
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isPalindromeTwoPointers(head: ListNode | null): boolean {
  if (!head || !head.next) return true;

  let prev: ListNode | null = null;
  let slow = head;
  let fast = head;

  // Find middle and reverse first half
  while (fast.next && fast.next.next) {
    fast = fast.next.next;

    // Reverse slow pointer
    const next = slow.next!;
    slow.next = prev;
    prev = slow;
    slow = next;
  }

  // Handle odd/even length
  let secondHalf = slow.next;
  if (fast.next) {
    // Even length
    slow.next = prev;
    prev = slow;
  } else {
    // Odd length
    slow.next = prev;
  }

  // Compare first half with second half
  while (prev && secondHalf) {
    if (prev.val !== secondHalf.val) {
      return false;
    }
    prev = prev.next;
    secondHalf = secondHalf.next;
  }

  return true;
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield values
 * - Compare values in reverse order
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function* listGenerator(head: ListNode | null): Generator<number> {
  let current = head;
  while (current) {
    yield current.val;
    current = current.next;
  }
}

function isPalindromeGenerator(head: ListNode | null): boolean {
  if (!head || !head.next) return true;

  const values = Array.from(listGenerator(head));
  const reversed = values.slice().reverse();

  return JSON.stringify(values) === JSON.stringify(reversed);
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a LinkedList class with palindrome checking
 * - More structured approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class LinkedList {
  head: ListNode | null;

  constructor(head: ListNode | null = null) {
    this.head = head;
  }

  isPalindrome(): boolean {
    return isPalindrome(this.head);
  }

  toArray(): number[] {
    const result: number[] = [];
    let current = this.head;

    while (current) {
      result.push(current.val);
      current = current.next;
    }

    return result;
  }
}

function isPalindromeClass(head: ListNode | null): boolean {
  const list = new LinkedList(head);
  return list.isPalindrome();
}

// Helper functions
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

function createLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;

  const head = new ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }

  return head;
}

function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;

  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

function printLinkedList(head: ListNode | null): string {
  return `[${linkedListToArray(head).join(" -> ")}]`;
}

// Test cases
function testPalindromeLinkedList() {
  console.log("=== Testing Palindrome Linked List ===\n");

  const testCases = [
    {
      input: [1, 2, 2, 1],
      expected: true,
      description: "Even length palindrome",
    },
    {
      input: [1, 2],
      expected: false,
      description: "Not a palindrome",
    },
    {
      input: [1, 2, 3, 2, 1],
      expected: true,
      description: "Odd length palindrome",
    },
    {
      input: [1],
      expected: true,
      description: "Single node",
    },
    {
      input: [],
      expected: true,
      description: "Empty list",
    },
    {
      input: [1, 1],
      expected: true,
      description: "Two same nodes",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: false,
      description: "Not a palindrome",
    },
    {
      input: [1, 2, 3, 3, 2, 1],
      expected: true,
      description: "Long palindrome",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${printLinkedList(createLinkedList(testCase.input))}`);
    console.log(`Expected: ${testCase.expected}\n`);

    const head = createLinkedList(testCase.input);

    // Test Solution 1 (Reverse Second Half)
    const result1 = isPalindrome(head);
    console.log(
      `Solution 1 (Reverse Second Half): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Array)
    const head2 = createLinkedList(testCase.input);
    const result2 = isPalindromeArray(head2);
    console.log(
      `Solution 2 (Array): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Recursive)
    const head3 = createLinkedList(testCase.input);
    const result3 = isPalindromeRecursive(head3);
    console.log(
      `Solution 3 (Recursive): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Stack)
    const head4 = createLinkedList(testCase.input);
    const result4 = isPalindromeStack(head4);
    console.log(
      `Solution 4 (Stack): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (String)
    const head5 = createLinkedList(testCase.input);
    const result5 = isPalindromeString(head5);
    console.log(
      `Solution 5 (String): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Two Pointers)
    const head6 = createLinkedList(testCase.input);
    const result6 = isPalindromeTwoPointers(head6);
    console.log(
      `Solution 6 (Two Pointers): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const head7 = createLinkedList(testCase.input);
    const result7 = isPalindromeGenerator(head7);
    console.log(
      `Solution 7 (Generator): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const head8 = createLinkedList(testCase.input);
    const result8 = isPalindromeClass(head8);
    console.log(
      `Solution 8 (Class): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Reverse Second Half", func: isPalindrome },
    { name: "Array", func: isPalindromeArray },
    { name: "Recursive", func: isPalindromeRecursive },
    { name: "Stack", func: isPalindromeStack },
    { name: "String", func: isPalindromeString },
    { name: "Two Pointers", func: isPalindromeTwoPointers },
    { name: "Generator", func: isPalindromeGenerator },
    { name: "Class", func: isPalindromeClass },
  ];

  // Create test lists
  const palindromeList = createLinkedList([1, 2, 3, 4, 5, 4, 3, 2, 1]);
  const nonPalindromeList = createLinkedList([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const lists = [
    { name: "Palindrome", list: palindromeList },
    { name: "Non-Palindrome", list: nonPalindromeList },
  ];

  lists.forEach(({ name, list }) => {
    console.log(`${name} List:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(list);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testPalindromeLinkedList();
// performanceComparison();

export {
  ListNode,
  isPalindrome,
  isPalindromeArray,
  isPalindromeRecursive,
  isPalindromeStack,
  isPalindromeString,
  isPalindromeTwoPointers,
  isPalindromeGenerator,
  isPalindromeClass,
  LinkedList,
  listGenerator,
  reverseList,
  createLinkedList,
  linkedListToArray,
  printLinkedList,
  testPalindromeLinkedList,
  performanceComparison,
};
