---
layout: page
title: "Design Browser History"
difficulty: Easy
category: Others
tags: [Others, Hash Table]
leetcode_url: "https://leetcode.com/problems/design-browser-history/"
---

# Design Browser History



## Problem Description

 *  * You have a browser of one tab where you start on the homepage and you can visit  * another url, get back in the history number of steps or move forward in the  * history number of steps.  * 

## Solutions

{% raw %}
/**
 * Design Browser History
 *
 * Problem: https://leetcode.com/problems/design-browser-history/
 *
 * You have a browser of one tab where you start on the homepage and you can visit
 * another url, get back in the history number of steps or move forward in the
 * history number of steps.
 *
 * Implement the BrowserHistory class:
 * - BrowserHistory(string homepage) Initializes the object with the homepage of the browser.
 * - void visit(string url) Visits url from the current page. It clears up all the
 *   forward history.
 * - string back(int steps) Move steps back in history. If you can only return x steps
 *   in the history and steps > x, you will return only x steps. Return the current
 *   url after moving back in history at most steps.
 * - string forward(int steps) Move steps forward in history. If you can only forward
 *   x steps in the history and steps > x, you will forward only x steps. Return the
 *   current url after forwarding in history at most steps.
 *
 * Example:
 * Input:
 * ["BrowserHistory","visit","visit","visit","back","back","forward","visit","forward","back","back"]
 * [["leetcode.com"],["google.com"],["facebook.com"],["youtube.com"],[1],[1],[1],["linkedin.com"],[2],[2],[7]]
 * Output: [null,null,null,null,"facebook.com","google.com","facebook.com",null,"linkedin.com","google.com","leetcode.com"]
 *
 * Explanation:
 * BrowserHistory browserHistory = new BrowserHistory("leetcode.com");
 * browserHistory.visit("google.com");       // You are in "leetcode.com". Visit "google.com"
 * browserHistory.visit("facebook.com");     // You are in "google.com". Visit "facebook.com"
 * browserHistory.visit("youtube.com");      // You are in "facebook.com". Visit "youtube.com"
 * browserHistory.back(1);                   // You are in "youtube.com", move back to "facebook.com" return "facebook.com"
 * browserHistory.back(1);                   // You are in "facebook.com", move back to "google.com" return "google.com"
 * browserHistory.forward(1);                // You are in "google.com", move forward to "facebook.com" return "facebook.com"
 * browserHistory.visit("linkedin.com");     // You are in "facebook.com". Visit "linkedin.com"
 * browserHistory.forward(2);                // You are in "linkedin.com", you cannot move forward any more steps.
 * browserHistory.back(2);                   // You are in "linkedin.com", move back two steps to "facebook.com" then to "google.com", return "google.com"
 * browserHistory.back(7);                   // You are in "google.com", you can move back only one step to "leetcode.com", return "leetcode.com"
 *
 * Constraints:
 * - 1 <= homepage.length <= 20
 * - 1 <= url.length <= 20
 * - 1 <= steps <= 100
 * - homepage and url consist of '.' or lower case English letters.
 * - At most 5000 calls will be made to visit, back, and forward.
 *
 * Solution Approaches:
 * 1. Array-based implementation with current position
 * 2. Stack-based implementation
 * 3. Doubly linked list implementation
 * 4. With additional features and statistics
 *
 * Time Complexity: O(1) for visit, O(steps) for back/forward
 * Space Complexity: O(n) where n is the number of visited URLs
 */

/**
 * BrowserHistory - Array-based Implementation
 *
 * BrowserHistory - Triển khai dựa trên Array
 *
 * This approach uses an array to store the history and a current position pointer
 */
class BrowserHistory {
  private history: string[];
  private currentIndex: number;

  constructor(homepage: string) {
    this.history = [homepage];
    this.currentIndex = 0;
  }

  /**
   * Visit a new URL
   * Truy cập một URL mới
   */
  visit(url: string): void {
    // Remove all forward history
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new URL
    this.history.push(url);
    this.currentIndex++;
  }

  /**
   * Move back in history
   * Di chuyển ngược trong lịch sử
   */
  back(steps: number): string {
    const newIndex = Math.max(0, this.currentIndex - steps);
    this.currentIndex = newIndex;
    return this.history[this.currentIndex];
  }

  /**
   * Move forward in history
   * Di chuyển tiến trong lịch sử
   */
  forward(steps: number): string {
    const newIndex = Math.min(
      this.history.length - 1,
      this.currentIndex + steps
    );
    this.currentIndex = newIndex;
    return this.history[this.currentIndex];
  }

  /**
   * Get current URL
   * Lấy URL hiện tại
   */
  getCurrentUrl(): string {
    return this.history[this.currentIndex];
  }

  /**
   * Get current position in history
   * Lấy vị trí hiện tại trong lịch sử
   */
  getCurrentPosition(): number {
    return this.currentIndex;
  }

  /**
   * Get total history size
   * Lấy tổng kích thước lịch sử
   */
  getHistorySize(): number {
    return this.history.length;
  }

  /**
   * Get the internal state for debugging
   * Lấy trạng thái nội bộ để debug
   */
  getState(): { history: string[]; currentIndex: number; currentUrl: string } {
    return {
      history: [...this.history],
      currentIndex: this.currentIndex,
      currentUrl: this.history[this.currentIndex],
    };
  }
}

/**
 * Alternative Implementation: Stack-based Approach
 *
 * Triển khai thay thế: Phương pháp dựa trên Stack
 */
class BrowserHistoryStack {
  private backStack: string[];
  private forwardStack: string[];
  private currentUrl: string;

  constructor(homepage: string) {
    this.backStack = [];
    this.forwardStack = [];
    this.currentUrl = homepage;
  }

  visit(url: string): void {
    // Push current URL to back stack
    this.backStack.push(this.currentUrl);

    // Clear forward stack
    this.forwardStack = [];

    // Set new current URL
    this.currentUrl = url;
  }

  back(steps: number): string {
    const actualSteps = Math.min(steps, this.backStack.length);

    for (let i = 0; i < actualSteps; i++) {
      // Push current URL to forward stack
      this.forwardStack.push(this.currentUrl);

      // Pop from back stack and set as current
      this.currentUrl = this.backStack.pop()!;
    }

    return this.currentUrl;
  }

  forward(steps: number): string {
    const actualSteps = Math.min(steps, this.forwardStack.length);

    for (let i = 0; i < actualSteps; i++) {
      // Push current URL to back stack
      this.backStack.push(this.currentUrl);

      // Pop from forward stack and set as current
      this.currentUrl = this.forwardStack.pop()!;
    }

    return this.currentUrl;
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  getBackStackSize(): number {
    return this.backStack.length;
  }

  getForwardStackSize(): number {
    return this.forwardStack.length;
  }
}

/**
 * Doubly Linked List Implementation
 *
 * Triển khai Doubly Linked List
 */
class HistoryNode {
  url: string;
  prev: HistoryNode | null;
  next: HistoryNode | null;

  constructor(url: string) {
    this.url = url;
    this.prev = null;
    this.next = null;
  }
}

class BrowserHistoryLinkedList {
  private head: HistoryNode;
  private current: HistoryNode;

  constructor(homepage: string) {
    this.head = new HistoryNode(homepage);
    this.current = this.head;
  }

  visit(url: string): void {
    // Create new node
    const newNode = new HistoryNode(url);

    // Link current node to new node
    this.current.next = newNode;
    newNode.prev = this.current;

    // Set new node as current
    this.current = newNode;
  }

  back(steps: number): string {
    for (let i = 0; i < steps && this.current.prev; i++) {
      this.current = this.current.prev;
    }

    return this.current.url;
  }

  forward(steps: number): string {
    for (let i = 0; i < steps && this.current.next; i++) {
      this.current = this.current.next;
    }

    return this.current.url;
  }

  getCurrentUrl(): string {
    return this.current.url;
  }

  /**
   * Get all URLs in history
   * Lấy tất cả URL trong lịch sử
   */
  getAllUrls(): string[] {
    const urls: string[] = [];
    let current = this.head;

    while (current) {
      urls.push(current.url);
      current = current.next!;
    }

    return urls;
  }
}

/**
 * Implementation with Statistics and Monitoring
 *
 * Triển khai với thống kê và giám sát
 */
class BrowserHistoryWithStats extends BrowserHistory {
  private visitCount: number;
  private backCount: number;
  private forwardCount: number;
  private operationHistory: Array<{
    operation: string;
    url?: string;
    steps?: number;
    timestamp: number;
  }>;

  constructor(homepage: string) {
    super(homepage);
    this.visitCount = 0;
    this.backCount = 0;
    this.forwardCount = 0;
    this.operationHistory = [];
  }

  visit(url: string): void {
    super.visit(url);
    this.visitCount++;

    this.operationHistory.push({
      operation: "visit",
      url,
      timestamp: Date.now(),
    });
  }

  back(steps: number): string {
    const result = super.back(steps);
    this.backCount++;

    this.operationHistory.push({
      operation: "back",
      steps,
      timestamp: Date.now(),
    });

    return result;
  }

  forward(steps: number): string {
    const result = super.forward(steps);
    this.forwardCount++;

    this.operationHistory.push({
      operation: "forward",
      steps,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Get browser statistics
   * Lấy thống kê trình duyệt
   */
  getStats(): {
    visitCount: number;
    backCount: number;
    forwardCount: number;
    totalOperations: number;
    averageStepsPerNavigation: number;
    recentActivity: Array<{
      operation: string;
      url?: string;
      steps?: number;
      timestamp: number;
    }>;
  } {
    const totalOperations =
      this.visitCount + this.backCount + this.forwardCount;

    // Calculate average steps per navigation
    let totalSteps = 0;
    let navigationCount = 0;

    for (const op of this.operationHistory) {
      if (op.operation === "back" || op.operation === "forward") {
        totalSteps += op.steps || 0;
        navigationCount++;
      }
    }

    const averageStepsPerNavigation =
      navigationCount > 0 ? totalSteps / navigationCount : 0;

    return {
      visitCount: this.visitCount,
      backCount: this.backCount,
      forwardCount: this.forwardCount,
      totalOperations,
      averageStepsPerNavigation,
      recentActivity: this.operationHistory.slice(-10), // Last 10 operations
    };
  }

  /**
   * Get navigation patterns
   * Lấy mẫu điều hướng
   */
  getNavigationPatterns(): {
    backToForwardRatio: number;
    mostVisitedUrls: Map<string, number>;
    averageSessionLength: number;
  } {
    const urlVisits = new Map<string, number>();
    let sessionCount = 0;
    let totalSessionLength = 0;

    for (const op of this.operationHistory) {
      if (op.operation === "visit" && op.url) {
        urlVisits.set(op.url, (urlVisits.get(op.url) || 0) + 1);
        sessionCount++;
      }
    }

    const backToForwardRatio =
      this.forwardCount > 0
        ? this.backCount / this.forwardCount
        : this.backCount;
    const averageSessionLength =
      sessionCount > 0 ? totalSessionLength / sessionCount : 0;

    return {
      backToForwardRatio,
      mostVisitedUrls: urlVisits,
      averageSessionLength,
    };
  }
}

/**
 * Implementation with Bookmarks and Favorites
 *
 * Triển khai với Bookmarks và Favorites
 */
class BrowserHistoryWithBookmarks extends BrowserHistory {
  private bookmarks: Set<string>;
  private favorites: Map<string, number>; // URL -> visit count

  constructor(homepage: string) {
    super(homepage);
    this.bookmarks = new Set();
    this.favorites = new Map();
  }

  visit(url: string): void {
    super.visit(url);

    // Update favorites count
    this.favorites.set(url, (this.favorites.get(url) || 0) + 1);
  }

  /**
   * Add current URL to bookmarks
   * Thêm URL hiện tại vào bookmarks
   */
  addBookmark(): boolean {
    const currentUrl = this.getCurrentUrl();
    if (this.bookmarks.has(currentUrl)) {
      return false; // Already bookmarked
    }

    this.bookmarks.add(currentUrl);
    return true;
  }

  /**
   * Remove current URL from bookmarks
   * Xóa URL hiện tại khỏi bookmarks
   */
  removeBookmark(): boolean {
    const currentUrl = this.getCurrentUrl();
    return this.bookmarks.delete(currentUrl);
  }

  /**
   * Check if current URL is bookmarked
   * Kiểm tra xem URL hiện tại có được bookmark không
   */
  isBookmarked(): boolean {
    return this.bookmarks.has(this.getCurrentUrl());
  }

  /**
   * Get all bookmarks
   * Lấy tất cả bookmarks
   */
  getBookmarks(): string[] {
    return Array.from(this.bookmarks);
  }

  /**
   * Get top visited URLs (favorites)
   * Lấy các URL được truy cập nhiều nhất
   */
  getTopVisitedUrls(count: number = 5): Array<{ url: string; visits: number }> {
    return Array.from(this.favorites.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([url, visits]) => ({ url, visits }));
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareBrowserHistoryImplementations(
  operations: Array<{
    type: "visit" | "back" | "forward";
    url?: string;
    steps?: number;
  }>
): void {
  console.log(
    "Browser History Implementation Performance Comparison / So sánh hiệu suất triển khai Browser History"
  );
  console.log("=".repeat(90));

  const implementations = [
    { name: "Array-based", history: new BrowserHistory("homepage.com") },
    { name: "Stack-based", history: new BrowserHistoryStack("homepage.com") },
    {
      name: "Linked List",
      history: new BrowserHistoryLinkedList("homepage.com"),
    },
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const op of operations) {
      switch (op.type) {
        case "visit":
          impl.history.visit(op.url!);
          break;
        case "back":
          impl.history.back(op.steps!);
          break;
        case "forward":
          impl.history.forward(op.steps!);
          break;
      }
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`  Current URL: ${impl.history.getCurrentUrl()}`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Browser History Tests / Kiểm thử Browser History");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const history1 = new BrowserHistory("leetcode.com");
  history1.visit("google.com");
  history1.visit("facebook.com");
  history1.visit("youtube.com");
  console.log(`back(1): ${history1.back(1)}`); // Expected: "facebook.com"
  console.log(`back(1): ${history1.back(1)}`); // Expected: "google.com"
  console.log(`forward(1): ${history1.forward(1)}`); // Expected: "facebook.com"
  history1.visit("linkedin.com");
  console.log(`forward(2): ${history1.forward(2)}`); // Expected: "linkedin.com"
  console.log(`back(2): ${history1.back(2)}`); // Expected: "google.com"
  console.log(`back(7): ${history1.back(7)}`); // Expected: "leetcode.com"

  // Test 2: Statistics tracking
  console.log("\nTest 2: Statistics tracking / Theo dõi thống kê");
  const statHistory = new BrowserHistoryWithStats("homepage.com");

  statHistory.visit("google.com");
  statHistory.visit("facebook.com");
  statHistory.back(1);
  statHistory.forward(1);
  statHistory.visit("youtube.com");
  statHistory.back(2);

  const stats = statHistory.getStats();
  console.log(`Visit count: ${stats.visitCount}`);
  console.log(`Back count: ${stats.backCount}`);
  console.log(`Forward count: ${stats.forwardCount}`);
  console.log(`Total operations: ${stats.totalOperations}`);
  console.log(
    `Average steps per navigation: ${stats.averageStepsPerNavigation.toFixed(
      2
    )}`
  );

  // Test 3: Bookmarks and favorites
  console.log("\nTest 3: Bookmarks and favorites / Bookmarks và favorites");
  const bookmarkHistory = new BrowserHistoryWithBookmarks("homepage.com");

  bookmarkHistory.visit("google.com");
  bookmarkHistory.addBookmark();
  bookmarkHistory.visit("facebook.com");
  bookmarkHistory.visit("google.com"); // Visit again
  bookmarkHistory.addBookmark();

  console.log(`Is current bookmarked: ${bookmarkHistory.isBookmarked()}`);
  console.log(`Bookmarks: [${bookmarkHistory.getBookmarks().join(", ")}]`);
  console.log(
    `Top visited: ${JSON.stringify(bookmarkHistory.getTopVisitedUrls(3))}`
  );

  // Test 4: State inspection
  console.log("\nTest 4: State inspection / Kiểm tra trạng thái");
  const stateHistory = new BrowserHistory("homepage.com");
  stateHistory.visit("google.com");
  stateHistory.visit("facebook.com");

  console.log("Current state:");
  console.log(stateHistory.getState());

  stateHistory.back(1);

  console.log("After back(1):");
  console.log(stateHistory.getState());

  // Test 5: Performance comparison
  console.log("\nTest 5: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "visit" as const, url: "google.com" },
    { type: "visit" as const, url: "facebook.com" },
    { type: "visit" as const, url: "youtube.com" },
    { type: "back" as const, steps: 1 },
    { type: "back" as const, steps: 1 },
    { type: "forward" as const, steps: 1 },
    { type: "visit" as const, url: "linkedin.com" },
    { type: "forward" as const, steps: 2 },
    { type: "back" as const, steps: 2 },
  ];

  compareBrowserHistoryImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  BrowserHistory,
  BrowserHistoryStack,
  BrowserHistoryLinkedList,
  BrowserHistoryWithStats,
  BrowserHistoryWithBookmarks,
  HistoryNode,
  compareBrowserHistoryImplementations,
  runTests,
};
{% endraw %}
