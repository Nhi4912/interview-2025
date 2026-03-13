---
layout: page
title: "Accessible Modal Dialog / Hộp thoại Modal có thể truy cập"
difficulty: Medium
category: "Coding Problems"
tags: [react, accessibility, focus-management, aria, modal]
---

# Problem 8: Accessible Modal Dialog / Hộp thoại Modal có thể truy cập

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Problem Description / Mô tả bài toán

**English:** Create a modal dialog component that is fully accessible and follows WCAG guidelines for user interaction and screen reader support.

**Tiếng Việt:** Tạo một component hộp thoại modal đầy đủ tính năng truy cập và tuân theo hướng dẫn WCAG cho tương tác người dùng và hỗ trợ đọc màn hình.

## Requirements / Yêu cầu

**English Requirements:**
- Trap focus within the modal when open
- Close on Escape key or backdrop click
- Announce open/close states to screen readers
- Proper ARIA roles and attributes
- Restore focus to trigger element on close
- Prevent background scrolling when modal is open
- Support keyboard navigation
- Handle nested modals

**Yêu cầu (Tiếng Việt):**
- Giữ focus trong modal khi mở
- Đóng khi nhấn Escape hoặc click nền
- Thông báo trạng thái mở/đóng cho screen reader
- ARIA roles và attributes đúng chuẩn
- Khôi phục focus về element kích hoạt khi đóng
- Ngăn cuộn nền khi modal mở
- Hỗ trợ điều hướng bàn phím
- Xử lý modal lồng nhau

## Solution / Giải pháp

{% raw %}
```jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Focus trap utility / Tiện ích giữ focus
const useFocusTrap = (isOpen) => {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element / Lưu element được focus trước đó
    previousFocusRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements / Lấy tất cả elements có thể focus
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element / Focus element đầu tiên
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab - focus previous element / Shift + Tab - focus element trước
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab - focus next element / Tab - focus element tiếp theo
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      // Restore focus / Khôi phục focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  return containerRef;
};

// Modal component / Component Modal
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  ariaLabelledBy,
  ariaDescribedBy
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);
  const backdropRef = useRef(null);

  // Handle modal open/close animations / Xử lý animation mở/đóng modal
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent background scroll / Ngăn cuộn nền
      
      // Trigger animation / Kích hoạt animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = ''; // Restore scrolling / Khôi phục cuộn
      
      // Hide modal after animation / Ẩn modal sau animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key / Xử lý phím escape
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  // Handle backdrop click / Xử lý click nền
  const handleBackdropClick = useCallback((e) => {
    if (closeOnBackdrop && e.target === backdropRef.current) {
      onClose();
    }
  }, [closeOnBackdrop, onClose]);

  // Size classes / Class kích thước
  const sizeClasses = {
    small: 'modal-dialog--small',
    medium: 'modal-dialog--medium',
    large: 'modal-dialog--large',
    fullscreen: 'modal-dialog--fullscreen'
  };

  if (!isVisible) return null;

  return createPortal(
    <div
      className={`modal-backdrop ${
        isAnimating ? 'modal-backdrop--open' : ''
      }`}
      ref={backdropRef}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={focusTrapRef}
        className={`modal-dialog ${sizeClasses[size]} ${
          isAnimating ? 'modal-dialog--open' : ''
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy || 'modal-title'}
        aria-describedby={ariaDescribedBy}
      >
        <div className="modal-content">
          {/* Modal Header / Header Modal */}
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal / Đóng modal"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* Modal Body / Nội dung Modal */}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Modal hooks for programmatic control / Hooks Modal để điều khiển theo chương trình
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

// Confirmation Modal component / Component Modal xác nhận
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      ariaDescribedBy="confirmation-message"
    >
      <div className="confirmation-modal">
        <p id="confirmation-message" className="confirmation-message">
          {message}
        </p>
        <div className="confirmation-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${variant}`}
            onClick={handleConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Usage Examples / Ví dụ sử dụng
function App() {
  const { isOpen, openModal, closeModal } = useModal();
  const { 
    isOpen: isConfirmOpen, 
    openModal: openConfirm, 
    closeModal: closeConfirm 
  } = useModal();

  const handleDelete = () => {
    console.log('Item deleted / Đã xóa item');
    // Perform delete action / Thực hiện hành động xóa
  };

  return (
    <div className="app">
      {/* Basic Modal Example / Ví dụ Modal cơ bản */}
      <button onClick={openModal} className="btn btn-primary">
        Open Modal / Mở Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Sample Modal / Modal mẫu"
        size="medium"
      >
        <div>
          <p>This is a sample modal content. / Đây là nội dung modal mẫu.</p>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email / Nhập email của bạn"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message / Tin nhắn:</label>
              <textarea
                id="message"
                className="form-control"
                rows="4"
                placeholder="Enter your message / Nhập tin nhắn của bạn"
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel / Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Submit / Gửi
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Confirmation Modal Example / Ví dụ Modal xác nhận */}
      <button onClick={openConfirm} className="btn btn-danger">
        Delete Item / Xóa item
      </button>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={handleDelete}
        title="Delete Confirmation / Xác nhận xóa"
        message="Are you sure you want to delete this item? This action cannot be undone. / Bạn có chắc muốn xóa item này? Hành động này không thể hoàn tác."
        confirmText="Delete / Xóa"
        cancelText="Cancel / Hủy"
        variant="danger"
      />
    </div>
  );
}
```
{% endraw %}

## CSS Styling / CSS Styling

```css
/* Modal Backdrop / Nền Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-backdrop--open {
  opacity: 1;
}

/* Modal Dialog / Hộp thoại Modal */
.modal-dialog {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(-20px);
  transition: transform 0.3s ease;
  margin: 20px;
}

.modal-dialog--open {
  transform: scale(1) translateY(0);
}

/* Modal Sizes / Kích thước Modal */
.modal-dialog--small {
  width: 100%;
  max-width: 400px;
}

.modal-dialog--medium {
  width: 100%;
  max-width: 600px;
}

.modal-dialog--large {
  width: 100%;
  max-width: 900px;
}

.modal-dialog--fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  margin: 0;
  border-radius: 0;
}

/* Modal Content / Nội dung Modal */
.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
}

.modal-close:hover {
  color: #495057;
  background-color: #f8f9fa;
}

.modal-close:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.modal-body {
  padding: 20px 24px;
  flex-grow: 1;
  overflow-y: auto;
}

/* Form Styles / Styles Form */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

/* Button Styles / Styles Button */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Confirmation Modal / Modal xác nhận */
.confirmation-modal {
  text-align: center;
  padding: 20px 0;
}

.confirmation-message {
  font-size: 16px;
  color: #333;
  margin-bottom: 24px;
  line-height: 1.5;
}

.confirmation-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Responsive Design / Thiết kế responsive */
@media (max-width: 768px) {
  .modal-dialog {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    border-radius: 0;
  }

  .modal-header,
  .modal-body {
    padding: 16px 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .confirmation-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

/* High Contrast Mode / Chế độ tương phản cao */
@media (prefers-contrast: high) {
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .modal-dialog {
    border: 2px solid #000;
  }

  .modal-close:focus {
    outline: 3px solid #000;
  }
}

/* Reduced Motion / Giảm chuyển động */
@media (prefers-reduced-motion: reduce) {
  .modal-backdrop,
  .modal-dialog,
  .modal-close,
  .form-control,
  .btn {
    transition: none;
  }

  .modal-dialog {
    transform: none;
  }

  .modal-dialog--open {
    transform: none;
  }
}
```

## Advanced Features / Tính năng nâng cao

### Nested Modals Support / Hỗ trợ Modal lồng nhau

```jsx
// Modal Manager for handling multiple modals / Quản lý Modal để xử lý nhiều modal
const ModalManager = createContext();

const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modalConfig) => {
    setModals(prev => [...prev, { ...modalConfig, id: Date.now() }]);
  }, []);

  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const closeTopModal = useCallback(() => {
    setModals(prev => prev.slice(0, -1));
  }, []);

  return (
    <ModalManager.Provider value={{ openModal, closeModal, closeTopModal }}>
      {children}
      {modals.map((modal, index) => (
        <Modal
          key={modal.id}
          {...modal}
          style={{ zIndex: 1050 + index }}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </ModalManager.Provider>
  );
};
```

### Accessibility Enhancements / Cải tiến khả năng truy cập

```jsx
// Screen reader announcements / Thông báo cho screen reader
const useScreenReaderAnnouncement = () => {
  const announce = useCallback((message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return announce;
};

// Enhanced Modal with announcements / Modal cải tiến với thông báo
const AccessibleModal = ({ isOpen, title, ...props }) => {
  const announce = useScreenReaderAnnouncement();

  useEffect(() => {
    if (isOpen) {
      announce(`Modal opened: ${title}`);
    } else {
      announce('Modal closed');
    }
  }, [isOpen, title, announce]);

  return <Modal isOpen={isOpen} title={title} {...props} />;
};
```

## Key Features / Tính năng chính

**English Features:**
1. **Focus Management**: Automatic focus trapping and restoration
2. **Keyboard Navigation**: Full keyboard support with Escape and Tab handling
3. **Screen Reader Support**: Proper ARIA attributes and announcements
4. **Animation Support**: Smooth open/close animations with reduced motion respect
5. **Responsive Design**: Mobile-friendly with adaptive sizing
6. **Portal Rendering**: Renders outside normal DOM hierarchy
7. **Backdrop Control**: Configurable backdrop click behavior
8. **Multiple Sizes**: Support for different modal sizes
9. **Confirmation Dialogs**: Pre-built confirmation modal component
10. **Nested Modal Support**: Handle multiple modals simultaneously

**Tính năng (Tiếng Việt):**
1. **Quản lý Focus**: Tự động giữ và khôi phục focus
2. **Điều hướng bàn phím**: Hỗ trợ đầy đủ bàn phím với xử lý Escape và Tab
3. **Hỗ trợ Screen Reader**: ARIA attributes và thông báo phù hợp
4. **Hỗ trợ Animation**: Animation mở/đóng mượt mà với tùy chọn giảm chuyển động
5. **Thiết kế Responsive**: Thân thiện với mobile và kích thước tự động
6. **Portal Rendering**: Render bên ngoài DOM hierarchy thông thường
7. **Kiểm soát Backdrop**: Cấu hình hành vi click nền
8. **Nhiều kích thước**: Hỗ trợ các kích thước modal khác nhau
9. **Hộp thoại xác nhận**: Component modal xác nhận được xây dựng sẵn
10. **Hỗ trợ Modal lồng nhau**: Xử lý nhiều modal cùng lúc

## Interview Questions & Answers / Câu hỏi phỏng vấn và câu trả lời

### Q1: How do you implement focus trapping in a modal? / Bạn triển khai giữ focus trong modal như thế nào?

**English Answer:**
Focus trapping ensures that keyboard navigation stays within the modal while it's open. I implement this by:
1. Storing the previously focused element when the modal opens
2. Finding all focusable elements within the modal
3. Adding a keydown listener to handle Tab navigation
4. When Tab is pressed on the last element, focus moves to the first element
5. When Shift+Tab is pressed on the first element, focus moves to the last element
6. Restoring focus to the original element when the modal closes

**Câu trả lời (Tiếng Việt):**
Giữ focus đảm bảo điều hướng bàn phím duy trì trong modal khi nó mở. Tôi triển khai điều này bằng cách:
1. Lưu element được focus trước đó khi modal mở
2. Tìm tất cả elements có thể focus trong modal
3. Thêm keydown listener để xử lý điều hướng Tab
4. Khi Tab được nhấn ở element cuối, focus chuyển đến element đầu
5. Khi Shift+Tab được nhấn ở element đầu, focus chuyển đến element cuối
6. Khôi phục focus về element gốc khi modal đóng

### Q2: What ARIA attributes are essential for modal accessibility? / ARIA attributes nào quan trọng cho khả năng truy cập modal?

**English Answer:**
Essential ARIA attributes for modals include:
- `role="dialog"`: Identifies the element as a dialog
- `aria-modal="true"`: Indicates this is a modal dialog
- `aria-labelledby`: References the modal title element
- `aria-describedby`: References descriptive content
- `aria-hidden`: Controls visibility for assistive technologies
- `aria-live`: For dynamic announcements
- `aria-label`: Provides accessible names for close buttons

**Câu trả lời (Tiếng Việt):**
Các ARIA attributes quan trọng cho modal bao gồm:
- `role="dialog"`: Xác định element là một dialog
- `aria-modal="true"`: Chỉ ra đây là modal dialog
- `aria-labelledby`: Tham chiếu đến element tiêu đề modal
- `aria-describedby`: Tham chiếu đến nội dung mô tả
- `aria-hidden`: Kiểm soát khả năng hiển thị cho công nghệ hỗ trợ
- `aria-live`: Cho thông báo động
- `aria-label`: Cung cấp tên truy cập cho nút đóng

### Q3: How do you handle nested modals? / Bạn xử lý modal lồng nhau như thế nào?

**English Answer:**
Handling nested modals requires careful management of:
1. **Z-index stacking**: Each modal should have a higher z-index than the previous
2. **Focus management**: Only the topmost modal should trap focus
3. **Escape key handling**: Should close only the topmost modal
4. **Backdrop management**: Only show backdrop for the bottom modal
5. **State management**: Use a modal stack to track open modals
6. **Memory management**: Properly clean up event listeners

**Câu trả lời (Tiếng Việt):**
Xử lý modal lồng nhau đòi hỏi quản lý cẩn thận:
1. **Z-index stacking**: Mỗi modal nên có z-index cao hơn modal trước
2. **Quản lý focus**: Chỉ modal trên cùng mới giữ focus
3. **Xử lý phím Escape**: Chỉ nên đóng modal trên cùng
4. **Quản lý backdrop**: Chỉ hiển thị backdrop cho modal dưới
5. **Quản lý state**: Sử dụng modal stack để theo dõi modal mở
6. **Quản lý memory**: Dọn dẹp event listeners đúng cách
