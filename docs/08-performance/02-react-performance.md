# React Performance Optimization / Tối Ưu Hiệu Suất React
## Performance - Chapter 2 / Hiệu Suất - Chương 2

[← Previous: Core Web Vitals](./01-core-web-vitals.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: Bundle Optimization →](./03-bundle-optimization.md)

---

## Overview / Tổng Quan

**English:** React performance optimization is crucial for building fast, responsive applications. This chapter covers memoization, code splitting, lazy loading, and advanced techniques frequently discussed in Big Tech interviews.

**Tiếng Việt:** Tối ưu hiệu suất React rất quan trọng để xây dựng ứng dụng nhanh, phản hồi tốt. Chương này bao gồm memoization, code splitting, lazy loading và các kỹ thuật nâng cao thường được thảo luận trong phỏng vấn Big Tech.

---

## Table of Contents / Mục Lục

1. [React.memo / React.memo](#reactmemo--reactmemo)
2. [useMemo Hook / Hook useMemo](#usememo-hook--hook-usememo)
3. [useCallback Hook / Hook useCallback](#usecallback-hook--hook-usecallback)
4. [Code Splitting / Chia Tách Code](#code-splitting--chia-tách-code)
5. [Lazy Loading / Tải Lười](#lazy-loading--tải-lười)
6. [Virtualization / Ảo Hóa](#virtualization--ảo-hóa)
7. [Debouncing & Throttling / Debouncing & Throttling](#debouncing--throttling--debouncing--throttling)
8. [Profiling & Debugging / Profiling & Gỡ Lỗi](#profiling--debugging--profiling--gỡ-lỗi)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## React.memo / React.memo

### Concept / Khái Niệm

**English:** `React.memo` is a higher-order component that memoizes a component, preventing unnecessary re-renders when props haven't changed. It performs a shallow comparison of props.

**Tiếng Việt:** `React.memo` là higher-order component ghi nhớ một component, ngăn chặn re-render không cần thiết khi props không thay đổi. Nó thực hiện so sánh nông props.

### Basic Usage / Sử Dụng Cơ Bản

```typescript
// Without React.memo / Không có React.memo
function ExpensiveComponent({ value }: { value: number }) {
  console.log('Rendering ExpensiveComponent');
  
  // Expensive computation / Tính toán tốn kém
  const result = Array.from({ length: 1000000 }, (_, i) => i).reduce(
    (sum, n) => sum + n,
    0
  );

  return <div>Value: {value}, Result: {result}</div>;
}

// With React.memo / Với React.memo
const MemoizedComponent = React.memo(ExpensiveComponent);

// Parent component / Component cha
function Parent() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(10);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <button onClick={() => setValue(value + 1)}>
        Value: {value}
      </button>
      
      {/* Re-renders only when value changes / Chỉ re-render khi value thay đổi */}
      <MemoizedComponent value={value} />
    </div>
  );
}
```

### Custom Comparison / So Sánh Tùy Chỉnh

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  lastLogin: Date;
}

interface UserCardProps {
  user: User;
}

// Custom comparison function / Hàm so sánh tùy chỉnh
function arePropsEqual(
  prevProps: UserCardProps,
  nextProps: UserCardProps
): boolean {
  // Only re-render if id or name changes / Chỉ re-render nếu id hoặc name thay đổi
  // Ignore lastLogin changes / Bỏ qua thay đổi lastLogin
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name
  );
}

const UserCard = React.memo(
  ({ user }: UserCardProps) => {
    console.log('Rendering UserCard');
    return (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  arePropsEqual
);
```

### When NOT to Use React.memo / Khi KHÔNG Nên Dùng React.memo

```typescript
// ❌ Don't memo if props always change / Không memo nếu props luôn thay đổi
const AlwaysChanging = React.memo(({ timestamp }: { timestamp: number }) => {
  return <div>{timestamp}</div>;
});

// ❌ Don't memo simple components / Không memo component đơn giản
const SimpleButton = React.memo(({ onClick }: { onClick: () => void }) => {
  return <button onClick={onClick}>Click</button>;
});

// ❌ Don't memo if children always change / Không memo nếu children luôn thay đổi
const Wrapper = React.memo(({ children }: { children: ReactNode }) => {
  return <div className="wrapper">{children}</div>;
});

// ✅ Good use case: Expensive component with stable props
// ✅ Trường hợp tốt: Component tốn kém với props ổn định
const ExpensiveList = React.memo(({ items }: { items: string[] }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
});
```

---

## useMemo Hook / Hook useMemo

### Concept / Khái Niệm

**English:** `useMemo` memoizes the result of an expensive computation, recalculating only when dependencies change. Use it to optimize expensive calculations, not for every value.

**Tiếng Việt:** `useMemo` ghi nhớ kết quả của tính toán tốn kém, chỉ tính toán lại khi dependencies thay đổi. Sử dụng nó để tối ưu tính toán tốn kém, không phải cho mọi giá trị.

### Basic Usage / Sử Dụng Cơ Bản

```typescript
function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  // ❌ Without useMemo - recalculates on every render
  // ❌ Không có useMemo - tính toán lại mỗi lần render
  const filteredAndSorted = products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.price - b.price;
    });

  // ✅ With useMemo - recalculates only when dependencies change
  // ✅ Với useMemo - chỉ tính toán lại khi dependencies thay đổi
  const filteredAndSortedMemo = useMemo(() => {
    console.log('Filtering and sorting...');
    return products
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return a.price - b.price;
      });
  }, [products, filter, sortBy]);

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter products / Lọc sản phẩm"
      />
      <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
        <option value="name">Name / Tên</option>
        <option value="price">Price / Giá</option>
      </select>
      <ul>
        {filteredAndSortedMemo.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Complex Calculations / Tính Toán Phức Tạp

```typescript
function DataAnalytics({ data }: { data: number[] }) {
  // Expensive statistical calculations / Tính toán thống kê tốn kém
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');
    
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / data.length;
    
    const sortedData = [...data].sort((a, b) => a - b);
    const median = sortedData[Math.floor(data.length / 2)];
    
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    return { sum, mean, median, stdDev };
  }, [data]);

  return (
    <div>
      <p>Sum / Tổng: {statistics.sum}</p>
      <p>Mean / Trung bình: {statistics.mean.toFixed(2)}</p>
      <p>Median / Trung vị: {statistics.median}</p>
      <p>Std Dev / Độ lệch chuẩn: {statistics.stdDev.toFixed(2)}</p>
    </div>
  );
}
```

### Referential Equality / Đẳng Thức Tham Chiếu

```typescript
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New object on every render / Đối tượng mới mỗi lần render
  const config = {
    theme: 'dark',
    language: 'en'
  };

  // ✅ Stable reference / Tham chiếu ổn định
  const configMemo = useMemo(() => ({
    theme: 'dark',
    language: 'en'
  }), []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child config={configMemo} />
    </div>
  );
}

const Child = React.memo(({ config }: { config: any }) => {
  console.log('Child rendered');
  return <div>Theme: {config.theme}</div>;
});
```

---

## useCallback Hook / Hook useCallback

### Concept / Khái Niệm

**English:** `useCallback` memoizes a function, returning the same function reference unless dependencies change. Essential for preventing unnecessary re-renders of child components.

**Tiếng Việt:** `useCallback` ghi nhớ một hàm, trả về cùng tham chiếu hàm trừ khi dependencies thay đổi. Cần thiết để ngăn re-render không cần thiết của component con.

### Basic Usage / Sử Dụng Cơ Bản

```typescript
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');

  // ❌ New function on every render / Hàm mới mỗi lần render
  const handleToggle = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // ✅ Stable function reference / Tham chiếu hàm ổn định
  const handleToggleMemo = useCallback((id: number) => {
    setTodos(todos => todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // Empty deps because we use functional update / Deps rỗng vì dùng functional update

  const handleDelete = useCallback((id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggleMemo}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

// Memoized child component / Component con được memo
const TodoItem = React.memo(({
  todo,
  onToggle,
  onDelete
}: {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  console.log('Rendering TodoItem:', todo.id);
  
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete / Xóa</button>
    </div>
  );
});
```

### Event Handlers / Xử Lý Sự Kiện

```typescript
function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  // Debounced search / Tìm kiếm debounced
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300),
    [onSearch]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search... / Tìm kiếm..."
    />
  );
}
```

---

## Code Splitting / Chia Tách Code

### Dynamic Imports / Import Động

```typescript
// ❌ Static import - included in main bundle
// ❌ Import tĩnh - bao gồm trong bundle chính
import HeavyComponent from './HeavyComponent';

// ✅ Dynamic import - loaded on demand
// ✅ Import động - tải khi cần
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Load Heavy Component / Tải Component Nặng
      </button>
      
      {showHeavy && (
        <Suspense fallback={<div>Loading... / Đang tải...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### Route-Based Code Splitting / Chia Tách Code Theo Route

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load route components / Tải lười route components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      Loading... / Đang tải...
    </div>
  );
}
```

### Component-Based Code Splitting / Chia Tách Code Theo Component

```typescript
// Heavy chart library / Thư viện biểu đồ nặng
const Chart = lazy(() => import('./Chart'));
const DataTable = lazy(() => import('./DataTable'));
const Map = lazy(() => import('./Map'));

function Analytics() {
  const [activeTab, setActiveTab] = useState<'chart' | 'table' | 'map'>('chart');

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('chart')}>Chart / Biểu đồ</button>
        <button onClick={() => setActiveTab('table')}>Table / Bảng</button>
        <button onClick={() => setActiveTab('map')}>Map / Bản đồ</button>
      </nav>

      <Suspense fallback={<div>Loading... / Đang tải...</div>}>
        {activeTab === 'chart' && <Chart />}
        {activeTab === 'table' && <DataTable />}
        {activeTab === 'map' && <Map />}
      </Suspense>
    </div>
  );
}
```

---

## Lazy Loading / Tải Lười

### Images / Hình Ảnh

```typescript
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc || 'placeholder.jpg'}
      alt={alt}
      loading="lazy"
    />
  );
}

// Usage / Sử dụng
function Gallery({ images }: { images: string[] }) {
  return (
    <div className="gallery">
      {images.map((src, index) => (
        <LazyImage key={index} src={src} alt={`Image ${index}`} />
      ))}
    </div>
  );
}
```

### Infinite Scroll / Cuộn Vô Hạn

```typescript
function InfiniteList() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchItems(page);
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
      setHasMore(newItems.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
      
      {hasMore && (
        <div ref={loaderRef}>
          {loading ? 'Loading... / Đang tải...' : 'Load more / Tải thêm'}
        </div>
      )}
    </div>
  );
}
```

---

## Virtualization / Ảo Hóa

### Concept / Khái Niệm

**English:** Virtualization renders only visible items in a long list, dramatically improving performance for large datasets.

**Tiếng Việt:** Ảo hóa chỉ render các mục hiển thị trong danh sách dài, cải thiện đáng kể hiệu suất cho tập dữ liệu lớn.

### Using react-window

```typescript
import { FixedSizeList } from 'react-window';

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

function VirtualizedList({ items }: { items: string[] }) {
  const Row = ({ index, style }: RowProps) => (
    <div style={style}>
      Item {index}: {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Usage with 10,000 items / Sử dụng với 10,000 mục
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);
  
  return <VirtualizedList items={items} />;
}
```

---

## Debouncing & Throttling / Debouncing & Throttling

### Debounce Implementation / Triển Khai Debounce

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage / Sử dụng
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call / Gọi API
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Search... / Tìm kiếm..."
    />
  );
}
```

### Throttle Implementation / Triển Khai Throttle

```typescript
function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

// Usage for scroll events / Sử dụng cho sự kiện scroll
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 100);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Scroll position / Vị trí cuộn: {throttledScrollY}px</div>;
}
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Question 1: When to use useMemo vs useCallback?

**English Answer:**
- **useMemo**: Memoize computed values (expensive calculations, filtered arrays)
- **useCallback**: Memoize functions (event handlers, callbacks passed to children)

**Tiếng Việt:**
- **useMemo**: Ghi nhớ giá trị tính toán (tính toán tốn kém, mảng đã lọc)
- **useCallback**: Ghi nhớ hàm (xử lý sự kiện, callback truyền cho con)

### Question 2: What is the cost of React.memo?

**English Answer:**
React.memo adds overhead for prop comparison. Only use it when:
- Component is expensive to render
- Props are stable or change infrequently
- Component re-renders often with same props

**Tiếng Việt:**
React.memo thêm chi phí cho việc so sánh prop. Chỉ sử dụng khi:
- Component tốn kém để render
- Props ổn định hoặc thay đổi không thường xuyên
- Component re-render thường xuyên với cùng props

### Question 3: Explain code splitting benefits

**English Answer:**
- Smaller initial bundle size
- Faster initial page load
- Load code on demand
- Better caching (unchanged chunks stay cached)

**Tiếng Việt:**
- Kích thước bundle ban đầu nhỏ hơn
- Tải trang ban đầu nhanh hơn
- Tải code khi cần
- Cache tốt hơn (chunk không thay đổi vẫn được cache)

---

## Key Takeaways / Điểm Chính

**English:**
1. Use React.memo for expensive components with stable props
2. useMemo for expensive calculations, useCallback for functions
3. Code splitting reduces initial bundle size
4. Virtualization for long lists (1000+ items)
5. Debounce user input, throttle scroll/resize events
6. Profile before optimizing - measure impact

**Tiếng Việt:**
1. Dùng React.memo cho component tốn kém với props ổn định
2. useMemo cho tính toán tốn kém, useCallback cho hàm
3. Code splitting giảm kích thước bundle ban đầu
4. Ảo hóa cho danh sách dài (1000+ mục)
5. Debounce input người dùng, throttle sự kiện scroll/resize
6. Profile trước khi tối ưu - đo lường tác động

---

[← Previous: Core Web Vitals](./01-core-web-vitals.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: Bundle Optimization →](./03-bundle-optimization.md)
