# State Management at Scale

> Quản lý state trong ứng dụng lớn là thách thức quan trọng nhất của frontend architecture.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LANDSCAPE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   STATE TYPES:                                                  │
│   ────────────                                                   │
│                                                                   │
│   UI State         ──▶ Modal open, tabs, form values            │
│   Server State     ──▶ API data, cached responses               │
│   URL State        ──▶ Current route, query params              │
│   Form State       ──▶ Input values, validation                 │
│   Session State    ──▶ Auth, user preferences                   │
│                                                                   │
│   KEY INSIGHT:                                                  │
│   ────────────                                                   │
│   Don't put ALL state in one place!                             │
│   Use the right tool for each state type                        │
│                                                                   │
│   UI State        ──▶ useState, useReducer                      │
│   Server State    ──▶ React Query, SWR, Apollo                  │
│   URL State       ──▶ React Router, Next.js                     │
│   Form State      ──▶ React Hook Form, Formik                   │
│   Global State    ──▶ Zustand, Redux, Jotai                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Local vs Global State

### When to Use Local State

```tsx
// Local state - component-specific
function SearchInput() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    return (
        <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={isFocused ? 'focused' : ''}
        />
    );
}

// When to use local state:
// - UI state (focus, hover, open/closed)
// - Form inputs before submission
// - Temporary data not needed elsewhere
// - Component-specific calculations
```

### When to Lift State Up

```tsx
// State lifted to common ancestor
function ProductPage() {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    return (
        <div>
            <SizeSelector
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
            />
            <AddToCartButton
                disabled={!selectedSize}
                size={selectedSize}
            />
            <SizeGuide
                highlightedSize={selectedSize}
            />
        </div>
    );
}

// When to lift state:
// - Multiple components need same data
// - Parent needs to coordinate children
// - State affects sibling components
```

### When to Use Global State

```
┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL STATE CRITERIA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   USE GLOBAL STATE WHEN:                                        │
│   ───────────────────────                                        │
│                                                                   │
│   1. Data accessed across many components                       │
│      • User authentication                                      │
│      • Shopping cart                                            │
│      • Notification count                                       │
│                                                                   │
│   2. State persists across routes                               │
│      • User preferences                                         │
│      • Draft content                                            │
│                                                                   │
│   3. Many levels of prop drilling would occur                   │
│      • Theme                                                    │
│      • Locale                                                   │
│                                                                   │
│   DON'T USE GLOBAL STATE FOR:                                   │
│   ────────────────────────────                                   │
│                                                                   │
│   ✗ Server/API data (use React Query instead)                  │
│   ✗ Form state (use form library)                               │
│   ✗ URL state (use router)                                      │
│   ✗ Component UI state (keep local)                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Modern State Solutions

### Zustand

```tsx
// Zustand - simple and scalable
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

const useCartStore = create<CartStore>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],

                addItem: (item) => set((state) => {
                    const existing = state.items.find(i => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map(i =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            )
                        };
                    }
                    return {
                        items: [...state.items, { ...item, quantity: 1 }]
                    };
                }),

                removeItem: (id) => set((state) => ({
                    items: state.items.filter(i => i.id !== id)
                })),

                updateQuantity: (id, quantity) => set((state) => ({
                    items: state.items.map(i =>
                        i.id === id ? { ...i, quantity } : i
                    )
                })),

                clearCart: () => set({ items: [] }),

                total: () => {
                    return get().items.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    );
                }
            }),
            { name: 'cart-storage' }
        )
    )
);

// Usage
function CartButton() {
    const itemCount = useCartStore(state => state.items.length);
    return <button>Cart ({itemCount})</button>;
}

function CartTotal() {
    const total = useCartStore(state => state.total());
    return <span>${total.toFixed(2)}</span>;
}
```

### React Query for Server State

```tsx
// React Query - server state management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
function useProducts(category: string) {
    return useQuery({
        queryKey: ['products', category],
        queryFn: () => fetchProducts(category),
        staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
        cacheTime: 30 * 60 * 1000, // Cache for 30 minutes
    });
}

// Mutations with optimistic updates
function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: CartItem) => addToCartAPI(item),

        // Optimistic update
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });

            const previousCart = queryClient.getQueryData(['cart']);

            queryClient.setQueryData(['cart'], (old: CartItem[]) => [
                ...old,
                { ...newItem, id: 'temp-' + Date.now() }
            ]);

            return { previousCart };
        },

        // Rollback on error
        onError: (err, newItem, context) => {
            queryClient.setQueryData(['cart'], context?.previousCart);
        },

        // Refetch on success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
}

// Usage
function ProductCard({ product }) {
    const { mutate: addToCart, isLoading } = useAddToCart();

    return (
        <div>
            <h3>{product.name}</h3>
            <button
                onClick={() => addToCart(product)}
                disabled={isLoading}
            >
                {isLoading ? 'Adding...' : 'Add to Cart'}
            </button>
        </div>
    );
}
```

### Jotai for Atomic State

```tsx
// Jotai - atomic state management
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Primitive atoms
const countAtom = atom(0);
const textAtom = atom('');

// Derived atoms (computed)
const doubledCountAtom = atom((get) => get(countAtom) * 2);

// Async atoms
const userAtom = atom(async (get) => {
    const userId = get(userIdAtom);
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
});

// Writable derived atom
const uppercaseTextAtom = atom(
    (get) => get(textAtom).toUpperCase(),
    (get, set, newValue: string) => set(textAtom, newValue.toLowerCase())
);

// Persisted atom
const themeAtom = atomWithStorage('theme', 'light');

// Usage
function Counter() {
    const [count, setCount] = useAtom(countAtom);
    const doubled = useAtomValue(doubledCountAtom);

    return (
        <div>
            <p>Count: {count}</p>
            <p>Doubled: {doubled}</p>
            <button onClick={() => setCount(c => c + 1)}>+</button>
        </div>
    );
}
```

---

## 📈 Scaling Patterns

### Normalized State

```tsx
// Normalized state shape
interface NormalizedState {
    entities: {
        users: Record<string, User>;
        posts: Record<string, Post>;
        comments: Record<string, Comment>;
    };
    ids: {
        posts: string[];
        // ordered arrays of IDs
    };
}

// Benefits:
// - No duplicate data
// - Easy lookups O(1)
// - Simpler updates

// Denormalized (bad for large data)
const denormalized = {
    posts: [
        {
            id: '1',
            author: { id: 'u1', name: 'John' }, // Duplicate!
            comments: [
                {
                    id: 'c1',
                    author: { id: 'u2', name: 'Jane' }, // Duplicate!
                    text: 'Nice post'
                }
            ]
        }
    ]
};

// Normalized (good)
const normalized = {
    entities: {
        users: {
            'u1': { id: 'u1', name: 'John' },
            'u2': { id: 'u2', name: 'Jane' }
        },
        posts: {
            '1': { id: '1', authorId: 'u1', commentIds: ['c1'] }
        },
        comments: {
            'c1': { id: 'c1', authorId: 'u2', text: 'Nice post' }
        }
    },
    ids: {
        posts: ['1']
    }
};

// Selector to denormalize for display
const selectPostWithRelations = (state, postId) => {
    const post = state.entities.posts[postId];
    return {
        ...post,
        author: state.entities.users[post.authorId],
        comments: post.commentIds.map(id => ({
            ...state.entities.comments[id],
            author: state.entities.users[state.entities.comments[id].authorId]
        }))
    };
};
```

### State Slices

```tsx
// Split state into focused slices
import { create } from 'zustand';

// Auth slice
interface AuthSlice {
    user: User | null;
    token: string | null;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
}

const createAuthSlice = (set, get): AuthSlice => ({
    user: null,
    token: null,
    login: async (credentials) => {
        const { user, token } = await loginAPI(credentials);
        set({ user, token });
    },
    logout: () => set({ user: null, token: null })
});

// Cart slice
interface CartSlice {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
}

const createCartSlice = (set, get): CartSlice => ({
    items: [],
    addItem: (item) => set(state => ({
        items: [...state.items, item]
    })),
    removeItem: (id) => set(state => ({
        items: state.items.filter(i => i.id !== id)
    }))
});

// Combined store
const useStore = create<AuthSlice & CartSlice>()((...args) => ({
    ...createAuthSlice(...args),
    ...createCartSlice(...args)
}));
```

### Selector Optimization

```tsx
// Zustand selectors for performance
const useStore = create(...)

// Bad - rerender on ANY state change
function Component() {
    const state = useStore(); // Subscribes to everything
    return <div>{state.user.name}</div>;
}

// Good - only rerenders when user.name changes
function Component() {
    const name = useStore(state => state.user.name);
    return <div>{name}</div>;
}

// Even better - memoized selector
import { shallow } from 'zustand/shallow';

function Component() {
    const { name, email } = useStore(
        state => ({ name: state.user.name, email: state.user.email }),
        shallow // Compare objects shallowly
    );
    return <div>{name} - {email}</div>;
}

// Reselect for complex derived state
import { createSelector } from 'reselect';

const selectCartItems = state => state.cart.items;
const selectPrices = state => state.prices;

const selectCartTotal = createSelector(
    [selectCartItems, selectPrices],
    (items, prices) => {
        return items.reduce((total, item) =>
            total + prices[item.id] * item.quantity,
            0
        );
    }
);
// Only recalculates when items or prices change
```

---

## 🔄 Real-time State Sync

### WebSocket Integration

```tsx
// Real-time state updates
function useRealtimeSync<T>(
    channel: string,
    onMessage: (data: T) => void
) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`wss://api.example.com/ws`);

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'subscribe', channel }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, [channel]);

    return wsRef;
}

// Usage with Zustand
function useFeedSync() {
    const addPost = useStore(state => state.addPost);
    const updatePost = useStore(state => state.updatePost);

    useRealtimeSync('feed', (event) => {
        switch (event.type) {
            case 'post:created':
                addPost(event.data);
                break;
            case 'post:updated':
                updatePost(event.data.id, event.data);
                break;
        }
    });
}
```

### Offline-First with Optimistic Updates

```tsx
// Offline queue pattern
interface QueuedAction {
    id: string;
    action: string;
    payload: unknown;
    timestamp: number;
    retries: number;
}

const useOfflineStore = create<{
    queue: QueuedAction[];
    isOnline: boolean;
    addToQueue: (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => void;
    processQueue: () => Promise<void>;
}>((set, get) => ({
    queue: JSON.parse(localStorage.getItem('offline-queue') || '[]'),
    isOnline: navigator.onLine,

    addToQueue: (action) => {
        const queued: QueuedAction = {
            ...action,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            retries: 0
        };

        set(state => {
            const newQueue = [...state.queue, queued];
            localStorage.setItem('offline-queue', JSON.stringify(newQueue));
            return { queue: newQueue };
        });
    },

    processQueue: async () => {
        const { queue, isOnline } = get();
        if (!isOnline || queue.length === 0) return;

        for (const item of queue) {
            try {
                await executeAction(item);
                set(state => ({
                    queue: state.queue.filter(q => q.id !== item.id)
                }));
            } catch (error) {
                if (item.retries >= 3) {
                    // Move to dead letter queue
                    console.error('Failed after 3 retries:', item);
                }
            }
        }

        localStorage.setItem('offline-queue', JSON.stringify(get().queue));
    }
}));

// Listen for online/offline
useEffect(() => {
    const handleOnline = () => {
        useOfflineStore.setState({ isOnline: true });
        useOfflineStore.getState().processQueue();
    };

    const handleOffline = () => {
        useOfflineStore.setState({ isOnline: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}, []);
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What's the difference between local and global state?**

A:
- **Local state**: Lives in a component, not shared, managed with useState/useReducer
- **Global state**: Accessible across many components, managed with Context/Redux/Zustand

Rule of thumb: Start local, lift up when needed, go global only when truly necessary.

### 🟡 Mid-level

**Q: When would you use React Query vs Redux?**

A:
**React Query** for server state:
- API responses, caching
- Background refetching
- Pagination, infinite scroll
- Optimistic updates

**Redux** for client state:
- Complex UI state logic
- Many related state updates
- Need action history/time-travel

Most apps need **both**: React Query for server data, lighter solution (Zustand/Context) for client state.

### 🔴 Senior

**Q: How would you design state management for a collaborative document editor?**

A:
```
Architecture:
1. CRDT/OT for conflict resolution
2. Local-first with sync layer
3. Operational transforms for merging

State layers:
- Document state: CRDT-based (Yjs, Automerge)
- Presence state: Real-time user positions
- UI state: Local React state
- Sync queue: Pending operations

Implementation:
- WebSocket for real-time sync
- IndexedDB for offline persistence
- Version vectors for conflict detection
- Undo/redo with operation log
```

---

## 📚 Active Recall

1. [ ] What are the 5 types of state? Which tool for each?
2. [ ] When should you normalize state?
3. [ ] How do selectors improve performance?
4. [ ] Explain optimistic updates with rollback
5. [ ] Design state for offline-first app

---

> **Tiếp theo:** [04-design-systems.md](./04-design-systems.md) - Design Systems & Component Libraries
