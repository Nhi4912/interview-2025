# Missing Answers for Coding & System Design Problems

---

## 1. Editable Table Cells

**Question:** How would you allow users to edit table cells inline and save changes?

### English

- Render each cell as a text input or select when in edit mode.
- Track which cell is being edited (row/column).
- Save changes on blur or Enter, revert on Escape.
- Validate input if needed before saving.
- Update the data model and re-render the table.

### Vietnamese

- Hiển thị mỗi ô dưới dạng input hoặc select khi ở chế độ chỉnh sửa.
- Theo dõi ô nào đang được chỉnh sửa (dòng/cột).
- Lưu thay đổi khi blur hoặc nhấn Enter, hoàn tác khi nhấn Escape.
- Kiểm tra hợp lệ dữ liệu trước khi lưu (nếu cần).
- Cập nhật dữ liệu và render lại bảng.

#### Diagram: Editable Table Cell State Flow

```mermaid
flowchart TD
  A[User Double Clicks Cell] --> B[Cell Enters Edit Mode]
  B --> C[User Edits Value]
  C --> D{User Action}
  D -- Enter/Blur --> E[Save Value]
  D -- Escape --> F[Revert Value]
  E --> G[Update Table]
  F --> G
```

---

## 2. Row Selection and Bulk Actions

**Question:** How would you implement row selection (single/multi) and bulk actions (delete, export)?

### English

- Add a checkbox to each row and a master checkbox in the header.
- Track selected row IDs in state (e.g., a Set).
- Provide bulk action buttons (Delete Selected, Export Selected).
- For accessibility, ensure checkboxes are keyboard accessible and have proper labels.

### Vietnamese

- Thêm checkbox cho mỗi dòng và một checkbox tổng ở tiêu đề.
- Lưu trạng thái các dòng được chọn (ví dụ dùng Set).
- Thêm nút thao tác hàng loạt (Xóa, Xuất).
- Đảm bảo accessibility: checkbox có thể dùng bàn phím và có nhãn rõ ràng.

---

## 3. Column Reordering

**Question:** How would you allow users to reorder columns via drag-and-drop?

### English

- Use HTML5 Drag and Drop API or a library (e.g., react-beautiful-dnd).
- Update the columns order in state on drop.
- Re-render table with new column order.
- Provide visual feedback during drag.

### Vietnamese

- Sử dụng HTML5 Drag and Drop API hoặc thư viện (ví dụ react-beautiful-dnd).
- Cập nhật thứ tự cột trong state khi thả.
- Render lại bảng với thứ tự cột mới.
- Hiển thị hiệu ứng kéo thả cho người dùng.

---

## 4. Server-Side Pagination and Filtering

**Question:** How would you handle tables with millions of rows (server-side pagination/filtering)?

### English

- Fetch only the current page of data from the server.
- Send filter/sort params in API requests.
- Show loading indicators and handle errors.
- Consider debouncing filter input to reduce API calls.

### Vietnamese

- Chỉ lấy dữ liệu trang hiện tại từ server.
- Gửi tham số lọc/sắp xếp trong request API.
- Hiển thị trạng thái loading và xử lý lỗi.
- Nên debounce input lọc để giảm số lần gọi API.

---

## 5. Accessibility for Dynamic Tables

**Question:** What are the key accessibility considerations for dynamic tables?

### English

- Use semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`).
- Add ARIA roles and properties as needed.
- Ensure keyboard navigation (tab, arrow keys).
- Provide visible focus indicators.
- Announce changes to screen readers (e.g., row added/removed).

### Vietnamese

- Sử dụng HTML ngữ nghĩa (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`).
- Thêm ARIA roles và thuộc tính nếu cần.
- Đảm bảo có thể điều hướng bằng bàn phím (tab, phím mũi tên).
- Hiển thị rõ vùng focus.
- Thông báo thay đổi cho screen reader (ví dụ khi thêm/xóa dòng).

---

## 6. Virtual Scrolling (Performance Optimization)

**Question:** How would you implement virtual scrolling for a large list?

### English

- Only render visible items plus a small buffer (overscan).
- Calculate start/end indices based on scroll position.
- Use a spacer div to maintain scroll height.
- Update visible items on scroll.

### Vietnamese

- Chỉ render các item hiển thị trên màn hình và một buffer nhỏ.
- Tính toán chỉ số bắt đầu/kết thúc dựa trên vị trí cuộn.
- Dùng một div spacer để giữ chiều cao cuộn.
- Cập nhật item hiển thị khi cuộn.

#### Diagram: Virtual Scrolling

```mermaid
graph TD
  A[Full List] -->|Calculate Visible Range| B[Render Visible Items]
  B -->|User Scrolls| C[Update Range]
  C --> B
```

---

## 7. Notification System Design (System Design)

**Question:** How would you design a scalable notification system?

### English

- Use a message queue (e.g., RabbitMQ, Kafka) for scalable delivery.
- Store user notification preferences in a database.
- Use WebSockets for real-time delivery, fallback to polling for offline users.
- Support multiple channels (email, SMS, push).
- Ensure idempotency and retry logic for failed deliveries.
- Provide a UI for users to view and manage notifications.

### Vietnamese

- Sử dụng message queue (RabbitMQ, Kafka) để mở rộng hệ thống gửi thông báo.
- Lưu cài đặt thông báo của người dùng trong database.
- Dùng WebSocket để gửi thông báo thời gian thực, fallback sang polling nếu offline.
- Hỗ trợ nhiều kênh (email, SMS, push).
- Đảm bảo idempotency và retry khi gửi thất bại.
- Cung cấp giao diện cho người dùng xem và quản lý thông báo.

#### Diagram: Notification System Architecture

```mermaid
graph TD
  A[App Server] --> B[Message Queue]
  B --> C[Notification Worker]
  C --> D[WebSocket Server]
  C --> E[Email/SMS Service]
  D --> F[User Browser]
  E --> G[User Device]
```

---

## 8. React Error Boundary

**Question:** How would you implement an error boundary component to catch and display errors in a React app?

### English

- Create a class component that implements `componentDidCatch` and `getDerivedStateFromError`.
- Wrap components that might throw errors.
- Provide a fallback UI when errors occur.
- Log errors for debugging and monitoring.
- Handle different types of errors appropriately.

### Vietnamese

- Tạo class component implement `componentDidCatch` và `getDerivedStateFromError`.
- Bọc các component có thể gây lỗi.
- Cung cấp UI thay thế khi có lỗi.
- Ghi log lỗi để debug và monitor.
- Xử lý các loại lỗi khác nhau một cách phù hợp.

#### Sample Implementation:

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Send to error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error, errorInfo) {
    // Send to Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Diagram: Error Boundary Flow

```mermaid
flowchart TD
  A[Child Component] --> B{Throws Error?}
  B -->|Yes| C[Error Boundary Catches]
  B -->|No| D[Render Normally]
  C --> E[Show Fallback UI]
  C --> F[Log Error]
  E --> G[User Can Retry]
```

---

## 9. API Integration and Error Handling

**Question:** How would you integrate with a REST API and handle errors gracefully in the UI?

### English

- Use fetch or axios with proper error handling.
- Implement loading states and error states.
- Add retry logic for failed requests.
- Display user-friendly error messages.
- Handle different HTTP status codes appropriately.
- Implement request cancellation for better UX.

### Vietnamese

- Sử dụng fetch hoặc axios với xử lý lỗi phù hợp.
- Implement trạng thái loading và error.
- Thêm logic retry cho request thất bại.
- Hiển thị thông báo lỗi thân thiện với người dùng.
- Xử lý các HTTP status code khác nhau.
- Implement hủy request để cải thiện UX.

#### Sample Implementation:

{% raw %}

```javascript
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.controller = null;
  }

  async request(endpoint, options = {}) {
    // Cancel previous request
    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request cancelled");
      }
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Usage with React
function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.get(endpoint);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}
```

{% endraw %}

---

## 10. Lazy Loading Images and Components

**Question:** How would you implement lazy loading for images and React components to improve performance?

### English

- Use Intersection Observer API for images.
- Use React.lazy and Suspense for components.
- Show placeholders or spinners while loading.
- Implement error boundaries for lazy components.
- Consider SEO implications and provide fallbacks.

### Vietnamese

- Sử dụng Intersection Observer API cho images.
- Dùng React.lazy và Suspense cho components.
- Hiển thị placeholder hoặc spinner khi loading.
- Implement error boundary cho lazy components.
- Cân nhắc SEO và cung cấp fallback.

#### Sample Implementation:

```javascript
// Lazy loading images
class LazyImage {
  constructor() {
    this.images = document.querySelectorAll("[data-src]");
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this)
    );
    this.init();
  }

  init() {
    this.images.forEach((img) => this.observer.observe(img));
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        this.observer.unobserve(img);
      }
    });
  }
}

// React lazy components
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

#### Diagram: Lazy Loading Flow

```mermaid
flowchart TD
  A[Component/Image] --> B{In Viewport?}
  B -->|No| C[Show Placeholder]
  B -->|Yes| D[Start Loading]
  D --> E{Load Success?}
  E -->|Yes| F[Show Content]
  E -->|No| G[Show Error]
  C --> B
```

---

## 11. XSS and CSRF Prevention

**Question:** How would you prevent XSS and CSRF attacks in a frontend application?

### English

- Sanitize user input and output using libraries like DOMPurify.
- Use Content Security Policy (CSP) headers.
- Implement CSRF tokens for state-changing requests.
- Use secure cookies with SameSite attribute.
- Validate and escape all user-generated content.
- Use HTTPS for all communications.

### Vietnamese

- Làm sạch input và output của user bằng thư viện như DOMPurify.
- Sử dụng Content Security Policy (CSP) headers.
- Implement CSRF tokens cho các request thay đổi state.
- Dùng secure cookies với thuộc tính SameSite.
- Validate và escape tất cả nội dung do user tạo.
- Sử dụng HTTPS cho tất cả giao tiếp.

#### Sample Implementation:

```javascript
// XSS Prevention
import DOMPurify from "dompurify";

function sanitizeInput(input) {
  return DOMPurify.sanitize(input);
}

function renderUserContent(content) {
  const sanitized = sanitizeInput(content);
  return <div dangerouslySetInnerHTML={% raw %}{{ __html: sanitized }}{% endraw %} />;
}

// CSRF Prevention
class ApiClient {
  constructor() {
    this.csrfToken = this.getCsrfToken();
  }

  getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content;
  }

  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.csrfToken,
      },
      body: JSON.stringify(data),
      credentials: "same-origin",
    });
    return response.json();
  }
}

// CSP Implementation
const cspHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https://fonts.gstatic.com;",
};
```

#### Diagram: Security Layers

```mermaid
graph TD
  A[User Input] --> B[Input Sanitization]
  B --> C[Content Security Policy]
  C --> D[CSRF Token Validation]
  D --> E[Secure Output]
  F[HTTPS] --> G[All Communications]
```

---

## 12. Component Unit Testing

**Question:** How would you write comprehensive unit tests for React components?

### English

- Use Jest and React Testing Library for testing.
- Test component rendering, props, and user interactions.
- Mock external dependencies and API calls.
- Test accessibility features (focus, ARIA attributes).
- Test error states and edge cases.
- Measure test coverage and maintain high coverage.

### Vietnamese

- Sử dụng Jest và React Testing Library để test.
- Test việc render component, props và tương tác user.
- Mock external dependencies và API calls.
- Test accessibility features (focus, ARIA attributes).
- Test error states và edge cases.
- Đo lường test coverage và duy trì coverage cao.

#### Sample Implementation:

```javascript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button Component", () => {
  test("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("has proper accessibility attributes", () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByLabelText("Submit form")).toBeInTheDocument();
  });
});

// Testing async components
describe("AsyncComponent", () => {
  test("shows loading state initially", () => {
    render(<AsyncComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows data after successful fetch", async () => {
    render(<AsyncComponent />);

    await waitFor(() => {
      expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
    });
  });

  test("shows error on fetch failure", async () => {
    // Mock fetch to fail
    global.fetch = jest.fn(() => Promise.reject("API Error"));

    render(<AsyncComponent />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

## 13. Responsive Dashboard Layout

**Question:** How would you create a responsive dashboard layout with sidebar, header, and main content?

### English

- Use CSS Grid for the main layout structure.
- Implement a collapsible sidebar using CSS transforms.
- Use Flexbox for header and sidebar content.
- Add media queries for mobile responsiveness.
- Ensure proper ARIA roles for navigation.
- Implement smooth transitions and animations.

### Vietnamese

- Sử dụng CSS Grid cho layout chính.
- Implement sidebar có thể thu gọn bằng CSS transforms.
- Dùng Flexbox cho header và nội dung sidebar.
- Thêm media queries cho responsive mobile.
- Đảm bảo ARIA roles phù hợp cho navigation.
- Implement transitions và animations mượt mà.

#### Sample Implementation:

```html
<div class="dashboard">
  <header class="dashboard-header">
    <button class="sidebar-toggle" aria-label="Toggle sidebar">☰</button>
    <h1>Dashboard</h1>
    <nav class="header-nav">
      <a href="/profile">Profile</a>
      <a href="/settings">Settings</a>
    </nav>
  </header>

  <aside class="dashboard-sidebar" role="navigation">
    <nav>
      <a href="/dashboard" aria-current="page">Dashboard</a>
      <a href="/analytics">Analytics</a>
      <a href="/reports">Reports</a>
    </nav>
  </aside>

  <main class="dashboard-main" role="main">
    <div class="content">
      <!-- Dashboard content -->
    </div>
  </main>
</div>
```

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
}

.dashboard-header {
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.dashboard-sidebar {
  grid-area: sidebar;
  background: #f8f9fa;
  padding: 20px;
  transition: transform 0.3s ease;
}

.dashboard-main {
  grid-area: main;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    position: fixed;
    left: -250px;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 1000;
  }

  .dashboard-sidebar.open {
    transform: translateX(250px);
  }
}
```

#### Diagram: Dashboard Layout Structure

```mermaid
graph TD
  A[Dashboard Container] --> B[Header]
  A --> C[Sidebar]
  A --> D[Main Content]
  B --> E[Logo/Title]
  B --> F[User Menu]
  C --> G[Navigation Links]
  D --> H[Widgets/Content]
  D --> I[Charts/Data]
```

---

## 14. Undo/Redo Functionality

**Question:** How would you implement undo and redo functionality for a text editor or form?

### English

- Use two stacks: one for undo history and one for redo history.
- Push current state to undo stack before each action.
- Clear redo stack when a new action is performed.
- Implement keyboard shortcuts (Ctrl+Z, Ctrl+Y).
- Provide visual feedback for undo/redo availability.
- Handle complex objects and deep cloning.

### Vietnamese

- Sử dụng hai stack: một cho undo history và một cho redo history.
- Push state hiện tại vào undo stack trước mỗi action.
- Clear redo stack khi có action mới.
- Implement keyboard shortcuts (Ctrl+Z, Ctrl+Y).
- Cung cấp feedback trực quan cho undo/redo.
- Xử lý complex objects và deep cloning.

#### Sample Implementation:

```javascript
class UndoRedoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;
  }

  saveState(state) {
    // Clear redo stack when new action is performed
    this.redoStack = [];

    // Add current state to undo stack
    this.undoStack.push(JSON.parse(JSON.stringify(state)));

    // Limit history size
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  undo() {
    if (this.undoStack.length === 0) return null;

    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);

    return this.undoStack[this.undoStack.length - 1] || null;
  }

  redo() {
    if (this.redoStack.length === 0) return null;

    const state = this.redoStack.pop();
    this.undoStack.push(state);

    return state;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }
}

// React Hook for Undo/Redo
function useUndoRedo(initialState) {
  const [state, setState] = useState(initialState);
  const undoRedoRef = useRef(new UndoRedoManager());

  const undoRedo = undoRedoRef.current;

  const updateState = useCallback(
    (newState) => {
      undoRedo.saveState(state);
      setState(newState);
    },
    [state]
  );

  const undo = useCallback(() => {
    const previousState = undoRedo.undo();
    if (previousState !== null) {
      setState(previousState);
    }
  }, []);

  const redo = useCallback(() => {
    const nextState = undoRedo.redo();
    if (nextState !== null) {
      setState(nextState);
    }
  }, []);

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo: undoRedo.canUndo(),
    canRedo: undoRedo.canRedo(),
  };
}
```

#### Diagram: Undo/Redo Flow

```mermaid
flowchart LR
  A[State A] --> B[Action 1]
  B --> C[State B]
  C --> D[Action 2]
  D --> E[State C]
  E --> F[Undo]
  F --> C
  C --> G[Redo]
  G --> E
```

---

## 15. Custom React Hook

**Question:** How would you write a custom React hook for debounced value or localStorage sync?

### English

- Use useEffect, useState, and useRef for state management.
- Implement proper cleanup in useEffect.
- Handle SSR and non-browser environments.
- Provide clear API and error handling.
- Consider performance implications and memoization.

### Vietnamese

- Sử dụng useEffect, useState, và useRef để quản lý state.
- Implement cleanup phù hợp trong useEffect.
- Xử lý SSR và môi trường không có browser.
- Cung cấp API rõ ràng và xử lý lỗi.
- Cân nhắc performance và memoization.

#### Sample Implementation:

```javascript
// useDebounce Hook
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

// useLocalStorage Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// useAsync Hook
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus("pending");
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus("success");
      } catch (err) {
        setError(err);
        setStatus("error");
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

// Usage Examples
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: searchResults, status } = useAsync(
    () => searchAPI(debouncedSearchTerm),
    false
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {status === "pending" && <div>Searching...</div>}
      {status === "success" && (
        <ul>
          {searchResults.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### Diagram: Custom Hook Lifecycle

```mermaid
flowchart TD
  A[Hook Initialization] --> B[Setup State]
  B --> C[Setup Effects]
  C --> D[Return Values/Functions]
  D --> E[Component Uses Hook]
  E --> F[State Changes]
  F --> G[Effects Re-run]
  G --> H[Cleanup]
  H --> I[New State]
  I --> E
```

---

## 16. TypeScript Advanced Patterns

**Question:** How would you create advanced TypeScript utility types and type-safe patterns?

### English

- Create utility types for common transformations.
- Implement type-safe event systems.
- Use conditional types and mapped types.
- Build generic components with proper constraints.
- Ensure type safety across API boundaries.
- Use branded types for domain modeling.

### Vietnamese

- Tạo utility types cho các biến đổi phổ biến.
- Implement hệ thống event type-safe.
- Sử dụng conditional types và mapped types.
- Xây dựng generic components với constraints phù hợp.
- Đảm bảo type safety qua API boundaries.
- Sử dụng branded types cho domain modeling.

#### Advanced TypeScript Examples:

```typescript
// Utility Types
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

// Type-safe Event System
type EventMap = {
  "user:login": { userId: string; timestamp: Date };
  "user:logout": { userId: string };
  "data:update": { data: any; version: number };
};

class EventEmitter<T extends Record<string, any>> {
  private listeners: Map<keyof T, Set<(data: any) => void>> = new Map();

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
}

// Branded Types
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createEmail(email: string): Email {
  if (!email.includes("@")) {
    throw new Error("Invalid email");
  }
  return email as Email;
}

// Generic Components
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
}: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} onClick={() => onRowClick?.(item)}>
            {columns.map((column) => (
              <td key={String(column.key)}>
                {column.render
                  ? column.render(item[column.key], item)
                  : String(item[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

#### Diagram: TypeScript Type System

```mermaid
graph TD
  A[Base Types] --> B[Union Types]
  A --> C[Intersection Types]
  B --> D[Conditional Types]
  C --> D
  D --> E[Utility Types]
  E --> F[Generic Types]
  F --> G[Type Constraints]
  G --> H[Branded Types]
```

---

# (Add more Q&A here as you discover more missing answers)
