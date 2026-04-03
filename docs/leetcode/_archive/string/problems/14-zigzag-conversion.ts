/**
 * 6. ZigZag Conversion
 *
 * Problem:
 * The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this:
 * (you may want to display this pattern in a fixed font for better legibility)
 *
 * P   A   H   N
 * A P L S I I G
 * Y   I   R
 *
 * And then read line by line: "PAHNAPLSIIGYIR"
 *
 * Write the code that will take a string and make this conversion given a number of rows:
 *
 * string convert(string s, int numRows);
 *
 * Example:
 * Input: s = "PAYPALISHIRING", numRows = 3
 * Output: "PAHNAPLSIIGYIR"
 *
 * Input: s = "PAYPALISHIRING", numRows = 4
 * Output: "PINALSIGYAHRPI"
 * Explanation:
 * P     I    N
 * A   L S  I G
 * Y A   H R
 * P     I
 *
 * LeetCode: https://leetcode.com/problems/zigzag-conversion/
 */

/**
 * Solution 1: Row-by-Row (Optimal)
 *
 * Approach:
 * - Use array of strings to represent each row
 * - Traverse the string and add characters to appropriate rows
 * - Use direction flag to change direction at boundaries
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convert(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  const rows: string[] = new Array(numRows).fill("");
  let currentRow = 0;
  let direction = 1; // 1 for down, -1 for up

  for (const char of s) {
    rows[currentRow] += char;

    if (currentRow === 0) {
      direction = 1;
    } else if (currentRow === numRows - 1) {
      direction = -1;
    }

    currentRow += direction;
  }

  return rows.join("");
}

/**
 * Solution 2: Using Array of Arrays
 *
 * Approach:
 * - Use 2D array to store characters
 * - More explicit matrix representation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convertArray(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  const matrix: string[][] = Array(numRows)
    .fill(null)
    .map(() => []);
  let currentRow = 0;
  let direction = 1;

  for (const char of s) {
    matrix[currentRow].push(char);

    if (currentRow === 0) {
      direction = 1;
    } else if (currentRow === numRows - 1) {
      direction = -1;
    }

    currentRow += direction;
  }

  return matrix.map((row) => row.join("")).join("");
}

/**
 * Solution 3: Using Map
 *
 * Approach:
 * - Use Map to store row-indexed characters
 * - More flexible data structure
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convertMap(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  const rowMap = new Map<number, string>();
  let currentRow = 0;
  let direction = 1;

  for (const char of s) {
    rowMap.set(currentRow, (rowMap.get(currentRow) || "") + char);

    if (currentRow === 0) {
      direction = 1;
    } else if (currentRow === numRows - 1) {
      direction = -1;
    }

    currentRow += direction;
  }

  return Array.from({ length: numRows }, (_, i) => rowMap.get(i) || "").join(
    ""
  );
}

/**
 * Solution 4: Using Object
 *
 * Approach:
 * - Use object for row-indexed storage
 * - More familiar for JavaScript developers
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convertObject(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  const rows: { [key: number]: string } = {};
  let currentRow = 0;
  let direction = 1;

  for (const char of s) {
    rows[currentRow] = (rows[currentRow] || "") + char;

    if (currentRow === 0) {
      direction = 1;
    } else if (currentRow === numRows - 1) {
      direction = -1;
    }

    currentRow += direction;
  }

  return Array.from({ length: numRows }, (_, i) => rows[i] || "").join("");
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a ZigZagConverter class
 * - Encapsulate the conversion logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class ZigZagConverter {
  private s: string;
  private numRows: number;

  constructor(s: string, numRows: number) {
    this.s = s;
    this.numRows = numRows;
  }

  convert(): string {
    if (this.numRows === 1 || this.numRows >= this.s.length) return this.s;

    const rows: string[] = new Array(this.numRows).fill("");
    let currentRow = 0;
    let direction = 1;

    for (const char of this.s) {
      rows[currentRow] += char;

      if (currentRow === 0) {
        direction = 1;
      } else if (currentRow === this.numRows - 1) {
        direction = -1;
      }

      currentRow += direction;
    }

    return rows.join("");
  }

  getString(): string {
    return this.s;
  }

  getNumRows(): number {
    return this.numRows;
  }
}

function convertClass(s: string, numRows: number): string {
  const converter = new ZigZagConverter(s, numRows);
  return converter.convert();
}

/**
 * Solution 6: Using Generator
 *
 * Approach:
 * - Use generator to yield characters by row
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function* convertGenerator(
  s: string,
  numRows: number
): Generator<{ row: number; char: string }> {
  if (numRows === 1 || numRows >= s.length) {
    for (let i = 0; i < s.length; i++) {
      yield { row: 0, char: s[i] };
    }
    return;
  }

  let currentRow = 0;
  let direction = 1;

  for (const char of s) {
    yield { row: currentRow, char };

    if (currentRow === 0) {
      direction = 1;
    } else if (currentRow === numRows - 1) {
      direction = -1;
    }

    currentRow += direction;
  }
}

function convertWithGenerator(s: string, numRows: number): string {
  const rows: string[] = new Array(numRows).fill("");

  for (const { row, char } of convertGenerator(s, numRows)) {
    rows[row] += char;
  }

  return rows.join("");
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convertFunctional(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  function buildRows(
    chars: string[],
    currentRow: number = 0,
    direction: number = 1,
    rows: string[] = new Array(numRows).fill("")
  ): string[] {
    if (chars.length === 0) return rows;

    const [char, ...remainingChars] = chars;
    rows[currentRow] += char;

    const newDirection =
      currentRow === 0 ? 1 : currentRow === numRows - 1 ? -1 : direction;
    const newRow = currentRow + newDirection;

    return buildRows(remainingChars, newRow, newDirection, rows);
  }

  return buildRows(s.split("")).join("");
}

/**
 * Solution 8: Using Recursion
 *
 * Approach:
 * - Use recursion to build the result
 * - Base case: empty string
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function convertRecursive(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  function convertHelper(
    chars: string[],
    currentRow: number,
    direction: number,
    rows: string[]
  ): string {
    if (chars.length === 0) {
      return rows.join("");
    }

    const [char, ...remainingChars] = chars;
    rows[currentRow] += char;

    let newDirection = direction;
    let newRow = currentRow;

    if (currentRow === 0) {
      newDirection = 1;
    } else if (currentRow === numRows - 1) {
      newDirection = -1;
    }

    newRow = currentRow + newDirection;

    return convertHelper(remainingChars, newRow, newDirection, rows);
  }

  return convertHelper(s.split(""), 0, 1, new Array(numRows).fill(""));
}

/**
 * Solution 9: Using Two Pointers
 *
 * Approach:
 * - Use two pointers to track position
 * - More explicit position tracking
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convertTwoPointers(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  const rows: string[] = new Array(numRows).fill("");
  let rowIndex = 0;
  let charIndex = 0;
  let direction = 1;

  while (charIndex < s.length) {
    rows[rowIndex] += s[charIndex];
    charIndex++;

    if (rowIndex === 0) {
      direction = 1;
    } else if (rowIndex === numRows - 1) {
      direction = -1;
    }

    rowIndex += direction;
  }

  return rows.join("");
}

/**
 * Solution 10: Using Bit Manipulation (for fun)
 *
 * Approach:
 * - Use bit manipulation for direction tracking
 * - More compact representation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convertBitManipulation(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  const rows: string[] = new Array(numRows).fill("");
  let currentRow = 0;
  let direction = 1; // 1 for down, -1 for up

  for (let i = 0; i < s.length; i++) {
    rows[currentRow] += s[i];

    // Use bit manipulation for direction change
    const isAtTop = currentRow === 0;
    const isAtBottom = currentRow === numRows - 1;

    if (isAtTop || isAtBottom) {
      direction = direction ^ 0xfffffffe; // Flip sign using XOR
    }

    currentRow += direction;
  }

  return rows.join("");
}

/**
 * Solution 11: Using String Building
 *
 * Approach:
 * - Build string character by character
 * - More explicit string manipulation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function convertStringBuilding(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

  const rowStrings: string[] = [];
  for (let i = 0; i < numRows; i++) {
    rowStrings.push("");
  }

  let currentRow = 0;
  let direction = 1;

  for (const char of s) {
    rowStrings[currentRow] = rowStrings[currentRow] + char;

    if (currentRow === 0) {
      direction = 1;
    } else if (currentRow === numRows - 1) {
      direction = -1;
    }

    currentRow += direction;
  }

  return rowStrings.join("");
}

// Test cases
function testConvert() {
  console.log("=== Testing ZigZag Conversion ===\n");

  const testCases = [
    {
      s: "PAYPALISHIRING",
      numRows: 3,
      expected: "PAHNAPLSIIGYIR",
      description: "Basic case",
    },
    {
      s: "PAYPALISHIRING",
      numRows: 4,
      expected: "PINALSIGYAHRPI",
      description: "4 rows case",
    },
    {
      s: "A",
      numRows: 1,
      expected: "A",
      description: "Single character",
    },
    {
      s: "AB",
      numRows: 1,
      expected: "AB",
      description: "Single row",
    },
    {
      s: "ABC",
      numRows: 2,
      expected: "ACB",
      description: "Two rows",
    },
    {
      s: "ABCDEF",
      numRows: 3,
      expected: "AEBDFC",
      description: "Three rows",
    },
    {
      s: "ABCDEFGH",
      numRows: 4,
      expected: "AGBFHCE",
      description: "Four rows",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: s = "${testCase.s}", numRows = ${testCase.numRows}`);
    console.log(`Expected: "${testCase.expected}"\n`);

    // Test Solution 1 (Row-by-Row)
    const result1 = convert(testCase.s, testCase.numRows);
    console.log(
      `Solution 1 (Row-by-Row): "${result1}" ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Array)
    const result2 = convertArray(testCase.s, testCase.numRows);
    console.log(
      `Solution 2 (Array): "${result2}" ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Map)
    const result3 = convertMap(testCase.s, testCase.numRows);
    console.log(
      `Solution 3 (Map): "${result3}" ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Object)
    const result4 = convertObject(testCase.s, testCase.numRows);
    console.log(
      `Solution 4 (Object): "${result4}" ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = convertClass(testCase.s, testCase.numRows);
    console.log(
      `Solution 5 (Class): "${result5}" ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = convertWithGenerator(testCase.s, testCase.numRows);
    console.log(
      `Solution 6 (Generator): "${result6}" ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = convertFunctional(testCase.s, testCase.numRows);
    console.log(
      `Solution 7 (Functional): "${result7}" ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Recursive)
    const result8 = convertRecursive(testCase.s, testCase.numRows);
    console.log(
      `Solution 8 (Recursive): "${result8}" ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Two Pointers)
    const result9 = convertTwoPointers(testCase.s, testCase.numRows);
    console.log(
      `Solution 9 (Two Pointers): "${result9}" ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Bit Manipulation)
    const result10 = convertBitManipulation(testCase.s, testCase.numRows);
    console.log(
      `Solution 10 (Bit Manipulation): "${result10}" ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 11 (String Building)
    const result11 = convertStringBuilding(testCase.s, testCase.numRows);
    console.log(
      `Solution 11 (String Building): "${result11}" ${
        result11 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Row-by-Row", func: convert },
    { name: "Array", func: convertArray },
    { name: "Map", func: convertMap },
    { name: "Object", func: convertObject },
    { name: "Class", func: convertClass },
    { name: "Generator", func: convertWithGenerator },
    { name: "Functional", func: convertFunctional },
    { name: "Recursive", func: convertRecursive },
    { name: "Two Pointers", func: convertTwoPointers },
    { name: "Bit Manipulation", func: convertBitManipulation },
    { name: "String Building", func: convertStringBuilding },
  ];

  // Create test cases
  const smallCase = { s: "ABC", numRows: 2 };
  const mediumCase = { s: "PAYPALISHIRING", numRows: 4 };
  const largeCase = { s: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", numRows: 5 };

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase.s, testCase.numRows);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms ("${result}")`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testConvert();
// performanceComparison();

export {
  convert,
  convertArray,
  convertMap,
  convertObject,
  convertClass,
  convertWithGenerator,
  convertFunctional,
  convertRecursive,
  convertTwoPointers,
  convertBitManipulation,
  convertStringBuilding,
  ZigZagConverter,
  convertGenerator,
  testConvert,
  performanceComparison,
};
