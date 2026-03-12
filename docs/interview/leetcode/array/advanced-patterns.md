---
layout: page
title: "Advanced Array Patterns for FAANG Interviews"
difficulty: Medium-Hard
category: Array
tags: [Array, Two Pointers, Sliding Window, Prefix Sum, Hash Map]
companies: [Google, Meta, Amazon, Microsoft, Apple]
---

# Advanced Array Patterns for FAANG Interviews

## 🎯 Core Patterns Every Mid-Level Developer Must Master

### 1. Sliding Window Technique

**When to Use:** Subarray/substring problems with contiguous elements
**Time Complexity:** O(n) instead of O(n²)

#### Pattern Template:
```typescript
function slidingWindow(arr: number[], target: number): number {
    let left = 0, right = 0;
    let windowSum = 0;
    let result = 0;
    
    while (right < arr.length) {
        // Expand window
        windowSum += arr[right];
        
        // Contract window if needed
        while (windowSum > target) {
            windowSum -= arr[left];
            left++;
        }
        
        // Update result
        result = Math.max(result, right - left + 1);
        right++;
    }
    
    return result;
}
```

#### FAANG Interview Problems:

**Google Favorite:** Longest Substring Without Repeating Characters
```typescript
function lengthOfLongestSubstring(s: string): number {
    const charSet = new Set<string>();
    let left = 0, maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Test cases for interview
console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb")); // 1
console.log(lengthOfLongestSubstring("pwwkew")); // 3
```

**Meta Favorite:** Minimum Window Substring
```typescript
function minWindow(s: string, t: string): string {
    if (s.length < t.length) return "";
    
    const targetCount = new Map<string, number>();
    for (const char of t) {
        targetCount.set(char, (targetCount.get(char) || 0) + 1);
    }
    
    let left = 0, right = 0;
    let formed = 0;
    const required = targetCount.size;
    const windowCounts = new Map<string, number>();
    
    let minLen = Infinity;
    let minLeft = 0;
    
    while (right < s.length) {
        const char = s[right];
        windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
        
        if (targetCount.has(char) && windowCounts.get(char) === targetCount.get(char)) {
            formed++;
        }
        
        while (left <= right && formed === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            
            const leftChar = s[left];
            windowCounts.set(leftChar, windowCounts.get(leftChar)! - 1);
            if (targetCount.has(leftChar) && windowCounts.get(leftChar)! < targetCount.get(leftChar)!) {
                formed--;
            }
            left++;
        }
        right++;
    }
    
    return minLen === Infinity ? "" : s.substring(minLeft, minLeft + minLen);
}
```

### 2. Two Pointers Mastery

#### Amazon's Favorite: Container With Most Water
```typescript
function maxArea(height: number[]): number {
    let left = 0, right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const width = right - left;
        const currentWater = Math.min(height[left], height[right]) * width;
        maxWater = Math.max(maxWater, currentWater);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Interview follow-up: What if we need to find the actual container positions?
function maxAreaWithPositions(height: number[]): [number, number, number] {
    let left = 0, right = height.length - 1;
    let maxWater = 0;
    let bestLeft = 0, bestRight = 0;
    
    while (left < right) {
        const width = right - left;
        const currentWater = Math.min(height[left], height[right]) * width;
        
        if (currentWater > maxWater) {
            maxWater = currentWater;
            bestLeft = left;
            bestRight = right;
        }
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return [maxWater, bestLeft, bestRight];
}
```

## 🔥 FAANG-Specific Problem Patterns

### Google: Focus on Optimal Solutions
- Always ask about time/space complexity
- Prefer O(n) solutions over O(n log n)
- Master bit manipulation for optimization

### Meta: React-Related Array Problems
- Virtual scrolling implementations
- Efficient list rendering
- State management with arrays

### Amazon: Leadership Principles in Code
- Write clean, maintainable solutions
- Consider edge cases thoroughly
- Optimize for customer experience (performance)

## 📊 Interview Success Metrics

**For Mid-Level (3-5 years):**
- Solve 80% of Medium problems in 25-30 minutes
- Solve 40% of Hard problems in 45 minutes
- Explain time/space complexity clearly
- Provide multiple approaches when possible

## 🎯 Practice Schedule

**Week 1-2:** Master sliding window (15 problems)
**Week 3-4:** Perfect two pointers (20 problems)
**Week 5-6:** Advanced patterns combination (10 problems)

## 💡 Pro Tips for FAANG Interviews

1. **Always clarify constraints first**
2. **Start with brute force, then optimize**
3. **Think out loud during problem solving**
4. **Test with edge cases**
5. **Discuss trade-offs between solutions**