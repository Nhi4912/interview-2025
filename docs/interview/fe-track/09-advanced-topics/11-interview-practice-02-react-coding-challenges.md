# React Coding Challenges
## Interview Practice - Chapter 2

[← Previous: JavaScript Challenges](./01-javascript-coding-challenges.md) | [Back to Table of Contents](../00-table-of-contents.md)

---

## Overview

This chapter contains 30+ React coding challenges commonly asked in Big Tech interviews, covering hooks, state management, performance, and real-world scenarios.

---

## Table of Contents

1. [Component Challenges](#component-challenges)
2. [Hooks Challenges](#hooks-challenges)
3. [State Management](#state-management)
4. [Performance Challenges](#performance-challenges)
5. [Real-World Scenarios](#real-world-scenarios)

---

## Component Challenges

### Easy: Counter Component

**Problem:** Build a counter with increment, decrement, and reset.

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

---

### Easy: Toggle Component

**Problem:** Build a toggle switch.

```javascript
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOn(!isOn)}>
        {isOn ? 'ON' : 'OFF'}
      </button>
      {isOn && <p>Content is visible</p>}
    </div>
  );
}
```

---

### Medium: Accordion Component

**Problem:** Build an accordion that expands/collapses sections.

```javascript
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggle(index)}
          >
            {item.title}
            <span>{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="accordion-content">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Usage
const items = [
  { title: 'Section 1', content: 'Content 1' },
  { title: 'Section 2', content: 'Content 2' },
];

<Accordion items={items} />
```

---

### Medium: Tabs Component

**Problem:** Build a tabs component.

```javascript
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

// Usage
const tabs = [
  { label: 'Tab 1', content: <div>Content 1</div> },
  { label: 'Tab 2', content: <div>Content 2</div> },
];

<Tabs tabs={tabs} />
```

---

## Hooks Challenges

### Easy: useToggle Hook

**Problem:** Create a custom toggle hook.

```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
}

// Usage
function Component() {
  const { value, toggle, setTrue, setFalse } = useToggle();
  
  return (
    <div>
      <p>Value: {value.toString()}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
    </div>
  );
}
```

---

### Medium: useDebounce Hook

**Problem:** Create a debounce hook.

```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

### Medium: usePrevious Hook

**Problem:** Create a hook to track previous value.

```javascript
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

### Hard: useAsync Hook

**Problem:** Create a hook for async operations.

```javascript
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  
  const execute = useCallback((...params) => {
    setStatus('pending');
    setValue(null);
    setError(null);
    
    return asyncFunction(...params)
      .then(response => {
        setValue(response);
        setStatus('success');
        return response;
      })
      .catch(error => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFunction]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return { execute, status, value, error };
}

// Usage
function UserProfile({ userId }) {
  const fetchUser = useCallback(() => {
    return fetch(`/api/users/${userId}`).then(res => res.json());
  }, [userId]);
  
  const { value: user, status, error } = useAsync(fetchUser);
  
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;
  if (status === 'success') return <div>{user.name}</div>;
  
  return null;
}
```

---

## State Management

### Medium: Todo List

**Problem:** Build a todo list with add, toggle, delete.

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: input, completed: false }
      ]);
      setInput('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Hard: Shopping Cart

**Problem:** Build a shopping cart with add, remove, update quantity.

```javascript
function ShoppingCart() {
  const [cart, setCart] = useState([]);
  
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
  
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>${item.price}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="0"
          />
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <div>Total: ${total.toFixed(2)}</div>
    </div>
  );
}
```

---

## Performance Challenges

### Medium: Infinite Scroll

**Problem:** Implement infinite scroll.

```javascript
function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/items?page=${page}`);
      const newItems = await response.json();
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);
  
  useEffect(() => {
    loadMore();
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - 100
      ) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item.name}</div>
      ))}
      {loading && <div>Loading...</div>}
      {!hasMore && <div>No more items</div>}
    </div>
  );
}
```

---

### Hard: Virtual List

**Problem:** Implement virtual scrolling for large lists.

```javascript
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Usage
const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);
<VirtualList items={items} itemHeight={50} containerHeight={600} />
```

---

## Real-World Scenarios

### Medium: Auto-Save Form

**Problem:** Auto-save form data.

```javascript
function AutoSaveForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [saveStatus, setSaveStatus] = useState('saved');
  
  const debouncedFormData = useDebounce(formData, 1000);
  
  useEffect(() => {
    if (debouncedFormData.name || debouncedFormData.email) {
      setSaveStatus('saving');
      
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem('formData', JSON.stringify(debouncedFormData));
        setSaveStatus('saved');
      }, 500);
    }
  }, [debouncedFormData]);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveStatus('unsaved');
  };
  
  return (
    <div>
      <div>Status: {saveStatus}</div>
      <input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
    </div>
  );
}
```

---

### Hard: Drag and Drop

**Problem:** Implement drag and drop list reordering.

```javascript
function DragDropList({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            padding: '10px',
            margin: '5px',
            background: draggedIndex === index ? '#e0e0e0' : '#f5f5f5',
            cursor: 'move'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
```

---

### Hard: Real-Time Search with Highlights

**Problem:** Search with highlighted results.

```javascript
function SearchWithHighlight() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      // Simulate API call
      const mockResults = [
        'JavaScript',
        'TypeScript',
        'React',
        'Vue',
        'Angular'
      ].filter(item =>
        item.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);
  
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {highlightText(result, query)}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Key Takeaways

1. **Master hooks**: useState, useEffect, useCallback, useMemo
2. **Custom hooks**: Reusable logic extraction
3. **Performance**: Memoization, virtualization
4. **State management**: Complex state updates
5. **Real-world patterns**: Auto-save, drag-drop, search
6. **Clean code**: Readable, maintainable components
7. **Edge cases**: Empty states, loading, errors

---

[← Previous: JavaScript Challenges](./01-javascript-coding-challenges.md) | [Back to Table of Contents](../00-table-of-contents.md)
