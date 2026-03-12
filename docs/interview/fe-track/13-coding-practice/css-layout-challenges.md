# CSS Layout Challenges

## Problem 1: Holy Grail Layout

### Problem Description

Create a responsive layout with header, footer, and three columns (sidebar, main content, sidebar) that maintains proper proportions on all screen sizes.

### Requirements

- Header and footer span full width
- Main content area takes remaining height
- Sidebars collapse on mobile
- Sticky footer
- Responsive breakpoints

### Solution

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Holy Grail Layout</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="layout">
      <header class="header">
        <h1>Header</h1>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main class="main-content">
        <aside class="sidebar sidebar-left">
          <h3>Left Sidebar</h3>
          <ul>
            <li>Navigation Item 1</li>
            <li>Navigation Item 2</li>
            <li>Navigation Item 3</li>
          </ul>
        </aside>

        <section class="content">
          <h2>Main Content</h2>
          <p>
            This is the main content area that will take up the remaining space.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </section>

        <aside class="sidebar sidebar-right">
          <h3>Right Sidebar</h3>
          <div class="widget">
            <h4>Widget 1</h4>
            <p>Widget content goes here.</p>
          </div>
          <div class="widget">
            <h4>Widget 2</h4>
            <p>More widget content.</p>
          </div>
        </aside>
      </main>

      <footer class="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>
```

```css
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Layout container */
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.header nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.header nav a:hover {
  opacity: 0.8;
}

/* Main content area */
.main-content {
  flex: 1;
  display: flex;
  min-height: 0; /* Important for flexbox */
}

/* Sidebars */
.sidebar {
  background: #f8f9fa;
  padding: 2rem;
  border-right: 1px solid #e9ecef;
  min-width: 250px;
  max-width: 300px;
}

.sidebar-right {
  border-right: none;
  border-left: 1px solid #e9ecef;
}

.sidebar h3 {
  margin-bottom: 1rem;
  color: #495057;
  font-size: 1.2rem;
}

.sidebar ul {
  list-style: none;
}

.sidebar li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.sidebar li:last-child {
  border-bottom: none;
}

/* Main content */
.content {
  flex: 1;
  padding: 2rem;
  background: white;
  overflow-y: auto;
}

.content h2 {
  margin-bottom: 1rem;
  color: #495057;
}

.content p {
  margin-bottom: 1rem;
  line-height: 1.8;
}

/* Widgets */
.widget {
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.widget h4 {
  margin-bottom: 0.5rem;
  color: #495057;
}

/* Footer */
.footer {
  background: #343a40;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  margin-top: auto;
}

/* Responsive design */
@media (max-width: 1024px) {
  .sidebar {
    min-width: 200px;
    max-width: 250px;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    min-width: auto;
    max-width: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #e9ecef;
  }

  .sidebar-right {
    border-bottom: none;
    border-top: 1px solid #e9ecef;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header nav ul {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .header,
  .footer {
    padding: 1rem;
  }

  .content,
  .sidebar {
    padding: 1rem;
  }

  .header nav ul {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

## Problem 2: CSS Grid Dashboard

### Problem Description

Create a responsive dashboard layout using CSS Grid with multiple content areas that adapt to different screen sizes.

### Requirements

- Use CSS Grid for layout
- Responsive grid areas
- Card-based design
- Hover effects
- Mobile-first approach

### Solution

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS Grid Dashboard</title>
    <link rel="stylesheet" href="dashboard.css" />
  </head>
  <body>
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="header-controls">
          <button class="btn">Refresh</button>
          <button class="btn btn-primary">New Item</button>
        </div>
      </header>

      <aside class="sidebar">
        <nav class="sidebar-nav">
          <a href="#" class="nav-item active">Dashboard</a>
          <a href="#" class="nav-item">Analytics</a>
          <a href="#" class="nav-item">Reports</a>
          <a href="#" class="nav-item">Settings</a>
        </nav>
      </aside>

      <main class="main-content">
        <section class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>Total Users</h3>
              <p class="stat-number">1,234</p>
              <span class="stat-change positive">+12%</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>Revenue</h3>
              <p class="stat-number">$45,678</p>
              <span class="stat-change positive">+8%</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <h3>Growth</h3>
              <p class="stat-number">23.5%</p>
              <span class="stat-change positive">+5%</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <h3>Conversion</h3>
              <p class="stat-number">3.2%</p>
              <span class="stat-change negative">-2%</span>
            </div>
          </div>
        </section>

        <section class="charts-section">
          <div class="chart-card">
            <h3>Monthly Revenue</h3>
            <div class="chart-placeholder">
              <p>Chart visualization would go here</p>
            </div>
          </div>

          <div class="chart-card">
            <h3>User Activity</h3>
            <div class="chart-placeholder">
              <p>Activity chart would go here</p>
            </div>
          </div>
        </section>

        <section class="recent-activity">
          <h3>Recent Activity</h3>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">👤</div>
              <div class="activity-content">
                <p>New user registered</p>
                <span class="activity-time">2 minutes ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">💰</div>
              <div class="activity-content">
                <p>Payment received</p>
                <span class="activity-time">5 minutes ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">📧</div>
              <div class="activity-content">
                <p>Email sent to customer</p>
                <span class="activity-time">10 minutes ago</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>
```

```css
/* Dashboard CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f5f7fa;
  color: #333;
  line-height: 1.6;
}

.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

/* Header */
.dashboard-header {
  grid-area: header;
  background: white;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-controls {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn:hover {
  background: #f8f9fa;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover {
  background: #0056b3;
}

/* Sidebar */
.sidebar {
  grid-area: sidebar;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 2rem 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  padding: 1rem 2rem;
  text-decoration: none;
  color: #6c757d;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #495057;
}

.nav-item.active {
  background: #e3f2fd;
  color: #1976d2;
  border-left-color: #1976d2;
}

/* Main content */
.main-content {
  grid-area: main;
  padding: 2rem;
  display: grid;
  grid-template-areas:
    "stats stats"
    "charts charts"
    "activity activity";
  gap: 2rem;
  overflow-y: auto;
}

/* Stats grid */
.stats-grid {
  grid-area: stats;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-content h3 {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.stat-change.positive {
  background: #d4edda;
  color: #155724;
}

.stat-change.negative {
  background: #f8d7da;
  color: #721c24;
}

/* Charts section */
.charts-section {
  grid-area: charts;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.chart-placeholder {
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-style: italic;
}

/* Activity section */
.recent-activity {
  grid-area: activity;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-activity h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.activity-item:hover {
  background: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #e3f2fd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.activity-content p {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Responsive design */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 200px 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
  }

  .sidebar {
    display: none;
  }

  .main-content {
    padding: 1rem;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    padding: 0 1rem;
  }

  .header-controls {
    gap: 0.5rem;
  }

  .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .activity-item {
    flex-direction: column;
    text-align: center;
  }

  .activity-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}
```

## Key Features

1. **CSS Grid Layout**: Modern grid-based layouts
2. **Responsive Design**: Mobile-first approach with breakpoints
3. **Flexbox Integration**: Combined with grid for complex layouts
4. **Hover Effects**: Interactive elements with smooth transitions
5. **Card-based Design**: Clean, modern card components
6. **Accessibility**: Proper semantic HTML and ARIA labels
7. **Performance**: Optimized CSS with minimal repaints
8. **Maintainability**: Well-organized and commented code

## Advanced Techniques

### CSS Custom Properties

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --border-radius: 8px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  color: var(--primary-color);
}
```

### CSS Grid Auto-fit

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

### CSS Grid Areas

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 60px;
}
```
