# Module Systems Theory
## Understanding JavaScript Module Patterns and Bundlers

**English:** Module systems provide mechanisms for organizing code into reusable, maintainable units with explicit dependencies, enabling better code organization, encapsulation, and dependency management.

**Tiếng Việt:** Hệ thống module cung cấp cơ chế tổ chức code thành các đơn vị có thể tái sử dụng và bảo trì với các phụ thuộc rõ ràng, cho phép tổ chức code tốt hơn, đóng gói và quản lý phụ thuộc.

## Table of Contents
1. [Module Fundamentals](#module-fundamentals)
2. [CommonJS](#commonjs)
3. [ES Modules](#es-modules)
4. [AMD and UMD](#amd-and-umd)
5. [Module Bundlers](#module-bundlers)
6. [Webpack](#webpack)
7. [Rollup](#rollup)
8. [Vite](#vite)
9. [Tree Shaking](#tree-shaking)
10. [Code Splitting](#code-splitting)

## Module Fundamentals

### Why Modules?

**Problems Without Modules:**
```javascript
// Global scope pollution
var userName = 'John';
var userAge = 30;

function getUserInfo() {
  return userName + ' is ' + userAge;
}

// Name collisions
var userName = 'Jane'; // Overwrites previous value

// No dependency management
// No encapsulation
// Hard to maintain
```

**Benefits of Modules:**
```
✅ Encapsulation - Private scope
✅ Reusability - Import/export
✅ Maintainability - Organized code
✅ Dependency management - Explicit imports
✅ Namespace management - No global pollution
✅ Lazy loading - Load on demand
```

### Module Patterns (Pre-ES6)

**IIFE (Immediately Invoked Function Expression):**
```javascript
const myModule = (function() {
  // Private variables
  let privateVar = 'I am private';
  
  // Private function
  function privateFunction() {
    console.log(privateVar);
  }
  
  // Public API
  return {
    publicMethod: function() {
      privateFunction();
    },
    publicVar: 'I am public'
  };
})();

myModule.publicMethod(); // Works
console.log(myModule.publicVar); // Works
console.log(myModule.privateVar); // undefined
```

**Revealing Module Pattern:**
```javascript
const calculator = (function() {
  // Private
  let result = 0;
  
  function add(x) {
    result += x;
    return result;
  }
  
  function subtract(x) {
    result -= x;
    return result;
  }
  
  function getResult() {
    return result;
  }
  
  function reset() {
    result = 0;
  }
  
  // Reveal public API
  return {
    add,
    subtract,
    getResult,
    reset
  };
})();

calculator.add(5);
calculator.subtract(2);
console.log(calculator.getResult()); // 3
```

## CommonJS

### Definition

**CommonJS:** Synchronous module system used in Node.js

**Characteristics:**
- Synchronous loading
- Server-side focused
- `require()` for imports
- `module.exports` for exports
- One file = one module

### Exports

**Named Exports:**
```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

const PI = 3.14159;

// Export individual items
exports.add = add;
exports.subtract = subtract;
exports.PI = PI;

// Or export object
module.exports = {
  add,
  subtract,
  PI
};
```

**Default Export:**
```javascript
// user.js
class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

module.exports = User;
```

### Imports

**Importing:**
```javascript
// Import entire module
const math = require('./math');
console.log(math.add(2, 3)); // 5
console.log(math.PI); // 3.14159

// Destructure imports
const { add, subtract } = require('./math');
console.log(add(2, 3)); // 5

// Import default export
const User = require('./user');
const user = new User('John');
console.log(user.greet()); // Hello, John
```

### Module Caching

**Modules are Cached:**
```javascript
// counter.js
let count = 0;

module.exports = {
  increment() {
    count++;
  },
  getCount() {
    return count;
  }
};

// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

counter1.increment();
console.log(counter2.getCount()); // 1 (same instance)

// Clear cache
delete require.cache[require.resolve('./counter')];
const counter3 = require('./counter');
console.log(counter3.getCount()); // 0 (new instance)
```

### Module Resolution

**Resolution Algorithm:**
```
1. Core modules (fs, path, http)
2. File modules (./file, ../file, /absolute/path)
3. node_modules (package name)

File resolution:
- Exact file: require('./file.js')
- Add .js: require('./file') → file.js
- Add .json: require('./file') → file.json
- Add .node: require('./file') → file.node
- Directory: require('./dir') → dir/index.js
```

**Example:**
```javascript
// Core module
const fs = require('fs');

// File module
const myModule = require('./myModule');
const config = require('../config.json');

// node_modules
const express = require('express');
const lodash = require('lodash');
```

## ES Modules

### Definition

**ES Modules (ESM):** Native JavaScript module system (ES6+)

**Characteristics:**
- Asynchronous loading
- Static analysis
- `import` for imports
- `export` for exports
- Tree-shakeable
- Browser and Node.js support

### Exports

**Named Exports:**
```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// Or export at end
function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

export { multiply, divide };

// Rename exports
export { multiply as mult, divide as div };
```

**Default Export:**
```javascript
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

// Or
class User {
  // ...
}

export default User;

// Can combine default and named
export default User;
export const USER_ROLE = 'admin';
```

### Imports

**Named Imports:**
```javascript
// Import specific exports
import { add, subtract } from './math.js';
console.log(add(2, 3)); // 5

// Import with rename
import { add as sum, subtract as diff } from './math.js';
console.log(sum(2, 3)); // 5

// Import all as namespace
import * as math from './math.js';
console.log(math.add(2, 3)); // 5
console.log(math.PI); // 3.14159
```

**Default Import:**
```javascript
// Import default export
import User from './user.js';
const user = new User('John');

// Combine default and named
import User, { USER_ROLE } from './user.js';
```

**Dynamic Import:**
```javascript
// Async import
async function loadModule() {
  const module = await import('./math.js');
  console.log(module.add(2, 3));
}

// With then
import('./math.js')
  .then(module => {
    console.log(module.add(2, 3));
  });

// Conditional import
if (condition) {
  const module = await import('./feature.js');
  module.initialize();
}
```

### ES Modules vs CommonJS

**Comparison:**
```javascript
// CommonJS (synchronous)
const module = require('./module');
module.doSomething();

// ES Modules (asynchronous)
import { doSomething } from './module.js';
doSomething();

// CommonJS (dynamic)
const moduleName = 'module';
const module = require(`./${moduleName}`);

// ES Modules (static, but dynamic import available)
const moduleName = 'module';
const module = await import(`./${moduleName}.js`);
```

**Key Differences:**
```
Feature          | CommonJS      | ES Modules
-----------------|---------------|------------------
Loading          | Synchronous   | Asynchronous
Syntax           | require()     | import/export
Default export   | module.exports| export default
Named exports    | exports.x     | export { x }
Dynamic imports  | Yes (always)  | import()
Tree shaking     | No            | Yes
Browser support  | No (bundler)  | Yes (native)
Node.js support  | Yes (default) | Yes (.mjs or type:module)
Static analysis  | No            | Yes
```

### Module Scope

**Each Module Has Own Scope:**
```javascript
// module1.js
let count = 0;
export function increment() {
  count++;
}
export function getCount() {
  return count;
}

// module2.js
import { increment, getCount } from './module1.js';
increment();
console.log(getCount()); // 1

// count is not accessible here
console.log(count); // ReferenceError
```

## AMD and UMD

### AMD (Asynchronous Module Definition)

**For Browser, Asynchronous:**
```javascript
// Define module
define('myModule', ['dependency1', 'dependency2'], function(dep1, dep2) {
  function myFunction() {
    return dep1.doSomething() + dep2.doSomethingElse();
  }
  
  return {
    myFunction
  };
});

// Use module
require(['myModule'], function(myModule) {
  myModule.myFunction();
});
```

**RequireJS Example:**
```javascript
// config.js
requirejs.config({
  baseUrl: 'js',
  paths: {
    jquery: 'lib/jquery',
    lodash: 'lib/lodash'
  }
});

// app.js
define(['jquery', 'lodash'], function($, _) {
  return {
    init: function() {
      $('.container').html(_.template('Hello <%= name %>')({ name: 'World' }));
    }
  };
});
```

### UMD (Universal Module Definition)

**Works Everywhere:**
```javascript
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['dependency'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('dependency'));
  } else {
    // Browser global
    root.MyModule = factory(root.Dependency);
  }
}(typeof self !== 'undefined' ? self : this, function(dependency) {
  // Module code
  function myFunction() {
    return dependency.doSomething();
  }
  
  return {
    myFunction
  };
}));
```

## Module Bundlers

### Why Bundlers?

**Problems:**
```
- Multiple HTTP requests (slow)
- Module system compatibility
- Browser doesn't support all features
- Need transpilation (TypeScript, JSX)
- Need optimization (minification, tree shaking)
```

**Solutions:**
```
✅ Bundle multiple files into one
✅ Transform modern syntax to compatible
✅ Optimize code (minify, tree shake)
✅ Handle assets (CSS, images)
✅ Development server with HMR
✅ Code splitting for lazy loading
```

### Popular Bundlers

**Webpack:**
```
- Most popular
- Highly configurable
- Large ecosystem
- Complex configuration
```

**Rollup:**
```
- ES modules focused
- Better tree shaking
- Smaller bundles
- Library-friendly
```

**Parcel:**
```
- Zero configuration
- Fast
- Built-in features
- Good for beginners
```

**Vite:**
```
- Fast dev server (ESM)
- Rollup for production
- Modern approach
- Great DX
```

**esbuild:**
```
- Extremely fast (Go)
- Simple API
- Good for libraries
- Limited features
```

## Webpack

### Core Concepts

**Entry:**
```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  
  // Multiple entries
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};
```

**Output:**
```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    
    // With hash for caching
    filename: '[name].[contenthash].js',
    
    // Clean dist folder
    clean: true
  }
};
```

**Loaders:**
```javascript
module.exports = {
  module: {
    rules: [
      // Babel for JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      
      // SASS
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      
      // Images
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      },
      
      // TypeScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
```

**Plugins:**
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    // Generate HTML
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: true
    }),
    
    // Extract CSS
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    
    // Clean dist
    new CleanWebpackPlugin()
  ]
};
```

### Development Server

```javascript
module.exports = {
  devServer: {
    static: './dist',
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
};
```

### Optimization

```javascript
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ],
    
    // Split chunks
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
    
    // Runtime chunk
    runtimeChunk: 'single'
  }
};
```

## Rollup

### Configuration

**Basic Config:**
```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  
  output: [
    // UMD build
    {
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'MyLibrary',
      sourcemap: true
    },
    
    // ES module build
    {
      file: 'dist/bundle.esm.js',
      format: 'esm',
      sourcemap: true
    },
    
    // CommonJS build
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      sourcemap: true
    }
  ],
  
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser()
  ],
  
  external: ['react', 'react-dom']
};
```

### Tree Shaking

**Rollup Excels at Tree Shaking:**
```javascript
// utils.js
export function used() {
  return 'I am used';
}

export function unused() {
  return 'I am not used';
}

// app.js
import { used } from './utils';
console.log(used());

// Bundle only includes 'used' function
// 'unused' is removed (tree shaken)
```

## Vite

### Why Vite?

**Traditional Bundler:**
```
Start Dev Server:
Bundle entire app → Start server (slow)

Hot Module Replacement:
Rebuild affected modules → Update (slow)
```

**Vite:**
```
Start Dev Server:
Start server → Serve ES modules (instant)

Hot Module Replacement:
Invalidate module → Browser re-requests (fast)
```

### Configuration

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'axios']
        }
      }
    }
  }
});
```

### Features

**Instant Server Start:**
```bash
npm run dev
# Server starts immediately
# No bundling needed
```

**Lightning Fast HMR:**
```javascript
// Changes reflect instantly
// No full page reload
// State preserved
```

**Optimized Build:**
```bash
npm run build
# Uses Rollup
# Tree shaking
# Code splitting
# Minification
```

## Tree Shaking

### Definition

**Tree Shaking:** Eliminating dead code (unused exports)

**Requirements:**
```
✅ ES modules (static imports)
✅ Side-effect free code
✅ Production mode
✅ Minification enabled
```

### Example

**Before Tree Shaking:**
```javascript
// utils.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  return a / b;
}

// app.js
import { add } from './utils';
console.log(add(2, 3));

// Bundle includes all functions (without tree shaking)
```

**After Tree Shaking:**
```javascript
// Bundle only includes:
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));

// Other functions removed
```

### Side Effects

**Mark Side-Effect Free:**
```json
// package.json
{
  "name": "my-library",
  "sideEffects": false
}

// Or specify files with side effects
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}
```

**Side Effect Example:**
```javascript
// Has side effect (modifies global)
window.myGlobal = 'value';
export function myFunction() {}

// No side effect (pure)
export function pureFunction(x) {
  return x * 2;
}
```

## Code Splitting

### Why Code Splitting?

**Problems:**
```
- Large bundle size
- Slow initial load
- Load unused code
```

**Solutions:**
```
✅ Split code into chunks
✅ Load on demand
✅ Parallel loading
✅ Better caching
```

### Dynamic Import

**Lazy Loading:**
```javascript
// Instead of static import
import HeavyComponent from './HeavyComponent';

// Use dynamic import
button.addEventListener('click', async () => {
  const { default: HeavyComponent } = await import('./HeavyComponent');
  const component = new HeavyComponent();
  component.render();
});
```

**React Example:**
```javascript
import React, { lazy, Suspense } from 'react';

// Lazy load component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Route-Based Splitting

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Webpack Magic Comments

```javascript
// Chunk name
import(/* webpackChunkName: "my-chunk" */ './module');

// Prefetch (load during idle time)
import(/* webpackPrefetch: true */ './module');

// Preload (load in parallel)
import(/* webpackPreload: true */ './module');

// Multiple comments
import(
  /* webpackChunkName: "my-chunk" */
  /* webpackPrefetch: true */
  './module'
);
```

## Best Practices

### Module Organization

**File Structure:**
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.js
│   │   ├── Button.css
│   │   ├── Button.test.js
│   │   └── index.js
│   └── index.js
├── utils/
│   ├── math.js
│   ├── string.js
│   └── index.js
├── services/
│   ├── api.js
│   └── auth.js
└── index.js
```

**Barrel Exports:**
```javascript
// components/index.js
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';

// Usage
import { Button, Input, Modal } from './components';
```

### Performance

**Lazy Load Heavy Dependencies:**
```javascript
// Bad: Load immediately
import moment from 'moment';

// Good: Load when needed
button.addEventListener('click', async () => {
  const moment = await import('moment');
  console.log(moment.default().format());
});
```

**Tree Shakeable Exports:**
```javascript
// Bad: Default export object
export default {
  add,
  subtract,
  multiply,
  divide
};

// Good: Named exports
export { add, subtract, multiply, divide };
```

**Avoid Side Effects:**
```javascript
// Bad: Side effect on import
console.log('Module loaded');
export function myFunction() {}

// Good: No side effects
export function myFunction() {}
```

## Interview Questions

**Q: What's the difference between CommonJS and ES Modules?**

A: CommonJS uses `require()`/`module.exports`, synchronous, dynamic imports, no tree shaking, Node.js default. ES Modules use `import`/`export`, asynchronous, static analysis, tree shakeable, native browser support. ESM is modern standard, CJS is legacy but still widely used in Node.js.

**Q: How does tree shaking work?**

A: Tree shaking eliminates unused code by analyzing static imports/exports. Requires ES modules (static structure), marks unused exports, removes them during minification. Only works with side-effect free code. Configure with `sideEffects: false` in package.json.

**Q: Explain code splitting and when to use it.**

A: Code splitting divides bundle into smaller chunks loaded on demand. Use for: route-based splitting (load page code when navigating), component-based (lazy load heavy components), vendor splitting (separate third-party code). Improves initial load time, better caching, loads only needed code.

**Q: What's the difference between Webpack and Vite?**

A: Webpack bundles everything before serving (slow dev start, mature ecosystem, highly configurable). Vite serves ES modules directly in dev (instant start, fast HMR), uses Rollup for production. Vite is faster for development, Webpack has more plugins and features.

**Q: How do dynamic imports work?**

A: Dynamic imports use `import()` function returning Promise. Enables lazy loading, code splitting, conditional imports. Webpack creates separate chunk for each dynamic import. Use for heavy features, route-based splitting, or conditional functionality. Improves performance by loading code only when needed.

---

[← Back to PWA](./05-progressive-web-apps-theory.md) | [Next: CSS Advanced →](./07-css-advanced-theory.md)
