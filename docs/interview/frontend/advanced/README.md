# Advanced Frontend Topics

## Modern Web Technologies

### Web Components

- **Custom Elements**: Creating reusable HTML elements
- **Shadow DOM**: Encapsulated styling and behavior
- **HTML Templates**: Reusable markup structures
- **ES Modules**: Modern JavaScript module system

### Progressive Web Apps (PWA)

- **Service Workers**: Background sync and caching
- **Web App Manifest**: App-like experience
- **Push Notifications**: Real-time updates
- **Offline Support**: Cache-first strategies

### Web APIs

- **Intersection Observer**: Performance monitoring
- **Resize Observer**: Responsive layouts
- **Mutation Observer**: DOM changes detection
- **Web Workers**: Background processing
- **WebAssembly**: High-performance code

## Advanced Performance Techniques

### Bundle Optimization

{% raw %}
```javascript
// Dynamic imports for code splitting
const loadComponent = async (componentName) => {
  const module = await import(`./components/${componentName}.js`);
  return module.default;
};

// Route-based code splitting
const routes = {
  "/dashboard": () => import("./pages/Dashboard.js"),
  "/profile": () => import("./pages/Profile.js"),
  "/settings": () => import("./pages/Settings.js"),
};
```
{% endraw %}

### Memory Management

```javascript
// WeakMap for object references
const cache = new WeakMap();

// Memory leak prevention
class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  addListener(element, event, handler) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }
    this.listeners.get(element).set(event, handler);
    element.addEventListener(event, handler);
  }

  removeListener(element, event) {
    const elementListeners = this.listeners.get(element);
    if (elementListeners && elementListeners.has(event)) {
      const handler = elementListeners.get(event);
      element.removeEventListener(event, handler);
      elementListeners.delete(event);

      if (elementListeners.size === 0) {
        this.listeners.delete(element);
      }
    }
  }

  cleanup() {
    this.listeners.forEach((elementListeners, element) => {
      elementListeners.forEach((handler, event) => {
        element.removeEventListener(event, handler);
      });
    });
    this.listeners.clear();
  }
}
```

### Virtual Scrolling

```javascript
class VirtualScroller {
  constructor(container, itemHeight, totalItems, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.renderItem = renderItem;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
    this.scrollTop = 0;
    this.startIndex = 0;
    this.endIndex = this.visibleItems;

    this.setupContainer();
    this.render();
  }

  setupContainer() {
    this.container.style.position = "relative";
    this.container.style.overflow = "auto";

    // Create spacer for total height
    this.spacer = document.createElement("div");
    this.spacer.style.height = `${this.totalItems * this.itemHeight}px`;
    this.container.appendChild(this.spacer);

    // Create content container
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.content.style.top = "0";
    this.content.style.left = "0";
    this.content.style.right = "0";
    this.container.appendChild(this.content);

    this.container.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const newScrollTop = this.container.scrollTop;
    const newStartIndex = Math.floor(newScrollTop / this.itemHeight);
    const newEndIndex = Math.min(
      newStartIndex + this.visibleItems + 1,
      this.totalItems
    );

    if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
      this.startIndex = newStartIndex;
      this.endIndex = newEndIndex;
      this.render();
    }
  }

  render() {
    this.content.innerHTML = "";
    this.content.style.transform = `translateY(${
      this.startIndex * this.itemHeight
    }px)`;

    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = this.renderItem(i);
      item.style.height = `${this.itemHeight}px`;
      this.content.appendChild(item);
    }
  }
}
```

## Advanced State Management

### Observable Pattern

```javascript
class Observable {
  constructor() {
    this.observers = new Set();
  }

  subscribe(observer) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

class Store extends Observable {
  constructor(initialState = {}) {
    super();
    this.state = initialState;
    this.history = [];
    this.historyIndex = -1;
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push({ ...this.state });
    this.historyIndex++;

    this.state = { ...this.state, ...newState };
    this.notify(this.state);
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = { ...this.history[this.historyIndex] };
      this.notify(this.state);
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = { ...this.history[this.historyIndex] };
      this.notify(this.state);
    }
  }
}
```

### Middleware Pattern

```javascript
class MiddlewareManager {
  constructor() {
    this.middleware = [];
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  execute(context, next) {
    let index = 0;

    const run = (i) => {
      if (i >= this.middleware.length) {
        return next(context);
      }

      return this.middleware[i](context, () => run(i + 1));
    };

    return run(0);
  }
}

// Usage example
const manager = new MiddlewareManager();

manager.use((context, next) => {
  console.log("Before action:", context.action);
  const result = next(context);
  console.log("After action:", result);
  return result;
});

manager.use((context, next) => {
  if (context.action.type === "ASYNC") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(next(context));
      }, 1000);
    });
  }
  return next(context);
});
```

## Advanced CSS Techniques

### CSS Custom Properties

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 8px;
  --border-radius: 4px;
  --transition-duration: 0.3s;
}

.component {
  color: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
  transition: all var(--transition-duration) ease;
}

.component:hover {
  --primary-color: #0056b3;
}
```

### CSS Grid Advanced

```css
.layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 1rem;
  min-height: 100vh;
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}

/* Responsive grid */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
```

### CSS-in-JS Advanced

```javascript
const createStyles = (theme) => ({
  button: {
    padding: `${theme.spacing.medium} ${theme.spacing.large}`,
    borderRadius: theme.borderRadius.medium,
    border: "none",
    cursor: "pointer",
    transition: `all ${theme.transitions.fast} ease`,

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows.medium,
    },

    "&:active": {
      transform: "translateY(0)",
    },

    "&.primary": {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,

      "&:hover": {
        backgroundColor: theme.colors.primaryDark,
      },
    },

    "&.secondary": {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,

      "&:hover": {
        backgroundColor: theme.colors.secondaryDark,
      },
    },

    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },
  },
});
```

## Advanced JavaScript Patterns

### Decorator Pattern

```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage
const expensiveOperation = debounce((searchTerm) => {
  // API call or expensive computation
  console.log("Searching for:", searchTerm);
}, 300);

const scrollHandler = throttle(() => {
  // Handle scroll events
  console.log("Scroll position:", window.scrollY);
}, 100);
```

### Proxy Pattern

```javascript
class ValidationProxy {
  constructor(target, schema) {
    this.target = target;
    this.schema = schema;
  }

  set(target, property, value) {
    if (this.schema[property]) {
      const validator = this.schema[property];
      if (!validator(value)) {
        throw new Error(`Invalid value for property ${property}`);
      }
    }
    target[property] = value;
    return true;
  }

  get(target, property) {
    return target[property];
  }
}

// Usage
const userSchema = {
  name: (value) => typeof value === "string" && value.length > 0,
  age: (value) => typeof value === "number" && value >= 0 && value <= 150,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
};

const user = new Proxy({}, new ValidationProxy({}, userSchema));

try {
  user.name = "John";
  user.age = 25;
  user.email = "john@example.com";
  console.log("User created successfully");
} catch (error) {
  console.error("Validation error:", error.message);
}
```

### Module Pattern

```javascript
const Module = (function () {
  // Private variables
  let privateVar = "private";

  // Private function
  function privateFunction() {
    return privateVar;
  }

  // Public API
  return {
    publicVar: "public",

    publicFunction: function () {
      return privateFunction();
    },

    setPrivateVar: function (value) {
      privateVar = value;
    },
  };
})();
```

## Advanced React Patterns

### Render Props

```javascript
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <h1>
      The mouse position is ({x}, {y})
    </h1>
  )}
/>;
```

### Higher-Order Components (HOC)

```javascript
function withLoading(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { loading: true };
    }

    componentDidMount() {
      // Simulate loading
      setTimeout(() => {
        this.setState({ loading: false });
      }, 2000);
    }

    render() {
      if (this.state.loading) {
        return <div>Loading...</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}

// Usage
const UserProfileWithLoading = withLoading(UserProfile);
```

### Custom Hooks Advanced

```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

## Advanced Interview Questions

### Performance Questions

**Q: How would you optimize a large list rendering?**
A: Multiple optimization strategies:

{% raw %}
```javascript
// 1. Virtual Scrolling
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {items.slice(startIndex, endIndex).map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. React.memo for expensive components
const ExpensiveItem = React.memo(({ item }) => {
  return (
    <div className="item">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
});

// 3. useMemo for expensive calculations
function ExpensiveList({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.name.includes(filter));
  }, [items, filter]);

  return (
    <div>
      {filteredItems.map((item) => (
        <ExpensiveItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```
{% endraw %}

### Architecture Questions

**Q: How would you design a scalable component library?**
A: Comprehensive design system:

```javascript
// Design System Architecture
class DesignSystem {
  constructor() {
    this.themes = new Map();
    this.components = new Map();
    this.tokens = new Map();
  }

  // Design tokens
  defineTokens(tokens) {
    Object.entries(tokens).forEach(([key, value]) => {
      this.tokens.set(key, value);
    });
  }

  // Theme system
  createTheme(name, overrides = {}) {
    const baseTheme = {
      colors: {
        primary: "#007bff",
        secondary: "#6c757d",
        success: "#28a745",
        danger: "#dc3545",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      typography: {
        fontFamily: "system-ui, sans-serif",
        fontSize: {
          small: "12px",
          base: "16px",
          large: "20px",
          xlarge: "24px",
        },
      },
    };

    const theme = { ...baseTheme, ...overrides };
    this.themes.set(name, theme);
    return theme;
  }

  // Component factory
  createComponent(name, config) {
    const component = {
      name,
      variants: config.variants || {},
      props: config.props || {},
      styles: config.styles || {},
      ...config,
    };

    this.components.set(name, component);
    return component;
  }

  // Style generation
  generateStyles(componentName, variant = "default", props = {}) {
    const component = this.components.get(componentName);
    const theme = this.themes.get(props.theme || "default");

    if (!component) {
      throw new Error(`Component ${componentName} not found`);
    }

    return this.processStyles(component.styles, theme, variant, props);
  }

  processStyles(styles, theme, variant, props) {
    // Process CSS-in-JS styles with theme tokens
    return Object.entries(styles).reduce((processed, [key, value]) => {
      processed[key] = this.replaceTokens(value, theme, variant, props);
      return processed;
    }, {});
  }

  replaceTokens(value, theme, variant, props) {
    // Replace design tokens with actual values
    return value.replace(/\{(\w+)\}/g, (match, token) => {
      return theme[token] || this.tokens.get(token) || match;
    });
  }
}

// Usage
const designSystem = new DesignSystem();

// Define tokens
designSystem.defineTokens({
  borderRadius: "4px",
  transitionDuration: "0.3s",
});

// Create theme
const lightTheme = designSystem.createTheme("light", {
  colors: {
    primary: "#0066cc",
  },
});

// Create component
const button = designSystem.createComponent("Button", {
  variants: {
    primary: {
      backgroundColor: "{colors.primary}",
      color: "white",
      borderRadius: "{borderRadius}",
      transition: `all {transitionDuration} ease`,
    },
    secondary: {
      backgroundColor: "{colors.secondary}",
      color: "white",
      borderRadius: "{borderRadius}",
    },
  },
  styles: {
    padding: "{spacing.md} {spacing.lg}",
    border: "none",
    cursor: "pointer",
  },
});
```

## Resources

### Advanced Topics

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Performance

- [Web Performance](https://web.dev/performance/)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)
- [Bundle Analysis](https://webpack.js.org/guides/code-splitting/)

### Architecture

- [Design Systems](https://www.designsystems.com/)
- [Component Architecture](https://reactjs.org/docs/composition-vs-inheritance.html)
- [State Management](https://redux.js.org/)

---

_This guide covers advanced frontend topics essential for senior-level interviews at Big Tech companies, including modern web technologies, performance optimization, and architectural patterns._
