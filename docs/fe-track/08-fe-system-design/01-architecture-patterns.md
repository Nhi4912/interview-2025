# Frontend Architecture Patterns / Các Mẫu Kiến Trúc Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## System Design - Chapter 1 / Thiết Kế Hệ Thống - Chương 1

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Micro-Frontends →](./01-architecture-patterns.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VinID super-app:** Monolithic React SPA với 15 feature teams. Mỗi release bị block vì team A chờ team B merge. Bundle size tăng liên tục — user download code của features họ không dùng. Giải pháp: migrate sang **Module Federation** (Webpack 5) — mỗi team deploy micro-frontend độc lập, main shell lazy-load features on demand. Release từ hàng tuần → hàng ngày.

**Bài học:** Frontend architecture không chỉ là "components và hooks". Ở scale lớn, cần nghĩ đến team independence, deployment boundaries, và shared dependencies — giống như backend microservices nhưng ở phía frontend.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Frontend architecture như thiết kế tòa nhà văn phòng: Monolith = mọi phòng ban cùng một tòa nhà (tiện nhưng chật). Micro-frontends = tòa nhà riêng cho mỗi phòng ban (linh hoạt nhưng cần elevator/lobby chung — shell app).

**When architecture matters:** Architecture không quan trọng cho app nhỏ. Nó trở nên critical khi: >5 teams, >100k LOC, >50 routes, hoặc cần independent deployment.

## Concept Map / Bản Đồ Khái Niệm

```
[Frontend Architecture Patterns]
        │
        ├── Monolith SPA ──► small team, fast iteration
        │
        ├── Modular Monolith ──► shared repo, feature-based folder structure
        │       └── enforced by ESLint module boundaries
        │
        ├── Micro-frontends ──► independent teams, independent deployment
        │       ├── Module Federation (Webpack 5) — runtime sharing
        │       ├── iframes — strong isolation, worse UX
        │       └── Web Components — framework agnostic
        │
        └── Design decisions:
                ├── Routing: shell-owned vs each MFE owns routes
                ├── State: global store vs per-MFE local state
                └── Shared deps: singleton (React) vs duplicated (lodash)
```

---

## Overview / Tổng Quan

**English:** Understanding frontend architecture patterns is crucial for building scalable, maintainable applications and succeeding in senior-level interviews at Big Tech companies.

**Tiếng Việt:** Hiểu các mẫu kiến trúc frontend là rất quan trọng để xây dựng ứng dụng có thể mở rộng, dễ bảo trì và thành công trong phỏng vấn cấp cao tại các công ty Big Tech.

---

## Table of Contents / Mục Lục
1. [MVC Pattern / Mẫu MVC](#mvc-pattern--mẫu-mvc)
2. [Component-Based Architecture / Kiến Trúc Dựa Trên Component](#component-based-architecture--kiến-trúc-dựa-trên-component)
3. [Layered Architecture / Kiến Trúc Phân Lớp](#layered-architecture--kiến-trúc-phân-lớp)
4. [Micro-Frontend Architecture / Kiến Trúc Micro-Frontend](#micro-frontend-architecture--kiến-trúc-micro-frontend)
5. [Module Federation / Liên Kết Module](#module-federation--liên-kết-module)
6. [Design Patterns / Các Mẫu Thiết Kế](#design-patterns--các-mẫu-thiết-kế)
7. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## MVC Pattern / Mẫu MVC

### Definition / Định Nghĩa

**English:** MVC (Model-View-Controller) separates application logic into three interconnected components.

**Tiếng Việt:** MVC (Model-View-Controller) tách logic ứng dụng thành ba thành phần kết nối với nhau.

```
MVC Architecture / Kiến Trúc MVC
│
├── Model (Data / Dữ liệu)
│   └── Business logic, data management
│       Logic nghiệp vụ, quản lý dữ liệu
│
├── View (UI / Giao diện)
│   └── Presentation layer, user interface
│       Lớp trình bày, giao diện người dùng
│
└── Controller (Logic / Logic)
    └── Handles user input, updates model
        Xử lý đầu vào người dùng, cập nhật model
```

### Implementation / Triển Khai

```typescript
// Model - Data and business logic / Model - Dữ liệu và logic nghiệp vụ
class TodoModel {
  private todos: Todo[] = [];

  addTodo(text: string): Todo {
    const todo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    };
    this.todos.push(todo);
    return todo;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  toggleTodo(id: string): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}

// View - UI rendering / View - Render giao diện
class TodoView {
  private app: HTMLElement;

  constructor(appId: string) {
    this.app = document.getElementById(appId)!;
  }

  render(todos: Todo[]): void {
    this.app.innerHTML = `
      <div class="todo-app">
        <h1>Todo List / Danh Sách Công Việc</h1>
        <input type="text" id="todo-input" placeholder="Add todo / Thêm công việc" />
        <button id="add-btn">Add / Thêm</button>
        <ul id="todo-list">
          ${todos.map(todo => `
            <li class="${todo.completed ? 'completed' : ''}">
              <input type="checkbox" 
                     data-id="${todo.id}" 
                     ${todo.completed ? 'checked' : ''} />
              <span>${todo.text}</span>
              <button data-id="${todo.id}" class="delete-btn">
                Delete / Xóa
              </button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  bindAddTodo(handler: (text: string) => void): void {
    const input = document.getElementById('todo-input') as HTMLInputElement;
    const button = document.getElementById('add-btn');

    button?.addEventListener('click', () => {
      if (input.value.trim()) {
        handler(input.value);
        input.value = '';
      }
    });
  }

  bindToggleTodo(handler: (id: string) => void): void {
    this.app.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'checkbox') {
        handler(target.dataset.id!);
      }
    });
  }

  bindDeleteTodo(handler: (id: string) => void): void {
    this.app.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('delete-btn')) {
        handler(target.dataset.id!);
      }
    });
  }
}

// Controller - Connects Model and View / Controller - Kết nối Model và View
class TodoController {
  private model: TodoModel;
  private view: TodoView;

  constructor(model: TodoModel, view: TodoView) {
    this.model = model;
    this.view = view;

    // Bind view events to controller methods
    // Liên kết sự kiện view với phương thức controller
    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);

    // Initial render / Render ban đầu
    this.updateView();
  }

  handleAddTodo = (text: string): void => {
    this.model.addTodo(text);
    this.updateView();
  };

  handleToggleTodo = (id: string): void => {
    this.model.toggleTodo(id);
    this.updateView();
  };

  handleDeleteTodo = (id: string): void => {
    this.model.deleteTodo(id);
    this.updateView();
  };

  private updateView(): void {
    const todos = this.model.getTodos();
    this.view.render(todos);
  }
}

// Usage / Sử dụng
const app = new TodoController(
  new TodoModel(),
  new TodoView('app')
);
```

---

## Component-Based Architecture / Kiến Trúc Dựa Trên Component

### Definition / Định Nghĩa

**English:** Component-based architecture breaks the UI into reusable, self-contained components.

**Tiếng Việt:** Kiến trúc dựa trên component chia giao diện thành các component có thể tái sử dụng, độc lập.

```
Component Hierarchy / Phân Cấp Component
│
App / Ứng Dụng
├── Header / Đầu Trang
│   ├── Logo
│   ├── Navigation / Điều Hướng
│   └── UserMenu / Menu Người Dùng
│
├── Main / Nội Dung Chính
│   ├── Sidebar / Thanh Bên
│   │   ├── Filter / Bộ Lọc
│   │   └── Categories / Danh Mục
│   │
│   └── Content / Nội Dung
│       ├── ProductList / Danh Sách Sản Phẩm
│       │   └── ProductCard / Thẻ Sản Phẩm
│       │       ├── Image / Hình Ảnh
│       │       ├── Title / Tiêu Đề
│       │       ├── Price / Giá
│       │       └── AddToCart / Thêm Vào Giỏ
│       │
│       └── Pagination / Phân Trang
│
└── Footer / Chân Trang
    ├── Links / Liên Kết
    └── Copyright / Bản Quyền
```

### React Implementation / Triển Khai React

```typescript
// Atomic Design Pattern / Mẫu Thiết Kế Atomic
// Atoms - Smallest components / Atoms - Component nhỏ nhất
function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input"
    />
  );
}

// Molecules - Combination of atoms / Molecules - Kết hợp atoms
function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search... / Tìm kiếm..."
      />
      <Button onClick={handleSearch}>
        Search / Tìm
      </Button>
    </div>
  );
}

// Organisms - Complex components / Organisms - Component phức tạp
function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="description">{product.description}</p>
      <Button onClick={() => addToCart(product)}>
        Add to Cart / Thêm Vào Giỏ
      </Button>
    </div>
  );
}

function ProductList({ products }: ProductListProps) {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Templates - Page layouts / Templates - Bố cục trang
function ShopTemplate({ 
  header, 
  sidebar, 
  content, 
  footer 
}: ShopTemplateProps) {
  return (
    <div className="shop-template">
      <header>{header}</header>
      <div className="main-content">
        <aside>{sidebar}</aside>
        <main>{content}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  );
}

// Pages - Specific instances / Pages - Các trang cụ thể
function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({});

  return (
    <ShopTemplate
      header={<Header />}
      sidebar={<Sidebar filters={filters} onFilterChange={setFilters} />}
      content={<ProductList products={products} />}
      footer={<Footer />}
    />
  );
}
```

---

## Layered Architecture / Kiến Trúc Phân Lớp

### Definition / Định Nghĩa

**English:** Layered architecture organizes code into horizontal layers, each with specific responsibilities.

**Tiếng Việt:** Kiến trúc phân lớp tổ chức code thành các lớp ngang, mỗi lớp có trách nhiệm cụ thể.

```
Layered Architecture / Kiến Trúc Phân Lớp
│
├── Presentation Layer / Lớp Trình Bày
│   ├── Components / Components
│   ├── Pages / Trang
│   └── UI Logic / Logic Giao Diện
│
├── Business Logic Layer / Lớp Logic Nghiệp Vụ
│   ├── Services / Dịch Vụ
│   ├── Use Cases / Trường Hợp Sử Dụng
│   └── Domain Logic / Logic Miền
│
├── Data Access Layer / Lớp Truy Cập Dữ Liệu
│   ├── API Clients / Client API
│   ├── Repositories / Kho Lưu Trữ
│   └── Data Mappers / Ánh Xạ Dữ Liệu
│
└── Infrastructure Layer / Lớp Hạ Tầng
    ├── HTTP Client / Client HTTP
    ├── Storage / Lưu Trữ
    └── External Services / Dịch Vụ Bên Ngoài
```

### Implementation / Triển Khai

```typescript
// Infrastructure Layer / Lớp Hạ Tầng
// src/infrastructure/http-client.ts
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}

// Data Access Layer / Lớp Truy Cập Dữ Liệu
// src/data/repositories/user-repository.ts
interface UserRepository {
  getById(id: string): Promise<User>;
  getAll(): Promise<User[]>;
  create(user: CreateUserDTO): Promise<User>;
  update(id: string, user: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}

class UserRepositoryImpl implements UserRepository {
  constructor(private httpClient: HttpClient) {}

  async getById(id: string): Promise<User> {
    return this.httpClient.get<User>(`/users/${id}`);
  }

  async getAll(): Promise<User[]> {
    return this.httpClient.get<User[]>('/users');
  }

  async create(user: CreateUserDTO): Promise<User> {
    return this.httpClient.post<User>('/users', user);
  }

  async update(id: string, user: UpdateUserDTO): Promise<User> {
    return this.httpClient.post<User>(`/users/${id}`, user);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.post(`/users/${id}`, { _method: 'DELETE' });
  }
}

// Business Logic Layer / Lớp Logic Nghiệp Vụ
// src/domain/services/user-service.ts
class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.getById(userId);
    
    // Business logic / Logic nghiệp vụ
    return {
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
      isActive: user.status === 'active',
      memberSince: this.formatDate(user.createdAt)
    };
  }

  async updateUserProfile(
    userId: string, 
    updates: UpdateUserDTO
  ): Promise<UserProfile> {
    // Validation / Xác thực
    this.validateUserUpdates(updates);
    
    // Update / Cập nhật
    const updatedUser = await this.userRepository.update(userId, updates);
    
    return this.getUserProfile(updatedUser.id);
  }

  private validateUserUpdates(updates: UpdateUserDTO): void {
    if (updates.email && !this.isValidEmail(updates.email)) {
      throw new Error('Invalid email / Email không hợp lệ');
    }
    // More validation / Thêm xác thực
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  }
}

// Presentation Layer / Lớp Trình Bày
// src/components/UserProfile.tsx
function UserProfile({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const userService = useUserService(); // Dependency injection

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserProfile(userId);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile / Lỗi tải hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading... / Đang tải...</div>;
  if (!profile) return <div>Profile not found / Không tìm thấy hồ sơ</div>;

  return (
    <div className="user-profile">
      <h1>{profile.displayName}</h1>
      <p>Email: {profile.email}</p>
      <p>Member since / Thành viên từ: {profile.memberSince}</p>
      <p>Status / Trạng thái: {profile.isActive ? 'Active / Hoạt động' : 'Inactive / Không hoạt động'}</p>
    </div>
  );
}

// Dependency Injection / Tiêm Phụ Thuộc
// src/app/providers.tsx
const httpClient = new HttpClient('https://api.example.com');
const userRepository = new UserRepositoryImpl(httpClient);
const userService = new UserService(userRepository);

const ServiceContext = createContext({ userService });

export function useUserService() {
  return useContext(ServiceContext).userService;
}
```

---

## Design Patterns / Các Mẫu Thiết Kế

### Singleton Pattern / Mẫu Singleton

**English:** Ensures a class has only one instance and provides global access to it.

**Tiếng Việt:** Đảm bảo một class chỉ có một instance và cung cấp truy cập toàn cục đến nó.

```typescript
// Singleton implementation / Triển khai Singleton
class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    return response.json();
  }
}

// Usage / Sử dụng
const api1 = ApiClient.getInstance();
const api2 = ApiClient.getInstance();
console.log(api1 === api2); // true - same instance / cùng instance
```

### Observer Pattern / Mẫu Observer

**English:** Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

**Tiếng Việt:** Định nghĩa mối quan hệ một-nhiều giữa các đối tượng để khi một đối tượng thay đổi trạng thái, tất cả các đối tượng phụ thuộc được thông báo.

```typescript
// Observer pattern / Mẫu Observer
interface Observer<T> {
  update(data: T): void;
}

class Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): () => void {
    this.observers.push(observer);
    
    // Return unsubscribe function / Trả về hàm hủy đăng ký
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Usage / Sử dụng
class UserStore extends Subject<User> {
  private user: User | null = null;

  setUser(user: User): void {
    this.user = user;
    this.notify(user);
  }
}

class UserProfileComponent implements Observer<User> {
  update(user: User): void {
    console.log('User updated / Người dùng đã cập nhật:', user);
    // Update UI / Cập nhật giao diện
  }
}

const userStore = new UserStore();
const profileComponent = new UserProfileComponent();

const unsubscribe = userStore.subscribe(profileComponent);
userStore.setUser({ id: '1', name: 'John' });
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: What is the difference between MVC and Component-Based architecture?
### C1: Sự khác biệt giữa kiến trúc MVC và kiến trúc dựa trên Component là gì?

**English Answer:**
- **MVC**: Separates concerns into Model (data), View (UI), and Controller (logic). Traditional pattern for web applications.
- **Component-Based**: Breaks UI into reusable, self-contained components. Each component manages its own state and logic. Modern approach used in React, Vue, Angular.

**Câu Trả Lời Tiếng Việt:**
- **MVC**: Tách các mối quan tâm thành Model (dữ liệu), View (giao diện), và Controller (logic). Mẫu truyền thống cho ứng dụng web.
- **Dựa Trên Component**: Chia giao diện thành các component có thể tái sử dụng, độc lập. Mỗi component quản lý state và logic riêng. Cách tiếp cận hiện đại được sử dụng trong React, Vue, Angular.

### Q2: What is Layered Architecture and why use it?
### C2: Kiến trúc phân lớp là gì và tại sao sử dụng nó?

**English Answer:**
Layered architecture organizes code into horizontal layers (Presentation, Business Logic, Data Access, Infrastructure). Benefits:
- Separation of concerns
- Easier testing
- Better maintainability
- Clear dependencies
- Easier to scale teams

**Câu Trả Lời Tiếng Việt:**
Kiến trúc phân lớp tổ chức code thành các lớp ngang (Trình bày, Logic Nghiệp vụ, Truy cập Dữ liệu, Hạ tầng). Lợi ích:
- Tách biệt các mối quan tâm
- Dễ kiểm thử hơn
- Bảo trì tốt hơn
- Phụ thuộc rõ ràng
- Dễ mở rộng nhóm hơn

---

## Summary / Tóm Tắt

**English:**
- Choose architecture based on project needs
- MVC for traditional web apps
- Component-based for modern SPAs
- Layered for complex business logic
- Use design patterns appropriately
- Consider team size and expertise

**Tiếng Việt:**
- Chọn kiến trúc dựa trên nhu cầu dự án
- MVC cho ứng dụng web truyền thống
- Dựa trên component cho SPA hiện đại
- Phân lớp cho logic nghiệp vụ phức tạp
- Sử dụng mẫu thiết kế phù hợp
- Xem xét quy mô và chuyên môn của nhóm

---

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Micro-Frontends →](./01-architecture-patterns.md)

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I explain Micro-frontends vs Modular Monolith — and when each is appropriate?
- [ ] Can I describe Module Federation and how it enables runtime dependency sharing?
- [ ] Can I explain the tradeoffs of iframes vs Module Federation vs Web Components for MFE?
- [ ] Can I design the routing strategy for a shell app with 3 micro-frontend teams?
- [ ] Can I explain how shared state (auth, cart) works across micro-frontends?
- 💬 **Feynman Prompt:** Giải thích Micro-frontends cho một backend engineer quen với microservices — tương đồng nào áp dụng được và khác biệt nào quan trọng nhất?

## Connections / Liên Kết

- ⬅️ **Built on**: [React Fundamentals](../03-react/01-react-fundamentals.md) — component model scales to MFE
- ⬅️ **Built on**: [Microservices](../../be-track/02-backend-knowledge/02-microservices.md) — same decomposition principles apply
- 🔗 **Applied in**: [System Design Theory](../../shared/02-system-design/system-design-theory.md) — frontend architecture is part of system design
