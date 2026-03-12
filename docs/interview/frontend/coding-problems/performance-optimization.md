# Frontend Performance Optimization Problems

## Problem 1: Virtual Scrolling Implementation

### Problem Description

Implement virtual scrolling for a large list of items to improve performance.

### Requirements

- Handle thousands of items efficiently
- Maintain smooth scrolling
- Support dynamic item heights
- Implement proper recycling
- Handle scroll events optimally

### Solution

{% raw %}
```javascript
class VirtualScroller {
  constructor(container, options = {}) {
    this.container = container;
    this.itemHeight = options.itemHeight || 50;
    this.overscan = options.overscan || 5;
    this.items = [];
    this.visibleItems = new Map();
    this.scrollTop = 0;
    this.containerHeight = 0;
    this.totalHeight = 0;

    this.init();
  }

  init() {
    this.setupContainer();
    this.attachEventListeners();
    this.updateDimensions();
  }

  setupContainer() {
    this.container.innerHTML = `
      <div class="virtual-scroller">
        <div class="virtual-scroller-content"></div>
        <div class="virtual-scroller-spacer"></div>
      </div>
    `;

    this.content = this.container.querySelector(".virtual-scroller-content");
    this.spacer = this.container.querySelector(".virtual-scroller-spacer");
  }

  attachEventListeners() {
    let ticking = false;

    this.container.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener("resize", () => {
      this.updateDimensions();
      this.render();
    });
  }

  handleScroll() {
    const newScrollTop = this.container.scrollTop;
    if (Math.abs(newScrollTop - this.scrollTop) > this.itemHeight / 2) {
      this.scrollTop = newScrollTop;
      this.render();
    }
  }

  updateDimensions() {
    this.containerHeight = this.container.clientHeight;
    this.totalHeight = this.items.length * this.itemHeight;
    this.spacer.style.height = `${this.totalHeight}px`;
  }

  setItems(items) {
    this.items = items;
    this.updateDimensions();
    this.render();
  }

  render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex +
        Math.ceil(this.containerHeight / this.itemHeight) +
        this.overscan,
      this.items.length
    );

    const startIndexWithOverscan = Math.max(0, startIndex - this.overscan);
    const endIndexWithOverscan = Math.min(
      this.items.length,
      endIndex + this.overscan
    );

    // Remove items that are no longer visible
    for (const [index, element] of this.visibleItems) {
      if (index < startIndexWithOverscan || index >= endIndexWithOverscan) {
        element.remove();
        this.visibleItems.delete(index);
      }
    }

    // Add new visible items
    for (let i = startIndexWithOverscan; i < endIndexWithOverscan; i++) {
      if (!this.visibleItems.has(i)) {
        const element = this.renderItem(this.items[i], i);
        element.style.position = "absolute";
        element.style.top = `${i * this.itemHeight}px`;
        element.style.width = "100%";
        element.style.height = `${this.itemHeight}px`;

        this.content.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }

  renderItem(item, index) {
    const element = document.createElement("div");
    element.className = "virtual-item";
    element.innerHTML = `
      <div class="item-content">
        <span class="item-index">${index + 1}</span>
        <span class="item-text">${item.text}</span>
      </div>
    `;
    return element;
  }

  scrollToIndex(index) {
    const scrollTop = index * this.itemHeight;
    this.container.scrollTop = scrollTop;
  }

  getVisibleRange() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight),
      this.items.length
    );
    return { startIndex, endIndex };
  }
}

// Usage
const container = document.getElementById("virtual-scroll-container");
const virtualScroller = new VirtualScroller(container, {
  itemHeight: 60,
  overscan: 10,
});

// Generate large dataset
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  text: `Item ${
    i + 1
  } - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
}));

virtualScroller.setItems(items);
```
{% endraw %}

```css
.virtual-scroller {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.virtual-scroller-content {
  position: relative;
  width: 100%;
}

.virtual-scroller-spacer {
  width: 100%;
}

.virtual-item {
  border-bottom: 1px solid #eee;
  background: white;
  transition: background-color 0.2s;
}

.virtual-item:hover {
  background-color: #f8f9fa;
}

.item-content {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-index {
  font-weight: 600;
  color: #007bff;
  min-width: 40px;
}

.item-text {
  color: #333;
  line-height: 1.4;
}
```

## Problem 2: Image Lazy Loading

### Problem Description

Implement efficient lazy loading for images with intersection observer.

### Requirements

- Load images only when they're about to enter viewport
- Support multiple image formats
- Handle loading states
- Implement error handling
- Support responsive images

### Solution

```javascript
class LazyImageLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: "50px",
      threshold: 0.1,
      placeholder:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjwvc3ZnPg==",
      ...options,
    };

    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadImage(imgElement) {
    const src = imgElement.dataset.src;
    const srcset = imgElement.dataset.srcset;

    if (!src) return;

    // Create a new image to preload
    const tempImage = new Image();

    tempImage.onload = () => {
      imgElement.src = src;
      if (srcset) {
        imgElement.srcset = srcset;
      }
      imgElement.classList.remove("lazy");
      imgElement.classList.add("loaded");
    };

    tempImage.onerror = () => {
      imgElement.classList.add("error");
      imgElement.src = this.options.errorImage || this.options.placeholder;
    };

    tempImage.src = src;
  }

  observe(element) {
    if (element.tagName === "IMG") {
      this.observer.observe(element);
    } else {
      const images = element.querySelectorAll("img[data-src]");
      images.forEach((img) => this.observer.observe(img));
    }
  }

  unobserve(element) {
    this.observer.unobserve(element);
  }

  disconnect() {
    this.observer.disconnect();
  }
}

// Usage
const lazyLoader = new LazyImageLoader({
  rootMargin: "100px",
  threshold: 0.1,
});

// Observe all lazy images
document.addEventListener("DOMContentLoaded", () => {
  lazyLoader.observe(document.body);
});

// Example HTML
const imageGallery = `
  <div class="image-gallery">
    <img 
      class="lazy" 
      data-src="https://picsum.photos/400/300?random=1" 
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjwvc3ZnPg==" 
      alt="Image 1"
    />
    <img 
      class="lazy" 
      data-src="https://picsum.photos/400/300?random=2" 
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjwvc3ZnPg==" 
      alt="Image 2"
    />
    <img 
      class="lazy" 
      data-src="https://picsum.photos/400/300?random=3" 
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjwvc3ZnPg==" 
      alt="Image 3"
    />
  </div>
`;
```

```css
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.lazy {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  transition: opacity 0.3s ease;
  opacity: 0.7;
}

.lazy.loaded {
  opacity: 1;
}

.lazy.error {
  opacity: 0.5;
  filter: grayscale(1);
}

/* Loading animation */
.lazy:not(.loaded):not(.error) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## Problem 3: Debounced Search with Cache

### Problem Description

Implement a search functionality with debouncing and caching for better performance.

### Requirements

- Debounce search input
- Cache search results
- Handle loading states
- Implement cache invalidation
- Support pagination

### Solution

```javascript
class SearchManager {
  constructor(options = {}) {
    this.options = {
      debounceDelay: 300,
      cacheSize: 100,
      maxResults: 50,
      ...options,
    };

    this.cache = new Map();
    this.pendingRequests = new Map();
    this.debounceTimers = new Map();

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.debouncedSearch(e.target.value);
      });
    }
  }

  debouncedSearch(query) {
    const key = `search_${query}`;

    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.performSearch(query);
    }, this.options.debounceDelay);

    this.debounceTimers.set(key, timer);
  }

  async performSearch(query) {
    if (!query.trim()) {
      this.displayResults([]);
      return;
    }

    // Check cache first
    const cached = this.cache.get(query);
    if (cached) {
      this.displayResults(cached);
      return;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(query)) {
      return this.pendingRequests.get(query);
    }

    // Show loading state
    this.showLoading(true);

    // Create new request
    const request = this.fetchSearchResults(query);
    this.pendingRequests.set(query, request);

    try {
      const results = await request;

      // Cache results
      this.cacheResults(query, results);

      // Display results
      this.displayResults(results);
    } catch (error) {
      console.error("Search error:", error);
      this.showError("Search failed. Please try again.");
    } finally {
      this.pendingRequests.delete(query);
      this.showLoading(false);
    }
  }

  async fetchSearchResults(query) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      title: `Result ${i + 1} for "${query}"`,
      description: `This is a search result for "${query}". It contains relevant information.`,
      score: Math.random() * 100,
    })).sort((a, b) => b.score - a.score);

    return results.slice(0, this.options.maxResults);
  }

  cacheResults(query, results) {
    // Implement LRU cache
    if (this.cache.size >= this.options.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(query, results);
  }

  displayResults(results) {
    const resultsContainer = document.getElementById("search-results");
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.innerHTML =
        '<div class="no-results">No results found</div>';
      return;
    }

    const resultsHTML = results
      .map(
        (result) => `
      <div class="search-result" data-id="${result.id}">
        <h3 class="result-title">${result.title}</h3>
        <p class="result-description">${result.description}</p>
        <span class="result-score">${result.score.toFixed(1)}%</span>
      </div>
    `
      )
      .join("");

    resultsContainer.innerHTML = resultsHTML;
  }

  showLoading(show) {
    const loadingElement = document.getElementById("loading-indicator");
    if (loadingElement) {
      loadingElement.style.display = show ? "block" : "none";
    }
  }

  showError(message) {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";

      setTimeout(() => {
        errorElement.style.display = "none";
      }, 3000);
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Usage
const searchManager = new SearchManager({
  debounceDelay: 400,
  cacheSize: 50,
  maxResults: 30,
});
```

```css
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-results {
  margin-top: 20px;
}

.search-result {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.search-result:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
}

.result-description {
  margin: 0 0 8px 0;
  color: #666;
  line-height: 1.5;
}

.result-score {
  color: #007bff;
  font-weight: 600;
  font-size: 14px;
}

.loading-indicator {
  display: none;
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  display: none;
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}
```

## Key Performance Features

1. **Virtual Scrolling**: Efficient rendering of large lists
2. **Lazy Loading**: Images load only when needed
3. **Debouncing**: Reduces unnecessary API calls
4. **Caching**: Stores results to avoid repeated requests
5. **Request Deduplication**: Prevents duplicate requests
6. **Memory Management**: LRU cache with size limits
7. **Loading States**: Clear user feedback
8. **Error Handling**: Graceful error recovery
