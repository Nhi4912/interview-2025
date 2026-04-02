---
layout: page
title: "Time to Cross a Bridge"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/time-to-cross-a-bridge"
---

# time to cross a bridge

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hình dung một cây cầu một làn duy nhất nối hai bờ kho hàng. Công nhân phải sang phải để
lấy hộp rồi mang về trái. Quy tắc ưu tiên: "người chậm nhất" (tổng thời gian qua cầu cao
nhất) được đi trước — tránh chặn đường người nhanh. Ta dùng **4 heap**:

- `leftWait` / `rightWait`: người đang chờ ở bờ trái/phải (max-heap theo độ chậm)
- `leftWork` / `rightWork`: người đang làm việc trong kho (min-heap theo thời gian xong việc)

Tại mỗi thời điểm cầu rảnh: bờ phải ưu tiên trước → nếu không có ai bên phải thì bờ trái.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
n=2, k=2, time=[[1,1,1,1],[3,1,1,3]]  (worker0=ineff2, worker1=ineff6)

t=0:  leftWait=[1,0]  (sorted ineff desc: 6,2)
      Bridge free → send worker1 L→R  t=3,  rightWork=[(3+1,1)]=[(4,1)]
t=3:  leftWait=[0]  boxesLeft=1
      Bridge free → send worker0 L→R  t=4,  rightWork=[(4,1),(4+1,0)]=[(4,1),(5,0)]
t=4:  rightWork: (4,1) done → rightWait=[1]
      Bridge free → rightWait priority: send worker1 R→L  t=5  boxesDelivered=1  ans=5
      leftWork=[(5+3,1)]=[(8,1)]
t=5:  rightWork: (5,0) done → rightWait=[0]
      Bridge free → send worker0 R→L  t=6  boxesDelivered=2  ans=6
Return 6
```

---

## Problem Description

| Problem                                                                                         | Difficulty | Tags             |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [1834. Single-Threaded CPU](https://leetcode.com/problems/single-threaded-cpu/)                 | Medium     | Heap, Simulation |
| [2402. Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii/)                     | Hard       | Heap, Simulation |
| [1882. Process Tasks Using Servers](https://leetcode.com/problems/process-tasks-using-servers/) | Medium     | Heap, Simulation |
| [407. Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii/)            | Hard       | Heap, BFS        |

---

## 📝 Interview Tips

1. **Four queues, not two** — Separate "waiting" (ready to cross) from "working" (in warehouse); different priorities for each.
   _Bốn hàng đợi, không phải hai — Tách "đang chờ" (sẵn sàng qua cầu) khỏi "đang làm việc" (trong kho); ưu tiên khác nhau._

2. **Right bank priority** — Workers waiting on right always cross before workers waiting on left.
   _Bờ phải ưu tiên — Công nhân chờ bên phải luôn qua cầu trước công nhân chờ bên trái._

3. **Advance time to next event** — When no one is ready to cross, jump to earliest warehouse completion time.
   _Nhảy thời gian đến sự kiện tiếp theo — Khi không ai sẵn sàng qua cầu, nhảy đến thời điểm hoàn thành kho sớm nhất._

4. **Track boxes to send, not delivered** — Decrement `boxesLeft` when a worker crosses L→R; decrement `boxesDelivered` when crosses R→L.
   _Theo dõi hộp cần gửi, không phải đã giao — Giảm `boxesLeft` khi công nhân qua L→R; tăng `boxesDelivered` khi qua R→L._

5. **Answer = last R→L arrival** — Record `curTime` each time a worker finishes crossing R→L; the k-th one is the answer.
   _Đáp án = lần đến bờ trái cuối cùng — Ghi lại `curTime` mỗi khi công nhân qua xong R→L; lần thứ k là đáp án._

6. **Don't send extra workers L→R** — Once `boxesLeft == 0`, stop sending workers from left even if leftWait is non-empty.
   _Không gửi thêm công nhân L→R — Khi `boxesLeft == 0`, ngừng gửi từ trái dù leftWait không rỗng._

---

## Solutions


---

## 🔗 Related Problems

| Problem                                                                                         | Difficulty | Tags             |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [1834. Single-Threaded CPU](https://leetcode.com/problems/single-threaded-cpu/)                 | Medium     | Heap, Simulation |
| [2402. Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii/)                     | Hard       | Heap, Simulation |
| [1882. Process Tasks Using Servers](https://leetcode.com/problems/process-tasks-using-servers/) | Medium     | Heap, Simulation |
| [407. Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii/)            | Hard       | Heap, BFS        |
