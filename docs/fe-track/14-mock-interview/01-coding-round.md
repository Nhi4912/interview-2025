# Mock Interview — Coding Round / Vòng Coding Mô Phỏng

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **L5 Competencies**: Problem-Solving (15pts), Technical Mastery (20pts)
> **See also**: [Problem-Solving Meta Guide](../13-coding-practice/00-problem-solving-meta-guide.md) | [LeetCode Patterns](../../leetcode/00-patterns-index.md)

---

## How to Use / Cách Dùng

1. Set timer: **45 minutes** per problem set
2. No IDE autocomplete — dùng plain text editor hoặc whiteboard
3. **Say your thoughts out loud** (record if practicing alone)
4. After finishing, self-evaluate using the rubric at the bottom
5. Practice each set on separate days — don't binge

---

## Round 1: Algorithm — Sliding Window + Hash Map (🟡 Medium)

### Problem: Longest Substring with At Most K Distinct Characters

Given a string `s` and integer `k`, find the length of the longest substring containing at most `k` distinct characters.

```
Example 1: s = "eceba", k = 2 → Output: 3 ("ece")
Example 2: s = "aa", k = 1 → Output: 2 ("aa")
Example 3: s = "aabbcc", k = 3 → Output: 6 ("aabbcc")
```

**Constraints:** 1 ≤ s.length ≤ 10⁵, 1 ≤ k ≤ 26

#### Expected Process (UNPACK)

<details>
<summary>🔑 Pattern Recognition Hints</summary>

- Signal: "longest substring" → Sliding Window
- Signal: "at most K distinct" → Hash Map for frequency tracking
- Approach: Expand window right, shrink left when distinct > k
- Complexity: O(n) time, O(k) space

</details>

<details>
<summary>🔑 Solution</summary>

```javascript
function longestSubstringKDistinct(s, k) {
  if (k === 0 || s.length === 0) return 0;

  const charCount = new Map();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    // Expand: add right char
    charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);

    // Shrink: while too many distinct chars
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) charCount.delete(leftChar);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
// Time: O(n), Space: O(k)
```

</details>

#### Follow-up Questions (Interviewer would ask)

1. "What if the string contains Unicode characters, not just ASCII?"
2. "Can you do this in O(1) space?" (Hint: if k and alphabet are bounded)
3. "What if instead of 'at most K distinct', it's 'exactly K distinct'?"

---

## Round 2: Frontend Implementation — Debounced Search (🟡 Mid)

### Problem: Build a Search Input with Debounce

Implement a `useDebounce` hook and use it to build a search input that:
- Debounces API calls by 300ms
- Shows loading state
- Handles race conditions (out-of-order responses)
- Displays results in a dropdown

```
Requirements:
1. useDebounce(value, delay) hook
2. Search component using the hook
3. Handle: empty input, loading, error, results
4. Cancel previous pending requests
```

<details>
<summary>🔑 Solution</summary>

```javascript
// useDebounce.js
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// SearchInput.jsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    // Cancel previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        setResults(data.results);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
        aria-label="Search"
      />
      {loading && <div role="status">Loading...</div>}
      {error && <div role="alert">{error}</div>}
      {results.length > 0 && (
        <ul role="listbox">
          {results.map(item => (
            <li key={item.id} role="option">{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Key evaluation points:**
- ✅ AbortController for race conditions
- ✅ Cleanup on unmount
- ✅ Empty query handling
- ✅ Accessibility (aria-label, role)
- ✅ Error handling (not just happy path)

</details>

#### Follow-up Questions

1. "How would you add keyboard navigation (arrow keys) to the dropdown?"
2. "How would you cache previous search results?"
3. "How would you test this component?"

---

## Round 3: Algorithm — Dynamic Programming (🔴 Hard)

### Problem: Word Break

Given a string `s` and a dictionary of words `wordDict`, determine if `s` can be segmented into a space-separated sequence of dictionary words.

```
Example 1: s = "leetcode", wordDict = ["leet","code"] → true
Example 2: s = "applepenapple", wordDict = ["apple","pen"] → true
Example 3: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"] → false
```

<details>
<summary>🔑 Pattern Recognition</summary>

- Signal: "can be segmented" → can/cannot decision → DP
- Signal: substring checking → prefix/suffix decomposition
- State: dp[i] = "can s[0..i-1] be segmented?"
- Transition: dp[i] = true if any dp[j] == true AND s[j..i] is in dict

</details>

<details>
<summary>🔑 Solution</summary>

```javascript
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true; // empty string can be segmented

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break; // found one valid segmentation, enough
      }
    }
  }

  return dp[s.length];
}
// Time: O(n² × k) where k = avg word length for substring
// Space: O(n + m) where m = dict size
```

**Optimization:** Check only substrings up to max word length:
```javascript
function wordBreakOptimized(s, wordDict) {
  const wordSet = new Set(wordDict);
  const maxLen = Math.max(...wordDict.map(w => w.length));
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = Math.max(0, i - maxLen); j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}
```

</details>

#### Follow-up Questions

1. "Return ALL possible segmentations (not just true/false)" → Backtracking + memoization
2. "What if the dictionary is very large (1M words)?" → Trie instead of HashSet
3. "Can you solve this with BFS instead of DP?"

---

## Evaluation Rubric / Bảng Đánh Giá

Score yourself after each round:

| Criterion | 1 (Weak) | 2 (Developing) | 3 (Strong) | 4 (Excellent) |
|-----------|----------|----------------|------------|----------------|
| **Understanding** | Misread problem, wrong assumptions | Understood but missed edge cases | Correct understanding, asked 1-2 constraints | Full UNPACK: paraphrase + 3+ constraints |
| **Pattern** | No pattern recognized | Eventually found pattern with hints | Identified pattern within 3 min | Instant recognition + stated alternatives |
| **Communication** | Silent coding | Occasional narration | Consistent think-aloud | Structured narration at every stage |
| **Code Quality** | Buggy, unclear names | Works but messy | Clean, readable, handles edges | Production-quality + explains design choices |
| **Complexity** | Can't analyze | Stated but incorrect | Correct time + space | Correct + optimization discussion |
| **Testing** | No testing | Tested happy path only | Tested 2-3 edge cases | Systematic: empty, single, boundary, large |

**Target scores:** 🟡 Mid = average 2.5+, 🔴 Senior = average 3.5+

---

## Connections / Liên Kết

- ⬅️ **Preparation**: [Problem-Solving Meta Guide](../13-coding-practice/00-problem-solving-meta-guide.md)
- 🔗 **Patterns**: [LeetCode Patterns Index](../../leetcode/00-patterns-index.md)
- ➡️ **Next round**: [System Design Mock](./02-system-design-round.md) | [Behavioral Mock](./03-behavioral-round.md)
