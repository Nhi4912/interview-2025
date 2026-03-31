---
layout: page
title: "The Time When the Network Becomes Idle"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/the-time-when-the-network-becomes-idle"
---

# The Time When the Network Becomes Idle / Thời Điểm Mạng Trở Nên Nhàn Rỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS + Math
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Mỗi server giống một nhân viên gửi yêu cầu đến sếp (node 0) và đợi phản hồi. Nhân viên `i` gửi lại yêu cầu mới mỗi `patience[i]` giây nếu chưa nhận được phản hồi. Khi nào mạng "ngủ"? Khi tất cả phản hồi đã đến và không còn ai gửi thêm. Cần tính: roundtrip = `2*dist`, số lần gửi lại, và lần cuối cùng tin nhắn "về đến".

**Pattern Recognition:**

- BFS from node 0 to get shortest distances to all servers
- For each server i: roundtrip `r = 2*dist[i]`, resends every `p = patience[i]`
- Last message sent at time: `floor((r-1)/p) * p` — last resend before reply arrives
- That message arrives back at: `floor((r-1)/p) * p + r`
- Network idle at: max over all servers + 1

**Visual:**

```
edges=[[0,1],[1,2]], patience=[0,2,1]

BFS: dist[0]=0, dist[1]=1, dist[2]=2
Server 1: r=2, p=2
  Resends at: 0 (first send)
  Last resend before reply at time 2: floor((2-1)/2)*2=0 → last send at 0
  Last reply arrives: 0+2 = 2 → idle after time 2

Server 2: r=4, p=1
  Resends at: 0,1,2,3 (floor((4-1)/1)*1=3 → last resend at t=3)
  Last reply arrives: 3+4 = 7 → idle after time 7

Answer = max(2,7) + 1 = 8 ✅
```

## Problem Description

A network has `n` servers (0-indexed). Server 0 is the master. Given undirected `edges` and `patience[i]` for servers 1..n-1, each server sends a message to server 0 at t=0 and every `patience[i]` seconds until it gets a reply. Messages travel optimally. Return earliest time when the network becomes idle (no in-flight messages).

**Example 1:** `edges=[[0,1],[1,2]], patience=[0,2,1]` → `8`
**Example 2:** `edges=[[0,1],[0,2],[1,2]], patience=[0,10,10]` → `3`

**Constraints:** `2 <= n <= 10^5`, `patience.length == n`, `patience[0] == 0`, `1 <= patience[i] <= 10^5`

## 📝 Interview Tips

1. **Clarify**: Node 0 không gửi tin nhắn (patience[0]=0). Khi mạng "idle" = không còn tin nhắn đang truyền / Node 0 never sends; idle = no messages in flight.
2. **Approach**: BFS để tính dist, rồi công thức toán cho mỗi server / BFS for distances, then math formula per server.
3. **Edge cases**: Server với `patience[i] >= roundtrip` → chỉ gửi 1 lần, không gửi lại / If patience >= roundtrip, only 1 message ever sent.
4. **Optimize**: BFS O(V+E) + O(n) math = O(V+E) total / BFS is the bottleneck.
5. **Test**: Server gần (dist=1) với patience nhỏ sẽ gửi nhiều lần / Server close to 0 with small patience sends many times.
6. **Follow-up**: Nếu edges có trọng số? → Dijkstra thay BFS / Weighted edges → Dijkstra instead of BFS.

## Solutions

```typescript
/** Solution 1: BFS + Math formula
 * Time: O(V + E) | Space: O(V + E)
 */
function networkBecomesIdle(edges: number[][], patience: number[]): number {
  const n = patience.length;
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // BFS from node 0 to get shortest distances
  const dist = new Array(n).fill(-1);
  dist[0] = 0;
  const queue: number[] = [0];
  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const neighbor of graph[node]) {
      if (dist[neighbor] === -1) {
        dist[neighbor] = dist[node] + 1;
        queue.push(neighbor);
      }
    }
  }

  let ans = 0;
  for (let i = 1; i < n; i++) {
    const r = 2 * dist[i]; // round-trip time
    const p = patience[i]; // resend interval

    // Last resend: last time before reply arrives that server sends again
    // Server sends at 0, p, 2p, ..., floor((r-1)/p)*p
    const lastSend = Math.floor((r - 1) / p) * p;

    // Last message's reply arrives at: lastSend + r
    // Network idle 1 second after: lastSend + r + 1
    ans = Math.max(ans, lastSend + r + 1);
  }

  return ans;
}

/** Solution 2: Simulation (brute force — for verification only)
 * Time: O(maxTime * n) | Space: O(maxTime * n)
 * Only practical for small inputs
 */
function networkBecomesIdleSim(edges: number[][], patience: number[]): number {
  const n = patience.length;
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const dist = new Array(n).fill(Infinity);
  dist[0] = 0;
  const q: number[] = [0];
  while (q.length > 0) {
    const node = q.shift()!;
    for (const nb of graph[node]) {
      if (dist[nb] === Infinity) {
        dist[nb] = dist[node] + 1;
        q.push(nb);
      }
    }
  }

  // For each server: compute idle time directly from formula
  let ans = 0;
  for (let i = 1; i < n; i++) {
    const r = 2 * dist[i];
    const p = patience[i];
    // If p >= r, no resend (reply arrives before next send)
    if (p >= r) {
      ans = Math.max(ans, r + 1);
    } else {
      const lastSend = Math.floor((r - 1) / p) * p;
      ans = Math.max(ans, lastSend + r + 1);
    }
  }
  return ans;
}

// Test cases
console.log(
  networkBecomesIdle(
    [
      [0, 1],
      [1, 2],
    ],
    [0, 2, 1],
  ),
); // 8
console.log(
  networkBecomesIdle(
    [
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [0, 10, 10],
  ),
); // 3

console.log(
  networkBecomesIdleSim(
    [
      [0, 1],
      [1, 2],
    ],
    [0, 2, 1],
  ),
); // 8
console.log(
  networkBecomesIdleSim(
    [
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [0, 10, 10],
  ),
); // 3
```

## 🔗 Related Problems

| Problem                                                                                                                      | Relationship                                |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Network Delay Time](https://leetcode.com/problems/network-delay-time)                                                       | BFS/Dijkstra shortest path in network graph |
| [Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes) | Graph reachability analysis                 |
| [Count Unreachable Pairs of Nodes](https://leetcode.com/problems/count-unreachable-pairs-of-nodes-in-an-undirected-graph)    | BFS/Union Find for connected components     |
