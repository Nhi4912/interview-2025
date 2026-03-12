# Debounce & Throttle

> Implement debounce và throttle functions - một trong những câu hỏi phổ biến nhất.

**Difficulty**: 🟢 Easy
**Time**: 15-20 minutes
**Companies**: All Big Tech

---

## 📋 Problem Statement

### Debounce
Implement a function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

### Throttle
Implement a function that only invokes `func` at most once per every `wait` milliseconds.

---

## 🤔 Questions to Ask

- Should it support leading/trailing edge invocation?
- Should it return a cancel method?
- What about the `this` context?
- Should arguments be passed to the function?

---

## 💡 Solution

### Debounce - Basic

```javascript
function debounce(func, wait) {
  let timeoutId;

  return function (...args) {
    // Clear previous timeout
    clearTimeout(timeoutId);

    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// Usage
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query);
}, 300);

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Debounce - With Options

```javascript
function debounce(func, wait, options = {}) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let lastCallTime;
  let lastInvokeTime = 0;
  let leading = options.leading ?? false;
  let trailing = options.trailing ?? true;
  let maxWait = options.maxWait;

  const invokeFunc = (time) => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    return func.apply(thisArg, args);
  };

  const leadingEdge = (time) => {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : undefined;
  };

  const remainingWait = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  };

  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  };

  const trailingEdge = (time) => {
    timeoutId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return undefined;
  };

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = undefined;
  };

  const flush = () => {
    return timeoutId === undefined ? undefined : trailingEdge(Date.now());
  };

  const debounced = function (...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait);
    }

    return undefined;
  };

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
}
```

---

### Throttle - Basic

```javascript
function throttle(func, wait) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// Usage
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### Throttle - With Leading/Trailing

```javascript
function throttle(func, wait, options = {}) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let lastTime = 0;
  let leading = options.leading ?? true;
  let trailing = options.trailing ?? true;

  const invokeFunc = () => {
    lastTime = Date.now();
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = lastThis = undefined;
    func.apply(thisArg, args);
  };

  const remainingTime = () => {
    return Math.max(0, wait - (Date.now() - lastTime));
  };

  const throttled = function (...args) {
    lastArgs = args;
    lastThis = this;

    const remaining = remainingTime();

    if (remaining === 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      if (leading || lastTime !== 0) {
        invokeFunc();
      } else {
        lastTime = Date.now();
      }
    }

    if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        invokeFunc();
        timeoutId = undefined;
      }, remaining || wait);
    }
  };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    lastTime = 0;
    lastArgs = lastThis = undefined;
  };

  return throttled;
}
```

---

## 📊 Visual Comparison

```
Events:    ─●─●─●─●─●─●─●─●─────────●─●─●─●─●─●────────
Time:      0   100 200 300 400 500   800 900 1000

DEBOUNCE (wait=300ms):
Calls:     ────────────────────●─────────────────────●──
                              ^500                  ^1300

THROTTLE (wait=300ms):
Calls:     ●─────────●─────────●─────●─────────●────────
           ^0       ^300      ^600  ^800     ^1100

THROTTLE with leading=false:
Calls:     ─────────●─────────●────────────────●────────
                   ^300      ^600            ^1100
```

---

## 🧪 Test Cases

```javascript
// Test Debounce
describe('debounce', () => {
  jest.useFakeTimers();

  it('should delay function execution', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).toBeCalledTimes(1);
  });

  it('should reset timer on subsequent calls', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced();
    jest.advanceTimersByTime(50);

    debounced(); // Reset timer
    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).toBeCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);

    debounced('a', 'b');
    jest.advanceTimersByTime(100);

    expect(func).toBeCalledWith('a', 'b');
  });
});

// Test Throttle
describe('throttle', () => {
  jest.useFakeTimers();

  it('should invoke immediately on first call', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled();
    expect(func).toBeCalledTimes(1);
  });

  it('should throttle subsequent calls', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled();
    throttled();
    throttled();

    expect(func).toBeCalledTimes(1);
  });

  it('should allow call after wait period', () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled();
    jest.advanceTimersByTime(100);
    throttled();

    expect(func).toBeCalledTimes(2);
  });
});
```

---

## 🎯 Complexity Analysis

```
DEBOUNCE:
─────────
Time:  O(1) per call
Space: O(1) - stores timeout ID and args

THROTTLE:
─────────
Time:  O(1) per call
Space: O(1) - stores timestamp and args
```

---

## 💼 Real-World Use Cases

```javascript
// Debounce: Search input
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounce((e) => {
  fetchSearchResults(e.target.value);
}, 300));

// Debounce: Window resize
window.addEventListener('resize', debounce(() => {
  recalculateLayout();
}, 150));

// Throttle: Scroll tracking
window.addEventListener('scroll', throttle(() => {
  updateScrollProgress();
}, 100));

// Throttle: Mouse move
document.addEventListener('mousemove', throttle((e) => {
  updateTooltipPosition(e.clientX, e.clientY);
}, 16)); // ~60fps

// Throttle: API rate limiting
const throttledApi = throttle(async (data) => {
  await sendToServer(data);
}, 1000);
```

---

## ❓ Follow-up Questions

1. **How would you implement `leading` and `trailing` options?**
   - Leading: invoke immediately on first call
   - Trailing: invoke after wait period ends

2. **How would you add a `maxWait` option to debounce?**
   - Ensures function is called at least every `maxWait` ms

3. **What about cancellation?**
   - Return object with `cancel()` method
   - Clear timeout on cancel

4. **How does React's `useDeferredValue` differ?**
   - Built into React, integrates with Concurrent Mode
   - Prioritizes UI updates

---

> **Tiếp theo:** [Array Methods](./implement-array-methods.md) | **Quay lại:** [JavaScript Challenges](./README.md)
