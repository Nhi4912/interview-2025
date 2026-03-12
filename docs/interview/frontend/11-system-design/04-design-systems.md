# Design Systems & Component Libraries

> Design Systems đảm bảo consistency, scalability và developer experience trong ứng dụng lớn.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   WHAT IS A DESIGN SYSTEM:                                      │
│   ────────────────────────                                       │
│   Collection of reusable components, guided by clear standards  │
│   that can be assembled to build any number of applications     │
│                                                                   │
│   COMPONENTS:                                                   │
│   ───────────                                                    │
│                                                                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │   DESIGN     │  │  COMPONENT   │  │ DOCUMENTATION│         │
│   │   TOKENS     │  │   LIBRARY    │  │              │         │
│   │              │  │              │  │              │         │
│   │ • Colors     │  │ • Button     │  │ • Usage      │         │
│   │ • Typography │  │ • Input      │  │ • Props      │         │
│   │ • Spacing    │  │ • Modal      │  │ • Examples   │         │
│   │ • Shadows    │  │ • Card       │  │ • A11y       │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│   BENEFITS:                                                     │
│   ─────────                                                      │
│   ✓ Consistency across products                                 │
│   ✓ Faster development                                          │
│   ✓ Better collaboration (Design ↔ Dev)                        │
│   ✓ Easier maintenance                                          │
│   ✓ Built-in accessibility                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design Tokens

### What are Design Tokens

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN TOKENS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Design decisions stored as data                               │
│   Platform-agnostic (web, iOS, Android)                         │
│                                                                   │
│   TOKEN HIERARCHY:                                              │
│   ─────────────────                                              │
│                                                                   │
│   Global Tokens (Primitive)                                     │
│   └── color-blue-500: #3B82F6                                   │
│   └── spacing-4: 16px                                           │
│   └── font-size-lg: 18px                                        │
│                                                                   │
│           │                                                      │
│           ▼                                                      │
│                                                                   │
│   Alias Tokens (Semantic)                                       │
│   └── color-primary: {color-blue-500}                           │
│   └── color-error: {color-red-500}                              │
│   └── spacing-component: {spacing-4}                            │
│                                                                   │
│           │                                                      │
│           ▼                                                      │
│                                                                   │
│   Component Tokens                                              │
│   └── button-background: {color-primary}                        │
│   └── button-padding: {spacing-component}                       │
│   └── input-border-error: {color-error}                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Token Implementation

```typescript
// tokens.ts - Design tokens as TypeScript
export const tokens = {
    // Primitive tokens
    colors: {
        blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
        },
        gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            500: '#6B7280',
            900: '#111827',
        },
        red: {
            500: '#EF4444',
        },
        green: {
            500: '#22C55E',
        }
    },

    spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
    },

    typography: {
        fontFamily: {
            sans: 'Inter, system-ui, sans-serif',
            mono: 'JetBrains Mono, monospace',
        },
        fontSize: {
            xs: '12px',
            sm: '14px',
            base: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
        lineHeight: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75',
        }
    },

    borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    }
} as const;

// Semantic tokens
export const semanticTokens = {
    colors: {
        primary: tokens.colors.blue[500],
        primaryHover: tokens.colors.blue[600],
        secondary: tokens.colors.gray[500],
        error: tokens.colors.red[500],
        success: tokens.colors.green[500],
        background: tokens.colors.gray[50],
        text: tokens.colors.gray[900],
        textMuted: tokens.colors.gray[500],
    }
};

// CSS Variables generation
export function generateCSSVariables() {
    return `
        :root {
            --color-primary: ${semanticTokens.colors.primary};
            --color-primary-hover: ${semanticTokens.colors.primaryHover};
            --color-error: ${semanticTokens.colors.error};
            --color-success: ${semanticTokens.colors.success};
            --spacing-1: ${tokens.spacing[1]};
            --spacing-2: ${tokens.spacing[2]};
            --spacing-4: ${tokens.spacing[4]};
            --font-sans: ${tokens.typography.fontFamily.sans};
            --radius-md: ${tokens.borderRadius.md};
        }
    `;
}
```

### Dark Mode with Tokens

```tsx
// Theme tokens for light/dark mode
const lightTheme = {
    background: tokens.colors.gray[50],
    surface: '#FFFFFF',
    text: tokens.colors.gray[900],
    textMuted: tokens.colors.gray[500],
    border: tokens.colors.gray[200],
};

const darkTheme = {
    background: tokens.colors.gray[900],
    surface: tokens.colors.gray[800],
    text: tokens.colors.gray[50],
    textMuted: tokens.colors.gray[400],
    border: tokens.colors.gray[700],
};

// Theme provider
const ThemeContext = createContext(lightTheme);

function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);

    // Sync with system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);

        const handler = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={theme}>
            <div style={{
                '--bg': theme.background,
                '--surface': theme.surface,
                '--text': theme.text,
            } as React.CSSProperties}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
```

---

## 🧩 Component Architecture

### Component API Design

```tsx
// Well-designed component API

// Button - multiple variants, sizes, states
interface ButtonProps {
    // Appearance
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';

    // State
    isLoading?: boolean;
    isDisabled?: boolean;

    // Icons
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    // Polymorphism
    as?: 'button' | 'a' | React.ComponentType;

    // Standard HTML
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
}

function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    isDisabled = false,
    leftIcon,
    rightIcon,
    as: Component = 'button',
    children,
    ...props
}: ButtonProps) {
    return (
        <Component
            className={cn(
                'button',
                `button--${variant}`,
                `button--${size}`,
                isLoading && 'button--loading',
                isDisabled && 'button--disabled'
            )}
            disabled={isDisabled || isLoading}
            {...props}
        >
            {isLoading && <Spinner size="sm" />}
            {!isLoading && leftIcon}
            <span>{children}</span>
            {!isLoading && rightIcon}
        </Component>
    );
}

// Usage
<Button variant="primary" size="lg" leftIcon={<PlusIcon />}>
    Add Item
</Button>

<Button as="a" href="/signup" variant="secondary">
    Sign Up
</Button>
```

### Composable Components

```tsx
// Card component with composable API
interface CardProps {
    children: React.ReactNode;
    className?: string;
}

function Card({ children, className }: CardProps) {
    return (
        <div className={cn('card', className)}>
            {children}
        </div>
    );
}

function CardHeader({ children, className }: CardProps) {
    return (
        <div className={cn('card-header', className)}>
            {children}
        </div>
    );
}

function CardTitle({ children, className }: CardProps) {
    return (
        <h3 className={cn('card-title', className)}>
            {children}
        </h3>
    );
}

function CardDescription({ children, className }: CardProps) {
    return (
        <p className={cn('card-description', className)}>
            {children}
        </p>
    );
}

function CardContent({ children, className }: CardProps) {
    return (
        <div className={cn('card-content', className)}>
            {children}
        </div>
    );
}

function CardFooter({ children, className }: CardProps) {
    return (
        <div className={cn('card-footer', className)}>
            {children}
        </div>
    );
}

// Attach subcomponents
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

// Usage - flexible composition
<Card>
    <Card.Header>
        <Card.Title>Settings</Card.Title>
        <Card.Description>Manage your account settings</Card.Description>
    </Card.Header>
    <Card.Content>
        {/* Form fields */}
    </Card.Content>
    <Card.Footer>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
    </Card.Footer>
</Card>
```

### Accessible by Default

```tsx
// Built-in accessibility
interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

function Dialog({
    isOpen,
    onClose,
    title,
    description,
    children
}: DialogProps) {
    const titleId = useId();
    const descriptionId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);

    // Focus trap
    useFocusTrap(dialogRef, isOpen);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <Portal>
            {/* Backdrop */}
            <div
                className="dialog-backdrop"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                className="dialog"
            >
                <h2 id={titleId} className="dialog-title">
                    {title}
                </h2>

                {description && (
                    <p id={descriptionId} className="dialog-description">
                        {description}
                    </p>
                )}

                {children}

                <button
                    onClick={onClose}
                    className="dialog-close"
                    aria-label="Close dialog"
                >
                    <XIcon />
                </button>
            </div>
        </Portal>
    );
}
```

---

## 📚 Documentation

### Component Documentation with Storybook

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        docs: {
            description: {
                component: 'Primary UI component for user actions.',
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'danger'],
            description: 'Visual style variant',
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        isLoading: {
            control: 'boolean',
        },
        isDisabled: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary button
export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Button',
    },
};

// All variants
export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
        </div>
    ),
};

// All sizes
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

// Loading state
export const Loading: Story = {
    args: {
        isLoading: true,
        children: 'Loading',
    },
};

// With icons
export const WithIcons: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button leftIcon={<PlusIcon />}>Add Item</Button>
            <Button rightIcon={<ArrowRightIcon />}>Continue</Button>
        </div>
    ),
};
```

### Usage Guidelines

```markdown
# Button Component

## When to Use
- Primary actions (Submit, Save, Confirm)
- Secondary actions (Cancel, Back)
- Navigation triggers
- Form submissions

## When NOT to Use
- Navigation links (use `<a>` or Link component)
- Toggle states (use Switch or Toggle)
- Icon-only actions without visible label (use IconButton)

## Best Practices

### Do
- Use clear, action-oriented labels ("Save Changes" not "OK")
- Show loading state during async actions
- Disable button during form submission
- Use primary variant sparingly (1 per screen)

### Don't
- Don't use multiple primary buttons in one view
- Don't disable without explanation (use tooltip)
- Don't use for navigation (use Link)
- Don't exceed 3-4 words in label

## Accessibility
- All buttons have visible focus indicator
- Loading state announces to screen readers
- Disabled state prevents keyboard interaction
- Icon-only buttons require aria-label
```

---

## 🏗️ Design System Architecture

### Monorepo Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM STRUCTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   design-system/                                                │
│   ├── packages/                                                 │
│   │   ├── tokens/           # Design tokens                     │
│   │   │   ├── src/                                              │
│   │   │   │   ├── colors.ts                                     │
│   │   │   │   ├── typography.ts                                 │
│   │   │   │   └── index.ts                                      │
│   │   │   └── package.json                                      │
│   │   │                                                          │
│   │   ├── core/             # Core components                   │
│   │   │   ├── src/                                              │
│   │   │   │   ├── Button/                                       │
│   │   │   │   ├── Input/                                        │
│   │   │   │   └── index.ts                                      │
│   │   │   └── package.json                                      │
│   │   │                                                          │
│   │   ├── icons/            # Icon library                      │
│   │   │   ├── src/                                              │
│   │   │   └── package.json                                      │
│   │   │                                                          │
│   │   └── hooks/            # Shared hooks                      │
│   │       ├── src/                                              │
│   │       └── package.json                                      │
│   │                                                              │
│   ├── apps/                                                     │
│   │   ├── docs/             # Documentation site                │
│   │   └── storybook/        # Component playground              │
│   │                                                              │
│   ├── turbo.json            # Turborepo config                  │
│   └── package.json                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Package Dependencies

```json
// packages/core/package.json
{
  "name": "@mycompany/design-system",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "sideEffects": false,
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "@mycompany/tokens": "workspace:*",
    "@mycompany/icons": "workspace:*",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch"
  }
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is a design token?**

A: Design tokens are the smallest pieces of a design system - named entities that store visual design values (colors, spacing, typography). They're platform-agnostic and create a shared language between design and development.

### 🟡 Mid-level

**Q: How do you ensure components are accessible by default?**

A:
1. **Semantic HTML**: Use correct elements (button, not div)
2. **ARIA attributes**: role, aria-label, aria-describedby built-in
3. **Keyboard navigation**: Focus management, keyboard handlers
4. **Focus indicators**: Visible focus states
5. **Screen reader support**: Live regions for dynamic content
6. **Testing**: Automated a11y tests in CI

### 🔴 Senior

**Q: How would you architect a design system for multiple products?**

A:
```
Architecture decisions:
1. Monorepo with separate packages
2. Token-first approach (platform-agnostic)
3. Layered components (primitives → composites)
4. Versioning strategy (semver, changelogs)
5. Theming support for brand variants
6. Documentation as first-class citizen

Distribution:
- npm packages for versioned releases
- CDN for quick prototyping
- Figma integration for design sync

Governance:
- Contribution guidelines
- RFC process for new components
- Breaking change policy
- Deprecation workflow
```

---

## 📚 Active Recall

1. [ ] What are the 3 layers of design tokens?
2. [ ] List 5 principles of good component API design
3. [ ] How do you implement dark mode with tokens?
4. [ ] What should component documentation include?
5. [ ] Draw the folder structure of a design system monorepo

---

> **Tiếp theo:** [05-real-world-examples.md](./05-real-world-examples.md) - Real World System Design Examples
