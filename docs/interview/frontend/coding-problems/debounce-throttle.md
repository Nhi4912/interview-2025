# Debounce and Throttle Implementation

## Problem Description

Implement debounce and throttle functions for performance optimization.

## Requirements

- Debounce: Delay function execution until after a pause
- Throttle: Limit function execution to once per time period
- Handle edge cases
- Support immediate execution option
- Cancel functionality

## Solution

{% raw %}
```javascript
class FunctionOptimizer {
  static debounce(func, delay, immediate = false) {
    let timeoutId;

    return function (...args) {
      const context = this;

      const later = function () {
        timeoutId = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeoutId;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(later, delay);

      if (callNow) func.apply(context, args);
    };
  }

  static throttle(func, limit, options = {}) {
    let inThrottle;
    let lastFunc;
    let lastRan;

    const { leading = true, trailing = true } = options;

    return function (...args) {
      const context = this;

      if (!inThrottle) {
        if (leading) {
          func.apply(context, args);
        }
        lastRan = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            if (trailing) {
              func.apply(context, args);
            }
            inThrottle = false;
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  static debounceWithCancel(func, delay, immediate = false) {
    let timeoutId;

    const debounced = function (...args) {
      const context = this;

      const later = function () {
        timeoutId = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeoutId;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(later, delay);

      if (callNow) func.apply(context, args);
    };

    debounced.cancel = function () {
      clearTimeout(timeoutId);
      timeoutId = null;
    };

    return debounced;
  }

  static throttleWithCancel(func, limit, options = {}) {
    let inThrottle;
    let lastFunc;
    let lastRan;

    const { leading = true, trailing = true } = options;

    const throttled = function (...args) {
      const context = this;

      if (!inThrottle) {
        if (leading) {
          func.apply(context, args);
        }
        lastRan = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            if (trailing) {
              func.apply(context, args);
            }
            inThrottle = false;
          }
        }, limit - (Date.now() - lastRan));
      }
    };

    throttled.cancel = function () {
      clearTimeout(lastFunc);
      inThrottle = false;
      lastRan = 0;
    };

    return throttled;
  }
}

// Usage examples
class SearchComponent {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.resultsContainer = document.getElementById("search-results");

    // Debounced search
    this.debouncedSearch = FunctionOptimizer.debounce(
      this.performSearch.bind(this),
      300
    );

    // Throttled scroll handler
    this.throttledScroll = FunctionOptimizer.throttle(
      this.handleScroll.bind(this),
      100
    );

    this.init();
  }

  init() {
    this.searchInput.addEventListener("input", this.debouncedSearch);
    window.addEventListener("scroll", this.throttledScroll);
  }

  async performSearch(query) {
    console.log("Searching for:", query);

    // Simulate API call
    const results = await this.fetchSearchResults(query);
    this.displayResults(results);
  }

  async fetchSearchResults(query) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      { id: 1, title: `Result 1 for ${query}` },
      { id: 2, title: `Result 2 for ${query}` },
      { id: 3, title: `Result 3 for ${query}` },
    ];
  }

  displayResults(results) {
    this.resultsContainer.innerHTML = results
      .map((result) => `<div class="result-item">${result.title}</div>`)
      .join("");
  }

  handleScroll() {
    console.log("Scroll position:", window.pageYOffset);
    // Handle scroll-based functionality
  }
}

// Advanced usage with cancel functionality
class AdvancedSearchComponent {
  constructor() {
    this.searchInput = document.getElementById("advanced-search-input");
    this.resultsContainer = document.getElementById("advanced-search-results");

    // Debounced search with cancel
    this.debouncedSearch = FunctionOptimizer.debounceWithCancel(
      this.performAdvancedSearch.bind(this),
      500
    );

    this.init();
  }

  init() {
    this.searchInput.addEventListener("input", (e) => {
      this.debouncedSearch(e.target.value);
    });

    // Cancel search on blur
    this.searchInput.addEventListener("blur", () => {
      this.debouncedSearch.cancel();
    });
  }

  async performAdvancedSearch(query) {
    if (!query.trim()) {
      this.resultsContainer.innerHTML = "";
      return;
    }

    console.log("Advanced search for:", query);

    // Simulate complex search
    const results = await this.fetchAdvancedResults(query);
    this.displayAdvancedResults(results);
  }

  async fetchAdvancedResults(query) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return [
      { id: 1, title: `Advanced result 1 for ${query}`, score: 0.95 },
      { id: 2, title: `Advanced result 2 for ${query}`, score: 0.87 },
      { id: 3, title: `Advanced result 3 for ${query}`, score: 0.76 },
    ];
  }

  displayAdvancedResults(results) {
    this.resultsContainer.innerHTML = results
      .map(
        (result) => `
        <div class="advanced-result-item">
          <span class="result-title">${result.title}</span>
          <span class="result-score">${(result.score * 100).toFixed(0)}%</span>
        </div>
      `
      )
      .join("");
  }
}
```
{% endraw %}

## CSS Styling

```css
.search-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-results {
  margin-top: 20px;
}

.result-item {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 8px;
  background: white;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.advanced-result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 8px;
  background: white;
}

.result-score {
  color: #007bff;
  font-weight: 600;
  font-size: 14px;
}
```

## Key Features

1. **Debounce**: Delays function execution until user stops typing
2. **Throttle**: Limits function execution to prevent excessive calls
3. **Cancel Support**: Allows cancellation of pending executions
4. **Immediate Option**: Supports immediate execution for debounce
5. **Leading/Trailing**: Configurable execution timing for throttle
6. **Context Preservation**: Maintains proper `this` context

## Performance Benefits

- **Reduced API Calls**: Debounce prevents excessive search requests
- **Smooth Scrolling**: Throttle ensures smooth scroll performance
- **Memory Efficiency**: Proper cleanup prevents memory leaks
- **User Experience**: Responsive interface with appropriate delays

## Advanced Patterns

```javascript
// Custom debounce with different strategies
class CustomDebounce {
  static withMaxWait(func, delay, maxWait) {
    let timeoutId;
    let lastCallTime = 0;

    return function (...args) {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTime;

      clearTimeout(timeoutId);

      if (timeSinceLastCall >= maxWait) {
        func.apply(this, args);
        lastCallTime = now;
      } else {
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastCallTime = Date.now();
        }, delay);
      }
    };
  }

  static withQueue(func, delay, maxQueueSize = 10) {
    let timeoutId;
    let queue = [];

    return function (...args) {
      if (queue.length >= maxQueueSize) {
        queue.shift(); // Remove oldest item
      }

      queue.push(args);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentQueue = [...queue];
        queue = [];
        currentQueue.forEach((args) => func.apply(this, args));
      }, delay);
    };
  }
}

// Usage examples
const searchWithMaxWait = CustomDebounce.withMaxWait(
  performSearch,
  300,
  2000 // Max wait of 2 seconds
);

const searchWithQueue = CustomDebounce.withQueue(
  performSearch,
  300,
  5 // Max 5 items in queue
);
```
