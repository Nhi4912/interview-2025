---
layout: page
title: "Advanced Performance Optimization for FAANG Interviews"
description: "Master performance optimization techniques for senior frontend roles"
tags: [Performance, Optimization, React, JavaScript, Web Vitals]
companies: [Google, Meta, Amazon, Microsoft, Apple, Netflix]
---

# Advanced Performance Optimization for FAANG Interviews

## 🚀 Core Web Vitals Mastery

### 1. Largest Contentful Paint (LCP) Optimization

#### Problem: Slow LCP hurts user experience and SEO
**Target: < 2.5 seconds**

```typescript
// Image optimization strategy
class ImageOptimizer {
  static generateSrcSet(imagePath: string, sizes: number[]): string {
    return sizes
      .map(size => `${imagePath}?w=${size}&q=80 ${size}w`)
      .join(', ');
  }
  
  static getOptimalFormat(userAgent: string): 'webp' | 'avif' | 'jpg' {
    if (userAgent.includes('Chrome') && userAgent.includes('91')) return 'avif';
    if (userAgent.includes('Chrome') || userAgent.includes('Firefox')) return 'webp';
    return 'jpg';
  }
}

// React component with optimized image loading
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}> = ({ src, alt, priority = false, sizes = "100vw" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.srcset = img.dataset.srcset!;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [priority]);
  
  const srcSet = ImageOptimizer.generateSrcSet(src, [400, 800, 1200, 1600]);
  
  return (
    <div className="image-container">
      <img
        ref={imgRef}
        src={priority ? src : undefined}
        data-src={priority ? undefined : src}
        srcSet={priority ? srcSet : undefined}
        data-srcset={priority ? undefined : srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      {!isLoaded && !error && (
        <div className="image-placeholder" aria-hidden="true">
          {/* Skeleton loader */}
        </div>
      )}
    </div>
  );
};
```

### 2. First Input Delay (FID) Optimization

#### Problem: JavaScript blocking main thread
**Target: < 100ms**

```typescript
// Code splitting with React.lazy and Suspense
const LazyComponent = React.lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);

// Time slicing for heavy computations
class TimeSlicedProcessor {
  static async processLargeDataset<T, R>(
    data: T[],
    processor: (item: T) => R,
    batchSize: number = 100
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = batch.map(processor);
      results.push(...batchResults);
      
      // Yield control back to browser
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }
}

// Web Workers for CPU-intensive tasks
class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: Array<{
    data: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  
  constructor(workerScript: string, poolSize: number = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = this.handleWorkerMessage.bind(this);
      this.workers.push(worker);
    }
  }
  
  execute<T, R>(data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !w.busy);
      
      if (availableWorker) {
        this.assignTask(availableWorker, data, resolve, reject);
      } else {
        this.taskQueue.push({ data, resolve, reject });
      }
    });
  }
  
  private assignTask(worker: Worker, data: any, resolve: Function, reject: Function): void {
    worker.busy = true;
    worker.currentResolve = resolve;
    worker.currentReject = reject;
    worker.postMessage(data);
  }
  
  private handleWorkerMessage(event: MessageEvent): void {
    const worker = event.target as Worker;
    worker.busy = false;
    
    if (worker.currentResolve) {
      worker.currentResolve(event.data);
      worker.currentResolve = null;
      worker.currentReject = null;
    }
    
    // Process next task in queue
    if (this.taskQueue.length > 0) {
      const { data, resolve, reject } = this.taskQueue.shift()!;
      this.assignTask(worker, data, resolve, reject);
    }
  }
}
```

### 3. Cumulative Layout Shift (CLS) Optimization

#### Problem: Unexpected layout shifts
**Target: < 0.1**

```typescript
// Skeleton loading to prevent layout shifts
const SkeletonLoader: React.FC<{
  width?: string;
  height?: string;
  borderRadius?: string;
  count?: number;
}> = ({ width = "100%", height = "20px", borderRadius = "4px", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="skeleton"
          style={{
            width,
            height,
            borderRadius,
            backgroundColor: '#f0f0f0',
            backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-loading 1.5s infinite'
          }}
        />
      ))}
    </>
  );
};

// Aspect ratio containers to reserve space
const AspectRatioContainer: React.FC<{
  ratio: number; // width/height
  children: React.ReactNode;
}> = ({ ratio, children }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / ratio) * 100}%`
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Font loading optimization
class FontOptimizer {
  static preloadFonts(fonts: string[]): void {
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  
  static async loadFontWithFallback(
    fontFamily: string,
    fallbackFont: string,
    timeout: number = 3000
  ): Promise<void> {
    const font = new FontFace(fontFamily, `url(${fontFamily})`);
    
    try {
      await Promise.race([
        font.load(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Font load timeout')), timeout)
        )
      ]);
      
      document.fonts.add(font);
    } catch (error) {
      console.warn(`Failed to load ${fontFamily}, using fallback: ${fallbackFont}`);
      // Apply fallback font
      document.documentElement.style.setProperty('--primary-font', fallbackFont);
    }
  }
}
```

## 🧠 Memory Management & Optimization

### 1. Memory Leak Prevention

```typescript
// Custom hook for cleanup
function useCleanup(cleanup: () => void): void {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;
  
  useEffect(() => {
    return () => cleanupRef.current();
  }, []);
}

// Memory-efficient infinite scroll
const useInfiniteScroll = <T>(
  fetchMore: (page: number) => Promise<T[]>,
  options: {
    threshold?: number;
    maxItems?: number;
  } = {}
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver>();
  
  const { threshold = 0.1, maxItems = 1000 } = options;
  
  const loadMore = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newItems = await fetchMore(page);
      setItems(prev => {
        const combined = [...prev, ...newItems];
        // Prevent memory bloat by limiting items
        return combined.length > maxItems 
          ? combined.slice(-maxItems) 
          : combined;
      });
      setPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, loading, maxItems]);
  
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold }
    );
    
    if (node) observerRef.current.observe(node);
  }, [loading, loadMore, threshold]);
  
  useCleanup(() => {
    observerRef.current?.disconnect();
  });
  
  return { items, loading, lastElementRef };
};
```

### 2. Bundle Optimization Strategies

```typescript
// Dynamic imports with error boundaries
const DynamicComponentLoader = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ComponentType = () => <div>Loading...</div>
) => {
  return React.lazy(async () => {
    try {
      return await importFunc();
    } catch (error) {
      console.error('Failed to load component:', error);
      // Return fallback component
      return { default: fallback };
    }
  });
};

// Tree shaking optimization
export const utils = {
  // Instead of importing entire lodash
  debounce: (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  
  throttle: (func: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Webpack bundle analysis helper
class BundleAnalyzer {
  static analyzeChunks(): void {
    if (process.env.NODE_ENV === 'development') {
      import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
        // Analyze bundle in development
        console.log('Bundle analysis available at http://localhost:8888');
      });
    }
  }
  
  static measureComponentSize(Component: React.ComponentType): voi