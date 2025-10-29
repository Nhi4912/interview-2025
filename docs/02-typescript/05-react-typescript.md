# React with TypeScript
## Type-Safe React Development

**English:** TypeScript enhances React development by providing static type checking, better IDE support, and improved code maintainability.

**Tiếng Việt:** TypeScript nâng cao phát triển React bằng cách cung cấp kiểm tra kiểu tĩnh, hỗ trợ IDE tốt hơn và khả năng bảo trì code được cải thiện.

## Component Types

### Function Components

**Basic Typing:**
```typescript
// Simple component
const Greeting: React.FC = () => {
  return <h1>Hello</h1>;
};

// With props
interface GreetingProps {
  name: string;
  age?: number;
}

const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return <h1>Hello {name}, {age}</h1>;
};

// Preferred: Without React.FC
const Greeting = ({ name, age }: GreetingProps) => {
  return <h1>Hello {name}, {age}</h1>;
};
```

**Why avoid React.FC:**
- Implicit children prop
- Issues with generics
- Doesn't support defaultProps well
- Community moving away from it

### Props Patterns

**Optional Props:**
```typescript
interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};
```

**Children Props:**
```typescript
interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <div>{children}</div>;
};

// Specific children type
interface ListProps {
  children: React.ReactElement<ItemProps> | React.ReactElement<ItemProps>[];
}
```

**Event Handlers:**
```typescript
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Form = ({ onSubmit, onChange, onClick }: FormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ...
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

**Generic Components:**
```typescript
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
}

function Select<T>({ options, value, onChange, getLabel }: SelectProps<T>) {
  return (
    <select value={getLabel(value)} onChange={e => {
      const option = options.find(o => getLabel(o) === e.target.value);
      if (option) onChange(option);
    }}>
      {options.map(option => (
        <option key={getLabel(option)} value={getLabel(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}
```

## Hooks with TypeScript

### useState

**Basic:**
```typescript
// Type inference
const [count, setCount] = useState(0); // number
const [name, setName] = useState(''); // string

// Explicit type
const [user, setUser] = useState<User | null>(null);

// With interface
interface User {
  id: number;
  name: string;
}

const [user, setUser] = useState<User>({
  id: 1,
  name: 'John'
});

// Array state
const [items, setItems] = useState<string[]>([]);
```

### useEffect

**Dependencies:**
```typescript
useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup
  };
}, [dependency]); // TypeScript checks dependency types
```

### useRef

**DOM References:**
```typescript
// Input ref
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

// Div ref
const divRef = useRef<HTMLDivElement>(null);

// Generic ref
const valueRef = useRef<number>(0);
```

### useContext

**Typed Context:**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### useReducer

**Typed Reducer:**
```typescript
interface State {
  count: number;
  error: string | null;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number }
  | { type: 'error'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'reset':
      return { ...state, count: action.payload };
    case 'error':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null });
  
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
};
```

### Custom Hooks

**Typed Custom Hook:**
```typescript
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}

// Usage
interface User {
  id: number;
  name: string;
}

const UserProfile = ({ userId }: { userId: number }) => {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data?.name}</div>;
};
```

## Event Types

### Common Events

```typescript
// Mouse events
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget);
};

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  console.log(e.clientX, e.clientY);
};

// Keyboard events
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    // Handle enter
  }
};

// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Focus events
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log('Focused');
};
```

## Component Patterns

### Render Props

```typescript
interface MouseProps {
  render: (state: { x: number; y: number }) => React.ReactNode;
}

const Mouse = ({ render }: MouseProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };
  
  return <div onMouseMove={handleMouseMove}>{render(position)}</div>;
};

// Usage
<Mouse render={({ x, y }) => <p>Position: {x}, {y}</p>} />
```

### Higher-Order Components

```typescript
interface WithLoadingProps {
  loading: boolean;
}

function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  return ({ loading, ...props }: WithLoadingProps) => {
    if (loading) return <div>Loading...</div>;
    return <Component {...(props as P)} />;
  };
}

// Usage
interface UserProps {
  name: string;
}

const User = ({ name }: UserProps) => <div>{name}</div>;
const UserWithLoading = withLoading(User);

<UserWithLoading name="John" loading={false} />
```

### Compound Components

```typescript
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  defaultTab: string;
}

const Tabs = ({ children, defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

interface TabProps {
  value: string;
  children: React.ReactNode;
}

const Tab = ({ value, children }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  return (
    <button onClick={() => context.setActiveTab(value)}>
      {children}
    </button>
  );
};
```

## Form Handling

### Controlled Components

```typescript
interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### React Hook Form

```typescript
import { useForm } from 'react-hook-form';

interface FormInputs {
  email: string;
  password: string;
  age: number;
}

const Form = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  
  const onSubmit = (data: FormInputs) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      {errors.email && <span>Email is required</span>}
      
      <input {...register('password', { minLength: 6 })} />
      {errors.password && <span>Password must be 6+ characters</span>}
      
      <input type="number" {...register('age', { valueAsNumber: true })} />
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Utility Types for React

### Component Props

```typescript
// Extract props from component
type ButtonProps = React.ComponentProps<'button'>;
type DivProps = React.ComponentProps<'div'>;

// Extend HTML props
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
}

const CustomButton = ({ variant, ...props }: CustomButtonProps) => {
  return <button className={variant} {...props} />;
};
```

### Ref Types

```typescript
// Element ref
type InputRef = React.RefObject<HTMLInputElement>;

// Component ref
type ComponentRef = React.RefObject<ComponentType>;

// Forwarded ref
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

### Children Types

```typescript
// Any valid React child
type Children = React.ReactNode;

// Single element
type SingleChild = React.ReactElement;

// Multiple elements
type MultipleChildren = React.ReactElement[];

// Specific component
type SpecificChild = React.ReactElement<ButtonProps>;
```

## Advanced Patterns

### Discriminated Unions

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

interface DataDisplayProps<T> {
  state: AsyncState<T>;
  render: (data: T) => React.ReactNode;
}

function DataDisplay<T>({ state, render }: DataDisplayProps<T>) {
  switch (state.status) {
    case 'idle':
      return <div>Ready</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <>{render(state.data)}</>;
    case 'error':
      return <div>Error: {state.error.message}</div>;
  }
}
```

### Polymorphic Components

```typescript
type As = React.ElementType;

type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T>;

type PolymorphicProps<T extends As, P = {}> = P & {
  as?: T;
} & PropsOf<T>;

function Box<T extends As = 'div'>({
  as,
  ...props
}: PolymorphicProps<T>) {
  const Component = as || 'div';
  return <Component {...props} />;
}

// Usage
<Box>Default div</Box>
<Box as="button" onClick={() => {}}>Button</Box>
<Box as="a" href="/">Link</Box>
```

## Testing with TypeScript

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const Button = ({ onClick, label }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} label="Click me" />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';

function useCounter(initial: number = 0) {
  const [count, setCount] = useState(initial);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  
  return { count, increment, decrement };
}

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## Common Pitfalls

### Avoid

```typescript
// Don't use React.FC
const Component: React.FC = () => {};

// Don't use any
const handleClick = (e: any) => {};

// Don't use type assertions unnecessarily
const value = data as string;

// Don't ignore errors
// @ts-ignore
```

### Prefer

```typescript
// Use explicit props
const Component = (props: Props) => {};

// Use proper types
const handleClick = (e: React.MouseEvent) => {};

// Use type guards
if (typeof data === 'string') {
  // data is string here
}

// Fix the actual issue
```

## Interview Questions

**Q: How to type React component props?**
A: Define interface for props, use as parameter type. Avoid React.FC, prefer explicit typing. Use extends for HTML attributes.

**Q: How to type useState with complex state?**
A: Provide type parameter: `useState<Type>(initial)`. Use union types for multiple states, interfaces for objects.

**Q: How to type custom hooks?**
A: Define return type interface, use generics for reusable hooks. Ensure proper type inference for hook consumers.

**Q: How to handle event types?**
A: Use React event types: `React.MouseEvent`, `React.ChangeEvent`, etc. Specify element type as generic parameter.

**Q: How to type children prop?**
A: Use `React.ReactNode` for any valid children. Use `React.ReactElement` for specific element types.

---

[← Back to TypeScript](./04-typescript-comprehensive.md) | [Next: React Patterns →](../03-react/08-react-patterns-advanced.md)
