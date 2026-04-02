---
layout: page
title: "Remove Comments"
difficulty: Medium
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/remove-comments"
---

# Remove Comments / Xóa Bình Luận

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Phép so sánh:** Giống đọc văn bản với bút highlight — khi gặp `/*` thì che đi tất cả cho đến `*/`, khi gặp `//` thì che phần còn lại của dòng đó.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Remove Comments example:**

```
State machine:
 inBlock=false → scan char by char
   "/*" → set inBlock=true, skip
   "//" → skip rest of line
   else → append to current line
 inBlock=true → scan char by char
   "*/" → set inBlock=false
   else → skip

Line boundary: if !inBlock and currentLine non-empty → push to result
```

---

## Problem Description

Given a C++ source code (array of strings), remove all comments:

- Line comments `//` remove everything after them on the same line
- Block comments `/* ... */` can span multiple lines

Return the source code after removing all comments (empty lines omitted).

**Example 1:**

```
Input:  ["/*Test*/", "int main()", "{ //test", "   cout << s /* s */;", "}"]
Output: ["int main()", "{ ", "   cout << s ;", "}"]
```

**Constraints:** `1 <= source.length <= 100`, each line length `<= 80`

---

## 📝 Interview Tips

- **State machine:** Chỉ cần một flag `inBlock` — 2 trạng thái, không cần stack
- **Block spans lines:** Không thể xử lý từng dòng độc lập — cần duy trì `currentLine` across lines
- **Line boundary:** Chỉ emit `currentLine` khi kết thúc dòng và KHÔNG đang trong block comment
- **Edge case:** `*/` trong `//` không kết thúc block; `//` trong `/* */` cũng bị ignore
- **Two-pointer:** Dùng index `i` trong vòng lặp để nhảy 2 ký tự khi phát hiện `/*` hay `*/`
- **Complexity:** O(n·m) time where n=lines, m=max line length

---

## Solutions

```typescript
function removeComments(source: string[]): string[] {
  const result: string[] = [];
  let inBlock = false;
  let currentLine = "";

  for (const line of source) {
    let i = 0;
    while (i < line.length) {
      if (inBlock) {
        if (line[i] === "*" && line[i + 1] === "/") {
          inBlock = false;
          i += 2;
        } else {
          i++;
        }
      } else {
        if (line[i] === "/" && line[i + 1] === "*") {
          inBlock = true;
          i += 2;
        } else if (line[i] === "/" && line[i + 1] === "/") {
          break; // skip rest of line
        } else {
          currentLine += line[i];
          i++;
        }
      }
    }

    // End of line: emit if not inside block comment
    if (!inBlock && currentLine.length > 0) {
      result.push(currentLine);
      currentLine = "";
    }
  }

  return result;
}

function removeComments(source: string[]): string[] {
  // Join with sentinel newlines to preserve line info
  const lines: string[] = [];
  let inBlock = false;
  let buf = "";

  for (const line of source) {
    for (let i = 0; i < line.length; ) {
      const two = line.slice(i, i + 2);
      if (!inBlock && two === "/*") {
        inBlock = true;
        i += 2;
      } else if (!inBlock && two === "//") {
        break;
      } else if (inBlock && two === "*/") {
        inBlock = false;
        i += 2;
      } else if (!inBlock) {
        buf += line[i];
        i++;
      } else {
        i++;
      }
    }
    if (!inBlock && buf !== "") {
      lines.push(buf);
      buf = "";
    }
  }

  return lines;
}
```

---

## 🔗 Related Problems

| #    | Problem                     | Difficulty | Tags               |
| ---- | --------------------------- | ---------- | ------------------ |
| 68   | Text Justification          | Hard       | String, Simulation |
| 271  | Encode and Decode Strings   | Medium     | String             |
| 722  | Remove Comments             | Medium     | String             |
| 1119 | Remove Vowels from a String | Easy       | String             |
