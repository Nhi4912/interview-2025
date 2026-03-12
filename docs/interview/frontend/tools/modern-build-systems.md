# Modern Build Tools & DevOps for Frontend

## Overview
Modern frontend development relies heavily on sophisticated build tools and DevOps practices. Big Tech companies expect deep understanding of these systems for optimization, debugging, and scaling applications.

---

## Build Tool Comparisons & Implementation

### **Webpack vs Vite vs esbuild Performance Analysis**

{% raw %}
```typescript
// webpack.config.js - Advanced Configuration
import { Configuration, DefinePlugin, ProgressPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ModuleFederationPlugin } from '@module-federation/webpack';

interface BuildMetrics {
  buildTime: number;
  bundleSize: number;
  chunkCount: number;
  treeshakingEfficiency: number;
}

class WebpackOptimizer {
  private metrics: BuildMetrics = {
    buildTime: 0,
    bundleSize: 0,
    chunkCount: 0,
    treeshakingEfficiency: 0
  };

  createOptimizedConfig(env: 'development' | 'production'): Configuration {
    const isProduction = env === 'production';

    return {
      mode: env,
      
      // Advanced entry point configuration
      entry: {
        main: './src/index.tsx',
        // Separate vendor bundle for better caching
        vendor: ['react', 'react-dom', 'lodash'],
        // Dynamic imports for critical vs non-critical code
        critical: './src/critical.ts'
      },

      // Sophisticated output configuration
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction 
          ? '[name].[contenthash:8].js' 
          : '[name].js',
        chunkFilename: isProduction
          ? '[name].[contenthash:8].chunk.js'
          : '[name].chunk.js',
        publicPath: '/',
        clean: true,
        // Enable module federation
        uniqueName: 'main-app',
        // Optimize for HTTP/2
        chunkLoadingGlobal: 'webpackChunkLoadingGlobal'
      },

      // Advanced optimization strategies
      optimization: {
        minimize: isProduction,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: isProduction,
                drop_debugger: isProduction,
                pure_funcs: ['console.log', 'console.info'],
                // Advanced tree shaking
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                unsafe_math: true,
                unsafe_proto: true,
                unsafe_regexp: true
              },
              mangle: {
                safari10: true,
                properties: {
                  regex: /^_/
                }
              }
            },
            parallel: true,
            extractComments: false
          })
        ],

        // Advanced splitting strategy
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // Framework code (React, etc.)
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
              name: 'framework',
              chunks: 'all',
              priority: 40,
              enforce: true,
              reuseExistingChunk: true
            },
            // Large libraries
            lib: {
              test: /[\\/]node_modules[\\/](lodash|moment|date-fns)[\\/]/,
              name: 'lib',
              chunks: 'all',
              priority: 30,
              reuseExistingChunk: true
            },
            // Common code
            common: {
              name: 'common',
              chunks: 'all',
              priority: 20,
              minChunks: 2,
              reuseExistingChunk: true
            },
            // Default vendor chunk
            default: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true
            }
          }
        },

        // Module ID optimization
        moduleIds: isProduction ? 'deterministic' : 'named',
        chunkIds: isProduction ? 'deterministic' : 'named',

        // Runtime chunk for better caching
        runtimeChunk: {
          name: 'runtime'
        }
      },

      // Advanced module resolution
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@utils': path.resolve(__dirname, 'src/utils'),
          // Performance optimization: use production React
          ...(isProduction && {
            'react': 'react/umd/react.production.min.js',
            'react-dom': 'react-dom/umd/react-dom.production.min.js'
          })
        },
        // Prefer ES modules
        mainFields: ['browser', 'module', 'main'],
        // Resolve symlinks to actual files
        symlinks: false
      },

      module: {
        rules: [
          // TypeScript/JavaScript
          {
            test: /\.(ts|tsx|js|jsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env', {
                      useBuiltIns: 'usage',
                      corejs: 3,
                      targets: {
                        browsers: ['> 1%', 'last 2 versions']
                      }
                    }],
                    ['@babel/preset-react', { runtime: 'automatic' }],
                    '@babel/preset-typescript'
                  ],
                  plugins: [
                    // Dynamic imports for code splitting
                    '@babel/plugin-syntax-dynamic-import',
                    // Tree shaking optimization
                    ['babel-plugin-transform-imports', {
                      'lodash': {
                        transform: 'lodash/${member}',
                        preventFullImport: true
                      }
                    }]
                  ],
                  cacheDirectory: true
                }
              }
            ]
          },

          // CSS with advanced optimization
          {
            test: /\.css$/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    localIdentName: isProduction 
                      ? '[hash:base64:8]' 
                      : '[name]__[local]__[hash:base64:5]'
                  }
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      ['autoprefixer'],
                      ['cssnano', { preset: 'default' }]
                    ]
                  }
                }
              }
            ]
          },

          // Asset optimization
          {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 8 * 1024 // 8KB
              }
            },
            generator: {
              filename: 'assets/images/[name].[hash:8][ext]'
            }
          }
        ]
      },

      plugins: [
        // Environment variables
        new DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env),
          __DEV__: !isProduction,
          __PROD__: isProduction
        }),

        // Build progress
        new ProgressPlugin({
          activeModules: true,
          entries: true,
          modules: true,
          modulesCount: 5000,
          profile: false,
          dependencies: true,
          dependenciesCount: 10000
        }),

        // CSS extraction for production
        ...(isProduction ? [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css'
          })
        ] : []),

        // Bundle analysis
        ...(process.env.ANALYZE === 'true' ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: false
          })
        ] : []),

        // Module Federation for micro-frontends
        new ModuleFederationPlugin({
          name: 'main',
          filename: 'remoteEntry.js',
          exposes: {
            './App': './src/App',
            './utils': './src/utils'
          },
          shared: {
            react: { singleton: true, requiredVersion: '^18.0.0' },
            'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
          }
        })
      ],

      // Development server configuration
      devServer: {
        hot: true,
        historyApiFallback: true,
        compress: true,
        port: 3000,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },

      // Performance budgets
      performance: {
        maxEntrypointSize: 250000,
        maxAssetSize: 250000,
        hints: isProduction ? 'warning' : false
      },

      // Source maps
      devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map'
    };
  }

  // Performance monitoring
  measureBuildPerformance(startTime: number): BuildMetrics {
    this.metrics.buildTime = Date.now() - startTime;
    return this.metrics;
  }
}
```
{% endraw %}

### **Vite Configuration for Maximum Performance**

```typescript
// vite.config.ts
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin } from 'vite';

interface ViteOptimizationConfig {
  chunkSizeWarningLimit: number;
  rollupOptions: any;
  terserOptions: any;
}

class ViteOptimizer {
  createConfig(mode: string): ViteOptimizationConfig {
    const env = loadEnv(mode, process.cwd(), '');
    const isProduction = mode === 'production';

    return defineConfig({
      plugins: [
        react({
          // Fast Refresh optimization
          fastRefresh: !isProduction,
          // Babel optimization
          babel: {
            plugins: [
              // Remove console logs in production
              ...(isProduction ? [['babel-plugin-transform-remove-console']] : [])
            ]
          }
        }),
        
        // Vendor chunk splitting
        splitVendorChunkPlugin(),
        
        // Bundle analyzer
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true
        }),

        // Custom plugin for advanced optimizations
        this.createAdvancedOptimizationPlugin()
      ],

      // Advanced resolve configuration
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src'),
          '@components': resolve(__dirname, 'src/components'),
          '@utils': resolve(__dirname, 'src/utils'),
          // Performance alias for lighter alternatives
          'moment': 'dayjs',
          'lodash': 'lodash-es'
        },
        // Dedupe packages
        dedupe: ['react', 'react-dom']
      },

      // Build optimization
      build: {
        target: 'es2015',
        outDir: 'dist',
        sourcemap: isProduction ? true : false,
        minify: isProduction ? 'terser' : false,
        
        // Performance budget
        chunkSizeWarningLimit: 1000,
        
        rollupOptions: {
          output: {
            // Advanced chunking strategy
            manualChunks: {
              // Framework chunks
              'react-vendor': ['react', 'react-dom'],
              'router': ['react-router-dom'],
              
              // UI library chunks
              'ui-vendor': ['@mui/material', '@emotion/react'],
              
              // Utility chunks
              'utils': ['lodash-es', 'dayjs', 'axios']
            },
            
            // Optimize chunk naming
            chunkFileNames: (chunkInfo) => {
              const facadeModuleId = chunkInfo.facadeModuleId 
                ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
                : 'chunk';
              return `js/${facadeModuleId}-[hash].js`;
            }
          },
          
          // External dependencies for CDN
          external: isProduction ? ['react', 'react-dom'] : []
        },

        // Terser optimization
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
            pure_funcs: ['console.log'],
            // Advanced optimizations
            unsafe_arrows: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true
          },
          mangle: {
            properties: {
              regex: /^_/
            }
          },
          format: {
            comments: false
          }
        }
      },

      // Development server optimization
      server: {
        port: 3000,
        host: true,
        cors: true,
        // HMR optimization
        hmr: {
          overlay: false
        }
      },

      // Dependency optimization
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          'axios',
          'lodash-es'
        ],
        exclude: ['@vite/client', '@vite/env']
      },

      // CSS optimization
      css: {
        modules: {
          localsConvention: 'camelCase'
        },
        preprocessorOptions: {
          scss: {
            additionalData: `@import "@/styles/variables.scss";`
          }
        }
      }
    });
  }

  private createAdvancedOptimizationPlugin(): Plugin {
    return {
      name: 'advanced-optimization',
      buildStart() {
        console.log('🚀 Starting optimized build...');
      },
      generateBundle(options, bundle) {
        // Analyze bundle composition
        const chunks = Object.values(bundle).filter(chunk => chunk.type === 'chunk');
        const totalSize = chunks.reduce((size, chunk) => size + chunk.code.length, 0);
        
        console.log(`📦 Generated ${chunks.length} chunks, total size: ${(totalSize / 1024).toFixed(2)}KB`);
        
        // Warn about large chunks
        chunks.forEach(chunk => {
          if (chunk.code.length > 500000) { // 500KB
            console.warn(`⚠️  Large chunk detected: ${chunk.fileName} (${(chunk.code.length / 1024).toFixed(2)}KB)`);
          }
        });
      }
    };
  }
}
```

### **esbuild for Maximum Speed**

```typescript
// esbuild.config.ts
import { build, BuildOptions, Plugin } from 'esbuild';
import { resolve } from 'path';

class ESBuildOptimizer {
  async createOptimizedBuild(mode: 'development' | 'production'): Promise<void> {
    const isProduction = mode === 'production';

    const config: BuildOptions = {
      entryPoints: ['src/index.tsx'],
      bundle: true,
      outdir: 'dist',
      format: 'esm',
      target: 'es2020',
      platform: 'browser',
      
      // Advanced splitting
      splitting: true,
      chunkNames: 'chunks/[name]-[hash]',
      assetNames: 'assets/[name]-[hash]',
      
      // Optimization
      minify: isProduction,
      sourcemap: isProduction ? 'external' : 'inline',
      treeShaking: true,
      
      // Define globals
      define: {
        'process.env.NODE_ENV': `"${mode}"`,
        __DEV__: String(!isProduction)
      },
      
      // Loader configuration
      loader: {
        '.png': 'file',
        '.jpg': 'file',
        '.svg': 'dataurl',
        '.woff': 'file',
        '.woff2': 'file'
      },
      
      // External dependencies
      external: isProduction ? [] : ['react', 'react-dom'],
      
      // Plugins
      plugins: [
        this.createReactPlugin(),
        this.createCSSPlugin(),
        this.createAnalysisPlugin()
      ],
      
      // Advanced options
      metafile: true,
      write: true,
      
      // Performance
      logLevel: 'info',
      color: true
    };

    const result = await build(config);
    
    if (result.metafile) {
      await this.analyzeBundle(result.metafile);
    }
  }

  private createReactPlugin(): Plugin {
    return {
      name: 'react',
      setup(build) {
        // Handle JSX
        build.onResolve({ filter: /^react$/ }, () => ({
          path: require.resolve('react'),
          external: false
        }));

        build.onResolve({ filter: /^react-dom$/ }, () => ({
          path: require.resolve('react-dom'),
          external: false
        }));
      }
    };
  }

  private createCSSPlugin(): Plugin {
    return {
      name: 'css',
      setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
          const css = await fs.readFile(args.path, 'utf8');
          
          // Simple CSS modules implementation
          if (args.path.includes('.module.css')) {
            const className = `module_${Math.random().toString(36).substr(2, 9)}`;
            const processedCSS = css.replace(/\.([a-zA-Z][\w-]*)/g, `.${className}_$1`);
            
            return {
              contents: `
                const style = document.createElement('style');
                style.textContent = ${JSON.stringify(processedCSS)};
                document.head.appendChild(style);
                export default ${JSON.stringify({ className })};
              `,
              loader: 'js'
            };
          }
          
          return {
            contents: `
              const style = document.createElement('style');
              style.textContent = ${JSON.stringify(css)};
              document.head.appendChild(style);
            `,
            loader: 'js'
          };
        });
      }
    };
  }

  private createAnalysisPlugin(): Plugin {
    return {
      name: 'analysis',
      setup(build) {
        let startTime: number;
        
        build.onStart(() => {
          startTime = Date.now();
          console.log('🏗️  Starting esbuild...');
        });
        
        build.onEnd((result) => {
          const duration = Date.now() - startTime;
          console.log(`✅ Build completed in ${duration}ms`);
          
          if (result.errors.length > 0) {
            console.error('❌ Build errors:', result.errors);
          }
          
          if (result.warnings.length > 0) {
            console.warn('⚠️  Build warnings:', result.warnings);
          }
        });
      }
    };
  }

  private async analyzeBundle(metafile: any): Promise<void> {
    const analysis = await analyze(metafile);
    
    console.log('\n📊 Bundle Analysis:');
    console.log(`Total size: ${(analysis.bytes / 1024).toFixed(2)}KB`);
    
    // Show largest modules
    const modules = Object.entries(analysis.inputs)
      .sort(([,a], [,b]) => (b as any).bytes - (a as any).bytes)
      .slice(0, 10);
    
    console.log('\n🔍 Largest modules:');
    modules.forEach(([path, info]) => {
      console.log(`  ${path}: ${((info as any).bytes / 1024).toFixed(2)}KB`);
    });
  }
}
```

---

## CI/CD Pipeline Implementation

### **GitHub Actions for Frontend**

```yaml
# .github/workflows/frontend-ci-cd.yml
name: Frontend CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18.x'
  CACHE_KEY: v1

jobs:
  # Quality checks
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint:ci
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run tests with coverage
        run: npm run test:coverage
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        
      - name: Security audit
        run: npm audit --audit-level=high

  # Build and test
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: quality
    
    strategy:
      matrix:
        build-type: [development, production]
        
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build:${{ matrix.build-type }}
        env:
          NODE_ENV: ${{ matrix.build-type }}
          
      - name: Analyze bundle size
        if: matrix.build-type == 'production'
        run: npm run analyze
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.build-type }}
          path: dist/
          retention-days: 7

  # Performance testing
  performance:
    name: Performance Testing
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-production
          path: dist/
          
      - name: Start test server
        run: |
          npm install -g serve
          serve -s dist -p 3000 &
          sleep 5
          
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: '.lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

  # Visual regression testing
  visual-testing:
    name: Visual Regression Testing
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-production
          path: dist/
          
      - name: Run Percy visual tests
        uses: percy/exec-action@v0.3.1
        with:
          command: npm run test:visual
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}

  # Security scanning
  security:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: quality
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          
      - name: Upload Snyk results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: snyk.sarif

  # Deployment
  deploy:
    name: Deploy to Environment
    runs-on: ubuntu-latest
    needs: [build, performance, visual-testing, security]
    if: github.ref == 'refs/heads/main'
    
    environment:
      name: production
      url: https://your-app.com
      
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-production
          path: dist/
          
      - name: Deploy to AWS S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1
          
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: 'Frontend deployment completed successfully! 🚀'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### **Advanced Performance Monitoring**

```typescript
// performance-monitor.ts
interface PerformanceMetrics {
  buildTime: number;
  bundleSize: number;
  cacheHitRate: number;
  testCoverage: number;
  lighthouseScore: number;
}

class CIPerfomanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private thresholds = {
    buildTime: 180000, // 3 minutes
    bundleSize: 500000, // 500KB
    cacheHitRate: 0.8, // 80%
    testCoverage: 0.85, // 85%
    lighthouseScore: 90 // 90/100
  };

  async measureBuildPerformance(): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    
    // Measure bundle size
    const bundleStats = await this.analyzeBundleSize();
    
    // Check cache performance
    const cacheStats = await this.analyzeCachePerformance();
    
    // Get test coverage
    const coverage = await this.getTestCoverage();
    
    // Run Lighthouse
    const lighthouseScore = await this.runLighthouseTest();
    
    const metrics: PerformanceMetrics = {
      buildTime: Date.now() - startTime,
      bundleSize: bundleStats.totalSize,
      cacheHitRate: cacheStats.hitRate,
      testCoverage: coverage.percentage,
      lighthouseScore: lighthouseScore.performance
    };

    this.metrics.push(metrics);
    await this.validateMetrics(metrics);
    
    return metrics;
  }

  private async analyzeBundleSize(): Promise<{ totalSize: number; chunks: any[] }> {
    const stats = require('./dist/stats.json');
    
    const totalSize = stats.assets.reduce((sum: number, asset: any) => {
      return sum + asset.size;
    }, 0);

    const chunks = stats.chunks.map((chunk: any) => ({
      name: chunk.names[0],
      size: chunk.size,
      modules: chunk.modules?.length || 0
    }));

    return { totalSize, chunks };
  }

  private async analyzeCachePerformance(): Promise<{ hitRate: number; totalRequests: number }> {
    // Analyze cache headers and hit rates
    const cacheReport = await fetch('/api/cache-stats').then(r => r.json());
    
    return {
      hitRate: cacheReport.hits / cacheReport.total,
      totalRequests: cacheReport.total
    };
  }

  private async getTestCoverage(): Promise<{ percentage: number; lines: number; functions: number }> {
    const coverage = require('./coverage/coverage-summary.json');
    
    return {
      percentage: coverage.total.lines.pct / 100,
      lines: coverage.total.lines.covered,
      functions: coverage.total.functions.covered
    };
  }

  private async runLighthouseTest(): Promise<{ performance: number; accessibility: number; bestPractices: number; seo: number }> {
    const lighthouse = require('lighthouse');
    const chromeLauncher = require('chrome-launcher');

    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', port: chrome.port };
    
    const runnerResult = await lighthouse('http://localhost:3000', options);
    await chrome.kill();

    const scores = runnerResult.lhr.categories;
    
    return {
      performance: Math.round(scores.performance.score * 100),
      accessibility: Math.round(scores.accessibility.score * 100),
      bestPractices: Math.round(scores['best-practices'].score * 100),
      seo: Math.round(scores.seo.score * 100)
    };
  }

  private async validateMetrics(metrics: PerformanceMetrics): Promise<void> {
    const violations: string[] = [];

    if (metrics.buildTime > this.thresholds.buildTime) {
      violations.push(`Build time exceeded threshold: ${metrics.buildTime}ms > ${this.thresholds.buildTime}ms`);
    }

    if (metrics.bundleSize > this.thresholds.bundleSize) {
      violations.push(`Bundle size exceeded threshold: ${metrics.bundleSize} bytes > ${this.thresholds.bundleSize} bytes`);
    }

    if (metrics.cacheHitRate < this.thresholds.cacheHitRate) {
      violations.push(`Cache hit rate below threshold: ${metrics.cacheHitRate} < ${this.thresholds.cacheHitRate}`);
    }

    if (metrics.testCoverage < this.thresholds.testCoverage) {
      violations.push(`Test coverage below threshold: ${metrics.testCoverage} < ${this.thresholds.testCoverage}`);
    }

    if (metrics.lighthouseScore < this.thresholds.lighthouseScore) {
      violations.push(`Lighthouse score below threshold: ${metrics.lighthouseScore} < ${this.thresholds.lighthouseScore}`);
    }

    if (violations.length > 0) {
      console.error('❌ Performance thresholds violated:');
      violations.forEach(violation => console.error(`  - ${violation}`));
      
      // Fail the build if in CI
      if (process.env.CI) {
        process.exit(1);
      }
    } else {
      console.log('✅ All performance thresholds met!');
    }
  }

  generatePerformanceReport(): string {
    const latest = this.metrics[this.metrics.length - 1];
    const previous = this.metrics[this.metrics.length - 2];

    let report = '📊 **Performance Report**\n\n';
    
    if (previous) {
      const buildTimeDiff = ((latest.buildTime - previous.buildTime) / previous.buildTime * 100).toFixed(1);
      const bundleSizeDiff = ((latest.bundleSize - previous.bundleSize) / previous.bundleSize * 100).toFixed(1);
      
      report += `**Build Time**: ${latest.buildTime}ms (${buildTimeDiff}% change)\n`;
      report += `**Bundle Size**: ${(latest.bundleSize / 1024).toFixed(2)}KB (${bundleSizeDiff}% change)\n`;
    } else {
      report += `**Build Time**: ${latest.buildTime}ms\n`;
      report += `**Bundle Size**: ${(latest.bundleSize / 1024).toFixed(2)}KB\n`;
    }
    
    report += `**Cache Hit Rate**: ${(latest.cacheHitRate * 100).toFixed(1)}%\n`;
    report += `**Test Coverage**: ${(latest.testCoverage * 100).toFixed(1)}%\n`;
    report += `**Lighthouse Score**: ${latest.lighthouseScore}/100\n`;

    return report;
  }
}
```

### **Docker Optimization for Frontend**

```dockerfile
# Dockerfile.frontend
# Multi-stage build for optimal image size
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build
COPY . .
RUN npm ci
RUN npm run build
RUN npm run test:ci

# Production stage
FROM nginx:alpine AS production

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

USER nextjs

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf - Optimized for performance
worker_processes auto;
pid /tmp/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Brotli compression (if module available)
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Cache HTML with short expiry
        location ~* \.html$ {
            expires 1h;
            add_header Cache-Control "public, must-revalidate";
        }

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

This comprehensive build tools and DevOps setup provides the foundation for enterprise-scale frontend development, addressing performance, security, and maintainability concerns that are critical in Big Tech environments.
