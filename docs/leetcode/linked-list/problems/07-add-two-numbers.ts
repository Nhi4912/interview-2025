/**
 * 2. Add Two Numbers
 *
 * Problem:
 * You are given two non-empty linked lists representing two non-negative integers.
 * The digits are stored in reverse order, and each of their nodes contains a single digit.
 * Add the two numbers and return the sum as a linked list.
 *
 * You may assume the two numbers do not contain any leading zero, except the number 0 itself.
 *
 * Example:
 * Input: l1 = [2,4,3], l2 = [5,6,4]
 * Output: [7,0,8]
 * Explanation: 342 + 465 = 807.
 *
 * Input: l1 = [0], l2 = [0]
 * Output: [0]
 *
 * Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
 * Output: [8,9,9,9,0,0,0,1]
 *
 * LeetCode: https://leetcode.com/problems/add-two-numbers/
 */

// Definition for singly-linked list
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

/**
 * Solution 1: Iterative Addition (Optimal)
 *
 * Approach:
 * - Add digits from both lists simultaneously
 * - Handle carry and create new nodes
 * - Use dummy head for easier list construction
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;

    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10);

    current.next = new ListNode(sum % 10);
    current = current.next;

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return dummy.next;
}

/**
 * Solution 2: Recursive Approach
 *
 * Approach:
 * - Use recursion to add digits
 * - Pass carry as parameter
 * - Build result list recursively
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n)) - recursion stack
 */
function addTwoNumbersRecursive(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  function add(
    l1: ListNode | null,
    l2: ListNode | null,
    carry: number
  ): ListNode | null {
    if (!l1 && !l2 && carry === 0) {
      return null;
    }

    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;

    const sum = val1 + val2 + carry;
    const newCarry = Math.floor(sum / 10);

    const node = new ListNode(sum % 10);
    node.next = add(l1?.next || null, l2?.next || null, newCarry);

    return node;
  }

  return add(l1, l2, 0);
}

/**
 * Solution 3: Using Stack
 *
 * Approach:
 * - Convert lists to numbers, add them, then convert back
 * - Use stack to handle large numbers
 * - More intuitive but less efficient for large numbers
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
function addTwoNumbersStack(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  function listToNumber(head: ListNode | null): number {
    let num = 0;
    let multiplier = 1;
    let current = head;

    while (current) {
      num += current.val * multiplier;
      multiplier *= 10;
      current = current.next;
    }

    return num;
  }

  function numberToList(num: number): ListNode | null {
    if (num === 0) return new ListNode(0);

    const dummy = new ListNode(0);
    let current = dummy;

    while (num > 0) {
      const digit = num % 10;
      current.next = new ListNode(digit);
      current = current.next;
      num = Math.floor(num / 10);
    }

    return dummy.next;
  }

  const num1 = listToNumber(l1);
  const num2 = listToNumber(l2);
  const sum = num1 + num2;

  return numberToList(sum);
}

/**
 * Solution 4: Using Array
 *
 * Approach:
 * - Convert lists to arrays, add arrays, then convert back
 * - More explicit digit-by-digit handling
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
function addTwoNumbersArray(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  function listToArray(head: ListNode | null): number[] {
    const arr: number[] = [];
    let current = head;

    while (current) {
      arr.push(current.val);
      current = current.next;
    }

    return arr;
  }

  function arrayToList(arr: number[]): ListNode | null {
    if (arr.length === 0) return null;

    const dummy = new ListNode(0);
    let current = dummy;

    for (const digit of arr) {
      current.next = new ListNode(digit);
      current = current.next;
    }

    return dummy.next;
  }

  const arr1 = listToArray(l1);
  const arr2 = listToArray(l2);
  const maxLen = Math.max(arr1.length, arr2.length);

  const result: number[] = [];
  let carry = 0;

  for (let i = 0; i < maxLen || carry; i++) {
    const val1 = i < arr1.length ? arr1[i] : 0;
    const val2 = i < arr2.length ? arr2[i] : 0;

    const sum = val1 + val2 + carry;
    result.push(sum % 10);
    carry = Math.floor(sum / 10);
  }

  return arrayToList(result);
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create an Adder class
 * - Encapsulate the addition logic
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
class NumberAdder {
  private l1: ListNode | null;
  private l2: ListNode | null;

  constructor(l1: ListNode | null, l2: ListNode | null) {
    this.l1 = l1;
    this.l2 = l2;
  }

  add(): ListNode | null {
    const dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;
    let list1 = this.l1;
    let list2 = this.l2;

    while (list1 || list2 || carry) {
      const val1 = list1 ? list1.val : 0;
      const val2 = list2 ? list2.val : 0;

      const sum = val1 + val2 + carry;
      carry = Math.floor(sum / 10);

      current.next = new ListNode(sum % 10);
      current = current.next;

      if (list1) list1 = list1.next;
      if (list2) list2 = list2.next;
    }

    return dummy.next;
  }

  getLists(): { l1: ListNode | null; l2: ListNode | null } {
    return { l1: this.l1, l2: this.l2 };
  }
}

function addTwoNumbersClass(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const adder = new NumberAdder(l1, l2);
  return adder.add();
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield digits
 * - Memory efficient for large numbers
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(1)
 */
function* addTwoNumbersGenerator(
  l1: ListNode | null,
  l2: ListNode | null
): Generator<number> {
  let carry = 0;
  let list1 = l1;
  let list2 = l2;

  while (list1 || list2 || carry) {
    const val1 = list1 ? list1.val : 0;
    const val2 = list2 ? list2.val : 0;

    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10);

    yield sum % 10;

    if (list1) list1 = list1.next;
    if (list2) list2 = list2.next;
  }
}

function addTwoNumbersWithGenerator(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  for (const digit of addTwoNumbersGenerator(l1, l2)) {
    current.next = new ListNode(digit);
    current = current.next;
  }

  return dummy.next;
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
function addTwoNumbersFunctional(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  function addDigits(
    l1: ListNode | null,
    l2: ListNode | null,
    carry: number
  ): ListNode | null {
    if (!l1 && !l2 && carry === 0) return null;

    const val1 = l1?.val || 0;
    const val2 = l2?.val || 0;
    const sum = val1 + val2 + carry;

    return new ListNode(
      sum % 10,
      addDigits(l1?.next || null, l2?.next || null, Math.floor(sum / 10))
    );
  }

  return addDigits(l1, l2, 0);
}

/**
 * Solution 8: Using Two Pointers
 *
 * Approach:
 * - Use two pointers to traverse both lists
 * - More explicit pointer manipulation
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
function addTwoNumbersTwoPointers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;
  let p1 = l1;
  let p2 = l2;

  while (p1 || p2 || carry) {
    const val1 = p1 ? p1.val : 0;
    const val2 = p2 ? p2.val : 0;

    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10);

    current.next = new ListNode(sum % 10);
    current = current.next;

    if (p1) p1 = p1.next;
    if (p2) p2 = p2.next;
  }

  return dummy.next;
}

/**
 * Solution 9: Using String Conversion
 *
 * Approach:
 * - Convert lists to strings, add strings, then convert back
 * - Handle large numbers as strings
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
function addTwoNumbersString(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  function listToString(head: ListNode | null): string {
    let str = "";
    let current = head;

    while (current) {
      str = current.val + str; // Reverse order
      current = current.next;
    }

    return str || "0";
  }

  function stringToList(str: string): ListNode | null {
    const dummy = new ListNode(0);
    let current = dummy;

    for (let i = str.length - 1; i >= 0; i--) {
      current.next = new ListNode(parseInt(str[i]));
      current = current.next;
    }

    return dummy.next;
  }

  function addStrings(num1: string, num2: string): string {
    let result = "";
    let carry = 0;
    let i = num1.length - 1;
    let j = num2.length - 1;

    while (i >= 0 || j >= 0 || carry) {
      const digit1 = i >= 0 ? parseInt(num1[i]) : 0;
      const digit2 = j >= 0 ? parseInt(num2[j]) : 0;

      const sum = digit1 + digit2 + carry;
      result = (sum % 10) + result;
      carry = Math.floor(sum / 10);

      i--;
      j--;
    }

    return result;
  }

  const str1 = listToString(l1);
  const str2 = listToString(l2);
  const sumStr = addStrings(str1, str2);

  return stringToList(sumStr);
}

/**
 * Solution 10: Using BigInt (for very large numbers)
 *
 * Approach:
 * - Use BigInt for handling very large numbers
 * - Convert lists to BigInt, add, then convert back
 *
 * Time Complexity: O(max(m, n))
 * Space Complexity: O(max(m, n))
 */
function addTwoNumbersBigInt(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  function listToBigInt(head: ListNode | null): bigint {
    let num = 0n;
    let multiplier = 1n;
    let current = head;

    while (current) {
      num += BigInt(current.val) * multiplier;
      multiplier *= 10n;
      current = current.next;
    }

    return num;
  }

  function bigIntToList(num: bigint): ListNode | null {
    if (num === 0n) return new ListNode(0);

    const dummy = new ListNode(0);
    let current = dummy;

    while (num > 0n) {
      const digit = Number(num % 10n);
      current.next = new ListNode(digit);
      current = current.next;
      num = num / 10n;
    }

    return dummy.next;
  }

  const num1 = listToBigInt(l1);
  const num2 = listToBigInt(l2);
  const sum = num1 + num2;

  return bigIntToList(sum);
}

// Helper function to create a linked list from array
function createLinkedList(values: number[]): ListNode | null {
  if (values.length === 0) return null;

  const head = new ListNode(values[0]);
  let current = head;

  for (let i = 1; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next;
  }

  return head;
}

// Helper function to convert linked list to array
function listToArray(head: ListNode | null): number[] {
  const arr: number[] = [];
  let current = head;

  while (current) {
    arr.push(current.val);
    current = current.next;
  }

  return arr;
}

// Test cases
function testAddTwoNumbers() {
  console.log("=== Testing Add Two Numbers ===\n");

  const testCases = [
    {
      l1: [2, 4, 3],
      l2: [5, 6, 4],
      expected: [7, 0, 8],
      description: "Basic addition",
    },
    {
      l1: [0],
      l2: [0],
      expected: [0],
      description: "Zero addition",
    },
    {
      l1: [9, 9, 9, 9, 9, 9, 9],
      l2: [9, 9, 9, 9],
      expected: [8, 9, 9, 9, 0, 0, 0, 1],
      description: "Large numbers with carry",
    },
    {
      l1: [1, 2, 3],
      l2: [4, 5],
      expected: [5, 7, 3],
      description: "Different lengths",
    },
    {
      l1: [1],
      l2: [9, 9],
      expected: [0, 0, 1],
      description: "Single digit with carry",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`l1: [${testCase.l1.join(", ")}]`);
    console.log(`l2: [${testCase.l2.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    const list1 = createLinkedList(testCase.l1);
    const list2 = createLinkedList(testCase.l2);

    // Test Solution 1 (Iterative)
    const result1 = addTwoNumbers(list1, list2);
    const arr1 = listToArray(result1);
    console.log(
      `Solution 1 (Iterative): [${arr1.join(", ")}] ${
        JSON.stringify(arr1) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Recursive)
    const result2 = addTwoNumbersRecursive(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr2 = listToArray(result2);
    console.log(
      `Solution 2 (Recursive): [${arr2.join(", ")}] ${
        JSON.stringify(arr2) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Stack)
    const result3 = addTwoNumbersStack(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr3 = listToArray(result3);
    console.log(
      `Solution 3 (Stack): [${arr3.join(", ")}] ${
        JSON.stringify(arr3) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Array)
    const result4 = addTwoNumbersArray(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr4 = listToArray(result4);
    console.log(
      `Solution 4 (Array): [${arr4.join(", ")}] ${
        JSON.stringify(arr4) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = addTwoNumbersClass(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr5 = listToArray(result5);
    console.log(
      `Solution 5 (Class): [${arr5.join(", ")}] ${
        JSON.stringify(arr5) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = addTwoNumbersWithGenerator(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr6 = listToArray(result6);
    console.log(
      `Solution 6 (Generator): [${arr6.join(", ")}] ${
        JSON.stringify(arr6) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = addTwoNumbersFunctional(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr7 = listToArray(result7);
    console.log(
      `Solution 7 (Functional): [${arr7.join(", ")}] ${
        JSON.stringify(arr7) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Two Pointers)
    const result8 = addTwoNumbersTwoPointers(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr8 = listToArray(result8);
    console.log(
      `Solution 8 (Two Pointers): [${arr8.join(", ")}] ${
        JSON.stringify(arr8) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (String)
    const result9 = addTwoNumbersString(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr9 = listToArray(result9);
    console.log(
      `Solution 9 (String): [${arr9.join(", ")}] ${
        JSON.stringify(arr9) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (BigInt)
    const result10 = addTwoNumbersBigInt(
      createLinkedList(testCase.l1),
      createLinkedList(testCase.l2)
    );
    const arr10 = listToArray(result10);
    console.log(
      `Solution 10 (BigInt): [${arr10.join(", ")}] ${
        JSON.stringify(arr10) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Iterative", func: addTwoNumbers },
    { name: "Recursive", func: addTwoNumbersRecursive },
    { name: "Stack", func: addTwoNumbersStack },
    { name: "Array", func: addTwoNumbersArray },
    { name: "Class", func: addTwoNumbersClass },
    { name: "Generator", func: addTwoNumbersWithGenerator },
    { name: "Functional", func: addTwoNumbersFunctional },
    { name: "Two Pointers", func: addTwoNumbersTwoPointers },
    { name: "String", func: addTwoNumbersString },
    { name: "BigInt", func: addTwoNumbersBigInt },
  ];

  // Create test cases
  const smallCase = {
    l1: createLinkedList([1, 2, 3]),
    l2: createLinkedList([4, 5, 6]),
  };
  const mediumCase = {
    l1: createLinkedList(Array.from({ length: 100 }, (_, i) => i % 10)),
    l2: createLinkedList(Array.from({ length: 100 }, (_, i) => (i + 5) % 10)),
  };
  const largeCase = {
    l1: createLinkedList(Array.from({ length: 1000 }, (_, i) => i % 10)),
    l2: createLinkedList(Array.from({ length: 1000 }, (_, i) => (i + 5) % 10)),
  };

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase.l1, testCase.l2);
      const end = performance.now();

      const resultLength = listToArray(result).length;
      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (length: ${resultLength})`
      );
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testAddTwoNumbers();
// performanceComparison();

export {
  addTwoNumbers,
  addTwoNumbersRecursive,
  addTwoNumbersStack,
  addTwoNumbersArray,
  addTwoNumbersClass,
  addTwoNumbersWithGenerator,
  addTwoNumbersFunctional,
  addTwoNumbersTwoPointers,
  addTwoNumbersString,
  addTwoNumbersBigInt,
  NumberAdder,
  addTwoNumbersGenerator,
  ListNode,
  createLinkedList,
  listToArray,
  testAddTwoNumbers,
  performanceComparison,
};
