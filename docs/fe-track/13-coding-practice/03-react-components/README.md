# React Component Challenges

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

> Bài tập xây dựng React components và custom hooks phổ biến trong phỏng vấn.

---

## 📋 Problem List

| # | Problem | Difficulty | Time | Focus |
|---|---------|------------|------|-------|
| 1 | Autocomplete | 🟡 Medium | 35 min | Debounce, A11y |
| 2 | Data Table | 🔴 Hard | 45 min | Sort, Filter, Pagination |
| 3 | useLocalStorage | 🟢 Easy | 15 min | Custom Hook |
| 4 | Infinite Query | 🟡 Medium | 30 min | Data Fetching |
| 5 | Accordion | 🟡 Medium | 25 min | Compound Component |
| 6 | useDebounce | 🟢 Easy | 15 min | Custom Hook |
| 7 | Tabs | 🟡 Medium | 25 min | Compound Component |
| 8 | Modal | 🟡 Medium | 30 min | Portal, Focus Trap |

---

## 🎯 Key Patterns

### Custom Hook: useLocalStorage

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

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
```

### Custom Hook: useDebounce

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
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSearchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### Compound Component: Accordion

```javascript
const AccordionContext = createContext();

function Accordion({ children, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggle = useCallback((id) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }, [allowMultiple]);

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, children }) {
  const { openItems, toggle } = useContext(AccordionContext);
  const isOpen = openItems.has(id);

  return (
    <div className="accordion-item">
      {Children.map(children, child =>
        cloneElement(child, { isOpen, onToggle: () => toggle(id) })
      )}
    </div>
  );
}

function AccordionHeader({ children, isOpen, onToggle }) {
  return (
    <button
      className="accordion-header"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      {children}
      <span>{isOpen ? '−' : '+'}</span>
    </button>
  );
}

function AccordionPanel({ children, isOpen }) {
  return (
    <div
      className="accordion-panel"
      hidden={!isOpen}
      role="region"
    >
      {children}
    </div>
  );
}

// Usage
<Accordion>
  <AccordionItem id="1">
    <AccordionHeader>Section 1</AccordionHeader>
    <AccordionPanel>Content 1</AccordionPanel>
  </AccordionItem>
  <AccordionItem id="2">
    <AccordionHeader>Section 2</AccordionHeader>
    <AccordionPanel>Content 2</AccordionPanel>
  </AccordionItem>
</Accordion>
```

---

## 📊 Component Patterns Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT PATTERNS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CUSTOM HOOKS:                                                 │
│   • useLocalStorage   - Persist state                           │
│   • useDebounce       - Delay value updates                     │
│   • useFetch          - Data fetching                           │
│   • useIntersection   - Visibility detection                    │
│   • usePrevious       - Track previous value                    │
│   • useClickOutside   - Detect outside clicks                   │
│                                                                   │
│   COMPOUND COMPONENTS:                                          │
│   • Accordion         - Expandable sections                     │
│   • Tabs              - Tab navigation                          │
│   • Menu              - Dropdown menu                           │
│   • Select            - Custom select                           │
│                                                                   │
│   RENDER PROPS:                                                 │
│   • Toggle            - Boolean state sharing                   │
│   • Form              - Form state management                   │
│   • DataFetcher       - Async data handling                     │
│                                                                   │
│   HOC (Higher-Order Components):                                │
│   • withAuth          - Authentication wrapper                  │
│   • withLoading       - Loading state wrapper                   │
│   • withErrorBoundary - Error handling wrapper                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💡 Sample: Autocomplete Component

```javascript
function Autocomplete({ suggestions, onSelect, placeholder }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef();
  const listRef = useRef();

  const filteredSuggestions = useMemo(() => {
    if (!debouncedQuery) return [];
    return suggestions.filter(item =>
      item.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [suggestions, debouncedQuery]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          handleSelect(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (item) => {
    setQuery(item);
    setIsOpen(false);
    onSelect?.(item);
  };

  useEffect(() => {
    setIsOpen(filteredSuggestions.length > 0);
    setHighlightedIndex(-1);
  }, [filteredSuggestions.length]);

  return (
    <div className="autocomplete">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(filteredSuggestions.length > 0)}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls="suggestions-list"
      />
      {isOpen && (
        <ul
          id="suggestions-list"
          ref={listRef}
          role="listbox"
          className="suggestions"
        >
          {filteredSuggestions.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={index === highlightedIndex}
              className={index === highlightedIndex ? 'highlighted' : ''}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 🔑 Checklist for React Components

```
FUNCTIONALITY:
□ Core feature works correctly
□ Edge cases handled (empty, loading, error)
□ Controlled/Uncontrolled mode support

ACCESSIBILITY:
□ Keyboard navigation
□ ARIA attributes
□ Focus management
□ Screen reader tested

PERFORMANCE:
□ Memoization where needed
□ Avoid unnecessary re-renders
□ Lazy loading if applicable

CODE QUALITY:
□ TypeScript types
□ PropTypes/default props
□ Clean component API
□ Proper error boundaries
```

---

> **Quay lại:** [Coding Practice](../README.md)
