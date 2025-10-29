# Responsive Design / Thiết Kế Responsive
## CSS - Chapter 3 / CSS - Chương 3

[Back to Table of Contents](../00-table-of-contents.md)

---

## Media Queries

```css
/* Mobile First Approach / Cách tiếp cận Mobile First */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet / Máy tính bảng */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Desktop / Máy tính để bàn */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

/* Large Desktop / Máy tính để bàn lớn */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

## Responsive Typography

```css
/* Fluid Typography / Typography linh hoạt */
:root {
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-size-xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
}

body {
  font-size: var(--font-size-base);
}

h1 {
  font-size: var(--font-size-xl);
}

h2 {
  font-size: var(--font-size-lg);
}
```

## Container Queries

```css
/* Container Queries / Truy vấn Container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: flex;
  flex-direction: column;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

## Responsive Images

```html
<!-- Responsive Images / Hình ảnh Responsive -->
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="image-large.jpg"
  />
  <source
    media="(min-width: 768px)"
    srcset="image-medium.jpg"
  />
  <img
    src="image-small.jpg"
    alt="Responsive image"
  />
</picture>

<!-- Srcset for different resolutions / Srcset cho độ phân giải khác nhau -->
<img
  src="image.jpg"
  srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x"
  alt="High DPI image"
/>
```

---

[Back to Table of Contents](../00-table-of-contents.md)
