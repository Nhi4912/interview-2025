---
layout: page
title: "Advanced React Patterns"
difficulty: Hard
category: "Coding Problems"
tags: [react, hoc, render-props, compound-components, advanced-patterns]
---

# Advanced React Patterns for Big Tech Interviews

## 🎯 Overview

This problem set covers advanced React patterns commonly tested in FAANG+ interviews. These patterns demonstrate deep React knowledge and architectural thinking required for senior positions.

## 📚 Knowledge Foundation

### Pattern 1: Higher-Order Components (HOCs)

**Definition**: A function that takes a component and returns a new component with enhanced functionality.

**When to Use**:
- Cross-cutting concerns (logging, authentication, data fetching)
- Code reuse across multiple components
- Conditional rendering logic

**Key Concepts**:
- Wrapper components
- Props proxy pattern
- Inheritance inversion pattern
- Display name conventions

### Pattern 2: Render Props

**Definition**: A component that uses a function prop to determine what to render.

**When to Use**:
- Sharing stateful logic between components
- Dynamic component rendering
- Flexible component composition

### Pattern 3: Compound Components

**Definition**: Components that work together to form a complete UI, sharing implicit state.

**When to Use**:
- Building component libraries
- Creating flexible, composable APIs
- Managing related component state

## 🎯 Problem 1: Smart Data Fetcher with HOC

### Requirements

Create a Higher-Order Component that:
- Fetches data from an API endpoint
- Handles loading, error, and success states
- Provides retry functionality
- Supports caching
- Can be applied to any component

### Solution

{% raw %}
```javascript
import React, { useState, useEffect, useCallback } from 'react';

// Cache implementation
const cache = new Map();

// HOC for data fetching
const withDataFetcher = (url, options = {}) => (WrappedComponent) => {
  const WithDataFetcher = (props) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const {
      enableCache = true,
      maxRetries = 3,
      retryDelay = 1000,
      transform = (data) => data,
      onSuccess,
      onError,
      dependencies = []
    } = options;

    const fetchData = useCallback(async () => {
      const cacheKey = `${url}-${JSON.stringify(dependencies)}`;
      
      // Check cache first
      if (enableCache && cache.has(cacheKey)) {
        setData(cache.get(cacheKey));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const transformedData = transform(result);

        // Cache the result
        if (enableCache) {
          cache.set(cacheKey, transformedData);
        }

        setData(transformedData);
        onSuccess?.(transformedData);
      } catch (err) {
        setError(err.message);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    }, [url, transform, enableCache, onSuccess, onError, ...dependencies]);

    const retry = useCallback(() => {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchData();
        }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      }
    }, [retryCount, maxRetries, retryDelay, fetchData]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // Enhanced props
    const enhancedProps = {
      ...props,
      data,
      loading,
      error,
      retry,
      canRetry: retryCount < maxRetries,
      retryCount,
      refetch: fetchData
    };

    return <WrappedComponent {...enhancedProps} />;
  };

  WithDataFetcher.displayName = `withDataFetcher(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithDataFetcher;
};

// Usage Example
const UserList = ({ data, loading, error, retry, canRetry }) => {
  if (loading) return <div className="spinner">Loading users...</div>;
  
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        {canRetry && (
          <button onClick={retry} className="retry-button">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="user-list">
      {data?.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

// Enhanced component
const EnhancedUserList = withDataFetcher('/api/users', {
  enableCache: true,
  maxRetries: 3,
  transform: (data) => data.users || data,
  onSuccess: (data) => console.log('Users loaded:', data.length),
  onError: (error) => console.error('Failed to load users:', error)
})(UserList);
```
{% endraw %}

### Advanced HOC with Authentication

```javascript
const withAuth = (requiredRole = null) => (WrappedComponent) => {
  const WithAuth = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) throw new Error('No token found');

          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!response.ok) throw new Error('Invalid token');

          const userData = await response.json();
          setUser(userData);

          // Check role-based authorization
          if (requiredRole && userData.role !== requiredRole) {
            throw new Error('Insufficient permissions');
          }

          setAuthorized(true);
        } catch (error) {
          setAuthorized(false);
          // Redirect to login
          window.location.href = '/login';
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (loading) {
      return <div className="auth-loading">Verifying authentication...</div>;
    }

    if (!authorized) {
      return <div className="auth-error">Access denied</div>;
    }

    return <WrappedComponent {...props} user={user} />;
  };

  WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithAuth;
};

// Usage
const AdminDashboard = withAuth('admin')(Dashboard);
const UserProfile = withAuth()(Profile);
```

## 🎯 Problem 2: Flexible Modal with Render Props

### Requirements

Create a Modal component using render props that:
- Manages open/close state
- Supports animations
- Handles escape key and overlay clicks
- Provides flexible content rendering
- Supports multiple modal instances

### Solution

```javascript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ 
  children, 
  defaultOpen = false,
  closeOnEscape = true,
  closeOnOverlay = true,
  animationDuration = 300,
  onOpen,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsAnimating(true);
    onOpen?.();
    
    setTimeout(() => setIsAnimating(false), animationDuration);
  }, [onOpen, animationDuration]);

  const close = useCallback(() => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
      onClose?.();
    }, animationDuration);
  }, [onClose, animationDuration]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && closeOnEscape) {
      close();
    }
  }, [close, closeOnEscape]);

  const handleOverlayClick = useCallback((event) => {
    if (event.target === overlayRef.current && closeOnOverlay) {
      close();
    }
  }, [close, closeOnOverlay]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const modalProps = {
    isOpen,
    isAnimating,
    open,
    close,
    modalRef,
    overlayRef
  };

  if (!isOpen) {
    return children(modalProps);
  }

  const modalContent = (
    <div 
      ref={overlayRef}
      className={`modal-overlay ${isAnimating ? 'animating' : ''}`}
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`modal-content ${isAnimating ? 'animating' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {children(modalProps)}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Usage Examples
const ConfirmationModal = () => (
  <Modal>
    {({ isOpen, open, close }) => (
      <>
        <button onClick={open}>Delete Item</button>
        {isOpen && (
          <div className="confirmation-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button onClick={close} className="cancel-button">
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Perform deletion
                  console.log('Item deleted');
                  close();
                }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </>
    )}
  </Modal>
);

// Advanced Modal with Form
const FormModal = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <Modal
      onOpen={() => console.log('Form modal opened')}
      onClose={() => setFormData({ name: '', email: '' })}
    >
      {({ isOpen, open, close }) => (
        <>
          <button onClick={open}>Add User</button>
          {isOpen && (
            <form 
              className="form-content"
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted:', formData);
                close();
              }}
            >
              <h2>Add New User</h2>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              <div className="modal-actions">
                <button type="button" onClick={close}>Cancel</button>
                <button type="submit">Add User</button>
              </div>
            </form>
          )}
        </>
      )}
    </Modal>
  );
};
```

## 🎯 Problem 3: Compound Component Accordion

### Requirements

Create an Accordion compound component system that:
- Uses React Context for state sharing
- Supports multiple panels
- Allows single or multiple panel expansion
- Provides flexible styling and content
- Follows accessibility best practices

### Solution

```javascript
import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback,
  Children,
  cloneElement
} from 'react';

// Accordion Context
const AccordionContext = createContext();

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
};

// Main Accordion Component
const Accordion = ({ 
  children, 
  allowMultiple = false, 
  defaultExpandedPanels = [],
  onChange
}) => {
  const [expandedPanels, setExpandedPanels] = useState(
    new Set(defaultExpandedPanels)
  );

  const togglePanel = useCallback((panelId) => {
    setExpandedPanels(prev => {
      const newExpanded = new Set(prev);
      
      if (newExpanded.has(panelId)) {
        newExpanded.delete(panelId);
      } else {
        if (!allowMultiple) {
          newExpanded.clear();
        }
        newExpanded.add(panelId);
      }
      
      onChange?.(Array.from(newExpanded));
      return newExpanded;
    });
  }, [allowMultiple, onChange]);

  const isExpanded = useCallback((panelId) => {
    return expandedPanels.has(panelId);
  }, [expandedPanels]);

  const value = {
    togglePanel,
    isExpanded,
    allowMultiple
  };

  return (
    <AccordionContext.Provider value={value}>
      <div className="accordion" role="presentation">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// Panel Component
const AccordionPanel = ({ children, id, disabled = false }) => {
  const { togglePanel, isExpanded } = useAccordion();
  const expanded = isExpanded(id);

  return (
    <div 
      className={`accordion-panel ${expanded ? 'expanded' : ''} ${disabled ? 'disabled' : ''}`}
      data-panel-id={id}
    >
      {Children.map(children, child => 
        cloneElement(child, { panelId: id, expanded, disabled })
      )}
    </div>
  );
};

// Header Component
const AccordionHeader = ({ children, panelId, expanded, disabled }) => {
  const { togglePanel } = useAccordion();

  const handleClick = () => {
    if (!disabled) {
      togglePanel(panelId);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={`accordion-header ${expanded ? 'expanded' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={expanded}
      aria-controls={`panel-${panelId}`}
      disabled={disabled}
      type="button"
    >
      <span className="accordion-title">{children}</span>
      <span className={`accordion-icon ${expanded ? 'rotated' : ''}`}>
        ▼
      </span>
    </button>
  );
};

// Content Component
const AccordionContent = ({ children, panelId, expanded }) => {
  return (
    <div
      id={`panel-${panelId}`}
      className={`accordion-content ${expanded ? 'expanded' : ''}`}
      role="region"
      aria-labelledby={`header-${panelId}`}
      hidden={!expanded}
    >
      <div className="accordion-content-inner">
        {children}
      </div>
    </div>
  );
};

// Compound component assignment
Accordion.Panel = AccordionPanel;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

// Usage Examples
const FAQSection = () => (
  <Accordion allowMultiple={true} defaultExpandedPanels={['panel1']}>
    <Accordion.Panel id="panel1">
      <Accordion.Header>What is React?</Accordion.Header>
      <Accordion.Content>
        <p>React is a JavaScript library for building user interfaces.</p>
        <p>It was developed by Facebook and is now maintained by Meta.</p>
      </Accordion.Content>
    </Accordion.Panel>

    <Accordion.Panel id="panel2">
      <Accordion.Header>How do hooks work?</Accordion.Header>
      <Accordion.Content>
        <p>Hooks are functions that let you use state and lifecycle features in functional components.</p>
        <ul>
          <li>useState for state management</li>
          <li>useEffect for side effects</li>
          <li>useContext for context consumption</li>
        </ul>
      </Accordion.Content>
    </Accordion.Panel>

    <Accordion.Panel id="panel3" disabled>
      <Accordion.Header>What is JSX? (Coming Soon)</Accordion.Header>
      <Accordion.Content>
        <p>This content is not available yet.</p>
      </Accordion.Content>
    </Accordion.Panel>
  </Accordion>
);

// Advanced Accordion with Custom Controls
const AdvancedAccordionDemo = () => {
  const [expandedPanels, setExpandedPanels] = useState([]);

  return (
    <div>
      <div className="accordion-controls">
        <button onClick={() => setExpandedPanels(['panel1', 'panel2', 'panel3'])}>
          Expand All
        </button>
        <button onClick={() => setExpandedPanels([])}>
          Collapse All
        </button>
      </div>
      
      <Accordion 
        allowMultiple={true}
        defaultExpandedPanels={expandedPanels}
        onChange={setExpandedPanels}
      >
        <Accordion.Panel id="panel1">
          <Accordion.Header>Advanced React Patterns</Accordion.Header>
          <Accordion.Content>
            <div className="rich-content">
              <h4>Higher-Order Components</h4>
              <p>Functions that take a component and return a new component.</p>
              <pre><code>const enhancedComponent = withHOC(BaseComponent);</code></pre>
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        <Accordion.Panel id="panel2">
          <Accordion.Header>Performance Optimization</Accordion.Header>
          <Accordion.Content>
            <div className="rich-content">
              <h4>React Performance</h4>
              <ul>
                <li>React.memo for component memoization</li>
                <li>useMemo for expensive calculations</li>
                <li>useCallback for function memoization</li>
                <li>Code splitting with React.lazy</li>
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        <Accordion.Panel id="panel3">
          <Accordion.Header>State Management</Accordion.Header>
          <Accordion.Content>
            <div className="rich-content">
              <h4>State Management Solutions</h4>
              <table>
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Use Case</th>
                    <th>Learning Curve</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>useState</td>
                    <td>Component state</td>
                    <td>Easy</td>
                  </tr>
                  <tr>
                    <td>useReducer</td>
                    <td>Complex state logic</td>
                    <td>Medium</td>
                  </tr>
                  <tr>
                    <td>Redux</td>
                    <td>Global state</td>
                    <td>Hard</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};
```

## 🎨 CSS Styling

```css
/* Accordion Styles */
.accordion {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.accordion-panel {
  border-bottom: 1px solid #e1e5e9;
}

.accordion-panel:last-child {
  border-bottom: none;
}

.accordion-panel.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.accordion-header {
  width: 100%;
  padding: 16px 20px;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
}

.accordion-header:hover {
  background: #e9ecef;
}

.accordion-header:focus {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

.accordion-header.expanded {
  background: #e7f3ff;
  border-bottom: 1px solid #b8daff;
}

.accordion-icon {
  transition: transform 0.2s ease;
  color: #6c757d;
  font-size: 12px;
}

.accordion-icon.rotated {
  transform: rotate(180deg);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-content.expanded {
  max-height: 1000px; /* Adjust based on content */
}

.accordion-content-inner {
  padding: 20px;
  background: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.modal-overlay.animating {
  animation: fadeIn 0.3s ease forwards;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9);
  animation: scaleIn 0.3s ease forwards;
}

.modal-content.animating {
  animation: scaleIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  to {
    transform: scale(1);
  }
}

.confirmation-content,
.form-content {
  padding: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-button,
.delete-button,
.retry-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.delete-button {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.delete-button:hover {
  background: #c82333;
}

.retry-button {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.retry-button:hover {
  background: #0056b3;
}

/* Loading and Error States */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  padding: 20px;
  border: 1px solid #f5c6cb;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  text-align: center;
}
```

## 🧠 Key Learning Points

### HOCs Best Practices

1. **Static Hoisting**: Copy static methods from wrapped component
2. **Ref Forwarding**: Use `forwardRef` when refs are needed
3. **Display Names**: Set meaningful display names for debugging
4. **Pure Functions**: Keep HOCs pure and predictable

### Render Props Benefits

1. **Dynamic Rendering**: More flexible than HOCs
2. **Explicit Dependencies**: Clear data flow
3. **Better TypeScript Support**: Easier to type
4. **No Wrapper Hell**: Cleaner component tree

### Compound Components Advantages

1. **Flexible API**: Users control structure
2. **Implicit State Sharing**: Clean component communication
3. **Accessibility**: Easier to implement ARIA patterns
4. **Separation of Concerns**: Each component has single responsibility

## 📝 Interview Questions

### Technical Questions

1. **HOCs vs Render Props vs Hooks**: When to use each pattern?
2. **Performance**: How do these patterns affect React performance?
3. **Testing**: How would you test these patterns?
4. **TypeScript**: How do you type these patterns correctly?

### Design Questions

1. **API Design**: How would you design a flexible component API?
2. **State Management**: Where should state live in compound components?
3. **Accessibility**: How do you ensure these patterns are accessible?
4. **Error Boundaries**: How do you handle errors in these patterns?

### Follow-up Challenges

1. **Extend the Modal**: Add drag-and-drop functionality
2. **Enhance the Accordion**: Add keyboard navigation between panels
3. **Optimize the HOC**: Implement proper memoization
4. **Add Animation**: Create smooth transitions for compound components

This comprehensive problem set demonstrates advanced React patterns essential for big tech interviews, combining theoretical knowledge with practical implementation skills.
