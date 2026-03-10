# Bundle Optimization / Tối Ưu Bundle
## Performance - Chapter 3 / Hiệu Suất - Chương 3

[Back to Table of Contents](../00-table-of-contents.md)

---

## Code Splitting Strategies

```typescript
// Route-based splitting / Chia tách dựa trên route
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

## Tree Shaking

```typescript
// ❌ Imports entire library / Import toàn bộ thư viện
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Import only what you need / Chỉ import những gì cần
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ Named imports with tree-shaking / Import có tên với tree-shaking
import { debounce } from 'lodash-es';
```

## Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    minimize: true,
    usedExports: true // Tree shaking
  }
};
```

## Dynamic Imports

```typescript
// Dynamic import based on condition / Import động dựa trên điều kiện
async function loadChart(type: string) {
  if (type === 'bar') {
    const { BarChart } = await import('./charts/BarChart');
    return BarChart;
  } else if (type === 'line') {
    const { LineChart } = await import('./charts/LineChart');
    return LineChart;
  }
}

// Usage / Sử dụng
function ChartContainer({ type }: { type: string }) {
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    loadChart(type).then(setChart);
  }, [type]);

  if (!Chart) return <Loading />;
  return <Chart />;
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
