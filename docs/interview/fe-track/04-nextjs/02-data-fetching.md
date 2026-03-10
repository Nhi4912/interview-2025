# Next.js Data Fetching / Lấy Dữ Liệu Next.js
## Next.js - Chapter 2 / Next.js - Chương 2

[Back to Table of Contents](../00-table-of-contents.md)

---

## Server Components Data Fetching

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // ISR - revalidate every hour
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

## Client Components Data Fetching

```typescript
'use client';

import { useState, useEffect } from 'react';

export function ClientPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}
```

## Parallel Data Fetching

```typescript
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
}

async function getPosts(userId: string) {
  const res = await fetch(`https://api.example.com/posts?userId=${userId}`);
  return res.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  // Parallel fetching / Lấy song song
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getPosts(params.id)
  ]);

  return (
    <div>
      <h1>{user.name}</h1>
      <div>
        {posts.map(post => (
          <article key={post.id}>{post.title}</article>
        ))}
      </div>
    </div>
  );
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
