# HTML5 Fundamentals
## HTML - Chapter 0

[Back to Table of Contents](../00-table-of-contents.md)

---

## Overview

HTML5 is the latest evolution of HTML, providing semantic elements, multimedia support, and powerful APIs. This chapter covers essential HTML5 concepts for Big Tech interviews.

---

## Table of Contents

1. [Semantic HTML](#semantic-html)
2. [Document Structure](#document-structure)
3. [Forms and Input Types](#forms-and-input-types)
4. [Multimedia Elements](#multimedia-elements)
5. [Accessibility](#accessibility)
6. [SEO Best Practices](#seo-best-practices)
7. [Meta Tags](#meta-tags)
8. [Interview Questions](#interview-questions)

---

## Semantic HTML

### Why Semantic HTML?

**Benefits:**
- Better accessibility
- Improved SEO
- Easier maintenance
- Better browser support
- Clearer code structure

### Semantic Elements

```html
<!-- Document Structure -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h1>Article Title</h1>
      <p>Published on <time datetime="2025-01-31">January 31, 2025</time></p>
    </header>
    
    <section>
      <h2>Section Title</h2>
      <p>Content goes here...</p>
    </section>
    
    <aside>
      <h3>Related Content</h3>
      <p>Sidebar information</p>
    </aside>
    
    <footer>
      <p>Author: John Doe</p>
    </footer>
  </article>
</main>

<footer>
  <p>&copy; 2025 Company Name</p>
</footer>
```

### Semantic vs Non-Semantic

```html
<!-- ❌ Non-semantic (bad) -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>
<div class="content">
  <div class="article">
    <div class="title">Title</div>
  </div>
</div>

<!-- ✅ Semantic (good) -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Title</h1>
  </article>
</main>
```

---

## Document Structure

### Complete HTML5 Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <meta name="keywords" content="keyword1, keyword2">
  <meta name="author" content="Author Name">
  
  <title>Page Title</title>
  
  <!-- Open Graph -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Description">
  <meta property="og:image" content="image.jpg">
  <meta property="og:url" content="https://example.com">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="styles.css">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="font.woff2" as="font" crossorigin>
</head>
<body>
  <header>
    <nav><!-- Navigation --></nav>
  </header>
  
  <main>
    <!-- Main content -->
  </main>
  
  <footer>
    <!-- Footer content -->
  </footer>
  
  <!-- Scripts at end of body -->
  <script src="script.js" defer></script>
</body>
</html>
```

---

## Forms and Input Types

### Modern Form Elements

```html
<form action="/submit" method="POST">
  <!-- Text inputs -->
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <!-- Email with validation -->
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <!-- Password -->
  <label for="password">Password:</label>
  <input type="password" id="password" name="password" 
         minlength="8" required>
  
  <!-- Number with range -->
  <label for="age">Age:</label>
  <input type="number" id="age" name="age" 
         min="18" max="100" required>
  
  <!-- Date -->
  <label for="birthdate">Birthdate:</label>
  <input type="date" id="birthdate" name="birthdate">
  
  <!-- Time -->
  <label for="time">Time:</label>
  <input type="time" id="time" name="time">
  
  <!-- Color picker -->
  <label for="color">Favorite Color:</label>
  <input type="color" id="color" name="color">
  
  <!-- Range slider -->
  <label for="volume">Volume:</label>
  <input type="range" id="volume" name="volume" 
         min="0" max="100" value="50">
  
  <!-- File upload -->
  <label for="file">Upload File:</label>
  <input type="file" id="file" name="file" 
         accept="image/*" multiple>
  
  <!-- Textarea -->
  <label for="message">Message:</label>
  <textarea id="message" name="message" 
            rows="4" required></textarea>
  
  <!-- Select dropdown -->
  <label for="country">Country:</label>
  <select id="country" name="country" required>
    <option value="">Select...</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
  </select>
  
  <!-- Radio buttons -->
  <fieldset>
    <legend>Gender:</legend>
    <label>
      <input type="radio" name="gender" value="male">
      Male
    </label>
    <label>
      <input type="radio" name="gender" value="female">
      Female
    </label>
  </fieldset>
  
  <!-- Checkboxes -->
  <label>
    <input type="checkbox" name="terms" required>
    I agree to terms
  </label>
  
  <!-- Submit button -->
  <button type="submit">Submit</button>
</form>
```

### Form Validation

```html
<!-- HTML5 validation attributes -->
<input type="text" required>
<input type="email" required>
<input type="url" required>
<input type="number" min="0" max="100">
<input type="text" minlength="3" maxlength="20">
<input type="text" pattern="[A-Za-z]{3,}">

<!-- Custom validation message -->
<input type="text" id="username" required
       oninvalid="this.setCustomValidity('Please enter username')"
       oninput="this.setCustomValidity('')">
```

---

## Multimedia Elements

### Images

```html
<!-- Basic image -->
<img src="image.jpg" alt="Description" width="800" height="600">

<!-- Responsive images -->
<img src="small.jpg"
     srcset="small.jpg 400w,
             medium.jpg 800w,
             large.jpg 1200w"
     sizes="(max-width: 600px) 400px,
            (max-width: 1000px) 800px,
            1200px"
     alt="Responsive image">

<!-- Picture element for art direction -->
<picture>
  <source media="(min-width: 1000px)" srcset="large.jpg">
  <source media="(min-width: 600px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>

<!-- Lazy loading -->
<img src="image.jpg" alt="Description" loading="lazy">
```

### Video

```html
<!-- Basic video -->
<video controls width="640" height="360">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser doesn't support video.
</video>

<!-- Video with attributes -->
<video controls autoplay muted loop poster="poster.jpg">
  <source src="video.mp4" type="video/mp4">
  <track kind="subtitles" src="subtitles.vtt" srclang="en" label="English">
</video>
```

### Audio

```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser doesn't support audio.
</audio>
```

---

## Accessibility

### ARIA Attributes

```html
<!-- Landmarks -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Buttons -->
<button aria-label="Close dialog" aria-pressed="false">
  <span aria-hidden="true">×</span>
</button>

<!-- Form labels -->
<label for="search">Search:</label>
<input type="search" id="search" 
       aria-describedby="search-help">
<p id="search-help">Enter keywords to search</p>

<!-- Live regions -->
<div aria-live="polite" aria-atomic="true">
  <p>Status message</p>
</div>

<!-- Hidden content -->
<span class="visually-hidden">
  Additional context for screen readers
</span>
```

### Keyboard Navigation

```html
<!-- Tab index -->
<div tabindex="0">Focusable div</div>
<div tabindex="-1">Programmatically focusable</div>

<!-- Skip links -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<main id="main-content">
  <!-- Content -->
</main>
```

---

## SEO Best Practices

### Heading Hierarchy

```html
<!-- ✅ Correct hierarchy -->
<h1>Main Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>

<!-- ❌ Wrong: Skipping levels -->
<h1>Main Title</h1>
  <h3>Subsection</h3> <!-- Skipped h2 -->
```

### Links

```html
<!-- Descriptive link text -->
<a href="/article">Read the full article</a>

<!-- ❌ Avoid generic text -->
<a href="/article">Click here</a>

<!-- External links -->
<a href="https://example.com" 
   target="_blank" 
   rel="noopener noreferrer">
  External Link
</a>
```

---

## Meta Tags

### Essential Meta Tags

```html
<head>
  <!-- Character encoding -->
  <meta charset="UTF-8">
  
  <!-- Viewport for responsive -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Description (150-160 characters) -->
  <meta name="description" content="Page description for search engines">
  
  <!-- Keywords (optional, less important now) -->
  <meta name="keywords" content="keyword1, keyword2, keyword3">
  
  <!-- Author -->
  <meta name="author" content="Author Name">
  
  <!-- Robots -->
  <meta name="robots" content="index, follow">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://example.com/page">
  
  <!-- Language -->
  <meta http-equiv="content-language" content="en">
</head>
```

### Open Graph (Social Media)

```html
<!-- Facebook/LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:site_name" content="Site Name">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@username">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

---

## Interview Questions

### Q1: What's the difference between `<div>` and `<section>`?

**Answer:**
- `<div>`: Generic container, no semantic meaning
- `<section>`: Thematic grouping of content, semantic meaning

Use `<section>` when content has a heading and represents a distinct section.

### Q2: What are semantic HTML elements and why use them?

**Answer:**
Semantic elements clearly describe their meaning:
- Better accessibility (screen readers)
- Improved SEO
- Easier maintenance
- Better browser support

Examples: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`

### Q3: How do you make a website accessible?

**Answer:**
1. Use semantic HTML
2. Add ARIA attributes
3. Ensure keyboard navigation
4. Provide alt text for images
5. Use proper heading hierarchy
6. Ensure sufficient color contrast
7. Add captions for videos
8. Test with screen readers

### Q4: What's the purpose of the viewport meta tag?

**Answer:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Controls how the page is displayed on mobile devices:
- `width=device-width`: Match screen width
- `initial-scale=1.0`: Initial zoom level

### Q5: What's the difference between `<article>` and `<section>`?

**Answer:**
- `<article>`: Self-contained, independently distributable content (blog post, news article)
- `<section>`: Thematic grouping within a document

An `<article>` can contain `<section>`s, and vice versa.

---

## Key Takeaways

1. Use semantic HTML for better accessibility and SEO
2. Proper document structure improves maintainability
3. HTML5 form validation reduces JavaScript needs
4. Multimedia elements support modern content
5. ARIA attributes enhance accessibility
6. Meta tags improve SEO and social sharing
7. Heading hierarchy matters for SEO
8. Always include alt text for images

---

[Back to Table of Contents](../00-table-of-contents.md)
