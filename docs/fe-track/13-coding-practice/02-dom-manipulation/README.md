# DOM Manipulation Challenges

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

> Bài tập xây dựng UI components với vanilla JavaScript và DOM APIs.

---

## 📋 Problem List

| # | Problem | Difficulty | Time | Focus |
|---|---------|------------|------|-------|
| 1 | Infinite Scroll | 🟡 Medium | 30 min | IntersectionObserver |
| 2 | Drag and Drop | 🟡 Medium | 30 min | Drag Events |
| 3 | Modal Dialog | 🟢 Easy | 20 min | Accessibility |
| 4 | Form Validation | 🟡 Medium | 25 min | Validation APIs |
| 5 | Virtual List | 🔴 Hard | 45 min | Windowing |
| 6 | Autocomplete | 🟡 Medium | 30 min | Debounce, A11y |
| 7 | Carousel/Slider | 🟡 Medium | 35 min | Touch Events |
| 8 | Tooltip | 🟢 Easy | 20 min | Positioning |

---

## 🎯 Key Concepts

```javascript
// 1. Event Delegation
document.querySelector('#list').addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleItemClick(e.target);
  }
});

// 2. IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMore();
    }
  });
}, { threshold: 0.1 });

// 3. MutationObserver
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('DOM changed:', mutation);
  });
});

// 4. ResizeObserver
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    console.log('Size:', entry.contentRect);
  });
});

// 5. requestAnimationFrame
function animate() {
  // Update DOM
  requestAnimationFrame(animate);
}
```

---

## 📊 DOM APIs Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOM MANIPULATION APIs                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SELECTION:                                                    │
│   • querySelector / querySelectorAll                            │
│   • getElementById / getElementsByClassName                     │
│   • closest() / matches()                                       │
│                                                                   │
│   MODIFICATION:                                                 │
│   • innerHTML / textContent / innerText                         │
│   • appendChild / insertBefore / removeChild                    │
│   • insertAdjacentHTML / insertAdjacentElement                  │
│   • cloneNode / replaceChild                                    │
│                                                                   │
│   ATTRIBUTES:                                                   │
│   • getAttribute / setAttribute / removeAttribute               │
│   • classList.add/remove/toggle/contains                        │
│   • dataset (data-* attributes)                                 │
│                                                                   │
│   STYLES:                                                       │
│   • style.property / cssText                                    │
│   • getComputedStyle()                                          │
│   • getBoundingClientRect()                                     │
│                                                                   │
│   EVENTS:                                                       │
│   • addEventListener / removeEventListener                      │
│   • dispatchEvent                                               │
│   • event.preventDefault / stopPropagation                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💡 Sample Implementation: Modal Dialog

```javascript
class Modal {
  constructor() {
    this.overlay = null;
    this.modal = null;
    this.previouslyFocused = null;
  }

  open(content) {
    // Save current focus
    this.previouslyFocused = document.activeElement;

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');

    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.innerHTML = `
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <div class="modal-content">${content}</div>
    `;

    // Add to DOM
    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';

    // Focus trap
    this.setupFocusTrap();

    // Event listeners
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
    document.addEventListener('keydown', this.handleKeydown);

    // Focus first focusable element
    const focusable = this.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
  }

  close() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.removeChild(this.overlay);
    document.body.style.overflow = '';
    this.previouslyFocused?.focus();
  }

  handleKeydown = (e) => {
    if (e.key === 'Escape') this.close();
  };

  setupFocusTrap() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    this.modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    });
  }
}

// Usage
const modal = new Modal();
document.querySelector('#open-btn').addEventListener('click', () => {
  modal.open('<h2>Hello World</h2><p>Modal content here</p>');
});
```

---

## 🔑 Accessibility Checklist

```
FOR ALL INTERACTIVE COMPONENTS:
□ Keyboard navigable (Tab, Arrow keys)
□ Focus visible (outline)
□ Screen reader announcements (aria-live)
□ Proper roles and labels
□ Focus management (trap, restore)
□ Escape key closes overlays
```

---

> **Quay lại:** [Coding Practice](../README.md)
