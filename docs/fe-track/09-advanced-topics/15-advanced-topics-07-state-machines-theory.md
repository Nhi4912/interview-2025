# State Machines & Finite Automata Theory

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Understanding State-Based Systems

**English:** State machines are mathematical models of computation that describe systems in terms of states and transitions, providing a formal way to model behavior and manage complexity in software systems.

**Tiếng Việt:** Máy trạng thái là mô hình toán học của tính toán mô tả hệ thống theo các trạng thái và chuyển đổi, cung cấp cách chính thức để mô hình hóa hành vi và quản lý độ phức tạp trong hệ thống phần mềm.

## Table of Contents
1. [State Machine Fundamentals](#state-machine-fundamentals)
2. [Finite State Machines](#finite-state-machines)
3. [State Charts](#state-charts)
4. [Implementation Patterns](#implementation-patterns)
5. [XState Library](#xstate-library)
6. [UI State Management](#ui-state-management)
7. [Testing State Machines](#testing-state-machines)
8. [Common Patterns](#common-patterns)
9. [Best Practices](#best-practices)
10. [Real-World Applications](#real-world-applications)

## State Machine Fundamentals

### What is a State Machine? 🟢 [Junior]

**Definition:** Mathematical model with finite states and transitions between them

**Components:**
```
1. States - Possible conditions
2. Events - Triggers for transitions
3. Transitions - Rules for moving between states
4. Actions - Side effects during transitions
5. Guards - Conditions for transitions
```

**Simple Example:**
```
Traffic Light:
States: Red, Yellow, Green
Events: Timer
Transitions:
  Red → Green (after 30s)
  Green → Yellow (after 25s)
  Yellow → Red (after 5s)
```

### Why State Machines? 🟡 [Mid]

**Problems Without State Machines:**
```javascript
// Implicit state, hard to reason about
let isLoading = false;
let hasError = false;
let data = null;

// Impossible states possible
isLoading = true;
hasError = true;  // Loading AND error?
data = {...};     // Loading AND has data?
```

**With State Machine:**
```javascript
// Explicit states, impossible states impossible
const states = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

let currentState = states.IDLE;
let data = null;
let error = null;

// Only one state at a time
// Clear transitions
// Predictable behavior
```

**Benefits:**
```
✅ Explicit states
✅ Impossible states impossible
✅ Predictable behavior
✅ Easy to test
✅ Self-documenting
✅ Visualizable
✅ Maintainable
```

## Finite State Machines

### FSM Definition

**Formal Definition:**
```
FSM = (Q, Σ, δ, q₀, F)

Where:
Q = Finite set of states
Σ = Finite set of input symbols (alphabet)
δ = Transition function (Q × Σ → Q)
q₀ = Initial state
F = Set of final/accepting states
```

### Deterministic FSM (DFA)

**Characteristics:**
```
- One transition per state/input
- Deterministic behavior
- No ambiguity
```

**Example: Binary String Ending in "01"**
```
States: q0 (start), q1 (saw 0), q2 (saw 01, accept)
Alphabet: {0, 1}

Transitions:
q0 --0--> q1
q0 --1--> q0
q1 --0--> q1
q1 --1--> q2
q2 --0--> q1
q2 --1--> q0
```

**Implementation:**
```javascript
class DFA {
  constructor() {
    this.states = ['q0', 'q1', 'q2'];
    this.alphabet = ['0', '1'];
    this.transitions = {
      q0: { '0': 'q1', '1': 'q0' },
      q1: { '0': 'q1', '1': 'q2' },
      q2: { '0': 'q1', '1': 'q0' }
    };
    this.initialState = 'q0';
    this.acceptStates = ['q2'];
    this.currentState = this.initialState;
  }
  
  transition(input) {
    this.currentState = this.transitions[this.currentState][input];
  }
  
  accepts(string) {
    this.currentState = this.initialState;
    for (const char of string) {
      this.transition(char);
    }
    return this.acceptStates.includes(this.currentState);
  }
}

const dfa = new DFA();
console.log(dfa.accepts('101'));    // true (ends in 01)
console.log(dfa.accepts('110'));    // false
console.log(dfa.accepts('1001'));   // true
```

### Non-Deterministic FSM (NFA)

**Characteristics:**
```
- Multiple transitions per state/input
- Epsilon transitions (no input)
- Non-deterministic behavior
```

**Example:**
```
States: q0, q1, q2
Alphabet: {a, b}

Transitions:
q0 --a--> q0, q1
q0 --b--> q0
q1 --b--> q2
q2 --b--> q2
```

**Implementation:**
```javascript
class NFA {
  constructor() {
    this.states = ['q0', 'q1', 'q2'];
    this.alphabet = ['a', 'b'];
    this.transitions = {
      q0: { 'a': ['q0', 'q1'], 'b': ['q0'] },
      q1: { 'b': ['q2'] },
      q2: { 'b': ['q2'] }
    };
    this.initialState = 'q0';
    this.acceptStates = ['q2'];
  }
  
  accepts(string) {
    let currentStates = new Set([this.initialState]);
    
    for (const char of string) {
      const nextStates = new Set();
      for (const state of currentStates) {
        const transitions = this.transitions[state]?.[char] || [];
        transitions.forEach(s => nextStates.add(s));
      }
      currentStates = nextStates;
    }
    
    return [...currentStates].some(s => this.acceptStates.includes(s));
  }
}
```

## State Charts

### Hierarchical States

**Concept:** States can contain sub-states

**Example: Media Player**
```
Playing
├── Normal Speed
├── Fast Forward
└── Rewind

Paused

Stopped
```

**Benefits:**
```
✅ Organize complex states
✅ Share transitions
✅ Reduce duplication
✅ Better modeling
```

### Parallel States

**Concept:** Multiple states active simultaneously

**Example: Text Editor**
```
Parallel States:
├── Content State
│   ├── Empty
│   └── Has Content
└── Selection State
    ├── No Selection
    └── Has Selection
```

### History States

**Concept:** Remember previous state

**Types:**
```
Shallow History: Remember immediate child state
Deep History: Remember all nested states
```

**Example:**
```
Audio Player
├── Playing (history)
│   ├── Normal
│   ├── Fast Forward
│   └── Rewind
└── Paused

When resuming from Paused:
- Return to last Playing sub-state
```

## Implementation Patterns

### Switch Statement Pattern

```javascript
class StateMachine {
  constructor() {
    this.state = 'idle';
  }
  
  transition(event) {
    switch (this.state) {
      case 'idle':
        if (event === 'START') {
          this.state = 'loading';
          this.onLoading();
        }
        break;
        
      case 'loading':
        if (event === 'SUCCESS') {
          this.state = 'success';
          this.onSuccess();
        } else if (event === 'ERROR') {
          this.state = 'error';
          this.onError();
        }
        break;
        
      case 'success':
        if (event === 'RESET') {
          this.state = 'idle';
        }
        break;
        
      case 'error':
        if (event === 'RETRY') {
          this.state = 'loading';
          this.onLoading();
        }
        break;
    }
  }
  
  onLoading() {
    console.log('Loading...');
  }
  
  onSuccess() {
    console.log('Success!');
  }
  
  onError() {
    console.log('Error!');
  }
}
```

### Object-Based Pattern

```javascript
const machine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: 'loading'
      }
    },
    loading: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error'
      },
      entry: () => console.log('Loading...'),
      exit: () => console.log('Done loading')
    },
    success: {
      on: {
        RESET: 'idle'
      },
      entry: () => console.log('Success!')
    },
    error: {
      on: {
        RETRY: 'loading',
        RESET: 'idle'
      },
      entry: () => console.log('Error!')
    }
  }
};

class StateMachine {
  constructor(config) {
    this.config = config;
    this.state = config.initial;
  }
  
  transition(event) {
    const currentStateConfig = this.config.states[this.state];
    const nextState = currentStateConfig.on?.[event];
    
    if (nextState) {
      // Exit current state
      currentStateConfig.exit?.();
      
      // Transition
      this.state = nextState;
      
      // Enter new state
      this.config.states[nextState].entry?.();
    }
  }
  
  getState() {
    return this.state;
  }
}

const sm = new StateMachine(machine);
sm.transition('START');   // Loading...
sm.transition('SUCCESS'); // Done loading, Success!
```

### Class-Based Pattern

```javascript
class State {
  constructor(name) {
    this.name = name;
  }
  
  enter() {}
  exit() {}
  handle(event) {
    return null; // Return next state or null
  }
}

class IdleState extends State {
  constructor() {
    super('idle');
  }
  
  handle(event) {
    if (event === 'START') {
      return new LoadingState();
    }
    return null;
  }
}

class LoadingState extends State {
  constructor() {
    super('loading');
  }
  
  enter() {
    console.log('Loading...');
  }
  
  handle(event) {
    if (event === 'SUCCESS') {
      return new SuccessState();
    } else if (event === 'ERROR') {
      return new ErrorState();
    }
    return null;
  }
}

class SuccessState extends State {
  constructor() {
    super('success');
  }
  
  enter() {
    console.log('Success!');
  }
  
  handle(event) {
    if (event === 'RESET') {
      return new IdleState();
    }
    return null;
  }
}

class ErrorState extends State {
  constructor() {
    super('error');
  }
  
  enter() {
    console.log('Error!');
  }
  
  handle(event) {
    if (event === 'RETRY') {
      return new LoadingState();
    } else if (event === 'RESET') {
      return new IdleState();
    }
    return null;
  }
}

class StateMachine {
  constructor(initialState) {
    this.state = initialState;
    this.state.enter();
  }
  
  transition(event) {
    const nextState = this.state.handle(event);
    if (nextState) {
      this.state.exit();
      this.state = nextState;
      this.state.enter();
    }
  }
  
  getState() {
    return this.state.name;
  }
}

const sm = new StateMachine(new IdleState());
sm.transition('START');
sm.transition('SUCCESS');
```

## XState Library

### Basic Machine

```javascript
import { createMachine, interpret } from 'xstate';

const fetchMachine = createMachine({
  id: 'fetch',
  initial: 'idle',
  context: {
    data: null,
    error: null
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      invoke: {
        src: 'fetchData',
        onDone: {
          target: 'success',
          actions: 'setData'
        },
        onError: {
          target: 'error',
          actions: 'setError'
        }
      }
    },
    success: {
      on: {
        FETCH: 'loading'
      }
    },
    error: {
      on: {
        RETRY: 'loading'
      }
    }
  }
}, {
  actions: {
    setData: (context, event) => {
      context.data = event.data;
    },
    setError: (context, event) => {
      context.error = event.data;
    }
  },
  services: {
    fetchData: async () => {
      const response = await fetch('/api/data');
      return response.json();
    }
  }
});

const service = interpret(fetchMachine);
service.start();

service.send('FETCH');
```

### Guards (Conditional Transitions)

```javascript
const machine = createMachine({
  id: 'auth',
  initial: 'loggedOut',
  context: {
    attempts: 0,
    maxAttempts: 3
  },
  states: {
    loggedOut: {
      on: {
        LOGIN: {
          target: 'loggingIn',
          cond: 'canAttemptLogin'
        }
      }
    },
    loggingIn: {
      invoke: {
        src: 'login',
        onDone: 'loggedIn',
        onError: {
          target: 'loggedOut',
          actions: 'incrementAttempts'
        }
      }
    },
    loggedIn: {
      on: {
        LOGOUT: 'loggedOut'
      }
    }
  }
}, {
  guards: {
    canAttemptLogin: (context) => {
      return context.attempts < context.maxAttempts;
    }
  },
  actions: {
    incrementAttempts: (context) => {
      context.attempts++;
    }
  }
});
```

### Hierarchical States

```javascript
const machine = createMachine({
  id: 'player',
  initial: 'stopped',
  states: {
    stopped: {
      on: {
        PLAY: 'playing'
      }
    },
    playing: {
      initial: 'normal',
      states: {
        normal: {
          on: {
            FAST_FORWARD: 'fastForward'
          }
        },
        fastForward: {
          on: {
            NORMAL: 'normal'
          }
        }
      },
      on: {
        PAUSE: 'paused',
        STOP: 'stopped'
      }
    },
    paused: {
      on: {
        PLAY: 'playing',
        STOP: 'stopped'
      }
    }
  }
});
```

### Parallel States

```javascript
const machine = createMachine({
  id: 'editor',
  type: 'parallel',
  states: {
    content: {
      initial: 'empty',
      states: {
        empty: {
          on: {
            TYPE: 'hasContent'
          }
        },
        hasContent: {
          on: {
            CLEAR: 'empty'
          }
        }
      }
    },
    selection: {
      initial: 'none',
      states: {
        none: {
          on: {
            SELECT: 'selected'
          }
        },
        selected: {
          on: {
            DESELECT: 'none'
          }
        }
      }
    }
  }
});
```

## UI State Management

### Form State Machine

```javascript
const formMachine = createMachine({
  id: 'form',
  initial: 'editing',
  context: {
    values: {},
    errors: {}
  },
  states: {
    editing: {
      on: {
        CHANGE: {
          actions: 'updateValue'
        },
        SUBMIT: {
          target: 'validating',
          cond: 'isValid'
        }
      }
    },
    validating: {
      invoke: {
        src: 'validate',
        onDone: 'submitting',
        onError: {
          target: 'editing',
          actions: 'setErrors'
        }
      }
    },
    submitting: {
      invoke: {
        src: 'submit',
        onDone: 'success',
        onError: {
          target: 'editing',
          actions: 'setErrors'
        }
      }
    },
    success: {
      type: 'final'
    }
  }
});
```

### Modal State Machine

```javascript
const modalMachine = createMachine({
  id: 'modal',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPEN: 'opening'
      }
    },
    opening: {
      after: {
        300: 'open' // Animation duration
      }
    },
    open: {
      on: {
        CLOSE: 'closing',
        CONFIRM: 'closing',
        CANCEL: 'closing'
      }
    },
    closing: {
      after: {
        300: 'closed'
      }
    }
  }
});
```

### Pagination State Machine

```javascript
const paginationMachine = createMachine({
  id: 'pagination',
  initial: 'loading',
  context: {
    page: 1,
    totalPages: 0,
    data: []
  },
  states: {
    loading: {
      invoke: {
        src: 'fetchPage',
        onDone: {
          target: 'idle',
          actions: 'setData'
        },
        onError: 'error'
      }
    },
    idle: {
      on: {
        NEXT: {
          target: 'loading',
          cond: 'hasNextPage',
          actions: 'incrementPage'
        },
        PREV: {
          target: 'loading',
          cond: 'hasPrevPage',
          actions: 'decrementPage'
        },
        GOTO: {
          target: 'loading',
          actions: 'setPage'
        }
      }
    },
    error: {
      on: {
        RETRY: 'loading'
      }
    }
  }
}, {
  guards: {
    hasNextPage: (context) => context.page < context.totalPages,
    hasPrevPage: (context) => context.page > 1
  },
  actions: {
    incrementPage: (context) => context.page++,
    decrementPage: (context) => context.page--,
    setPage: (context, event) => context.page = event.page,
    setData: (context, event) => {
      context.data = event.data.items;
      context.totalPages = event.data.totalPages;
    }
  }
});
```

## Testing State Machines

### Unit Testing

```javascript
import { createMachine } from 'xstate';

describe('Fetch Machine', () => {
  const machine = createMachine({
    initial: 'idle',
    states: {
      idle: {
        on: { FETCH: 'loading' }
      },
      loading: {
        on: {
          SUCCESS: 'success',
          ERROR: 'error'
        }
      },
      success: {},
      error: {
        on: { RETRY: 'loading' }
      }
    }
  });
  
  it('should start in idle state', () => {
    expect(machine.initialState.value).toBe('idle');
  });
  
  it('should transition to loading on FETCH', () => {
    const nextState = machine.transition('idle', 'FETCH');
    expect(nextState.value).toBe('loading');
  });
  
  it('should transition to success on SUCCESS', () => {
    const nextState = machine.transition('loading', 'SUCCESS');
    expect(nextState.value).toBe('success');
  });
  
  it('should transition to error on ERROR', () => {
    const nextState = machine.transition('loading', 'ERROR');
    expect(nextState.value).toBe('error');
  });
  
  it('should retry from error', () => {
    const nextState = machine.transition('error', 'RETRY');
    expect(nextState.value).toBe('loading');
  });
});
```

### Path Testing

```javascript
import { createMachine } from 'xstate';
import { getShortestPaths } from '@xstate/graph';

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: { START: 'active' }
    },
    active: {
      on: {
        PAUSE: 'paused',
        STOP: 'idle'
      }
    },
    paused: {
      on: {
        RESUME: 'active',
        STOP: 'idle'
      }
    }
  }
});

const paths = getShortestPaths(machine);

describe('All paths', () => {
  Object.keys(paths).forEach(key => {
    const { state, paths: statePaths } = paths[key];
    
    it(`should reach ${key}`, () => {
      statePaths.forEach(path => {
        let currentState = machine.initialState;
        
        path.segments.forEach(segment => {
          currentState = machine.transition(currentState, segment.event);
        });
        
        expect(currentState.value).toBe(state.value);
      });
    });
  });
});
```

## Common Patterns

### Retry Pattern

```javascript
const retryMachine = createMachine({
  id: 'retry',
  initial: 'idle',
  context: {
    retries: 0,
    maxRetries: 3
  },
  states: {
    idle: {
      on: { START: 'attempting' }
    },
    attempting: {
      invoke: {
        src: 'attemptAction',
        onDone: 'success',
        onError: [
          {
            target: 'attempting',
            cond: 'canRetry',
            actions: 'incrementRetries'
          },
          {
            target: 'failed'
          }
        ]
      }
    },
    success: {
      type: 'final'
    },
    failed: {
      type: 'final'
    }
  }
}, {
  guards: {
    canRetry: (context) => context.retries < context.maxRetries
  },
  actions: {
    incrementRetries: (context) => context.retries++
  }
});
```

### Timeout Pattern

```javascript
const timeoutMachine = createMachine({
  id: 'timeout',
  initial: 'idle',
  states: {
    idle: {
      on: { START: 'active' }
    },
    active: {
      after: {
        5000: 'timeout' // 5 second timeout
      },
      on: {
        COMPLETE: 'success',
        CANCEL: 'idle'
      }
    },
    success: {
      type: 'final'
    },
    timeout: {
      on: { RETRY: 'active' }
    }
  }
});
```

### Debounce Pattern

```javascript
const debounceMachine = createMachine({
  id: 'debounce',
  initial: 'idle',
  states: {
    idle: {
      on: {
        INPUT: 'debouncing'
      }
    },
    debouncing: {
      after: {
        300: {
          target: 'searching',
          actions: 'performSearch'
        }
      },
      on: {
        INPUT: {
          target: 'debouncing',
          internal: true
        }
      }
    },
    searching: {
      invoke: {
        src: 'search',
        onDone: 'idle',
        onError: 'idle'
      }
    }
  }
});
```

## Best Practices

### Keep States Simple

```javascript
// Bad: Too many states
const badMachine = createMachine({
  states: {
    idleNotLoadingNoErrorNoData: {},
    idleNotLoadingNoErrorHasData: {},
    idleNotLoadingHasErrorNoData: {},
    // ... 16 more combinations
  }
});

// Good: Orthogonal concerns
const goodMachine = createMachine({
  type: 'parallel',
  states: {
    loading: {
      initial: 'idle',
      states: {
        idle: {},
        loading: {}
      }
    },
    data: {
      initial: 'empty',
      states: {
        empty: {},
        hasData: {}
      }
    },
    error: {
      initial: 'none',
      states: {
        none: {},
        hasError: {}
      }
    }
  }
});
```

### Use Guards for Conditions

```javascript
// Good: Guard conditions
const machine = createMachine({
  states: {
    form: {
      on: {
        SUBMIT: {
          target: 'submitting',
          cond: 'isValid'
        }
      }
    }
  }
}, {
  guards: {
    isValid: (context) => {
      return context.email && context.password;
    }
  }
});
```

### Separate Concerns

```javascript
// Good: Separate state machine from UI
const machine = createMachine({...});
const service = interpret(machine);

function MyComponent() {
  const [state, send] = useActor(service);
  
  return (
    <div>
      {state.matches('loading') && <Spinner />}
      {state.matches('success') && <Data data={state.context.data} />}
      {state.matches('error') && <Error error={state.context.error} />}
    </div>
  );
}
```

## Real-World Applications

### Authentication Flow

```javascript
const authMachine = createMachine({
  id: 'auth',
  initial: 'checkingAuth',
  states: {
    checkingAuth: {
      invoke: {
        src: 'checkAuth',
        onDone: [
          { target: 'authenticated', cond: 'isAuthenticated' },
          { target: 'unauthenticated' }
        ]
      }
    },
    unauthenticated: {
      on: {
        LOGIN: 'loggingIn'
      }
    },
    loggingIn: {
      invoke: {
        src: 'login',
        onDone: 'authenticated',
        onError: 'unauthenticated'
      }
    },
    authenticated: {
      on: {
        LOGOUT: 'loggingOut'
      }
    },
    loggingOut: {
      invoke: {
        src: 'logout',
        onDone: 'unauthenticated'
      }
    }
  }
});
```

### Shopping Cart

```javascript
const cartMachine = createMachine({
  id: 'cart',
  initial: 'empty',
  context: {
    items: [],
    total: 0
  },
  states: {
    empty: {
      on: {
        ADD_ITEM: {
          target: 'hasItems',
          actions: 'addItem'
        }
      }
    },
    hasItems: {
      on: {
        ADD_ITEM: {
          actions: 'addItem'
        },
        REMOVE_ITEM: [
          {
            target: 'empty',
            cond: 'isLastItem',
            actions: 'removeItem'
          },
          {
            actions: 'removeItem'
          }
        ],
        CHECKOUT: 'checkingOut'
      }
    },
    checkingOut: {
      invoke: {
        src: 'processCheckout',
        onDone: 'complete',
        onError: 'hasItems'
      }
    },
    complete: {
      type: 'final'
    }
  }
});
```

## Câu Hỏi Phỏng Vấn / Interview Q&A

**Q: What are the benefits of using state machines?**

A: State machines make states explicit, prevent impossible states, provide predictable behavior, are easy to test and visualize, self-document the system, and improve maintainability. They formalize state transitions and make complex logic easier to reason about.

**Q: Explain the difference between DFA and NFA.**

A: DFA (Deterministic Finite Automaton) has exactly one transition per state/input, deterministic behavior. NFA (Non-deterministic Finite Automaton) can have multiple transitions per state/input, epsilon transitions, requires tracking multiple possible states. DFAs are easier to implement, NFAs are more expressive.

**Q: When should you use hierarchical states?**

A: Use hierarchical states when you have related states that share common transitions or behaviors. For example, a media player with Playing state containing Normal, FastForward, and Rewind sub-states. All sub-states can transition to Paused without duplicating that transition.

**Q: What's the difference between state machines and state management libraries like Redux?**

A: State machines explicitly model states and transitions with formal rules. Redux is general state container without enforced state transitions. State machines prevent impossible states and invalid transitions, Redux allows any state changes. Use state machines for complex workflows, Redux for general app state.

**Q: How do you test state machines?**

A: Test initial state, individual transitions, guard conditions, actions/side effects, and all possible paths. Use path testing to ensure all states are reachable. Test that invalid transitions are rejected. State machines are highly testable due to their deterministic nature.

---

[← Back to DOM Manipulation](./05-dom-manipulation-theory.md) | [Next: Cloud Architecture →](./15-advanced-topics-08-webassembly-theory.md)
