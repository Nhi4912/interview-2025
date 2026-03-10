# Functional Reactive Programming (FRP)

## Table of Contents
- [Core Concepts](#core-concepts)
- [Observables](#observables)
- [Operators](#operators)
- [Subjects](#subjects)
- [Schedulers](#schedulers)
- [Error Handling](#error-handling)
- [Backpressure](#backpressure)
- [Hot vs Cold Observables](#hot-vs-cold-observables)
- [Marble Diagrams](#marble-diagrams)
- [Real-World Patterns](#real-world-patterns)

## Core Concepts

### What is FRP?

**Definition**: A programming paradigm for working with asynchronous data streams using functional programming principles.

**Key Principles**:
```
1. Everything is a stream
2. Streams are composable
3. Operations are pure functions
4. Time is a first-class concept
5. Declarative over imperative
```

**Stream Anatomy**:
```
Stream: ---a---b---c---d--->
        |   |   |   |   |
        |   |   |   |   Complete
        |   |   |   Value
        |   |   Value
        |   Value
        Value
```

### Reactive Programming Fundamentals

**Push vs Pull**:
```javascript
// Pull (Iterator pattern)
const iterator = [1, 2, 3][Symbol.iterator]();
console.log(iterator.next().value); // 1
console.log(iterator.next().value); // 2

// Push (Observer pattern)
const observable = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
});
```

**Observable Contract**:
```
next*(error|complete)?

- Zero or more next notifications
- Followed by either error OR complete (not both)
- Nothing after error or complete
```

## Observables

### Basic Implementation

```javascript
class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer) {
    // Normalize observer
    const safeObserver = {
      next: observer.next?.bind(observer) || (() => {}),
      error: observer.error?.bind(observer) || (err => { throw err; }),
      complete: observer.complete?.bind(observer) || (() => {})
    };

    // Execute subscription
    const subscription = this._subscribe(safeObserver);

    // Return subscription object
    return {
      unsubscribe: () => {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
      }
    };
  }

  // Static creation methods
  static of(...values) {
    return new Observable(observer => {
      values.forEach(value => observer.next(value));
      observer.complete();
    });
  }

  static from(iterable) {
    return new Observable(observer => {
      try {
        for (const value of iterable) {
          observer.next(value);
        }
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  static fromEvent(element, eventName) {
    return new Observable(observer => {
      const handler = event => observer.next(event);
      element.addEventListener(eventName, handler);

      return {
        unsubscribe: () => {
          element.removeEventListener(eventName, handler);
        }
      };
    });
  }

  static interval(period) {
    return new Observable(observer => {
      let count = 0;
      const id = setInterval(() => {
        observer.next(count++);
      }, period);

      return {
        unsubscribe: () => clearInterval(id)
      };
    });
  }

  static timer(delay, period) {
    return new Observable(observer => {
      const timeoutId = setTimeout(() => {
        observer.next(0);
        
        if (period !== undefined) {
          let count = 1;
          const intervalId = setInterval(() => {
            observer.next(count++);
          }, period);
          
          observer.subscription = {
            unsubscribe: () => clearInterval(intervalId)
          };
        } else {
          observer.complete();
        }
      }, delay);

      return {
        unsubscribe: () => {
          clearTimeout(timeoutId);
          if (observer.subscription) {
            observer.subscription.unsubscribe();
          }
        }
      };
    });
  }
}
```

### Creation Operators

```javascript
// defer - Lazy creation
Observable.defer = (factory) => {
  return new Observable(observer => {
    const observable = factory();
    return observable.subscribe(observer);
  });
};

// range
Observable.range = (start, count) => {
  return new Observable(observer => {
    for (let i = 0; i < count; i++) {
      observer.next(start + i);
    }
    observer.complete();
  });
};

// generate
Observable.generate = (initialState, condition, iterate, resultSelector) => {
  return new Observable(observer => {
    let state = initialState;
    
    while (condition(state)) {
      observer.next(resultSelector(state));
      state = iterate(state);
    }
    
    observer.complete();
  });
};

// Usage
const fibonacci = Observable.generate(
  [0, 1],                           // initial state
  ([a, b]) => b < 100,              // condition
  ([a, b]) => [b, a + b],           // iterate
  ([a, b]) => a                     // result selector
);
```

## Operators

### Transformation Operators

```javascript
// map
Observable.prototype.map = function(project) {
  return new Observable(observer => {
    return this.subscribe({
      next: value => observer.next(project(value)),
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};

// flatMap (mergeMap)
Observable.prototype.flatMap = function(project) {
  return new Observable(observer => {
    let activeSubscriptions = 0;
    let completed = false;

    const checkComplete = () => {
      if (completed && activeSubscriptions === 0) {
        observer.complete();
      }
    };

    const subscription = this.subscribe({
      next: value => {
        activeSubscriptions++;
        
        const innerObservable = project(value);
        innerObservable.subscribe({
          next: innerValue => observer.next(innerValue),
          error: err => observer.error(err),
          complete: () => {
            activeSubscriptions--;
            checkComplete();
          }
        });
      },
      error: err => observer.error(err),
      complete: () => {
        completed = true;
        checkComplete();
      }
    });

    return subscription;
  });
};

// switchMap
Observable.prototype.switchMap = function(project) {
  return new Observable(observer => {
    let innerSubscription = null;
    let completed = false;

    const subscription = this.subscribe({
      next: value => {
        // Unsubscribe from previous inner observable
        if (innerSubscription) {
          innerSubscription.unsubscribe();
        }

        const innerObservable = project(value);
        innerSubscription = innerObservable.subscribe({
          next: innerValue => observer.next(innerValue),
          error: err => observer.error(err),
          complete: () => {
            innerSubscription = null;
            if (completed) {
              observer.complete();
            }
          }
        });
      },
      error: err => observer.error(err),
      complete: () => {
        completed = true;
        if (!innerSubscription) {
          observer.complete();
        }
      }
    });

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        if (innerSubscription) {
          innerSubscription.unsubscribe();
        }
      }
    };
  });
};

// scan (like reduce but emits intermediate values)
Observable.prototype.scan = function(accumulator, seed) {
  return new Observable(observer => {
    let acc = seed;
    let hasSeed = arguments.length >= 2;
    let index = 0;

    return this.subscribe({
      next: value => {
        if (!hasSeed) {
          acc = value;
          hasSeed = true;
        } else {
          acc = accumulator(acc, value, index++);
        }
        observer.next(acc);
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};
```

### Filtering Operators

```javascript
// filter
Observable.prototype.filter = function(predicate) {
  return new Observable(observer => {
    let index = 0;
    return this.subscribe({
      next: value => {
        if (predicate(value, index++)) {
          observer.next(value);
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};

// take
Observable.prototype.take = function(count) {
  return new Observable(observer => {
    let taken = 0;
    const subscription = this.subscribe({
      next: value => {
        if (taken < count) {
          observer.next(value);
          taken++;
          if (taken === count) {
            observer.complete();
            subscription.unsubscribe();
          }
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
    return subscription;
  });
};

// takeUntil
Observable.prototype.takeUntil = function(notifier) {
  return new Observable(observer => {
    const subscription = this.subscribe(observer);
    
    const notifierSubscription = notifier.subscribe({
      next: () => {
        observer.complete();
        subscription.unsubscribe();
        notifierSubscription.unsubscribe();
      },
      error: err => observer.error(err)
    });

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        notifierSubscription.unsubscribe();
      }
    };
  });
};

// skip
Observable.prototype.skip = function(count) {
  return new Observable(observer => {
    let skipped = 0;
    return this.subscribe({
      next: value => {
        if (skipped >= count) {
          observer.next(value);
        } else {
          skipped++;
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};

// distinct
Observable.prototype.distinct = function(keySelector) {
  return new Observable(observer => {
    const seen = new Set();
    
    return this.subscribe({
      next: value => {
        const key = keySelector ? keySelector(value) : value;
        if (!seen.has(key)) {
          seen.add(key);
          observer.next(value);
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};

// distinctUntilChanged
Observable.prototype.distinctUntilChanged = function(compare) {
  return new Observable(observer => {
    let hasValue = false;
    let lastValue;
    
    const defaultCompare = (a, b) => a === b;
    const compareFn = compare || defaultCompare;

    return this.subscribe({
      next: value => {
        if (!hasValue || !compareFn(value, lastValue)) {
          hasValue = true;
          lastValue = value;
          observer.next(value);
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};
```

### Combination Operators

```javascript
// merge
Observable.merge = (...observables) => {
  return new Observable(observer => {
    let completed = 0;
    const subscriptions = observables.map(obs =>
      obs.subscribe({
        next: value => observer.next(value),
        error: err => observer.error(err),
        complete: () => {
          completed++;
          if (completed === observables.length) {
            observer.complete();
          }
        }
      })
    );

    return {
      unsubscribe: () => {
        subscriptions.forEach(sub => sub.unsubscribe());
      }
    };
  });
};

// concat
Observable.concat = (...observables) => {
  return new Observable(observer => {
    let currentIndex = 0;
    let currentSubscription;

    const subscribeNext = () => {
      if (currentIndex >= observables.length) {
        observer.complete();
        return;
      }

      currentSubscription = observables[currentIndex].subscribe({
        next: value => observer.next(value),
        error: err => observer.error(err),
        complete: () => {
          currentIndex++;
          subscribeNext();
        }
      });
    };

    subscribeNext();

    return {
      unsubscribe: () => {
        if (currentSubscription) {
          currentSubscription.unsubscribe();
        }
      }
    };
  });
};

// combineLatest
Observable.combineLatest = (...observables) => {
  return new Observable(observer => {
    const values = new Array(observables.length);
    const hasValue = new Array(observables.length).fill(false);
    let completed = 0;

    const subscriptions = observables.map((obs, index) =>
      obs.subscribe({
        next: value => {
          values[index] = value;
          hasValue[index] = true;
          
          if (hasValue.every(Boolean)) {
            observer.next([...values]);
          }
        },
        error: err => observer.error(err),
        complete: () => {
          completed++;
          if (completed === observables.length) {
            observer.complete();
          }
        }
      })
    );

    return {
      unsubscribe: () => {
        subscriptions.forEach(sub => sub.unsubscribe());
      }
    };
  });
};

// zip
Observable.zip = (...observables) => {
  return new Observable(observer => {
    const buffers = observables.map(() => []);
    let completed = 0;

    const tryEmit = () => {
      if (buffers.every(buffer => buffer.length > 0)) {
        const values = buffers.map(buffer => buffer.shift());
        observer.next(values);
        tryEmit(); // Try to emit more
      } else if (completed === observables.length) {
        observer.complete();
      }
    };

    const subscriptions = observables.map((obs, index) =>
      obs.subscribe({
        next: value => {
          buffers[index].push(value);
          tryEmit();
        },
        error: err => observer.error(err),
        complete: () => {
          completed++;
          tryEmit();
        }
      })
    );

    return {
      unsubscribe: () => {
        subscriptions.forEach(sub => sub.unsubscribe());
      }
    };
  });
};
```

### Utility Operators

```javascript
// delay
Observable.prototype.delay = function(duration) {
  return new Observable(observer => {
    const subscription = this.subscribe({
      next: value => {
        setTimeout(() => observer.next(value), duration);
      },
      error: err => {
        setTimeout(() => observer.error(err), duration);
      },
      complete: () => {
        setTimeout(() => observer.complete(), duration);
      }
    });

    return subscription;
  });
};

// debounceTime
Observable.prototype.debounceTime = function(duration) {
  return new Observable(observer => {
    let timeoutId;
    
    const subscription = this.subscribe({
      next: value => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          observer.next(value);
        }, duration);
      },
      error: err => observer.error(err),
      complete: () => {
        clearTimeout(timeoutId);
        observer.complete();
      }
    });

    return {
      unsubscribe: () => {
        clearTimeout(timeoutId);
        subscription.unsubscribe();
      }
    };
  });
};

// throttleTime
Observable.prototype.throttleTime = function(duration) {
  return new Observable(observer => {
    let lastEmit = 0;
    
    return this.subscribe({
      next: value => {
        const now = Date.now();
        if (now - lastEmit >= duration) {
          lastEmit = now;
          observer.next(value);
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};

// tap (do)
Observable.prototype.tap = function(sideEffect) {
  return new Observable(observer => {
    return this.subscribe({
      next: value => {
        sideEffect(value);
        observer.next(value);
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });
  });
};
```

## Subjects

### Subject Implementation

```javascript
class Subject extends Observable {
  constructor() {
    super(observer => {
      this.observers.add(observer);
      return {
        unsubscribe: () => {
          this.observers.delete(observer);
        }
      };
    });
    
    this.observers = new Set();
    this.isStopped = false;
  }

  next(value) {
    if (this.isStopped) return;
    
    this.observers.forEach(observer => {
      observer.next(value);
    });
  }

  error(err) {
    if (this.isStopped) return;
    
    this.isStopped = true;
    this.observers.forEach(observer => {
      observer.error(err);
    });
    this.observers.clear();
  }

  complete() {
    if (this.isStopped) return;
    
    this.isStopped = true;
    this.observers.forEach(observer => {
      observer.complete();
    });
    this.observers.clear();
  }
}
```

### BehaviorSubject

```javascript
class BehaviorSubject extends Subject {
  constructor(initialValue) {
    super();
    this.value = initialValue;
  }

  subscribe(observer) {
    const subscription = super.subscribe(observer);
    
    // Emit current value immediately
    if (!this.isStopped) {
      observer.next(this.value);
    }
    
    return subscription;
  }

  next(value) {
    this.value = value;
    super.next(value);
  }

  getValue() {
    if (this.isStopped) {
      throw new Error('BehaviorSubject has completed');
    }
    return this.value;
  }
}
```

### ReplaySubject

```javascript
class ReplaySubject extends Subject {
  constructor(bufferSize = Infinity, windowTime = Infinity) {
    super();
    this.bufferSize = bufferSize;
    this.windowTime = windowTime;
    this.buffer = [];
  }

  next(value) {
    const now = Date.now();
    this.buffer.push({ value, timestamp: now });
    
    // Trim buffer
    this.trimBuffer(now);
    
    super.next(value);
  }

  subscribe(observer) {
    const subscription = super.subscribe(observer);
    
    // Replay buffered values
    if (!this.isStopped) {
      const now = Date.now();
      this.trimBuffer(now);
      
      this.buffer.forEach(({ value }) => {
        observer.next(value);
      });
    }
    
    return subscription;
  }

  trimBuffer(now) {
    // Remove old values based on time window
    while (
      this.buffer.length > 0 &&
      now - this.buffer[0].timestamp > this.windowTime
    ) {
      this.buffer.shift();
    }
    
    // Remove old values based on buffer size
    while (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
    }
  }
}
```

### AsyncSubject

```javascript
class AsyncSubject extends Subject {
  constructor() {
    super();
    this.hasValue = false;
    this.value = undefined;
  }

  next(value) {
    if (!this.isStopped) {
      this.value = value;
      this.hasValue = true;
    }
  }

  complete() {
    if (this.isStopped) return;
    
    this.isStopped = true;
    
    if (this.hasValue) {
      this.observers.forEach(observer => {
        observer.next(this.value);
        observer.complete();
      });
    } else {
      this.observers.forEach(observer => {
        observer.complete();
      });
    }
    
    this.observers.clear();
  }
}
```

## Schedulers

### Scheduler Implementation

```javascript
class Scheduler {
  schedule(work, delay = 0) {
    throw new Error('Must be implemented by subclass');
  }
}

class ImmediateScheduler extends Scheduler {
  schedule(work, delay = 0) {
    if (delay > 0) {
      const timeoutId = setTimeout(() => work(), delay);
      return {
        unsubscribe: () => clearTimeout(timeoutId)
      };
    } else {
      work();
      return { unsubscribe: () => {} };
    }
  }
}

class AsyncScheduler extends Scheduler {
  schedule(work, delay = 0) {
    const timeoutId = setTimeout(() => work(), delay);
    return {
      unsubscribe: () => clearTimeout(timeoutId)
    };
  }
}

class AnimationFrameScheduler extends Scheduler {
  schedule(work, delay = 0) {
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        const rafId = requestAnimationFrame(() => work());
        this.rafId = rafId;
      }, delay);
      
      return {
        unsubscribe: () => {
          clearTimeout(timeoutId);
          if (this.rafId) {
            cancelAnimationFrame(this.rafId);
          }
        }
      };
    } else {
      const rafId = requestAnimationFrame(() => work());
      return {
        unsubscribe: () => cancelAnimationFrame(rafId)
      };
    }
  }
}

// Usage with observables
Observable.prototype.observeOn = function(scheduler) {
  return new Observable(observer => {
    return this.subscribe({
      next: value => {
        scheduler.schedule(() => observer.next(value));
      },
      error: err => {
        scheduler.schedule(() => observer.error(err));
      },
      complete: () => {
        scheduler.schedule(() => observer.complete());
      }
    });
  });
};
```

## Error Handling

### Error Operators

```javascript
// catchError
Observable.prototype.catchError = function(selector) {
  return new Observable(observer => {
    return this.subscribe({
      next: value => observer.next(value),
      error: err => {
        try {
          const result = selector(err);
          result.subscribe(observer);
        } catch (e) {
          observer.error(e);
        }
      },
      complete: () => observer.complete()
    });
  });
};

// retry
Observable.prototype.retry = function(count = -1) {
  return new Observable(observer => {
    let attempts = 0;
    let subscription;

    const subscribe = () => {
      subscription = this.subscribe({
        next: value => observer.next(value),
        error: err => {
          attempts++;
          if (count < 0 || attempts < count) {
            subscribe();
          } else {
            observer.error(err);
          }
        },
        complete: () => observer.complete()
      });
    };

    subscribe();

    return {
      unsubscribe: () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    };
  });
};

// retryWhen
Observable.prototype.retryWhen = function(notifier) {
  return new Observable(observer => {
    const errors = new Subject();
    let subscription;
    let notifierSubscription;

    notifierSubscription = notifier(errors).subscribe({
      next: () => {
        subscription = this.subscribe({
          next: value => observer.next(value),
          error: err => errors.next(err),
          complete: () => observer.complete()
        });
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });

    return {
      unsubscribe: () => {
        if (subscription) subscription.unsubscribe();
        if (notifierSubscription) notifierSubscription.unsubscribe();
      }
    };
  });
};
```

## Backpressure

### Backpressure Strategies

```javascript
// Buffer
Observable.prototype.buffer = function(closingNotifier) {
  return new Observable(observer => {
    let buffer = [];

    const subscription = this.subscribe({
      next: value => buffer.push(value),
      error: err => observer.error(err),
      complete: () => {
        if (buffer.length > 0) {
          observer.next(buffer);
        }
        observer.complete();
      }
    });

    const notifierSubscription = closingNotifier.subscribe({
      next: () => {
        observer.next(buffer);
        buffer = [];
      },
      error: err => observer.error(err)
    });

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        notifierSubscription.unsubscribe();
      }
    };
  });
};

// Sample
Observable.prototype.sample = function(notifier) {
  return new Observable(observer => {
    let lastValue;
    let hasValue = false;

    const subscription = this.subscribe({
      next: value => {
        lastValue = value;
        hasValue = true;
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });

    const notifierSubscription = notifier.subscribe({
      next: () => {
        if (hasValue) {
          observer.next(lastValue);
          hasValue = false;
        }
      },
      error: err => observer.error(err)
    });

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        notifierSubscription.unsubscribe();
      }
    };
  });
};
```

## Real-World Patterns

### Autocomplete

```javascript
function createAutocomplete(input, searchFn) {
  return Observable.fromEvent(input, 'input')
    .map(event => event.target.value)
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap(query => {
      if (query.length < 2) {
        return Observable.of([]);
      }
      return Observable.from(searchFn(query))
        .catchError(err => {
          console.error('Search error:', err);
          return Observable.of([]);
        });
    });
}
```

### Drag and Drop

```javascript
function createDraggable(element) {
  const mouseDown = Observable.fromEvent(element, 'mousedown');
  const mouseMove = Observable.fromEvent(document, 'mousemove');
  const mouseUp = Observable.fromEvent(document, 'mouseup');

  return mouseDown.flatMap(startEvent => {
    const startX = startEvent.clientX - element.offsetLeft;
    const startY = startEvent.clientY - element.offsetTop;

    return mouseMove
      .map(moveEvent => ({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      }))
      .takeUntil(mouseUp);
  });
}
```

### Polling with Exponential Backoff

```javascript
function pollWithBackoff(request, maxRetries = 5) {
  return Observable.defer(() => request())
    .retryWhen(errors =>
      errors.scan((acc, error) => {
        if (acc.count >= maxRetries) {
          throw error;
        }
        return { count: acc.count + 1, error };
      }, { count: 0 })
      .flatMap(({ count }) => {
        const delay = Math.pow(2, count) * 1000;
        return Observable.timer(delay);
      })
    );
}
```

## Summary

Functional Reactive Programming provides a powerful paradigm for handling asynchronous data streams with composable, declarative operations. Key concepts include observables, operators, subjects, and proper error handling strategies.
