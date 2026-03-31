---
layout: page
title: "Defanging an IP Address"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/defanging-an-ip-address"
---

# Defanging an IP Address / Vô Hiệu Hóa Địa Chỉ IP

## Tóm tắt bằng tiếng Việt

Cho địa chỉ IP hợp lệ, trả về phiên bản "defanged" bằng cách thay thế mỗi dấu `"."` bằng `"[.]"`. Kỹ thuật này thường dùng trong bảo mật để ngăn chặn URL tự động kích hoạt.

**Ví dụ:** `"1.1.1.1"` → `"1[.]1[.]1[.]1"`.

## Tương tự thực tế

> Như che số điện thoại trong văn bản: thay `"."` bằng `"[.]"` để địa chỉ IP không còn có thể click-to-navigate, ngăn bot tự động truy cập vào link độc hại.

## Minh họa ASCII

```
Input:  "255.100.50.0"
         ↑   ↑   ↑
        dots to replace

Output: "255[.]100[.]50[.]0"
           ^^^   ^^^  ^^^
         each '.' → '[.]'

Step by step:
'2','5','5' → keep
'.'         → → '[.]'
'1','0','0' → keep
'.'         → → '[.]'
'5','0'     → keep
'.'         → → '[.]'
'0'         → keep
```

## Mô tả bài toán

- Cho chuỗi `address` là địa chỉ IPv4 hợp lệ.
- Trả về chuỗi với mỗi `"."` được thay bằng `"[.]"`.

**Constraints:** `address` là IPv4 hợp lệ.

## Tips phỏng vấn

1. **replaceAll** — `address.replaceAll('.', '[.]')` là cách đơn giản nhất.
2. **replace với regex** — `address.replace(/\./g, '[.]')` (cần escape dấu `.`).
3. **split + join** — `address.split('.').join('[.]')` rất trực quan.
4. **Escape dấu `.`** — trong regex, `.` có nghĩa đặc biệt, cần `\.`.
5. **Không dùng loop** — built-in string methods là tốt nhất cho bài này.
6. **Hiểu ứng dụng** — "defanging" là kỹ thuật bảo mật thực tế (threat intelligence reports).

## Giải pháp

### Giải pháp 1: replaceAll (Hiện đại, ES2021+)

```typescript
function defangIPaddr(address: string): string {
  return address.replaceAll(".", "[.]");
}

// Test cases
console.log(defangIPaddr("1.1.1.1")); // "1[.]1[.]1[.]1"
console.log(defangIPaddr("255.100.50.0")); // "255[.]100[.]50[.]0"
console.log(defangIPaddr("192.168.1.1")); // "192[.]168[.]1[.]1"
console.log(defangIPaddr("0.0.0.0")); // "0[.]0[.]0[.]0"
```

### Giải pháp 2: split + join (Phổ biến nhất)

```typescript
function defangIPaddrSplit(address: string): string {
  return address.split(".").join("[.]");
}

console.log(defangIPaddrSplit("1.1.1.1")); // "1[.]1[.]1[.]1"
console.log(defangIPaddrSplit("255.100.50.0")); // "255[.]100[.]50[.]0"
console.log(defangIPaddrSplit("192.168.1.1")); // "192[.]168[.]1[.]1"
```

### Giải pháp 3: Regex replace

```typescript
function defangIPaddrRegex(address: string): string {
  // Escape '.' in regex with backslash
  return address.replace(/\./g, "[.]");
}

console.log(defangIPaddrRegex("1.1.1.1")); // "1[.]1[.]1[.]1"
console.log(defangIPaddrRegex("255.100.50.0")); // "255[.]100[.]50[.]0"
```

### Giải pháp 4: Manual loop (Để hiểu cơ chế)

```typescript
function defangIPaddrManual(address: string): string {
  const result: string[] = [];

  for (let i = 0; i < address.length; i++) {
    if (address[i] === ".") {
      result.push("[", ".", "]");
    } else {
      result.push(address[i]);
    }
  }

  return result.join("");
}

console.log(defangIPaddrManual("1.1.1.1")); // "1[.]1[.]1[.]1"
console.log(defangIPaddrManual("255.100.50.0")); // "255[.]100[.]50[.]0"

// Reverse operation (re-fang)
function refangIPaddr(defanged: string): string {
  return defanged.replace(/\[\.]/g, ".");
}

const ip = "192.168.1.1";
const defanged = defangIPaddr(ip);
console.log(defanged); // "192[.]168[.]1[.]1"
console.log(refangIPaddr(defanged) === ip); // true
```

## Bảng so sánh

| Giải pháp     | Thời gian | Không gian | Ghi chú                     |
| ------------- | --------- | ---------- | --------------------------- |
| replaceAll    | O(n)      | O(n)       | Ngắn gọn, ES2021+           |
| split + join  | O(n)      | O(n)       | Phổ biến, tất cả môi trường |
| Regex replace | O(n)      | O(n)       | Cần escape                  |
| Manual loop   | O(n)      | O(n)       | Trực quan nhất              |

## Bài liên quan

| #    | Tên                                | Độ khó | Tags   |
| ---- | ---------------------------------- | ------ | ------ |
| 1221 | Split a String in Balanced Strings | Easy   | String |
| 1108 | Defanging an IP Address            | Easy   | String |
| 2288 | Apply Discount to Prices           | Medium | String |
