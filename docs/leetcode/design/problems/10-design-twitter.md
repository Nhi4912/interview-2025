---
layout: page
title: "Design Twitter"
difficulty: Medium
category: Design
tags: [Design, Hash Table, Heap]
leetcode_url: "https://leetcode.com/problems/design-twitter/"
---

# Design Twitter / Thiết Kế Twitter

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap Merge + OOP Design
> **Frequency**: 📘 Tier 3
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese)**: Mỗi user có một cuốn nhật ký tweets (mới nhất ở cuối). Khi xem feed, bạn mở tất cả nhật ký của người mình follow đến trang cuối, rồi mỗi lần chọn trang mới nhất trong số đó. Đó chính là k-way merge với max-heap.

**Pattern Recognition**: "Top K từ nhiều danh sách đã sắp xếp" → **k-way merge**. Đây là pattern của LC 23 (Merge K Sorted Lists) ẩn dưới dạng OOP. Luôn nêu điều này với interviewer.

**ASCII Visual**:

```
User 1 tweets: [(t=0, id=5), (t=3, id=9)]   ← newest at end
User 2 tweets: [(t=1, id=6)]
Following[1] = {2}

getNewsFeed(1): init heap with newest tweet per user
  Max-heap: [(-3,9,u1,idx=1), (-1,6,u2,idx=0)]

Pop (-3,9,u1): result=[9], push prev from u1 → (-0,5,u1,idx=0)
Pop (-1,6,u2): result=[9,6], no more from u2
Pop ( 0,5,u1): result=[9,6,5]          → return [9,6,5]
```

## Problem Description

Implement: `postTweet(userId, tweetId)`, `getNewsFeed(userId)` (10 most recent from self + followed), `follow(followerId, followeeId)`, `unfollow(followerId, followeeId)`.

**Example**:

```
postTweet(1,5)        → getNewsFeed(1) = [5]
follow(1,2)           → postTweet(2,6)
getNewsFeed(1) = [6,5] → unfollow(1,2)
getNewsFeed(1) = [5]
```

**Constraints**: `1 ≤ userId, tweetId ≤ 500`, ≤ 3×10⁴ calls.

## 📝 Interview Tips

- **Nhận diện pattern**: Đây là LC 23 "Merge K Sorted Lists" dưới dạng OOP — luôn nêu điều này.
- **Heap merge**: "Top 10 from K users' sorted tweet lists" = classic k-way merge pattern.
- **Global timestamp**: Dùng biến `time` toàn cục tăng dần để so sánh thứ tự tweet across users.
- **Self-follow**: User luôn thấy tweet của chính mình — include `userId` vào candidates khi build heap.
- **Scale follow-up**: Fan-out on write (precompute feed on post, fast read) vs fan-out on read (merge at query, slow read, simple write). Twitter dùng hybrid.

## Solutions

```typescript
/**

- Design Twitter — LeetCode #355
-
- HashMap stores each user's tweets as [(timestamp, tweetId), ...] (newest last).
- getNewsFeed uses sorted-array heap simulation for k-way merge.
-
- Time: O(1) post/follow/unfollow, O(F·T log F·T) getNewsFeed (F=following, T=tweets)
- Space: O(total tweets + follow edges)
  _/
  class Twitter {
  private time = 0;
  /** userId → list of [timestamp, tweetId], oldest first _/
  private tweets = new Map<number, [number, number][]>();
  /*_ userId → Set of followeeIds _/
  private following = new Map<number, Set<number>>();

postTweet(userId: number, tweetId: number): void {
if (!this.tweets.has(userId)) this.tweets.set(userId, []);
this.tweets.get(userId)!.push([this.time++, tweetId]);
}

/**

- Return 10 most recent tweetIds from user + everyone they follow.
- Trả về 10 tweet gần nhất của user + người đang follow.
-
- Each user contributes tweets in reverse-chronological order.
- Simulate max-heap via min-heap on negated timestamps.
- heap entry: [negTimestamp, tweetId, userId, listIndex]
  */
  getNewsFeed(userId: number): number[] {
  const candidates = new Set([userId, ...(this.following.get(userId) ?? [])]);


    // Heap: [negTimestamp, tweetId, uid, index] — sorted ascending by negTs
    const heap: [number, number, number, number][] = [];
    for (const uid of candidates) {
      const list = this.tweets.get(uid);
      if (list && list.length > 0) {
        const idx = list.length - 1;
        heap.push([-list[idx][0], list[idx][1], uid, idx]);
      }
    }
    heap.sort((a, b) => a[0] - b[0]);

    const result: number[] = [];
    while (heap.length > 0 && result.length < 10) {
      const [, tweetId, uid, idx] = heap.shift()!;
      result.push(tweetId);
      if (idx > 0) {
        const list = this.tweets.get(uid)!;
        heap.push([-list[idx - 1][0], list[idx - 1][1], uid, idx - 1]);
        heap.sort((a, b) => a[0] - b[0]);
      }
    }
    return result;

}

follow(followerId: number, followeeId: number): void {
if (!this.following.has(followerId)) this.following.set(followerId, new Set());
this.following.get(followerId)!.add(followeeId);
}

unfollow(followerId: number, followeeId: number): void {
this.following.get(followerId)?.delete(followeeId);
}
}

// Inline tests — LeetCode example
const tw = new Twitter();
tw.postTweet(1, 5);
console.assert(tw.getNewsFeed(1).join(',') === '5', 'own tweet appears in feed');
tw.follow(1, 2);
tw.postTweet(2, 6);
console.assert(tw.getNewsFeed(1).join(',') === '6,5', 'most recent first; followed user included');
tw.unfollow(1, 2);
console.assert(tw.getNewsFeed(1).join(',') === '5', 'unfollowed user removed from feed');

// User sees own tweets even without explicit follow
tw.postTweet(1, 9);
console.assert(tw.getNewsFeed(1)[0] === 9, 'most recent own tweet is first');
```

## 🔗 Related Problems

- [LC 23 — Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) — core k-way merge pattern
- [LC 295 — Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) — heap-based design
- [LC 146 — LRU Cache](https://leetcode.com/problems/lru-cache/) — OOP design with time-ordering
- [LC 380 — Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1/) — multi-structure design
