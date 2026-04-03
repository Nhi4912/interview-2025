---
layout: page
title: "Web Crawler Multithreaded"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Concurrency]
leetcode_url: "https://leetcode.com/problems/web-crawler-multithreaded"
---

# Web Crawler Multithreaded / Trình Duyệt Web Đa Luồng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS + Concurrency
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như một đội thám tử — mỗi người được giao một địa chỉ URL cần kiểm tra. Họ làm việc song song, nhưng cần có danh sách chung "đã đến chỗ nào rồi" để không ai đến trùng. BFS tuần tự trước, rồi parallelize với Promise.all.

**Pattern Recognition:**

- Signal: "crawl graph" + "same hostname only" + "visited tracking" → **BFS with hostname filter**
- Key: Chỉ crawl URL cùng hostname với startUrl (trích hostname từ URL)
- Concurrency: Xử lý từng level BFS song song bằng `Promise.all`

**Visual:**

```
startUrl: "http://news.yahoo.com/news/foo.html"
hostname: "news.yahoo.com"

Level 0: [startUrl]
Level 1: getUrls(startUrl) → filter same host → [urlA, urlB]  ← parallel
Level 2: getUrls([urlA, urlB]) parallel → filter → [urlC, urlD]
         └── skip visited URLs
```

---

## Problem Description

Given a `startUrl` and an interface `HtmlParser` with `getUrls(url)` returning all URLs on a page, crawl all URLs under the same hostname as `startUrl`. Return all crawled URLs in any order (no duplicates). Multiple URLs can be fetched concurrently.

**Example:** `startUrl = "http://news.yahoo.com/news/foo.html"` — crawl only `news.yahoo.com` pages.

Constraints: `1 <= urls.length <= 1000`, all URLs use `http://` and have valid hostnames.

---

## 📝 Interview Tips

1. **Clarify**: "Có crawl subdomain không? same hostname hay same domain?" / Confirm exact hostname matching rules
2. **Hostname extract**: "`url.split('/')[2]`" / Extract hostname between `http://` and next `/`
3. **Visited set**: "Dùng Set để track visited tránh vòng lặp vô hạn" / Shared visited Set across all levels
4. **Concurrency**: "Promise.all để fetch song song từng level" / Use Promise.all for parallel fetching per BFS level
5. **Edge cases**: "startUrl không có link nào → trả về [startUrl]" / Handle pages with no outbound links
6. **Follow-up**: "Rate limiting? Nếu getUrls có thể fail?" / Add retry logic and respect rate limits in real systems

---

## Solutions

```typescript
// Interface provided by LeetCode
interface HtmlParser {
  getUrls(url: string): Promise<string[]>;
}

/**
 * Solution 1: Sequential BFS
 * Time: O(N) — N = total reachable URLs with same hostname
 * Space: O(N) — visited set + queue
 */
async function crawlSequential(startUrl: string, htmlParser: HtmlParser): Promise<string[]> {
  const hostname = startUrl.split("/")[2];
  const visited = new Set<string>([startUrl]);
  const queue = [startUrl];

  while (queue.length > 0) {
    const url = queue.shift()!;
    const urls = await htmlParser.getUrls(url);
    for (const next of urls) {
      if (!visited.has(next) && next.split("/")[2] === hostname) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return [...visited];
}

/**
 * Solution 2: Parallel BFS — fetch each BFS level concurrently
 * Time: O(N/W) amortized — W = parallelism width
 * Space: O(N) — visited set + frontier
 */
async function crawl(startUrl: string, htmlParser: HtmlParser): Promise<string[]> {
  const hostname = startUrl.split("/")[2];
  const visited = new Set<string>([startUrl]);
  let frontier = [startUrl];

  while (frontier.length > 0) {
    // Fetch all URLs in current frontier concurrently
    const results = await Promise.all(frontier.map((url) => htmlParser.getUrls(url)));
    const nextFrontier: string[] = [];
    for (const urls of results) {
      for (const url of urls) {
        if (!visited.has(url) && url.split("/")[2] === hostname) {
          visited.add(url);
          nextFrontier.push(url);
        }
      }
    }
    frontier = nextFrontier;
  }
  return [...visited];
}

// === Test (mock HtmlParser) ===
const mockParser: HtmlParser = {
  getUrls: async (url: string) => {
    const graph: Record<string, string[]> = {
      "http://news.yahoo.com/news/foo.html": [
        "http://news.yahoo.com/news/bar.html",
        "http://news.google.com/news/baz.html", // different host, skip
      ],
      "http://news.yahoo.com/news/bar.html": [],
    };
    return graph[url] ?? [];
  },
};
crawl("http://news.yahoo.com/news/foo.html", mockParser).then((r) => console.log(r.sort())); // ['http://news.yahoo.com/news/bar.html', 'http://news.yahoo.com/news/foo.html']
```

---

## 🔗 Related Problems

| Problem                                                                                          | Pattern             | Difficulty |
| ------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                                 | Topological Sort    | 🟡 Medium  |
| [Clone Graph](https://leetcode.com/problems/clone-graph)                                         | BFS graph traversal | 🟡 Medium  |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)                             | BFS/DFS components  | 🟡 Medium  |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                                         | BFS shortest path   | 🔴 Hard    |
| [All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target) | DFS all paths       | 🟡 Medium  |
