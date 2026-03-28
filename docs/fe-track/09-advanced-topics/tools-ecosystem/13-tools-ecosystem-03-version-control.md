# Version Control with Git / Kiểm Soát Phiên Bản Với Git

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tools & Ecosystem - Chapter 3 / Công Cụ & Hệ Sinh Thái - Chương 3
[Back to Table of Contents](../../00-table-of-contents.md)

---

## Tổng Quan / Overview
- Git không chỉ là bộ lệnh; nó là object database + DAG model cho lịch sử thay đổi.
- Team performance phụ thuộc mạnh vào branching strategy, review workflow, và CI integration.
- Cross-reference package/release dependencies: [Package Managers](./13-tools-ecosystem-02-package-managers.md).
- Cross-reference SDLC process: [SDLC and Practices](../../shared/05-software-engineering/03-sdlc-and-practices.md).

## 1) Git Internals / Nội Bộ Git
- **Blob:** Lưu nội dung file.
- **Tree:** Lưu cấu trúc thư mục và trỏ tới blobs/trees con.
- **Commit:** Lưu snapshot + metadata + parent references.
- **Tag:** Nhãn trỏ object, thường dùng cho release immutability.

### Refs và HEAD
- Branch thực chất là ref trỏ tới commit.
- `HEAD` thường trỏ branch hiện tại hoặc commit detached.
- Reflog lưu lịch sử di chuyển HEAD local, cực hữu ích khi recovery.

### DAG (Directed Acyclic Graph)
- Mỗi commit trỏ parent(s), tạo graph không chu trình.
- Merge commit có 2+ parents.
- Rebase tạo commit mới trên base mới, nên đổi SHA.

## 2) Branching Strategies
### Git Flow
- **Mô hình:** `main` + `develop` + feature/release/hotfix branches.
- **Phù hợp:** Release theo chu kỳ dài, quy trình nhiều cổng kiểm soát.
- **Đánh đổi:** Chi phí merge/conflict cao nếu branch sống lâu.

### GitHub Flow
- **Mô hình:** `main` luôn deployable, feature branch ngắn, PR merge liên tục.
- **Phù hợp:** SaaS continuous delivery.
- **Đánh đổi:** Yêu cầu CI mạnh và review discipline tốt.

### Trunk-based Development
- **Mô hình:** Merge nhánh nhỏ thường xuyên vào trunk.
- **Phù hợp:** Team mature, cần tốc độ tích hợp cao.
- **Đánh đổi:** Cần feature flags để tránh nhánh dài.

## 3) Merge vs Rebase
| Tiêu chí | Merge | Rebase |
|---|---|---|
| Lịch sử | Giữ topology thật | Tuyến tính, dễ đọc |
| Rủi ro | Thấp trên shared branches | Cao nếu rewrite branch đã chia sẻ |
| Use case | Tích hợp an toàn | Làm sạch lịch sử trước PR merge |

- Rule thực tế: có thể rebase local feature branch; tránh rebase public branch có nhiều collaborator.

## 4) Conflict Resolution
- Đọc context logic của cả hai phía trước khi chọn ours/theirs.
- Giải quyết theo semantic correctness, không theo “đỡ tốn công”.
- Chạy test/lint/typecheck sau resolve.
- Khi conflict phức tạp, pair debugging để giảm mất logic ngầm.

```bash
git status
git checkout --ours src/file.ts
git checkout --theirs src/file.ts
git add src/file.ts
git merge --continue
```

## 5) Advanced Git Commands
### Interactive Rebase
- Dùng `reword`, `squash`, `fixup`, `edit`, `drop` để tinh chỉnh commit history.

```bash
git rebase -i HEAD~8
```

### Cherry-pick
- Chọn commit cụ thể để backport hotfix mà không merge cả branch.

```bash
git cherry-pick <sha>
```

### Bisect
- Dùng binary search tìm commit gây bug regression.

```bash
git bisect start
git bisect bad
git bisect good <good-sha>
```

### Reflog
- Cứu commit bị “mất” sau reset/rebase nhầm.

```bash
git reflog
git checkout <sha-from-reflog>
```

## 6) Hooks: pre-commit, pre-push, commit-msg
- pre-commit: format/lint/test nhanh cho staged files.
- pre-push: test integration hoặc typecheck để chặn push lỗi rõ ràng.
- commit-msg: enforce Conventional Commits và link issue khi cần.
- Husky + lint-staged là bộ phổ biến triển khai hooks ổn định.

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["oxlint --fix", "git add"],
    "*.{md,json,yml,yaml}": ["prettier --write", "git add"]
  }
}
```

## 7) Monorepo Git Strategies
- Scoped commits theo package/domain để review và rollback dễ.
- CODEOWNERS để route reviewer đúng team phụ trách.
- Merge queue giảm race condition giữa nhiều PR đồng thời.
- Require status checks theo affected graph thay vì full suite mọi lúc.
- Giữ branch lifetime ngắn để giảm conflict và stale context.

## 8) Git LFS
- Git LFS thay file lớn bằng pointer trong repo và lưu binary ở storage riêng.
- Hữu ích với media, model ML, design sources lớn.
- Tránh history phình to khiến clone/fetch chậm kéo dài.

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

## 9) CI/CD Integration
- PR events trigger lint/test/build/security checks.
- Protected branches yêu cầu review + status checks pass.
- Tag-based releases tạo artifact immutable và rollback-friendly.
- Auto-changelog + semantic versioning từ conventional commits.
- Deployment approvals cho môi trường production nhạy cảm.

## 10) Code Review Workflow
- PR nhỏ, mục tiêu rõ, có test plan giúp review quality cao hơn.
- Reviewer nên tập trung correctness, maintainability, security, performance, clarity.
- Author nên trả lời comment bằng dữ kiện kỹ thuật và cập nhật docs khi cần.

### PR Template Gợi Ý
1. Context / Bối cảnh
2. What changed / Thay đổi chính
3. Test plan / Cách kiểm chứng
4. Risks / Rủi ro và fallback
5. Screenshots or logs

## 11) Conventional Commits & Changelog
- Prefix chuẩn: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `ci`, `chore`.
- Giúp tooling tự động tạo release notes và version bump logic.

```text
feat(auth): support passkey login
fix(api): honor Retry-After header for 429
perf(web): lazy-load heavy analytics module
```

## 12) Recovery & Incident Patterns
- **R1:** Reset nhầm commit quan trọng.
  - Hành động: Dùng reflog để tìm SHA và tạo recovery branch.
- **R2:** Merge sai vào main.
  - Hành động: Tạo revert commit thay vì rewrite public history.
- **R3:** Rebase conflict hỗn loạn.
  - Hành động: Abort rebase và chia nhỏ lại commits trước khi rebase lại.
- **R4:** Lộ secret trong commit.
  - Hành động: Rotate secret ngay, rewrite history theo policy, audit truy cập.
- **R5:** Force push nhầm protected branch.
  - Hành động: Khóa branch tạm thời, xác định base chuẩn, khôi phục từ remote backups.
- **R6:** Tag release sai artifact.
  - Hành động: Retire tag theo policy và phát hành tag mới có changelog sửa lỗi.

## 13) Git Command Reference (Interview Fast Recall)
- `git log --oneline --graph --decorate`: Xem topology commit trực quan.
- `git show <sha>`: Đọc nội dung commit cụ thể.
- `git blame <file>`: Truy dấu ai sửa dòng nào.
- `git reset --soft HEAD~1`: Bỏ commit gần nhất nhưng giữ changes staged.
- `git reset --hard HEAD~1`: Bỏ commit và discard local changes (cẩn thận).
- `git restore --staged <file>`: Unstage file đã add.
- `git stash push -m "msg"`: Tạm cất thay đổi đang làm dở.
- `git worktree add ../repo-fix main`: Tạo worktree song song để xử lý task khác.

## 14) Operational Heuristics
### Heuristic 1
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 2
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 3
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 4
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 5
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 6
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 7
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 8
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 9
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 10
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 11
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 12
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 13
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 14
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 15
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 16
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

### Heuristic 17
- **English:** Keep branches short-lived and merge small increments.
- **Giải thích:** Branch sống lâu làm tăng conflict và giảm tính chính xác review vì context stale.
- **Ví dụ:** Feature lớn tách thành 5 PR nhỏ, dùng feature flag để ẩn hành vi chưa hoàn thiện.

## 15) Interview Checklist
- [ ] Giải thích object model blob/tree/commit/tag.
- [ ] Trình bày DAG và tác động của merge/rebase lên lịch sử.
- [ ] Nêu branching strategy phù hợp theo tổ chức.
- [ ] Dùng được rebase -i, cherry-pick, bisect, reflog.
- [ ] Hiểu hooks + CI gates + protected branches.
- [ ] Nắm workflow PR chất lượng cao và rollback strategy.
- [ ] Áp dụng conventional commits cho changelog/release.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Git distributed nghĩa là gì?

**Tổng Quan**
Mỗi máy dev chứa đầy đủ lịch sử repo.

**Giải thích**
Bạn có thể commit/branch/log offline mà không cần server liên tục.

**Ví dụ**
Laptop offline vẫn commit bình thường và push sau.

### 🟢 [Junior] Branch trong Git là gì?

**Tổng Quan**
Branch là ref trỏ tới commit.

**Giải thích**
Tạo branch rất nhẹ, không copy toàn bộ project.

**Ví dụ**
`git branch feature/login` chỉ tạo con trỏ mới.

### 🟢 [Junior] `git pull` thực chất làm gì?

**Tổng Quan**
Thường là fetch + merge (hoặc rebase nếu cấu hình).

**Giải thích**
Hiểu rõ giúp tránh merge commits ngoài ý muốn.

**Ví dụ**
`git pull --rebase` giữ lịch sử tuyến tính hơn.

### 🟢 [Junior] `git revert` dùng khi nào?

**Tổng Quan**
Dùng để hoàn tác commit đã publish an toàn.

**Giải thích**
Revert tạo commit mới đảo ngược thay đổi, không rewrite history.

**Ví dụ**
Hotfix sai trên main thường xử lý bằng revert.

### 🟢 [Junior] `git stash` dùng để làm gì?

**Tổng Quan**
Tạm cất thay đổi chưa commit.

**Giải thích**
Hữu ích khi cần chuyển branch xử lý việc gấp.

**Ví dụ**
Stash WIP rồi checkout hotfix branch.

### 🟡 [Mid] Merge và rebase khác nhau?

**Tổng Quan**
Merge giữ graph thật; rebase viết lại commit lên base mới.

**Giải thích**
Rebase đẹp lịch sử nhưng không nên dùng trên branch đã chia sẻ rộng.

**Ví dụ**
Feature branch local có thể rebase trước mở PR.

### 🟡 [Mid] Interactive rebase giúp gì?

**Tổng Quan**
Giúp dọn commit history trước khi merge.

**Giải thích**
Lịch sử sạch giúp review/bisect/changelog tốt hơn.

**Ví dụ**
Squash 10 commit “fix typo” thành 1 commit rõ nghĩa.

### 🟡 [Mid] `git bisect` hữu ích khi nào?

**Tổng Quan**
Khi cần tìm commit gây regression trong lịch sử dài.

**Giải thích**
Binary search giảm số lần thử từ N xuống log2(N).

**Ví dụ**
200 commit chỉ cần ~8 vòng bisect.

### 🟡 [Mid] Reflog khác log ra sao?

**Tổng Quan**
Log hiển thị lịch sử commit reachable; reflog theo dõi HEAD movement local.

**Giải thích**
Reflog cứu được commit bị mất do reset/rebase nhầm.

**Ví dụ**
Tìm SHA trong reflog rồi tạo branch recovery.

### 🟡 [Mid] Conflict resolution tốt cần gì?

**Tổng Quan**
Hiểu intent hai phía và chạy test đầy đủ sau merge.

**Giải thích**
Chọn ours/theirs mù quáng dễ gây bug logic ngầm.

**Ví dụ**
Resolve xong phải rerun unit + integration tests.

### 🟡 [Mid] Pre-commit nên chạy gì?

**Tổng Quan**
Chạy checks nhanh trên staged files.

**Giải thích**
Hook quá nặng làm dev bypass hook, phản tác dụng.

**Ví dụ**
Lint-staged + format + unit test nhỏ là hợp lý.

### 🟡 [Mid] Code review PR nên nhỏ tới mức nào?

**Tổng Quan**
Đủ nhỏ để reviewer hiểu trong một phiên tập trung.

**Giải thích**
PR quá lớn tăng tỷ lệ bug lọt và delay merge.

**Ví dụ**
Mục tiêu 200-400 dòng thay đổi review-friendly.

### 🟡 [Mid] Conventional commit có lợi gì?

**Tổng Quan**
Chuẩn hóa message để tự động hóa changelog/release.

**Giải thích**
Giảm tranh cãi format commit và tăng readability lịch sử.

**Ví dụ**
`feat(cart): add discount code validation`.

### 🟡 [Mid] Git LFS dùng khi nào?

**Tổng Quan**
Khi repo chứa binary lớn không phù hợp git object store thường.

**Giải thích**
Giảm clone/fetch time và tránh repo bloat.

**Ví dụ**
Thiết kế team dùng LFS cho `.psd` và `.mp4`.

### 🟡 [Mid] Merge queue giải quyết gì?

**Tổng Quan**
Giảm race condition khi nhiều PR merge vào branch protected.

**Giải thích**
Đảm bảo mỗi merge đã qua checks trên trạng thái gần nhất.

**Ví dụ**
Queue tự rebase/chạy lại checks trước merge.

### 🔴 [Senior] Bạn chọn branching strategy cho team 80 dev thế nào?

**Tổng Quan**
Thường chọn trunk-based hoặc GitHub Flow + feature flags.

**Giải thích**
Mục tiêu là tích hợp liên tục và giảm long-lived branch conflicts.

**Ví dụ**
Mỗi PR nhỏ merge trong ngày, release nhiều lần/ngày.

### 🔴 [Senior] Khi nào rebase bị cấm theo policy?

**Tổng Quan**
Khi branch đã public và nhiều người dựa vào SHA đó.

**Giải thích**
Rewrite public history gây xáo trộn và mất thời gian đội nhóm.

**Ví dụ**
Main/release branches đặt policy no-force-push/no-rebase.

### 🔴 [Senior] Thiết kế quality gate trước merge?

**Tổng Quan**
Kết hợp lint, typecheck, test, security scan, bundle budget.

**Giải thích**
Gate phải cân bằng tốc độ và độ tin cậy.

**Ví dụ**
Smoke checks bắt buộc, full integration theo affected graph.

### 🔴 [Senior] Rollback strategy tốt với Git là gì?

**Tổng Quan**
Tag immutable + deploy artifact theo tag + revert forward khi cần.

**Giải thích**
Rollback phải nhanh, audit được, và không phá lịch sử.

**Ví dụ**
v2.3.1 lỗi -> redeploy v2.3.0 trong 5 phút.

### 🔴 [Senior] Bạn xử lý secret leak trong git history ra sao?

**Tổng Quan**
Rotate secret ngay, block key cũ, rewrite history theo policy.

**Giải thích**
Chỉ xóa file không đủ vì secret đã bị lộ trong clone/CI logs.

**Ví dụ**
Incident runbook bao gồm revoke token và audit access.

### 🔴 [Senior] Monorepo code review scale lớn cần gì?

**Tổng Quan**
CODEOWNERS, PR templates, merge queue, affected checks.

**Giải thích**
Mục tiêu là đúng reviewer, giảm wait time, tăng signal.

**Ví dụ**
Payments code bắt buộc 2 owner approvals.

### 🔴 [Senior] Khi nào dùng cherry-pick thay merge?

**Tổng Quan**
Khi cần backport patch cụ thể vào branch release.

**Giải thích**
Merge cả branch có thể kéo thay đổi không mong muốn.

**Ví dụ**
Cherry-pick 1 fix critical vào release/1.8.

### 🔴 [Senior] Bạn đo health của git workflow bằng chỉ số nào?

**Tổng Quan**
PR lead time, merge frequency, revert rate, conflict rate.

**Giải thích**
Metrics giúp cải tiến quy trình dựa dữ kiện thay vì cảm nhận.

**Ví dụ**
Lead time giảm từ 3 ngày xuống 8 giờ sau tối ưu flow.

### 🔴 [Senior] Làm sao giảm “review fatigue”?

**Tổng Quan**
Giữ PR nhỏ, checklist rõ, auto checks trước khi reviewer vào.

**Giải thích**
Reviewer nên tập trung logic thay vì style nhờ tooling auto-fix.

**Ví dụ**
Auto-format + lint trước push, reviewer đọc design/correctness.

### 🔴 [Senior] Khi nào cần signed commits/tags?

**Tổng Quan**
Khi cần bảo đảm provenance cho môi trường compliance cao.

**Giải thích**
Chữ ký số tăng niềm tin nguồn gốc thay đổi và release artifacts.

**Ví dụ**
Fintech/healthcare thường yêu cầu signed tags cho production release.

## 16) Branch Protection Policies / Chính Sách Bảo Vệ Nhánh
- Bật `required status checks` cho `main` và release branches.
- Yêu cầu số lượng approvals tối thiểu theo mức rủi ro domain.
- Cấm force-push trên protected branches.
- Bắt buộc branch up-to-date trước merge (hoặc merge queue tự động rebase).
- Tùy compliance, bắt buộc signed commits/tags cho release.

### Policy template
- Main: 2 approvals, CI bắt buộc, không admin bypass trừ incident được ghi nhận.
- Release: 1 approval từ owner domain + smoke test deploy staging pass.
- Hotfix: cho phép đường tắt nhưng bắt buộc postmortem trong 24h.

## 17) Changelog Automation Flow / Luồng Tự Động Hóa Changelog
1. Parse commit messages theo Conventional Commits.
2. Group theo type (`feat`, `fix`, `perf`, `refactor`, v.v.).
3. Tính version bump theo mức thay đổi.
4. Tạo release notes theo phạm vi package/module.
5. Publish tag + release artifact + changelog file.

### Benefits
- Giảm lỗi thủ công khi viết release notes.
- Tăng nhất quán giữa teams và release cycles.
- Hỗ trợ audit/compliance tốt hơn.

## 18) Additional Interview Q&A

### 🔴 [Senior] Khi nào bạn áp dụng merge queue thay vì merge thủ công?

**Tổng Quan**
Khi repo có throughput PR cao và thường xuyên gặp race condition sau khi merge.

**Giải thích**
Merge queue serial hóa thứ tự merge + revalidate checks trên trạng thái mới nhất, giảm tình trạng "PR xanh nhưng main đỏ".

**Ví dụ**
Team 70 developers bật merge queue giúp giảm flaky merge failures 50% trong 1 tháng.

### 🔴 [Senior] Bạn cân bằng tốc độ merge và chất lượng code ra sao?

**Tổng Quan**
Chia checks thành fast gates và deep gates, kết hợp risk-based policy.

**Giải thích**
Không thể chạy mọi test nặng cho mọi PR nhỏ. Nên chạy smoke checks bắt buộc, còn deep suites theo impacted modules hoặc nightly.

**Ví dụ**
PR docs chỉ chạy lint/link checks; PR core auth chạy full integration + security tests.

## Kết Luận / Summary
- Git mastery ở cấp senior là năng lực điều phối dòng thay đổi của cả tổ chức, không chỉ thao tác lệnh.
- Quy trình tốt kết hợp: branch strategy hợp lý, CI quality gates, review discipline, và recovery playbooks.
- Khi trả lời phỏng vấn, ưu tiên mô hình + trade-off + case thực chiến có số liệu.

---

[Back to Table of Contents](../../00-table-of-contents.md)
