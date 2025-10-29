# Package Managers / Trình Quản Lý Gói
## Tools & Ecosystem - Chapter 2 / Công Cụ & Hệ Sinh Thái - Chương 2

[Back to Table of Contents](../00-table-of-contents.md)

---

## npm vs yarn vs pnpm

### npm
```bash
# Install dependencies / Cài đặt phụ thuộc
npm install

# Add package / Thêm gói
npm install react

# Add dev dependency / Thêm phụ thuộc dev
npm install --save-dev typescript

# Run script / Chạy script
npm run build
```

### yarn
```bash
# Install dependencies / Cài đặt phụ thuộc
yarn install

# Add package / Thêm gói
yarn add react

# Add dev dependency / Thêm phụ thuộc dev
yarn add -D typescript

# Run script / Chạy script
yarn build
```

### pnpm
```bash
# Install dependencies / Cài đặt phụ thuộc
pnpm install

# Add package / Thêm gói
pnpm add react

# Add dev dependency / Thêm phụ thuộc dev
pnpm add -D typescript

# Run script / Chạy script
pnpm build
```

## package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
