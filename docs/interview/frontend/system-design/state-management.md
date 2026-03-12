# State Management for Frontend Interviews

**Quản lý trạng thái cho phỏng vấn Frontend**

## 1. Why State Management?

- **Local state:** useState, useReducer, component state.
- **Global state:** Shared across app (user, theme, cart).
- **Server state:** Data from API, cache, sync.

## 2. Tools & Libraries

- **Redux:** Predictable, single source, middleware (thunk, saga), devtools.
- **Context API:** Lightweight, for small/medium apps, avoid prop drilling.
- **MobX:** Observable, reactive, less boilerplate.
- **Zustand:** Minimal, hooks-based, scalable.
- **Recoil:** Atom/selectors, async, React integration.
- **Jotai, XState, Akita:** Other options.

## 3. Patterns

- **Lifting state up:** Move state to common ancestor.
- **Derived state:** Compute from other state, avoid duplication.
- **Selector functions:** Memoize, reselect.
- **Normalized state:** Store by ID, avoid deep nesting.

## 4. Best Practices

- **Keep state minimal:** Only what you need.
- **Avoid prop drilling:** Use context or global store.
- **Immutable updates:** Spread/rest, immer.
- **Testing:** Mock store, test reducers/selectors.
- **Performance:** Avoid unnecessary re-renders, use memoization.

## 5. Interview Questions

- When to use Redux vs Context?
- How to handle async state (API calls)?
- How to avoid prop drilling?
- How to test state logic?

## 6. Resources

- [Redux Docs](https://redux.js.org/)
- [MobX Docs](https://mobx.js.org/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Recoil](https://recoiljs.org/)

# State Management Interview Preparation

## Core Concepts

### State Management Fundamentals

- **Local State**: Component-level state (useState, useReducer)
- **Global State**: Application-wide state shared across components
- **Server State**: Data fetched from APIs and cached
- **Form State**: User input and form validation state
- **UI State**: Loading, error, modal, navigation states

### State Management Patterns

- **Flux Architecture**: Unidirectional data flow
- **Redux Pattern**: Predictable state container
- **Context API**: React's built-in state sharing
- **Atomic State**: Small, focused state pieces
- **Event Sourcing**: State as sequence of events

## Advanced Topics

### Modern State Management

- **Redux Toolkit**: Simplified Redux with RTK Query
- **Zustand**: Lightweight state management
- **Jotai**: Atomic state management
- **Recoil**: Facebook's experimental state management
- **XState**: State machines and statecharts

### State Synchronization

- **Optimistic Updates**: Update UI before server confirmation
- **Pessimistic Updates**: Wait for server response
- **Real-time Sync**: WebSocket state synchronization
- **Offline Support**: Local state with sync when online
- **Conflict Resolution**: Handling concurrent updates

## Common Interview Questions & Answers

### State Management Questions

**Q: When would you use Redux vs Context API vs local state?**
A:

- **Local State**: Component-specific data, form inputs, UI toggles
- **Context API**: Theme, authentication, user preferences, simple global state
- **Redux**: Complex application state, multiple data sources, debugging needs

**Q: Explain the Redux flow and its three principles.**
A: Redux follows unidirectional data flow:

1. **Store**: Single source of truth
2. **Actions**: Plain objects describing what happened
3. **Reducers**: Pure functions that update state

**Three Principles**:

- Single source of truth
- State is read-only
- Changes made with pure functions

**Q: What are the benefits and drawbacks of Redux?**
A:
**Benefits**:

- Predictable state updates
- Great debugging with DevTools
- Middleware ecosystem
- Time-travel debugging

**Drawbacks**:

- Boilerplate code
- Learning curve
- Overkill for simple apps
- Performance overhead

### Advanced Questions

**Q: How would you implement optimistic updates in a state management system?**
A: Optimistic updates modify UI immediately, then sync with server:

```javascript
// Redux Toolkit example
const userSlice = createSlice({
  name: "user",
  initialState: { users: [], loading: false },
  reducers: {
    addUserOptimistic: (state, action) => {
      state.users.push({ ...action.payload, id: "temp-" + Date.now() });
    },
    addUserSuccess: (state, action) => {
      const index = state.users.findIndex((u) => u.id.startsWith("temp-"));
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    addUserFailure: (state, action) => {
      state.users = state.users.filter((u) => !u.id.startsWith("temp-"));
    },
  },
});

// Usage
const addUser = (userData) => async (dispatch) => {
  // Optimistic update
  dispatch(addUserOptimistic(userData));

  try {
    const response = await api.createUser(userData);
    dispatch(addUserSuccess(response.data));
  } catch (error) {
    dispatch(addUserFailure(error));
  }
};
```

**Q: How would you implement real-time state synchronization?**
A: Using WebSockets with state management:

```javascript
class RealTimeStateManager {
  constructor(store) {
    this.store = store;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.scheduleReconnect();
    };
  }

  handleMessage(data) {
    switch (data.type) {
      case "USER_UPDATED":
        this.store.dispatch(updateUser(data.payload));
        break;
      case "MESSAGE_RECEIVED":
        this.store.dispatch(addMessage(data.payload));
        break;
      case "STATUS_CHANGED":
        this.store.dispatch(updateUserStatus(data.payload));
        break;
    }
  }

  sendMessage(type, payload) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;

      setTimeout(() => {
        this.connect(this.socket.url);
      }, delay);
    }
  }
}

// Usage
const realTimeManager = new RealTimeStateManager(store);
realTimeManager.connect("wss://api.example.com/ws");
```

## Practical Problems & Solutions

### Problem 1: Implement a Custom State Management Library

**Challenge**: Create a lightweight state management library similar to Zustand.

```javascript
class SimpleStore {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
    this.middleware = [];
  }

  getState() {
    return this.state;
  }

  setState(partial) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...partial };

    // Run middleware
    this.middleware.forEach((middleware) => {
      middleware(prevState, this.state);
    });

    // Notify listeners
    this.listeners.forEach((listener) => listener(this.state, prevState));
  }

  subscribe(listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  useMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  // Action creators
  createAction(type, payload) {
    return { type, payload, timestamp: Date.now() };
  }

  dispatch(action) {
    // Log action for debugging
    console.log("Action:", action);

    // Update state based on action
    switch (action.type) {
      case "INCREMENT":
        this.setState({ count: this.state.count + 1 });
        break;
      case "SET_USER":
        this.setState({ user: action.payload });
        break;
      case "ADD_TODO":
        this.setState({
          todos: [...this.state.todos, action.payload],
        });
        break;
      default:
        console.warn("Unknown action type:", action.type);
    }
  }
}

// React hook for using the store
function useStore(store, selector) {
  const [state, setState] = React.useState(() => selector(store.getState()));

  React.useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      const newSelectedState = selector(newState);
      setState(newSelectedState);
    });

    return unsubscribe;
  }, [store, selector]);

  return state;
}

// Usage
const store = new SimpleStore({
  count: 0,
  user: null,
  todos: [],
});

// Add logging middleware
store.useMiddleware((prevState, newState) => {
  console.log("State changed:", { prevState, newState });
});

// React component
function Counter() {
  const count = useStore(store, (state) => state.count);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => store.dispatch({ type: "INCREMENT" })}>
        Increment
      </button>
    </div>
  );
}
```

### Problem 2: Create a Form State Manager

**Challenge**: Build a comprehensive form state management system with validation and error handling.

```javascript
class FormStateManager {
  constructor(initialValues = {}, validationSchema = {}) {
    this.initialValues = initialValues;
    this.validationSchema = validationSchema;
    this.state = {
      values: { ...initialValues },
      errors: {},
      touched: {},
      isValid: true,
      isDirty: false,
      isSubmitting: false,
    };
    this.listeners = new Set();
  }

  getFieldValue(name) {
    return this.state.values[name];
  }

  setFieldValue(name, value) {
    const newValues = { ...this.state.values, [name]: value };
    const newErrors = this.validateField(name, value);
    const newTouched = { ...this.state.touched, [name]: true };

    this.setState({
      values: newValues,
      errors: { ...this.state.errors, [name]: newErrors[name] },
      touched: newTouched,
      isDirty: true,
      isValid: this.validateForm(newValues),
    });
  }

  setFieldError(name, error) {
    this.setState({
      errors: { ...this.state.errors, [name]: error },
      isValid: this.validateForm(this.state.values),
    });
  }

  validateField(name, value) {
    const fieldSchema = this.validationSchema[name];
    if (!fieldSchema) return {};

    const errors = {};

    // Required validation
    if (fieldSchema.required && (!value || value.trim() === "")) {
      errors[name] = fieldSchema.required;
    }

    // Pattern validation
    if (fieldSchema.pattern && value && !fieldSchema.pattern.test(value)) {
      errors[name] = fieldSchema.patternMessage || "Invalid format";
    }

    // Custom validation
    if (fieldSchema.validate) {
      const customError = fieldSchema.validate(value, this.state.values);
      if (customError) {
        errors[name] = customError;
      }
    }

    return errors;
  }

  validateForm(values) {
    const errors = {};

    Object.keys(this.validationSchema).forEach((fieldName) => {
      const fieldErrors = this.validateField(fieldName, values[fieldName]);
      Object.assign(errors, fieldErrors);
    });

    return Object.keys(errors).length === 0;
  }

  handleSubmit(onSubmit) {
    return async (event) => {
      event?.preventDefault();

      if (!this.state.isValid) {
        // Mark all fields as touched to show errors
        const touched = {};
        Object.keys(this.validationSchema).forEach((key) => {
          touched[key] = true;
        });

        this.setState({ touched });
        return;
      }

      this.setState({ isSubmitting: true });

      try {
        await onSubmit(this.state.values);
        this.setState({ isSubmitting: false });
      } catch (error) {
        this.setState({
          isSubmitting: false,
          errors: { submit: error.message },
        });
      }
    };
  }

  reset() {
    this.setState({
      values: { ...this.initialValues },
      errors: {},
      touched: {},
      isValid: true,
      isDirty: false,
      isSubmitting: false,
    });
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// React hook for form state
function useFormState(formManager) {
  const [state, setState] = React.useState(formManager.state);

  React.useEffect(() => {
    return formManager.subscribe(setState);
  }, [formManager]);

  return {
    ...state,
    setFieldValue: formManager.setFieldValue.bind(formManager),
    setFieldError: formManager.setFieldError.bind(formManager),
    handleSubmit: formManager.handleSubmit.bind(formManager),
    reset: formManager.reset.bind(formManager),
  };
}

// Usage
const validationSchema = {
  email: {
    required: "Email is required",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: "Invalid email format",
  },
  password: {
    required: "Password is required",
    validate: (value) => {
      if (value.length < 8) {
        return "Password must be at least 8 characters";
      }
      return null;
    },
  },
};

const formManager = new FormStateManager(
  { email: "", password: "" },
  validationSchema
);

function LoginForm() {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setFieldValue,
    handleSubmit,
  } = useFormState(formManager);

  const onSubmit = async (values) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setFieldValue("email", e.target.value)}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          value={values.password}
          onChange={(e) => setFieldValue("password", e.target.value)}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Problem 3: Implement Redux with Middleware

**Challenge**: Create a Redux-like state management system with middleware support.

```javascript
// Action types
const ActionTypes = {
  INIT: "@@redux/INIT",
};

// Create store
function createStore(reducer, initialState, enhancer) {
  if (typeof enhancer === "function") {
    return enhancer(createStore)(reducer, initialState);
  }

  let state = initialState;
  let listeners = [];
  let isDispatching = false;

  function getState() {
    if (isDispatching) {
      throw new Error("Cannot call getState while dispatching");
    }
    return state;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("Listener must be a function");
    }

    let isSubscribed = true;
    listeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) return;

      isSubscribed = false;
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    if (!action || typeof action.type === "undefined") {
      throw new Error("Actions must have a type property");
    }

    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions");
    }

    try {
      isDispatching = true;
      state = reducer(state, action);
    } finally {
      isDispatching = false;
    }

    listeners.forEach((listener) => listener());
    return action;
  }

  // Initialize store
  dispatch({ type: ActionTypes.INIT });

  return {
    getState,
    subscribe,
    dispatch,
  };
}

// Apply middleware
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    let dispatch = store.dispatch;

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
    };

    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

// Compose functions
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

// Logger middleware
function logger(middlewareAPI) {
  return (next) => (action) => {
    console.group(action.type);
    console.log("Previous State:", middlewareAPI.getState());
    console.log("Action:", action);

    const result = next(action);

    console.log("Next State:", middlewareAPI.getState());
    console.groupEnd();

    return result;
  };
}

// Thunk middleware
function thunk(middlewareAPI) {
  return (next) => (action) => {
    if (typeof action === "function") {
      return action(middlewareAPI.dispatch, middlewareAPI.getState);
    }
    return next(action);
  };
}

// Example reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "SET_COUNT":
      return { ...state, count: action.payload };
    default:
      return state;
  }
}

// Action creators
const increment = () => ({ type: "INCREMENT" });
const decrement = () => ({ type: "DECREMENT" });
const setCount = (count) => ({ type: "SET_COUNT", payload: count });

// Async action creator
const incrementAsync = () => (dispatch, getState) => {
  setTimeout(() => {
    dispatch(increment());
  }, 1000);
};

// Create store with middleware
const store = createStore(
  counterReducer,
  { count: 0 },
  applyMiddleware(logger, thunk)
);

// Usage
store.subscribe(() => {
  console.log("State:", store.getState());
});

store.dispatch(increment()); // 1
store.dispatch(incrementAsync()); // 2 (after 1 second)
store.dispatch(setCount(10)); // 10
```

### Problem 4: Create a State Persistence System

**Challenge**: Implement a system to persist and rehydrate state across browser sessions.

```javascript
class StatePersistence {
  constructor(storage = localStorage, key = "app-state") {
    this.storage = storage;
    this.key = key;
    this.subscribers = new Set();
  }

  save(state, options = {}) {
    const {
      includeKeys = null,
      excludeKeys = null,
      transform = null,
    } = options;

    let stateToSave = state;

    // Filter keys
    if (includeKeys) {
      stateToSave = Object.keys(state)
        .filter((key) => includeKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = state[key];
          return obj;
        }, {});
    }

    if (excludeKeys) {
      stateToSave = Object.keys(state)
        .filter((key) => !excludeKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = state[key];
          return obj;
        }, {});
    }

    // Transform state
    if (transform) {
      stateToSave = transform(stateToSave);
    }

    try {
      const serialized = JSON.stringify(stateToSave);
      this.storage.setItem(this.key, serialized);
      this.notifySubscribers("saved", stateToSave);
    } catch (error) {
      console.error("Failed to save state:", error);
      this.notifySubscribers("error", error);
    }
  }

  load(options = {}) {
    const { transform = null, defaultValue = {} } = options;

    try {
      const serialized = this.storage.getItem(this.key);
      if (!serialized) {
        return defaultValue;
      }

      let state = JSON.parse(serialized);

      // Transform state
      if (transform) {
        state = transform(state);
      }

      this.notifySubscribers("loaded", state);
      return state;
    } catch (error) {
      console.error("Failed to load state:", error);
      this.notifySubscribers("error", error);
      return defaultValue;
    }
  }

  clear() {
    try {
      this.storage.removeItem(this.key);
      this.notifySubscribers("cleared");
    } catch (error) {
      console.error("Failed to clear state:", error);
      this.notifySubscribers("error", error);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(event, data) {
    this.subscribers.forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        console.error("Subscriber error:", error);
      }
    });
  }
}

// Enhanced store with persistence
function createPersistentStore(reducer, initialState, options = {}) {
  const {
    storage = localStorage,
    key = "app-state",
    includeKeys = null,
    excludeKeys = null,
    transform = null,
  } = options;

  const persistence = new StatePersistence(storage, key);

  // Load initial state from storage
  const savedState = persistence.load({
    transform,
    defaultValue: initialState,
  });
  const store = createStore(reducer, savedState);

  // Subscribe to state changes and save
  store.subscribe(() => {
    const currentState = store.getState();
    persistence.save(currentState, { includeKeys, excludeKeys, transform });
  });

  // Add persistence methods to store
  store.persist = {
    clear: () => persistence.clear(),
    on: (event, callback) => persistence.subscribe(callback),
  };

  return store;
}

// Usage
const counterReducer = (state = { count: 0, lastUpdated: null }, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1,
        lastUpdated: new Date().toISOString(),
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1,
        lastUpdated: new Date().toISOString(),
      };
    default:
      return state;
  }
};

// Create persistent store
const store = createPersistentStore(
  counterReducer,
  { count: 0, lastUpdated: null },
  {
    key: "counter-state",
    includeKeys: ["count"], // Only persist count
    transform: (state) => ({
      ...state,
      version: "1.0", // Add version for migration
    }),
  }
);

// Listen to persistence events
store.persist.on("saved", (state) => {
  console.log("State saved:", state);
});

store.persist.on("loaded", (state) => {
  console.log("State loaded:", state);
});

store.persist.on("error", (error) => {
  console.error("Persistence error:", error);
});

// Use the store
store.dispatch({ type: "INCREMENT" });
// State will be automatically saved to localStorage

// Clear persisted state
// store.persist.clear();
```

## Best Practices

### State Structure

- Normalize complex data structures
- Keep state flat and avoid nesting
- Separate UI state from business logic
- Use selectors for derived state
- Implement proper error boundaries

### Performance Optimization

- Use React.memo for expensive components
- Implement proper memoization with useMemo/useCallback
- Avoid unnecessary re-renders
- Use React DevTools Profiler
- Implement code splitting for large state

### Testing

- Test reducers as pure functions
- Mock external dependencies
- Test async actions with proper setup/teardown
- Use snapshot testing for UI components
- Implement integration tests for state flows

## Resources

### Documentation

- [Redux Documentation](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Context API](https://reactjs.org/docs/context.html)
- [Zustand](https://github.com/pmndrs/zustand)

### Tools

- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Immer](https://immerjs.github.io/immer/) - Immutable updates
- [Reselect](https://github.com/reduxjs/reselect) - Memoized selectors

### Practice Platforms

- [Redux Toolkit Examples](https://redux-toolkit.js.org/introduction/quick-start)
- [React State Management Patterns](https://kentcdodds.com/blog/application-state-management-with-react)
- [State Management Best Practices](https://redux.js.org/style-guide/)

---

_This guide covers essential state management concepts for frontend interviews, including practical problems and advanced techniques commonly asked at Big Tech companies._
