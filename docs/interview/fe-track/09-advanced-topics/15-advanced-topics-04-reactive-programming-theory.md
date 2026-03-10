# Reactive Programming Theory
## Understanding Reactive Systems and Observables

**English:** Reactive programming is a declarative programming paradigm concerned with data streams and the propagation of change, enabling asynchronous data flow and automatic updates.

**Tiếng Việt:** Lập trình phản ứng là mô hình lập trình khai báo liên quan đến luồng dữ liệu và sự lan truyền thay đổi, cho phép luồng dữ liệu bất đồng bộ và cập nhật tự động.

## Table of Contents
1. [Reactive Programming Fundamentals](#reactive-programming-fundamentals)
2. [Observables](#observables)
3. [Operators](#operators)
4. [Subjects](#subjects)
5. [Schedulers](#schedulers)
6. [Error Handling](#error-handling)
7. [Backpressure](#backpressure)
8. [Hot vs Cold Observables](#hot-vs-cold-observables)
9. [RxJS Patterns](#rxjs-patterns)
10. [Best Practices](#best-practices)

## Reactive Programming Fundamentals

### Core Concepts

**Data Streams:**
```
Everything is a stream:
- User events (clicks, inputs)
- HTTP requests
- WebSocket messages
- Timer events
- Arrays, Promises
```

**Observer Pattern:**
```
Subject (Observable)
    ↓ notify
Observer 1, Observer 2, Observer 3
```

**Push vs Pull:**
```
Pull (Traditional):
- Consumer requests data
- Synchronous
- Example: function calls, iterators

Push (Reactive):
- Producer pushes data
- Asynchronous
- Example: events, observables
```

### Reactive Manifesto

**Responsive:**
```
System responds in timely manner
Consistent quality of service
Quick problem detection
```

**Resilient:**
```
System stays responsive despite failures
Replication, containment, isolation
Failures contained and recovered
```

**Elastic:**
```
System stays responsive under varying load
Scales up/down based on demand
No contention points
```

**Message Driven:**
```
Asynchronous message passing
Loose coupling
Location transparency
Non-blocking communication
```

## Observables

### Definition

**Observable:** Lazy collection of multiple values over time

**Comparison:**
```
Single Value    | Multiple Values
----------------|------------------
Synchronous     | Array
Asynchronous    | Promise | Observable
```

### Creating Observables

**From Values:**
```javascript
import { of, from } from 'rxjs';

// of - emit values then complete
const numbers$ = of(1, 2, 3, 4, 5);
numbers$.subscribe(x => console.log(x));
// Output: 1, 2, 3, 4, 5

// from - convert array/promise/iterable
const array$ = from([1, 2, 3]);
const promise$ = from(fetch('/api/data'));
```

**From Events:**
```javascript
import { fromEvent } from 'rxjs';

const button = document.getElementById('btn');
const clicks$ = fromEvent(button, 'click');

clicks$.subscribe(event => {
  console.log('Button clicked', event);
});
```

**Custom Observable:**
```javascript
import { Observable } from 'rxjs';

const custom$ = new Observable(subscriber => {
  // Emit values
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  
  // Complete
  subscriber.complete();
  
  // Cleanup function
  return () => {
    console.log('Cleanup');
  };
});

custom$.subscribe({
  next: value => console.log(value),
  complete: () => console.log('Done')
});
```

**Interval/Timer:**
```javascript
import { interval, timer } from 'rxjs';

// Emit every second
const interval$ = interval(1000);
interval$.subscribe(x => console.log(x));
// Output: 0, 1, 2, 3, ...

// Emit after delay, then every interval
const timer$ = timer(2000, 1000);
timer$.subscribe(x => console.log(x));
// Wait 2s, then: 0, 1, 2, 3, ...
```

### Subscribing

**Basic Subscription:**
```javascript
const observable$ = of(1, 2, 3);

const subscription = observable$.subscribe({
  next: value => console.log('Next:', value),
  error: err => console.error('Error:', err),
  complete: () => console.log('Complete')
});

// Unsubscribe to prevent memory leaks
subscription.unsubscribe();
```

**Multiple Subscribers:**
```javascript
const observable$ = of(1, 2, 3);

// Each subscriber gets own execution
observable$.subscribe(x => console.log('A:', x));
observable$.subscribe(x => console.log('B:', x));

// Output:
// A: 1, A: 2, A: 3
// B: 1, B: 2, B: 3
```

## Operators

### Transformation Operators

**map:**
```javascript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5);
const doubled$ = numbers$.pipe(
  map(x => x * 2)
);

doubled$.subscribe(x => console.log(x));
// Output: 2, 4, 6, 8, 10
```

**pluck:**
```javascript
import { of } from 'rxjs';
import { pluck } from 'rxjs/operators';

const users$ = of(
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
);

const names$ = users$.pipe(pluck('name'));
names$.subscribe(name => console.log(name));
// Output: 'John', 'Jane'
```

**scan (accumulator):**
```javascript
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5);
const sum$ = numbers$.pipe(
  scan((acc, curr) => acc + curr, 0)
);

sum$.subscribe(x => console.log(x));
// Output: 1, 3, 6, 10, 15
```

### Filtering Operators

**filter:**
```javascript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5, 6);
const even$ = numbers$.pipe(
  filter(x => x % 2 === 0)
);

even$.subscribe(x => console.log(x));
// Output: 2, 4, 6
```

**take:**
```javascript
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

const numbers$ = interval(1000).pipe(
  take(3)
);

numbers$.subscribe(x => console.log(x));
// Output: 0, 1, 2 (then completes)
```

**takeUntil:**
```javascript
import { interval, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const numbers$ = interval(1000);
const clicks$ = fromEvent(document, 'click');

numbers$.pipe(
  takeUntil(clicks$)
).subscribe(x => console.log(x));
// Emits until user clicks
```

**debounceTime:**
```javascript
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const input = document.getElementById('search');
const search$ = fromEvent(input, 'input').pipe(
  map(event => event.target.value),
  debounceTime(300)
);

search$.subscribe(value => {
  console.log('Search:', value);
  // API call here
});
```

**throttleTime:**
```javascript
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

const clicks$ = fromEvent(button, 'click').pipe(
  throttleTime(1000)
);

clicks$.subscribe(() => {
  console.log('Clicked (max once per second)');
});
```

**distinctUntilChanged:**
```javascript
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const values$ = of(1, 1, 2, 2, 3, 3, 3, 4);
const distinct$ = values$.pipe(
  distinctUntilChanged()
);

distinct$.subscribe(x => console.log(x));
// Output: 1, 2, 3, 4
```

### Combination Operators

**merge:**
```javascript
import { interval, merge } from 'rxjs';
import { map } from 'rxjs/operators';

const fast$ = interval(500).pipe(map(x => `Fast: ${x}`));
const slow$ = interval(1000).pipe(map(x => `Slow: ${x}`));

merge(fast$, slow$).subscribe(x => console.log(x));
// Output: Fast: 0, Slow: 0, Fast: 1, Fast: 2, Slow: 1, ...
```

**concat:**
```javascript
import { of, concat } from 'rxjs';

const first$ = of(1, 2, 3);
const second$ = of(4, 5, 6);

concat(first$, second$).subscribe(x => console.log(x));
// Output: 1, 2, 3, 4, 5, 6 (sequential)
```

**combineLatest:**
```javascript
import { combineLatest, interval } from 'rxjs';
import { map } from 'rxjs/operators';

const timer1$ = interval(1000);
const timer2$ = interval(1500);

combineLatest([timer1$, timer2$]).pipe(
  map(([t1, t2]) => `Timer1: ${t1}, Timer2: ${t2}`)
).subscribe(x => console.log(x));
```

**zip:**
```javascript
import { zip, of } from 'rxjs';

const names$ = of('John', 'Jane', 'Bob');
const ages$ = of(30, 25, 35);

zip(names$, ages$).subscribe(([name, age]) => {
  console.log(`${name} is ${age} years old`);
});
// Output:
// John is 30 years old
// Jane is 25 years old
// Bob is 35 years old
```

**switchMap:**
```javascript
import { fromEvent, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const clicks$ = fromEvent(button, 'click');

clicks$.pipe(
  switchMap(() => interval(1000))
).subscribe(x => console.log(x));
// Each click cancels previous interval and starts new one
```

**mergeMap (flatMap):**
```javascript
import { of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';

const letters$ = of('a', 'b', 'c');

letters$.pipe(
  mergeMap(letter => 
    of(letter.toUpperCase()).pipe(delay(1000))
  )
).subscribe(x => console.log(x));
// All requests run in parallel
```

**concatMap:**
```javascript
import { of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

const letters$ = of('a', 'b', 'c');

letters$.pipe(
  concatMap(letter => 
    of(letter.toUpperCase()).pipe(delay(1000))
  )
).subscribe(x => console.log(x));
// Requests run sequentially
```

**exhaustMap:**
```javascript
import { fromEvent, interval } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';

const clicks$ = fromEvent(button, 'click');

clicks$.pipe(
  exhaustMap(() => interval(1000).pipe(take(3)))
).subscribe(x => console.log(x));
// Ignores new clicks while inner observable is active
```

## Subjects

### Definition

**Subject:** Both Observable and Observer

**Types:**
- Subject
- BehaviorSubject
- ReplaySubject
- AsyncSubject

### Subject

**Basic Subject:**
```javascript
import { Subject } from 'rxjs';

const subject$ = new Subject();

// Subscribe before emitting
subject$.subscribe(x => console.log('A:', x));
subject$.subscribe(x => console.log('B:', x));

// Emit values
subject$.next(1);
subject$.next(2);

// Output:
// A: 1, B: 1
// A: 2, B: 2
```

**Multicasting:**
```javascript
import { interval, Subject } from 'rxjs';
import { take, multicast } from 'rxjs/operators';

const source$ = interval(1000).pipe(take(3));
const subject$ = new Subject();

// Multicast to multiple subscribers
const multicasted$ = source$.pipe(
  multicast(subject$)
);

multicasted$.subscribe(x => console.log('A:', x));
multicasted$.subscribe(x => console.log('B:', x));

// Start emitting
multicasted$.connect();
```

### BehaviorSubject

**Stores Current Value:**
```javascript
import { BehaviorSubject } from 'rxjs';

const subject$ = new BehaviorSubject(0); // Initial value

subject$.subscribe(x => console.log('A:', x));
// Output: A: 0 (receives current value immediately)

subject$.next(1);
subject$.next(2);

subject$.subscribe(x => console.log('B:', x));
// Output: B: 2 (receives latest value)

// Get current value
console.log(subject$.value); // 2
```

**Use Case - State Management:**
```javascript
class Store {
  private state$ = new BehaviorSubject({ count: 0 });
  
  getState() {
    return this.state$.asObservable();
  }
  
  setState(newState) {
    this.state$.next(newState);
  }
  
  getCurrentState() {
    return this.state$.value;
  }
}

const store = new Store();
store.getState().subscribe(state => {
  console.log('State:', state);
});

store.setState({ count: 1 });
store.setState({ count: 2 });
```

### ReplaySubject

**Replays N Values:**
```javascript
import { ReplaySubject } from 'rxjs';

const subject$ = new ReplaySubject(2); // Buffer size 2

subject$.next(1);
subject$.next(2);
subject$.next(3);

subject$.subscribe(x => console.log('A:', x));
// Output: A: 2, A: 3 (last 2 values)

subject$.next(4);
// Output: A: 4
```

**Time Window:**
```javascript
import { ReplaySubject } from 'rxjs';

// Replay values from last 500ms
const subject$ = new ReplaySubject(100, 500);

subject$.next(1);
setTimeout(() => subject$.next(2), 200);
setTimeout(() => subject$.next(3), 400);
setTimeout(() => {
  subject$.subscribe(x => console.log(x));
  // Receives values from last 500ms
}, 600);
```

### AsyncSubject

**Emits Last Value on Complete:**
```javascript
import { AsyncSubject } from 'rxjs';

const subject$ = new AsyncSubject();

subject$.subscribe(x => console.log('A:', x));

subject$.next(1);
subject$.next(2);
subject$.next(3);
// No output yet

subject$.complete();
// Output: A: 3 (only last value)
```

## Schedulers

### Definition

**Scheduler:** Controls when subscription starts and when notifications are delivered

**Types:**
- null (synchronous)
- queueScheduler
- asapScheduler
- asyncScheduler
- animationFrameScheduler

### Examples

**asyncScheduler:**
```javascript
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

console.log('Before');

of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(x => console.log(x));

console.log('After');

// Output:
// Before
// After
// 1, 2, 3
```

**animationFrameScheduler:**
```javascript
import { interval, animationFrameScheduler } from 'rxjs';

// Emit on animation frame
interval(0, animationFrameScheduler).subscribe(() => {
  // Update animation
  element.style.left = `${position}px`;
  position += 1;
});
```

## Error Handling

### catchError

**Handle and Continue:**
```javascript
import { of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const source$ = of(1, 2, 3, 4, 5).pipe(
  map(x => {
    if (x === 3) throw new Error('Error at 3');
    return x;
  }),
  catchError(err => {
    console.error('Caught:', err.message);
    return of(999); // Continue with fallback
  })
);

source$.subscribe(x => console.log(x));
// Output: 1, 2, Caught: Error at 3, 999
```

### retry

**Retry on Error:**
```javascript
import { ajax } from 'rxjs/ajax';
import { retry, catchError } from 'rxjs/operators';

ajax('/api/data').pipe(
  retry(3), // Retry up to 3 times
  catchError(err => {
    console.error('Failed after 3 retries');
    return of({ error: true });
  })
).subscribe(data => console.log(data));
```

**retryWhen:**
```javascript
import { ajax } from 'rxjs/ajax';
import { retryWhen, delay, take } from 'rxjs/operators';

ajax('/api/data').pipe(
  retryWhen(errors => 
    errors.pipe(
      delay(1000), // Wait 1s between retries
      take(3) // Max 3 retries
    )
  )
).subscribe(data => console.log(data));
```

## Backpressure

### Definition

**Backpressure:** Producer emits faster than consumer can process

**Strategies:**
- Buffer
- Sample
- Throttle
- Debounce
- Switch

### Buffer

**Collect Values:**
```javascript
import { interval } from 'rxjs';
import { buffer, take } from 'rxjs/operators';

const source$ = interval(100);
const buffered$ = source$.pipe(
  buffer(interval(1000)),
  take(3)
);

buffered$.subscribe(x => console.log(x));
// Output: [0,1,2,3,4,5,6,7,8,9], [10,11,...], ...
```

### Sample

**Sample at Intervals:**
```javascript
import { interval } from 'rxjs';
import { sample } from 'rxjs/operators';

const fast$ = interval(100);
const sampled$ = fast$.pipe(
  sample(interval(1000))
);

sampled$.subscribe(x => console.log(x));
// Output: 9, 19, 29, ... (samples every second)
```

## Hot vs Cold Observables

### Cold Observable

**Creates Producer Per Subscriber:**
```javascript
import { Observable } from 'rxjs';

const cold$ = new Observable(subscriber => {
  console.log('Producer created');
  subscriber.next(Math.random());
});

cold$.subscribe(x => console.log('A:', x));
// Producer created, A: 0.123

cold$.subscribe(x => console.log('B:', x));
// Producer created, B: 0.456

// Each subscriber gets different value
```

### Hot Observable

**Shares Producer:**
```javascript
import { Subject } from 'rxjs';

const hot$ = new Subject();

hot$.subscribe(x => console.log('A:', x));
hot$.subscribe(x => console.log('B:', x));

hot$.next(Math.random());
// A: 0.789, B: 0.789

// Both subscribers get same value
```

### Converting Cold to Hot

**share:**
```javascript
import { interval } from 'rxjs';
import { share, take } from 'rxjs/operators';

const cold$ = interval(1000).pipe(take(3));
const hot$ = cold$.pipe(share());

hot$.subscribe(x => console.log('A:', x));
setTimeout(() => {
  hot$.subscribe(x => console.log('B:', x));
}, 1500);

// A: 0, A: 1, B: 1, A: 2, B: 2
```

## RxJS Patterns

### Autocomplete

```javascript
import { fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from 'rxjs/operators';

const searchBox = document.getElementById('search');
const results = document.getElementById('results');

fromEvent(searchBox, 'input').pipe(
  map(event => event.target.value),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => fetch(`/api/search?q=${term}`).then(r => r.json()))
).subscribe(data => {
  results.innerHTML = data.map(item => `<li>${item}</li>`).join('');
});
```

### Polling

```javascript
import { interval } from 'rxjs';
import { switchMap, retry } from 'rxjs/operators';

interval(5000).pipe(
  switchMap(() => fetch('/api/status').then(r => r.json())),
  retry(3)
).subscribe(status => {
  console.log('Status:', status);
});
```

### Drag and Drop

```javascript
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';

const element = document.getElementById('draggable');

const mouseDown$ = fromEvent(element, 'mousedown');
const mouseMove$ = fromEvent(document, 'mousemove');
const mouseUp$ = fromEvent(document, 'mouseup');

mouseDown$.pipe(
  switchMap(startEvent => {
    const startX = startEvent.clientX - element.offsetLeft;
    const startY = startEvent.clientY - element.offsetTop;
    
    return mouseMove$.pipe(
      map(moveEvent => ({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      })),
      takeUntil(mouseUp$)
    );
  })
).subscribe(({ x, y }) => {
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
});
```

## Best Practices

### Memory Management

**Always Unsubscribe:**
```javascript
// Component
class MyComponent {
  private subscription: Subscription;
  
  ngOnInit() {
    this.subscription = observable$.subscribe(data => {
      // Handle data
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

**Use takeUntil:**
```javascript
class MyComponent {
  private destroy$ = new Subject();
  
  ngOnInit() {
    observable$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Handle data
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Error Handling

**Always Handle Errors:**
```javascript
observable$.pipe(
  catchError(err => {
    console.error('Error:', err);
    return of(defaultValue);
  })
).subscribe(data => {
  // Handle data
});
```

### Performance

**Use Appropriate Operators:**
```javascript
// Good: debounce for search
searchInput$.pipe(debounceTime(300))

// Good: throttle for scroll
scroll$.pipe(throttleTime(100))

// Good: switchMap for latest request
clicks$.pipe(switchMap(() => ajax('/api/data')))
```

## Interview Questions

**Q: What's the difference between map and switchMap?**

A: map transforms values (synchronous), switchMap transforms to inner observable and subscribes (asynchronous). switchMap cancels previous inner observable when new value arrives. Use map for simple transformations, switchMap for async operations like HTTP requests.

**Q: Explain hot vs cold observables.**

A: Cold observables create producer per subscriber (unicast) - each subscriber gets independent execution. Hot observables share producer among subscribers (multicast) - all subscribers get same values. Examples: HTTP request is cold, DOM events are hot.

**Q: When would you use BehaviorSubject vs ReplaySubject?**

A: BehaviorSubject stores and emits current value to new subscribers (good for state). ReplaySubject buffers N values and replays them to new subscribers (good for caching recent events). BehaviorSubject requires initial value, ReplaySubject doesn't.

**Q: What is backpressure and how do you handle it?**

A: Backpressure occurs when producer emits faster than consumer processes. Handle with: buffer (collect values), sample/throttle (skip values), debounce (wait for pause), switchMap (cancel previous), or backpressure operators.

**Q: Explain the difference between mergeMap, switchMap, and concatMap.**

A: mergeMap runs all inner observables in parallel, switchMap cancels previous and switches to new, concatMap queues and runs sequentially. Use mergeMap for independent requests, switchMap for latest-only (search), concatMap for ordered operations.

---

[← Back to API Design](./03-api-design-theory.md) | [Next: Module Systems →](./05-module-systems-theory.md)
