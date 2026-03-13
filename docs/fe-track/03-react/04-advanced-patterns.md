# Advanced React Patterns / Mẫu React Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## React - Chapter 4 / React - Chương 4

[← Previous: Hooks Deep Dive](./03-hooks-deep-dive.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Performance Optimization →](./09-performance-optimization.md)

---

## Overview / Tổng Quan

**English:** Advanced React patterns are essential for building scalable, maintainable applications. This chapter covers compound components, render props, higher-order components, and modern patterns frequently asked in Big Tech interviews.

**Tiếng Việt:** Các mẫu React nâng cao là cần thiết để xây dựng ứng dụng có thể mở rộng và bảo trì. Chương này bao gồm compound components, render props, higher-order components và các mẫu hiện đại thường được hỏi trong phỏng vấn Big Tech.

---

## Table of Contents / Mục Lục

1. [Compound Components / Component Phức Hợp](#compound-components--component-phức-hợp)
2. [Render Props Pattern / Mẫu Render Props](#render-props-pattern--mẫu-render-props)
3. [Higher-Order Components (HOC) / Component Bậc Cao](#higher-order-components-hoc--component-bậc-cao)
4. [Custom Hooks Pattern / Mẫu Custom Hooks](#custom-hooks-pattern--mẫu-custom-hooks)
5. [Provider Pattern / Mẫu Provider](#provider-pattern--mẫu-provider)
6. [Container/Presentational Pattern / Mẫu Container/Presentational](#containerpresentational-pattern--mẫu-containerpresentational)
7. [State Reducer Pattern / Mẫu State Reducer](#state-reducer-pattern--mẫu-state-reducer)
8. [Control Props Pattern / Mẫu Control Props](#control-props-pattern--mẫu-control-props)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Compound Components / Component Phức Hợp

### Concept / Khái Niệm

**English:** Compound components work together to form a complete UI component. They share implicit state and communicate with each other, providing a flexible and intuitive API.

**Tiếng Việt:** Compound components làm việc cùng nhau để tạo thành một component UI hoàn chỉnh. Chúng chia sẻ trạng thái ngầm định và giao tiếp với nhau, cung cấp API linh hoạt và trực quan.

### Basic Implementation / Triển Khai Cơ Bản

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

// Context for sharing state / Context để chia sẻ trạng thái
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Main Tabs component / Component Tabs chính
interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

function Tabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// TabList sub-component / Sub-component TabList
function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

// Tab sub-component / Sub-component Tab
interface TabProps {
  value: string;
  children: ReactNode;
}

function Tab({ value, children }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

// TabPanel sub-component / Sub-component TabPanel
interface TabPanelProps {
  value: string;
  children: ReactNode;
}

function TabPanel({ value, children }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <div className="tab-panel">{children}</div>;
}

// Attach sub-components / Gắn sub-components
Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanel = TabPanel;

// Usage / Sử dụng
function App() {
  return (
    <Tabs defaultTab="home">
      <Tabs.TabList>
        <Tabs.Tab value="home">Home / Trang chủ</Tabs.Tab>
        <Tabs.Tab value="profile">Profile / Hồ sơ</Tabs.Tab>
        <Tabs.Tab value="settings">Settings / Cài đặt</Tabs.Tab>
      </Tabs.TabList>

      <Tabs.TabPanel value="home">
        <h2>Home Content / Nội dung Trang chủ</h2>
      </Tabs.TabPanel>
      <Tabs.TabPanel value="profile">
        <h2>Profile Content / Nội dung Hồ sơ</h2>
      </Tabs.TabPanel>
      <Tabs.TabPanel value="settings">
        <h2>Settings Content / Nội dung Cài đặt</h2>
      </Tabs.TabPanel>
    </Tabs>
  );
}
```

### Advanced Example: Accordion / Ví Dụ Nâng Cao: Accordion

```typescript
interface AccordionContextType {
  openItems: Set<string>;
  toggle: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  allowMultiple?: boolean;
  defaultOpen?: string[];
  children: ReactNode;
}

function Accordion({ allowMultiple = false, defaultOpen = [], children }: AccordionProps) {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, allowMultiple }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

function AccordionItem({ id, children }: AccordionItemProps) {
  return <div className="accordion-item">{children}</div>;
}

interface AccordionHeaderProps {
  id: string;
  children: ReactNode;
}

function AccordionHeader({ id, children }: AccordionHeaderProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionHeader must be used within Accordion');

  const { openItems, toggle } = context;
  const isOpen = openItems.has(id);

  return (
    <button
      className="accordion-header"
      onClick={() => toggle(id)}
      aria-expanded={isOpen}
    >
      {children}
      <span>{isOpen ? '−' : '+'}</span>
    </button>
  );
}

interface AccordionPanelProps {
  id: string;
  children: ReactNode;
}

function AccordionPanel({ id, children }: AccordionPanelProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionPanel must be used within Accordion');

  const { openItems } = context;
  const isOpen = openItems.has(id);

  if (!isOpen) return null;

  return <div className="accordion-panel">{children}</div>;
}

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;

// Usage / Sử dụng
function FAQ() {
  return (
    <Accordion allowMultiple defaultOpen={['q1']}>
      <Accordion.Item id="q1">
        <Accordion.Header id="q1">
          What is React? / React là gì?
        </Accordion.Header>
        <Accordion.Panel id="q1">
          React is a JavaScript library for building user interfaces.
          / React là thư viện JavaScript để xây dựng giao diện người dùng.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item id="q2">
        <Accordion.Header id="q2">
          What are Hooks? / Hooks là gì?
        </Accordion.Header>
        <Accordion.Panel id="q2">
          Hooks are functions that let you use state and lifecycle features.
          / Hooks là các hàm cho phép bạn sử dụng state và tính năng lifecycle.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

---

## Render Props Pattern / Mẫu Render Props

### Concept / Khái Niệm

**English:** Render props is a technique for sharing code between components using a prop whose value is a function. The component calls this function instead of implementing its own render logic.

**Tiếng Việt:** Render props là kỹ thuật chia sẻ code giữa các component bằng cách sử dụng prop có giá trị là một hàm. Component gọi hàm này thay vì triển khai logic render riêng của nó.

### Basic Example / Ví Dụ Cơ Bản

```typescript
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{render(position)}</>;
}

// Usage / Sử dụng
function App() {
  return (
    <div>
      <h1>Move your mouse / Di chuyển chuột</h1>
      <MouseTracker
        render={({ x, y }) => (
          <p>
            Mouse position / Vị trí chuột: ({x}, {y})
          </p>
        )}
      />
    </div>
  );
}
```

### Advanced Example: Data Fetching / Ví Dụ Nâng Cao: Lấy Dữ Liệu

```typescript
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface DataFetcherProps<T> {
  url: string;
  render: (state: FetchState<T>) => ReactNode;
}

function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return <>{render(state)}</>;
}

// Usage / Sử dụng
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  return (
    <DataFetcher<User>
      url={`/api/users/${userId}`}
      render={({ data, loading, error }) => {
        if (loading) return <div>Loading... / Đang tải...</div>;
        if (error) return <div>Error: {error.message} / Lỗi: {error.message}</div>;
        if (!data) return null;

        return (
          <div>
            <h2>{data.name}</h2>
            <p>{data.email}</p>
          </div>
        );
      }}
    />
  );
}
```

### Children as Function / Children Như Hàm

```typescript
interface ToggleProps {
  children: (props: { on: boolean; toggle: () => void }) => ReactNode;
}

function Toggle({ children }: ToggleProps) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);

  return <>{children({ on, toggle })}</>;
}

// Usage / Sử dụng
function App() {
  return (
    <Toggle>
      {({ on, toggle }) => (
        <div>
          <button onClick={toggle}>
            {on ? 'ON / BẬT' : 'OFF / TẮT'}
          </button>
          {on && <p>Content is visible / Nội dung hiển thị</p>}
        </div>
      )}
    </Toggle>
  );
}
```

---

## Higher-Order Components (HOC) / Component Bậc Cao

### Concept / Khái Niệm

**English:** A Higher-Order Component is a function that takes a component and returns a new component with additional props or behavior. HOCs are a pattern for reusing component logic.

**Tiếng Việt:** Higher-Order Component là một hàm nhận một component và trả về component mới với props hoặc hành vi bổ sung. HOC là mẫu để tái sử dụng logic component.

### Basic HOC / HOC Cơ Bản

```typescript
// HOC that adds loading state / HOC thêm trạng thái loading
function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & { isLoading: boolean }
  ) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return <div>Loading... / Đang tải...</div>;
    }

    return <Component {...(rest as P)} />;
  };
}

// Original component / Component gốc
interface UserListProps {
  users: Array<{ id: number; name: string }>;
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Enhanced component / Component được nâng cao
const UserListWithLoading = withLoading(UserList);

// Usage / Sử dụng
function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return <UserListWithLoading users={users} isLoading={isLoading} />;
}
```

### Authentication HOC / HOC Xác Thực

```typescript
interface WithAuthProps {
  user: User | null;
  isAuthenticated: boolean;
}

function withAuth<P extends object>(
  Component: React.ComponentType<P & WithAuthProps>
) {
  return function WithAuthComponent(props: P) {
    const { user, isAuthenticated } = useAuth(); // Custom hook

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return (
      <Component
        {...props}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    );
  };
}

// Protected component / Component được bảo vệ
interface DashboardProps extends WithAuthProps {
  title: string;
}

function Dashboard({ user, title }: DashboardProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Welcome, {user?.name} / Chào mừng, {user?.name}</p>
    </div>
  );
}

const ProtectedDashboard = withAuth(Dashboard);

// Usage / Sử dụng
function App() {
  return <ProtectedDashboard title="Dashboard" />;
}
```

### Composing HOCs / Kết Hợp HOCs

```typescript
// Multiple HOCs / Nhiều HOCs
const EnhancedComponent = withAuth(
  withLoading(
    withErrorBoundary(
      MyComponent
    )
  )
);

// Better: Using compose utility / Tốt hơn: Sử dụng tiện ích compose
function compose(...fns: Function[]) {
  return (x: any) => fns.reduceRight((acc, fn) => fn(acc), x);
}

const enhance = compose(
  withAuth,
  withLoading,
  withErrorBoundary
);

const EnhancedComponent = enhance(MyComponent);
```

---

## Custom Hooks Pattern / Mẫu Custom Hooks

### Basic Custom Hook / Custom Hook Cơ Bản

```typescript
// useToggle hook
function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// Usage / Sử dụng
function Modal() {
  const { value: isOpen, toggle, setTrue, setFalse } = useToggle();

  return (
    <>
      <button onClick={setTrue}>Open / Mở</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content / Nội dung modal</p>
          <button onClick={setFalse}>Close / Đóng</button>
        </div>
      )}
    </>
  );
}
```

### useLocalStorage Hook

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage / Lấy giá trị ban đầu từ localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage when value changes / Cập nhật localStorage khi giá trị thay đổi
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Usage / Sử dụng
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme} / Chủ đề hiện tại: {theme}
    </button>
  );
}
```

### useFetch Hook

```typescript
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefetchIndex(prev => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();

        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url, refetchIndex]);

  return { data, loading, error, refetch };
}

// Usage / Sử dụng
function UserProfile({ userId }: { userId: number }) {
  const { data, loading, error, refetch } = useFetch<User>(
    `/api/users/${userId}`
  );

  if (loading) return <div>Loading... / Đang tải...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
      <button onClick={refetch}>Refresh / Làm mới</button>
    </div>
  );
}
```

---

## Provider Pattern / Mẫu Provider

### Basic Provider / Provider Cơ Bản

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context / Custom hook để sử dụng context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage / Sử dụng
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Toggle Theme / Chuyển đổi chủ đề
      </button>
    </header>
  );
}
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Question 1: When to use Compound Components? — 🟢 [Junior]

**English Answer:**
Use compound components when you need:
- Flexible component composition
- Implicit state sharing between related components
- Clean, declarative API
- Examples: Tabs, Accordion, Select/Dropdown

**Tiếng Việt:**
Sử dụng compound components khi bạn cần:
- Kết hợp component linh hoạt
- Chia sẻ trạng thái ngầm định giữa các component liên quan
- API sạch, khai báo
- Ví dụ: Tabs, Accordion, Select/Dropdown

### Question 2: Render Props vs Custom Hooks? — 🟡 [Mid]

**English Answer:**
- **Render Props**: Good for sharing render logic, but can lead to "wrapper hell"
- **Custom Hooks**: Modern approach, cleaner syntax, better composition
- **Recommendation**: Use custom hooks for new code

**Tiếng Việt:**
- **Render Props**: Tốt để chia sẻ logic render, nhưng có thể dẫn đến "wrapper hell"
- **Custom Hooks**: Cách tiếp cận hiện đại, cú pháp sạch hơn, kết hợp tốt hơn
- **Khuyến nghị**: Sử dụng custom hooks cho code mới

### Question 3: HOC vs Hooks? — 🔴 [Senior]

**English Answer:**
- **HOCs**: Legacy pattern, can cause prop naming collisions, harder to type
- **Hooks**: Modern, composable, no wrapper components, better TypeScript support
- **When to use HOC**: Legacy code, third-party libraries

**Tiếng Việt:**
- **HOCs**: Mẫu cũ, có thể gây xung đột tên prop, khó type
- **Hooks**: Hiện đại, có thể kết hợp, không có wrapper components, hỗ trợ TypeScript tốt hơn
- **Khi nào dùng HOC**: Code cũ, thư viện bên thứ ba

---

## Key Takeaways / Điểm Chính

**English:**
1. Compound components provide flexible, declarative APIs
2. Render props share logic but can be verbose
3. HOCs are legacy but still used in older codebases
4. Custom hooks are the modern way to share logic
5. Provider pattern manages global state
6. Choose patterns based on use case and team preferences

**Tiếng Việt:**
1. Compound components cung cấp API linh hoạt, khai báo
2. Render props chia sẻ logic nhưng có thể dài dòng
3. HOC là mẫu cũ nhưng vẫn được sử dụng trong codebase cũ
4. Custom hooks là cách hiện đại để chia sẻ logic
5. Mẫu Provider quản lý trạng thái toàn cục
6. Chọn mẫu dựa trên trường hợp sử dụng và sở thích của nhóm

---

[← Previous: Hooks Deep Dive](./03-hooks-deep-dive.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Performance Optimization →](./09-performance-optimization.md)
