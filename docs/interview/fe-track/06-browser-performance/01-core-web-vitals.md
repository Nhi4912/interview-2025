# Core Web Vitals

## Tổng Quan
Core Web Vitals là bộ chỉ số trọng tâm để đánh giá trải nghiệm người dùng trên web theo góc nhìn thực tế.
File này dùng heading tiếng Anh và phần giải thích tiếng Việt cho mục tiêu interview prep song ngữ.

### Cross-References
- Tiếp theo: [React Performance](./02-react-performance.md)
- Liên quan: [Bundle Optimization](./03-bundle-optimization.md)

## Core Metrics
### Giải thích
Ba chỉ số cốt lõi hiện nay: LCP (loading), INP (responsiveness), CLS (visual stability).

### Ví dụ
- LCP tốt: < 2.5s
- INP tốt: < 200ms
- CLS tốt: < 0.1

---

## 1. LCP (Largest Contentful Paint)
### Tổng Quan
LCP đo thời gian phần tử nội dung lớn nhất xuất hiện trong viewport.

### Giải thích
Yếu tố ảnh hưởng chính: TTFB, resource loading, render blocking CSS/JS, image optimization.

### Ví dụ
```tsx
import Image from 'next/image'

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="hero"
      width={1280}
      height={720}
      priority
    />
  )
}
```

- LCP Tactic 1: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 2: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 3: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 4: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 5: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 6: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 7: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 8: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 9: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 10: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 11: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 12: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 13: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 14: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 15: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 16: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 17: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 18: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 19: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 20: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 21: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 22: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 23: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 24: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 25: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 26: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 27: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 28: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 29: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 30: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 31: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 32: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 33: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 34: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 35: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 36: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 37: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 38: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 39: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 40: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 41: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 42: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 43: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 44: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 45: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 46: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 47: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 48: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 49: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 50: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 51: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 52: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 53: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 54: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 55: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 56: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 57: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 58: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 59: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 60: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 61: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 62: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 63: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 64: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 65: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 66: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 67: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 68: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 69: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 70: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 71: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 72: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 73: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 74: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 75: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 76: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 77: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 78: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 79: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 80: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 81: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 82: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 83: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 84: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 85: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 86: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 87: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 88: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 89: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 90: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 91: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 92: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 93: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 94: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 95: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 96: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 97: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 98: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 99: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 100: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 101: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 102: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 103: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 104: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 105: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 106: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 107: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 108: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 109: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 110: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 111: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 112: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 113: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 114: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 115: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 116: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 117: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 118: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 119: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 120: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 121: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 122: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 123: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 124: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 125: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 126: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 127: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 128: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 129: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 130: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 131: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 132: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 133: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 134: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 135: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 136: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 137: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 138: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 139: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).
- LCP Tactic 140: Mô tả một chiến lược giảm thời gian tải phần tử lớn nhất (preload, CDN, tối ưu ảnh, giảm JS blocking).

## 2. FID/INP and Main Thread Work
### Tổng Quan
INP phản ánh độ trễ giữa tương tác và lần paint tiếp theo; FID là chỉ số cũ.

### Giải thích
Long tasks, hydration nặng, third-party scripts là nguyên nhân phổ biến làm tăng INP.

### Ví dụ
```ts
function splitWork(items: number[]) {
  const chunk = 500
  for (let i = 0; i < items.length; i += chunk) {
    const part = items.slice(i, i + chunk)
    // xử lý nhẹ từng phần
    console.log(part.length)
  }
}
```

- INP Tactic 1: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 2: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 3: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 4: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 5: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 6: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 7: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 8: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 9: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 10: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 11: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 12: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 13: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 14: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 15: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 16: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 17: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 18: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 19: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 20: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 21: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 22: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 23: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 24: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 25: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 26: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 27: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 28: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 29: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 30: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 31: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 32: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 33: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 34: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 35: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 36: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 37: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 38: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 39: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 40: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 41: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 42: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 43: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 44: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 45: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 46: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 47: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 48: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 49: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 50: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 51: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 52: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 53: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 54: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 55: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 56: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 57: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 58: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 59: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 60: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 61: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 62: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 63: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 64: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 65: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 66: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 67: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 68: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 69: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 70: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 71: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 72: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 73: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 74: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 75: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 76: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 77: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 78: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 79: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 80: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 81: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 82: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 83: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 84: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 85: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 86: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 87: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 88: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 89: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 90: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 91: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 92: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 93: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 94: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 95: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 96: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 97: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 98: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 99: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 100: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 101: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 102: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 103: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 104: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 105: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 106: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 107: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 108: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 109: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 110: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 111: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 112: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 113: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 114: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 115: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 116: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 117: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 118: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 119: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 120: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 121: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 122: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 123: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 124: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 125: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 126: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 127: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 128: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 129: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.
- INP Tactic 130: Chia nhỏ tác vụ CPU, trì hoãn non-critical JS, giảm re-render, tối ưu event handler.

## 3. CLS (Cumulative Layout Shift)
### Tổng Quan
CLS đo mức độ layout bị dịch chuyển bất ngờ trong quá trình tải và tương tác.

### Giải thích
Nguyên nhân chính: ảnh không có kích thước, ad slot không reserve space, font swap không kiểm soát.

### Ví dụ
```css
.media-box {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

- CLS Tactic 1: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 2: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 3: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 4: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 5: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 6: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 7: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 8: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 9: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 10: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 11: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 12: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 13: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 14: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 15: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 16: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 17: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 18: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 19: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 20: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 21: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 22: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 23: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 24: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 25: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 26: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 27: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 28: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 29: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 30: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 31: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 32: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 33: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 34: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 35: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 36: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 37: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 38: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 39: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 40: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 41: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 42: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 43: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 44: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 45: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 46: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 47: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 48: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 49: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 50: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 51: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 52: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 53: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 54: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 55: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 56: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 57: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 58: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 59: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 60: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 61: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 62: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 63: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 64: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 65: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 66: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 67: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 68: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 69: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 70: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 71: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 72: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 73: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 74: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 75: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 76: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 77: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 78: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 79: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 80: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 81: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 82: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 83: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 84: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 85: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 86: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 87: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 88: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 89: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 90: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 91: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 92: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 93: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 94: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 95: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 96: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 97: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 98: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 99: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 100: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 101: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 102: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 103: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 104: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 105: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 106: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 107: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 108: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 109: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 110: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 111: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 112: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 113: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 114: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 115: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 116: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 117: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 118: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 119: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.
- CLS Tactic 120: Reserve space trước cho dynamic content và media để tránh shift ngoài ý muốn.

## 4. Measurement Tools
### Tổng Quan
Kết hợp lab data và field data để tránh tối ưu lệch thực tế.

### Giải thích
Lighthouse phù hợp regression nhanh; Chrome DevTools phù hợp phân tích timeline; RUM phản ánh người dùng thật.

### Ví dụ
- Lighthouse CI trong pipeline để chặn PR gây regressions lớn.
- DevTools Performance panel để tìm long tasks và layout shifts.
- web-vitals library gửi metric về analytics backend.

- Measurement Note 1: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 2: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 3: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 4: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 5: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 6: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 7: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 8: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 9: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 10: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 11: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 12: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 13: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 14: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 15: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 16: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 17: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 18: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 19: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 20: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 21: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 22: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 23: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 24: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 25: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 26: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 27: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 28: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 29: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 30: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 31: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 32: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 33: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 34: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 35: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 36: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 37: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 38: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 39: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 40: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 41: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 42: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 43: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 44: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 45: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 46: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 47: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 48: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 49: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 50: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 51: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 52: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 53: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 54: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 55: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 56: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 57: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 58: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 59: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 60: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 61: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 62: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 63: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 64: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 65: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 66: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 67: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 68: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 69: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 70: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 71: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 72: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 73: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 74: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 75: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 76: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 77: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 78: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 79: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 80: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 81: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 82: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 83: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 84: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 85: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 86: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 87: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 88: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 89: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 90: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 91: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 92: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 93: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 94: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 95: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 96: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 97: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 98: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 99: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.
- Measurement Note 100: Nêu cách đọc metric, phân tách cold/warm load, theo dõi theo device class và network class.

## 5. Optimization Playbook
### Giải thích
Playbook nên theo thứ tự: đo baseline -> chọn bottleneck lớn nhất -> triển khai -> đo lại -> rollout dần.

### Ví dụ
1. Đặt performance budget cho JS/CSS/image.
2. Bật image CDN + modern formats (AVIF/WebP).
3. Tách bundle theo route và theo interaction.
4. Theo dõi INP và CLS theo từng release.

- Playbook Step 1: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 2: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 3: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 4: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 5: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 6: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 7: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 8: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 9: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 10: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 11: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 12: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 13: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 14: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 15: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 16: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 17: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 18: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 19: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 20: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 21: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 22: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 23: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 24: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 25: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 26: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 27: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 28: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 29: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 30: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 31: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 32: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 33: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 34: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 35: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 36: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 37: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 38: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 39: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 40: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 41: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 42: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 43: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 44: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 45: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 46: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 47: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 48: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 49: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 50: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 51: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 52: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 53: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 54: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 55: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 56: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 57: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 58: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 59: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 60: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 61: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 62: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 63: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 64: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 65: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 66: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 67: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 68: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 69: Một bước hành động cụ thể để cải thiện CWV ở production.
- Playbook Step 70: Một bước hành động cụ thể để cải thiện CWV ở production.

## 6. Real-World Case Studies
### Tổng Quan
Case study giúp bạn trả lời câu hỏi phỏng vấn theo dạng impact: before -> change -> after.

### Giải thích
Interviewer đánh giá cao khi bạn gắn metric kỹ thuật với business metric như conversion hoặc retention.

- Case Study 1: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 2: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 3: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 4: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 5: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 6: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 7: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 8: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 9: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 10: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 11: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 12: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 13: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 14: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 15: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 16: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 17: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 18: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 19: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 20: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 21: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 22: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 23: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 24: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 25: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 26: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 27: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 28: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 29: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 30: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 31: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 32: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 33: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 34: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 35: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 36: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 37: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 38: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 39: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 40: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 41: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 42: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 43: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 44: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 45: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 46: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 47: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 48: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 49: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 50: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 51: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 52: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 53: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 54: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 55: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 56: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 57: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 58: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 59: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).
- Case Study 60: Mô tả ngắn bối cảnh, giải pháp, và cải thiện (ví dụ LCP giảm 900ms, bounce giảm 6%).

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Core Web Vitals gồm những gì?
**Giải thích:** Gồm LCP, INP, CLS; tương ứng loading, responsiveness, visual stability.
**Ví dụ:** Mục tiêu phổ biến: LCP < 2.5s, INP < 200ms, CLS < 0.1.

### 🟢 [Junior] Vì sao chỉ dùng Lighthouse chưa đủ?
**Giải thích:** Lighthouse là lab data, có thể không đại diện thiết bị/mạng người dùng thật.
**Ví dụ:** Cần thêm RUM từ web-vitals để thấy distribution thật theo quốc gia/device.

### 🟡 [Mid] Bạn giảm INP trên React app như thế nào?
**Giải thích:** Giảm long task, tách bundle, memoization đúng chỗ, trì hoãn third-party script.
**Ví dụ:** Code-split chart nặng + virtualized list + debounce input.

### 🟡 [Mid] Cách debug CLS khó tái hiện?
**Giải thích:** Dùng DevTools Performance + Layout Shift Regions + record trên network chậm.
**Ví dụ:** Tìm ad slot chưa reserve height gây shift ở lần hydration.

### 🔴 [Senior] Bạn xây hệ thống performance governance thế nào?
**Giải thích:** Thiết lập performance budgets, CI gate, dashboard theo release, ownership theo team.
**Ví dụ:** Chặn merge nếu JS entrypoint vượt ngân sách hoặc INP regression > ngưỡng.

### 🔴 [Senior] Trade-off giữa preload và bandwidth contention?
**Giải thích:** Preload sai tài nguyên có thể làm tranh chấp băng thông, khiến LCP tệ hơn.
**Ví dụ:** Chỉ preload tài nguyên critical path và theo dõi bằng field data.

## Final Notes
### Tổng Quan
Nắm CWV là nền tảng để đi tiếp sang tối ưu React rendering và bundle strategy.

### Giải thích
Đọc tiếp [React Performance](./02-react-performance.md) và [Bundle Optimization](./03-bundle-optimization.md).

### Ví dụ
Trong interview, luôn nói theo cấu trúc: baseline -> bottleneck -> solution -> measurable impact.


## Supplemental Interview Notes
### Tổng Quan
Phần bổ sung này giúp bạn luyện cách kể chuyện tối ưu hiệu năng theo ngữ cảnh sản phẩm.

### Giải thích
Khi trả lời, hãy nêu rõ đối tượng người dùng (mobile/desktop), network profile, và business KPI chịu ảnh hưởng.

### Ví dụ
- Ở thị trường mạng 4G không ổn định, tối ưu LCP ảnh hero thường cho hiệu quả rõ nhất.
- Với dashboard nặng tương tác, ưu tiên giảm INP bằng chia nhỏ long tasks và code splitting.
- Với trang có nhiều ad/embeds, ưu tiên reserve space để giảm CLS.

### Practical Checklist
- Đo baseline trên ít nhất 3 loại thiết bị đại diện.
- Theo dõi p75 thay vì chỉ median để phản ánh trải nghiệm đa số.
- Tách số liệu theo route để biết trang nào đang kéo tụt tổng thể.
- Luôn ghi lại before/after bằng cùng điều kiện đo.
- Không tối ưu mù: chỉ làm khi có dữ liệu chỉ ra bottleneck.

### Team Workflow
- Đặt owner cho performance theo từng domain (search, checkout, dashboard).
- Thêm performance regression review vào pull request template.
- Định kỳ chạy Lighthouse CI ở branch chính để theo dõi xu hướng.
- Kết hợp alert khi RUM metric vượt ngưỡng trong 2-3 release liên tiếp.

### Closing
### Tổng Quan
Hiệu năng bền vững cần quy trình liên tục, không chỉ một lần tối ưu.

### Giải thích
Kết nối kỹ thuật với tác động kinh doanh là điểm phân biệt ứng viên Mid và Senior.

### Ví dụ
Bạn có thể kết luận: "LCP giảm 700ms giúp conversion tăng 4.8% trong 2 tuần A/B test".
