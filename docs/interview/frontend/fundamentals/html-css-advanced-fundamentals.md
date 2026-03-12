# HTML & CSS Advanced Fundamentals

## Overview
Modern HTML and CSS form the foundation of all web applications. This guide covers advanced concepts essential for frontend interviews at Big Tech companies.

---

## Semantic HTML & Accessibility

### **Advanced Semantic Markup Patterns**

```html
<!-- Complex Document Structure with Proper Semantics -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Advanced semantic HTML patterns for modern web applications">
  <title>Semantic HTML Demo</title>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/primary.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/critical.css" as="style">
  
  <!-- Critical CSS inline -->
  <style>
    /* Critical rendering path CSS */
    .above-fold { display: block; }
  </style>
  
  <!-- Non-critical CSS with media queries -->
  <link rel="stylesheet" href="/css/main.css" media="screen">
  <link rel="stylesheet" href="/css/print.css" media="print">
</head>

<body>
  <!-- Skip navigation for accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <!-- Primary navigation -->
  <header role="banner">
    <nav aria-label="Primary navigation">
      <h1>
        <a href="/" aria-label="Homepage">
          <img src="/logo.svg" alt="Company Logo" width="120" height="40">
        </a>
      </h1>
      
      <ul role="menubar">
        <li role="none">
          <a href="/products" role="menuitem" aria-expanded="false" aria-haspopup="true">
            Products
          </a>
          <ul role="menu" aria-label="Products submenu">
            <li role="none">
              <a href="/products/web" role="menuitem">Web Development</a>
            </li>
            <li role="none">
              <a href="/products/mobile" role="menuitem">Mobile Apps</a>
            </li>
          </ul>
        </li>
        <li role="none">
          <a href="/about" role="menuitem">About</a>
        </li>
        <li role="none">
          <a href="/contact" role="menuitem">Contact</a>
        </li>
      </ul>
      
      <!-- Mobile menu toggle -->
      <button 
        type="button" 
        aria-controls="mobile-menu" 
        aria-expanded="false"
        aria-label="Toggle mobile menu"
        class="mobile-menu-toggle"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </nav>
  </header>

  <!-- Main content area -->
  <main id="main-content" role="main">
    <!-- Hero section -->
    <section aria-labelledby="hero-heading" class="hero">
      <h1 id="hero-heading">Advanced Frontend Development</h1>
      <p class="hero-subtitle">Building scalable, accessible web applications</p>
      
      <!-- Call-to-action -->
      <div class="cta-group">
        <a href="/get-started" class="btn btn-primary" role="button">
          Get Started
          <span class="sr-only">(opens registration form)</span>
        </a>
        <a href="/learn-more" class="btn btn-secondary" role="button">
          Learn More
        </a>
      </div>
    </section>

    <!-- Feature grid -->
    <section aria-labelledby="features-heading">
      <h2 id="features-heading">Key Features</h2>
      
      <div class="feature-grid">
        <article class="feature-card">
          <header>
            <img src="/icons/performance.svg" alt="" width="48" height="48" aria-hidden="true">
            <h3>High Performance</h3>
          </header>
          <p>Optimized for speed and efficiency with modern web technologies.</p>
          <footer>
            <a href="/features/performance" aria-label="Learn more about performance features">
              Learn More
            </a>
          </footer>
        </article>
        
        <article class="feature-card">
          <header>
            <img src="/icons/accessibility.svg" alt="" width="48" height="48" aria-hidden="true">
            <h3>Accessibility First</h3>
          </header>
          <p>Built with WCAG 2.1 AA compliance and universal design principles.</p>
          <footer>
            <a href="/features/accessibility" aria-label="Learn more about accessibility features">
              Learn More
            </a>
          </footer>
        </article>
        
        <article class="feature-card">
          <header>
            <img src="/icons/security.svg" alt="" width="48" height="48" aria-hidden="true">
            <h3>Enterprise Security</h3>
          </header>
          <p>Industry-standard security measures and compliance protocols.</p>
          <footer>
            <a href="/features/security" aria-label="Learn more about security features">
              Learn More
            </a>
          </footer>
        </article>
      </div>
    </section>

    <!-- Data visualization section -->
    <section aria-labelledby="charts-heading">
      <h2 id="charts-heading">Performance Metrics</h2>
      
      <!-- Accessible data table -->
      <table role="table" aria-labelledby="metrics-caption">
        <caption id="metrics-caption">
          Website performance metrics comparison over the last quarter
        </caption>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Q1 2024</th>
            <th scope="col">Q2 2024</th>
            <th scope="col">Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Page Load Time</th>
            <td>2.1s</td>
            <td>1.8s</td>
            <td class="positive">-14%</td>
          </tr>
          <tr>
            <th scope="row">First Contentful Paint</th>
            <td>1.2s</td>
            <td>0.9s</td>
            <td class="positive">-25%</td>
          </tr>
          <tr>
            <th scope="row">Cumulative Layout Shift</th>
            <td>0.12</td>
            <td>0.08</td>
            <td class="positive">-33%</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Chart with proper accessibility -->
      <div class="chart-container" role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
        <h3 id="chart-title">Performance Trend</h3>
        <p id="chart-desc">
          Line chart showing decreasing page load times from 2.1 seconds in Q1 to 1.8 seconds in Q2 2024
        </p>
        <!-- SVG chart would go here with proper ARIA labels -->
        <svg width="400" height="200" aria-hidden="true">
          <!-- Chart elements -->
        </svg>
      </div>
    </section>

    <!-- Form section with advanced accessibility -->
    <section aria-labelledby="contact-heading">
      <h2 id="contact-heading">Get In Touch</h2>
      
      <form novalidate aria-describedby="form-instructions">
        <div id="form-instructions" class="form-instructions">
          All fields marked with an asterisk (*) are required.
        </div>
        
        <fieldset>
          <legend>Contact Information</legend>
          
          <div class="form-group">
            <label for="full-name">
              Full Name *
              <span class="required" aria-label="required field">*</span>
            </label>
            <input 
              type="text" 
              id="full-name" 
              name="fullName" 
              required 
              aria-describedby="name-error"
              autocomplete="name"
            >
            <div id="name-error" class="error-message" role="alert" aria-live="polite"></div>
          </div>
          
          <div class="form-group">
            <label for="email">
              Email Address *
              <span class="required" aria-label="required field">*</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              aria-describedby="email-help email-error"
              autocomplete="email"
            >
            <div id="email-help" class="help-text">
              We'll never share your email address with third parties.
            </div>
            <div id="email-error" class="error-message" role="alert" aria-live="polite"></div>
          </div>
          
          <div class="form-group">
            <label for="phone">
              Phone Number
            </label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              aria-describedby="phone-help"
              autocomplete="tel"
            >
            <div id="phone-help" class="help-text">
              Include country code for international numbers.
            </div>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Message Details</legend>
          
          <div class="form-group">
            <label for="subject">Subject *</label>
            <select id="subject" name="subject" required aria-describedby="subject-error">
              <option value="">Please select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="sales">Sales Question</option>
              <option value="partnership">Partnership Opportunity</option>
            </select>
            <div id="subject-error" class="error-message" role="alert" aria-live="polite"></div>
          </div>
          
          <div class="form-group">
            <label for="message">
              Message *
              <span class="char-count" aria-live="polite">
                <span id="char-current">0</span> / 500 characters
              </span>
            </label>
            <textarea 
              id="message" 
              name="message" 
              required 
              maxlength="500"
              rows="4"
              aria-describedby="message-error"
              placeholder="Please describe your inquiry in detail..."
            ></textarea>
            <div id="message-error" class="error-message" role="alert" aria-live="polite"></div>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Preferences</legend>
          
          <div class="form-group">
            <fieldset class="checkbox-group">
              <legend>Communication Preferences</legend>
              
              <div class="checkbox-item">
                <input type="checkbox" id="newsletter" name="preferences" value="newsletter">
                <label for="newsletter">Subscribe to our newsletter</label>
              </div>
              
              <div class="checkbox-item">
                <input type="checkbox" id="updates" name="preferences" value="updates">
                <label for="updates">Receive product updates</label>
              </div>
              
              <div class="checkbox-item">
                <input type="checkbox" id="marketing" name="preferences" value="marketing">
                <label for="marketing">Marketing communications</label>
              </div>
            </fieldset>
          </div>
          
          <div class="form-group">
            <fieldset class="radio-group">
              <legend>Preferred Contact Method *</legend>
              
              <div class="radio-item">
                <input type="radio" id="contact-email" name="contactMethod" value="email" required>
                <label for="contact-email">Email</label>
              </div>
              
              <div class="radio-item">
                <input type="radio" id="contact-phone" name="contactMethod" value="phone" required>
                <label for="contact-phone">Phone</label>
              </div>
              
              <div class="radio-item">
                <input type="radio" id="contact-either" name="contactMethod" value="either" required>
                <label for="contact-either">Either email or phone</label>
              </div>
            </fieldset>
          </div>
        </fieldset>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            Send Message
            <span class="btn-loading" aria-hidden="true"></span>
          </button>
          <button type="reset" class="btn btn-secondary">
            Clear Form
          </button>
        </div>
      </form>
    </section>
  </main>

  <!-- Sidebar -->
  <aside role="complementary" aria-labelledby="sidebar-heading">
    <h2 id="sidebar-heading">Related Resources</h2>
    
    <nav aria-label="Related resources">
      <ul>
        <li><a href="/docs/getting-started">Getting Started Guide</a></li>
        <li><a href="/docs/best-practices">Best Practices</a></li>
        <li><a href="/docs/accessibility">Accessibility Guidelines</a></li>
        <li><a href="/docs/performance">Performance Optimization</a></li>
      </ul>
    </nav>
    
    <!-- Widget area -->
    <section aria-labelledby="latest-posts">
      <h3 id="latest-posts">Latest Blog Posts</h3>
      <ul>
        <li>
          <article>
            <h4><a href="/blog/modern-css">Modern CSS Techniques</a></h4>
            <time datetime="2024-03-15">March 15, 2024</time>
          </article>
        </li>
        <li>
          <article>
            <h4><a href="/blog/web-performance">Web Performance in 2024</a></h4>
            <time datetime="2024-03-10">March 10, 2024</time>
          </article>
        </li>
      </ul>
    </section>
  </aside>

  <!-- Footer -->
  <footer role="contentinfo">
    <div class="footer-content">
      <section aria-labelledby="footer-company">
        <h3 id="footer-company">Company</h3>
        <ul>
          <li><a href="/about">About Us</a></li>
          <li><a href="/careers">Careers</a></li>
          <li><a href="/press">Press</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </section>
      
      <section aria-labelledby="footer-legal">
        <h3 id="footer-legal">Legal</h3>
        <ul>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/cookies">Cookie Policy</a></li>
          <li><a href="/accessibility">Accessibility Statement</a></li>
        </ul>
      </section>
      
      <section aria-labelledby="footer-social">
        <h3 id="footer-social">Follow Us</h3>
        <ul class="social-links">
          <li>
            <a href="https://twitter.com/company" aria-label="Follow us on Twitter">
              <svg aria-hidden="true" width="24" height="24">
                <!-- Twitter icon -->
              </svg>
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/company" aria-label="Follow us on LinkedIn">
              <svg aria-hidden="true" width="24" height="24">
                <!-- LinkedIn icon -->
              </svg>
            </a>
          </li>
        </ul>
      </section>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2024 Company Name. All rights reserved.</p>
      <p>
        <a href="/sitemap">Sitemap</a> |
        <a href="/rss">RSS Feed</a>
      </p>
    </div>
  </footer>

  <!-- Scripts loaded at the end for performance -->
  <script src="/js/critical.js" defer></script>
  <script src="/js/main.js" defer></script>
  
  <!-- Service worker registration -->
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  </script>
</body>
</html>
```

---

## Modern CSS Architecture

### **Advanced CSS Layout Patterns**

```css
/* CSS Custom Properties and Design System */
:root {
  /* Color system */
  --color-primary-50: hsl(210, 100%, 97%);
  --color-primary-100: hsl(210, 100%, 92%);
  --color-primary-500: hsl(210, 100%, 50%);
  --color-primary-900: hsl(210, 100%, 8%);
  
  /* Typography scale */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-size-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --font-size-3xl: clamp(2rem, 1.7rem + 1.5vw, 3rem);
  
  /* Spacing scale */
  --space-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.375rem);
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --space-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  --space-xl: clamp(2rem, 1.6rem + 2vw, 3rem);
  --space-2xl: clamp(3rem, 2.4rem + 3vw, 4.5rem);
  
  /* Layout values */
  --max-width: 1200px;
  --content-width: 65ch;
  --sidebar-width: 20rem;
  --header-height: 4rem;
  
  /* Animation */
  --transition-fast: 150ms ease-out;
  --transition-medium: 250ms ease-out;
  --transition-slow: 400ms ease-out;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
}

/* Modern CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html {
  hanging-punctuation: first last;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  line-height: 1.6;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: var(--font-size-base);
  color: var(--color-primary-900);
  background-color: var(--color-primary-50);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  text-wrap: pretty;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: 1.2;
  margin-bottom: var(--space-sm);
}

/* Container Queries and Grid Layout */
.layout-container {
  container-type: inline-size;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
}

/* Advanced Grid Layouts */
.grid-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--space-lg);
}

.grid-auto-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
}

/* Intrinsic Web Design Pattern */
.intrinsic-layout {
  display: grid;
  grid-template-columns: 
    [full-start] 
    minmax(var(--space-lg), 1fr) 
    [content-start] 
    min(var(--content-width), 100% - var(--space-lg) * 2) 
    [content-end] 
    minmax(var(--space-lg), 1fr) 
    [full-end];
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.intrinsic-layout > * {
  grid-column: content;
}

.intrinsic-layout .full-width {
  grid-column: full;
}

/* Advanced Flexbox Patterns */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.flex-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

/* The Stack - Consistent Vertical Spacing */
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stack > * {
  margin-block: 0;
}

.stack > * + * {
  margin-block-start: var(--space, var(--space-md));
}

/* The Sidebar Layout */
.sidebar-layout {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
}

.sidebar-layout > :first-child {
  flex-basis: var(--sidebar-width);
  flex-grow: 1;
}

.sidebar-layout > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}

/* Container Query Responsive Design */
@container (min-width: 500px) {
  .feature-card {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr auto;
    gap: var(--space-sm) var(--space-md);
  }
  
  .feature-card img {
    grid-row: 1 / -1;
    align-self: start;
  }
  
  .feature-card h3 {
    margin-bottom: 0;
  }
}

/* Advanced Form Styling */
.form-group {
  display: grid;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.form-group label {
  font-weight: 600;
  color: var(--color-primary-900);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: var(--space-sm);
  border: 2px solid var(--color-primary-100);
  border-radius: var(--radius-md);
  background-color: white;
  transition: border-color var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.form-group input:invalid,
.form-group textarea:invalid,
.form-group select:invalid {
  border-color: #ef4444;
}

.form-group .error-message {
  color: #ef4444;
  font-size: var(--font-size-sm);
  margin-top: var(--space-xs);
}

.form-group .help-text {
  color: var(--color-primary-500);
  font-size: var(--font-size-sm);
}

/* Button Component System */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary-500);
  border-color: var(--color-primary-500);
}

.btn-secondary:hover {
  background-color: var(--color-primary-500);
  color: white;
}

/* Loading state */
.btn .btn-loading {
  display: none;
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn[aria-busy="true"] .btn-loading {
  display: block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Card Component */
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
  transition: box-shadow var(--transition-medium);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0;
}

.card-content {
  line-height: 1.6;
}

.card-footer {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-primary-100);
}

/* Navigation Component */
.nav-primary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) 0;
  background: white;
  border-bottom: 1px solid var(--color-primary-100);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-primary ul {
  display: flex;
  list-style: none;
  gap: var(--space-lg);
  margin: 0;
}

.nav-primary a {
  text-decoration: none;
  color: var(--color-primary-900);
  font-weight: 500;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.nav-primary a:hover,
.nav-primary a[aria-current="page"] {
  background-color: var(--color-primary-100);
}

/* Mobile menu toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: var(--space-sm);
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background-color: currentColor;
  transition: transform var(--transition-medium);
}

.mobile-menu-toggle[aria-expanded="true"] .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-toggle[aria-expanded="true"] .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle[aria-expanded="true"] .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-primary ul {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
    padding: var(--space-md);
  }
  
  .nav-primary ul[data-visible="true"] {
    display: flex;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .sidebar-layout {
    flex-direction: column;
  }
  
  .grid-auto-fit {
    grid-template-columns: 1fr;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary-50: hsl(210, 100%, 8%);
    --color-primary-100: hsl(210, 100%, 12%);
    --color-primary-500: hsl(210, 100%, 60%);
    --color-primary-900: hsl(210, 100%, 97%);
  }
  
  .card {
    background: var(--color-primary-100);
  }
  
  .nav-primary {
    background: var(--color-primary-100);
    border-bottom-color: var(--color-primary-200);
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  .btn {
    border-width: 3px;
  }
  
  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: 3px solid;
  }
}

/* Print Styles */
@media print {
  .nav-primary,
  .mobile-menu-toggle,
  .btn,
  aside {
    display: none;
  }
  
  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  a::after {
    content: " (" attr(href) ")";
  }
  
  h1, h2, h3 {
    break-after: avoid;
  }
}

/* Advanced Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp var(--transition-medium) ease-out;
}

/* Intersection Observer Animation */
.observe-fade {
  opacity: 0;
  transform: translateY(30px);
  transition: all var(--transition-slow);
}

.observe-fade.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* CSS Logical Properties */
.content {
  margin-inline: auto;
  padding-inline: var(--space-md);
  max-inline-size: var(--max-width);
}

.stack-logical {
  display: flex;
  flex-direction: column;
}

.stack-logical > * + * {
  margin-block-start: var(--space-md);
}

/* Advanced Selectors */
/* Style every 3rd item differently */
.feature-card:nth-child(3n) {
  background: linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100));
}

/* Style based on content */
.card:has(img) .card-header {
  grid-template-columns: auto 1fr;
  display: grid;
  gap: var(--space-sm);
}

/* Empty state styling */
.list:empty::before {
  content: "No items to display";
  color: var(--color-primary-500);
  font-style: italic;
  display: block;
  text-align: center;
  padding: var(--space-lg);
}

/* Focus management */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary-500);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: var(--radius-sm);
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* Utility Classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

/* Flow utility */
.flow > * + * {
  margin-top: var(--flow-space, 1em);
}

/* Measure utility for optimal reading length */
.measure {
  max-width: var(--measure, 60ch);
}

/* Center utility */
.center {
  box-sizing: content-box;
  margin-inline: auto;
  max-inline-size: var(--measure);
}
```

---

## CSS Performance Optimization

### **Critical CSS and Loading Strategies**

```css
/* Critical CSS - Above the fold styles */
/* This CSS should be inlined in the HTML head */

/* Critical layout */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Critical navigation */
.nav-primary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

/* Critical hero section */
.hero {
  padding: 3rem 0;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  line-height: 1.2;
}

/* Critical button styles */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.15s;
}

.btn:hover {
  background: #2563eb;
}

/* Critical grid for above-fold content */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

{% raw %}
```javascript
// Advanced CSS loading strategies
class CSSLoadingOptimizer {
  constructor() {
    this.criticalCSS = '';
    this.nonCriticalCSS = [];
    this.loadedStylesheets = new Set();
  }

  // Inline critical CSS
  inlineCriticalCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);
  }

  // Load non-critical CSS asynchronously
  loadNonCriticalCSS(href, media = 'all') {
    return new Promise((resolve, reject) => {
      if (this.loadedStylesheets.has(href)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print'; // Load with low priority
      
      link.onload = () => {
        link.media = media; // Switch to actual media
        this.loadedStylesheets.add(href);
        resolve();
      };
      
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }

  // Preload CSS for next page
  preloadCSS(href) {
    if (this.loadedStylesheets.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
      this.loadedStylesheets.add(href);
    };
    
    document.head.appendChild(link);
  }

  // Progressive CSS loading based on viewport
  loadCSSProgressively() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const cssFile = section.dataset.css;
          
          if (cssFile) {
            this.loadNonCriticalCSS(cssFile);
            observer.unobserve(section);
          }
        }
      });
    }, {
      rootMargin: '100px' // Load 100px before entering viewport
    });

    // Observe sections with data-css attributes
    document.querySelectorAll('[data-css]').forEach(section => {
      observer.observe(section);
    });
  }

  // CSS optimization techniques
  optimizeCSS() {
    // Remove unused CSS (simplified version)
    this.removeUnusedCSS();
    
    // Compress CSS
    this.compressCSS();
    
    // Split CSS by media queries
    this.splitCSSByMedia();
  }

  removeUnusedCSS() {
    const stylesheets = Array.from(document.styleSheets);
    const usedSelectors = new Set();
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules);
        
        rules.forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const selector = rule.selectorText;
            
            try {
              if (document.querySelector(selector)) {
                usedSelectors.add(selector);
              }
            } catch (e) {
              // Invalid selector, keep it anyway
              usedSelectors.add(selector);
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheet, skip
      }
    });
    
    return usedSelectors;
  }

  // Monitor CSS performance
  monitorCSSPerformance() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.initiatorType === 'css') {
          console.log('CSS Performance:', {
            name: entry.name,
            duration: entry.duration,
            transferSize: entry.transferSize,
            renderBlockingStatus: entry.renderBlockingStatus
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }

  // CSS metrics collection
  collectCSSMetrics() {
    const metrics = {
      stylesheetCount: document.styleSheets.length,
      inlineStyles: document.querySelectorAll('style').length,
      totalCSSSize: 0,
      renderBlockingCSS: 0
    };

    // Calculate total CSS size
    performance.getEntriesByType('resource')
      .filter(entry => entry.initiatorType === 'css')
      .forEach(entry => {
        metrics.totalCSSSize += entry.transferSize || 0;
        if (entry.renderBlockingStatus === 'blocking') {
          metrics.renderBlockingCSS++;
        }
      });

    return metrics;
  }
}

// CSS-in-JS performance optimization
class OptimizedStyledComponents {
  constructor() {
    this.styleCache = new Map();
    this.criticalStyles = new Set();
    this.componentStyles = new Map();
  }

  // Generate optimized CSS-in-JS
  createStyledComponent(tag, styles) {
    const styleId = this.generateStyleId(styles);
    
    if (this.styleCache.has(styleId)) {
      return this.styleCache.get(styleId);
    }

    const className = `styled-${styleId}`;
    const css = this.generateCSS(className, styles);
    
    // Check if this is a critical component
    if (this.isCritical(tag)) {
      this.criticalStyles.add(css);
    }

    this.injectCSS(css);
    this.styleCache.set(styleId, className);
    
    return className;
  }

  generateStyleId(styles) {
    const styleString = JSON.stringify(styles);
    return this.hashCode(styleString).toString(36);
  }

  generateCSS(className, styles) {
    const cssProperties = Object.entries(styles)
      .map(([property, value]) => {
        const kebabProperty = property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        return `${kebabProperty}: ${value};`;
      })
      .join(' ');

    return `.${className} { ${cssProperties} }`;
  }

  isCritical(tag) {
    const criticalTags = ['header', 'nav', 'main', 'h1', 'h2'];
    return criticalTags.includes(tag);
  }

  injectCSS(css) {
    const styleElement = document.getElementById('styled-components') || this.createStyleElement();
    styleElement.textContent += css;
  }

  createStyleElement() {
    const style = document.createElement('style');
    style.id = 'styled-components';
    style.type = 'text/css';
    document.head.appendChild(style);
    return style;
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Extract critical CSS for server-side rendering
  getCriticalCSS() {
    return Array.from(this.criticalStyles).join('');
  }

  // Tree-shake unused styles
  removeUnusedStyles() {
    const usedClasses = new Set();
    
    // Find all used classes in the DOM
    document.querySelectorAll('*').forEach(element => {
      element.classList.forEach(className => {
        if (className.startsWith('styled-')) {
          usedClasses.add(className);
        }
      });
    });

    // Remove unused styles from cache
    this.styleCache.forEach((className, styleId) => {
      if (!usedClasses.has(className)) {
        this.styleCache.delete(styleId);
      }
    });
  }
}
```
{% endraw %}

This comprehensive HTML and CSS fundamentals guide provides the foundation for building modern, accessible, and performant web applications that meet the standards expected at Big Tech companies.
