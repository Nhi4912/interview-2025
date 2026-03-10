# Design Tokens
> Single source of truth for colors, typography, spacing, and component patterns.

## Color Palette

The project uses a subset of the Tailwind gray/blue/green/amber/red/violet palette, applied via CSS custom properties in CSS Modules.

### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-bg` | `#ffffff` | `#111827` (gray-900) | Page background |
| `--color-bg-surface` | `#f9fafb` (gray-50) | `#1f2937` (gray-800) | Card/panel background |
| `--color-bg-surface-alt` | `#f3f4f6` (gray-100) | `#374151` (gray-700) | Alternate surface (zebra rows, hover) |
| `--color-border` | `#e5e7eb` (gray-200) | `#374151` (gray-700) | Default borders |
| `--color-border-hover` | `#d1d5db` (gray-300) | `#4b5563` (gray-600) | Border on hover/focus |
| `--color-text-primary` | `#111827` (gray-900) | `#f9fafb` (gray-50) | Headings, primary text |
| `--color-text-secondary` | `#6b7280` (gray-500) | `#9ca3af` (gray-400) | Secondary/muted text |
| `--color-text-tertiary` | `#9ca3af` (gray-400) | `#6b7280` (gray-500) | Placeholder, disabled text |

### Brand / Accent

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-primary` | `#3b82f6` (blue-500) | `#60a5fa` (blue-400) | Links, active states, focus rings |
| `--color-primary-hover` | `#2563eb` (blue-600) | `#3b82f6` (blue-500) | Primary hover state |
| `--color-primary-bg` | `#eff6ff` (blue-50) | `#1e3a8a` (blue-900) | Primary tinted background |
| `--color-primary-text` | `#1e40af` (blue-800) | `#dbeafe` (blue-100) | Text on primary-bg |

### Status Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-success` | `#10b981` (emerald-500) | `#10b981` | Complete, passed, success |
| `--color-success-bg` | `#d1fae5` (green-100) | `#064e3b` (emerald-900) | Success background |
| `--color-success-text` | `#065f46` (emerald-800) | `#d1fae5` (green-100) | Text on success-bg |
| `--color-warning` | `#f59e0b` (amber-500) | `#f59e0b` | In-progress, medium priority |
| `--color-warning-bg` | `#fef3c7` (amber-100) | `#78350f` (amber-900) | Warning background |
| `--color-warning-text` | `#92400e` (amber-800) | `#fef3c7` (amber-100) | Text on warning-bg |
| `--color-error` | `#ef4444` (red-500) | `#ef4444` | Failed, low priority, error |
| `--color-error-bg` | `#fee2e2` (red-100) | `#7f1d1d` (red-900) | Error background |
| `--color-error-text` | `#991b1b` (red-800) | `#fee2e2` (red-100) | Text on error-bg |

### Difficulty Levels

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-junior` | `#059669` (emerald-600) | `#34d399` (emerald-400) | Junior / Beginner |
| `--color-middle` | `#d97706` (amber-600) | `#fbbf24` (amber-400) | Middle / Intermediate |
| `--color-senior` | `#dc2626` (red-600) | `#f87171` (red-400) | Senior / Advanced |
| `--color-expert` | `#7c3aed` (violet-600) | `#a78bfa` (violet-400) | Expert level |

### Code Blocks

| Token | Value | Usage |
|-------|-------|-------|
| `--color-code-bg` | `#1f2937` (gray-800) / `#0f172a` (slate-900) | Code block background |
| `--color-code-text` | `#f9fafb` (gray-50) / `#e2e8f0` (slate-200) | Code block text |

---

## Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif` | Body text, UI elements |
| `--font-mono` | `source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace` | Code blocks, inline code |

### Font Sizes (rem-based scale)

| Token | Value | Px equiv | Usage |
|-------|-------|----------|-------|
| `--text-xs` | `0.75rem` | 12px | Badges, footnotes |
| `--text-sm` | `0.875rem` | 14px | Secondary text, labels, metadata |
| `--text-base` | `1rem` | 16px | Body text (default) |
| `--text-lg` | `1.125rem` | 18px | Emphasized body, subheadings |
| `--text-xl` | `1.25rem` | 20px | Section headings (h3) |
| `--text-2xl` | `1.5rem` | 24px | Page subheadings (h2) |
| `--text-3xl` | `1.875rem` | 30px | Page titles (h1) |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-normal` | `400` | Body text |
| `--font-medium` | `500` | Labels, navigation |
| `--font-semibold` | `600` | Subheadings, emphasis |
| `--font-bold` | `700` | Headings, strong emphasis |

---

## Spacing Scale

Use `rem` units for all spacing. Follow a 4px base grid (0.25rem increments).

| Token | Value | Px equiv | Usage |
|-------|-------|----------|-------|
| `--space-1` | `0.25rem` | 4px | Tight gaps (inline elements) |
| `--space-2` | `0.5rem` | 8px | Small padding, icon gaps |
| `--space-3` | `0.75rem` | 12px | Input padding, compact cards |
| `--space-4` | `1rem` | 16px | Default padding, paragraph spacing |
| `--space-5` | `1.25rem` | 20px | Card padding |
| `--space-6` | `1.5rem` | 24px | Section padding |
| `--space-8` | `2rem` | 32px | Large section gaps |
| `--space-12` | `3rem` | 48px | Page section margins |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.25rem` (4px) | Badges, tags, small elements |
| `--radius-md` | `0.375rem` (6px) | Buttons, inputs |
| `--radius-lg` | `0.5rem` (8px) | Cards, panels |
| `--radius-xl` | `0.75rem` (12px) | Modals, large cards |
| `--radius-full` | `9999px` | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation (buttons) |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modals, popovers |

---

## Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `150ms ease` | Hover states, color changes |
| `--transition-normal` | `200ms ease` | Default transitions |
| `--transition-slow` | `300ms ease` | Layout shifts, expanding panels |

---

## Dark Mode Strategy

Use `@media (prefers-color-scheme: dark)` at the component level in CSS Modules. Define CSS custom properties with light-mode fallbacks:

```css
/* Component.module.css */
.container {
  background: var(--background, #ffffff);
  color: var(--text-primary, #111827);
  border: 1px solid var(--border, #e5e7eb);
}

@media (prefers-color-scheme: dark) {
  .container {
    --background: #1f2937;
    --text-primary: #f9fafb;
    --border: #374151;
  }
}
```

### Rules
1. Always define light-mode values as `var()` fallbacks (not in a separate media query)
2. Only override variables in the `prefers-color-scheme: dark` block
3. Never use hardcoded hex values directly in property declarations — always use `var()` with a fallback
4. Test both themes during development

---

## Component Patterns

### Buttons
- Primary: `--color-primary` bg, white text, `--radius-md`, `--shadow-sm`
- Secondary: transparent bg, `--color-border` border, `--color-text-primary` text
- Danger: `--color-error` bg, white text

### Cards
- Background: `--color-bg-surface`
- Border: `1px solid var(--border, --color-border)`
- Radius: `--radius-lg`
- Padding: `--space-5` or `--space-6`

### Inputs
- Background: `--color-bg`
- Border: `--color-border`, `--color-primary` on focus
- Radius: `--radius-md`
- Padding: `--space-2` vertical, `--space-3` horizontal
- Font size: `--text-base`

### Status Badges (Difficulty)
- Junior: `--color-junior` text, light green bg
- Middle: `--color-middle` text, light amber bg
- Senior: `--color-senior` text, light red bg
- Format: pill shape (`--radius-full`), `--text-xs` font, `--space-1` padding

---

## Migration Notes

### Current State
- Some components use `var()` with inline fallbacks (preferred pattern)
- Some components use hardcoded hex with `@media` dark overrides (legacy)
- `src/styles/mdx.css` uses Tailwind `@apply` directives which are non-functional (Tailwind is not installed)
- `src/app/sdd-workspace/page.module.css` is dark-only with unique hex values (intentional for SDD theme)

### Target State
- All new components must use the `var()` fallback pattern described above
- Existing components should be migrated to use semantic token names during refactors
- `mdx.css` Tailwind classes should be replaced with CSS Modules equivalents
- Spacing and font sizes should use `rem` units exclusively
