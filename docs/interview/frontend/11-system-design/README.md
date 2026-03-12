# Frontend System Design - Thiết Kế Hệ Thống Frontend

> System Design là kỹ năng **BẮT BUỘC** cho vị trí Senior Frontend tại Big Tech. Module này cover framework RADIO và các case studies thực tế.

---

## Tổng Quan

Frontend System Design khác với Backend System Design. Focus vào:
- **User Experience**: Latency, responsiveness, accessibility
- **Component Architecture**: Reusability, maintainability
- **State Management**: At scale, real-time updates
- **Performance**: Core Web Vitals, bundle size, rendering

---

## Cấu Trúc Module

| File | Chủ Đề | Độ Quan Trọng |
|------|--------|---------------|
| [01-system-design-framework.md](./01-system-design-framework.md) | RADIO Framework | ⭐⭐⭐⭐⭐ |
| [02-architecture-patterns.md](./02-architecture-patterns.md) | MVC, Flux, Micro-frontends | ⭐⭐⭐⭐ |
| [03-state-management-scale.md](./03-state-management-scale.md) | State at Scale | ⭐⭐⭐⭐ |
| [04-design-systems.md](./04-design-systems.md) | Component Libraries | ⭐⭐⭐ |
| [05-real-world-examples.md](./05-real-world-examples.md) | Facebook, Twitter, etc. | ⭐⭐⭐⭐⭐ |
| [mindmap-system-design.md](./mindmap-system-design.md) | Sơ Đồ Tổng Hợp | Review |

---

## RADIO Framework

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RADIO FRAMEWORK                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  R - Requirements                                                     │
│      ├── Functional: Features cần có                                  │
│      └── Non-functional: Performance, scale, accessibility           │
│                                                                       │
│  A - Architecture                                                     │
│      ├── High-level components                                        │
│      ├── Data flow                                                    │
│      └── Client vs Server responsibilities                            │
│                                                                       │
│  D - Data Model                                                       │
│      ├── Entities và relationships                                    │
│      ├── API contracts                                                │
│      └── Client-side data structures                                  │
│                                                                       │
│  I - Interface Definition                                             │
│      ├── Component interfaces                                         │
│      ├── Props/State design                                           │
│      └── API endpoints                                                │
│                                                                       │
│  O - Optimizations                                                    │
│      ├── Performance                                                  │
│      ├── Caching strategies                                           │
│      ├── Lazy loading                                                 │
│      └── Bundle optimization                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Common System Design Questions

| Question | Company | Time | Difficulty |
|----------|---------|------|------------|
| Design Facebook News Feed | Meta | 45m | 🔴 |
| Design Twitter/X Timeline | All | 45m | 🔴 |
| Design E-commerce Product Page | Amazon | 45m | 🟡 |
| Design Chat Application | All | 45m | 🔴 |
| Design Video Player (Netflix) | Netflix | 45m | 🔴 |
| Design Autocomplete/Typeahead | Google | 35m | 🟡 |
| Design Photo Sharing (Instagram) | Meta | 45m | 🟡 |
| Design Collaborative Editor | Google | 60m | 🔴 |
| Design Real-time Dashboard | All | 45m | 🟡 |
| Design Notification System | All | 35m | 🟡 |

---

## Template Trả Lời

### 1. Requirements (5 min)

```markdown
## Functional Requirements
- User can [action 1]
- User can [action 2]
- System shows [feature]

## Non-functional Requirements
- Performance: < 3s load, < 100ms interaction
- Scale: X users, Y requests/sec
- Accessibility: WCAG 2.1 AA
- i18n: Multi-language support
- Offline: Works without network
```

### 2. Architecture (10 min)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT                                    │
├───────────────────────────────────────────────────────────────  │
│  ┌───────────┐  ┌──────────────┐  ┌───────────────────────────┐│
│  │   Views   │  │   State      │  │      Services            ││
│  │           │  │   Store      │  │  • API Client            ││
│  │ Components│◄─│  • UI State  │◄─│  • WebSocket             ││
│  │           │  │  • Cache     │  │  • Storage               ││
│  └───────────┘  └──────────────┘  └─────────────┬─────────────┘│
│                                                  │              │
└──────────────────────────────────────────────────┼──────────────┘
                                                   │
                                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (API)                              │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Data Model (10 min)

```typescript
// Entities
interface User {
    id: string;
    name: string;
    avatar: string;
}

interface Post {
    id: string;
    authorId: string;
    content: string;
    createdAt: Date;
    likes: number;
}

// API Contracts
GET /api/feed?cursor=xxx&limit=20
POST /api/posts
PUT /api/posts/:id/like
```

### 4. Component Interface (10 min)

```typescript
// Component Props
interface FeedProps {
    initialPosts: Post[];
    onLoadMore: () => Promise<Post[]>;
}

// State Shape
interface FeedState {
    posts: Post[];
    loading: boolean;
    error: Error | null;
    hasMore: boolean;
    cursor: string | null;
}
```

### 5. Optimizations (10 min)

```markdown
## Performance
- Virtual scrolling cho large lists
- Image lazy loading với placeholder
- Code splitting per route

## Caching
- Service Worker cho offline
- React Query/SWR cho server state
- Local Storage cho user preferences

## Bundle
- Tree shaking
- Dynamic imports
- CDN cho static assets
```

---

## Evaluation Criteria

| Tiêu chí | Weight | Mô tả |
|----------|--------|-------|
| Requirements gathering | 15% | Hỏi đúng câu hỏi, clarify scope |
| Architecture | 25% | Thiết kế clean, scalable |
| Data modeling | 20% | Entities, API design |
| Technical depth | 20% | React patterns, optimizations |
| Trade-offs discussion | 10% | Pros/cons của decisions |
| Communication | 10% | Clear explanation |

---

## Common Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Rendering | CSR | SSR/SSG |
| State | Context | Redux/Zustand |
| Data fetching | REST | GraphQL |
| Real-time | Polling | WebSocket |
| Styling | CSS Modules | CSS-in-JS |
| Routing | Client-side | Server-side |

### Khi nào chọn Option nào?

**CSR vs SSR:**
- CSR: Dashboard, admin panels, highly interactive
- SSR: SEO important, first paint critical

**REST vs GraphQL:**
- REST: Simple APIs, cacheable, team familiarity
- GraphQL: Complex data requirements, reduce over-fetching

**Polling vs WebSocket:**
- Polling: Low-frequency updates, simpler infrastructure
- WebSocket: Real-time critical (chat, notifications)

---

## Practice Checklist

- [ ] Design News Feed trong 45 phút
- [ ] Design Chat App trong 45 phút
- [ ] Design E-commerce Product Page
- [ ] Design Autocomplete
- [ ] Practice với partner (mock interview)

---

## Resources

### Must Read
- [Frontend System Design](https://www.frontendinterviewhandbook.com/front-end-system-design)
- [GreatFrontend System Design](https://www.greatfrontend.com/front-end-system-design-playbook)

### Practice
- [GreatFrontend Questions](https://www.greatfrontend.com/questions)
- Pramp.com - Mock interviews

---

> **Thời gian ước tính:** 1 tuần (focus vào 2-3 case studies)
