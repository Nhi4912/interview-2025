# Design Twitter / Thiết kế Twitter

> **Track**: Shared | **Difficulty**: 🟡 Medium
> **LeetCode**: #355 | **Pattern**: Heap + OOP Design
> **Category**: Design

## Problem / Đề bài

**English**: Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in the user's news feed. Implement the `Twitter` class with: `postTweet(userId, tweetId)`, `getNewsFeed(userId)` (returns 10 most recent tweet IDs from the user and people they follow), `follow(followerId, followeeId)`, and `unfollow(followerId, followeeId)`.

**Vietnamese**: Thiết kế phiên bản đơn giản của Twitter gồm các thao tác: đăng tweet, follow/unfollow người dùng khác, và xem 10 tweet gần nhất trong news feed (bao gồm tweet của bản thân và những người mình đang follow). Cần cài đặt 4 method: `postTweet`, `getNewsFeed`, `follow`, `unfollow`.

**Example**:
```
twitter = Twitter()
twitter.postTweet(1, 5)       // User 1 posts tweet id=5
twitter.getNewsFeed(1)        // Returns [5]
twitter.follow(1, 2)          // User 1 follows user 2
twitter.postTweet(2, 6)       // User 2 posts tweet id=6
twitter.getNewsFeed(1)        // Returns [6, 5] — most recent first
twitter.unfollow(1, 2)        // User 1 unfollows user 2
twitter.getNewsFeed(1)        // Returns [5]
```

**Constraints**: `1 <= userId, tweetId <= 500`, at most 3×10⁴ total calls, a user always follows themselves implicitly for the feed.

---

## Approach / Hướng giải

### Pattern nhận dạng / Pattern recognition

Bài này có hai phần: (1) data modeling — lưu tweets và follow relationships; (2) merge k sorted lists — lấy 10 tweet mới nhất từ nhiều user. Khi thấy "top K from multiple sorted sources", nghĩ ngay đến **min-heap / max-heap merge**.

When you see "get most recent N items from multiple users", recognize this as a **k-way merge** problem — the same pattern as merging k sorted linked lists.

### Key Insight / Ý tưởng chính

Assign a global timestamp (incrementing counter) to each tweet. Each user has their own list of tweets (sorted by time, newest last). For `getNewsFeed`, use a **max-heap** keyed on timestamp to efficiently pull the most recent tweet across all followed users, similar to merging k sorted lists.

---

## Solutions / Các cách giải

### Solution 1: HashMap + Max-Heap Merge — O(N log K) time, O(N) space ✅ Recommended

**Idea**: Store each user's tweets in a list with a global timestamp. On `getNewsFeed`, initialize the heap with the latest tweet from each followed user, then pop and optionally push the next tweet from that user's list.

**Ý tưởng**: Lưu tweet của mỗi user trong một danh sách kèm timestamp toàn cục. Khi `getNewsFeed`, khởi tạo max-heap với tweet mới nhất của mỗi người đang follow, rồi lần lượt pop ra và đẩy tweet kế tiếp của người đó vào heap (pattern merge k sorted lists).

**Algorithm**:
1. Maintain a global `time` counter (increments with each tweet).
2. `postTweet(userId, tweetId)`: append `(time++, tweetId)` to `tweets[userId]`.
3. `follow(followerId, followeeId)`: add `followeeId` to `following[followerId]` set.
4. `unfollow(followerId, followeeId)`: remove from that set.
5. `getNewsFeed(userId)`:
   a. Build candidate set = `following[userId]` ∪ `{userId}`.
   b. For each candidate, push `(−timestamp, tweetId, userId, index)` into a min-heap (negate timestamp to simulate max-heap).
   c. Pop up to 10 items; after each pop, push the next older tweet from that same user if it exists.
   d. Return collected tweetIds.

**Pseudocode**:
```
class Twitter:
    time = 0
    tweets = defaultdict(list)      // userId -> [(timestamp, tweetId), ...]
    following = defaultdict(set)    // userId -> set of followeeIds

    function postTweet(userId, tweetId):
        tweets[userId].append((time, tweetId))
        time += 1

    function follow(followerId, followeeId):
        following[followerId].add(followeeId)

    function unfollow(followerId, followeeId):
        following[followerId].discard(followeeId)

    function getNewsFeed(userId):
        heap = []
        candidates = following[userId] ∪ {userId}

        for each uid in candidates:
            if tweets[uid] is not empty:
                idx = last index of tweets[uid]
                t, tid = tweets[uid][idx]
                heap.push((-t, tid, uid, idx))
        heapify(heap)

        result = []
        while heap is not empty and len(result) < 10:
            neg_t, tid, uid, idx = heap.pop()
            result.append(tid)
            if idx - 1 >= 0:
                t2, tid2 = tweets[uid][idx - 1]
                heap.push((-t2, tid2, uid, idx - 1))

        return result
```

**Visual**:
```
User 1 tweets (oldest→newest): [(t=0, id=5), (t=3, id=9)]
User 2 tweets (oldest→newest): [(t=1, id=6)]
User 3 tweets (oldest→newest): [(t=2, id=7)]

getNewsFeed(user1) — follows: {2, 3}
Initial heap (max by timestamp):
  [-3, id=9, u1, idx=1]
  [-1, id=6, u2, idx=0]
  [-2, id=7, u3, idx=0]

Step 1: pop (-3, id=9, u1, idx=1) → result=[9]
        push next from u1: (-0, id=5, u1, idx=0)
        heap: [(-2,7,u3), (-1,6,u2), (0,5,u1)]

Step 2: pop (-2, id=7, u3, idx=0) → result=[9,7]
        no more tweets from u3

Step 3: pop (-1, id=6, u2, idx=0) → result=[9,7,6]
Step 4: pop ( 0, id=5, u1, idx=0) → result=[9,7,6,5]

Final: [9, 7, 6, 5]
```

**Complexity**:
- Time: O(N log K) for getNewsFeed — N = up to 10 pops, K = number of followed users; O(1) for post/follow/unfollow
- Space: O(T + U) — T = total tweets stored, U = total follow relationships

---

### Solution 2: Brute Force Collect + Sort — O(F·T log F·T) time, O(F·T) space

**Idea**: Collect all tweets from the user and all followed users into one list, sort by timestamp descending, return the first 10.

**Algorithm**:
1. Gather all `(timestamp, tweetId)` pairs from all followed users + self.
2. Sort descending by timestamp.
3. Return first 10 tweetIds.

**Complexity**:
- Time: O(F·T log F·T) where F = following count, T = tweets per user
- Space: O(F·T) for the collected list

---

## Comparison / So sánh

| Solution | Time (getNewsFeed) | Space | Notes |
|----------|--------------------|-------|-------|
| Heap Merge | O(10 log K) ≈ O(log K) | O(T + U) | Recommended — scales well |
| Brute Sort | O(F·T log F·T) | O(F·T) | Simpler code, slow for large feeds |

---

## Interview Tips / Mẹo phỏng vấn

- **Key point**: The heap merge approach is the same pattern as "Merge K Sorted Lists" (LC 23) — always recognize this connection.
- **Edge cases**: User follows themselves (handle by always including self); unfollow a user not currently followed (no-op); `getNewsFeed` when user has no tweets and follows no one (return empty list).
- **Follow-up**: How would you scale this to millions of users? (Fan-out on write vs fan-out on read, caching, pre-computed feeds.)

---

## Related Problems / Bài liên quan

- LC 23 — Merge K Sorted Lists (core heap merge pattern)
- LC 295 — Find Median from Data Stream (heap design)
- LC 146 — LRU Cache (design with data structures)
