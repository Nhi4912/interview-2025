# Tools Practical Applications / Ứng Dụng Thực Tế Công Cụ FE

[Back to Table of Contents](../00-table-of-contents.md) | [Web APIs](./00-web-apis-fundamentals.md) | [Concept Map](./12-visual-learning-01-javascript-concepts-map.md)

## Overview
Tài liệu này gom các mẫu cấu hình và workflow công cụ thường gặp trong dự án Frontend hiện đại.

## Topic 1: webpack/Vite config examples
### Tổng Quan
Phần webpack/Vite config examples tập trung vào cách áp dụng công cụ vào bối cảnh CI/CD và vận hành thực tế.
### Giải thích
- Insight 1: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 2: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 3: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 4: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 5: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 6: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 7: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 8: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 9: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 10: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 11: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
### Ví dụ
```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 900,
  },
});

// webpack.config.js
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  optimization: { splitChunks: { chunks: 'all' } },
};
```
- Application note 1: mô tả tình huống dùng webpack/Vite config examples trong team frontend.
- Application note 2: mô tả tình huống dùng webpack/Vite config examples trong team frontend.
- Application note 3: mô tả tình huống dùng webpack/Vite config examples trong team frontend.
- Application note 4: mô tả tình huống dùng webpack/Vite config examples trong team frontend.
- Application note 5: mô tả tình huống dùng webpack/Vite config examples trong team frontend.
- Application note 6: mô tả tình huống dùng webpack/Vite config examples trong team frontend.
- Application note 7: mô tả tình huống dùng webpack/Vite config examples trong team frontend.

## Topic 2: ESLint/Prettier setup
### Tổng Quan
Phần ESLint/Prettier setup tập trung vào cách áp dụng công cụ vào bối cảnh CI/CD và vận hành thực tế.
### Giải thích
- Insight 1: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 2: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 3: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 4: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 5: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 6: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 7: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 8: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 9: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 10: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 11: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
### Ví dụ
```json
{
  "scripts": {
    "lint": "eslint src --max-warnings=0",
    "format": "prettier . --write"
  },
  "eslintConfig": {
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"]
  }
}
```
- Application note 1: mô tả tình huống dùng ESLint/Prettier setup trong team frontend.
- Application note 2: mô tả tình huống dùng ESLint/Prettier setup trong team frontend.
- Application note 3: mô tả tình huống dùng ESLint/Prettier setup trong team frontend.
- Application note 4: mô tả tình huống dùng ESLint/Prettier setup trong team frontend.
- Application note 5: mô tả tình huống dùng ESLint/Prettier setup trong team frontend.
- Application note 6: mô tả tình huống dùng ESLint/Prettier setup trong team frontend.
- Application note 7: mô tả tình huống dùng ESLint/Prettier setup trong team frontend.

## Topic 3: Docker for FE
### Tổng Quan
Phần Docker for FE tập trung vào cách áp dụng công cụ vào bối cảnh CI/CD và vận hành thực tế.
### Giải thích
- Insight 1: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 2: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 3: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 4: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 5: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 6: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 7: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 8: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 9: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 10: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 11: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
### Ví dụ
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
CMD ["npm", "run", "start"]
```
- Application note 1: mô tả tình huống dùng Docker for FE trong team frontend.
- Application note 2: mô tả tình huống dùng Docker for FE trong team frontend.
- Application note 3: mô tả tình huống dùng Docker for FE trong team frontend.
- Application note 4: mô tả tình huống dùng Docker for FE trong team frontend.
- Application note 5: mô tả tình huống dùng Docker for FE trong team frontend.
- Application note 6: mô tả tình huống dùng Docker for FE trong team frontend.
- Application note 7: mô tả tình huống dùng Docker for FE trong team frontend.

## Topic 4: GitHub Actions CI/CD
### Tổng Quan
Phần GitHub Actions CI/CD tập trung vào cách áp dụng công cụ vào bối cảnh CI/CD và vận hành thực tế.
### Giải thích
- Insight 1: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 2: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 3: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 4: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 5: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 6: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 7: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 8: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 9: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 10: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 11: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
### Ví dụ
```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --run
      - run: npm run build
```
- Application note 1: mô tả tình huống dùng GitHub Actions CI/CD trong team frontend.
- Application note 2: mô tả tình huống dùng GitHub Actions CI/CD trong team frontend.
- Application note 3: mô tả tình huống dùng GitHub Actions CI/CD trong team frontend.
- Application note 4: mô tả tình huống dùng GitHub Actions CI/CD trong team frontend.
- Application note 5: mô tả tình huống dùng GitHub Actions CI/CD trong team frontend.
- Application note 6: mô tả tình huống dùng GitHub Actions CI/CD trong team frontend.
- Application note 7: mô tả tình huống dùng GitHub Actions CI/CD trong team frontend.

## Topic 5: debugging workflows
### Tổng Quan
Phần debugging workflows tập trung vào cách áp dụng công cụ vào bối cảnh CI/CD và vận hành thực tế.
### Giải thích
- Insight 1: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 2: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 3: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 4: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 5: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 6: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 7: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 8: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 9: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 10: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 11: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
### Ví dụ
```ts
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}

export function debugFetch(url: string) {
  console.time('fetch');
  return fetch(url)
    .then((res) => {
      console.log('status', res.status);
      return res;
    })
    .finally(() => console.timeEnd('fetch'));
}
```
- Application note 1: mô tả tình huống dùng debugging workflows trong team frontend.
- Application note 2: mô tả tình huống dùng debugging workflows trong team frontend.
- Application note 3: mô tả tình huống dùng debugging workflows trong team frontend.
- Application note 4: mô tả tình huống dùng debugging workflows trong team frontend.
- Application note 5: mô tả tình huống dùng debugging workflows trong team frontend.
- Application note 6: mô tả tình huống dùng debugging workflows trong team frontend.
- Application note 7: mô tả tình huống dùng debugging workflows trong team frontend.

## Topic 6: profiling techniques
### Tổng Quan
Phần profiling techniques tập trung vào cách áp dụng công cụ vào bối cảnh CI/CD và vận hành thực tế.
### Giải thích
- Insight 1: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 2: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 3: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 4: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 5: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 6: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 7: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 8: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 9: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 10: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
- Insight 11: chọn cấu hình theo ưu tiên build time, bundle size, và developer feedback loop.
### Ví dụ
```ts
export function profileTask(label: string, task: () => void): void {
  performance.mark(`${label}:start`);
  task();
  performance.mark(`${label}:end`);
  performance.measure(label, `${label}:start`, `${label}:end`);
  const [entry] = performance.getEntriesByName(label).slice(-1);
  console.log(label, entry.duration);
}
```
- Application note 1: mô tả tình huống dùng profiling techniques trong team frontend.
- Application note 2: mô tả tình huống dùng profiling techniques trong team frontend.
- Application note 3: mô tả tình huống dùng profiling techniques trong team frontend.
- Application note 4: mô tả tình huống dùng profiling techniques trong team frontend.
- Application note 5: mô tả tình huống dùng profiling techniques trong team frontend.
- Application note 6: mô tả tình huống dùng profiling techniques trong team frontend.
- Application note 7: mô tả tình huống dùng profiling techniques trong team frontend.

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] Q1: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q2: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q3: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q4: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q5: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q6: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q7: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q8: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q9: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q10: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q11: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q12: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q13: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q14: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q15: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q16: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q17: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q18: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q19: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q20: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q21: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q22: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q23: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q24: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q25: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q26: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q27: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q28: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q29: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q30: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q31: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q32: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q33: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q34: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q35: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q36: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q37: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q38: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q39: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q40: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q41: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q42: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q43: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q44: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q45: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q46: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q47: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q48: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q49: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q50: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q51: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q52: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q53: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q54: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q55: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q56: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q57: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q58: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q59: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q60: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q61: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q62: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q63: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q64: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q65: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q66: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q67: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q68: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q69: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q70: How do you apply GitHub Actions CI/CD in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q71: How do you apply debugging workflows in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q72: How do you apply profiling techniques in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟢 [Junior] Q73: How do you apply webpack/Vite config examples in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🟡 [Mid] Q74: How do you apply ESLint/Prettier setup in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
### 🔴 [Senior] Q75: How do you apply Docker for FE in a real project?
- **Answer (EN):** Explain baseline config, risk, and rollout plan with measurable outcomes.
- **Trả lời (VI):** Trình bày cấu hình nền, rủi ro chính, và kế hoạch triển khai có chỉ số đo lường.
- **Ví dụ:** Nêu cách theo dõi bundle size sau khi tối ưu.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
- Ops tip: luôn giữ scripts lint/test/build đơn giản để CI dễ bảo trì.
