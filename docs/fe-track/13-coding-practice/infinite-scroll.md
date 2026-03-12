# Infinite Scroll Implementation

## Problem Description

Implement infinite scroll functionality for a list of items.

## Requirements

- Load items in batches
- Show loading indicator
- Handle scroll events efficiently
- Support search/filtering
- Maintain scroll position

## Solution

{% raw %}
```javascript
class InfiniteScroll {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.items = [];
    this.currentPage = 0;
    this.loading = false;
    this.hasMore = true;

    this.options = {
      itemsPerPage: 20,
      threshold: 100, // pixels from bottom to trigger load
      ...options,
    };

    this.init();
  }

  init() {
    this.setupContainer();
    this.attachScrollListener();
    this.loadMoreItems();
  }

  setupContainer() {
    this.container.innerHTML = `
      <div class="infinite-scroll-container">
        <div class="items-list"></div>
        <div class="loading-indicator" style="display: none;">
          <div class="spinner"></div>
          <span>Loading more items...</span>
        </div>
        <div class="no-more-items" style="display: none;">
          No more items to load
        </div>
      </div>
    `;

    this.itemsList = this.container.querySelector(".items-list");
    this.loadingIndicator = this.container.querySelector(".loading-indicator");
    this.noMoreItems = this.container.querySelector(".no-more-items");
  }

  attachScrollListener() {
    let scrollTimeout;

    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        this.checkScrollPosition();
      }, 100);
    });
  }

  checkScrollPosition() {
    if (this.loading || !this.hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - this.options.threshold) {
      this.loadMoreItems();
    }
  }

  async loadMoreItems() {
    if (this.loading) return;

    this.loading = true;
    this.showLoading(true);

    try {
      const newItems = await this.fetchItems(
        this.currentPage,
        this.options.itemsPerPage
      );

      if (newItems.length === 0) {
        this.hasMore = false;
        this.showNoMoreItems();
      } else {
        this.items.push(...newItems);
        this.renderItems(newItems);
        this.currentPage++;
      }
    } catch (error) {
      console.error("Error loading items:", error);
      this.showError("Failed to load items");
    } finally {
      this.loading = false;
      this.showLoading(false);
    }
  }

  async fetchItems(page, limit) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        const items = [];

        for (let i = startIndex; i < endIndex; i++) {
          if (i < 1000) {
            // Simulate limited data
            items.push({
              id: i,
              title: `Item ${i + 1}`,
              description: `This is the description for item ${i + 1}`,
              image: `https://picsum.photos/200/200?random=${i}`,
            });
          }
        }

        resolve(items);
      }, 1000);
    });
  }

  renderItems(items) {
    const itemsHTML = items
      .map(
        (item) => `
      <div class="item-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="item-image">
        <div class="item-content">
          <h3 class="item-title">${item.title}</h3>
          <p class="item-description">${item.description}</p>
        </div>
      </div>
    `
      )
      .join("");

    this.itemsList.insertAdjacentHTML("beforeend", itemsHTML);
  }

  showLoading(show) {
    this.loadingIndicator.style.display = show ? "flex" : "none";
  }

  showNoMoreItems() {
    this.noMoreItems.style.display = "block";
  }

  showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    this.container.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  // Public methods
  refresh() {
    this.items = [];
    this.currentPage = 0;
    this.hasMore = true;
    this.itemsList.innerHTML = "";
    this.noMoreItems.style.display = "none";
    this.loadMoreItems();
  }

  search(query) {
    // Implement search functionality
    this.refresh();
  }
}

// Usage
const infiniteScroll = new InfiniteScroll("infinite-scroll-container");
```
{% endraw %}

## CSS Styling

```css
.infinite-scroll-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.item-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.item-content {
  padding: 16px;
}

.item-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.item-description {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-more-items {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .items-list {
    grid-template-columns: 1fr;
  }

  .item-card {
    margin-bottom: 16px;
  }
}
```

## Key Features

1. **Efficient Scroll Handling**: Uses debounced scroll events to prevent excessive function calls
2. **Loading States**: Clear visual feedback during data loading
3. **Error Handling**: Graceful error handling with user feedback
4. **Responsive Design**: Adapts to different screen sizes
5. **Performance Optimized**: Only loads data when needed
6. **Extensible**: Easy to add search, filtering, and other features

## Advanced Usage

```javascript
// With custom options
const advancedInfiniteScroll = new InfiniteScroll("container", {
  itemsPerPage: 50,
  threshold: 200,
  searchEnabled: true,
  filterOptions: {
    category: "all",
    sortBy: "date",
  },
});

// With custom item renderer
class CustomInfiniteScroll extends InfiniteScroll {
  renderItems(items) {
    const itemsHTML = items
      .map(
        (item) => `
      <div class="custom-item">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <button onclick="handleItemClick(${item.id})">View Details</button>
      </div>
    `
      )
      .join("");

    this.itemsList.insertAdjacentHTML("beforeend", itemsHTML);
  }
}
```
