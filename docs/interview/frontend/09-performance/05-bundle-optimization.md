# Bundle Optimization - Smaller, Faster Bundles

> Bundle size trực tiếp ảnh hưởng load time. Tree shaking, code splitting, và compression strategies.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUNDLE OPTIMIZATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SOURCE CODE                          OPTIMIZED BUNDLE          │
│   ┌─────────────────┐                  ┌─────────────────┐      │
│   │                 │                  │                 │      │
│   │  App Code       │   ──────────▶   │  main.js (50KB) │      │
│   │  (200KB)        │                  │  gzipped        │      │
│   │                 │                  │                 │      │
│   │  Dependencies   │   ──────────▶   │  vendor.js      │      │
│   │  (2MB)          │                  │  (200KB gzip)   │      │
│   │                 │                  │                 │      │
│   │  Unused Code    │   ──────────▶   │  (removed)      │      │
│   │  (500KB)        │                  │                 │      │
│   └─────────────────┘                  └─────────────────┘      │
│                                                                   │
│   TECHNIQUES:                                                    │
│   • Tree Shaking - Remove unused code                           │
│   • Code Splitting - Load on demand                             │
│   • Minification - Remove whitespace, shorten names             │
│   • Compression - gzip/brotli                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌳 Tree Shaking

### How It Works

```javascript
// utils.js - ES Modules (tree-shakeable)
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

// app.js - Only import what you use
import { add } from './utils';

console.log(add(1, 2));

// After tree shaking, only 'add' is in bundle
// subtract and multiply are removed

// ❌ NOT tree-shakeable - CommonJS
const utils = require('./utils');
utils.add(1, 2);

// ❌ NOT tree-shakeable - namespace import with side effects
import * as utils from './utils';
```

### Ensuring Tree Shaking Works

```javascript
// package.json - Mark as side-effect free
{
    "name": "my-library",
    "sideEffects": false
}

// Or specify files with side effects
{
    "sideEffects": [
        "*.css",
        "./src/polyfills.js"
    ]
}

// webpack.config.js
module.exports = {
    mode: 'production', // Enables tree shaking
    optimization: {
        usedExports: true,
        minimize: true
    }
};

// vite.config.js - Tree shaking enabled by default
export default {
    build: {
        rollupOptions: {
            treeshake: true
        }
    }
};
```

### Import Best Practices

```javascript
// ❌ Bad - imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Good - import only what you need
import debounce from 'lodash/debounce';
debounce(fn, 300);

// ✅ Better - use lodash-es (ES modules)
import { debounce } from 'lodash-es';

// ❌ Bad - entire date-fns
import * as dateFns from 'date-fns';

// ✅ Good - specific imports
import { format, parseISO } from 'date-fns';

// ❌ Bad - entire Material UI
import { Button, TextField, Dialog } from '@mui/material';

// ✅ Good - path imports (pre-v5)
import Button from '@mui/material/Button';

// Note: MUI v5+ supports tree shaking with named imports
```

---

## ✂️ Code Splitting Strategies

### Entry Points

```javascript
// webpack.config.js
module.exports = {
    entry: {
        main: './src/index.js',
        admin: './src/admin.js'
    },
    output: {
        filename: '[name].[contenthash].js'
    }
};

// Separate bundles for different parts of app
// main.abc123.js - Public app
// admin.def456.js - Admin panel
```

### Dynamic Imports

```javascript
// Webpack magic comments
const AdminPanel = () => import(
    /* webpackChunkName: "admin" */
    /* webpackPrefetch: true */
    './AdminPanel'
);

// Multiple chunks
const loadAnalytics = () => import(
    /* webpackChunkName: "analytics" */
    /* webpackMode: "lazy" */
    './analytics'
);

// Vite/Rollup
const Chart = () => import('./Chart'); // auto chunk naming
```

### Vendor Splitting

```javascript
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // Vendor chunk
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                // Separate heavy libraries
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react',
                    chunks: 'all',
                    priority: 20
                },
                // Common code
                common: {
                    minChunks: 2,
                    priority: -10,
                    reuseExistingChunk: true
                }
            }
        }
    }
};

// next.config.js
module.exports = {
    webpack: (config) => {
        config.optimization.splitChunks = {
            chunks: 'all',
            cacheGroups: {
                lib: {
                    test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
                    name: 'lib',
                    priority: 40
                }
            }
        };
        return config;
    }
};
```

---

## 📦 Minification

### JavaScript Minification

```javascript
// Before minification
function calculateTotalPrice(items) {
    let total = 0;
    for (const item of items) {
        total += item.price * item.quantity;
    }
    return total;
}

// After minification (Terser)
function calculateTotalPrice(e){let t=0;for(const n of e)t+=n.price*n.quantity;return t}

// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // Remove console.log
                        drop_debugger: true
                    },
                    mangle: true, // Shorten variable names
                    format: {
                        comments: false // Remove comments
                    }
                }
            })
        ]
    }
};
```

### CSS Minification

```javascript
// webpack.config.js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [
            `...`, // Extend default minimizers
            new CssMinimizerPlugin()
        ]
    }
};

// PostCSS with cssnano
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano')({
            preset: ['default', {
                discardComments: { removeAll: true }
            }]
        })
    ]
};
```

---

## 🗜️ Compression

### Gzip vs Brotli

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPRESSION COMPARISON                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FORMAT      COMPRESSION    BROWSER SUPPORT    BEST FOR         │
│   ──────────────────────────────────────────────────────────     │
│   Gzip        Good (70%)     Universal          All users        │
│   Brotli      Better (80%)   Modern browsers    Most users       │
│                                                                   │
│   EXAMPLE (1MB JavaScript):                                      │
│   Original:  1000 KB                                             │
│   Gzip:      ~300 KB (-70%)                                     │
│   Brotli:    ~200 KB (-80%)                                     │
│                                                                   │
│   RECOMMENDATION:                                                │
│   Serve Brotli with Gzip fallback                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Build-Time Compression

```javascript
// webpack.config.js
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    plugins: [
        // Gzip
        new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192, // Only compress > 8KB
            minRatio: 0.8
        }),
        // Brotli
        new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8
        })
    ]
};

// Nginx configuration
server {
    gzip on;
    gzip_types text/plain application/javascript text/css;

    brotli on;
    brotli_types text/plain application/javascript text/css;

    # Serve pre-compressed files
    location ~ ^/static/ {
        gzip_static on;
        brotli_static on;
    }
}
```

---

## 📊 Bundle Analysis

### Webpack Bundle Analyzer

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: false
        })
    ]
};

// package.json
{
    "scripts": {
        "analyze": "ANALYZE=true npm run build"
    }
}
```

### Next.js Bundle Analysis

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
    // Next.js config
});

// Run: ANALYZE=true npm run build
```

### Size Limits

```javascript
// package.json
{
    "size-limit": [
        {
            "path": "dist/bundle.js",
            "limit": "100 KB"
        },
        {
            "path": "dist/vendor.js",
            "limit": "200 KB"
        }
    ],
    "scripts": {
        "size": "size-limit"
    }
}

// Run in CI to fail if bundle too large
// npx size-limit
```

---

## 🔄 Cache Optimization

### Content Hashing

```javascript
// webpack.config.js
module.exports = {
    output: {
        // Hash changes when content changes
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js'
    },
    optimization: {
        // Separate runtime for better caching
        runtimeChunk: 'single',
        // Consistent module IDs
        moduleIds: 'deterministic'
    }
};

// Results in:
// main.a1b2c3d4.js      - Changes when app code changes
// vendor.e5f6g7h8.js    - Changes when dependencies change
// runtime.i9j0k1l2.js   - Changes when webpack runtime changes
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is tree shaking?**

A: Removing unused code from bundle. Works with ES modules (import/export). Bundler analyzes which exports are used and removes unused ones.

**Q: What is code splitting?**

A: Breaking bundle into smaller chunks loaded on demand. Reduces initial load time. Done via dynamic imports or route-based splitting.

### 🟡 Mid-level

**Q: How do you ensure tree shaking works?**

A:
1. Use ES modules (import/export)
2. Mark package as side-effect free in package.json
3. Import specifically (`import { fn }` not `import *`)
4. Use production mode in bundler
5. Check with bundle analyzer

**Q: Gzip vs Brotli?**

A:
- **Gzip**: Universal support, ~70% compression
- **Brotli**: ~80% compression, slightly slower, modern browsers

Use Brotli with Gzip fallback. Pre-compress at build time for static assets.

### 🔴 Senior

**Q: Design bundle strategy for large SPA**

A:
```
1. Splitting Strategy:
   - Route-based chunks (each page separate)
   - Vendor chunk (node_modules)
   - Shared chunk (common components)
   - Heavy library chunks (chart, editor)

2. Loading Strategy:
   - Critical: inline in HTML
   - Route: lazy load on navigation
   - Prefetch: likely next pages
   - Defer: analytics, non-critical

3. Caching Strategy:
   - Content hashing for long cache
   - Separate runtime chunk
   - Vendor chunk for stable deps

4. Optimization:
   - Tree shake all imports
   - Replace heavy libs with lighter
   - Analyze and set size budgets

5. Monitoring:
   - CI size checks
   - Bundle analysis on PRs
   - RUM for real impact
```

---

## 📚 Active Recall

1. [ ] Tree shaking requirements
2. [ ] Code splitting methods (3)
3. [ ] Gzip vs Brotli comparison
4. [ ] Content hashing purpose
5. [ ] Bundle analysis tools

---

> **Tiếp theo:** [06-performance-monitoring.md](./06-performance-monitoring.md) - Performance Monitoring
