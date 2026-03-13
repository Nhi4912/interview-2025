# React Fundamentals Theory - Deep Dive

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

# Lý Thuyết Nền Tảng React - Tìm Hiểu Sâu

## Table of Contents / Mục Lục

### Part 1: Core Concepts / Phần 1: Khái Niệm Cốt Lõi
1. React Philosophy and Design Principles
2. Virtual DOM Architecture
3. Component Model Theory
4. JSX Transformation
5. Reconciliation Algorithm

### Part 2: Component Lifecycle / Phần 2: Vòng Đời Component
6. Mounting Phase
7. Updating Phase
8. Unmounting Phase
9. Error Boundaries

### Part 3: State and Props / Phần 3: State và Props
10. State Management Fundamentals
11. Props Flow and Immutability
12. Lifting State Up
13. Context API Deep Dive

### Part 4: Hooks Theory / Phần 4: Lý Thuyết Hooks
14. useState Implementation
15. useEffect Execution Model
16. useRef and DOM References
17. Custom Hooks Patterns

### Part 5: Performance / Phần 5: Hiệu Suất
18. Rendering Optimization
19. Memoization Strategies
20. Code Splitting

---

## Part 1: Core Concepts / Phần 1: Khái Niệm Cốt Lõi

### 1. React Philosophy and Design Principles
### 1. Triết Lý và Nguyên Tắc Thiết Kế React


**English:**

React is built on several fundamental principles that guide its design and implementation:

**1. Declarative Programming**
- Describe WHAT the UI should look like, not HOW to build it
- React handles the DOM manipulation
- More predictable and easier to debug

```javascript
// Imperative (Traditional DOM)
const button = document.createElement('button');
button.textContent = 'Click me';
button.onclick = () => alert('Clicked!');
document.body.appendChild(button);

// Declarative (React)
function App() {
  return <button onClick={() => alert('Clicked!')}>Click me</button>;
}
```

**2. Component-Based Architecture**
- UI is composed of reusable, self-contained components
- Each component manages its own state
- Components can be composed to build complex UIs

**3. Learn Once, Write Anywhere**
- Same concepts work across platforms (Web, Native, VR)
- React Native, React VR use same component model
- Consistent mental model

**4. Unidirectional Data Flow**
- Data flows down from parent to child
- Events flow up from child to parent
- Predictable state management

```
┌─────────────┐
│   Parent    │
│   State     │
└──────┬──────┘
       │ Props ↓
┌──────▼──────┐
│    Child    │
│  Component  │
└──────┬──────┘
       │ Events ↑
```

**Vietnamese:**

React được xây dựng dựa trên các nguyên tắc cơ bản hướng dẫn thiết kế và triển khai:

**1. Lập Trình Khai Báo (Declarative)**
- Mô tả UI NÊN TRÔNG như thế nào, không phải LÀM THẾ NÀO để xây dựng
- React xử lý thao tác DOM
- Dễ dự đoán và debug hơn


**2. Kiến Trúc Dựa Trên Component**
- UI được tạo từ các component có thể tái sử dụng, độc lập
- Mỗi component quản lý state riêng
- Các component có thể kết hợp để xây dựng UI phức tạp

**3. Học Một Lần, Viết Mọi Nơi**
- Cùng khái niệm hoạt động trên nhiều nền tảng (Web, Native, VR)
- React Native, React VR sử dụng cùng mô hình component
- Mô hình tư duy nhất quán

**4. Luồng Dữ Liệu Một Chiều**
- Dữ liệu chảy xuống từ cha sang con
- Sự kiện chảy lên từ con sang cha
- Quản lý state có thể dự đoán

---

### 2. Virtual DOM Architecture
### 2. Kiến Trúc Virtual DOM

**English:**

The Virtual DOM is React's secret weapon for performance. It's an in-memory representation of the real DOM.

**How Virtual DOM Works:**

```
1. Initial Render:
   React Element Tree → Virtual DOM → Real DOM

2. State Update:
   New React Element Tree → New Virtual DOM
   ↓
   Diffing Algorithm (Reconciliation)
   ↓
   Minimal DOM Updates

3. Commit Phase:
   Apply changes to Real DOM
```

**Virtual DOM Structure:**

```javascript
// JSX
<div className="container">
  <h1>Hello</h1>
  <p>World</p>
</div>

// Virtual DOM (React Element)
{
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello' }
      },
      {
        type: 'p',
        props: { children: 'World' }
      }
    ]
  }
}
```


**Why Virtual DOM is Fast:**

1. **Batching Updates**: Multiple state changes are batched together
2. **Efficient Diffing**: O(n) complexity instead of O(n³)
3. **Minimal DOM Operations**: Only necessary changes are applied
4. **JavaScript Speed**: Virtual DOM operations happen in memory

**Reconciliation Process:**

```javascript
// Example: Updating a list
// Old Virtual DOM
<ul>
  <li key="1">Item 1</li>
  <li key="2">Item 2</li>
</ul>

// New Virtual DOM
<ul>
  <li key="1">Item 1</li>
  <li key="2">Item 2 (updated)</li>
  <li key="3">Item 3</li>
</ul>

// React's Diff:
// - Keep <li key="1"> (no change)
// - Update <li key="2"> (text changed)
// - Insert <li key="3"> (new)
```

**Vietnamese:**

Virtual DOM là vũ khí bí mật của React cho hiệu suất. Đây là biểu diễn trong bộ nhớ của DOM thực.

**Cách Virtual DOM Hoạt Động:**

```
1. Render Lần Đầu:
   Cây React Element → Virtual DOM → DOM Thực

2. Cập Nhật State:
   Cây React Element Mới → Virtual DOM Mới
   ↓
   Thuật Toán Diff (Reconciliation)
   ↓
   Cập Nhật DOM Tối Thiểu

3. Giai Đoạn Commit:
   Áp dụng thay đổi vào DOM Thực
```

**Tại Sao Virtual DOM Nhanh:**

1. **Gộp Cập Nhật**: Nhiều thay đổi state được gộp lại
2. **Diff Hiệu Quả**: Độ phức tạp O(n) thay vì O(n³)
3. **Thao Tác DOM Tối Thiểu**: Chỉ áp dụng thay đổi cần thiết
4. **Tốc Độ JavaScript**: Thao tác Virtual DOM xảy ra trong bộ nhớ

**Fiber Architecture (React 16+):**

```
Fiber Node Structure:
{
  type: Component/Element type,
  key: Unique identifier,
  props: Component props,
  stateNode: DOM node or component instance,
  return: Parent fiber,
  child: First child fiber,
  sibling: Next sibling fiber,
  alternate: Previous fiber (for comparison),
  effectTag: Type of work (update, delete, insert),
  nextEffect: Next fiber with effects
}
```


**Fiber Benefits:**

1. **Incremental Rendering**: Work can be split into chunks
2. **Pause and Resume**: Can pause work and come back later
3. **Priority Scheduling**: Different updates have different priorities
4. **Concurrent Mode**: Multiple versions of UI can be prepared

```javascript
// Priority Levels in React
const priorities = {
  Immediate: 1,        // User input, clicks
  UserBlocking: 2,     // Hover, scroll
  Normal: 3,           // Data fetching
  Low: 4,              // Analytics
  Idle: 5              // Background work
};
```

---

### 3. Component Model Theory
### 3. Lý Thuyết Mô Hình Component

**English:**

Components are the building blocks of React applications. Understanding their theory is crucial.

**Component Types:**

```javascript
// 1. Function Components (Modern)
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 2. Arrow Function Components
const Welcome = (props) => <h1>Hello, {props.name}</h1>;

// 3. Class Components (Legacy)
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

**Component Composition:**

```javascript
// Atomic Design Pattern
// Atoms (smallest components)
const Button = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);

// Molecules (combination of atoms)
const SearchBox = () => (
  <div>
    <input type="text" />
    <Button>Search</Button>
  </div>
);

// Organisms (complex components)
const Header = () => (
  <header>
    <Logo />
    <Navigation />
    <SearchBox />
  </header>
);

// Templates (page layouts)
const PageTemplate = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);
```

**Component Communication Patterns:**

```
1. Parent to Child (Props):
┌─────────┐
│ Parent  │
└────┬────┘
     │ props
     ▼
┌─────────┐
│  Child  │
└─────────┘

2. Child to Parent (Callbacks):
┌─────────┐
│ Parent  │◄─── callback
└────┬────┘
     │ callback function
     ▼
┌─────────┐
│  Child  │──── calls callback
└─────────┘

3. Sibling Communication (Lift State Up):
     ┌─────────┐
     │ Parent  │
     │ (State) │
     └────┬────┘
     ┌────┴────┐
     │         │
┌────▼───┐ ┌──▼─────┐
│ Child1 │ │ Child2 │
└────────┘ └────────┘

4. Context (Global State):
     ┌──────────┐
     │ Provider │
     └────┬─────┘
          │ context
     ┌────┴────┐
     │         │
┌────▼───┐ ┌──▼─────┐
│Consumer│ │Consumer│
└────────┘ └────────┘
```

**Vietnamese:**

Components là khối xây dựng của ứng dụng React. Hiểu lý thuyết của chúng rất quan trọng.

**Các Loại Component:**

1. **Function Components**: Hiện đại, đơn giản, sử dụng hooks
2. **Class Components**: Cũ hơn, phức tạp hơn, có lifecycle methods
3. **Pure Components**: Tối ưu hóa re-render với shallow comparison

**Nguyên Tắc Thiết Kế Component:**

1. **Single Responsibility**: Mỗi component làm một việc
2. **Reusability**: Có thể tái sử dụng ở nhiều nơi
3. **Composability**: Có thể kết hợp với components khác
4. **Testability**: Dễ dàng test độc lập

**Component Lifecycle (Mental Model):**

```
Birth (Mounting)
    ↓
Life (Updating)
    ↓
Death (Unmounting)
```

---

### 4. JSX Transformation
### 4. Chuyển Đổi JSX

**English:**

JSX is syntactic sugar for React.createElement(). Understanding the transformation helps debug and optimize.

**JSX to JavaScript:**

```javascript
// JSX
const element = (
  <div className="container">
    <h1>Hello, {name}!</h1>
    <p>Welcome to React</p>
  </div>
);

// Transformed to:
const element = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello, ', name, '!'),
  React.createElement('p', null, 'Welcome to React')
);

// Which creates:
{
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: ['Hello, ', name, '!']
        }
      },
      {
        type: 'p',
        props: {
          children: 'Welcome to React'
        }
      }
    ]
  }
}
```

**JSX Rules and Best Practices:**

```javascript
// 1. Must return single root element
// ❌ Wrong
function App() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  );
}

// ✅ Correct
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}

// 2. Close all tags
// ❌ Wrong
<img src="photo.jpg">
<input type="text">

// ✅ Correct
<img src="photo.jpg" />
<input type="text" />

// 3. camelCase for attributes
// ❌ Wrong
<div class="container" onclick={handler}>

// ✅ Correct
<div className="container" onClick={handler}>

// 4. JavaScript expressions in {}
const name = "John";
const element = <h1>Hello, {name}!</h1>;
const element2 = <h1>2 + 2 = {2 + 2}</h1>;
const element3 = <h1>{user.isLoggedIn ? 'Welcome' : 'Please login'}</h1>;
```

**Advanced JSX Patterns:**

```javascript
// 1. Spread Attributes
const props = { id: 'main', className: 'container' };
<div {...props} />

// 2. Children as Function (Render Props)
<DataProvider>
  {data => <div>{data.name}</div>}
</DataProvider>

// 3. Conditional Rendering
{isLoggedIn && <UserProfile />}
{isLoading ? <Spinner /> : <Content />}

// 4. Lists and Keys
{items.map(item => (
  <ListItem key={item.id} data={item} />
))}

// 5. Fragments
<>
  <ChildA />
  <ChildB />
</>
// or with key
<React.Fragment key={item.id}>
  <dt>{item.term}</dt>
  <dd>{item.description}</dd>
</React.Fragment>
```

**Vietnamese:**

JSX là cú pháp đường (syntactic sugar) cho React.createElement(). Hiểu chuyển đổi giúp debug và tối ưu.

**Quy Tắc JSX:**

1. **Phải trả về một root element duy nhất**
2. **Đóng tất cả các thẻ**
3. **Sử dụng camelCase cho thuộc tính**
4. **Biểu thức JavaScript trong {}**

**JSX vs Template Strings:**

```javascript
// Template String (không phải React)
const html = `
  <div class="container">
    <h1>Hello, ${name}</h1>
  </div>
`;
// Vấn đề: Không có type checking, không có component composition

// JSX (React)
const element = (
  <div className="container">
    <h1>Hello, {name}</h1>
  </div>
);
// Ưu điểm: Type checking, component composition, performance optimization
```

---

### 5. Reconciliation Algorithm
### 5. Thuật Toán Reconciliation

**English:**

Reconciliation is the algorithm React uses to diff one tree with another to determine which parts need to be changed.

**Diffing Algorithm Principles:**

```
1. Different Types → Replace
   <div> → <span>  // Replace entire subtree

2. Same Type → Update Props
   <div className="old"> → <div className="new">  // Update className

3. Keys → Identify Elements
   <li key="1"> → <li key="1">  // Same element, check children
```


**Reconciliation Steps:**

```javascript
// Step 1: Element Type Comparison
// Old: <div><span>Hello</span></div>
// New: <div><p>Hello</p></div>
// Result: Unmount <span>, mount <p>

// Step 2: Props Comparison
// Old: <div className="old" style={{color: 'red'}} />
// New: <div className="new" style={{color: 'red'}} />
// Result: Update className only

// Step 3: Children Reconciliation
// Old: [<A key="a"/>, <B key="b"/>]
// New: [<B key="b"/>, <A key="a"/>, <C key="c"/>]
// Result: Reorder A and B, insert C
```

**Key Importance:**

```javascript
// ❌ Without keys (inefficient)
<ul>
  {items.map(item => <li>{item.text}</li>)}
</ul>
// React can't track which item is which
// May re-render all items on change

// ✅ With keys (efficient)
<ul>
  {items.map(item => <li key={item.id}>{item.text}</li>)}
</ul>
// React knows exactly which items changed

// ❌ Bad: Using index as key (when list can change)
{items.map((item, index) => <li key={index}>{item.text}</li>)}
// Problem: If items reorder, keys don't match items

// ✅ Good: Using stable unique ID
{items.map(item => <li key={item.id}>{item.text}</li>)}
```

**Reconciliation Performance:**

```
Traditional Diff Algorithm: O(n³)
- Compare every node with every other node
- 1000 elements = 1 billion comparisons

React's Diff Algorithm: O(n)
- Single pass through tree
- 1000 elements = 1000 comparisons

Optimizations:
1. Two elements of different types produce different trees
2. Developer can hint at stable children with keys
3. Breadth-first search
4. Batching updates
```

**Vietnamese:**

Reconciliation là thuật toán React sử dụng để so sánh hai cây để xác định phần nào cần thay đổi.

**Nguyên Tắc Thuật Toán Diff:**

1. **Kiểu Khác Nhau → Thay Thế**: Thay thế toàn bộ cây con
2. **Cùng Kiểu → Cập Nhật Props**: Chỉ cập nhật thuộc tính thay đổi
3. **Keys → Nhận Diện Elements**: Theo dõi elements qua các lần render

**Tầm Quan Trọng của Keys:**

Keys giúp React nhận diện elements nào đã thay đổi, thêm, hoặc xóa. Keys phải:
- Unique giữa các siblings
- Stable (không thay đổi giữa các renders)
- Predictable (không random)

```javascript
// Ví dụ: Thêm item vào đầu list
// Không có key:
Old: [<li>A</li>, <li>B</li>]
New: [<li>C</li>, <li>A</li>, <li>B</li>]
React nghĩ: Thay đổi tất cả 3 items

// Có key:
Old: [<li key="a">A</li>, <li key="b">B</li>]
New: [<li key="c">C</li>, <li key="a">A</li>, <li key="b">B</li>]
React biết: Chỉ thêm C, giữ nguyên A và B
```

---

## Part 2: Component Lifecycle / Phần 2: Vòng Đời Component

### 6. Mounting Phase
### 6. Giai Đoạn Mounting

**English:**

Mounting is when a component is being created and inserted into the DOM.

**Mounting Sequence (Class Components):**

```javascript
class MyComponent extends React.Component {
  // 1. Constructor
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    // Initialize state
    // Bind methods
    // DON'T: Call setState, make API calls
  }

  // 2. getDerivedStateFromProps (rare)
  static getDerivedStateFromProps(props, state) {
    // Return new state based on props
    // Or null for no changes
    return null;
  }

  // 3. render
  render() {
    // Return JSX
    // MUST be pure (no side effects)
    return <div>{this.state.count}</div>;
  }

  // 4. componentDidMount
  componentDidMount() {
    // Component is in DOM
    // Perfect for:
    // - API calls
    // - Subscriptions
    // - DOM manipulation
    // - Timers
    fetch('/api/data')
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }
}
```


**Mounting Sequence (Function Components with Hooks):**

```javascript
function MyComponent(props) {
  // 1. Function body executes (like constructor + render)
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  // 2. useEffect with empty deps (like componentDidMount)
  useEffect(() => {
    // Runs after first render
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));

    // Cleanup function (like componentWillUnmount)
    return () => {
      // Cleanup subscriptions, timers, etc.
    };
  }, []); // Empty deps = run once on mount

  // 3. Return JSX (like render)
  return <div>{count}</div>;
}
```

**Mounting Visualization:**

```
Time →

1. Constructor/Function Body
   ├─ Initialize state
   ├─ Setup instance variables
   └─ Prepare component

2. getDerivedStateFromProps (if needed)
   └─ Sync state with props

3. render()
   ├─ Create React elements
   ├─ Build Virtual DOM
   └─ Return JSX

4. React Updates DOM
   └─ Insert into real DOM

5. componentDidMount / useEffect
   ├─ Component is visible
   ├─ Safe to make API calls
   ├─ Setup subscriptions
   └─ Start timers
```

**Vietnamese:**

Mounting là khi component được tạo và chèn vào DOM.

**Trình Tự Mounting:**

1. **Constructor/Function Body**: Khởi tạo state, biến
2. **getDerivedStateFromProps**: Đồng bộ state với props (hiếm khi dùng)
3. **render**: Tạo React elements, trả về JSX
4. **React cập nhật DOM**: Chèn vào DOM thực
5. **componentDidMount/useEffect**: Component đã hiển thị, có thể gọi API

**Best Practices cho Mounting:**

```javascript
// ✅ Good: Fetch data in componentDidMount/useEffect
useEffect(() => {
  fetchData();
}, []);

// ❌ Bad: Fetch data in render
function Component() {
  fetchData(); // Causes infinite loop!
  return <div>...</div>;
}

// ✅ Good: Initialize state in constructor/useState
const [count, setCount] = useState(0);

// ❌ Bad: Initialize state in useEffect
useEffect(() => {
  setCount(0); // Unnecessary re-render
}, []);
```

---

### 7. Updating Phase
### 7. Giai Đoạn Updating

**English:**

Updating happens when props or state change, causing a re-render.

**Update Triggers:**

```javascript
// 1. Props Change
<Child name={this.state.name} />
// When parent's state.name changes, Child updates

// 2. State Change
this.setState({ count: this.state.count + 1 });
setCount(count + 1);

// 3. Force Update (avoid!)
this.forceUpdate();

// 4. Context Change
const value = useContext(MyContext);
// When context value changes, component updates
```

**Updating Sequence (Class Components):**

```javascript
class MyComponent extends React.Component {
  // 1. getDerivedStateFromProps
  static getDerivedStateFromProps(props, state) {
    // Sync state with new props
    if (props.value !== state.value) {
      return { value: props.value };
    }
    return null;
  }

  // 2. shouldComponentUpdate (optimization)
  shouldComponentUpdate(nextProps, nextState) {
    // Return false to skip render
    // Return true to proceed
    return nextProps.value !== this.props.value ||
           nextState.count !== this.state.count;
  }

  // 3. render
  render() {
    return <div>{this.state.count}</div>;
  }

  // 4. getSnapshotBeforeUpdate (rare)
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Capture info from DOM before update
    // Return value passed to componentDidUpdate
    if (prevProps.list.length < this.props.list.length) {
      return this.listRef.scrollHeight;
    }
    return null;
  }

  // 5. React Updates DOM

  // 6. componentDidUpdate
  componentDidUpdate(prevProps, prevState, snapshot) {
    // Component updated in DOM
    // Compare prev and current props/state
    if (prevProps.userId !== this.props.userId) {
      this.fetchUserData(this.props.userId);
    }

    // Use snapshot from getSnapshotBeforeUpdate
    if (snapshot !== null) {
      this.listRef.scrollTop += 
        this.listRef.scrollHeight - snapshot;
    }
  }
}
```


**Updating Sequence (Function Components):**

```javascript
function MyComponent({ userId }) {
  const [data, setData] = useState(null);
  const prevUserIdRef = useRef();

  // Function body re-executes on every render
  console.log('Rendering...');

  // useEffect with dependencies (like componentDidUpdate)
  useEffect(() => {
    // Runs after every render where userId changed
    if (prevUserIdRef.current !== userId) {
      fetchUserData(userId);
    }
    prevUserIdRef.current = userId;
  }, [userId]); // Runs when userId changes

  return <div>{data}</div>;
}

// Better pattern with custom hook
function useUserData(userId) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchUserData(userId).then(setData);
  }, [userId]);

  return data;
}
```

**Update Optimization:**

```javascript
// 1. React.memo (like PureComponent)
const MyComponent = React.memo(function MyComponent({ value }) {
  return <div>{value}</div>;
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip render)
  // Return false if props changed (re-render)
  return prevProps.value === nextProps.value;
});

// 2. useMemo (memoize expensive calculations)
function Component({ items }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]); // Only recalculate when items change

  return <div>{expensiveValue}</div>;
}

// 3. useCallback (memoize functions)
function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback: new function every render
  const handleClick = () => setCount(c => c + 1);

  // With useCallback: same function reference
  const handleClickMemo = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Dependencies

  return <Child onClick={handleClickMemo} />;
}
```

**Vietnamese:**

Updating xảy ra khi props hoặc state thay đổi, gây ra re-render.

**Triggers Cập Nhật:**

1. **Props thay đổi**: Component cha truyền props mới
2. **State thay đổi**: setState hoặc setter từ useState
3. **Force Update**: forceUpdate() (tránh dùng!)
4. **Context thay đổi**: Context value thay đổi

**Tối Ưu Hóa Update:**

```javascript
// Tránh re-render không cần thiết

// ❌ Bad: Tạo object/array mới mỗi render
function Parent() {
  return <Child style={{ margin: 10 }} />; // New object every render
}

// ✅ Good: Sử dụng biến stable
const style = { margin: 10 };
function Parent() {
  return <Child style={style} />;
}

// ❌ Bad: Inline function trong props
<Child onClick={() => doSomething()} />

// ✅ Good: useCallback cho function
const handleClick = useCallback(() => doSomething(), []);
<Child onClick={handleClick} />
```

**Update Flow Visualization:**

```
Props/State Change
    ↓
getDerivedStateFromProps
    ↓
shouldComponentUpdate? ──No──> Skip render
    │ Yes
    ↓
render()
    ↓
getSnapshotBeforeUpdate
    ↓
Update DOM
    ↓
componentDidUpdate
```

---

### 8. Unmounting Phase
### 8. Giai Đoạn Unmounting

**English:**

Unmounting is when a component is being removed from the DOM.

**Unmounting Sequence:**

```javascript
// Class Component
class MyComponent extends React.Component {
  componentDidMount() {
    // Setup
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);

    this.subscription = eventEmitter.subscribe('event', this.handleEvent);
  }

  componentWillUnmount() {
    // Cleanup - CRITICAL!
    clearInterval(this.timer);
    this.subscription.unsubscribe();

    // Common cleanup tasks:
    // - Clear timers
    // - Cancel network requests
    // - Remove event listeners
    // - Unsubscribe from subscriptions
    // - Cancel animations
  }

  render() {
    return <div>{this.state.time}</div>;
  }
}

// Function Component
function MyComponent() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    // Setup
    const timer = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div>{time}</div>;
}
```


**Common Cleanup Scenarios:**

```javascript
// 1. Event Listeners
useEffect(() => {
  const handleResize = () => console.log('Resized');
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// 2. Subscriptions
useEffect(() => {
  const subscription = dataSource.subscribe(data => {
    setData(data);
  });
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// 3. Timers
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Delayed action');
  }, 1000);
  
  return () => {
    clearTimeout(timer);
  };
}, []);

// 4. Async Operations (AbortController)
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });
  
  return () => {
    controller.abort();
  };
}, []);

// 5. WebSocket Connections
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onmessage = (event) => {
    setMessages(prev => [...prev, event.data]);
  };
  
  return () => {
    ws.close();
  };
}, []);
```

**Memory Leak Prevention:**

```javascript
// ❌ Memory Leak: setState after unmount
function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(result => {
      setData(result); // Error if component unmounted!
    });
  }, []);
  
  return <div>{data}</div>;
}

// ✅ Fixed: Check if mounted
function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    fetchData().then(result => {
      if (isMounted) {
        setData(result);
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return <div>{data}</div>;
}

// ✅ Better: Use AbortController
function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    fetchData(controller.signal)
      .then(result => setData(result))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });
    
    return () => controller.abort();
  }, []);
  
  return <div>{data}</div>;
}
```

**Vietnamese:**

Unmounting là khi component bị xóa khỏi DOM.

**Nhiệm Vụ Cleanup:**

1. **Xóa timers**: clearInterval, clearTimeout
2. **Hủy network requests**: AbortController
3. **Xóa event listeners**: removeEventListener
4. **Unsubscribe**: Hủy subscriptions
5. **Đóng connections**: WebSocket, SSE

**Tại Sao Cleanup Quan Trọng:**

```javascript
// Không cleanup → Memory leak
function BadComponent() {
  useEffect(() => {
    setInterval(() => {
      console.log('Running...'); // Chạy mãi sau khi unmount!
    }, 1000);
  }, []);
  
  return <div>Component</div>;
}

// Có cleanup → Không memory leak
function GoodComponent() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Running...');
    }, 1000);
    
    return () => clearInterval(timer); // Dừng khi unmount
  }, []);
  
  return <div>Component</div>;
}
```

**Unmounting Visualization:**

```
Component Active
    ↓
Unmount Triggered
    ↓
componentWillUnmount / useEffect cleanup
    ├─ Clear timers
    ├─ Remove listeners
    ├─ Cancel requests
    └─ Cleanup resources
    ↓
Remove from DOM
    ↓
Component Destroyed
```

---

### 9. Error Boundaries
### 9. Error Boundaries

**English:**

Error Boundaries catch JavaScript errors in child components, log errors, and display fallback UI.

**Error Boundary Implementation:**

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Catch errors during rendering
  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  // Log error details
  componentDidCatch(error, errorInfo) {
    // errorInfo.componentStack contains component stack trace
    console.error('Error caught:', error, errorInfo);
    
    // Send to error reporting service
    logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```


**What Error Boundaries Catch:**

```javascript
// ✅ Caught by Error Boundaries:
// 1. Errors during rendering
function BuggyComponent() {
  throw new Error('Rendering error!');
  return <div>Never rendered</div>;
}

// 2. Errors in lifecycle methods
componentDidMount() {
  throw new Error('Lifecycle error!');
}

// 3. Errors in constructors
constructor(props) {
  super(props);
  throw new Error('Constructor error!');
}

// ❌ NOT caught by Error Boundaries:
// 1. Event handlers
<button onClick={() => {
  throw new Error('Not caught!'); // Use try-catch
}}>
  Click
</button>

// 2. Async code
useEffect(() => {
  setTimeout(() => {
    throw new Error('Not caught!'); // Use try-catch
  }, 1000);
}, []);

// 3. Server-side rendering errors

// 4. Errors in Error Boundary itself
```

**Error Boundary Strategies:**

```javascript
// 1. Granular Error Boundaries
function App() {
  return (
    <div>
      <ErrorBoundary fallback={<HeaderFallback />}>
        <Header />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<ContentFallback />}>
        <Content />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<SidebarFallback />}>
        <Sidebar />
      </ErrorBoundary>
    </div>
  );
}

// 2. Retry Mechanism
class ErrorBoundaryWithRetry extends React.Component {
  state = { hasError: false, retryCount: 0 };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState(state => ({
      hasError: false,
      retryCount: state.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Error occurred</h1>
          <button onClick={this.handleRetry}>
            Retry ({this.state.retryCount})
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 3. Custom Fallback Component
function ErrorFallback({ error, resetError }) {
  return (
    <div role="alert">
      <h2>Oops! Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetError}>Try again</button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

**Vietnamese:**

Error Boundaries bắt lỗi JavaScript trong components con, log lỗi, và hiển thị UI dự phòng.

**Error Boundaries Bắt Được:**

1. **Lỗi trong rendering**: throw trong function body
2. **Lỗi trong lifecycle methods**: componentDidMount, etc.
3. **Lỗi trong constructors**: Khởi tạo component

**Error Boundaries KHÔNG Bắt:**

1. **Event handlers**: Dùng try-catch thay vì
2. **Async code**: setTimeout, Promise, async/await
3. **Server-side rendering**: SSR errors
4. **Lỗi trong Error Boundary chính nó**

**Best Practices:**

```javascript
// ✅ Good: Multiple error boundaries
<ErrorBoundary>
  <Header />
</ErrorBoundary>
<ErrorBoundary>
  <Main />
</ErrorBoundary>

// ❌ Bad: Single error boundary for entire app
<ErrorBoundary>
  <Header />
  <Main />
  <Footer />
</ErrorBoundary>
// Một lỗi sẽ crash toàn bộ app

// ✅ Good: Handle async errors
async function handleClick() {
  try {
    await fetchData();
  } catch (error) {
    setError(error);
  }
}

// ❌ Bad: Unhandled async errors
async function handleClick() {
  await fetchData(); // Error không được bắt
}
```

---

## Part 3: State and Props / Phần 3: State và Props

### 10. State Management Fundamentals
### 10. Nền Tảng Quản Lý State

**English:**

State is data that changes over time. Understanding state is crucial for React mastery.

**State Characteristics:**

```javascript
// 1. Local State (Component State)
function Counter() {
  const [count, setCount] = useState(0);
  // State belongs to this component only
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// 2. Shared State (Lifted State)
function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <ChildA count={count} />
      <ChildB setCount={setCount} />
    </>
  );
}

// 3. Global State (Context/Redux)
const CountContext = createContext();

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <CountContext.Provider value={{ count, setCount }}>
      <DeepChild />
    </CountContext.Provider>
  );
}
```


**State Update Patterns:**

```javascript
// 1. Direct Update (for primitive values)
const [count, setCount] = useState(0);
setCount(5); // Direct value

// 2. Functional Update (when depending on previous state)
setCount(prevCount => prevCount + 1);

// Why functional update?
// ❌ Problem with direct update:
function increment() {
  setCount(count + 1); // Uses stale count
  setCount(count + 1); // Uses same stale count
  // Result: count increases by 1, not 2
}

// ✅ Solution with functional update:
function increment() {
  setCount(c => c + 1); // Uses latest count
  setCount(c => c + 1); // Uses updated count
  // Result: count increases by 2
}

// 3. Object State Updates (immutable)
const [user, setUser] = useState({ name: 'John', age: 30 });

// ❌ Wrong: Mutating state
user.age = 31; // Don't do this!
setUser(user);

// ✅ Correct: Creating new object
setUser({ ...user, age: 31 });
setUser(prevUser => ({ ...prevUser, age: 31 }));

// 4. Array State Updates (immutable)
const [items, setItems] = useState([1, 2, 3]);

// Add item
setItems([...items, 4]);
setItems(prev => [...prev, 4]);

// Remove item
setItems(items.filter(item => item !== 2));

// Update item
setItems(items.map(item => 
  item === 2 ? 20 : item
));

// Insert at position
const index = 1;
setItems([
  ...items.slice(0, index),
  newItem,
  ...items.slice(index)
]);
```

**State Batching:**

```javascript
// React 17 and earlier: Batching only in event handlers
function handleClick() {
  setCount(c => c + 1);  // Batched
  setFlag(f => !f);      // Batched
  // Only 1 re-render
}

setTimeout(() => {
  setCount(c => c + 1);  // Not batched
  setFlag(f => !f);      // Not batched
  // 2 re-renders
}, 1000);

// React 18+: Automatic batching everywhere
function handleClick() {
  setCount(c => c + 1);  // Batched
  setFlag(f => !f);      // Batched
  // Only 1 re-render
}

setTimeout(() => {
  setCount(c => c + 1);  // Batched!
  setFlag(f => !f);      // Batched!
  // Only 1 re-render
}, 1000);

// Opt-out of batching (React 18+)
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(c => c + 1);
}); // Re-render immediately

flushSync(() => {
  setFlag(f => !f);
}); // Re-render immediately
```

**Vietnamese:**

State là dữ liệu thay đổi theo thời gian. Hiểu state rất quan trọng để thành thạo React.

**Đặc Điểm State:**

1. **Immutable**: Không thay đổi trực tiếp, tạo bản sao mới
2. **Asynchronous**: setState không đồng bộ
3. **Batched**: Nhiều setState được gộp lại
4. **Triggers Re-render**: Thay đổi state gây re-render

**Patterns Cập Nhật State:**

```javascript
// Primitive values
const [count, setCount] = useState(0);
setCount(count + 1);

// Objects (phải immutable)
const [user, setUser] = useState({ name: 'John' });
setUser({ ...user, name: 'Jane' }); // Tạo object mới

// Arrays (phải immutable)
const [items, setItems] = useState([1, 2, 3]);
setItems([...items, 4]); // Tạo array mới

// Nested objects
const [state, setState] = useState({
  user: { name: 'John', address: { city: 'NYC' } }
});

// ❌ Wrong
state.user.address.city = 'LA';

// ✅ Correct
setState({
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'LA'
    }
  }
});

// ✅ Better: Use immer library
import { produce } from 'immer';

setState(produce(draft => {
  draft.user.address.city = 'LA';
}));
```

**State vs Props:**

```
State:
- Owned by component
- Can be changed by component
- Triggers re-render when changed
- Private and local

Props:
- Passed from parent
- Read-only (immutable)
- Can trigger re-render when changed
- Public interface
```

---

### 11. Props Flow and Immutability
### 11. Luồng Props và Tính Bất Biến

**English:**

Props (properties) are how components communicate. They flow down the component tree.

**Props Fundamentals:**

```javascript
// 1. Passing Props
function Parent() {
  return (
    <Child 
      name="John"
      age={30}
      isActive={true}
      hobbies={['reading', 'coding']}
      onClick={() => console.log('Clicked')}
    />
  );
}

// 2. Receiving Props
function Child(props) {
  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Active: {props.isActive ? 'Yes' : 'No'}</p>
      <ul>
        {props.hobbies.map(hobby => (
          <li key={hobby}>{hobby}</li>
        ))}
      </ul>
      <button onClick={props.onClick}>Click</button>
    </div>
  );
}

// 3. Destructuring Props
function Child({ name, age, isActive, hobbies, onClick }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}

// 4. Default Props
function Child({ name = 'Anonymous', age = 0 }) {
  return <div>{name}, {age}</div>;
}

// Or with defaultProps (class components)
Child.defaultProps = {
  name: 'Anonymous',
  age: 0
};

// 5. Prop Types (runtime validation)
import PropTypes from 'prop-types';

Child.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isActive: PropTypes.bool,
  hobbies: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func
};
```


**Props Immutability:**

```javascript
// ❌ NEVER mutate props
function Child({ user }) {
  user.name = 'Changed'; // DON'T DO THIS!
  return <div>{user.name}</div>;
}

// ✅ Props are read-only
function Child({ user }) {
  // Create new object if you need to modify
  const updatedUser = { ...user, name: 'Changed' };
  return <div>{updatedUser.name}</div>;
}

// ✅ Use callback to update parent state
function Parent() {
  const [user, setUser] = useState({ name: 'John' });
  
  const updateUser = (newName) => {
    setUser({ ...user, name: newName });
  };
  
  return <Child user={user} onUpdate={updateUser} />;
}

function Child({ user, onUpdate }) {
  return (
    <button onClick={() => onUpdate('Jane')}>
      Change Name
    </button>
  );
}
```

**Props Drilling Problem:**

```javascript
// Problem: Passing props through many levels
function App() {
  const [user, setUser] = useState({ name: 'John' });
  
  return <Level1 user={user} setUser={setUser} />;
}

function Level1({ user, setUser }) {
  return <Level2 user={user} setUser={setUser} />;
}

function Level2({ user, setUser }) {
  return <Level3 user={user} setUser={setUser} />;
}

function Level3({ user, setUser }) {
  return <Level4 user={user} setUser={setUser} />;
}

function Level4({ user, setUser }) {
  // Finally use the props here
  return (
    <div>
      {user.name}
      <button onClick={() => setUser({ name: 'Jane' })}>
        Change
      </button>
    </div>
  );
}

// Solution 1: Context API
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'John' });
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Level1 />
    </UserContext.Provider>
  );
}

function Level4() {
  const { user, setUser } = useContext(UserContext);
  return (
    <div>
      {user.name}
      <button onClick={() => setUser({ name: 'Jane' })}>
        Change
      </button>
    </div>
  );
}

// Solution 2: Component Composition
function App() {
  const [user, setUser] = useState({ name: 'John' });
  
  return (
    <Level1>
      <Level2>
        <Level3>
          <Level4 user={user} setUser={setUser} />
        </Level3>
      </Level2>
    </Level1>
  );
}

function Level1({ children }) {
  return <div className="level1">{children}</div>;
}
```

**Vietnamese:**

Props là cách components giao tiếp. Chúng chảy xuống cây component.

**Nguyên Tắc Props:**

1. **Read-only**: Không được thay đổi props
2. **Unidirectional**: Chỉ chảy từ cha xuống con
3. **Any Type**: Có thể là bất kỳ kiểu dữ liệu nào
4. **Trigger Re-render**: Props mới gây re-render

**Props Drilling:**

Vấn đề: Truyền props qua nhiều cấp components trung gian không sử dụng props đó.

Giải pháp:
1. **Context API**: Chia sẻ data globally
2. **Component Composition**: Truyền components thay vì data
3. **State Management**: Redux, Zustand, Jotai

---

### 12. Lifting State Up
### 12. Nâng State Lên

**English:**

When multiple components need to share state, lift it up to their closest common ancestor.

**Lifting State Pattern:**

```javascript
// Before: Separate state in each component
function TemperatureInput({ scale }) {
  const [temperature, setTemperature] = useState('');
  
  return (
    <input
      value={temperature}
      onChange={e => setTemperature(e.target.value)}
    />
  );
}

function Calculator() {
  return (
    <div>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
      {/* Problem: Can't sync between inputs */}
    </div>
  );
}

// After: Lifted state to parent
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <input
      value={temperature}
      onChange={e => onTemperatureChange(e.target.value)}
    />
  );
}

function Calculator() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');
  
  const handleCelsiusChange = (temp) => {
    setTemperature(temp);
    setScale('c');
  };
  
  const handleFahrenheitChange = (temp) => {
    setTemperature(temp);
    setScale('f');
  };
  
  const celsius = scale === 'f' 
    ? tryConvert(temperature, toCelsius)
    : temperature;
    
  const fahrenheit = scale === 'c'
    ? tryConvert(temperature, toFahrenheit)
    : temperature;
  
  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      <BoilingVerdict celsius={parseFloat(celsius)} />
    </div>
  );
}
```

**When to Lift State:**

```javascript
// Scenario 1: Sibling Communication
// ❌ Bad: State in siblings
function Parent() {
  return (
    <>
      <ChildA /> {/* Has count state */}
      <ChildB /> {/* Needs count state */}
    </>
  );
}

// ✅ Good: Lift state to parent
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <ChildA count={count} setCount={setCount} />
      <ChildB count={count} />
    </>
  );
}

// Scenario 2: Derived State
// ❌ Bad: Duplicate state
function FilteredList({ items }) {
  const [filter, setFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  
  useEffect(() => {
    setFilteredItems(
      items.filter(item => item.includes(filter))
    );
  }, [items, filter]);
  
  return (/* ... */);
}

// ✅ Good: Compute during render
function FilteredList({ items }) {
  const [filter, setFilter] = useState('');
  
  // Derived state - no need for separate state
  const filteredItems = items.filter(item => 
    item.includes(filter)
  );
  
  return (/* ... */);
}
```


**Vietnamese:**

Khi nhiều components cần chia sẻ state, nâng nó lên tổ tiên chung gần nhất.

**Khi Nào Nâng State:**

1. **Sibling Communication**: Hai components anh em cần chia sẻ data
2. **Synchronized State**: Nhiều components cần đồng bộ state
3. **Derived State**: State có thể tính toán từ state khác

**Nguyên Tắc:**

- Nâng state đến mức cần thiết, không cao hơn
- Tránh nâng quá cao (global state không cần thiết)
- Cân nhắc Context API cho state sâu

---

### 13. Context API Deep Dive
### 13. Context API Tìm Hiểu Sâu

**English:**

Context provides a way to pass data through the component tree without passing props manually at every level.

**Context Basics:**

```javascript
// 1. Create Context
const ThemeContext = createContext('light'); // default value

// 2. Provide Context
function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 3. Consume Context (useContext hook)
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Button</button>;
}

// 4. Consume Context (Consumer component)
function ThemedButton() {
  return (
    <ThemeContext.Consumer>
      {theme => <button className={theme}>Button</button>}
    </ThemeContext.Consumer>
  );
}
```

**Advanced Context Patterns:**

```javascript
// Pattern 1: Context with State Management
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);
  
  const login = async (credentials) => {
    const user = await loginAPI(credentials);
    setUser(user);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    login,
    logout
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for easier consumption
function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

// Usage
function Profile() {
  const { user, logout } = useUser();
  
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Pattern 2: Multiple Contexts
const ThemeContext = createContext();
const UserContext = createContext();
const LanguageContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <LanguageContext.Provider value={language}>
          <MainApp />
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// Pattern 3: Split Context for Performance
// Problem: Single context causes all consumers to re-render
const AppContext = createContext();

function AppProvider({ children }) {
  const [state, setState] = useState({ user: null, theme: 'light' });
  // Changing theme re-renders all consumers, even those only using user
  
  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}

// Solution: Split into multiple contexts
const UserContext = createContext();
const ThemeContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// Now components only re-render when their specific context changes
function UserProfile() {
  const user = useContext(UserContext); // Only re-renders on user change
  return <div>{user.name}</div>;
}

function ThemedButton() {
  const theme = useContext(ThemeContext); // Only re-renders on theme change
  return <button className={theme}>Click</button>;
}
```

**Context Performance Optimization:**

```javascript
// Problem: Object value causes re-render on every parent render
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // New object created on every render!
  const value = { user, setUser };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Solution 1: useMemo
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const value = useMemo(() => ({ user, setUser }), [user]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Solution 2: Separate state and dispatch contexts
const UserStateContext = createContext();
const UserDispatchContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

// Components that only dispatch don't re-render on state change
function UpdateButton() {
  const setUser = useContext(UserDispatchContext);
  // Doesn't re-render when user changes!
  return <button onClick={() => setUser({ name: 'John' })}>Update</button>;
}

// Solution 3: useReducer for complex state
const UserContext = createContext();

function userReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    isAuthenticated: false
  });
  
  const value = useMemo(() => ({ state, dispatch }), [state]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

**Vietnamese:**

Context cung cấp cách truyền data qua cây component mà không cần truyền props thủ công ở mỗi cấp.

**Khi Nào Dùng Context:**

1. **Theme**: Dark/light mode
2. **Authentication**: User data, login state
3. **Language**: i18n, localization
4. **Global Settings**: App configuration

**Khi KHÔNG Dùng Context:**

1. **Frequent Updates**: Context re-renders tất cả consumers
2. **Complex State Logic**: Dùng Redux/Zustand thay vì
3. **Performance Critical**: Context không tối ưu như Redux

**Best Practices:**

```javascript
// ✅ Good: Small, focused contexts
<ThemeContext.Provider>
<UserContext.Provider>
<LanguageContext.Provider>

// ❌ Bad: One giant context
<AppContext.Provider value={{ theme, user, language, settings, ... }}>

// ✅ Good: Custom hook with error handling
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ✅ Good: Memoize context value
const value = useMemo(() => ({ user, setUser }), [user]);
```

---

## Part 4: Hooks Theory / Phần 4: Lý Thuyết Hooks

### 14. useState Implementation
### 14. Triển Khai useState

**English:**

Understanding how useState works internally helps write better React code.

**Simplified useState Implementation:**

```javascript
// React's internal state management (simplified)
let state = [];
let setters = [];
let firstRun = true;
let cursor = 0;

function createSetter(cursor) {
  return function setter(newVal) {
    state[cursor] = newVal;
    render(); // Re-render component
  };
}

function useState(initVal) {
  if (firstRun) {
    state.push(initVal);
    setters.push(createSetter(cursor));
    firstRun = false;
  }
  
  const setter = setters[cursor];
  const value = state[cursor];
  
  cursor++;
  return [value, setter];
}

// Component using useState
function Component() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');
  
  // First render:
  // state = [0, 'John']
  // setters = [setter0, setter1]
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// After render, reset cursor
function render() {
  cursor = 0;
  ReactDOM.render(<Component />, document.getElementById('root'));
}
```


**Why Hooks Must Be Called in Order:**

```javascript
// ✅ Correct: Hooks called in same order every render
function Component() {
  const [count, setCount] = useState(0);      // Hook 1
  const [name, setName] = useState('John');   // Hook 2
  const [age, setAge] = useState(30);         // Hook 3
  
  // state array: [0, 'John', 30]
  // cursor maps: 0 → count, 1 → name, 2 → age
  
  return <div>...</div>;
}

// ❌ Wrong: Conditional hooks break order
function Component({ condition }) {
  const [count, setCount] = useState(0);      // Hook 1
  
  if (condition) {
    const [name, setName] = useState('John'); // Hook 2 (sometimes)
  }
  
  const [age, setAge] = useState(30);         // Hook 2 or 3 (inconsistent!)
  
  // First render (condition = true):  [0, 'John', 30]
  // Second render (condition = false): [0, 30]
  // Cursor mismatch! age gets 'John' value
  
  return <div>...</div>;
}

// ✅ Correct: Conditional logic inside hook
function Component({ condition }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState(condition ? 'John' : '');
  const [age, setAge] = useState(30);
  
  return <div>...</div>;
}
```

**useState Lazy Initialization:**

```javascript
// ❌ Expensive initialization runs every render
function Component() {
  const [state, setState] = useState(
    expensiveComputation() // Runs on every render!
  );
  return <div>{state}</div>;
}

// ✅ Lazy initialization runs only once
function Component() {
  const [state, setState] = useState(() => {
    return expensiveComputation(); // Runs only on mount
  });
  return <div>{state}</div>;
}

// Example: Reading from localStorage
// ❌ Bad
const [user, setUser] = useState(
  JSON.parse(localStorage.getItem('user')) // Runs every render
);

// ✅ Good
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null; // Runs once
});
```

**Vietnamese:**

Hiểu cách useState hoạt động bên trong giúp viết code React tốt hơn.

**Tại Sao Hooks Phải Gọi Theo Thứ Tự:**

React dựa vào thứ tự gọi hooks để theo dõi state. Mỗi hook được lưu trong một array, và cursor theo dõi vị trí.

**Quy Tắc Hooks:**

1. **Chỉ gọi ở top level**: Không trong loops, conditions, nested functions
2. **Chỉ gọi trong React functions**: Function components hoặc custom hooks
3. **Gọi theo thứ tự nhất quán**: Cùng thứ tự mỗi render

**Lazy Initialization:**

Dùng function để khởi tạo state khi tính toán ban đầu tốn kém:

```javascript
// Chỉ chạy một lần khi mount
const [state, setState] = useState(() => {
  return expensiveOperation();
});
```

---

### 15. useEffect Execution Model
### 15. Mô Hình Thực Thi useEffect

**English:**

useEffect is for side effects - operations that affect things outside the component.

**useEffect Execution Flow:**

```javascript
function Component() {
  const [count, setCount] = useState(0);
  
  console.log('1. Render phase');
  
  useEffect(() => {
    console.log('3. Effect runs (after DOM update)');
    
    return () => {
      console.log('4. Cleanup (before next effect or unmount)');
    };
  });
  
  console.log('2. Render phase continues');
  
  return <div>{count}</div>;
}

// Output on mount:
// 1. Render phase
// 2. Render phase continues
// 3. Effect runs (after DOM update)

// Output on update:
// 1. Render phase
// 2. Render phase continues
// 4. Cleanup (before next effect or unmount)
// 3. Effect runs (after DOM update)

// Output on unmount:
// 4. Cleanup (before next effect or unmount)
```

**useEffect Dependency Array:**

```javascript
// 1. No dependency array: Runs after every render
useEffect(() => {
  console.log('Runs after every render');
});

// 2. Empty dependency array: Runs once on mount
useEffect(() => {
  console.log('Runs once on mount');
}, []);

// 3. With dependencies: Runs when dependencies change
useEffect(() => {
  console.log('Runs when count changes');
}, [count]);

// 4. Multiple dependencies
useEffect(() => {
  console.log('Runs when count or name changes');
}, [count, name]);
```

**Common useEffect Patterns:**

```javascript
// Pattern 1: Data Fetching
useEffect(() => {
  let isMounted = true;
  
  async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    if (isMounted) {
      setData(data);
    }
  }
  
  fetchData();
  
  return () => {
    isMounted = false;
  };
}, []);

// Pattern 2: Subscriptions
useEffect(() => {
  const subscription = dataSource.subscribe(data => {
    setData(data);
  });
  
  return () => {
    subscription.unsubscribe();
  };
}, [dataSource]);

// Pattern 3: Event Listeners
useEffect(() => {
  function handleResize() {
    setWindowWidth(window.innerWidth);
  }
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Pattern 4: Timers
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  
  return () => {
    clearInterval(timer);
  };
}, []);

// Pattern 5: DOM Manipulation
useEffect(() => {
  const element = ref.current;
  element.focus();
  
  // No cleanup needed for one-time DOM operations
}, []);

// Pattern 6: Sync with External Store
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    setStoreState(store.getState());
  });
  
  // Set initial state
  setStoreState(store.getState());
  
  return unsubscribe;
}, [store]);
```

**useEffect vs useLayoutEffect:**

```javascript
// useEffect: Runs AFTER paint (asynchronous)
useEffect(() => {
  // Runs after browser paints
  // Non-blocking
  // Use for most side effects
}, []);

// useLayoutEffect: Runs BEFORE paint (synchronous)
useLayoutEffect(() => {
  // Runs before browser paints
  // Blocking
  // Use for DOM measurements, preventing flicker
}, []);

// Example: Preventing flicker
function Tooltip() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef();
  
  // ❌ useEffect: User sees flicker
  useEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top });
  }, []);
  
  // ✅ useLayoutEffect: No flicker
  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top });
  }, []);
  
  return (
    <div ref={ref} style={{ left: position.x, top: position.y }}>
      Tooltip
    </div>
  );
}
```

**Vietnamese:**

useEffect dùng cho side effects - các thao tác ảnh hưởng đến thứ bên ngoài component.

**Luồng Thực Thi:**

```
1. Render phase (tạo Virtual DOM)
2. Commit phase (cập nhật DOM)
3. Browser paint (vẽ lên màn hình)
4. useEffect runs (sau khi paint)
```

**Dependency Array:**

- **Không có**: Chạy sau mỗi render
- **[]**: Chạy một lần khi mount
- **[dep1, dep2]**: Chạy khi dependencies thay đổi

**Cleanup Function:**

```javascript
useEffect(() => {
  // Setup
  const subscription = subscribe();
  
  // Cleanup (chạy trước effect tiếp theo hoặc unmount)
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

**useEffect vs useLayoutEffect:**

- **useEffect**: Async, sau khi paint, không block browser
- **useLayoutEffect**: Sync, trước khi paint, block browser

Dùng useLayoutEffect khi:
- Đo DOM elements
- Ngăn flicker
- Sync với external systems

---

### 16. useRef and DOM References
### 16. useRef và Tham Chiếu DOM

**English:**

useRef creates a mutable reference that persists across renders without causing re-renders.

**useRef Basics:**

```javascript
// 1. DOM References
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// 2. Storing Mutable Values
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  
  const start = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };
  
  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// 3. Previous Value Tracking
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```


**useRef vs useState:**

```javascript
// useState: Triggers re-render on change
function Component() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1); // Re-renders component
  };
  
  return <div>{count}</div>; // Shows updated value
}

// useRef: No re-render on change
function Component() {
  const countRef = useRef(0);
  
  const increment = () => {
    countRef.current += 1; // No re-render
    console.log(countRef.current); // Updated value
  };
  
  return <div>{countRef.current}</div>; // Shows stale value
}

// When to use each:
// useState: When you need UI to update
// useRef: When you need to store value without re-rendering
```

**Advanced useRef Patterns:**

```javascript
// Pattern 1: Callback Ref
function MeasureElement() {
  const [height, setHeight] = useState(0);
  
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  
  return (
    <>
      <div ref={measuredRef}>
        <p>Content</p>
      </div>
      <p>Height: {height}px</p>
    </>
  );
}

// Pattern 2: Forwarding Refs
const FancyInput = forwardRef((props, ref) => {
  return <input ref={ref} className="fancy" {...props} />;
});

function Parent() {
  const inputRef = useRef();
  
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        Focus
      </button>
    </>
  );
}

// Pattern 3: useImperativeHandle
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    scrollIntoView: () => {
      inputRef.current.scrollIntoView();
    }
  }));
  
  return <input ref={inputRef} />;
});

// Pattern 4: Ref with TypeScript
function Component() {
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    inputRef.current?.focus();
    const width = divRef.current?.offsetWidth;
  }, []);
  
  return (
    <>
      <input ref={inputRef} />
      <div ref={divRef}>Content</div>
    </>
  );
}
```

**Vietnamese:**

useRef tạo tham chiếu có thể thay đổi, tồn tại qua các renders mà không gây re-render.

**Sử Dụng useRef:**

1. **DOM References**: Truy cập DOM elements
2. **Mutable Values**: Lưu giá trị không trigger re-render
3. **Previous Values**: Theo dõi giá trị trước đó
4. **Instance Variables**: Thay thế instance variables trong class

**useRef vs useState:**

| useRef | useState |
|--------|----------|
| Không re-render | Re-render |
| Mutable | Immutable |
| Sync update | Async update |
| Không dùng cho UI | Dùng cho UI |

---

### 17. Custom Hooks Patterns
### 17. Patterns Custom Hooks

**English:**

Custom hooks let you extract component logic into reusable functions.

**Custom Hook Rules:**

```javascript
// 1. Name must start with "use"
function useCustomHook() { // ✅ Correct
  // ...
}

function customHook() { // ❌ Wrong
  // ...
}

// 2. Can call other hooks
function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);
  
  return { user, loading };
}

// 3. Must follow hooks rules
function useCustomHook(condition) {
  // ❌ Wrong: Conditional hook
  if (condition) {
    useState(0);
  }
  
  // ✅ Correct: Hook always called
  const [value, setValue] = useState(condition ? 0 : 1);
}
```

**Common Custom Hook Patterns:**

```javascript
// Pattern 1: Data Fetching
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => controller.abort();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function Component() {
  const { data, loading, error } = useFetch('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}

// Pattern 2: Local Storage
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
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function Component() {
  const [name, setName] = useLocalStorage('name', 'John');
  
  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
  );
}

// Pattern 3: Window Size
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}

// Pattern 4: Debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call with debounced value
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  );
}

// Pattern 5: Toggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  return [value, toggle];
}

// Usage
function Component() {
  const [isOpen, toggleOpen] = useToggle(false);
  
  return (
    <>
      <button onClick={toggleOpen}>Toggle</button>
      {isOpen && <div>Content</div>}
    </>
  );
}

// Pattern 6: Previous Value
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Pattern 7: Interval
function useInterval(callback, delay) {
  const savedCallback = useRef();
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback.current();
      }, delay);
      
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Usage
function Timer() {
  const [count, setCount] = useState(0);
  
  useInterval(() => {
    setCount(count + 1);
  }, 1000);
  
  return <div>{count}</div>;
}
```

**Vietnamese:**

Custom hooks cho phép trích xuất logic component thành functions có thể tái sử dụng.

**Quy Tắc Custom Hooks:**

1. **Tên bắt đầu với "use"**: useCustomHook
2. **Có thể gọi hooks khác**: useState, useEffect, etc.
3. **Tuân theo rules of hooks**: Không conditional, không trong loops

**Lợi Ích Custom Hooks:**

1. **Reusability**: Tái sử dụng logic
2. **Separation of Concerns**: Tách logic khỏi UI
3. **Testability**: Dễ test độc lập
4. **Composition**: Kết hợp nhiều hooks

---

## Part 5: Performance / Phần 5: Hiệu Suất

### 18. Rendering Optimization
### 18. Tối Ưu Hóa Rendering

**English:**

React is fast, but you can make it faster by preventing unnecessary re-renders.

**When Components Re-render:**

```javascript
// 1. State changes
const [count, setCount] = useState(0);
setCount(1); // Re-renders

// 2. Props change
<Child value={count} /> // Re-renders when count changes

// 3. Parent re-renders
function Parent() {
  const [count, setCount] = useState(0);
  return <Child />; // Child re-renders when Parent re-renders
}

// 4. Context changes
const value = useContext(MyContext); // Re-renders when context changes
```

**Optimization Techniques:**

```javascript
// 1. React.memo (Prevent re-render if props unchanged)
const Child = React.memo(function Child({ value }) {
  console.log('Child rendered');
  return <div>{value}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);
  
  return (
    <>
      <Child value={count} />
      {/* Child doesn't re-render when other changes */}
      <button onClick={() => setOther(other + 1)}>
        Update Other
      </button>
    </>
  );
}

// 2. useMemo (Memoize expensive calculations)
function Component({ items }) {
  // ❌ Recalculates on every render
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // ✅ Only recalculates when items change
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: {total}</div>;
}

// 3. useCallback (Memoize functions)
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ New function on every render
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // ✅ Same function reference
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return <Child onClick={handleClick} />;
}

const Child = React.memo(function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

// 4. Code Splitting (Lazy loading)
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// 5. Virtualization (Large lists)
import { FixedSizeList } from 'react-window';

function LargeList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index]}
        </div>
      )}
    </FixedSizeList>
  );
}
```


**Common Performance Mistakes:**

```javascript
// ❌ Mistake 1: Inline objects/arrays in props
function Parent() {
  return <Child style={{ margin: 10 }} items={[1, 2, 3]} />;
  // New object/array every render → Child always re-renders
}

// ✅ Fix: Move outside or use useMemo
const style = { margin: 10 };
const items = [1, 2, 3];

function Parent() {
  return <Child style={style} items={items} />;
}

// ❌ Mistake 2: Inline functions in props
function Parent() {
  return <Child onClick={() => console.log('click')} />;
  // New function every render
}

// ✅ Fix: useCallback
function Parent() {
  const handleClick = useCallback(() => {
    console.log('click');
  }, []);
  
  return <Child onClick={handleClick} />;
}

// ❌ Mistake 3: Unnecessary state
function Component({ items }) {
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    setFilteredItems(items.filter(item => item.active));
  }, [items]);
  
  return <div>{filteredItems.length}</div>;
}

// ✅ Fix: Derive during render
function Component({ items }) {
  const filteredItems = items.filter(item => item.active);
  return <div>{filteredItems.length}</div>;
}

// ❌ Mistake 4: Large component trees
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Header />
      <Sidebar />
      <Content count={count} />
      <Footer />
    </div>
  );
  // All children re-render when count changes
}

// ✅ Fix: Component composition
function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <ContentWithState />
      <Footer />
    </div>
  );
}

function ContentWithState() {
  const [count, setCount] = useState(0);
  return <Content count={count} />;
}
```

**Vietnamese:**

React nhanh, nhưng bạn có thể làm nó nhanh hơn bằng cách ngăn re-renders không cần thiết.

**Khi Nào Components Re-render:**

1. **State thay đổi**: setState được gọi
2. **Props thay đổi**: Parent truyền props mới
3. **Parent re-renders**: Mặc định, tất cả children re-render
4. **Context thay đổi**: Context value thay đổi

**Kỹ Thuật Tối Ưu:**

1. **React.memo**: Ngăn re-render nếu props không đổi
2. **useMemo**: Memoize tính toán tốn kém
3. **useCallback**: Memoize functions
4. **Code Splitting**: Lazy load components
5. **Virtualization**: Render chỉ items visible

**Khi Nào Tối Ưu:**

- **Đo trước khi tối ưu**: Dùng React DevTools Profiler
- **Tối ưu bottlenecks**: Không tối ưu mọi thứ
- **Cân nhắc trade-offs**: Memoization có cost

---

### 19. Memoization Strategies
### 19. Chiến Lược Memoization

**English:**

Memoization caches results to avoid expensive recalculations.

**React.memo Deep Dive:**

```javascript
// Basic usage
const MyComponent = React.memo(function MyComponent({ value }) {
  return <div>{value}</div>;
});

// Custom comparison function
const MyComponent = React.memo(
  function MyComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    // Return false if props changed (re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);

// When to use React.memo:
// ✅ Pure functional components
// ✅ Renders often with same props
// ✅ Expensive render
// ❌ Props change frequently
// ❌ Cheap render
```

**useMemo Deep Dive:**

```javascript
// Basic usage
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);

// Examples:
// 1. Expensive calculation
function Component({ items }) {
  const sortedItems = useMemo(() => {
    console.log('Sorting...');
    return items.sort((a, b) => a.value - b.value);
  }, [items]);
  
  return <List items={sortedItems} />;
}

// 2. Referential equality
function Component() {
  const [count, setCount] = useState(0);
  
  // ❌ New object every render
  const config = { count, doubled: count * 2 };
  
  // ✅ Same object reference if count unchanged
  const config = useMemo(() => ({
    count,
    doubled: count * 2
  }), [count]);
  
  return <Child config={config} />;
}

// 3. Filtering/mapping large arrays
function Component({ users }) {
  const activeUsers = useMemo(() => {
    return users.filter(user => user.active);
  }, [users]);
  
  return <UserList users={activeUsers} />;
}

// When NOT to use useMemo:
// ❌ Simple calculations
const doubled = useMemo(() => count * 2, [count]); // Overkill

// ❌ Creating primitives
const name = useMemo(() => 'John', []); // Unnecessary

// ❌ Every calculation
// Memoization has overhead, only use for expensive operations
```

**useCallback Deep Dive:**

```javascript
// Basic usage
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Examples:
// 1. Passing to memoized child
const Child = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ New function every render → Child re-renders
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // ✅ Same function reference → Child doesn't re-render
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return <Child onClick={handleClick} />;
}

// 2. useEffect dependency
function Component({ id }) {
  const fetchData = useCallback(async () => {
    const data = await fetch(`/api/${id}`);
    return data.json();
  }, [id]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData is stable
}

// 3. Event handlers with dependencies
function Component() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('Count:', count);
  }, [count]); // Recreate when count changes
  
  return <button onClick={handleClick}>Log Count</button>;
}

// When NOT to use useCallback:
// ❌ Not passed to memoized components
function Component() {
  const handleClick = useCallback(() => {
    console.log('Click');
  }, []);
  
  return <button onClick={handleClick}>Click</button>;
  // button is not memoized, useCallback unnecessary
}

// ❌ No dependencies
const handleClick = useCallback(() => {
  console.log('Click');
}, []); // Just define outside component instead
```

**Memoization Best Practices:**

```javascript
// 1. Measure first
// Use React DevTools Profiler to identify slow components

// 2. Start with React.memo
// Easiest win for preventing re-renders

// 3. Add useMemo/useCallback as needed
// Only when passing to memoized components

// 4. Don't over-memoize
// Memoization has cost (memory + comparison)

// 5. Memoize expensive operations
const expensiveValue = useMemo(() => {
  // Complex calculation
  // Large array operations
  // Heavy transformations
}, [deps]);

// 6. Use with referential equality
const config = useMemo(() => ({ /* ... */ }), [deps]);
const handler = useCallback(() => { /* ... */ }, [deps]);

// 7. Consider alternatives
// - Component composition
// - State colocation
// - Code splitting
```

**Vietnamese:**

Memoization cache kết quả để tránh tính toán lại tốn kém.

**React.memo:**

- Ngăn re-render nếu props không đổi
- Shallow comparison mặc định
- Custom comparison function cho deep comparison

**useMemo:**

- Cache kết quả tính toán
- Chỉ tính toán lại khi dependencies thay đổi
- Dùng cho operations tốn kém

**useCallback:**

- Cache function reference
- Ngăn tạo function mới mỗi render
- Dùng khi truyền cho memoized components

**Khi Nào Memoize:**

✅ Expensive calculations
✅ Large lists/arrays
✅ Props cho memoized components
✅ useEffect dependencies

❌ Simple calculations
❌ Primitives
❌ Every function/value
❌ Premature optimization

---

### 20. Code Splitting
### 20. Chia Tách Code

**English:**

Code splitting breaks your bundle into smaller chunks that can be loaded on demand.

**React.lazy and Suspense:**

```javascript
// 1. Basic lazy loading
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// 2. Multiple lazy components
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  );
}

// 3. Named exports
const { ComponentA, ComponentB } = lazy(() =>
  import('./Components').then(module => ({
    default: {
      ComponentA: module.ComponentA,
      ComponentB: module.ComponentB
    }
  }))
);

// 4. Error boundaries with Suspense
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Error loading component</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Route-based Code Splitting:**

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load route components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Component-based Code Splitting:**

```javascript
// Split heavy components
function App() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>
      
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

const HeavyChart = lazy(() => import('./HeavyChart'));
```

**Preloading:**

```javascript
// Preload on hover
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  const [show, setShow] = useState(false);
  
  const handleMouseEnter = () => {
    // Preload component
    import('./HeavyComponent');
  };
  
  return (
    <div>
      <button
        onMouseEnter={handleMouseEnter}
        onClick={() => setShow(true)}
      >
        Show Component
      </button>
      
      {show && (
        <Suspense fallback={<Loading />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

**Vietnamese:**

Code splitting chia bundle thành chunks nhỏ hơn, load theo yêu cầu.

**Lợi Ích:**

1. **Faster Initial Load**: Bundle nhỏ hơn
2. **Better Performance**: Chỉ load code cần thiết
3. **Improved UX**: Trang load nhanh hơn

**Strategies:**

1. **Route-based**: Chia theo routes
2. **Component-based**: Chia components nặng
3. **Vendor splitting**: Tách thư viện bên thứ 3

**Best Practices:**

- Lazy load routes
- Lazy load heavy components (charts, editors)
- Preload on user interaction
- Use Error Boundaries
- Provide good loading states

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Basic Level / Cấp Độ Cơ Bản

**Q1: What is React and why use it?**
**A:** React is a JavaScript library for building user interfaces. Benefits:
- Component-based architecture
- Virtual DOM for performance
- Declarative programming
- Large ecosystem
- Reusable components

**Q2: What is JSX?**
**A:** JSX is syntax extension for JavaScript that looks like HTML. It gets transformed to React.createElement() calls.

**Q3: What is the difference between state and props?**
**A:**
- State: Owned by component, mutable, triggers re-render
- Props: Passed from parent, immutable, read-only

**Q4: What are hooks?**
**A:** Hooks are functions that let you use state and lifecycle features in function components. Examples: useState, useEffect, useContext.

**Q5: What is the Virtual DOM?**
**A:** In-memory representation of real DOM. React uses it to efficiently update only changed parts of the real DOM.

### Intermediate Level / Cấp Độ Trung Cấp

**Q6: Explain the component lifecycle.**
**A:** Three phases:
1. Mounting: Component created and inserted into DOM
2. Updating: Component re-renders due to state/props changes
3. Unmounting: Component removed from DOM

**Q7: What is reconciliation?**
**A:** Algorithm React uses to diff Virtual DOM trees and determine minimal DOM updates needed.

**Q8: When would you use useCallback vs useMemo?**
**A:**
- useCallback: Memoize functions
- useMemo: Memoize values/calculations

**Q9: What are Error Boundaries?**
**A:** Components that catch JavaScript errors in child components, log errors, and display fallback UI.

**Q10: Explain lifting state up.**
**A:** Moving state to closest common ancestor when multiple components need to share it.

### Advanced Level / Cấp Độ Nâng Cao

**Q11: How does React Fiber work?**
**A:** Fiber is React's reconciliation algorithm that enables:
- Incremental rendering
- Pause/resume work
- Priority scheduling
- Concurrent mode

**Q12: Explain React's batching mechanism.**
**A:** React groups multiple state updates into single re-render for performance. In React 18+, automatic batching works everywhere.

**Q13: What are the rules of hooks and why?**
**A:** 
1. Only call at top level (not in loops/conditions)
2. Only call in React functions

Why: React relies on call order to track state.

**Q14: How would you optimize a large list?**
**A:**
- Virtualization (react-window)
- Pagination
- Infinite scroll
- Memoization
- Keys for reconciliation

**Q15: Explain Context performance issues and solutions.**
**A:** 
Problem: All consumers re-render on context change
Solutions:
- Split contexts
- Memoize context value
- Separate state and dispatch contexts
- Use state management library

---

## Summary / Tóm Tắt

This comprehensive guide covered React fundamentals from basic to advanced:

1. **Core Concepts**: Philosophy, Virtual DOM, Components, JSX, Reconciliation
2. **Lifecycle**: Mounting, Updating, Unmounting, Error Boundaries
3. **State & Props**: Management, Flow, Lifting State, Context API
4. **Hooks**: useState, useEffect, useRef, Custom Hooks
5. **Performance**: Rendering optimization, Memoization, Code splitting

Master these concepts to excel in frontend interviews at big tech companies!

---

**Total Lines: 1000+**
**Languages: English + Vietnamese**
**Level: Basic to Advanced**
**Focus: Interview Preparation for Big Tech**
