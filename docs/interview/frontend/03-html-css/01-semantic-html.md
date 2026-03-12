# Semantic HTML - Meaningful Markup

> Semantic HTML cải thiện accessibility, SEO, và maintainability. Foundation cho web development.

---

## 🎯 Overview

Semantic HTML = dùng HTML elements theo **meaning**, không chỉ appearance.

```
┌─────────────────────────────────────────────────────────────────┐
│            NON-SEMANTIC vs SEMANTIC                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   NON-SEMANTIC                    SEMANTIC                       │
│   ┌────────────────────┐         ┌────────────────────┐         │
│   │ <div class="header">│         │ <header>           │         │
│   │ <div class="nav">   │   →     │ <nav>              │         │
│   │ <div class="main">  │         │ <main>             │         │
│   │ <div class="footer">│         │ <footer>           │         │
│   └────────────────────┘         └────────────────────┘         │
│                                                                   │
│   Benefits of Semantic:                                          │
│   • Screen readers understand structure                          │
│   • Search engines index better                                  │
│   • Code is self-documenting                                     │
│   • Easier to style and maintain                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📄 Document Structure

### Page Layout

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
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
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>

            <section>
                <h2>Section Title</h2>
                <p>Content...</p>
            </section>

            <footer>
                <p>Author: John Doe</p>
            </footer>
        </article>

        <aside>
            <h2>Related Posts</h2>
            <ul>
                <li><a href="/post1">Post 1</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 Company Name</p>
    </footer>
</body>
</html>
```

### Sectioning Elements

| Element | Purpose | Use Case |
|---------|---------|----------|
| `<header>` | Introductory content | Page header, article header |
| `<nav>` | Navigation links | Main nav, breadcrumbs |
| `<main>` | Main content (unique) | Primary page content |
| `<article>` | Self-contained content | Blog post, news article |
| `<section>` | Thematic grouping | Chapters, tabs |
| `<aside>` | Tangential content | Sidebar, callout |
| `<footer>` | Footer content | Copyright, links |

### article vs section vs div

```html
<!-- article: Self-contained, can be distributed independently -->
<article>
    <h2>Blog Post Title</h2>
    <p>This makes sense on its own...</p>
</article>

<!-- section: Thematic grouping, part of something larger -->
<section>
    <h2>Chapter 1</h2>
    <p>Part of a book...</p>
</section>

<!-- div: No semantic meaning, for styling/scripting only -->
<div class="container">
    <div class="grid">...</div>
</div>
```

---

## 📝 Text Content

### Headings

```html
<!-- Proper heading hierarchy -->
<h1>Main Title (one per page)</h1>
    <h2>Section Title</h2>
        <h3>Subsection</h3>
        <h3>Subsection</h3>
    <h2>Another Section</h2>
        <h3>Subsection</h3>

<!-- ❌ Don't skip levels -->
<h1>Title</h1>
<h4>Subsection</h4>  <!-- Wrong! Should be h2 -->
```

### Text Semantics

```html
<!-- Emphasis -->
<em>emphasized text</em>        <!-- Stress emphasis -->
<strong>strong importance</strong>  <!-- Strong importance -->
<mark>highlighted text</mark>   <!-- Marked/highlighted -->

<!-- Technical/Code -->
<code>inline code</code>
<pre><code>code block</code></pre>
<kbd>Ctrl + C</kbd>             <!-- Keyboard input -->
<samp>Sample output</samp>      <!-- Sample output -->
<var>variable</var>             <!-- Variable -->

<!-- Quotations -->
<blockquote cite="https://...">
    <p>Long quote...</p>
</blockquote>
<q>Short inline quote</q>

<!-- Abbreviations -->
<abbr title="HyperText Markup Language">HTML</abbr>

<!-- Time -->
<time datetime="2024-01-15">January 15, 2024</time>
<time datetime="14:30">2:30 PM</time>

<!-- Address -->
<address>
    Contact: <a href="mailto:email@example.com">email@example.com</a>
</address>
```

---

## 🖼️ Media & Figures

### Figure with Caption

```html
<figure>
    <img src="chart.png" alt="Sales growth chart showing 50% increase">
    <figcaption>Figure 1: Q4 2024 Sales Growth</figcaption>
</figure>

<!-- Code example -->
<figure>
    <pre><code>function hello() {
    console.log('Hello');
}</code></pre>
    <figcaption>Example: Hello World function</figcaption>
</figure>

<!-- Quotation -->
<figure>
    <blockquote>
        <p>The only way to do great work is to love what you do.</p>
    </blockquote>
    <figcaption>— Steve Jobs</figcaption>
</figure>
```

### Images

```html
<!-- Informative image -->
<img src="product.jpg" alt="Red Nike running shoes, size 10">

<!-- Decorative image -->
<img src="decoration.svg" alt="" role="presentation">

<!-- Responsive images -->
<picture>
    <source media="(min-width: 1024px)" srcset="large.jpg">
    <source media="(min-width: 768px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Description">
</picture>

<!-- srcset for resolution -->
<img
    src="image.jpg"
    srcset="image.jpg 1x, image@2x.jpg 2x"
    alt="Description"
>
```

---

## 📋 Lists & Tables

### Lists

```html
<!-- Unordered list -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<!-- Ordered list -->
<ol>
    <li>First step</li>
    <li>Second step</li>
</ol>

<!-- Description list -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
</dl>
```

### Accessible Tables

```html
<table>
    <caption>Monthly Sales Report</caption>
    <thead>
        <tr>
            <th scope="col">Month</th>
            <th scope="col">Sales</th>
            <th scope="col">Growth</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">January</th>
            <td>$10,000</td>
            <td>+5%</td>
        </tr>
        <tr>
            <th scope="row">February</th>
            <td>$12,000</td>
            <td>+20%</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Total</th>
            <td>$22,000</td>
            <td>+12.5%</td>
        </tr>
    </tfoot>
</table>
```

---

## 📝 Forms

### Accessible Forms

```html
<form action="/submit" method="post">
    <fieldset>
        <legend>Personal Information</legend>

        <div>
            <label for="name">Full Name *</label>
            <input
                type="text"
                id="name"
                name="name"
                required
                aria-required="true"
            >
        </div>

        <div>
            <label for="email">Email *</label>
            <input
                type="email"
                id="email"
                name="email"
                required
                aria-describedby="email-hint"
            >
            <small id="email-hint">We'll never share your email.</small>
        </div>
    </fieldset>

    <fieldset>
        <legend>Preferences</legend>

        <div>
            <input type="checkbox" id="newsletter" name="newsletter">
            <label for="newsletter">Subscribe to newsletter</label>
        </div>

        <div>
            <span id="contact-label">Preferred contact method:</span>
            <div role="group" aria-labelledby="contact-label">
                <input type="radio" id="contact-email" name="contact" value="email">
                <label for="contact-email">Email</label>

                <input type="radio" id="contact-phone" name="contact" value="phone">
                <label for="contact-phone">Phone</label>
            </div>
        </div>
    </fieldset>

    <button type="submit">Submit</button>
</form>
```

---

## ♿ Accessibility

### ARIA Landmarks

```html
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>

<!-- Note: HTML5 semantic elements have implicit roles -->
<!-- Only add role when using div or for older browser support -->
```

### Common ARIA Attributes

```html
<!-- Labels -->
<button aria-label="Close dialog">×</button>
<input aria-labelledby="label-id">

<!-- Descriptions -->
<input aria-describedby="hint-id">
<p id="hint-id">Password must be 8+ characters</p>

<!-- States -->
<button aria-expanded="false">Menu</button>
<div aria-hidden="true">Decorative content</div>
<input aria-invalid="true" aria-errormessage="error-id">

<!-- Live regions -->
<div aria-live="polite">Status updates here</div>
<div aria-live="assertive">Critical alerts here</div>
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Semantic HTML là gì?**

A: Dùng HTML elements theo meaning (ý nghĩa), không chỉ appearance. Ví dụ: `<nav>` cho navigation thay vì `<div class="nav">`.

**Q: Tại sao semantic HTML quan trọng?**

A:
- Accessibility: Screen readers hiểu structure
- SEO: Search engines index tốt hơn
- Maintainability: Code tự document

### 🟡 Mid-level

**Q: article vs section vs div?**

A:
- `article`: Self-contained, có thể reuse/distribute
- `section`: Thematic grouping, part of larger content
- `div`: No semantic meaning, chỉ cho styling

**Q: Khi nào dùng ARIA?**

A: First rule of ARIA: Don't use ARIA if native HTML works. Chỉ dùng khi:
- Custom widgets (tabs, modals)
- Dynamic content updates
- Missing native semantics

### 🔴 Senior

**Q: Design accessible form với validation**

A: See Forms section - use proper labels, fieldsets, error messages, ARIA attributes.

---

## 📚 Active Recall

1. [ ] List 5 sectioning elements
2. [ ] Khi nào dùng figure vs img?
3. [ ] Proper heading hierarchy?
4. [ ] Form accessibility checklist?
5. [ ] ARIA landmarks?

---

> **Tiếp theo:** [02-css-fundamentals.md](./02-css-fundamentals.md) - CSS Box Model & Specificity
