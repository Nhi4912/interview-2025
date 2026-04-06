---
layout: page
title: "Greedy Problems"
category: Greedy
description: "Curated Greedy problems for interview preparation"
total_problems: 11
---

# Greedy Problems / Bài Toán Tham Lam

> **Track**: Interview Prep | **Problems**: 11 curated
> **See also**: [Master Tracker](../00-master-tracker.md) | [Study Guide](../00-study-guide.md)

## 📋 Problem List / Danh Sách Bài Toán

| #   | Problem                                                                                                                                   | Difficulty | Pattern                    | Target | v2.0 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------- | ------ | ---- |
| 1   | [122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) — Mua bán cổ phiếu nhiều lần | 🟡 Medium  | Greedy Scan                | 15 min | ⬜   |
| 2   | [55. Jump Game](https://leetcode.com/problems/jump-game/) — Trò chơi nhảy (có thể đến cuối không?)                                        | 🟡 Medium  | Greedy Max Reach           | 20 min | ⬜   |
| 3   | [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/) — Nhảy đến cuối với ít bước nhất                                          | 🟡 Medium  | Greedy BFS Level           | 20 min | ⬜   |
| 4   | [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) — Xóa ít nhất để không chồng chéo              | 🟡 Medium  | Interval Greedy (End Sort) | 20 min | ⬜   |
| 5   | [452. Minimum Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) — Bắn ít mũi tên nhất  | 🟡 Medium  | Interval Overlap           | 20 min | ⬜   |
| 6   | [763. Partition Labels](https://leetcode.com/problems/partition-labels/) — Chia chuỗi thành phần không chung ký tự                        | 🟡 Medium  | Last Occurrence Greedy     | 20 min | ⬜   |
| 7   | [1029. Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/) — Điều phối nhân viên 2 thành phố                         | 🟡 Medium  | Sort by Cost Diff          | 20 min | ⬜   |
| 8   | [134. Gas Station](https://leetcode.com/problems/gas-station/) — Trạm xăng: tìm điểm xuất phát hợp lệ                                     | 🟡 Medium  | Circular Greedy Scan       | 25 min | ⬜   |
| 9   | [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/) — Lập lịch tác vụ với cooldown                                       | 🟡 Medium  | Frequency Greedy           | 25 min | ⬜   |
| 10  | [406. Queue Reconstruction by Height](https://leetcode.com/problems/queue-reconstruction-by-height/) — Xếp hàng theo chiều cao            | 🟡 Medium  | Sort + Insert              | 25 min | ⬜   |
| 11  | [135. Candy](https://leetcode.com/problems/candy/) — Phân kẹo theo điểm xếp hạng                                                          | 🔴 Hard    | Two-Pass Greedy            | 30 min | ⬜   |

### Legend / Chú thích

- ✅ v2.0 migrated (Tier 1) | ⬜ v1.0 format (pending upgrade)
- 🟢 Easy | 🟡 Medium | 🔴 Hard

---

## 📊 Patterns Covered / Các Kỹ Thuật

- **Greedy Scan** _(Quét Tham Lam)_: Best Time to Buy Stock II — cộng mọi đoạn tăng liên tiếp
- **Greedy Max Reach** _(Tầm Với Tối Đa)_: Jump Game — theo dõi điểm xa nhất có thể đạt
- **Greedy BFS Level** _(BFS Theo Tầng)_: Jump Game II — coi mỗi jump như một BFS level
- **Interval Greedy** _(Lịch Biểu Khoảng)_: Non-overlapping Intervals, Minimum Arrows — sắp xếp theo điểm kết thúc
- **Last Occurrence** _(Xuất Hiện Cuối)_: Partition Labels — mở rộng window tới vị trí cuối của ký tự
- **Sort by Diff** _(Sắp Xếp Theo Hiệu)_: Two City Scheduling — ưu tiên lựa chọn tiết kiệm nhất
- **Circular Scan** _(Quét Vòng Tròn)_: Gas Station — nếu tổng ≥ 0 thì có nghiệm, bắt đầu từ điểm reset
- **Frequency Greedy** _(Tần Suất Tham Lam)_: Task Scheduler — điền tác vụ phổ biến nhất trước
- **Two-Pass Greedy** _(Hai Lượt Tham Lam)_: Candy — quét trái→phải rồi phải→trái

---

## 🗺️ Study Order / Thứ Tự Học

**Tuần 1 — Nền tảng (Foundation):**

1. #122 Best Time to Buy Stock II → greedy đơn giản nhất, tư duy "thu lợi mỗi bước"
2. #55 Jump Game → greedy reach, bài kinh điển
3. #45 Jump Game II → nâng cấp #55, đếm số bước

**Tuần 2 — Khoảng (Intervals):**

4. #435 Non-overlapping Intervals → học interval greedy chuẩn
5. #452 Minimum Arrows → biến thể interval overlap
6. #763 Partition Labels → greedy với last occurrence

**Tuần 3 — Nâng cao (Advanced):**

7. #1029 Two City Scheduling → greedy với sắp xếp theo hiệu chi phí
8. #134 Gas Station → circular + greedy scan
9. #621 Task Scheduler → greedy tần suất + công thức
10. #406 Queue Reconstruction by Height → sort phức tạp + insert
11. #135 Candy → two-pass greedy, bài khó nhất nhóm

---

## 💡 Key Insights / Điểm Mấu Chốt

| Pattern             | Core Idea / Ý Tưởng Cốt Lõi                                                |
| ------------------- | -------------------------------------------------------------------------- |
| Interval Scheduling | Sắp theo **end time** → chọn tham lam các khoảng kết thúc sớm nhất         |
| Jump Game           | Duy trì `maxReach`; nếu `i > maxReach` → không thể đến                     |
| Gas Station         | Nếu `sum(gas - cost) ≥ 0` thì chắc có nghiệm; reset `start` khi `tank < 0` |
| Task Scheduler      | `result = max(tasks, (maxFreq-1)*(n+1) + countMax)`                        |
| Two-Pass Greedy     | Xây dựng greedy từ hai hướng rồi kết hợp (ví dụ: Candy)                    |
