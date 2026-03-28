# React Coding Challenges / Thử Thách Lập Trình React

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Interview Practice - Chapter 2 / Thực Hành Phỏng Vấn - Chương 2

[← Previous: JavaScript Challenges](./11-interview-practice-01-javascript-challenges.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Algorithm Problems →](./11-interview-practice-04-coding-patterns.md)

---

## Overview / Tổng Quan

**English:** This chapter contains React coding challenges commonly asked in Big Tech interviews. Each problem includes multiple solutions with explanations in both English and Vietnamese.

**Tiếng Việt:** Chương này chứa các thử thách lập trình React thường được hỏi trong phỏng vấn Big Tech. Mỗi bài toán bao gồm nhiều giải pháp với giải thích bằng cả tiếng Anh và tiếng Việt.

---

## Table of Contents / Mục Lục
1. [Custom Hooks / Hooks Tùy Chỉnh](#custom-hooks--hooks-tùy-chỉnh)
2. [Component Patterns / Mẫu Component](#component-patterns--mẫu-component)
3. [State Management / Quản Lý State](#state-management--quản-lý-state)
4. [Performance Optimization / Tối Ưu Hiệu Suất](#performance-optimization--tối-ưu-hiệu-suất)
5. [Real-World Scenarios / Tình Huống Thực Tế](#real-world-scenarios--tình-huống-thực-tế)

---

## Custom Hooks / Hooks Tùy Chỉnh

### Problem 1: useToggle Hook / Bài 1: Hook useToggle

**Difficulty / Độ khó:** Easy / Dễ  
**Companies / Công ty:** All / Tất cả

**English:** Create a custom hook that manages boolean state with toggle functionality.

**Tiếng Việt:** Tạo một hook tùy chỉnh quản lý state boolean với chức năng chuyển đổi.

```typescript
// Solution / Giải pháp
import { useState, useCallback } from 'react';

function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setToggle = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setToggle];
}

// Usage / Sử dụng
function ToggleExample() {
  const [isOn, toggle, setIsOn] = useToggle(false);

  return (
    <div>
      <p>Status / Trạng thái: {isOn ? 'ON / BẬT' : 'OFF / TẮT'}</p>
      <button onClick={toggle}>Toggle / Chuyển đổi</button>
      <button onClick={() => setIsOn(true)}>Turn On / Bật</button>
      <button onClick={() => setIsOn(false)}>Turn Off / Tắt</button>
    </div>
  );
}

// Time Complexity / Độ phức tạp thời gian: O(1)
// Space Complexity / Độ phức tạp không gian: O(1)
```

### Problem 2: useFetch Hook / Bài 2: Hook useFetch

**Difficulty / Độ khó:** Medium / Trung bình  
**Companies / Công ty:** Meta, Google, Amazon

**English:** Create a reusable hook for data fetching with loading, error, and data states.

**Tiếng Việt:** Tạo một hook có thể tái sử dụng để fetch dữ liệu với các state loading, error và data.

```typescript
// Solution / Giải pháp
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string, options?: RequestInit): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, refetchIndex]);

  const refetch = () => setRefetchIndex(prev => prev + 1);

  return { data, loading, error, refetch };
}

// Usage / Sử dụng
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const { data: user, loading, error, refetch } = useFetch<User>(
    `https://api.example.com/users/${userId}`
  );

  if (loading) return <div>Loading... / Đang tải...</div>;
  if (error) return <div>Error / Lỗi: {error.message}</div>;
  if (!user) return <div>No user found / Không tìm thấy người dùng</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh / Làm mới</button>
    </div>
  );
}

// Time Complexity / Độ phức tạp thời gian: O(1) for hook, O(n) for network
// Space Complexity / Độ phức tạp không gian: O(n) where n is data size
```

### Problem 3: useDebounce Hook / Bài 3: Hook useDebounce

**Difficulty / Độ khó:** Medium / Trung bình  
**Companies / Công ty:** All / Tất cả

**English:** Create a hook that debounces a value.

**Tiếng Việt:** Tạo một hook để debounce một giá trị.

```typescript
// Solution / Giải pháp
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer / Thiết lập bộ đếm thời gian
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup / Dọn dẹp
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage: Search component / Sử dụng: Component tìm kiếm
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search / Thực hiện tìm kiếm
      searchAPI(debouncedSearchTerm).then(setResults);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search... / Tìm kiếm..."
      />
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

// Mock API / API giả
async function searchAPI(query: string): Promise<string[]> {
  // Simulate API call / Mô phỏng gọi API
  await new Promise(resolve => setTimeout(resolve, 300));
  return [`Result 1 for ${query}`, `Result 2 for ${query}`];
}
```

---

## Component Patterns / Mẫu Component

### Problem 4: Accordion Component / Bài 4: Component Accordion

**Difficulty / Độ khó:** Medium / Trung bình  
**Companies / Công ty:** Meta, Amazon

**English:** Build an accessible accordion component that can expand/collapse sections.

**Tiếng Việt:** Xây dựng một component accordion có thể mở rộng/thu gọn các phần.

```typescript
// Solution / Giải pháp
import { useState, createContext, useContext } from 'react';

// Context for accordion state / Context cho state accordion
interface AccordionContextType {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within Accordion');
  }
  return context;
}

// Main Accordion component / Component Accordion chính
interface AccordionProps {
  children: React.ReactNode;
  defaultIndex?: number | null;
}

function Accordion({ children, defaultIndex = null }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);

  return (
    <AccordionContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

// Accordion Item / Mục Accordion
interface AccordionItemProps {
  index: number;
  title: string;
  children: React.ReactNode;
}

Accordion.Item = function AccordionItem({ index, title, children }: AccordionItemProps) {
  const { activeIndex, setActiveIndex } = useAccordion();
  const isActive = activeIndex === index;

  const toggle = () => {
    setActiveIndex(isActive ? null : index);
  };

  return (
    <div className="accordion-item">
      <button
        className="accordion-header"
        onClick={toggle}
        aria-expanded={isActive}
        aria-controls={`panel-${index}`}
      >
        {title}
        <span>{isActive ? '−' : '+'}</span>
      </button>
      {isActive && (
        <div
          id={`panel-${index}`}
          className="accordion-content"
          role="region"
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Usage / Sử dụng
function FAQ() {
  return (
    <Accordion defaultIndex={0}>
      <Accordion.Item index={0} title="What is React? / React là gì?">
        <p>
          React is a JavaScript library for building user interfaces.
          React là thư viện JavaScript để xây dựng giao diện người dùng.
        </p>
      </Accordion.Item>

      <Accordion.Item index={1} title="What are hooks? / Hooks là gì?">
        <p>
          Hooks are functions that let you use state and other React features.
          Hooks là các hàm cho phép bạn sử dụng state và các tính năng React khác.
        </p>
      </Accordion.Item>

      <Accordion.Item index={2} title="What is JSX? / JSX là gì?">
        <p>
          JSX is a syntax extension for JavaScript.
          JSX là phần mở rộng cú pháp cho JavaScript.
        </p>
      </Accordion.Item>
    </Accordion>
  );
}
```

### Problem 5: Infinite Scroll / Bài 5: Cuộn Vô Hạn

**Difficulty / Độ khó:** Hard / Khó  
**Companies / Công ty:** Meta, Google, Twitter

**English:** Implement an infinite scroll component that loads more data when user scrolls to bottom.

**Tiếng Việt:** Triển khai component cuộn vô hạn tải thêm dữ liệu khi người dùng cuộn xuống cuối.

```typescript
// Solution / Giải pháp
import { useState, useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps<T> {
  loadMore: (page: number) => Promise<T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  threshold?: number;
  loader?: React.ReactNode;
}

function InfiniteScroll<T>({
  loadMore,
  renderItem,
  threshold = 100,
  loader = <div>Loading... / Đang tải...</div>
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load initial data / Tải dữ liệu ban đầu
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const newItems = await loadMore(1);
      setItems(newItems);
      setHasMore(newItems.length > 0);
    } catch (error) {
      console.error('Error loading data / Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more data / Tải thêm dữ liệu
  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await loadMore(page + 1);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more / Lỗi tải thêm:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, loadMore]);

  // Set up Intersection Observer / Thiết lập Intersection Observer
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreData();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreData, hasMore, loading, threshold]);

  return (
    <div className="infinite-scroll">
      <div className="items-container">
        {items.map((item, index) => (
          <div key={index} className="item">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="sentinel">
          {loading && loader}
        </div>
      )}

      {!hasMore && (
        <div className="end-message">
          No more items / Không còn mục nào
        </div>
      )}
    </div>
  );
}

// Usage / Sử dụng
interface Post {
  id: number;
  title: string;
  body: string;
}

function PostList() {
  const loadPosts = async (page: number): Promise<Post[]> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
    );
    return response.json();
  };

  return (
    <InfiniteScroll<Post>
      loadMore={loadPosts}
      renderItem={(post) => (
        <div className="post">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      )}
      threshold={200}
    />
  );
}
```

---

## State Management / Quản Lý State

### Problem 6: Shopping Cart / Bài 6: Giỏ Hàng

**Difficulty / Độ khó:** Medium / Trung bình  
**Companies / Công ty:** Amazon, Shopify

**English:** Implement a shopping cart with add, remove, update quantity, and calculate total functionality.

**Tiếng Việt:** Triển khai giỏ hàng với chức năng thêm, xóa, cập nhật số lượng và tính tổng.

```typescript
// Solution using useReducer / Giải pháp sử dụng useReducer
import { useReducer, createContext, useContext } from 'react';

// Types / Kiểu dữ liệu
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Reducer / Bộ rút gọn
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0
      };
    }

    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Context / Ngữ cảnh
interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// Components / Các component
function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>
        Add to Cart / Thêm vào giỏ
      </button>
    </div>
  );
}

function Cart() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="cart">
      <h2>Shopping Cart / Giỏ Hàng</h2>
      
      {state.items.length === 0 ? (
        <p>Cart is empty / Giỏ hàng trống</p>
      ) : (
        <>
          {state.items.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>${item.price}</p>
              </div>
              <div>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <button onClick={() => removeItem(item.id)}>
                Remove / Xóa
              </button>
            </div>
          ))}

          <div className="cart-total">
            <h3>Total / Tổng: ${state.total.toFixed(2)}</h3>
            <button onClick={clearCart}>Clear Cart / Xóa giỏ hàng</button>
            <button>Checkout / Thanh toán</button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## Summary / Tóm Tắt

**English:**
- Custom hooks encapsulate reusable logic
- Component patterns improve code organization
- State management requires careful planning
- Performance optimization is crucial for large apps
- Practice these patterns for interviews

**Tiếng Việt:**
- Custom hooks đóng gói logic có thể tái sử dụng
- Các mẫu component cải thiện tổ chức code
- Quản lý state cần lập kế hoạch cẩn thận
- Tối ưu hiệu suất rất quan trọng cho ứng dụng lớn
- Thực hành các mẫu này cho phỏng vấn

---

[← Previous: JavaScript Challenges](./11-interview-practice-01-javascript-challenges.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Algorithm Problems →](./11-interview-practice-04-coding-patterns.md)
