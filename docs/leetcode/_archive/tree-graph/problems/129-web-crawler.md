---
layout: page
title: "Web Crawler"
difficulty: Medium
category: Tree-Graph
tags: [String, Depth-First Search, Breadth-First Search, Interactive]
leetcode_url: "https://leetcode.com/problems/web-crawler"
---

# Web Crawler / Trình Duyệt Web

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS/DFS + Hostname Extraction
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như người thám hiểm chỉ được đi trong cùng một tỉnh — bắt đầu từ một địa chỉ, bạn tìm tất cả địa chỉ trong cùng "domain" (hostname). Mỗi khi đến một trang mới, bạn thu thập thêm địa chỉ chưa thăm trong cùng tỉnh.

**Pattern Recognition:**

- Signal: "explore graph" + "only visit same-domain URLs" → **BFS/DFS with visited set**
- Extract hostname = everything between `http://` and the next `/`
- Constraint: only follow links with same hostname; avoid revisiting

**Visual:**

```
startUrl = "http://news.yahoo.com/news/topics/"
hostname  = "news.yahoo.com"

BFS:
  visit "http://news.yahoo.com/news/topics/"
    → links: ["http://news.yahoo.com/news/topics/sports/",
              "http://finance.yahoo.com/"]  ← different hostname, skip
  visit "http://news.yahoo.com/news/topics/sports/"
    → links: ["http://news.yahoo.com/news/sports/"]
  ...

Result: all unique news.yahoo.com URLs
```

## Problem Description

Given a `startUrl` and an `HtmlParser` interface with method `getUrls(url): string[]`, crawl all pages within the **same hostname** as `startUrl` (determined by `http://hostname/...`). Return all visited URLs in any order.

Example 1: `startUrl="http://news.yahoo.com/news/topics/"` → all `news.yahoo.com` pages
Example 2: `startUrl="http://news.yahoo.com/us"` → only pages reachable with same hostname

## 📝 Interview Tips

1. **Clarify**: "Hostname trích xuất như thế nào? `http://hostname/...` → split by `/` lấy index 2" / URL format
2. **BFS vs DFS**: "BFS dễ hơn cho web crawl — tránh stack overflow với DFS cho graph lớn" / BFS preferred
3. **Visited set**: "Dùng Set tránh crawl lại — thêm vào visited TRƯỚC khi enqueue" / Add before enqueue
4. **Concurrency**: "Follow-up: parallel crawling? → Thread pool + synchronized visited set" / Multi-threaded
5. **Edge cases**: "startUrl không có sub-path: `http://a.com` — hostname=`a.com`" / Handle no trailing slash
6. **Complexity**: "Time O(N) where N = reachable pages | Space O(N) for visited set"

## Solutions

```typescript
// Interface as defined by LeetCode
interface HtmlParser {
  getUrls(url: string): string[];
}

/** Helper: Extract hostname from URL
 * "http://news.yahoo.com/path" → "news.yahoo.com"
 */
function getHostname(url: string): string {
  // Format: http://hostname/...  or  http://hostname
  const withoutProtocol = url.slice("http://".length);
  const slashIdx = withoutProtocol.indexOf("/");
  return slashIdx === -1 ? withoutProtocol : withoutProtocol.slice(0, slashIdx);
}

/** Solution 1: BFS — iterative, queue-based crawl
 * Time: O(N) | Space: O(N)
 */
function crawlBFS(startUrl: string, htmlParser: HtmlParser): string[] {
  const hostname = getHostname(startUrl);
  const visited = new Set<string>([startUrl]);
  const queue: string[] = [startUrl];

  while (queue.length > 0) {
    const url = queue.shift()!;
    for (const nextUrl of htmlParser.getUrls(url)) {
      if (!visited.has(nextUrl) && getHostname(nextUrl) === hostname) {
        visited.add(nextUrl);
        queue.push(nextUrl);
      }
    }
  }

  return [...visited];
}

/** Solution 2: DFS — recursive crawl
 * Time: O(N) | Space: O(N) call stack
 */
function crawlDFS(startUrl: string, htmlParser: HtmlParser): string[] {
  const hostname = getHostname(startUrl);
  const visited = new Set<string>([startUrl]);

  function dfs(url: string): void {
    for (const nextUrl of htmlParser.getUrls(url)) {
      if (!visited.has(nextUrl) && getHostname(nextUrl) === hostname) {
        visited.add(nextUrl);
        dfs(nextUrl);
      }
    }
  }

  dfs(startUrl);
  return [...visited];
}

/** Solution 3: BFS with early hostname check (optimized)
 * Time: O(N) | Space: O(N) — avoids repeated hostname extraction
 */
function crawl(startUrl: string, htmlParser: HtmlParser): string[] {
  const hostname = getHostname(startUrl);
  const visited = new Set<string>();
  visited.add(startUrl);

  // Use array as queue with head pointer — more efficient than shift()
  const queue: string[] = [startUrl];
  let head = 0;

  while (head < queue.length) {
    const url = queue[head++];
    for (const nextUrl of htmlParser.getUrls(url)) {
      // Check hostname before visited to short-circuit faster
      if (getHostname(nextUrl) === hostname && !visited.has(nextUrl)) {
        visited.add(nextUrl);
        queue.push(nextUrl);
      }
    }
  }

  return queue; // All visited URLs = queue contents
}

// Mock HtmlParser for testing
class MockParser implements HtmlParser {
  private graph: Map<string, string[]>;
  constructor(links: [string, string[]][]) {
    this.graph = new Map(links);
  }
  getUrls(url: string): string[] {
    return this.graph.get(url) ?? [];
  }
}

// Tests
const parser1 = new MockParser([
  [
    "http://news.yahoo.com/news/topics/",
    [
      "http://news.yahoo.com/news/topics/sports/",
      "http://news.yahoo.com/news/",
      "http://finance.yahoo.com/",
    ],
  ],
  ["http://news.yahoo.com/news/topics/sports/", ["http://news.yahoo.com/news/topics/"]],
  ["http://news.yahoo.com/news/", []],
  ["http://finance.yahoo.com/", []],
]);

const result1 = crawlBFS("http://news.yahoo.com/news/topics/", parser1).sort();
console.log(result1); // 3 news.yahoo.com URLs

const result2 = crawl("http://news.yahoo.com/news/topics/", parser1).sort();
console.log(result2); // same 3 URLs

console.log(getHostname("http://news.yahoo.com/path/to/page")); // "news.yahoo.com"
console.log(getHostname("http://a.b.com")); // "a.b.com"

const parser2 = new MockParser([
  ["http://a.com/", ["http://a.com/page1", "http://b.com/"]],
  ["http://a.com/page1", []],
  ["http://b.com/", []],
]);
console.log(crawlDFS("http://a.com/", parser2).sort()); // ["http://a.com/", "http://a.com/page1"]
```

## 🔗 Related Problems

| Problem                                                              | Relationship                                  |
| -------------------------------------------------------------------- | --------------------------------------------- |
| [Clone Graph](https://leetcode.com/problems/clone-graph)             | BFS/DFS graph traversal with visited tracking |
| [Word Ladder](https://leetcode.com/problems/word-ladder)             | BFS exploration with constraint filtering     |
| [Number of Islands](https://leetcode.com/problems/number-of-islands) | BFS/DFS flood fill pattern                    |
