# Frontend Projects & Practice Guide

## Table of Contents

- [Project Categories](#project-categories)
- [Beginner Projects](#beginner-projects)
- [Intermediate Projects](#intermediate-projects)
- [Advanced Projects](#advanced-projects)
- [Portfolio Projects](#portfolio-projects)
- [Implementation Strategies](#implementation-strategies)
- [Best Practices](#best-practices)
- [Project Ideas](#project-ideas)

## Project Categories

### Skill-Based Projects

#### 1. React Projects

- Component libraries
- State management applications
- Hooks-based utilities
- Performance optimization demos

#### 2. JavaScript Projects

- Vanilla JS applications
- ES6+ features showcase
- Algorithm visualizations
- Game development

#### 3. CSS Projects

- Responsive layouts
- Animation libraries
- Design systems
- Interactive components

#### 4. Full-Stack Projects

- MERN stack applications
- Real-time applications
- E-commerce platforms
- Social media clones

## Beginner Projects

### 1. Todo Application

**Description**: Classic todo app with CRUD operations.

**Features**:

- Add, edit, delete todos
- Mark as complete
- Filter by status
- Local storage persistence

**Technologies**:

- React/Vue.js
- CSS/SCSS
- Local Storage API

**Implementation**:

```javascript
// App.js
import React, { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}
```

### 2. Weather Dashboard

**Description**: Weather application with API integration.

**Features**:

- Current weather display
- 5-day forecast
- Location search
- Responsive design

**Technologies**:

- React
- OpenWeatherMap API
- CSS Grid/Flexbox
- Geolocation API

### 3. Calculator

**Description**: Functional calculator with advanced operations.

**Features**:

- Basic arithmetic operations
- Scientific functions
- History tracking
- Keyboard support

**Technologies**:

- Vanilla JavaScript
- CSS Grid
- Event handling

## Intermediate Projects

### 1. E-commerce Platform

**Description**: Full-featured online store.

**Features**:

- Product catalog
- Shopping cart
- User authentication
- Payment integration
- Admin dashboard

**Technologies**:

- React/Next.js
- Node.js/Express
- MongoDB/PostgreSQL
- Stripe API
- JWT authentication

**Implementation Structure**:

```
ecommerce/
├── frontend/
│   ├── components/
│   │   ├── ProductCard.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   └── AdminPanel.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Products.js
│   │   ├── ProductDetail.js
│   │   └── Checkout.js
│   ├── hooks/
│   │   ├── useCart.js
│   │   └── useAuth.js
│   └── services/
│       ├── api.js
│       └── stripe.js
└── backend/
    ├── routes/
    ├── models/
    ├── middleware/
    └── controllers/
```

### 2. Real-time Chat Application

**Description**: Chat app with real-time messaging.

**Features**:

- Real-time messaging
- User authentication
- File sharing
- Typing indicators
- Message history

**Technologies**:

- React
- Socket.io
- Node.js
- MongoDB
- JWT

**Implementation**:

```javascript
// Chat component
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket) {
      socket.emit("message", {
        text: input,
        user: "currentUser",
        timestamp: new Date(),
      });
      setInput("");
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
```

### 3. Task Management System

**Description**: Project management tool like Trello.

**Features**:

- Kanban board
- Drag and drop
- Team collaboration
- File attachments
- Progress tracking

**Technologies**:

- React
- React DnD
- Node.js
- PostgreSQL
- WebSockets

## Advanced Projects

### 1. Social Media Platform

**Description**: Full-featured social networking site.

**Features**:

- User profiles
- Posts and comments
- Follow/unfollow
- News feed
- Direct messaging
- Notifications

**Technologies**:

- React/Next.js
- GraphQL
- Node.js
- PostgreSQL
- Redis
- AWS S3

**Architecture**:

```
social-media/
├── frontend/
│   ├── components/
│   │   ├── Feed/
│   │   ├── Profile/
│   │   ├── Post/
│   │   └── Navigation/
│   ├── pages/
│   ├── hooks/
│   └── services/
├── backend/
│   ├── graphql/
│   ├── resolvers/
│   ├── models/
│   └── middleware/
└── infrastructure/
    ├── docker/
    ├── nginx/
    └── database/
```

### 2. Video Streaming Platform

**Description**: YouTube-like video platform.

**Features**:

- Video upload/streaming
- User channels
- Comments and likes
- Video recommendations
- Search functionality

**Technologies**:

- React
- Node.js
- FFmpeg
- AWS S3/CloudFront
- PostgreSQL
- Redis

### 3. Real-time Dashboard

**Description**: Analytics dashboard with real-time data.

**Features**:

- Real-time charts
- Data visualization
- Multiple data sources
- Custom widgets
- Export functionality

**Technologies**:

- React
- D3.js/Chart.js
- WebSockets
- Node.js
- InfluxDB/TimescaleDB

## Portfolio Projects

### 1. Personal Portfolio Website

**Description**: Showcase your skills and projects.

**Features**:

- Responsive design
- Project showcase
- Skills section
- Contact form
- Blog section
- Dark/light theme

**Technologies**:

- React/Next.js
- Framer Motion
- Tailwind CSS
- Email.js

### 2. Component Library

**Description**: Reusable UI component library.

**Features**:

- Comprehensive components
- Documentation
- Storybook integration
- TypeScript support
- Accessibility compliance

**Technologies**:

- React
- TypeScript
- Storybook
- Jest
- Rollup

### 3. Developer Tools

**Description**: Tools for developers.

**Features**:

- Code formatter
- Color palette generator
- API testing tool
- Performance analyzer
- Code snippet manager

**Technologies**:

- React
- Monaco Editor
- Web APIs
- Local Storage

## Implementation Strategies

### 1. Project Planning

**Steps**:

1. Define requirements
2. Create wireframes
3. Choose technology stack
4. Set up project structure
5. Plan development phases

### 2. Development Workflow

**Process**:

1. Set up development environment
2. Create basic structure
3. Implement core features
4. Add advanced features
5. Testing and optimization
6. Deployment

### 3. Code Organization

**Structure**:

```
project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── styles/
├── public/
├── tests/
├── docs/
└── config/
```

### 4. Testing Strategy

**Approach**:

- Unit tests for components
- Integration tests for features
- E2E tests for user flows
- Performance testing
- Accessibility testing

## Best Practices

### 1. Code Quality

- Use TypeScript for type safety
- Implement ESLint and Prettier
- Follow consistent naming conventions
- Write meaningful comments
- Use proper error handling

### 2. Performance

- Implement code splitting
- Optimize images and assets
- Use lazy loading
- Monitor Core Web Vitals
- Implement caching strategies

### 3. User Experience

- Responsive design
- Accessibility compliance
- Loading states
- Error boundaries
- Progressive enhancement

### 4. Security

- Input validation
- XSS prevention
- CSRF protection
- Secure authentication
- HTTPS enforcement

## Project Ideas

### Frontend-Focused Projects

#### 1. Interactive Data Visualization

- COVID-19 dashboard
- Stock market tracker
- Weather analytics
- Social media analytics

#### 2. Creative Applications

- Music visualizer
- Photo editor
- Drawing app
- Animation creator

#### 3. Productivity Tools

- Note-taking app
- Time tracker
- Habit tracker
- Goal manager

### Full-Stack Projects

#### 1. Content Management System

- Blog platform
- Portfolio builder
- Documentation site
- Learning management system

#### 2. Business Applications

- Inventory management
- Customer relationship management
- Project management
- Accounting software

#### 3. Entertainment Platforms

- Music streaming
- Movie database
- Gaming platform
- Event management

### Advanced Concepts

#### 1. Progressive Web Apps

- Offline functionality
- Push notifications
- App-like experience
- Background sync

#### 2. Real-time Applications

- Live collaboration tools
- Gaming platforms
- Chat applications
- Live streaming

#### 3. AI/ML Integration

- Recommendation systems
- Image recognition
- Natural language processing
- Predictive analytics

## Project Showcase Tips

### 1. Documentation

- README with setup instructions
- API documentation
- Architecture diagrams
- Deployment guide

### 2. Demo

- Live demo link
- Screenshots/videos
- Feature walkthrough
- Performance metrics

### 3. Code Quality

- Clean, readable code
- Proper error handling
- Comprehensive testing
- Performance optimization

### 4. Deployment

- Production deployment
- CI/CD pipeline
- Monitoring setup
- Backup strategies

---

_This guide provides a comprehensive roadmap for building impressive frontend projects. Focus on creating projects that demonstrate your technical skills, problem-solving abilities, and understanding of modern web development practices._

# Projects & Practice Interview Preparation

## Real-World Applications

### E-Commerce Platform

**Challenge**: Build a complete e-commerce platform with product catalog, cart, checkout, and user management.

**Key Features**:

- Product catalog with filtering and search
- Shopping cart with persistent state
- User authentication and profiles
- Order management and tracking
- Payment integration (Stripe)
- Admin dashboard
- Responsive design

**Technical Requirements**:

```javascript
// Product catalog with advanced filtering
class ProductCatalog {
  constructor() {
    this.products = [];
    this.filters = {
      category: [],
      price: { min: 0, max: Infinity },
      rating: 0,
      availability: "all",
    };
    this.sortBy = "name";
    this.page = 1;
    this.itemsPerPage = 20;
  }

  setFilter(type, value) {
    this.filters[type] = value;
    this.page = 1; // Reset to first page
  }

  getFilteredProducts() {
    let filtered = this.products.filter((product) => {
      // Category filter
      if (
        this.filters.category.length > 0 &&
        !this.filters.category.includes(product.category)
      ) {
        return false;
      }

      // Price filter
      if (
        product.price < this.filters.price.min ||
        product.price > this.filters.price.max
      ) {
        return false;
      }

      // Rating filter
      if (product.rating < this.filters.rating) {
        return false;
      }

      // Availability filter
      if (this.filters.availability === "inStock" && !product.inStock) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Pagination
    const start = (this.page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return {
      products: filtered.slice(start, end),
      total: filtered.length,
      pages: Math.ceil(filtered.length / this.itemsPerPage),
    };
  }
}

// Shopping cart with persistence
class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage();
    this.listeners = [];
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    this.saveToStorage();
    this.notifyListeners();
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveToStorage();
    this.notifyListeners();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(productId);
      } else {
        this.saveToStorage();
        this.notifyListeners();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  clear() {
    this.items = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("shopping-cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("shopping-cart", JSON.stringify(this.items));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.items));
  }
}
```

### Real-Time Chat Application

**Challenge**: Create a real-time chat application with WebSocket communication, user presence, and message history.

**Key Features**:

- Real-time messaging
- User presence indicators
- Message history and search
- File sharing
- Typing indicators
- Message reactions
- Group chats
- Push notifications

**Technical Implementation**:

{% raw %}
```javascript
class ChatApplication {
  constructor() {
    this.socket = null;
    this.currentUser = null;
    this.rooms = new Map();
    this.users = new Map();
    this.messageHistory = new Map();
    this.typingUsers = new Map();
    this.connectionStatus = "disconnected";
  }

  connect(userId, token) {
    this.socket = new WebSocket(`wss://chat.example.com?token=${token}`);

    this.socket.onopen = () => {
      this.connectionStatus = "connected";
      this.authenticate(userId);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      this.connectionStatus = "disconnected";
      this.scheduleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.connectionStatus = "error";
    };
  }

  authenticate(userId) {
    this.send({
      type: "authenticate",
      userId: userId,
    });
  }

  joinRoom(roomId) {
    this.send({
      type: "join_room",
      roomId: roomId,
    });
  }

  sendMessage(roomId, content, type = "text") {
    const message = {
      id: this.generateId(),
      roomId: roomId,
      content: content,
      type: type,
      timestamp: Date.now(),
      sender: this.currentUser.id,
    };

    this.send({
      type: "send_message",
      message: message,
    });

    // Optimistic update
    this.addMessageToHistory(roomId, message);
  }

  startTyping(roomId) {
    this.send({
      type: "typing_start",
      roomId: roomId,
    });
  }

  stopTyping(roomId) {
    this.send({
      type: "typing_stop",
      roomId: roomId,
    });
  }

  handleMessage(data) {
    switch (data.type) {
      case "authenticated":
        this.currentUser = data.user;
        this.loadUserList();
        this.loadRooms();
        break;

      case "user_list":
        this.updateUserList(data.users);
        break;

      case "room_list":
        this.updateRoomList(data.rooms);
        break;

      case "message":
        this.addMessageToHistory(data.message.roomId, data.message);
        this.notifyNewMessage(data.message);
        break;

      case "typing_start":
        this.updateTypingUsers(data.roomId, data.userId, true);
        break;

      case "typing_stop":
        this.updateTypingUsers(data.roomId, data.userId, false);
        break;

      case "user_joined":
        this.addUser(data.user);
        this.notifyUserJoined(data.user);
        break;

      case "user_left":
        this.removeUser(data.userId);
        this.notifyUserLeft(data.userId);
        break;

      case "presence_update":
        this.updateUserPresence(data.userId, data.presence);
        break;
    }
  }

  addMessageToHistory(roomId, message) {
    if (!this.messageHistory.has(roomId)) {
      this.messageHistory.set(roomId, []);
    }

    const history = this.messageHistory.get(roomId);
    history.push(message);

    // Keep only last 100 messages
    if (history.length > 100) {
      history.shift();
    }
  }

  updateTypingUsers(roomId, userId, isTyping) {
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set());
    }

    const typingSet = this.typingUsers.get(roomId);

    if (isTyping) {
      typingSet.add(userId);
    } else {
      typingSet.delete(userId);
    }
  }

  searchMessages(query, roomId = null) {
    const results = [];
    const searchTerm = query.toLowerCase();

    const roomsToSearch = roomId ? [roomId] : this.messageHistory.keys();

    for (const room of roomsToSearch) {
      const messages = this.messageHistory.get(room) || [];

      messages.forEach((message) => {
        if (message.content.toLowerCase().includes(searchTerm)) {
          results.push({
            ...message,
            roomId: room,
          });
        }
      });
    }

    return results.sort((a, b) => b.timestamp - a.timestamp);
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  scheduleReconnect() {
    setTimeout(() => {
      if (this.connectionStatus === "disconnected") {
        this.connect(this.currentUser?.id, this.token);
      }
    }, 5000);
  }

  // Event listeners
  onNewMessage(callback) {
    this.messageCallbacks = this.messageCallbacks || [];
    this.messageCallbacks.push(callback);
  }

  onUserJoined(callback) {
    this.userJoinedCallbacks = this.userJoinedCallbacks || [];
    this.userJoinedCallbacks.push(callback);
  }

  onUserLeft(callback) {
    this.userLeftCallbacks = this.userLeftCallbacks || [];
    this.userLeftCallbacks.push(callback);
  }

  notifyNewMessage(message) {
    if (this.messageCallbacks) {
      this.messageCallbacks.forEach((callback) => callback(message));
    }
  }

  notifyUserJoined(user) {
    if (this.userJoinedCallbacks) {
      this.userJoinedCallbacks.forEach((callback) => callback(user));
    }
  }

  notifyUserLeft(userId) {
    if (this.userLeftCallbacks) {
      this.userLeftCallbacks.forEach((callback) => callback(userId));
    }
  }
}
```
{% endraw %}

### Dashboard with Real-Time Analytics

**Challenge**: Build a comprehensive dashboard with real-time data visualization, charts, and interactive widgets.

**Key Features**:

- Real-time data updates
- Interactive charts and graphs
- Customizable widgets
- Data filtering and drill-down
- Export functionality
- Responsive design
- Dark/light theme

**Technical Implementation**:

```javascript
class DashboardManager {
  constructor() {
    this.widgets = new Map();
    this.dataSources = new Map();
    this.filters = {};
    this.theme = "light";
    this.layout = [];
    this.refreshInterval = null;
  }

  addWidget(widget) {
    this.widgets.set(widget.id, widget);
    this.layout.push({
      id: widget.id,
      x: widget.x || 0,
      y: widget.y || 0,
      w: widget.width || 6,
      h: widget.height || 4,
    });
  }

  addDataSource(id, source) {
    this.dataSources.set(id, source);
  }

  updateWidgetData(widgetId, data) {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.updateData(data);
    }
  }

  setFilter(filter) {
    this.filters = { ...this.filters, ...filter };
    this.refreshAllWidgets();
  }

  refreshAllWidgets() {
    this.widgets.forEach((widget) => {
      this.refreshWidgetData(widget.id);
    });
  }

  async refreshWidgetData(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (!widget) return;

    try {
      const data = await this.fetchWidgetData(widget.dataSource, this.filters);
      widget.updateData(data);
    } catch (error) {
      widget.showError(error);
    }
  }

  async fetchWidgetData(sourceId, filters) {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source ${sourceId} not found`);
    }

    return await source.fetch(filters);
  }

  startAutoRefresh(interval = 30000) {
    this.stopAutoRefresh();
    this.refreshInterval = setInterval(() => {
      this.refreshAllWidgets();
    }, interval);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  exportData(format = "json") {
    const data = {
      widgets: Array.from(this.widgets.values()).map((w) => w.getData()),
      filters: this.filters,
      timestamp: new Date().toISOString(),
    };

    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "csv":
        return this.convertToCSV(data);
      case "pdf":
        return this.generatePDF(data);
      default:
        return data;
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    this.widgets.forEach((widget) => widget.setTheme(theme));
  }

  saveLayout() {
    const layout = {
      widgets: this.layout,
      theme: this.theme,
      filters: this.filters,
    };
    localStorage.setItem("dashboard-layout", JSON.stringify(layout));
  }

  loadLayout() {
    try {
      const saved = localStorage.getItem("dashboard-layout");
      if (saved) {
        const layout = JSON.parse(saved);
        this.layout = layout.widgets;
        this.theme = layout.theme;
        this.filters = layout.filters;
        this.setTheme(this.theme);
      }
    } catch (error) {
      console.error("Failed to load layout:", error);
    }
  }
}

// Example widget implementation
class ChartWidget {
  constructor(id, config) {
    this.id = id;
    this.config = config;
    this.chart = null;
    this.data = [];
    this.element = null;
  }

  render(container) {
    this.element = document.createElement("div");
    this.element.className = "widget chart-widget";
    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.config.title}</h3>
        <div class="widget-controls">
          <button class="refresh-btn">↻</button>
          <button class="export-btn">📊</button>
        </div>
      </div>
      <div class="widget-content">
        <canvas id="chart-${this.id}"></canvas>
      </div>
    `;

    container.appendChild(this.element);
    this.initializeChart();
    this.bindEvents();
  }

  initializeChart() {
    const canvas = this.element.querySelector(`#chart-${this.id}`);
    const ctx = canvas.getContext("2d");

    this.chart = new Chart(ctx, {
      type: this.config.type || "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: this.config.title,
          },
        },
      },
    });
  }

  updateData(data) {
    this.data = data;

    if (this.chart) {
      this.chart.data.labels = data.labels || [];
      this.chart.data.datasets = data.datasets || [];
      this.chart.update();
    }
  }

  setTheme(theme) {
    if (this.chart) {
      const isDark = theme === "dark";
      this.chart.options.plugins.legend.labels.color = isDark ? "#fff" : "#000";
      this.chart.options.plugins.title.color = isDark ? "#fff" : "#000";
      this.chart.update();
    }
  }

  showError(error) {
    if (this.element) {
      const content = this.element.querySelector(".widget-content");
      content.innerHTML = `
        <div class="error-message">
          <p>Failed to load data: ${error.message}</p>
          <button onclick="this.refresh()">Retry</button>
        </div>
      `;
    }
  }

  getData() {
    return {
      id: this.id,
      config: this.config,
      data: this.data,
    };
  }

  bindEvents() {
    const refreshBtn = this.element.querySelector(".refresh-btn");
    const exportBtn = this.element.querySelector(".export-btn");

    refreshBtn.addEventListener("click", () => {
      this.refresh();
    });

    exportBtn.addEventListener("click", () => {
      this.exportData();
    });
  }

  refresh() {
    // Trigger refresh event
    this.element.dispatchEvent(
      new CustomEvent("widget-refresh", {
        detail: { widgetId: this.id },
      })
    );
  }

  exportData() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.config.title}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

## Interview Scenarios

### System Design: Social Media Platform

**Challenge**: Design the frontend architecture for a social media platform like Instagram.

**Requirements**:

- Feed with infinite scroll
- Real-time notifications
- Image/video upload and processing
- User profiles and following system
- Comments and likes
- Direct messaging
- Search functionality
- Mobile-first responsive design

**Solution Architecture**:

```javascript
// Feed component with virtual scrolling
class SocialFeed {
  constructor() {
    this.posts = [];
    this.currentIndex = 0;
    this.visiblePosts = 10;
    this.postHeight = 600; // Estimated height
    this.container = null;
    this.observer = null;
  }

  initialize(container) {
    this.container = container;
    this.setupIntersectionObserver();
    this.loadInitialPosts();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadMorePosts();
          }
        });
      },
      { rootMargin: "100px" }
    );
  }

  async loadInitialPosts() {
    try {
      const posts = await this.fetchPosts(0, this.visiblePosts);
      this.posts = posts;
      this.renderPosts();
    } catch (error) {
      this.showError(error);
    }
  }

  async loadMorePosts() {
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      const newPosts = await this.fetchPosts(
        this.posts.length,
        this.visiblePosts
      );

      this.posts.push(...newPosts);
      this.renderNewPosts(newPosts);
    } catch (error) {
      this.showError(error);
    } finally {
      this.isLoading = false;
    }
  }

  renderPosts() {
    this.container.innerHTML = "";
    this.posts.forEach((post, index) => {
      const postElement = this.createPostElement(post);
      this.container.appendChild(postElement);

      // Observe last few posts for infinite scroll
      if (index >= this.posts.length - 3) {
        this.observer.observe(postElement);
      }
    });
  }

  createPostElement(post) {
    const element = document.createElement("div");
    element.className = "post";
    element.dataset.postId = post.id;

    element.innerHTML = `
      <div class="post-header">
        <img src="${post.author.avatar}" alt="${
      post.author.name
    }" class="avatar">
        <div class="post-meta">
          <h4>${post.author.name}</h4>
          <span>${this.formatTime(post.timestamp)}</span>
        </div>
      </div>
      <div class="post-content">
        ${this.renderPostContent(post)}
      </div>
      <div class="post-actions">
        <button class="like-btn" data-post-id="${post.id}">
          ${post.liked ? "❤️" : "🤍"} ${post.likes}
        </button>
        <button class="comment-btn" data-post-id="${post.id}">
          💬 ${post.comments.length}
        </button>
        <button class="share-btn" data-post-id="${post.id}">
          📤
        </button>
      </div>
      <div class="post-comments">
        ${this.renderComments(post.comments.slice(0, 2))}
      </div>
    `;

    this.bindPostEvents(element, post);
    return element;
  }

  renderPostContent(post) {
    switch (post.type) {
      case "image":
        return `<img src="${post.content}" alt="Post image" loading="lazy">`;
      case "video":
        return `
          <video controls preload="metadata">
            <source src="${post.content}" type="video/mp4">
          </video>
        `;
      case "text":
        return `<p>${post.content}</p>`;
      default:
        return `<p>${post.content}</p>`;
    }
  }

  renderComments(comments) {
    return comments
      .map(
        (comment) => `
      <div class="comment">
        <strong>${comment.author.name}</strong> ${comment.content}
      </div>
    `
      )
      .join("");
  }

  bindPostEvents(element, post) {
    const likeBtn = element.querySelector(".like-btn");
    const commentBtn = element.querySelector(".comment-btn");
    const shareBtn = element.querySelector(".share-btn");

    likeBtn.addEventListener("click", () => this.handleLike(post.id));
    commentBtn.addEventListener("click", () => this.handleComment(post.id));
    shareBtn.addEventListener("click", () => this.handleShare(post));
  }

  async handleLike(postId) {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const { liked, likes } = await response.json();
        this.updateLikeUI(postId, liked, likes);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  }

  updateLikeUI(postId, liked, likes) {
    const likeBtn = this.container.querySelector(
      `[data-post-id="${postId}"] .like-btn`
    );
    if (likeBtn) {
      likeBtn.innerHTML = `${liked ? "❤️" : "🤍"} ${likes}`;
    }
  }

  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }

  async fetchPosts(offset, limit) {
    const response = await fetch(`/api/posts?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json();
  }
}
```

### Performance Optimization Challenge

**Challenge**: Optimize a slow-loading e-commerce website with poor Core Web Vitals scores.

**Initial Problems**:

- LCP: 8.2s (Target: < 2.5s)
- FID: 450ms (Target: < 100ms)
- CLS: 0.25 (Target: < 0.1)
- Bundle size: 2.8MB

**Optimization Strategy**:

```javascript
// Performance optimization implementation
class PerformanceOptimizer {
  constructor() {
    this.metrics = {};
    this.optimizations = new Map();
  }

  // 1. Implement critical CSS inlining
  inlineCriticalCSS() {
    const criticalCSS = `
      .header, .hero, .product-grid { /* Critical styles */ }
    `;

    const style = document.createElement("style");
    style.textContent = criticalCSS;
    document.head.prepend(style);
  }

  // 2. Implement image optimization
  optimizeImages() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // 3. Implement code splitting
  async loadComponent(componentName) {
    const component = await import(`./components/${componentName}.js`);
    return component.default;
  }

  // 4. Implement service worker for caching
  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    }
  }

  // 5. Implement resource hints
  addResourceHints() {
    const hints = [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preload", href: "/critical.css", as: "style" },
      { rel: "prefetch", href: "/next-page.js" },
    ];

    hints.forEach((hint) => {
      const link = document.createElement("link");
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }

  // 6. Implement virtual scrolling for large lists
  createVirtualScroller(container, items, itemHeight) {
    const visibleItems = Math.ceil(container.clientHeight / itemHeight);
    let startIndex = 0;
    let endIndex = visibleItems;

    function render() {
      const fragment = document.createDocumentFragment();

      for (let i = startIndex; i < endIndex; i++) {
        if (items[i]) {
          const item = createItemElement(items[i]);
          fragment.appendChild(item);
        }
      }

      container.innerHTML = "";
      container.appendChild(fragment);
    }

    container.addEventListener("scroll", () => {
      const scrollTop = container.scrollTop;
      startIndex = Math.floor(scrollTop / itemHeight);
      endIndex = Math.min(startIndex + visibleItems + 2, items.length);
      render();
    });

    render();
  }

  // 7. Monitor performance metrics
  monitorPerformance() {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric("LCP", this.metrics.lcp);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // FID
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.reportMetric("FID", this.metrics.fid);
      });
    }).observe({ entryTypes: ["first-input"] });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
      this.reportMetric("CLS", this.metrics.cls);
    }).observe({ entryTypes: ["layout-shift"] });
  }

  reportMetric(name, value) {
    console.log(`${name}: ${value}`);

    // Send to analytics
    if (window.gtag) {
      gtag("event", "performance_metric", {
        metric_name: name,
        value: value,
      });
    }
  }

  // 8. Implement debounced search
  createDebouncedSearch(input, searchFunction, delay = 300) {
    let timeoutId;

    input.addEventListener("input", (e) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        searchFunction(e.target.value);
      }, delay);
    });
  }

  // 9. Implement request caching
  createRequestCache() {
    const cache = new Map();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    return async function cachedFetch(url, options = {}) {
      const key = `${url}-${JSON.stringify(options)}`;
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < maxAge) {
        return cached.data;
      }

      const response = await fetch(url, options);
      const data = await response.json();

      cache.set(key, {
        data,
        timestamp: Date.now(),
      });

      return data;
    };
  }

  // 10. Implement bundle analysis
  analyzeBundle() {
    // This would typically be done at build time
    const bundleAnalyzer = {
      analyze: (stats) => {
        const modules = stats.modules || [];
        const largeModules = modules
          .filter((m) => m.size > 100000) // > 100KB
          .sort((a, b) => b.size - a.size);

        console.log("Large modules:", largeModules);
        return largeModules;
      },
    };

    return bundleAnalyzer;
  }
}

// Usage
const optimizer = new PerformanceOptimizer();

// Apply optimizations
optimizer.inlineCriticalCSS();
optimizer.optimizeImages();
optimizer.registerServiceWorker();
optimizer.addResourceHints();
optimizer.monitorPerformance();

// Create cached fetch function
const cachedFetch = optimizer.createRequestCache();

// Use cached fetch for API calls
const products = await cachedFetch("/api/products");
```

## Portfolio Projects

### Advanced Project Ideas

1. **Real-Time Collaboration Editor**

   - WebSocket-based real-time editing
   - Operational transformation for conflict resolution
   - User presence and cursors
   - Version history and branching

2. **Progressive Web App (PWA)**

   - Offline functionality
   - Push notifications
   - Background sync
   - App-like experience

3. **Micro-Frontend Architecture**

   - Module Federation
   - Independent deployments
   - Shared component library
   - Event-driven communication

4. **Accessible Design System**

   - WCAG 2.1 compliance
   - Screen reader support
   - Keyboard navigation
   - High contrast themes

5. **Internationalization Platform**
   - Multi-language support
   - RTL layout support
   - Cultural adaptations
   - Dynamic content translation

## Best Practices

### Project Structure

```
src/
├── components/
│   ├── common/
│   ├── features/
│   └── layouts/
├── hooks/
├── services/
├── utils/
├── types/
├── constants/
├── assets/
└── styles/
```

### Code Quality

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Husky for pre-commit hooks
- Jest and React Testing Library for testing
- Storybook for component documentation

### Performance

- Bundle analysis and optimization
- Core Web Vitals monitoring
- Performance budgets
- Lazy loading and code splitting
- Image optimization and CDN

### Deployment

- CI/CD pipelines
- Environment-specific builds
- Feature flags
- A/B testing
- Monitoring and error tracking

## Resources

### Project Ideas

- [Frontend Mentor](https://www.frontendmentor.io/) - Design challenges
- [DevChallenges](https://devchallenges.io/) - Coding challenges
- [CodePen](https://codepen.io/) - Creative coding
- [GitHub](https://github.com/topics/frontend) - Open source projects

### Learning Platforms

- [Frontend Masters](https://frontendmasters.com/)
- [Egghead](https://egghead.io/)
- [Pluralsight](https://www.pluralsight.com/)
- [Udemy](https://www.udemy.com/)

### Practice Tools

- [CodeSandbox](https://codesandbox.io/) - Online IDE
- [StackBlitz](https://stackblitz.com/) - Web IDE
- [Replit](https://replit.com/) - Collaborative coding
- [Glitch](https://glitch.com/) - Web app creation

---

_This guide provides comprehensive project examples and interview scenarios for frontend development, covering real-world applications and advanced techniques commonly asked at Big Tech companies._
