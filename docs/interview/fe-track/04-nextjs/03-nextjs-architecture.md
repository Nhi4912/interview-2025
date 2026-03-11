# Next.js Architecture & Patterns
## Building Production-Ready Applications

**English:** Next.js is a React framework that provides infrastructure and optimizations for building production-ready web applications with features like server-side rendering, static generation, and API routes.

**Tiếng Việt:** Next.js là framework React cung cấp cơ sở hạ tầng và tối ưu hóa để xây dựng ứng dụng web sẵn sàng production với các tính năng như server-side rendering, static generation và API routes.

## Rendering Strategies

### Static Site Generation (SSG)

**Theory:** Pages are generated at build time and reused on each request.

**When to Use:**
- Marketing pages
- Blog posts
- Documentation
- E-commerce product pages
- Content that doesn't change often

**Benefits:**
- Fastest performance
- Best SEO
- Can be cached on CDN
- Lower server costs

**getStaticProps:**
```javascript
export async function getStaticProps(context) {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 60 // ISR: Regenerate every 60 seconds
  };
}
```

**getStaticPaths:**
```javascript
export async function getStaticPaths() {
  const posts = await getAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { id: post.id }
    })),
    fallback: 'blocking' // or true, false
  };
}
```

### Server-Side Rendering (SSR)

**Theory:** Pages are generated on each request on the server.

**When to Use:**
- Personalized content
- Real-time data
- User-specific pages
- Frequently changing data

**Benefits:**
- Always fresh data
- Good SEO
- Personalization
- Secure data fetching

**getServerSideProps:**
```javascript
export async function getServerSideProps(context) {
  const { req, res, params, query } = context;
  
  const data = await fetchUserData(req.cookies.token);
  
  return {
    props: { data }
  };
}
```

### Incremental Static Regeneration (ISR)

**Theory:** Update static pages after build without rebuilding entire site.

**Benefits:**
- Static performance
- Fresh content
- Scalable
- Best of both worlds

**Configuration:**
```javascript
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 10 // Regenerate every 10 seconds
  };
}
```

**Revalidation Strategies:**
- Time-based: `revalidate: seconds`
- On-demand: `res.revalidate('/path')`
- Stale-while-revalidate pattern

### Client-Side Rendering (CSR)

**Theory:** Pages render in browser using JavaScript.

**When to Use:**
- Private dashboards
- User-specific data
- Interactive applications
- Non-SEO critical pages

**Implementation:**
```javascript
function Dashboard() {
  const { data, loading } = useSWR('/api/user', fetcher);
  
  if (loading) return <Loading />;
  return <div>{data.name}</div>;
}
```

## Routing System

### File-Based Routing

**Theory:** File system determines routes automatically.

**Structure:**
```
pages/
  index.js          → /
  about.js          → /about
  blog/
    index.js        → /blog
    [slug].js       → /blog/:slug
  api/
    users.js        → /api/users
```

### Dynamic Routes

**Patterns:**
- `[id].js` - Single dynamic segment
- `[...slug].js` - Catch-all routes
- `[[...slug]].js` - Optional catch-all

**Accessing Parameters:**
```javascript
import { useRouter } from 'next/router';

function Post() {
  const router = useRouter();
  const { id } = router.query;
  
  return <div>Post: {id}</div>;
}
```

### Nested Routes

**Theory:** Create nested layouts with shared UI.

**App Directory Structure:**
```
app/
  layout.js         → Root layout
  page.js           → Home page
  dashboard/
    layout.js       → Dashboard layout
    page.js         → Dashboard page
    settings/
      page.js       → Settings page
```

### Route Groups

**Theory:** Organize routes without affecting URL structure.

**Syntax:**
```
app/
  (marketing)/
    about/
      page.js       → /about
    contact/
      page.js       → /contact
  (shop)/
    products/
      page.js       → /products
```

## Data Fetching Patterns

### SWR (Stale-While-Revalidate)

**Theory:** React Hooks library for data fetching with caching and revalidation.

**Features:**
- Automatic revalidation
- Focus revalidation
- Interval polling
- Optimistic updates
- Error retry

**Usage:**
```javascript
import useSWR from 'swr';

function Profile() {
  const { data, error, mutate } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000
  });
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>Hello {data.name}</div>;
}
```

### React Query Integration

**Theory:** Powerful data synchronization for React.

**Setup:**
```javascript
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

### Parallel Data Fetching

**Theory:** Fetch multiple data sources simultaneously.

**Pattern:**
```javascript
export async function getStaticProps() {
  const [posts, categories, tags] = await Promise.all([
    fetchPosts(),
    fetchCategories(),
    fetchTags()
  ]);
  
  return {
    props: { posts, categories, tags }
  };
}
```

## API Routes

### REST API Pattern

**Theory:** Create backend API endpoints within Next.js.

**Structure:**
```
pages/api/
  users/
    index.js        → GET /api/users
    [id].js         → GET /api/users/:id
  posts/
    index.js        → GET, POST /api/posts
    [id].js         → GET, PUT, DELETE /api/posts/:id
```

**Implementation:**
```javascript
export default async function handler(req, res) {
  const { method, query, body } = req;
  
  switch (method) {
    case 'GET':
      const users = await getUsers();
      res.status(200).json(users);
      break;
      
    case 'POST':
      const user = await createUser(body);
      res.status(201).json(user);
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

### Middleware Pattern

**Theory:** Run code before request is completed.

**Use Cases:**
- Authentication
- Logging
- Redirects
- Headers modification

**Implementation:**
```javascript
// middleware.js
export function middleware(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*'
};
```

## Performance Optimization

### Image Optimization

**Theory:** Next.js Image component automatically optimizes images.

**Features:**
- Lazy loading
- Responsive images
- WebP format
- Blur placeholder
- Priority loading

**Usage:**
```javascript
import Image from 'next/image';

function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/..."
    />
  );
}
```

### Code Splitting

**Theory:** Automatically split code by routes and dynamic imports.

**Dynamic Imports:**
```javascript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

### Font Optimization

**Theory:** Optimize web fonts with next/font.

**Usage:**
```javascript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

## State Management

### Server State vs Client State

**Server State:**
- Data from API
- Cached and synchronized
- Use SWR or React Query

**Client State:**
- UI state
- Form state
- Use React Context or Zustand

### Context Pattern

**Theory:** Share state across components without prop drilling.

**Implementation:**
```javascript
// context/AuthContext.js
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// _app.js
function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

## SEO Optimization

### Meta Tags

**Theory:** Optimize meta tags for search engines and social media.

**Implementation:**
```javascript
import Head from 'next/head';

function Page() {
  return (
    <>
      <Head>
        <title>Page Title</title>
        <meta name="description" content="Page description" />
        <meta property="og:title" content="Page Title" />
        <meta property="og:description" content="Description" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://example.com/page" />
      </Head>
      <div>Content</div>
    </>
  );
}
```

### Structured Data

**Theory:** Add JSON-LD structured data for rich snippets.

**Implementation:**
```javascript
function Article({ article }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.date
  };
  
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <article>{/* content */}</article>
    </>
  );
}
```

### Sitemap Generation

**Theory:** Generate sitemap for search engines.

**Implementation:**
```javascript
// pages/sitemap.xml.js
function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>https://example.com/posts/${post.slug}</loc>
          <lastmod>${post.date}</lastmod>
        </url>
      `).join('')}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  const posts = await getAllPosts();
  const sitemap = generateSiteMap(posts);
  
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  
  return { props: {} };
}
```

## Deployment Strategies

### Vercel Deployment

**Theory:** Optimized hosting platform for Next.js.

**Features:**
- Automatic deployments
- Preview deployments
- Edge network
- Analytics
- Zero configuration

### Self-Hosting

**Theory:** Deploy on your own infrastructure.

**Options:**
- Node.js server
- Docker container
- Static export
- Serverless functions

**Build Commands:**
```bash
# Production build
npm run build

# Start production server
npm start

# Static export
npm run build && npm run export
```

## Câu Hỏi Phỏng Vấn / Interview Q&A

**Q: What's the difference between SSG and SSR? — 🟢 [Junior]**

A: SSG generates pages at build time (fast, cacheable), while SSR generates pages on each request (fresh data, personalized). SSG is better for static content, SSR for dynamic content.

**Q: When to use ISR? — 🟡 [Mid]**

A: Use ISR when you want static performance but need to update content periodically without rebuilding. It's perfect for e-commerce, blogs, and content sites.

**Q: How does Next.js handle code splitting? — 🔴 [Senior]**

A: Next.js automatically splits code by routes. Each page only loads necessary JavaScript. You can also use dynamic imports for component-level splitting.

**Q: What are API routes used for? — 🟢 [Junior]**

A: API routes create backend endpoints within Next.js for handling server-side logic, database operations, authentication, and external API calls.

**Q: How to optimize images in Next.js? — 🟡 [Mid]**

A: Use next/image component which provides automatic optimization, lazy loading, responsive images, WebP format, and blur placeholders.

---

[← Back to Data Fetching](./02-data-fetching.md) | [Next: React Patterns →](../03-react/08-react-patterns-advanced.md)
