# Package Managers / Trình Quản Lý Gói

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tools & Ecosystem - Chapter 2 / Công Cụ & Hệ Sinh Thái - Chương 2
[Back to Table of Contents](../../00-table-of-contents.md)

---

## Tổng Quan / Overview
- Package manager là hạ tầng quan trọng để đảm bảo cài đặt dependency ổn định, lặp lại, và an toàn.
- Trong hệ thống hiện đại, package manager gắn chặt với monorepo, CI cache, và security compliance.
- Cross-reference build workflows: [Build Tools](./13-tools-ecosystem-01-build-tools.md).
- Cross-reference git/release workflows: [Version Control](./13-tools-ecosystem-03-version-control.md).

## 1) Evolution / Tiến Hóa npm -> yarn -> pnpm -> bun
### npm
- **English:** Default Node package manager, registry ecosystem lớn nhất.
- **Tiếng Việt:** Chuẩn nền tảng với compatibility cao nhất.

### yarn
- **English:** Cải thiện tốc độ, lockfile deterministic, workspaces sớm.
- **Tiếng Việt:** Từng là lựa chọn phổ biến cho monorepo trước npm cải tiến.

### pnpm
- **English:** Content-addressable store và symlink strategy.
- **Tiếng Việt:** Tiết kiệm disk, hạn chế phantom deps hiệu quả.

### bun
- **English:** Runtime + PM + bundler tích hợp tốc độ cao.
- **Tiếng Việt:** Đang trưởng thành nhanh, cần đánh giá compatibility kỹ.

## 2) npm Registry Architecture / Kiến Trúc Registry
- Registry chứa metadata package, versions, dist-tags, dependencies, integrity hashes.
- Package artifact thường là tarball được phân phối qua CDN.
- Resolve flow: tải metadata -> chọn version phù hợp -> tải tarball -> verify integrity -> unpack.
- Scoped package (`@scope/name`) phục vụ phân quyền và namespace doanh nghiệp.

### Dist-tags
- `latest` thường là mặc định cài đặt.
- Có thể dùng `next`, `beta`, `rc` cho release channels.
- Dist-tags hỗ trợ canary rollout mà không đổi semver logic cơ bản.

## 3) Dependency Resolution / Thuật Toán Resolve
- Input gồm semver ranges, peer deps, optional deps, engines, platform constraints.
- Resolver mục tiêu tìm dependency graph thỏa ràng buộc và deterministic.
- Khi conflict, resolver báo lỗi hoặc chọn chiến lược fallback tùy manager/version.

### Semver Table
| Pattern | Ý nghĩa |
|---|---|
| `^1.2.3` | Cho phép minor/patch trong major 1 |
| `~1.2.3` | Cho phép patch trong minor 1.2 |
| `1.2.3` | Pin exact version |
| `>=1 <2` | Range custom |

## 4) Lockfiles / package-lock.json, yarn.lock, pnpm-lock.yaml
- **package-lock.json:** Đảm bảo npm install deterministic và lưu integrity.
- **yarn.lock:** Map range -> resolved artifacts cho Yarn workflows.
- **pnpm-lock.yaml:** Biểu diễn graph + store metadata cho pnpm symlink layout.
- Lockfile cần commit vào git để đồng bộ local/CI/prod.
- Team nên enforce một package manager duy nhất để tránh drift.

```bash
npm ci
yarn install --immutable
pnpm install --frozen-lockfile
```

## 5) Peer Dependencies / Phụ Thuộc Đồng Cấp
- Peer deps yêu cầu app host cung cấp dependency, đặc biệt trong plugin/library ecosystems.
- Dùng peer deps để tránh duplicate React/Vue core trong tree runtime.
- Cần ghi rõ range tương thích và test matrix phiên bản.

```json
{
  "name": "@acme/react-grid",
  "peerDependencies": {
    "react": ">=18 <20",
    "react-dom": ">=18 <20"
  }
}
```

## 6) Hoisting, Phantom Dependencies, node_modules Structures
### Flat hoisting
- Ưu điểm: giảm trùng lặp, lookup nhanh.
- Nhược điểm: dễ phát sinh phantom deps khi import dependency không khai báo trực tiếp.

### Nested layout
- Cách ly tốt hơn nhưng tốn disk/path depth.
- Có thể giảm số bug do accidental dependency access.

### pnpm content-addressable
- Store toàn cục theo content hash.
- Project dùng links tới store, giảm duplicate trên máy.
- Tăng tính đúng đắn vì dependency boundaries rõ hơn.

## 7) Monorepo Package Management
- Workspaces liên kết package nội bộ và chạy scripts theo scope.
- Task orchestrator (Turborepo/Nx) tạo DAG cho build/test/lint.
- Affected-only execution giảm CI time đáng kể.
- Versioning có thể independent hoặc fixed tùy release strategy.
- Nên có ownership + boundaries để tránh dependency cycle nội bộ.

```yaml
packages:
  - apps/*
  - packages/*
```

## 8) Security / Bảo Mật Chuỗi Cung Ứng
- Dependency confusion: luôn dùng scope private và mapping registry rõ ràng.
- Typosquatting: review tên package, publisher, download patterns.
- Lockfile injection: review diff lockfile trong PR, dùng trusted CI checks.
- Malicious scripts: cân nhắc disable scripts trong CI cho môi trường cần bảo mật cao.
- Token protection: dùng scoped automation token + rotate định kỳ.
- SBOM/provenance: tăng traceability nguồn gốc dependency artifacts.

```bash
npm audit
pnpm audit
yarn npm audit
```

## 9) Publishing Packages
- Chuẩn bị entry points ESM/CJS/types rõ ràng.
- Dùng `files` whitelist để tránh publish file thừa/nhạy cảm.
- Chạy `npm pack --dry-run` để verify artifact trước publish.
- Dùng dist-tags để phân kênh stable/beta/canary.
- Automate release bằng CI + changelog generation.

```json
{
  "name": "@acme/utils",
  "version": "2.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"]
}
```

## 10) Private Registries
- Tổ chức lớn thường tách registry public/private để quản trị rủi ro.
- Có thể dùng GitHub Packages, Artifactory, Nexus, Verdaccio.
- `.npmrc` theo scope giúp tránh cài nhầm package từ nguồn không tin cậy.

```ini
@acme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
always-auth=true
```

## 11) node_modules Topology Comparison
| Strategy | Ưu điểm | Nhược điểm |
|---|---|---|
| Flat hoisting | Install nhanh, lookup tiện | Phantom deps, conflict ngầm |
| Nested | Isolation tốt | Tốn disk/path sâu |
| Content-addressable (pnpm) | Tiết kiệm disk, boundaries rõ | Cần hiểu symlink layout |

## 12) Failure Scenarios & Mitigation
- **S1:** Peer conflict khi upgrade major framework.
  - Mitigation: Pin tạm + plan migration theo package waves.
- **S2:** Lockfile conflict thường xuyên.
  - Mitigation: Dùng merge queue + bot rebase tự động.
- **S3:** Install chậm ở CI.
  - Mitigation: Cache store theo lockfile hash + frozen install.
- **S4:** Registry outage.
  - Mitigation: Dùng mirror/cache proxy nội bộ.
- **S5:** Compromised token.
  - Mitigation: Rotate ngay + revoke tokens + audit publish logs.
- **S6:** Typosquatting package xâm nhập.
  - Mitigation: Whitelisted dependencies + policy scanner.
- **S7:** Phantom deps làm test pass local fail CI.
  - Mitigation: Bật strict dependency checks và clean CI runs.
- **S8:** Inconsistent Node versions.
  - Mitigation: Enforce engines + .nvmrc + CI version pin.

## 13) Operational Guidelines / Hướng Dẫn Vận Hành
### Guideline 1
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 2
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 3
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 4
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 5
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 6
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 7
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 8
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 9
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 10
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 11
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 12
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 13
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 14
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 15
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 16
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 17
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

### Guideline 18
- **English:** Keep dependency graph intentional and reviewable.
- **Giải thích:** Mỗi dependency mới cần có owner, mục đích, và tiêu chí loại bỏ khi không còn dùng.
- **Ví dụ:** Tạo checklist PR khi thêm package: license, security posture, bundle impact.

## 14) Interview Checklist
- [ ] Giải thích npm/yarn/pnpm/bun theo pain-point thực tế.
- [ ] Nói rõ cơ chế lockfile và vì sao cần deterministic installs.
- [ ] Phân biệt dependencies/devDependencies/peerDependencies.
- [ ] Mô tả hoisting + phantom dependency với ví dụ CI fail.
- [ ] Nêu biện pháp supply-chain security khả thi cho team.
- [ ] Hiểu publish pipeline và dist-tags strategy.
- [ ] Trình bày quản lý monorepo dependencies ở quy mô lớn.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Semver là gì?

**Tổng Quan**
Semver là quy ước version gồm major.minor.patch.

**Giải thích**
Nó giúp dự đoán mức độ rủi ro khi nâng cấp dependency.

**Ví dụ**
`2.4.1 -> 2.4.2` là patch, thường ít rủi ro hơn `2.x -> 3.0.0`.

### 🟢 [Junior] Lockfile có tác dụng gì?

**Tổng Quan**
Khóa phiên bản resolve để cài đặt lặp lại giống nhau.

**Giải thích**
Không có lockfile, mỗi lần install có thể ra graph khác nhau.

**Ví dụ**
Team A và CI cùng lockfile sẽ cài cùng bản transitive deps.

### 🟢 [Junior] `npm ci` khác `npm install` thế nào?

**Tổng Quan**
`npm ci` cài đúng lockfile và fail nếu lệch.

**Giải thích**
Phù hợp CI vì deterministic và thường nhanh hơn install thường.

**Ví dụ**
Pipeline release nên dùng `npm ci`.

### 🟢 [Junior] dependencies vs devDependencies?

**Tổng Quan**
dependencies cần cho runtime, devDependencies cho build/test/dev.

**Giải thích**
Phân tách đúng giúp deploy gọn và giảm bề mặt tấn công.

**Ví dụ**
`react` ở dependencies, `vitest` ở devDependencies.

### 🟢 [Junior] Peer dependency là gì?

**Tổng Quan**
Là dependency mà package kỳ vọng consumer cung cấp.

**Giải thích**
Dùng để tránh duplicate core framework ở plugin/library.

**Ví dụ**
React UI library khai báo peer `react` và `react-dom`.

### 🟡 [Mid] Hoisting là gì?

**Tổng Quan**
Là kỹ thuật đưa dependencies lên node_modules cấp cao để tái sử dụng.

**Giải thích**
Giảm duplicate nhưng có thể gây import “ăn may” không khai báo.

**Ví dụ**
Một package import được module chỉ vì module đó bị hoist ở root.

### 🟡 [Mid] Phantom dependency nguy hiểm ra sao?

**Tổng Quan**
Code chạy local nhưng fail ở môi trường clean install.

**Giải thích**
Vì package không khai báo dependency thật sự, tính portable bị phá vỡ.

**Ví dụ**
CI báo `Cannot find module` dù local pass.

### 🟡 [Mid] Vì sao pnpm tiết kiệm disk?

**Tổng Quan**
Do content-addressable store và linking.

**Giải thích**
Một artifact version lưu 1 lần dùng cho nhiều project.

**Ví dụ**
10 repo dùng cùng TypeScript vẫn chỉ lưu 1 bản trong store.

### 🟡 [Mid] Monorepo nên dùng workspaces như thế nào?

**Tổng Quan**
Khai báo apps/packages rõ và chạy scripts theo scope.

**Giải thích**
Giúp link package nội bộ nhanh và quản trị dependency tốt hơn.

**Ví dụ**
`pnpm -r test --filter ./packages/*`.

### 🟡 [Mid] Audit có đủ bảo mật chưa?

**Tổng Quan**
Chưa, audit chỉ là một lớp kiểm tra.

**Giải thích**
Cần thêm policy, provenance, review lockfile, và runtime hardening.

**Ví dụ**
Audit pass nhưng package vẫn có postinstall script đáng ngờ.

### 🟡 [Mid] Lockfile injection là gì?

**Tổng Quan**
Kẻ tấn công chèn resolved source/metadata độc hại vào lockfile.

**Giải thích**
Nếu review lockfile lỏng, dependency bất thường có thể lọt vào main.

**Ví dụ**
CI nên kiểm lockfile diff và enforce trusted registry.

### 🟡 [Mid] Khi publish package cần chú ý gì?

**Tổng Quan**
Entry points, types, files whitelist, license, changelog.

**Giải thích**
Thiếu kiểm tra dễ publish thiếu file runtime hoặc lộ file nhạy cảm.

**Ví dụ**
Dùng `npm pack --dry-run` trước publish thật.

### 🟡 [Mid] Private registry giúp gì?

**Tổng Quan**
Kiểm soát quyền truy cập và giảm rủi ro dependency confusion.

**Giải thích**
Ngoài bảo mật, còn cải thiện cache nội bộ cho tốc độ install.

**Ví dụ**
Scope `@acme/*` chỉ resolve từ registry nội bộ.

### 🟡 [Mid] Dist-tags dùng thế nào?

**Tổng Quan**
Dùng để phân kênh phát hành như latest, next, beta.

**Giải thích**
Không cần đổi semver policy để rollout phiên bản thử nghiệm.

**Ví dụ**
`npm dist-tag add pkg@2.0.0-beta.1 next`.

### 🟡 [Mid] Làm sao tăng tốc install CI?

**Tổng Quan**
Cache store theo lockfile hash và frozen install.

**Giải thích**
Giảm network + resolve work, tăng tính reproducible.

**Ví dụ**
pnpm store cache + `--frozen-lockfile`.

### 🔴 [Senior] Thiết kế governance dependency cho enterprise?

**Tổng Quan**
Thiết lập ownership, update cadence, risk tiers, và automation PR.

**Giải thích**
Mục tiêu giảm CVE và tránh upgrade hỗn loạn.

**Ví dụ**
Patch auto weekly, major theo quarterly RFC.

### 🔴 [Senior] Khi nào migrate npm/yarn sang pnpm?

**Tổng Quan**
Khi monorepo lớn gặp bottleneck disk/install và phantom deps.

**Giải thích**
Nên pilot trên một miền nhỏ trước để kiểm compatibility scripts.

**Ví dụ**
Rollout theo wave thay vì big-bang migration.

### 🔴 [Senior] Bạn xử lý conflict lockfile lớn thế nào?

**Tổng Quan**
Chuẩn hóa một PM, dùng merge queue, bot rebase, và kiểm thử tự động.

**Giải thích**
Lockfile conflict là vấn đề quy trình hơn là kỹ thuật thuần túy.

**Ví dụ**
Bật policy: PR stale phải rebase trước merge.

### 🔴 [Senior] Phòng dependency confusion cụ thể ra sao?

**Tổng Quan**
Scoped package bắt buộc + registry mapping cứng trong CI.

**Giải thích**
Không cho phép fallback tùy tiện sang public registry cho scope nội bộ.

**Ví dụ**
Tất cả internal packages bắt đầu bằng `@acme/`.

### 🔴 [Senior] Bun có phù hợp production ngay không?

**Tổng Quan**
Tùy độ tương thích toolchain và risk tolerance của tổ chức.

**Giải thích**
Bun rất nhanh nhưng cần kiểm tra kỹ native addons, scripts và CI.

**Ví dụ**
Dùng Bun cho internal tools trước rồi mở rộng dần.

### 🔴 [Senior] Làm sao đảm bảo release package không phá consumer?

**Tổng Quan**
Giữ contract semver nghiêm, có changelog rõ, và test compatibility matrix.

**Giải thích**
Breaking change phải major + migration guide cụ thể.

**Ví dụ**
CI chạy test sample app trên React 18 và 19.

### 🔴 [Senior] Bạn đo hiệu quả PM migration bằng gì?

**Tổng Quan**
Install time, CI duration, disk usage, failure rate, DX survey.

**Giải thích**
Chỉ migration khi số liệu cải thiện đủ bù chi phí chuyển đổi.

**Ví dụ**
Sau migration pnpm: install giảm 45%, disk giảm 60%.

### 🔴 [Senior] Kịch bản incident khi package bị compromise?

**Tổng Quan**
Freeze installs, rotate tokens, block version, hotfix lockfile.

**Giải thích**
Cần playbook rõ để phản ứng trong giờ đầu incident.

**Ví dụ**
Add denylist version + force reinstall từ lockfile đã clean.

### 🔴 [Senior] Peer dependency policy trong monorepo?

**Tổng Quan**
Đặt range chuẩn theo platform baseline và lint rule kiểm tra.

**Giải thích**
Range quá rộng gây bug runtime, quá hẹp gây conflict.

**Ví dụ**
Chuẩn hóa React peer range `>=18 <20` toàn bộ UI libs.

### 🔴 [Senior] Trade-off fixed vs independent versioning?

**Tổng Quan**
Fixed đơn giản release đồng bộ; independent linh hoạt nhưng governance khó hơn.

**Giải thích**
Chọn theo coupling giữa packages và nhu cầu release cadence.

**Ví dụ**
Core platform dùng fixed, utility libs dùng independent.

## 15) Advanced Monorepo Release Patterns / Mẫu Release Nâng Cao
- **Fixed versioning:** tất cả packages tăng cùng version, đơn giản cho đồng bộ release.
- **Independent versioning:** mỗi package tăng version riêng, linh hoạt nhưng governance khó hơn.
- **Canary releases:** phát hành bản thử nghiệm theo commit SHA để test integration sớm.
- **Changesets workflow:** gom thay đổi theo package, tự động tính release plan.

### Ví dụ release checklist / Checklist phát hành
1. Verify lockfile sạch và CI pass toàn bộ checks.
2. Generate changelog theo package impacted.
3. Publish canary cho nhóm consumer nội bộ.
4. Smoke test install từ registry thật.
5. Promote dist-tag `next` -> `latest` khi đạt tiêu chí.

## 16) Security Controls Matrix / Ma Trận Kiểm Soát Bảo Mật
| Control | Mục tiêu | Thực thi gợi ý |
|---|---|---|
| Registry allowlist | Chặn nguồn package lạ | Enforce `.npmrc` trong CI |
| Lockfile review | Phát hiện injection | PR bot highlight changes lớn |
| Token scoping | Giảm blast radius | Fine-grained automation tokens |
| Provenance | Truy xuất nguồn build | CI attestations/SLSA level phù hợp |
| Script restrictions | Chặn mã độc cài đặt | Disable lifecycle scripts ở môi trường nhạy cảm |

## 17) Additional Interview Q&A

### 🔴 [Senior] Bạn chọn strategy nào cho dependency updates trong sản phẩm mission-critical?

**Tổng Quan**
Ưu tiên update theo wave nhỏ, có canary và rollback rõ ràng.

**Giải thích**
Mission-critical systems cần giảm rủi ro hơn là chạy theo phiên bản mới nhất. Update cadence phải gắn với business risk và SLA.

**Ví dụ**
Patch security update trong 24h qua canary environment, major updates theo quarterly RFC.

### 🔴 [Senior] Làm sao chứng minh migration package manager thành công?

**Tổng Quan**
Định nghĩa KPI trước migration và đo sau migration theo cùng điều kiện.

**Giải thích**
Nếu không có baseline metrics, quyết định migration chỉ là cảm tính. KPI nên gồm install time, CI duration, failure rate, disk usage.

**Ví dụ**
Sau migration sang pnpm: install p95 giảm 40%, CI fail do dependency resolution giảm 70%.

## Kết Luận / Summary
- Package manager quyết định trực tiếp tính tái lập và bảo mật của toàn bộ chuỗi phát triển.
- Tư duy senior nằm ở governance + automation + incident readiness, không chỉ chọn công cụ nào nhanh hơn.
- Với monorepo lớn, discipline về lockfile và dependency ownership là bắt buộc.

---

[Back to Table of Contents](../../00-table-of-contents.md)
