# Design Systems / Hệ Thống Thiết Kế

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [FE System Design README](./README.md) · [CSS-in-JS Comparison](../05-html-css/09-css-in-js-comparison.md) · [CSS Frameworks](../05-html-css/08-css-framework-comparison.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Your company just hit Series B. Design team has 4 designers, engineering has 40 developers across 6 squads. How do you build a design system, and how do you stop components from drifting?"_

Hầu hết candidates sẽ trả lời: _"We create a shared component library in Storybook."_ Đây là câu trả lời của Junior. Một Senior Engineer sẽ hỏi ngược lại: "What's your token strategy? Who owns the contribution pipeline? How do you handle breaking changes across 6 squads?" Và sau đó trình bày từng lớp của hệ thống.

**The production reality behind this question:**

- **Shopify Polaris** (2017 → nay): 10,000+ merchant stores, 60+ components, monorepo với versioning độc lập, tokens riêng cho web/mobile/email. Năm 2023, Polaris chuyển sang headless architecture để hỗ trợ React Native.
- **Atlassian Design System** (ADS): 2,000+ engineers trải rộng Jira, Confluence, Trello, Bitbucket. Atlassian dùng mô hình federated contribution — mỗi product team có thể gửi component, nhưng DS team review trước khi merge. Không có DS, Jira và Confluence UI sẽ diverge hoàn toàn về color, spacing, motion.
- **GitHub Primer**: 1,000+ Web Components, codebase có >10 năm history, đang migrate từ Rails partials sang Primer React và Primer ViewComponents (Ruby). 2 rendering targets (JS và server-side Ruby) từ cùng một token source.
- **Material 3 (Material You)** migration: 50+ new design tokens, breaking changes từ M2's "elevation" concept sang M3's "tonal color" system. Google tốn 18 tháng để migrate tất cả first-party Android apps — minh chứng cho cost của breaking change trong design system.

Đây là lý do tại sao biết **design systems architecture** là senior signal: nó phản ánh khả năng build systems mà hàng chục teams có thể dùng mà không conflict.

---

## What & Why / Cái Gì & Tại Sao

**Design System** = Single source of truth gồm 4 lớp:

1. **Design tokens** — shared variables cho color, spacing, typography, motion (primitive level)
2. **Components** — reusable UI pieces với defined API (Button, Input, Modal)
3. **Patterns** — composed solutions cho common UX problems (Form validation, Empty states)
4. **Documentation** — usage guidelines, do/don't, accessibility notes

Không phải chỉ là "component library" — component library chỉ là lớp 2. Design system bao gồm cả token strategy và pattern library bên trên nó.

**Tại sao mọi công ty Series B+ đều cần design system?**

- Series A (5–15 engineers): Tất cả biết nhau, copy-paste CSS nhất quán, weekly design sync đủ.
- Series B (40–100 engineers): 6+ product squads, thiếu nhất quán ngay. Button có 12 biến thể khác nhau vì mỗi squad tự làm. Dark mode impossible vì raw hex codes nằm khắp nơi.
- Series C+: Cost of NOT having DS = 20–30% engineering time lost to pixel-pushing, accessibility debt, và re-implementing components từng squad.

**Cost of NOT having a design system (concrete):**

```
Visual drift:    6 squads × 2 "quick" color tweaks/month = 12 diverged button states/month
Duplicate work:  40-person team × 2hr/week fixing CSS = 80 dev-hours/week = $8,000/week at $50/hr
Accessibility:   Each squad implements focus trap differently → 6 broken modal implementations
Dark mode:       Impossible to ship without semantic tokens → 6-month refactor cost
Rebranding:      Change one brand color → update 340 hardcoded hex values vs update 1 token
```

> 🇻🇳 **Tóm tắt**: Design system = single source of truth gồm tokens + components + patterns + docs. Không phải chỉ "component library". Mọi công ty Series B+ cần vì cost của việc không có nó (visual drift, duplicate work, accessibility debt) vượt xa cost để build nó. Shopify Polaris (60+ components, 10K+ merchants), Atlassian DS (2K+ engineers), GitHub Primer (1K+ components) là các production examples quy mô lớn.

---

## Concept Map / Bản Đồ Khái Niệm

```
DESIGN SYSTEM LAYERS
│
├── LAYER 5: TEMPLATES
│   ├── Page layouts (Dashboard shell, Auth flow, Settings page)
│   ├── Responsive grid systems
│   └── Content shells (Article, Profile, Feed)
│
├── LAYER 4: PATTERNS
│   ├── Forms (Validation, Multi-step, Inline editing)
│   ├── Empty states (No data, Error, First-run)
│   ├── Loading states (Skeleton, Spinner, Progressive)
│   ├── Navigation (Breadcrumbs, Tabs, Pagination)
│   └── Feedback (Toast, Alert, Inline error)
│
├── LAYER 3: COMPONENTS
│   ├── Atoms (Button, Input, Badge, Icon, Avatar)
│   ├── Molecules (FormField = Label + Input + Error, Card)
│   └── Organisms (DataTable, Modal, Navigation, DatePicker)
│
├── LAYER 2: PRIMITIVES (Layout)
│   ├── Box (base layout primitive — padding, margin, display)
│   ├── Stack (vertical spacing — gap between children)
│   ├── Cluster (horizontal wrapping — flex row)
│   ├── Grid (CSS Grid wrapper)
│   └── Switcher (responsive layout breakpoints)
│
└── LAYER 1: DESIGN TOKENS
    ├── Primitive tokens: color.blue.500 = #3B82F6
    ├── Semantic tokens:  color.interactive.primary = {color.blue.500}
    └── Component tokens: button.primary.background = {color.interactive.primary}

TOOLING PIPELINE
│
Figma (design source of truth)
  └── Tokens Studio for Figma (token editing, sync)
       └── Style Dictionary (token transformation + platform output)
            ├── CSS custom properties (--color-primary: #3B82F6)
            ├── TypeScript constants (export const colorPrimary = '#3B82F6')
            ├── iOS Swift (.xcassets, UIColor extensions)
            └── Android XML (colors.xml, dimens.xml)
                 └── React / Web Components (consume tokens)
                      └── Storybook (component documentation)
                           └── Chromatic (visual regression CI)
```

---

## Part 1: Anatomy of a Design System / Giải Phẫu Design System

### Section 1.1: Design Tokens / Token Thiết Kế

Tokens là **atomic unit** của design system — thay thế raw values bằng named abstractions.

**3-tier token architecture:**

```
TIER 1: Primitive tokens (also called "global" tokens)
  → Raw values, no semantic meaning
  → Named after the value itself

  color.gray.100  = #F3F4F6
  color.gray.900  = #111827
  color.blue.500  = #3B82F6
  space.4         = 16px
  font.size.sm    = 14px
  font.weight.600 = 600

TIER 2: Semantic tokens (also called "alias" tokens)
  → Reference primitive tokens
  → Named after their INTENT, not their value
  → This tier enables theming and dark mode

  color.surface.primary      = {color.gray.100}    (light mode)
  color.surface.primary      = {color.gray.900}    (dark mode)
  color.text.primary         = {color.gray.900}    (light mode)
  color.text.primary         = {color.gray.100}    (dark mode)
  color.interactive.default  = {color.blue.500}
  space.component.padding-md = {space.4}

TIER 3: Component tokens
  → Reference semantic tokens
  → Scoped to a specific component
  → Most specific layer

  button.primary.background         = {color.interactive.default}
  button.primary.text               = {color.text.on-interactive}
  button.primary.padding-horizontal = {space.component.padding-md}
  button.border-radius              = {border.radius.md}
```

**Why 3 tiers? The dark mode test:**

```
Without semantic tokens:
  /* Dark mode requires FINDING AND REPLACING every primitive reference */
  .button { background: #3B82F6; }  ← raw hex, no context
  .card   { background: #F3F4F6; }  ← is this surface or border?

With semantic tokens:
  /* Dark mode = swap semantic tier only */
  :root                    { --color-surface-primary: #F3F4F6; }
  :root[data-theme="dark"] { --color-surface-primary: #111827; }
  /* Components never change — they reference semantics */
  .card { background: var(--color-surface-primary); }
```

**Style Dictionary config example (TypeScript):**

```typescript
// style-dictionary.config.ts
import StyleDictionary from "style-dictionary";
import type { Config } from "style-dictionary/types";

const config: Config = {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "ds",
      buildPath: "dist/tokens/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
          options: { outputReferences: true },
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "dist/tokens/",
      files: [
        {
          destination: "index.ts",
          format: "javascript/es6",
        },
      ],
    },
  },
};

export default config;
```

**Tokens Studio JSON (source of truth):**

```json
{
  "color": {
    "primitive": {
      "blue": {
        "500": { "value": "#3B82F6", "type": "color" },
        "600": { "value": "#2563EB", "type": "color" }
      },
      "gray": {
        "100": { "value": "#F3F4F6", "type": "color" },
        "900": { "value": "#111827", "type": "color" }
      }
    },
    "semantic": {
      "interactive": {
        "default": { "value": "{color.primitive.blue.500}", "type": "color" },
        "hovered": { "value": "{color.primitive.blue.600}", "type": "color" }
      },
      "surface": {
        "primary": { "value": "{color.primitive.gray.100}", "type": "color" }
      }
    }
  },
  "space": {
    "primitive": {
      "4": { "value": "16px", "type": "spacing" },
      "6": { "value": "24px", "type": "spacing" }
    }
  }
}
```

**Generated CSS output:**

```css
/* dist/tokens/variables.css */
:root {
  --ds-color-primitive-blue-500: #3b82f6;
  --ds-color-semantic-interactive-default: var(--ds-color-primitive-blue-500);
  --ds-color-semantic-surface-primary: var(--ds-color-primitive-gray-100);
  --ds-space-primitive-4: 16px;
}
```

> 🇻🇳 **Tóm tắt**: 3 tầng token: (1) Primitive = raw values (`color.blue.500 = #3B82F6`). (2) Semantic = named by intent, references primitives (`color.interactive.default = {color.blue.500}`) — tầng này enable dark mode và theming. (3) Component = scoped to component, references semantics (`button.primary.background = {color.interactive.default}`). Dark mode chỉ cần swap tầng semantic — components không cần thay đổi gì.

---

### Section 1.2: Primitives / Layout Primitives

Primitives là layout components không có business logic — chỉ wrap CSS layout patterns thành named abstractions. Concept này đến từ **Every Layout** (Andy Bell, Heydon Pickering).

```typescript
// Box — base spacing primitive
interface BoxProps {
  padding?: SpaceToken;
  paddingX?: SpaceToken;
  paddingY?: SpaceToken;
  background?: ColorToken;
  borderRadius?: RadiusToken;
  children: React.ReactNode;
}

// Stack — vertical spacing between children
interface StackProps {
  gap?: SpaceToken; // space between children
  align?: "start" | "center" | "end" | "stretch";
  children: React.ReactNode;
}

// Cluster — horizontal wrapping layout
interface ClusterProps {
  gap?: SpaceToken;
  justify?: "start" | "center" | "end" | "space-between";
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}
```

```tsx
// Usage: composing with primitives
function ProductCard({ product }: { product: Product }) {
  return (
    <Box padding="space.4" borderRadius="radius.md" background="color.surface.primary">
      <Stack gap="space.3">
        <img src={product.imageUrl} alt={product.name} />
        <Stack gap="space.2">
          <h3>{product.name}</h3>
          <p>{product.price}</p>
        </Stack>
        <Cluster gap="space.2" justify="space-between">
          <Badge>{product.category}</Badge>
          <Button variant="primary" size="sm">
            Add to cart
          </Button>
        </Cluster>
      </Stack>
    </Box>
  );
}
```

Polaris uses `Box`, `Stack`, `Inline`, `Grid` as its primitive layer. Material UI uses `Box` with `sx` prop. Radix Themes uses `Flex`, `Grid`, `Box`.

---

### Section 1.3: Components — Composition vs Configuration

**Component API design philosophy**: Small, composable components với slot-based API > single monolithic component với 50 props.

```tsx
// ❌ Anti-pattern: God component with too many props
interface ButtonBadProps {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  tooltip?: string;
  tooltipPosition?: "top" | "bottom";
  isLoading?: boolean;
  loadingText?: string;
  // ... 30 more props
}

// ✅ Composable design with slots (Radix UI pattern)
// Components snap together — consumer controls composition
function SaveButton() {
  return (
    <Button variant="primary" size="md">
      <Button.Icon>
        <SaveIcon />
      </Button.Icon>
      <Button.Label>Save changes</Button.Label>
      <Badge color="green" aria-label="3 unsaved changes">
        3
      </Badge>
    </Button>
  );
}
```

**The Button component design question** (common interview topic):

```typescript
// Correct Button API — variants + sizes + semantic meaning
interface ButtonProps {
  // Visual variant — maps to intent
  variant: "primary" | "secondary" | "ghost" | "destructive" | "link";

  // Size — maps to context density
  size: "sm" | "md" | "lg";

  // Semantic HTML — defaults to 'button', allows 'a' for links
  as?: "button" | "a";

  // State
  disabled?: boolean;
  loading?: boolean;

  // Slot content (composable — NOT individual icon props)
  children: React.ReactNode;

  // Polymorphic href for link variant
  href?: string;

  // Standard button/anchor attributes pass-through
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}
```

Why **5 variants** (not 10, not 2)?

- `primary` — one per screen, main action
- `secondary` — secondary action, visible but not dominant
- `ghost` — tertiary action, often in toolbars
- `destructive` — irreversible actions (delete, remove)
- `link` — inline text actions, navigational

Adding `primary-destructive` is a red flag — that's a combination better handled by `<Button variant="destructive">`.

---

### Section 1.4: Patterns / UX Patterns

Patterns combine components to solve recurring UX problems. Examples:

| Pattern             | Components Used                         | Variants                                     |
| ------------------- | --------------------------------------- | -------------------------------------------- |
| Form validation     | Input + Label + Error + HelperText      | Inline, Toast, Summary                       |
| Empty state         | Icon + Heading + Body + CTA Button      | No data, Error, First-run, Search no-results |
| Loading state       | Skeleton + Spinner + Progress           | Page-level, Section-level, Component-level   |
| Confirmation dialog | Modal + Button(primary) + Button(ghost) | Destructive action, Unsaved changes          |
| Data table          | Table + Pagination + Sort + Filter      | Read-only, Editable, Selectable rows         |

The difference between a **component** and a **pattern**: a pattern has opinionated composition and UX guidance. A `Modal` component is unopinionated. A `ConfirmationDialog` pattern specifies: always have a cancel action, destructive action uses `variant="destructive"`, title must describe the action, not ask a question.

---

### Section 1.5: Templates

Templates are page-level composition — the shell that all content flows into.

```typescript
// Dashboard shell template
interface DashboardTemplateProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

// Auth template
interface AuthTemplateProps {
  form: React.ReactNode;
  logo?: React.ReactNode;
  backgroundVariant?: "split" | "centered" | "full-bleed";
}
```

Templates are the least reused layer — they're often project-specific. Atlassian and Polaris ship templates for common admin UI patterns but most consumer-facing products build custom templates.

---

## Part 2: Distribution & Versioning / Phân Phối và Phiên Bản

### Monorepo vs Separate Package

**Monorepo (recommended for most teams):**

```
design-system/
├── packages/
│   ├── tokens/          # @company/ds-tokens — 0 dependencies
│   ├── primitives/      # @company/ds-primitives — depends on tokens
│   ├── components/      # @company/ds-components — depends on primitives
│   ├── icons/           # @company/ds-icons — depends on tokens
│   └── docs/            # Internal Storybook — depends on all
├── apps/
│   └── storybook/
├── package.json
└── pnpm-workspace.yaml
```

**Why split packages?** React Native app needs tokens + icons but NOT React DOM components. Email renderer needs tokens + primitives but NOT interactive components. Separate packages = consumers only install what they need.

### Changesets — Versioning Workflow

```bash
# Developer adds a changeset when opening a PR
pnpm changeset

# Prompted:
# Which packages changed? → @company/ds-components
# Bump type? → patch (bugfix) | minor (new component) | major (breaking API)
# Summary? → "Button: fix focus ring color in high-contrast mode"

# CI runs on merge:
pnpm changeset version  # bumps versions in package.json files
pnpm changeset publish  # publishes to npm
```

**Semver discipline for design systems:**

```
MAJOR (1.0.0 → 2.0.0):
  - Removed component/prop
  - Changed prop type (string → string[])
  - Renamed component or prop
  - Changed default behavior that affects rendered output

MINOR (1.0.0 → 1.1.0):
  - New component added
  - New prop added (with default — backward compatible)
  - New token added

PATCH (1.0.0 → 1.0.1):
  - Bug fix (visual regression, accessibility fix)
  - Documentation update
  - Performance improvement (no API change)
```

**Pre-release channels:**

```bash
# Canary — every commit, automated, for integration testing
@company/ds-components@1.5.0-canary.12

# Next — feature-complete, RC for upcoming major
@company/ds-components@2.0.0-next.3

# Latest — stable, what consumers install by default
@company/ds-components@1.5.0
```

**Breaking change protocol:**

```
1. RFC (Request for Comments) — document change, get feedback (2 weeks)
2. Deprecation warning in code (console.warn) — give squads 2–4 sprints
3. Codemods — automated migration scripts for common patterns
4. Major version publish
5. Migration guide in changelog + docs

Example codemod (jscodeshift):
// Before: <Button type="primary"> → After: <Button variant="primary">
module.exports = (file, api) => {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.JSXOpeningElement, { name: { name: 'Button' } })
    .find(j.JSXAttribute, { name: { name: 'type' } })
    .replaceWith(path => j.jsxAttribute(j.jsxIdentifier('variant'), path.node.value))
    .toSource();
};
```

> 🇻🇳 **Tóm tắt**: Monorepo với separate packages (tokens, primitives, components, icons) để consumers chỉ install những gì họ cần. Changesets quản lý versioning: patch = bugfix, minor = new component/prop, major = breaking change. Pre-release channels: canary (mỗi commit) → next (RC) → latest (stable). Breaking change protocol: RFC → deprecation warning → codemod → major version.

---

## Part 3: Tooling Landscape / Bảng So Sánh Thư Viện

| Library            | Paradigm                   | Customization                         | Bundle (gzipped)             | Accessibility                 | Owner              | When to Choose                                                          |
| ------------------ | -------------------------- | ------------------------------------- | ---------------------------- | ----------------------------- | ------------------ | ----------------------------------------------------------------------- |
| **shadcn/ui**      | Copy-paste (unstyled)      | Full — you own the code               | 0 (code-copied, tree-shaken) | Radix primitives underneath   | Community (Shadcn) | New projects wanting ownership + Radix a11y + Tailwind styling          |
| **Radix UI**       | Headless primitives        | Full — bring your CSS                 | ~5KB per primitive           | Excellent (WAI-ARIA patterns) | WorkOS             | When you need a11y primitives only, no opinions on styling              |
| **Headless UI**    | Headless                   | Full — bring your CSS                 | ~10KB                        | Good (Tailwind Labs)          | Tailwind Labs      | Tailwind projects needing headless dialogs/menus                        |
| **Material UI v7** | Fully styled (MUI)         | Good — sx, theme overrides            | ~90KB (tree-shakeable)       | Good                          | MUI (community)    | Enterprise apps that accept Google MD design language                   |
| **Mantine**        | Fully styled               | Excellent — per-component CSS vars    | ~60KB (tree-shaken)          | Good                          | Community          | Full-featured apps wanting rich component set + TypeScript-first        |
| **Chakra v3**      | Fully styled               | Good — recipe/slot API (Panda CSS v3) | ~40KB                        | Good                          | Segun Adebayo      | Apps that previously used Chakra v2, or want styled-system API          |
| **Park UI**        | Styled (Ark UI + CSS vars) | Good                                  | ~15KB                        | Excellent (Ark underneath)    | Community          | When you want styled Ark components; Ark = Zag.js state machines        |
| **Ark UI**         | Headless (state machine)   | Full                                  | ~8KB per component           | Excellent (Zag.js)            | Chakra team        | Complex interactive components (DatePicker, Combobox) with correct a11y |

**Paradigm definitions:**

- **Headless**: Logic and accessibility only — zero CSS shipped. Consumer owns all visual styling.
- **Unstyled / Copy-paste**: Source code is copied into your project. No runtime dependency. You own the files.
- **Fully styled**: CSS/styling shipped with the library. Customization via theming APIs.

**Build vs Buy decision heuristic:**

```
Brand uniqueness high + Time available → Radix UI / Ark UI (headless) + custom CSS
Brand uniqueness high + Time constrained → shadcn/ui (copy, then customize)
Brand uniqueness low + Team small → Material UI v7 or Mantine
Enterprise, React, Google MD accepted → Material UI v7
Complex components (DatePicker, Combobox) → Ark UI (Zag.js state machines)
Tailwind project → Headless UI or shadcn/ui
```

> 🇻🇳 **Tóm tắt**: 3 paradigm: headless (chỉ logic + a11y, không CSS), copy-paste (copy code vào project, không có runtime dep), fully styled (CSS đi kèm). shadcn/ui là copy-paste dùng Radix primitives — bạn sở hữu code, không vendor lock-in. Radix UI và Ark UI là headless tốt nhất cho accessibility. Material UI v7 cho enterprise chấp nhận Material Design. Mantine cho rich component set TypeScript-first.

---

## Part 4: Build vs Buy vs Wrap / Quyết Định Xây Hay Mua

### Decision Framework (6 conditional branches)

---

**Branch 1: Team size < 5 engineers AND time-to-market < 6 months?**

→ **Buy (shadcn/ui or Mantine)**

Lý do: Building a token system, component API, Storybook, CI pipeline, and governance model requires 1–2 dedicated engineers for 3–6 months minimum. A 5-person team cannot afford this. Ship product first, migrate later.

Anti-pattern: 3-person startup spending 40% of sprint capacity on design system instead of user-facing features.

---

**Branch 2: Brand is a core differentiator (luxury brand, unique visual identity)?**

→ **Build from scratch OR headless (Radix/Ark) + custom CSS**

Lý do: Material UI's MUI defaults, Mantine's colors — you will fight the library to override its visual opinions. Start headless. The a11y primitives in Radix (focus management, ARIA attributes, keyboard navigation) are mature — use them. Build the visuals yourself.

---

**Branch 3: Existing design system that's inconsistent (legacy) + team size > 20?**

→ **Wrap the existing library + token layer on top**

Lý do: Replacing an existing library wholesale causes massive migration cost. Wrap components with a thin design token layer: `<OurButton>` internally renders `<MuiButton>` but maps company tokens to MUI theme. Replace internals incrementally.

```typescript
// Wrapper pattern — OurButton wraps MUI Button
import MuiButton from '@mui/material/Button';
import type { ButtonProps } from './types';
import { mapVariantToMui, mapSizeToMui } from './token-mappings';

export function Button({ variant, size, children, ...rest }: ButtonProps) {
  return (
    <MuiButton
      variant={mapVariantToMui(variant)}
      size={mapSizeToMui(size)}
      {...rest}
    >
      {children}
    </MuiButton>
  );
}
```

---

**Branch 4: Multi-platform (React + React Native + email templates)?**

→ **Tokens-first approach: Style Dictionary + platform-specific component layers**

Lý do: Tokens are platform-agnostic (JSON). Components are platform-specific. Polaris separates `@shopify/polaris-tokens` (shared) from `@shopify/polaris` (React DOM) and `@shopify/polaris-react-native`.

---

**Branch 5: Team is design-system-naive (no dedicated DS engineer)?**

→ **shadcn/ui + Storybook + token discipline as first step**

Lý do: shadcn/ui gives you copy-pasted accessible components. Add Storybook for documentation. Enforce no raw hex codes in code reviews. This is the lowest-cost path to consistency without a dedicated DS team.

---

**Branch 6: Serving external developers (design system as a product)?**

→ **Invest in headless + comprehensive documentation + versioning CI**

Lý do: External consumers cannot absorb breaking changes the way internal teams can. Atlassian DS, Polaris, and Carbon (IBM) serve external developers — they have strict RFC processes, migration guides for every breaking change, and changelogs as first-class documentation.

---

## Part 5: Token Strategy Deep-Dive / Chiến Lược Token Chi Tiết

### Multi-brand via Token Sets

Real-world scenario: SaaS company acquires a competitor — now needs to support 2 brands (Acme + BrandX) from one codebase.

```json
// tokens/base.json — shared primitives
{
  "font": {
    "family": {
      "sans": { "value": "Inter, system-ui, sans-serif", "type": "fontFamily" }
    }
  },
  "space": {
    "4": { "value": "16px", "type": "spacing" }
  }
}

// tokens/brand-acme.json — Acme brand semantic tokens
{
  "color": {
    "brand": {
      "primary": { "value": "#0F4C81", "type": "color" },
      "accent":  { "value": "#F59E0B", "type": "color" }
    }
  }
}

// tokens/brand-brandx.json — BrandX brand semantic tokens
{
  "color": {
    "brand": {
      "primary": { "value": "#7C3AED", "type": "color" },
      "accent":  { "value": "#10B981", "type": "color" }
    }
  }
}
```

```typescript
// Style Dictionary multi-brand build
const brands = ["acme", "brandx"];

brands.forEach((brand) => {
  const sd = new StyleDictionary({
    source: ["tokens/base.json", `tokens/brand-${brand}.json`],
    platforms: {
      css: {
        buildPath: `dist/${brand}/`,
        files: [{ destination: "tokens.css", format: "css/variables" }],
      },
    },
  });
  sd.buildAllPlatforms();
});
```

```css
/* Generated: dist/acme/tokens.css */
:root {
  --color-brand-primary: #0f4c81;
  --color-brand-accent: #f59e0b;
}

/* Generated: dist/brandx/tokens.css */
:root {
  --color-brand-primary: #7c3aed;
  --color-brand-accent: #10b981;
}
```

Runtime brand switching:

```typescript
// Load brand token CSS at runtime based on tenant config
async function applyBrandTokens(brand: "acme" | "brandx") {
  const link = document.getElementById("brand-tokens") as HTMLLinkElement;
  link.href = `/tokens/${brand}/tokens.css`;
}
```

### Dark Mode via Semantic Tokens

```css
/* Light mode (default) */
:root {
  --color-surface-primary: #ffffff;
  --color-surface-secondary: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-interactive-default: #3b82f6;
  --color-interactive-hovered: #2563eb;
  --color-border-subtle: #e5e7eb;
}

/* Dark mode */
:root[data-theme="dark"] {
  --color-surface-primary: #111827;
  --color-surface-secondary: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-interactive-default: #60a5fa;
  --color-interactive-hovered: #93c5fd;
  --color-border-subtle: #374151;
}

/* Components reference semantics — no changes needed for dark mode */
.button-primary {
  background-color: var(--color-interactive-default);
  color: var(--color-text-on-interactive);
}
```

> 🇻🇳 **Tóm tắt**: Multi-brand = token sets (base.json shared + brand-specific.json). Style Dictionary build cho từng brand → separate CSS files → load dynamically theo tenant. Dark mode = swap semantic tier (`:root[data-theme="dark"]`) — components không cần thay đổi vì chúng chỉ reference semantic tokens, không phải primitive values.

---

## Part 6: Governance & Adoption / Quản Trị và Áp Dụng

### Contribution Models

**Centralized model** (1 DS team owns everything):

```
Pros:
  + Highest consistency
  + Clear ownership and accountability
  + Fastest component quality bar

Cons:
  - DS team becomes bottleneck (6-week wait for new component)
  - Ivory tower problem: components don't reflect real product needs
  - Does not scale beyond 50-person engineering org

Best for: Early-stage DS (0–18 months), company < 40 engineers
```

**Federated model** (multiple teams maintain own component sets):

```
Pros:
  + No bottleneck — squads move at own speed
  + Components reflect real use cases

Cons:
  - Fragmentation (5 DatePicker implementations across squads)
  - No shared a11y guarantee
  - Documentation is inconsistent

Best for: Large orgs that failed to centralize early (Atlassian pre-ADS 2.0)
```

**Hub-and-spoke model** (1 DS team = hub, squad liaisons = spokes):

```
Structure:
  DS Team (hub): owns tokens, primitives, core components (Button, Input, Modal)
  Product teams (spokes): contribute domain components via RFC process
  Liaison per spoke: DS-embedded engineer who reviews PRs, attends DS syncs

Process:
  1. Product team identifies missing component
  2. Liaison opens RFC (Request for Comments) in DS repo
  3. DS team reviews: Is this generic enough to belong in DS?
  4. If yes → DS team provides skeleton + a11y baseline
  5. Product team implements, DS team reviews
  6. Merged to DS, maintained by DS team

Best for: Companies 40–500 engineers — Shopify Polaris, GitHub Primer model
```

### RFC Process

````markdown
# RFC: DateRangePicker Component

**Authored by**: Squad Checkout (Sarah Chen)
**Date**: 2026-01-15
**Status**: Under Review

## Problem

Checkout and Analytics teams both need date range selection.
Currently have 2 diverged implementations.

## Proposal

Add `DateRangePicker` to `@company/ds-components`.

## API surface

\```typescript
interface DateRangePickerProps {
value?: DateRange;
onChange?: (range: DateRange) => void;
minDate?: Date;
maxDate?: Date;
locale?: string;
disabled?: boolean;
// ...
}
\```

## Accessibility requirements

- Keyboard navigation (arrow keys within calendar grid)
- Screen reader: announces selected range as "From [date] to [date]"
- WCAG 2.1 AA color contrast on calendar cells

## Alternatives considered

- Reuse react-day-picker (decided against: too much bundle for email contexts)
- Fork existing Checkout implementation (doesn't meet a11y bar)

## Migration path for existing implementations

Checkout team: replace `CheckoutDatePicker` → ETA 1 sprint
Analytics team: replace `AnalyticsDateRange` → ETA 1 sprint
````

### Adoption Metrics

Measuring DS adoption is a Senior-level question. Concrete metrics:

```
1. Component coverage %
   Formula: (pages using DS components / total pages) × 100
   Target: > 80% coverage for stable DS
   Tool: Import analysis (madge, dependency-cruiser) or custom AST scanner

2. Drift detection
   Automated: CSS-in-JS lint rules detecting raw hex codes
   Semi-automated: Chromatic visual diff vs design tokens
   Manual: Monthly DS audit with design team

3. Time-to-ship (component requests)
   Metric: Days from RFC opened → component in stable release
   Target: < 10 business days for core components
   Tracks DS team bandwidth and prioritization

4. Adoption velocity
   New components using DS % in last 30 days
   Tracks whether new feature work defaults to DS or bypasses it

5. Version lag
   % of consuming apps on latest DS major version
   Flags orgs where DS deprecation debt is accumulating
```

**Tooling for drift detection:**

```typescript
// ESLint rule: no raw hex colors (prevents token bypass)
// eslint-plugin-design-system/no-raw-colors.ts
import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: { noRawColor: 'Use a design token instead of raw color value "{{value}}".' },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === "string" && /^#[0-9A-Fa-f]{3,6}$/.test(node.value)) {
          context.report({ node, messageId: "noRawColor", data: { value: node.value } });
        }
      },
    };
  },
};
export default rule;
```

> 🇻🇳 **Tóm tắt**: 3 contribution model: centralized (1 team owns all, bottleneck nhưng consistent), federated (mỗi team tự làm, fast nhưng fragmented), hub-and-spoke (DS team owns core + product teams contribute via RFC — best cho 40–500 engineers). RFC process: problem statement → API proposal → a11y requirements → migration path. Adoption metrics: component coverage %, drift detection (lint rules chặn raw hex), time-to-ship, version lag.

---

## Part 7: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟡 Q1: What is the difference between primitive, semantic, and component tokens?

**A:**

Three tiers exist to separate **value** from **meaning** from **scope**.

**Primitive tokens** are raw values with no semantic meaning — they name the value itself. `color.blue.500 = #3B82F6`. You should never use these directly in component CSS. They exist as a foundation for the tiers above.

**Semantic tokens** reference primitive tokens and assign **intent**. `color.interactive.default = {color.blue.500}`. These are what components consume. The crucial property: semantic tokens can be overridden per theme (dark mode, brand) — so a component that references `color.interactive.default` automatically adapts to dark mode without any code change.

**Component tokens** are the most specific — scoped to one component. `button.primary.background = {color.interactive.default}`. They give teams the ability to customize a single component's token without affecting others. Polaris has ~50+ component tokens for Button alone (hover, pressed, disabled, loading states per variant).

The test of a well-architected token system: can you implement dark mode by only changing semantic tokens? Can you rebrand by only changing primitive tokens? If yes — the tiers are working correctly.

Tiếng Việt: Primitive = raw values (`color.blue.500 = #3B82F6`). Semantic = named by intent, references primitives (`color.interactive.default = {color.blue.500}`) — đây là tier enable dark mode và theming. Component = scoped to 1 component, references semantics (`button.primary.background = {color.interactive.default}`). Test: dark mode chỉ cần swap semantic tier. Rebrand chỉ cần swap primitive tier. Components không cần thay đổi khi theme thay đổi.

**💡 Interview Signal:**

- ✅ Strong: Explains WHY 3 tiers (value vs meaning vs scope), demonstrates dark mode test, mentions Polaris or real DS as example
- ❌ Weak: "Tokens are CSS variables" — misses the tier architecture and why it matters for theming

---

### 🟡 Q2: Headless UI library (Radix) vs styled (MUI) — when do you choose which?

**A:**

The decision axis is: **how unique does your UI need to look vs how fast do you need to ship?**

**Choose Radix UI (headless) when:**

- Your brand has a unique visual identity that conflicts with MUI's Material Design defaults
- You have a dedicated design team producing custom specs
- Long-term maintenance matters — you won't spend weeks fighting MUI's style overrides
- Accessibility is critical — Radix's WAI-ARIA implementations (focus management, keyboard navigation, ARIA attributes) are among the most correct in the ecosystem

**Choose Material UI v7 (styled) when:**

- Team is small, time-to-market is weeks not months
- You accept Google Material Design as your design language (internal tools, B2B dashboards)
- You need a comprehensive component set immediately (DataGrid, DatePicker, etc.)
- Enterprise customer persona where polished-but-generic UI is acceptable

**The hidden cost of headless**: You own everything below the component API. Focus ring styling, hover states, animation timing, dark mode — all your responsibility. For a 3-person team, this is often too much.

**The hidden cost of MUI**: `sx` prop and theme customization can get you 80% of the way. The last 20% — fighting MUI's CSS specificity, emotion runtime, nested selectors — often takes longer than building headless from scratch.

**2025 industry shift**: shadcn/ui's popularity shows teams want headless accessibility (Radix under the hood) with a pre-designed starting point (Tailwind + Radix pre-styled). It's the middle path.

Tiếng Việt: Radix (headless) khi brand cần unique UI, có design team, và long-term maintainability quan trọng. MUI khi team nhỏ, cần ship nhanh, chấp nhận Material Design language. Hidden cost của headless: bạn own toàn bộ visual layer. Hidden cost của MUI: 80% customization dễ, 20% cuối fight với CSS specificity. shadcn/ui = middle path: Radix a11y + Tailwind styling pre-done.

**💡 Interview Signal:**

- ✅ Strong: Frames as brand uniqueness vs time-to-market tradeoff, mentions hidden cost of each, knows shadcn/ui as middle path
- ❌ Weak: "Radix for custom, MUI for default" — misses the time/cost dimension

---

### 🟡 Q3: How do you handle theming for multi-brand products?

**A:**

Multi-brand theming requires the **token set approach** — one shared primitive layer, multiple semantic token overrides per brand.

**Architecture:**

```
tokens/
  base.json          ← shared: spacing, typography, radius, shadows
  brand-acme.json    ← Acme: primary=#0F4C81, accent=#F59E0B
  brand-brandx.json  ← BrandX: primary=#7C3AED, accent=#10B981
```

Style Dictionary builds a separate CSS file per brand. At runtime, a thin tenant-detection layer loads the correct CSS file: `<link id="brand-tokens" href="/tokens/acme/tokens.css" />`. JavaScript swaps the href when tenant changes.

**Two models for applying brand tokens:**

1. **CSS file swap** (above): Load different CSS files per brand. Works for SSR. Minimal JS.
2. **CSS custom property override**: One CSS file with defaults, per-brand CSS class or data attribute overrides. `[data-brand="brandx"] { --color-brand-primary: #7C3AED; }`. Easier for client-side only.

**What NOT to do**: Theme via JavaScript (passing theme object into React context, then spreading into inline styles). This couples every component to a React context, breaks CSS extraction, and prevents CSS-based theming tools.

**Material 3 example**: M3 introduces "seed color" theming — one input hex generates a full color scheme via tonal palette algorithm. Google's material-color-utilities library does this: `themeFromSourceColor(argbFromHex('#6750A4'))` generates 50+ tokens from one color. This is the direction premium design systems are heading.

Tiếng Việt: Multi-brand = 1 base token file (shared: spacing, typography) + N brand semantic files. Style Dictionary build N CSS files. Runtime load CSS file theo tenant. 2 models: (1) CSS file swap — server-friendly. (2) CSS custom property override via data attribute — simpler cho client-side. Không theme qua JavaScript/React context — couples components, breaks CSS extraction. Material 3 model: 1 seed color → 50+ tokens via tonal palette algorithm.

**💡 Interview Signal:**

- ✅ Strong: Shows token set architecture, knows Style Dictionary builds per-brand, mentions CSS file swap vs CSS var override, warns against JS context theming
- ❌ Weak: "Use a theme provider with React context" — doesn't address CSS extraction issues or SSR

---

### 🟡 Q4: What is the right granularity for a Button component?

**A:**

The right API for Button: **5 variants × 3 sizes × boolean states**, with slot-based composition instead of icon props.

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost" | "destructive" | "link";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  // DOM passthrough
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler;
  "aria-label"?: string;
  "aria-describedby"?: string;
}
```

**Why 5 variants, not more?** Each additional variant increases the visual vocabulary consumers need to learn. `primary-large-with-icon` is not a variant — it's `<Button variant="primary" size="lg"><Icon/> Label</Button>`. If a variant request comes in, ask: "Can this be composed from existing variants + slots?"

**Why NOT separate `leftIcon`/`rightIcon` props?** These props solve today's use case (icon left of text) but fail when consumers want icon + badge + tooltip. Slot-based approach (`children`) handles all these compositions naturally. Polaris v12 moved from `icon` prop to a `<Button.Icon>` slot for this reason.

**Loading state design**: When `loading=true`, show spinner + keep button width stable (prevent layout shift) + disable interaction + announce to screen readers (`aria-busy="true"`). The `loadingText` prop (`"Saving..."`) replaces label content for screen readers.

**Common mistake**: Adding `size="xl"` because one product team needs a hero-section CTA. This pollutes the scale for all consumers. The right answer: use `size="lg"` + adjust padding via component tokens or a wrapper class.

Tiếng Việt: Button đúng: 5 variants × 3 sizes × boolean states + slot-based composition. Không thêm variant mới khi composition giải quyết được vấn đề. Không dùng `leftIcon`/`rightIcon` props — dùng children/slots. Loading state: spinner + giữ width ổn định + `aria-busy="true"`. Không thêm `size="xl"` cho 1 use case — dùng component tokens hoặc wrapper.

**💡 Interview Signal:**

- ✅ Strong: Justifies 5 variants with reasoning, argues for slot composition over icon props, mentions loading state a11y (`aria-busy`), knows Polaris's evolution
- ❌ Weak: Lists variants without justification or says "as many as needed"

---

### 🟡 Q5: How do you version a design system? Breaking change protocol?

**A:**

**Versioning tool**: Changesets (`@changesets/cli`) in a monorepo. Each PR that changes a public API includes a changeset file describing the bump type and summary. CI runs `changeset version` + `changeset publish` on merge to main.

**Semver discipline** (strictly enforced in mature DS):

- **PATCH**: Visual bug fixes, accessibility fixes, documentation changes. No API changes.
- **MINOR**: New components, new props with defaults. Backward compatible.
- **MAJOR**: Removed props/components, renamed props, changed default behavior, changed rendered HTML structure.

**Breaking change protocol** (5 steps):

1. **RFC phase** (2 weeks): Document the proposed change, reason, migration path. Open to all consumers.
2. **Deprecation release** (MINOR): Add `@deprecated` JSDoc + runtime `console.warn` pointing to migration docs. Give 2–4 sprints runway.
3. **Codemod**: Write jscodeshift transform for mechanical migrations. Test against real consuming code.
4. **Major release**: Remove deprecated API. Ship migration guide as prominent changelog entry.
5. **Grace period support**: DS team monitors `#design-system` Slack channel for 2 weeks post-release.

**What teams do wrong**: Shipping breaking changes in MINOR (justifying "it's a small change") or skipping codemods ("teams can migrate manually"). Both destroy trust in the DS. GitHub Primer versioning docs explicitly state: "If it changes the rendered output, it's a breaking change."

Tiếng Việt: Changesets cho versioning trong monorepo. Semver nghiêm ngặt: patch = visual/a11y fix, minor = new component/prop, major = breaking API change. Breaking change protocol 5 bước: RFC (2 tuần) → deprecation release với `console.warn` → codemod (jscodeshift) → major release với migration guide → 2 tuần grace period. Lỗi phổ biến: ship breaking change trong minor release — phá trust với consumers.

**💡 Interview Signal:**

- ✅ Strong: Knows Changesets, gives the 5-step protocol, mentions codemods, quotes the rendered-output test for breaking changes
- ❌ Weak: "Bump major for any change" or "we just communicate in Slack" — no tooling discipline

---

### 🔴 Q6: How do you measure adoption of a design system?

**A:**

Adoption has three dimensions: **coverage**, **freshness**, and **velocity**.

**Coverage** — what % of existing UI uses DS?

```typescript
// AST-based import scanner
// Crawl codebase, find JSX elements, check if they're DS imports
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as fs from "fs";
import * as glob from "glob";

interface AdoptionReport {
  totalComponents: number;
  dsComponents: number;
  coveragePercent: number;
  nonDsComponents: string[]; // candidates for migration
}
```

The crawl counts unique component usages and identifies what % come from `@company/ds-*` imports vs local implementations.

**Freshness** — what % of teams are on the latest major version?

```bash
# Across all consuming repos in your org
gh search code "\"@company/ds-components\"" --include="package.json" \
  | extract version \
  | group by major version
# Output: v1: 45%, v2: 32%, v3 (latest): 23%
```

High version lag = deprecation debt accumulating.

**Velocity** — are new features defaulting to DS?

Look at the ratio of new DS component usages vs new non-DS component usages in PRs merged in the last 30 days. A healthy DS has > 90% new work using DS components.

**Drift detection** (prevents coverage from eroding):

- ESLint rule blocking raw hex colors in JSX
- Stylelint rule blocking raw color values in CSS
- Chromatic visual diffing in CI — flags visual deviations from approved snapshots
- Weekly automated report: "5 new non-token color values added this week"

Tiếng Việt: 3 dimension của adoption: (1) Coverage — % existing UI dùng DS (AST scanner đo component imports). (2) Freshness — % teams trên latest major version (GitHub search across repos). (3) Velocity — % new feature work dùng DS components (30-day PR analysis). Drift detection: ESLint chặn raw hex colors + Chromatic visual diff + weekly automated report.

**💡 Interview Signal:**

- ✅ Strong: Gives all 3 dimensions, describes AST scanning or import analysis, mentions drift detection tooling, knows Chromatic for visual regression
- ❌ Weak: "We track Storybook page views" — measures documentation popularity, not actual adoption

---

### 🔴 Q7: Federated vs centralized contribution model — tradeoffs?

**A:**

Neither model is universally correct — the choice depends on org size, DS maturity, and team culture.

**Centralized** (1 team owns all):

- Consistency is highest — every component passes the same quality bar
- DS team becomes a bottleneck at > 50 engineers: product teams wait 6–12 weeks for components
- "Ivory tower" risk: DS components don't reflect real product constraints (a DatePicker built without input from the team that needs a fiscal-year-aware date picker)
- Works well for: early DS (0–2 years), company < 40 engineers, or high-regulation environments where consistency is non-negotiable

**Federated** (squads own their own components, no central authority):

- Zero bottleneck — fastest product velocity
- Consistency degrades over time: 5 teams build 5 DatePickers with different keyboard behavior, ARIA attributes, and styling
- No shared a11y guarantee
- Works well for: large orgs that failed to centralize, or explicitly accept inconsistency as a tradeoff for speed

**Hub-and-spoke** (Shopify Polaris, GitHub Primer model):

- DS team owns tokens + primitives + core components (Button, Input, Form, Modal, Table)
- Product teams own domain components (ShippingAddressForm, PaymentMethodSelector) via RFC
- Liaison engineers embed in DS team, attend product squad standups
- Quarterly "component audit" moves popular domain components into DS core
- Sweet spot: 40–500 engineers, 3–15 product teams

**Key tradeoff table:**

|                 | Centralized | Federated | Hub-and-spoke |
| --------------- | ----------- | --------- | ------------- |
| Consistency     | Highest     | Lowest    | High          |
| Velocity        | Slowest     | Fastest   | Medium        |
| Bottleneck risk | High        | None      | Medium        |
| A11y guarantee  | Yes         | No        | Partial       |
| Scale           | < 40 eng    | Any       | 40–500 eng    |

Tiếng Việt: Centralized: consistency cao nhất, nhưng bottleneck sau 50 engineers và "ivory tower" risk. Federated: zero bottleneck, nhưng consistency thấp và không có a11y guarantee. Hub-and-spoke: DS team owns core, product teams contribute domain components via RFC — sweet spot cho 40–500 engineers. Không có model nào universally correct — chọn theo org size và DS maturity.

**💡 Interview Signal:**

- ✅ Strong: Compares all 3 models, gives scale guidance (numbers of engineers), identifies ivory tower risk in centralized, knows hub-and-spoke by name
- ❌ Weak: Describes only centralized vs federated without considering hub-and-spoke hybrid

---

### 🔴 Q8: Design tokens in Figma vs code — sync strategy?

**A:**

The fundamental problem: Figma has its own "design tokens" (styles, variables) and code has Style Dictionary tokens. Keeping them in sync requires a deliberate pipeline.

**The pipeline (2025 state of the art):**

```
Figma Variables (native, 2023+)
  ↕ sync via plugin
Tokens Studio for Figma (plugin)
  ↕ exports/imports JSON
tokens/ directory in git (source of truth)
  ↕ Style Dictionary transforms
dist/tokens/
  ├── variables.css
  ├── index.ts
  ├── ios/colors.xcassets
  └── android/colors.xml
```

**Two sync directions:**

1. **Figma → code** (design leads): Designer updates token in Figma → Tokens Studio exports JSON → PR opened automatically via GitHub Action → DS engineer reviews → merge → Style Dictionary rebuilds
2. **Code → Figma** (engineering leads): Engineer adds token in JSON → Tokens Studio import → Figma library updated

**Source of truth question**: Most mature teams treat **git as source of truth** for tokens (not Figma). Reason: git has versioning, PR reviews, CI, and change history. Figma changes are hard to diff and approve. Tokens Studio supports syncing FROM a git repo (connect to GitHub, set path to `tokens/*.json`) which makes git the canonical source.

**What breaks without this pipeline**: Figma designer renames `Blue/500` to `Cobalt/500`. Code still references `color.blue.500`. Nothing catches the mismatch until a developer notices the visual change in production.

**Spectrum 2 (Adobe) and Carbon (IBM)** both use automated token sync pipelines with CI checks that fail if Figma tokens and code tokens diverge by more than N tokens.

Tiếng Việt: Pipeline: Figma Variables → Tokens Studio plugin → git tokens/ (source of truth) → Style Dictionary → platform outputs. Git là source of truth, không phải Figma — vì git có versioning, PR reviews, CI. Tokens Studio hỗ trợ sync FROM git repo. 2 chiều: design-led (Figma → git PR) và engineering-led (git → Figma import). Không có pipeline này: designer rename token trong Figma, code vẫn reference tên cũ → silent mismatch đến production.

**💡 Interview Signal:**

- ✅ Strong: Knows Tokens Studio specifically, argues for git-as-source-of-truth with reasoning, describes bidirectional sync, mentions CI check for divergence
- ❌ Weak: "Designers update Figma, developers copy values manually" — describes the pre-tooling chaos that DS tooling was built to solve

---

### 🔴 Q9: You're starting a new company. shadcn/ui or build from scratch? Defend.

**A:**

**shadcn/ui** — with the following reasoning:

**Why not build from scratch at company founding:**

- Building a token system, component API, Storybook setup, CI pipeline, and governance takes 2–3 dedicated engineers 4–6 months. At founding, those engineers should be building product.
- Accessibility is genuinely hard. Focus trapping in modals, keyboard navigation in comboboxes, ARIA live regions — these take months to get right. Radix UI (underneath shadcn/ui) has 3+ years of production hardening on these patterns.
- Design taste changes rapidly at early-stage companies. Building a custom design system before product-market fit means building for a brand identity that will change.

**Why shadcn/ui specifically vs MUI/Mantine:**

- You own the code — no vendor lock-in. When your design system needs to diverge from shadcn's defaults (and it will), you modify the copied files, not fight a library's theming API.
- Zero runtime dependency — shadcn/ui adds no bundle weight. The copied components use Tailwind classes, which are tree-shaken.
- Radix primitives underneath provide production-grade accessibility without you writing a single line of a11y code.
- TypeScript-first with clean component APIs.

**The exit ramp**: At Series A (25–40 engineers), extract the customized shadcn components into a private `@company/ds-components` package. Add Changesets. Add Storybook. You now have a design system without the cold-start cost.

**When I'd choose differently**: Building a product where the UI IS the brand differentiator (Figma competitor, design tool, creative suite). Then Radix headless + custom CSS from day 1 is the right call — but that's a rare founding scenario.

Tiếng Việt: shadcn/ui cho công ty mới vì: (1) Building from scratch tốn 2–3 engineer × 4–6 tháng — không worth it trước PMF. (2) Accessibility (focus trap, ARIA) mất nhiều tháng để làm đúng — Radix đã làm sẵn. (3) Design identity thay đổi nhanh ở early stage. shadcn/ui vs MUI: bạn own code (không vendor lock-in), zero runtime bundle, Radix a11y underneath. Exit ramp: Series A → extract thành private `@company/ds-components` package. Ngoại lệ: UI là core brand differentiator (design tools) → Radix headless từ đầu.

**💡 Interview Signal:**

- ✅ Strong: Argues from opportunity cost + a11y complexity + early-stage fluidity, knows shadcn's "you own the code" model, gives a clear Series A exit ramp plan
- ❌ Weak: "Build from scratch because it's more flexible" — ignores the cost; or "use MUI because it's fastest" — ignores the vendor lock-in and bundle overhead

---

### 🔴 Q10: How do you handle accessibility regressions across the design system?

**A:**

Accessibility regressions need both **prevention** (at authoring time) and **detection** (in CI).

**Prevention layer:**

```typescript
// 1. Radix / Ark UI as base — accessibility-correct primitives
// Focus management, keyboard navigation, ARIA attributes handled upstream

// 2. axe-core in Storybook (storybook-addon-a11y)
// Every story gets an automated axe scan on open
// Critical violations block story load

// 3. Component-level a11y tests in Vitest
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Button has no a11y violations', async () => {
  const { container } = render(
    <Button variant="primary">Save</Button>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 4. Playwright a11y test (real browser, for interactive components)
import { checkA11y } from 'axe-playwright';
test('Modal focus trap works', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=modal--default');
  await checkA11y(page, '#storybook-root', {
    detailedReport: true,
    runOnly: ['wcag2a', 'wcag2aa'],
  });
  // Test Tab key stays within modal
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-focus-first]')).toBeFocused();
});
```

**Detection layer (CI):**

```yaml
# .github/workflows/a11y.yml
- name: Axe Accessibility Check
  run: npx storybook build && npx axe-storybook --storybook-url ./storybook-static
  # Fails CI if any WCAG 2.1 AA violation found in any story
```

**Regression ownership**: When an a11y regression is introduced, the PR author owns the fix. DS team reviews all PRs with `[a11y]` label. Any regression that reaches production triggers a PATCH release within 48 hours (a11y fixes are always PATCH, never blocked waiting for a MINOR).

**Known limits of automated checks**: `axe-core` catches ~30–40% of WCAG issues. Color contrast, ARIA attribute validity, focus management — automated. Cognitive accessibility, screen reader flow, zoom behavior — manual testing with assistive technology required quarterly.

Tiếng Việt: 2 layer: prevention (authoring time) + detection (CI). Prevention: Radix/Ark primitives + axe-core trong Storybook + `jest-axe` trong unit tests + Playwright axe check cho interactive components. Detection: CI pipeline chạy `axe-storybook` trên mọi story — fail nếu có WCAG 2.1 AA violation. Ownership: PR author owns fix. A11y regression = PATCH release trong 48 giờ, không block cho minor. Giới hạn: axe-core chỉ catch ~30–40% WCAG issues — manual testing với assistive tech vẫn cần quarterly.

**💡 Interview Signal:**

- ✅ Strong: Gives both prevention AND detection layers, knows axe-core coverage limits (~30–40%), defines ownership model and release SLA, mentions Playwright for interactive components
- ❌ Weak: "We test with a screen reader before releasing" — reactive, not systematic, doesn't scale

---

## Anti-Patterns / Những Lỗi Phổ Biến

---

### Anti-Pattern 1: Component Bloat (The 1000-Prop Button)

**Symptom:**

```typescript
// Real codebase smell — seen at companies 2–5 years after DS founding
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | ... /* 12 variants */;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomIcon?: React.ReactNode;  // Added for one marketing page
  badge?: string;
  badgeVariant?: 'success' | 'error' | 'warning' | 'neutral' | 'info';
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right';
  tooltip?: string;
  tooltipDelay?: number;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  isLoading?: boolean;
  loadingText?: string;
  loadingPosition?: 'left' | 'right' | 'overlay';
  // ... 40 more props
}
```

**Why it happens**: Every product team opens a PR saying "I need Button to support X." DS team, wanting to be helpful, merges each request. Over 2 years: 80 props, zero composition.

**Fix**: Decompose. `tooltip` → `<Tooltip><Button>...</Button></Tooltip>`. `badge` → `<Button><Badge>3</Badge> Label</Button>`. Components are composable. The Button knows nothing about tooltips or badges.

**Rule**: A component prop should be core to the component's semantic contract. If it can be composed externally, compose it.

---

### Anti-Pattern 2: No Token Discipline (Raw Hex Codes Everywhere)

**Symptom:**

```tsx
// Common in codebases without ESLint DS rules
const styles = {
  backgroundColor: "#3B82F6", // should be var(--ds-color-interactive-default)
  color: "#111827", // should be var(--ds-color-text-primary)
  padding: "16px 24px", // should be tokens, not literals
  borderRadius: "8px", // should be var(--ds-border-radius-md)
};
```

**Why it matters**: Dark mode takes 6 months instead of 2 weeks. Rebranding means grep-and-replace across 340 files. New engineer joins and doesn't know which blue is "the brand blue."

**Fix**: ESLint plugin blocking raw hex codes. Stylelint blocking raw color values in CSS. Code review checklist item. Onboarding doc: "Never write a hex code in a component."

---

### Anti-Pattern 3: Snowflake Components (One-Off Variants in App Code)

**Symptom:**

```tsx
// app/checkout/components/CheckoutButton.tsx
// Technically uses DS Button but overrides it completely
import { Button } from "@company/ds-components";
import styled from "styled-components";

// This "DS Button" has been restyled entirely in app code
const CheckoutButton = styled(Button)`
  background: linear-gradient(90deg, #ff6b35, #f7c59f);
  border-radius: 24px;
  font-size: 18px;
  padding: 20px 48px;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
`;
```

**Why it happens**: Product designer creates a unique CTA. Engineer doesn't want to fight the RFC process. Result: 6 CheckoutButtons across 6 squads, all styled differently, none accessible.

**Fix**: If this component will be used more than once, RFC it. If it's truly one-off, it still needs to use DS tokens (not arbitrary hex values), and it should live in the checkout domain folder, not a shared component folder.

---

### Anti-Pattern 4: Storybook AS Documentation (Instead of WITH Documentation)

**Symptom:**

```typescript
// Story file — no docs, no usage guidelines
export const Primary: Story = {
  args: { variant: "primary", children: "Button" },
};
// No: when to use primary vs secondary
// No: do/don't examples
// No: accessibility notes
// No: code example showing composition
```

**Why it's wrong**: Storybook is a **component workbench**, not documentation. Developers seeing only an interactive component with props cannot understand the design intent, when to use this vs alternatives, or what accessibility behavior to expect.

**Fix**: MDX documentation files alongside stories. Every component should have: description, when to use, when NOT to use, do/don't examples (screenshots), accessibility notes, API table. Polaris's documentation is a separate site (polaris.shopify.com) — Storybook is for development, the docs site is for consumption.

---

### Anti-Pattern 5: Versioning by Feature, Not by API (Breaking Changes in Patch Releases)

**Symptom:**

```
Changelog v1.2.3 (PATCH):
  - "Updated Button border-radius to match new brand guidelines"
  - "Changed Input placeholder color to gray.400"
  - "Renamed Modal.Title to Modal.Heading"  ← THIS IS A BREAKING CHANGE IN A PATCH
```

**Why it happens**: DS team is under pressure to ship brand refresh. "It's just a rename, not a big deal." But consuming teams have 200 files using `Modal.Title` — this silently breaks them on patch upgrade.

**Fix**: Strictly enforce: if a consumer's code must change to accommodate it, it's a MAJOR version bump, no exceptions. Use the rendered-output test: "Does this change affect what appears in the browser without any code changes?" If yes to breaking API, it's a MAJOR. Automate this with Changesets type enforcement in CI.

> 🇻🇳 **Tóm tắt**: 5 anti-patterns: (1) Component bloat — 1000-prop Button. Fix: composition thay vì configuration. (2) No token discipline — raw hex codes khắp nơi. Fix: ESLint rules. (3) Snowflake components — one-off styled overrides trong app code. Fix: RFC hoặc dùng DS tokens ít nhất. (4) Storybook AS docs — không có usage guidelines, do/don't, a11y notes. Fix: MDX documentation cạnh stories. (5) Breaking changes trong patch releases. Fix: Changesets + rendered-output test + strict semver enforcement.

---

## Memory Hook / Ghi Nhớ Nhanh

> **"Token → Primitive → Component → Pattern → Template: từ atom đến page — mỗi layer references layer dưới, không bao giờ skip; break this chain và bạn có hex codes trong modal titles và broken dark mode trước Series B."**

Short version: **T-P-C-P-T layers — each references only the layer below; skip one layer = drift**.

---

## Q&A Summary Table / Bảng Tổng Kết Câu Hỏi

| #   | Question                                   | Level | Key Answer                                                                | Interview Signal                               |
| --- | ------------------------------------------ | ----- | ------------------------------------------------------------------------- | ---------------------------------------------- |
| Q1  | Primitive vs semantic vs component tokens? | 🟡    | 3 tiers: value → intent → scope; dark mode test validates tier discipline | ✅ Dark mode test ❌ "CSS variables"           |
| Q2  | Headless (Radix) vs styled (MUI) — when?   | 🟡    | Brand uniqueness vs time-to-market axis; shadcn/ui as middle path         | ✅ Conditional tradeoffs ❌ Binary answer      |
| Q3  | Multi-brand theming?                       | 🟡    | Token sets per brand, Style Dictionary per-brand builds, CSS file swap    | ✅ Token sets + SD ❌ React context theme      |
| Q4  | Right Button API granularity?              | 🟡    | 5 variants × 3 sizes × slot composition; no icon props                    | ✅ Slot composition ❌ "as many as needed"     |
| Q5  | DS versioning + breaking change protocol?  | 🟡    | Changesets + 5-step protocol: RFC → deprecation → codemod → major         | ✅ Codemods ❌ "Slack announcement"            |
| Q6  | Measuring DS adoption?                     | 🔴    | Coverage % + freshness + velocity; AST scanner + drift detection          | ✅ All 3 dimensions ❌ Storybook views         |
| Q7  | Federated vs centralized contribution?     | 🔴    | 3 models; hub-and-spoke best for 40–500 eng                               | ✅ Hub-and-spoke ❌ Only 2 options             |
| Q8  | Figma ↔ code token sync?                   | 🔴    | Tokens Studio + git as source of truth + bidirectional pipeline           | ✅ Git-canonical ❌ Manual copy-paste          |
| Q9  | New company: shadcn/ui or scratch?         | 🔴    | shadcn/ui: opportunity cost + a11y complexity + PMF fluidity              | ✅ Cost analysis ❌ "Scratch = flexible"       |
| Q10 | Handling a11y regressions?                 | 🔴    | Prevention (axe-core + Playwright) + detection (CI pipeline) + ownership  | ✅ Both layers + limits ❌ Manual testing only |

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Thực Tế

**Interviewer**: "We have 50 engineers, 8 product squads, and a design system that's 2 years old. The DS team has 2 engineers. Teams are starting to bypass the DS for one-off components. What do you do?"

**Strong answer structure (2–3 minutes):**

"This is a classic centralized model bottleneck. Two engineers for 8 squads — each squad is waiting 6–8 weeks for components, so they bypass.

I'd move to hub-and-spoke. The DS team keeps ownership of tokens, primitives, and core components — Button, Input, Form, Modal. These have to be centralized because they define the visual contract and accessibility baseline.

For domain components, I'd introduce an RFC process. Any squad can propose a component — 2-week comment period, DS team reviews scope and a11y requirements, squad implements with DS guidance, DS team merges and maintains. We'd also assign one liaison engineer per squad who attends DS team's weekly sync. They become the bridge.

On the drift problem: I'd run an AST-based import scan to quantify how much is drifted — you can't fix what you can't measure. Then ESLint rules blocking raw hex codes prevent new drift. Monthly audit with design team catches visual divergence before it compounds.

The goal is: DS team is enabling, not blocking. Squads can move fast. Quality bar is maintained via RFC review and lint rules, not gatekeeping."

---

**Interviewer follow-up**: "The design team wants to rebrand — new primary color. How long does that take?"

**Strong answer**: "Depends entirely on token discipline. If semantic tokens are used correctly — `color.interactive.default` throughout, not `#3B82F6` — it's a one-line change in the semantic token file and a Style Dictionary rebuild. 30 minutes. If raw hex codes are scattered across the codebase, it's a grep-and-replace across hundreds of files, and you'll miss some. That's a 2-week project. This is the concrete ROI argument for token investment."

---

## Self-Check / Kiểm Tra Bản Thân

Before your next interview, verify you can answer all of these without notes:

- [ ] Explain the 3-tier token architecture with a dark mode example from memory
- [ ] Name the 5 tooling chain steps: Figma → ? → ? → ? → Storybook
- [ ] State the 5 Button variants and justify why each exists
- [ ] Explain the breaking change protocol (5 steps) — what is a codemod?
- [ ] Distinguish hub-and-spoke from centralized and federated contribution models
- [ ] Describe 3 adoption metrics with measurement methods
- [ ] Argue the shadcn/ui case for an early-stage company (3 reasons)
- [ ] Name 2 axe-core integration points in the DS toolchain
- [ ] Describe the Figma ↔ git token sync pipeline end-to-end
- [ ] Identify which of the 5 anti-patterns is most common in 3-year-old DSes (hint: bloat + snowflakes compound)

> 🇻🇳 **Tóm tắt tổng thể**: Design system = 5 layers (tokens → primitives → components → patterns → templates). Token strategy là nền tảng: 3-tier (primitive/semantic/component) enable dark mode và multi-brand. Tooling pipeline: Figma → Tokens Studio → Style Dictionary → React/Web Components → Storybook → Chromatic. Build vs buy: shadcn/ui cho early-stage, headless (Radix/Ark) cho brand-differentiated. Governance: hub-and-spoke cho 40–500 engineers. Adoption đo bằng coverage % + freshness + velocity. 5 anti-patterns: component bloat, no token discipline, snowflakes, Storybook-only docs, breaking changes trong patch releases.
