# Frontend Coding Challenges Guide

## Table of Contents

- [Challenge Categories](#challenge-categories)
- [Beginner Challenges](#beginner-challenges)
- [Intermediate Challenges](#intermediate-challenges)
- [Advanced Challenges](#advanced-challenges)
- [System Design Challenges](#system-design-challenges)
- [Performance Challenges](#performance-challenges)
- [Interview Scenarios](#interview-scenarios)

## Challenge Categories

### Technical Skills

- **JavaScript Fundamentals**: Closures, promises, async/await
- **React Patterns**: Hooks, context, performance optimization
- **CSS Layouts**: Flexbox, Grid, responsive design
- **DOM Manipulation**: Event handling, dynamic content
- **API Integration**: REST, GraphQL, real-time data

### Problem-Solving

- **Algorithm Implementation**: Data structures, sorting, searching
- **State Management**: Complex state logic, data flow
- **User Experience**: Accessibility, performance, usability
- **Error Handling**: Edge cases, validation, recovery

## Beginner Challenges

### Challenge 1: Todo List Application

**Description**: Build a fully functional todo list with CRUD operations.

**Requirements**:

- Add, edit, delete todos
- Mark todos as complete
- Filter by status (all, active, completed)
- Persist data in localStorage
- Responsive design

**Expected Features**:

{% raw %}
```javascript
// Core functionality
const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [inputValue, setInputValue] = useState("");

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>Todo List</h1>

      <div className="add-todo">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              addTodo(inputValue.trim());
              setInputValue("");
            }
          }}
          placeholder="Add a new todo..."
        />
        <button
          onClick={() => {
            if (inputValue.trim()) {
              addTodo(inputValue.trim());
              setInputValue("");
            }
          }}
        >
          Add
        </button>
      </div>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```
{% endraw %}

**CSS Styling**:

```css
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-todo button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.filters button.active {
  background: #007bff;
  color: white;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #888;
}
```

### Challenge 2: Weather Dashboard

**Description**: Create a weather application that displays current weather and forecast.

**Requirements**:

- Search by city name
- Display current weather (temperature, humidity, wind)
- Show 5-day forecast
- Use geolocation for current location
- Handle loading and error states

**Implementation**:

```javascript
const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");

  const API_KEY = "your_api_key";
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeather(data);

      // Fetch forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          setWeather(data);
          setCity(data.name);
        },
        (error) => {
          setError("Unable to get location");
        }
      );
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather Dashboard</h1>

      <div className="search-section">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          onKeyPress={(e) => {
            if (e.key === "Enter" && city.trim()) {
              fetchWeather(city.trim());
            }
          }}
        />
        <button onClick={() => fetchWeather(city)}>Search</button>
        <button onClick={getCurrentLocation}>📍 Current Location</button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="current-weather">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="weather-info">
            <div className="temperature">{Math.round(weather.main.temp)}°C</div>
            <div className="description">{weather.weather[0].description}</div>
            <div className="details">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <p>Pressure: {weather.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}

      {forecast && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.list
              .filter((item, index) => index % 8 === 0) // Daily forecast
              .map((item, index) => (
                <div key={index} className="forecast-item">
                  <div className="date">
                    {new Date(item.dt * 1000).toLocaleDateString()}
                  </div>
                  <div className="temp">{Math.round(item.main.temp)}°C</div>
                  <div className="description">
                    {item.weather[0].description}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

## Intermediate Challenges

### Challenge 3: Real-time Chat Application

**Description**: Build a chat application with real-time messaging capabilities.

**Requirements**:

- Real-time messaging using WebSocket
- User authentication
- Message history
- Typing indicators
- File sharing
- Online/offline status

**Implementation**:

```javascript
// WebSocket connection
const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("Connected to WebSocket");
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("Disconnected from WebSocket");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  return { socket, isConnected };
};

// Chat component
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const { socket, isConnected } = useWebSocket("ws://localhost:8080");

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "message":
          setMessages((prev) => [...prev, data.message]);
          break;
        case "userList":
          setUsers(data.users);
          break;
        case "typing":
          setIsTyping(data.isTyping);
          break;
        case "userJoined":
          setUsers((prev) => [...prev, data.user]);
          break;
        case "userLeft":
          setUsers((prev) => prev.filter((user) => user.id !== data.userId));
          break;
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket) return;

    const message = {
      id: Date.now(),
      text: inputMessage,
      user: currentUser,
      timestamp: new Date(),
    };

    socket.send(
      JSON.stringify({
        type: "message",
        message,
      })
    );

    setInputMessage("");
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "typing",
        isTyping: true,
      })
    );

    // Stop typing indicator after 3 seconds
    setTimeout(() => {
      socket.send(
        JSON.stringify({
          type: "typing",
          isTyping: false,
        })
      );
    }, 3000);
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h2>Real-time Chat</h2>
        <div className="connection-status">
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>

      <div className="chat-container">
        <div className="users-sidebar">
          <h3>Online Users</h3>
          <div className="users-list">
            {users.map((user) => (
              <div key={user.id} className="user-item">
                <span className="user-status">🟢</span>
                {user.name}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.user.id === currentUser?.id ? "own" : ""
                }`}
              >
                <div className="message-header">
                  <span className="username">{message.user.name}</span>
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">Someone is typing...</div>
            )}
          </div>

          <div className="message-input">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                } else {
                  handleTyping();
                }
              }}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Challenge 4: E-commerce Product Catalog

**Description**: Create a product catalog with filtering, sorting, and cart functionality.

**Requirements**:

- Product grid with images and details
- Filter by category, price, rating
- Sort by price, name, popularity
- Shopping cart with persistent storage
- Search functionality
- Responsive design

**Implementation**:

```javascript
const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0
  });
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesCategory = filters.category === 'all' ||
                             product.category === filters.category;
      const matchesPrice = product.price >= filters.minPrice &&
                          product.price <= filters.maxPrice;
      const matchesRating = product.rating >= filters.rating;
      const matchesSearch = product.name.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters, sortBy, searchQuery]);

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const cartTotal = cart.reduce((total, item) =>
    total + (item.price * item.quantity), 0
  );

  return (
    <div className="product-catalog">
      <header className="catalog-header">
        <h1>Product Catalog</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="catalog-container">
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                category: e.target.value
              }))}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  minPrice: Number(e.target.value)
                }))}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  maxPrice: Number(e.target.value)
                }))}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                rating: Number(e.target.value)
              }))}
            >
              <option value={0}>Any Rating</option>
              <option value={4}>4+ Stars</option>
              <option value={3}>3+ Stars</option>
              <option value={2}>2+ Stars</option>
            </select>
          </div>
        </aside>

        <main className="products-main">
          <div className="products-header">
            <h2>Products ({filteredProducts.length})</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < product.rating ? 'star filled' : 'star'}>
                        ★
                      </span>
                    ))}
                    <span className="rating-text">({product.rating})</span>
                  </p>
                  <p className="description">{product.description}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="add-to-cart"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="cart-sidebar">
          <h3>Shopping Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h4>Total: ${cartTotal.toFixed(2)}</h4>
                <button className="checkout-btn">Checkout</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};
```

## Advanced Challenges

### Challenge 5: Real-time Dashboard with Charts

**Description**: Build a dashboard with real-time data visualization and interactive charts.

**Requirements**:

- Multiple chart types (line, bar, pie)
- Real-time data updates
- Interactive filters and date ranges
- Responsive design
- Data export functionality

**Implementation**:

{% raw %}
```javascript
import { Line, Bar, Pie } from "react-chartjs-2";

const Dashboard = () => {
  const [data, setData] = useState({
    sales: [],
    users: [],
    revenue: [],
  });
  const [filters, setFilters] = useState({
    dateRange: "7d",
    category: "all",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Real-time data updates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [salesRes, usersRes, revenueRes] = await Promise.all([
          fetch(`/api/sales?range=${filters.dateRange}`),
          fetch(`/api/users?range=${filters.dateRange}`),
          fetch(`/api/revenue?range=${filters.dateRange}`),
        ]);

        const [salesData, usersData, revenueData] = await Promise.all([
          salesRes.json(),
          usersRes.json(),
          revenueRes.json(),
        ]);

        setData({
          sales: salesData,
          users: usersData,
          revenue: revenueData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [filters]);

  const salesChartData = {
    labels: data.sales.map((item) => item.date),
    datasets: [
      {
        label: "Sales",
        data: data.sales.map((item) => item.value),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const usersChartData = {
    labels: data.users.map((item) => item.category),
    datasets: [
      {
        label: "Users",
        data: data.users.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
      },
    ],
  };

  const revenueChartData = {
    labels: data.revenue.map((item) => item.month),
    datasets: [
      {
        label: "Revenue",
        data: data.revenue.map((item) => item.amount),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
      },
    ],
  };

  const exportData = () => {
    const csvContent = [
      ["Date", "Sales", "Users", "Revenue"],
      ...data.sales.map((sale, index) => [
        sale.date,
        sale.value,
        data.users[index]?.count || 0,
        data.revenue[index]?.amount || 0,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <div className="dashboard-controls">
          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: e.target.value,
              }))
            }
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>

          <button onClick={exportData} className="export-btn">
            Export Data
          </button>
        </div>
      </header>

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="chart-container">
          <h3>Sales Trend</h3>
          <Line
            data={salesChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        <div className="chart-container">
          <h3>User Distribution</h3>
          <Pie
            data={usersChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>

        <div className="chart-container">
          <h3>Revenue by Month</h3>
          <Bar
            data={revenueChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        <div className="metrics-container">
          <div className="metric-card">
            <h4>Total Sales</h4>
            <p className="metric-value">
              $
              {data.sales
                .reduce((sum, item) => sum + item.value, 0)
                .toLocaleString()}
            </p>
          </div>

          <div className="metric-card">
            <h4>Total Users</h4>
            <p className="metric-value">
              {data.users
                .reduce((sum, item) => sum + item.count, 0)
                .toLocaleString()}
            </p>
          </div>

          <div className="metric-card">
            <h4>Total Revenue</h4>
            <p className="metric-value">
              $
              {data.revenue
                .reduce((sum, item) => sum + item.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```
{% endraw %}

## System Design Challenges

### Challenge 6: Design a Social Media Feed

**Description**: Design and implement a scalable social media feed system.

**Requirements**:

- Infinite scrolling feed
- Real-time updates
- Content filtering and personalization
- Performance optimization
- Caching strategy

**Architecture Design**:

```javascript
// Feed component with virtualization
const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "latest",
    category: "all",
  });

  // Virtual scrolling implementation
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const itemHeight = 200; // Estimated height of each post

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/posts?offset=${posts.length}&limit=20&sort=${filters.sortBy}&category=${filters.category}`
      );
      const newPosts = await response.json();

      if (newPosts.length < 20) {
        setHasMore(false);
      }

      setPosts((prev) => [...prev, ...newPosts]);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }, [posts.length, loading, hasMore, filters]);

  // Intersection observer for infinite scroll
  const observerRef = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, loadMorePosts]
  );

  // Real-time updates using WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/feed");

    ws.onmessage = (event) => {
      const newPost = JSON.parse(event.data);
      setPosts((prev) => [newPost, ...prev]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="social-feed">
      <div className="feed-filters">
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: e.target.value,
            }))
          }
        >
          <option value="latest">Latest</option>
          <option value="popular">Most Popular</option>
          <option value="trending">Trending</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
        >
          <option value="all">All Categories</option>
          <option value="technology">Technology</option>
          <option value="sports">Sports</option>
          <option value="entertainment">Entertainment</option>
        </select>
      </div>

      <div className="posts-container">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            className="post-card"
          >
            <div className="post-header">
              <img src={post.author.avatar} alt={post.author.name} />
              <div className="post-meta">
                <h4>{post.author.name}</h4>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post content" />}
            </div>

            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>
                ❤️ {post.likes}
              </button>
              <button onClick={() => handleComment(post.id)}>
                💬 {post.comments}
              </button>
              <button onClick={() => handleShare(post.id)}>📤 Share</button>
            </div>
          </div>
        ))}

        {loading && (
          <div className="loading-indicator">Loading more posts...</div>
        )}
      </div>
    </div>
  );
};
```

## Performance Challenges

### Challenge 7: Optimize a Large Data Table

**Description**: Build a high-performance data table that can handle thousands of rows.

**Requirements**:

- Virtual scrolling for large datasets
- Column sorting and filtering
- Row selection and bulk actions
- Export functionality
- Responsive design

**Implementation**:

{% raw %}
```javascript
const DataTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  // Virtual scrolling setup
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const rowHeight = 40;
  const visibleRows =
    Math.ceil(containerRef.current?.clientHeight / rowHeight) || 20;
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + visibleRows + 5, data.length);

  // Apply sorting and filtering
  const processedData = useMemo(() => {
    let filtered = data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]).toLowerCase().includes(value.toLowerCase());
      });
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === processedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(processedData.map((row) => row.id)));
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const exportData = () => {
    const selectedData = processedData.filter((row) =>
      selectedRows.has(row.id)
    );
    const csvContent = [
      columns.map((col) => col.header).join(","),
      ...selectedData.map((row) =>
        columns.map((col) => row[col.key]).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="data-table">
      <div className="table-controls">
        <div className="filters">
          {columns.map((column) => (
            <input
              key={column.key}
              placeholder={`Filter ${column.header}...`}
              value={filters[column.key] || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [column.key]: e.target.value,
                }))
              }
            />
          ))}
        </div>

        <div className="actions">
          <button onClick={exportData} disabled={selectedRows.size === 0}>
            Export Selected ({selectedRows.size})
          </button>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>
      </div>

      <div className="table-container" ref={containerRef}>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.size === processedData.length}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="sortable"
                >
                  {column.header}
                  {sortConfig.key === column.key && (
                    <span className="sort-indicator">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {processedData.slice(startIndex, endIndex).map((row, index) => (
              <tr
                key={row.id}
                style={{
                  position: "absolute",
                  top: (startIndex + index) * rowHeight,
                  height: rowHeight,
                }}
                className={selectedRows.has(row.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          Showing {startIndex + 1} to {Math.min(endIndex, processedData.length)}{" "}
          of {processedData.length} results
        </p>
      </div>
    </div>
  );
};
```
{% endraw %}

## Interview Scenarios

### Scenario 1: Live Coding Session

**Setup**: You're asked to build a feature during a live coding interview.

**Tips**:

- Start with a clear plan and requirements
- Write clean, readable code
- Explain your thought process
- Handle edge cases
- Test your implementation

### Scenario 2: Code Review

**Setup**: You're given existing code to review and improve.

**Focus Areas**:

- Code quality and readability
- Performance optimization
- Security considerations
- Testing coverage
- Best practices

### Scenario 3: System Design Discussion

**Setup**: Design a scalable frontend architecture.

**Key Points**:

- Component architecture
- State management strategy
- Performance considerations
- Scalability planning
- Technology choices

---

_This comprehensive guide provides real-world coding challenges that test both technical skills and problem-solving abilities. Practice these challenges to prepare for frontend interviews at Big Tech companies._
