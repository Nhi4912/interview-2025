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

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. The Architecture Spectrum: Monolith → Micro-frontends

**🧠 Memory Hook:** "**Teams first, code second** — if your teams are fighting over merges, your architecture is wrong"

**Why does this exist? / Tại sao tồn tại?**

- Why do large teams hit problems with monolithic SPAs? Because 15 teams editing the same codebase = merge conflicts, blocked releases, one team's bug blocks everyone's deploy
- Why can't discipline alone fix this? Because at scale, discipline doesn't scale — you need technical enforcement of deployment boundaries, not process enforcement
- Why is the spectrum not just "monolith vs MFE"? Because Modular Monolith is the sweet spot for 2-5 teams — shared repo with enforced module boundaries, no operational complexity of MFE

**Definition:** Frontend architecture patterns define how teams split, share, and deploy code. The decision is driven by team size and deployment independence needs, not by technical preference.

**Visual — Architecture Spectrum:**

```
[1-2 Teams, fast iteration]        [3-5 Teams]       [5+ Teams, independent deploy]
          ↓                             ↓                          ↓
    Monolith SPA          →    Modular Monolith    →    Module Federation MFE
    - 1 bundle                 - Feature folders        - Per-team bundles
    - Fast start               - ESLint boundaries      - Runtime sharing
    - Shared deploys           - 1 CI/CD pipeline       - Independent deploys
    - Easy shared state        - Shared state easy       - Shell app orchestrates
                                                    → iframe MFE (max isolation)
                                                         - Hard isolation
                                                         - Poor UX (routing, auth)
                                                         - Compliance use cases
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| "MFE is always better at scale" | MFE adds operational cost — only justified with 5+ independent teams |
| "MFE = microservices for frontend, same benefits" | Same decomposition principles, different constraints: shared DOM, CSS leakage, single React instance |
| "iframes are the safe MFE choice" | iframes have poor UX (scroll, routing, shared auth) — only for strict compliance isolation |
| "Module Federation replaces npm packages" | MFE is for app-level code; npm is still correct for library dependencies |

**🎯 Interview Pattern:**
- **Trigger**: "scale the frontend" / "multiple teams" / "independent deployment" / "frontend system design"
- **Concept**: Architecture spectrum driven by team count and deployment independence
- **Opening**: "Frontend architecture decisions are driven by team boundaries, not technology preference. For 1-4 teams, a modular monolith with enforced ESLint boundaries is usually right. Beyond 5 teams needing independent deploys, Module Federation gives MFE benefits without iframe UX drawbacks..."

**🔑 Knowledge Chain:**
- **Prereq**: Component-based thinking (React), webpack bundling basics
- **Enables**: Module Federation config, shell app routing, shared state design across MFEs

---

### 2. Module Federation (Runtime Code Sharing)

**🧠 Memory Hook:** "**npm shares at build time; Module Federation shares at runtime** — the remote loads in the user's browser, not in your CI pipeline"

**Why does this exist? / Tại sao tồn tại?**

- Why can't teams just publish npm packages to share UI components? Because when a shared package changes, all consumers must update, rebuild, and redeploy — eliminating deployment independence
- Why was runtime sharing impossible before Webpack 5? Because bundles were self-contained — no mechanism to consume a remote module graph from another origin at runtime
- Why does Module Federation solve this? Each team exposes modules that others load dynamically at runtime. The shell doesn't rebuild when a remote team deploys — users automatically get the latest remote code

**Definition:** Webpack 5 Module Federation enables multiple independently-deployed JavaScript applications to share code at runtime. Each "remote" exposes modules; "hosts" consume them via dynamic `import()`.

**Visual — Module Federation Config:**

```
Shell App (host)               Team A (remote)          Team B (remote)
webpack.config:                webpack.config:          webpack.config:
  remotes: {                     exposes: {               exposes: {
    teamA: 'teamA@cdn-a/...',      './ProductList':          './Cart':
    teamB: 'teamB@cdn-b/...',        './src/ProductList'       './src/Cart'
  },                           },                       },
  shared: {                    shared: {                shared: {
    react: {singleton:true},     react: {singleton:true}  react: {singleton:true}
    'react-dom': {singleton:true}
  }

At runtime in user's browser:
const ProductList = lazy(() => import('teamA/ProductList'))
// → fetches Team A's bundle from THEIR CDN
// → React: loaded once (singleton) — prevents "two Reacts" bug
// → Team A deploys → users get new code without shell redeploy
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Forgetting `singleton: true` for React | Two React instances = hook rules violated, Context breaks silently |
| Exposing everything (too many modules) | Expose only stable, slow-changing modules (design system, auth utils) |
| No version pinning on shared deps | Version mismatch = silent runtime crash in production |
| Remote breaking changes without backward compat | Shell loads whatever remote is deployed — remotes must maintain backward compat |

**🎯 Interview Pattern:**
- **Trigger**: "micro-frontends implementation" / "runtime dependency sharing" / "independent team deployment"
- **Concept**: Webpack Module Federation — expose/consume/shared config
- **Opening**: "Module Federation lets each team deploy independently. The key is three config options: `remotes` defines what to consume and from where, `exposes` defines what your bundle shares, and `shared: { react: { singleton: true } }` ensures one React instance across all remotes..."

**🔑 Knowledge Chain:**
- **Prereq**: Webpack code splitting, dynamic `import()`, CDN hosting
- **Enables**: Shell app orchestration, independent team CI/CD pipelines, shared design system distribution

---

### 3. Layered Frontend Architecture (Separation of Concerns)

**🧠 Memory Hook:** "**UI → Business → Data → Network** — each layer talks only to the layer directly below it. Components never call `fetch` directly."

**Why does this exist? / Tại sao tồn tại?**

- Why can't components just call `fetch()` directly? In simple apps they can, but when the API changes, you must update every component that called it — no single point of change
- Why add Service and Repository layers? Inversion of control: components don't know if data comes from REST, GraphQL, or localStorage — they call a service interface
- Why does testability improve dramatically? Each layer is independently testable with mocked dependencies — unit test the service with a mock repository; test the repository with a mock HTTP client

**Definition:** Layered architecture organizes frontend code into horizontal concerns: Presentation (components/pages) → Business Logic (services/use cases) → Data Access (repositories/API clients) → Infrastructure (HTTP, storage). Each layer has one responsibility; dependencies flow only downward.

**Visual — Layer Dependencies:**

```
┌─────────────────────────────────────────────┐
│  Presentation Layer                          │
│  components/, pages/                         │
│  "What does the user see?"                   │
│  → calls: Services                           │
└──────────────────┬──────────────────────────┘
                   ↓ (one-way dependency)
┌─────────────────────────────────────────────┐
│  Business Logic Layer                        │
│  services/, use-cases/                       │
│  "What are the rules?"                       │
│  → calls: Repositories                       │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  Data Access Layer                           │
│  repositories/, api-clients/                 │
│  "How do we get/store data?"                 │
│  → calls: Infrastructure                     │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  Infrastructure Layer                        │
│  http-client.ts, storage.ts                  │
│  "External world boundary"                   │
└─────────────────────────────────────────────┘

Testing: mock the layer below → test layer above in isolation
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Components calling `fetch()` directly | Components call service; service calls repository; repository calls HTTP client |
| Business logic in React components (validation, formatting) | Extract to service layer — components are for rendering, not rules |
| Repositories returning raw API shapes | Repositories map API response to domain models — insulates UI from API changes |
| Layering for small apps | Layering adds indirection cost — only justified at 50k+ LOC or team handoffs |

**🎯 Interview Pattern:**
- **Trigger**: "how do you structure large FE app" / "testability" / "separation of concerns" / "frontend architecture"
- **Concept**: Layered architecture with one-way dependency flow
- **Opening**: "In large frontends, I separate into 4 layers: Presentation (components), Business Logic (services with validation/transformation), Data Access (repositories that abstract API shape), and Infrastructure (HTTP client). Each layer only talks to the layer below — this makes every layer independently testable and swappable..."

**🔑 Knowledge Chain:**
- **Prereq**: SOLID principles, dependency injection concepts
- **Enables**: TDD for frontend services, swapping REST → GraphQL without touching components, team boundary enforcement

---

## Reference: Pattern Implementations / Tham Khảo Triển Khai

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

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: When would you choose Micro-frontends over a Modular Monolith? / Khi nào chọn Micro-frontends thay vì Modular Monolith? 🟡 Mid

**A:** Choose Micro-frontends when teams need truly independent deployment cycles — different release cadences, different tech stacks, or organizational autonomy. A Modular Monolith (single repo with enforced module boundaries via ESLint) is almost always better for <5 teams: simpler CI/CD, easier shared state, no runtime dependency version conflicts. The cost of MFE is real: operational complexity, shared dep management, cross-MFE routing setup.

Chọn Micro-frontends khi các teams cần deploy độc lập thực sự — release cadence khác nhau hoặc tech stack khác nhau. Với <5 teams, Modular Monolith (repo chung + ESLint module boundaries) luôn tốt hơn: CI/CD đơn giản, shared state dễ, không có runtime dependency conflicts.

**💡 Interview Signal:**
- ✅ Strong: Frames decision around team count and deployment independence, mentions operational cost of MFE, knows Modular Monolith as the middle ground
- ❌ Weak: "MFE is better for large apps" — size isn't the driver, team independence is

---

### Q: How does Module Federation prevent "two React instances" in micro-frontends? / Module Federation ngăn "hai React instances" thế nào? 🟡 Mid

**A:** By marking React as a `singleton: true` in the `shared` config across all remotes and the host. When the shell loads a remote bundle, Webpack checks if React is already in the shared scope — if so, it reuses the existing instance instead of loading a second copy. Without `singleton: true`, each remote bundle includes its own React → hooks throw errors across MFE boundaries because the hook registry is per-React-instance.

Cấu hình `shared: { react: { singleton: true } }` trong tất cả remotes và host. Webpack kiểm tra shared scope trước khi load — nếu React đã tồn tại, dùng lại. Nếu không có `singleton: true`, mỗi remote load React riêng → hooks fail vì hook registry là per-instance.

**💡 Interview Signal:**
- ✅ Strong: Explains singleton checking mechanism, hook registry failure mode, where to configure
- ❌ Weak: "Just use the same version everywhere" — version matching is necessary but not sufficient without `singleton: true`

---

### Q: How do you handle shared state (auth, cart) across micro-frontends? / Shared state (auth, cart) hoạt động thế nào trong micro-frontends? 🟡 Mid

**A:** Three approaches in order of preference: (1) **Shell-owned global state**: shell holds auth/cart state, passes down via URL params or custom events; (2) **Shared library via Module Federation**: a dedicated `@shared/state` remote exposes a Zustand/Redux store — all MFEs import the same singleton; (3) **Backend-as-truth**: no frontend shared state — each MFE reads from API/cookie directly, backend session is the source of truth. Option 3 is most scalable but adds latency; option 2 requires careful singleton management.

Ba cách: (1) Shell giữ state, truyền xuống qua events/URL; (2) Module Federation expose shared store (Zustand singleton); (3) Không có frontend shared state — mỗi MFE đọc từ API/cookie, backend là source of truth. Option 3 scale tốt nhất nhưng thêm latency.

**💡 Interview Signal:**
- ✅ Strong: Gives 3 options with tradeoffs, mentions custom events / Module Federation singleton / backend-as-truth
- ❌ Weak: "Use Redux" — doesn't address how to share a Redux store across independently-deployed bundles

---

### Q: What are the trade-offs of Atomic Design (Atoms/Molecules/Organisms)? / Atomic Design có trade-offs gì? 🟢 Junior

**A:** Atomic Design structures components hierarchically by complexity: Atoms (Button, Input) → Molecules (SearchBar, FormField) → Organisms (ProductCard, Header) → Templates → Pages. Benefits: clear reusability boundaries, easy to spot over-engineered components. Drawbacks: the Atom/Molecule boundary is subjective and causes team debates; deeply nested hierarchies slow down new developers; "organisms" often become over-large.

Atomic Design phân cấp theo độ phức tạp: Atoms → Molecules → Organisms → Templates → Pages. Ưu: ranh giới reusability rõ ràng. Nhược: ranh giới Atom/Molecule chủ quan gây tranh cãi team; hierarchy sâu làm chậm onboarding; organisms dễ bị bloat.

**💡 Interview Signal:**
- ✅ Strong: Knows the 5 levels, names at least 2 trade-offs, shows pragmatic awareness that strict adherence causes problems
- ❌ Weak: "Atomic Design means make small reusable components" — misses the hierarchy and its real-world friction

---

### Q: Design a micro-frontend architecture for a fintech super-app with 8 teams (banking, investments, payments, insurance...). / Thiết kế MFE architecture cho fintech super-app với 8 teams. 🔴 Senior

**A:** Shell app orchestrates routing and shared state; 8 team remotes expose their feature modules via Module Federation. Key decisions:

1. **Routing**: Shell owns top-level routes (`/banking/*`, `/investments/*`), delegates sub-routing to each MFE via react-router nested routes
2. **Shared state**: Auth token in httpOnly cookie (backend-managed) + custom event bus for cross-MFE notifications; no shared Redux store (too tight coupling)
3. **Shared dependencies**: `shared: { react: singleton, 'react-dom': singleton, '@design-system': singleton }` — pin major versions across all teams
4. **Isolation**: Each MFE's CSS in Shadow DOM or CSS Modules with team prefix to prevent leakage
5. **Resilience**: Each remote wrapped in Error Boundary — if Investments MFE fails, Banking still works

Compliance note: some insurance modules may need iframe isolation for regulatory sandboxing.

Shell điều phối routing + Module Federation expose. Auth qua httpOnly cookie (backend). Custom events cho cross-MFE notifications. Design system là shared singleton. CSS isolation qua Shadow DOM hoặc CSS Modules prefix. Error Boundaries bọc từng remote — failure isolated.

**💡 Interview Signal:**
- ✅ Strong: Covers routing strategy, shared state approach, dependency singleton config, CSS isolation, resilience via Error Boundaries
- ❌ Weak: "Each team builds their own React app and we combine them" — doesn't address shared deps, routing ownership, or failure isolation

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Level | One-liner |
|---|-------|-------|-----------|
| 1 | MFE vs Modular Monolith | 🟡 | Team count + deploy independence → MFE; complexity cost is real |
| 2 | Module Federation singleton | 🟡 | `shared: { react: { singleton: true } }` — one hook registry |
| 3 | Shared state across MFEs | 🟡 | Shell events → shared remote store → backend-as-truth (ascending scale) |
| 4 | Atomic Design tradeoffs | 🟢 | Clear boundaries but subjective hierarchy causes team friction |
| 5 | Fintech super-app MFE design | 🔴 | Shell routing + cookie auth + singleton deps + CSS isolation + Error Boundaries |

---

## ⚡ Cold Call Simulation

**Q: "Your company has 8 frontend teams all editing one React repo — releases are blocked weekly. What do you do?"**

**30-second answer:**

"First question: do all 8 teams actually need independent deploys, or just fewer merge conflicts? If it's the latter, I'd start with a Modular Monolith — enforce module boundaries with ESLint, one team owns one folder, strict import rules prevent cross-team coupling. That solves 80% of merge conflicts with zero operational overhead. If teams genuinely need independent deploys — different release cadences, different tech stacks — then I'd migrate to Module Federation: each team gets their own bundle and CDN deploy, the shell app dynamically loads remotes at runtime. Key config: React and the design system as `singleton: true` in shared. The shell owns top-level routing; each team owns sub-routes. Auth state lives in an httpOnly cookie so no shared Redux store is needed across bundles."

---

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Scalability →](./02-scalability.md)

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: Name the 3 architecture options on the monolith→MFE spectrum and the team size trigger for each
- **Visual**: Sketch the Module Federation config — what goes in `remotes`, `exposes`, and `shared`? Why `singleton: true` for React?
- **Application**: You join a 6-team company with one repo. Merge conflicts block releases every week. Walk through your first 3 decisions.
- **Debug**: Teams report that React hooks throw "Invalid hook call" errors after the new MFE remote was deployed. What went wrong and how do you fix it?
- **Teach**: Explain Module Federation to a backend engineer who knows microservices — what's the equivalent of "service registry", what's the equivalent of "service mesh"?

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [React Fundamentals](../03-react/01-react-fundamentals.md) — component model scales to MFE
- ⬅️ **Built on**: [Microservices](../../be-track/02-backend-knowledge/02-microservices.md) — same decomposition principles apply
- 🔗 **Applied in**: [System Design Theory](../../shared/02-system-design/system-design-theory.md) — frontend architecture is part of system design
