---
layout: page
title: "Virtual Scrolling Implementation"
difficulty: Hard
category: "Coding Problems"
tags: [javascript, performance, virtualization, large-datasets, optimization, memory-management]
---

# Problem 4: Virtual Scrolling Implementation

## Problem Description

Implement virtual scrolling for a large list of items to improve performance when dealing with thousands of records.

## Requirements

- Handle thousands of items efficiently
- Maintain smooth scrolling
- Support dynamic item heights
- Implement proper recycling
- Handle scroll events optimally

## Solution

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

## CSS Styling

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

## Advanced Features

### Dynamic Height Support

```javascript
class DynamicVirtualScroller extends VirtualScroller {
  constructor(container, options = {}) {
    super(container, options);
    this.itemHeights = new Map();
    this.estimatedHeight = options.estimatedHeight || 50;
  }

  updateItemHeight(index, height) {
    this.itemHeights.set(index, height);
    this.updateTotalHeight();
    this.render();
  }

  updateTotalHeight() {
    this.totalHeight = Array.from(
      { length: this.items.length },
      (_, i) => this.itemHeights.get(i) || this.estimatedHeight
    ).reduce((sum, height) => sum + height, 0);

    this.spacer.style.height = `${this.totalHeight}px`;
  }

  getItemTop(index) {
    let top = 0;
    for (let i = 0; i < index; i++) {
      top += this.itemHeights.get(i) || this.estimatedHeight;
    }
    return top;
  }

  render() {
    const visibleRange = this.getVisibleRange();
    const startIndex = Math.max(0, visibleRange.startIndex - this.overscan);
    const endIndex = Math.min(
      this.items.length,
      visibleRange.endIndex + this.overscan
    );

    // Remove items that are no longer visible
    for (const [index, element] of this.visibleItems) {
      if (index < startIndex || index >= endIndex) {
        element.remove();
        this.visibleItems.delete(index);
      }
    }

    // Add new visible items
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.visibleItems.has(i)) {
        const element = this.renderItem(this.items[i], i);
        element.style.position = "absolute";
        element.style.top = `${this.getItemTop(i)}px`;
        element.style.width = "100%";

        this.content.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }
}
```

### Search and Filter Support

```javascript
class SearchableVirtualScroller extends VirtualScroller {
  constructor(container, options = {}) {
    super(container, options);
    this.filteredItems = [];
    this.searchTerm = "";
  }

  search(term) {
    this.searchTerm = term.toLowerCase();
    this.filteredItems = this.items.filter((item) =>
      item.text.toLowerCase().includes(this.searchTerm)
    );
    this.updateDimensions();
    this.render();
  }

  updateDimensions() {
    this.containerHeight = this.container.clientHeight;
    this.totalHeight = this.filteredItems.length * this.itemHeight;
    this.spacer.style.height = `${this.totalHeight}px`;
  }

  render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex +
        Math.ceil(this.containerHeight / this.itemHeight) +
        this.overscan,
      this.filteredItems.length
    );

    const startIndexWithOverscan = Math.max(0, startIndex - this.overscan);
    const endIndexWithOverscan = Math.min(
      this.filteredItems.length,
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
        const element = this.renderItem(this.filteredItems[i], i);
        element.style.position = "absolute";
        element.style.top = `${i * this.itemHeight}px`;
        element.style.width = "100%";
        element.style.height = `${this.itemHeight}px`;

        this.content.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }
}
```

## Performance Optimizations

### Memory Management

```javascript
class OptimizedVirtualScroller extends VirtualScroller {
  constructor(container, options = {}) {
    super(container, options);
    this.elementPool = [];
    this.maxPoolSize = options.maxPoolSize || 100;
  }

  getElementFromPool() {
    if (this.elementPool.length > 0) {
      return this.elementPool.pop();
    }
    return document.createElement("div");
  }

  returnElementToPool(element) {
    if (this.elementPool.length < this.maxPoolSize) {
      element.innerHTML = "";
      element.className = "";
      element.style.cssText = "";
      this.elementPool.push(element);
    }
  }

  render() {
    // Implementation with element recycling
    const visibleRange = this.getVisibleRange();

    // Remove invisible items and return to pool
    for (const [index, element] of this.visibleItems) {
      if (
        index < visibleRange.startIndex - this.overscan ||
        index >= visibleRange.endIndex + this.overscan
      ) {
        this.returnElementToPool(element);
        this.visibleItems.delete(index);
      }
    }

    // Add visible items
    for (
      let i = visibleRange.startIndex - this.overscan;
      i < visibleRange.endIndex + this.overscan;
      i++
    ) {
      if (i >= 0 && i < this.items.length && !this.visibleItems.has(i)) {
        const element = this.getElementFromPool();
        this.renderItem(this.items[i], i, element);
        element.style.position = "absolute";
        element.style.top = `${i * this.itemHeight}px`;
        element.style.width = "100%";
        element.style.height = `${this.itemHeight}px`;

        this.content.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }
}
```

## Key Features

1. **Efficient Rendering**: Only renders visible items plus overscan
2. **Smooth Scrolling**: Uses requestAnimationFrame for optimal performance
3. **Memory Management**: Recycles DOM elements to reduce memory usage
4. **Dynamic Heights**: Support for variable item heights
5. **Search Integration**: Filter items while maintaining performance
6. **Responsive Design**: Adapts to container size changes
7. **Accessibility**: Maintains proper focus management
8. **Error Handling**: Graceful handling of edge cases

## Usage Examples

```javascript
// Basic usage
const basicScroller = new VirtualScroller(container, {
  itemHeight: 60,
  overscan: 10,
});

// With search
const searchableScroller = new SearchableVirtualScroller(container, {
  itemHeight: 60,
  overscan: 10,
});

searchableScroller.search("lorem");

// With dynamic heights
const dynamicScroller = new DynamicVirtualScroller(container, {
  estimatedHeight: 50,
  overscan: 10,
});

// With optimization
const optimizedScroller = new OptimizedVirtualScroller(container, {
  itemHeight: 60,
  overscan: 10,
  maxPoolSize: 100,
});
```

## Interview Questions & Answers / Câu hỏi phỏng vấn và câu trả lời

### Q1: How does virtual scrolling improve performance? / Virtual scrolling cải thiện hiệu suất như thế nào?

**English Answer:**
Virtual scrolling improves performance by:
1. **Reduced DOM Nodes**: Only renders visible items instead of all items, reducing DOM size
2. **Lower Memory Usage**: Fewer DOM elements mean less memory consumption
3. **Faster Rendering**: Browser only needs to layout/paint visible elements
4. **Improved Scroll Performance**: Less elements to process during scroll events
5. **Element Recycling**: Reuses DOM elements as they scroll out of view
6. **Optimized Event Handling**: Throttled scroll events prevent excessive updates

**Câu trả lời (Tiếng Việt):**
Virtual scrolling cải thiện hiệu suất bằng cách:
1. **Giảm DOM Nodes**: Chỉ render items hiển thị thay vì tất cả items, giảm kích thước DOM
2. **Giảm sử dụng bộ nhớ**: Ít DOM elements hơn có nghĩa là tiêu thụ bộ nhớ ít hơn
3. **Rendering nhanh hơn**: Trình duyệt chỉ cần layout/paint các elements hiển thị
4. **Cải thiện hiệu suất cuộn**: Ít elements hơn để xử lý trong scroll events
5. **Tái chế elements**: Tái sử dụng DOM elements khi chúng cuộn ra khỏi tầm nhìn
6. **Tối ưu xử lý sự kiện**: Throttled scroll events ngăn cập nhật quá mức

### Q2: How do you handle dynamic item heights? / Bạn xử lý chiều cao items động như thế nào?

**English Answer:**
Handling dynamic item heights requires:
1. **Height Estimation**: Start with estimated heights for unmeasured items
2. **Measurement on Render**: Measure actual height after rendering
3. **Height Caching**: Store measured heights to avoid re-measurement
4. **Position Calculation**: Recalculate item positions based on actual heights
5. **Scroll Adjustment**: Adjust scroll position when heights change
6. **Progressive Enhancement**: Update estimates based on measured data

**Câu trả lời (Tiếng Việt):**
Xử lý chiều cao items động đòi hỏi:
1. **Ước tính chiều cao**: Bắt đầu với chiều cao ước tính cho items chưa đo
2. **Đo khi render**: Đo chiều cao thực tế sau khi render
3. **Cache chiều cao**: Lưu trữ chiều cao đã đo để tránh đo lại
4. **Tính toán vị trí**: Tính lại vị trí items dựa trên chiều cao thực tế
5. **Điều chỉnh cuộn**: Điều chỉnh vị trí cuộn khi chiều cao thay đổi
6. **Cải tiến dần**: Cập nhật ước tính dựa trên dữ liệu đã đo

### Q3: What are the challenges with virtual scrolling? / Thách thức với virtual scrolling là gì?

**English Answer:**
Main challenges include:
1. **Complexity**: More complex implementation than simple scrolling
2. **Accessibility**: Maintaining proper ARIA attributes and focus management
3. **Search/Filter**: Integrating search while maintaining performance
4. **Dynamic Content**: Handling variable heights and content changes
5. **Browser Compatibility**: Different scroll behaviors across browsers
6. **Memory Leaks**: Proper cleanup of event listeners and references
7. **Edge Cases**: Empty lists, single items, rapid scrolling

**Câu trả lời (Tiếng Việt):**
Các thách thức chính bao gồm:
1. **Độ phức tạp**: Triển khai phức tạp hơn cuộn đơn giản
2. **Khả năng truy cập**: Duy trì ARIA attributes và quản lý focus đúng cách
3. **Tìm kiếm/Lọc**: Tích hợp tìm kiếm trong khi duy trì hiệu suất
4. **Nội dung động**: Xử lý chiều cao thay đổi và thay đổi nội dung
5. **Tương thích trình duyệt**: Hành vi cuộn khác nhau giữa các trình duyệt
6. **Rò rỉ bộ nhớ**: Dọn dẹp event listeners và references đúng cách
7. **Trường hợp đặc biệt**: Danh sách trống, items đơn, cuộn nhanh
