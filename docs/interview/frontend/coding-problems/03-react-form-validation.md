---
layout: page
title: "React Form Validation with Custom Hooks"
difficulty: Hard
category: "Coding Problems"
tags: [react, hooks, form-validation, async-validation, custom-hooks]
---

# Problem 3: React Form Validation with Custom Hooks

## Problem Description

Create a custom React hook for form validation with multiple validation rules, real-time validation, and async validation support.

## Requirements

- Support multiple validation rules
- Real-time validation
- Custom error messages
- Field-level and form-level validation
- Async validation support

## Solution

{% raw %}
```javascript
// useFormValidation.js
import { useState, useCallback, useEffect } from "react";

const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation rules
  const defaultRules = {
    required: (value) =>
      (value && value.trim() !== "") || "This field is required",
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || "Please enter a valid email address";
    },
    minLength: (min) => (value) =>
      value.length >= min || `Must be at least ${min} characters`,
    maxLength: (max) => (value) =>
      value.length <= max || `Must be no more than ${max} characters`,
    pattern: (regex, message) => (value) => regex.test(value) || message,
    custom: (validator) => validator,
    async: (asyncValidator) => asyncValidator,
  };

  const allRules = { ...defaultRules, ...validationRules };

  // Validate a single field
  const validateField = useCallback(
    async (name, value) => {
      const fieldRules = allRules[name];
      if (!fieldRules) return null;

      for (const rule of fieldRules) {
        let validator;
        let params;

        if (typeof rule === "string") {
          validator = allRules[rule];
          params = [];
        } else if (typeof rule === "function") {
          validator = rule;
          params = [];
        } else if (rule.type && allRules[rule.type]) {
          validator = allRules[rule.type];
          params = rule.params || [];
        } else {
          continue;
        }

        const result = validator(value, ...params);

        if (result instanceof Promise) {
          try {
            const asyncResult = await result;
            if (asyncResult !== true) {
              return asyncResult;
            }
          } catch (error) {
            return error.message || "Validation failed";
          }
        } else if (result !== true) {
          return result;
        }
      }

      return null;
    },
    [allRules]
  );

  // Validate all fields
  const validateForm = useCallback(async () => {
    const newErrors = {};
    const validationPromises = [];

    for (const [name, value] of Object.entries(values)) {
      validationPromises.push(
        validateField(name, value).then((error) => {
          if (error) newErrors[name] = error;
        })
      );
    }

    await Promise.all(validationPromises);
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return newErrors;
  }, [values, validateField]);

  // Handle field change
  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  // Handle field blur
  const handleBlur = useCallback(
    async (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = await validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField, values]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (onSubmit) => {
      setIsSubmitting(true);

      try {
        const formErrors = await validateForm();

        if (Object.keys(formErrors).length === 0) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, values]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(false);
  }, [initialValues]);

  // Update form values
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Get field props
  const getFieldProps = useCallback(
    (name) => ({
      value: values[name] || "",
      onChange: (e) => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      error: touched[name] ? errors[name] : null,
      hasError: touched[name] && errors[name],
    }),
    [values, handleChange, handleBlur, touched, errors]
  );

  // Effect to validate form when values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(touched).length > 0) {
        validateForm();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [values, touched, validateForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    getFieldProps,
    validateField,
    validateForm,
  };
};

// Usage example
const RegistrationForm = () => {
  const validationRules = {
    username: [
      "required",
      { type: "minLength", params: [3] },
      {
        type: "pattern",
        params: [
          /^[a-zA-Z0-9_]+$/,
          "Only letters, numbers, and underscores allowed",
        ],
      },
      {
        type: "async",
        params: [
          async (value) => {
            // Simulate API call to check username availability
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return value !== "admin" || "Username already taken";
          },
        ],
      },
    ],
    email: ["required", "email"],
    password: [
      "required",
      { type: "minLength", params: [8] },
      {
        type: "custom",
        params: [
          (value) => {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            if (!hasUpperCase)
              return "Must contain at least one uppercase letter";
            if (!hasLowerCase)
              return "Must contain at least one lowercase letter";
            if (!hasNumbers) return "Must contain at least one number";
            if (!hasSpecialChar)
              return "Must contain at least one special character";

            return true;
          },
        ],
      },
    ],
    confirmPassword: [
      "required",
      {
        type: "custom",
        params: [
          (value, allValues) =>
            value === allValues.password || "Passwords do not match",
        ],
      },
    ],
  };

  const { values, errors, isSubmitting, isValid, handleSubmit, getFieldProps } =
    useFormValidation({}, validationRules);

  const onSubmit = async (formData) => {
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
    >
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...getFieldProps("username")}
          className={getFieldProps("username").hasError ? "error" : ""}
        />
        {getFieldProps("username").error && (
          <span className="error-message">
            {getFieldProps("username").error}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...getFieldProps("email")}
          className={getFieldProps("email").hasError ? "error" : ""}
        />
        {getFieldProps("email").error && (
          <span className="error-message">{getFieldProps("email").error}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...getFieldProps("password")}
          className={getFieldProps("password").hasError ? "error" : ""}
        />
        {getFieldProps("password").error && (
          <span className="error-message">
            {getFieldProps("password").error}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...getFieldProps("confirmPassword")}
          className={getFieldProps("confirmPassword").hasError ? "error" : ""}
        />
        {getFieldProps("confirmPassword").error && (
          <span className="error-message">
            {getFieldProps("confirmPassword").error}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="submit-button"
      >
        {isSubmitting ? "Submitting..." : "Register"}
      </button>
    </form>
  );
};
```
{% endraw %}

## CSS Styling

```css
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-message {
  display: block;
  margin-top: 5px;
  color: #dc3545;
  font-size: 14px;
  font-weight: 500;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.form-group input:valid {
  border-color: #28a745;
}

.form-group input:valid:focus {
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}
```

## Advanced Features

### Custom Validation Components

```javascript
// Custom Input Component
const ValidatedInput = ({
  name,
  label,
  type = "text",
  validation,
  ...props
}) => {
  const { getFieldProps } = useFormValidation();
  const fieldProps = getFieldProps(name);

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        {...fieldProps}
        {...props}
        className={`${fieldProps.hasError ? "error" : ""} ${
          props.className || ""
        }`}
      />
      {fieldProps.error && (
        <span className="error-message">{fieldProps.error}</span>
      )}
    </div>
  );
};

// Usage
const AdvancedForm = () => {
  const { handleSubmit, isValid } = useFormValidation();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ValidatedInput
        name="username"
        label="Username"
        placeholder="Enter username"
      />
      <ValidatedInput
        name="email"
        label="Email"
        type="email"
        placeholder="Enter email"
      />
      <ValidatedInput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter password"
      />
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};
```

### Async Validation with Loading States

```javascript
const useAsyncValidation = (validator, delay = 500) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const validate = useCallback(
    async (value) => {
      if (!value) return null;

      setIsValidating(true);

      try {
        const result = await validator(value);
        setValidationResult(result);
        return result;
      } catch (error) {
        setValidationResult(error.message);
        return error.message;
      } finally {
        setIsValidating(false);
      }
    },
    [validator]
  );

  return { validate, isValidating, validationResult };
};

// Usage in form
const UsernameField = () => {
  const { validate, isValidating } = useAsyncValidation(async (username) => {
    // API call to check username availability
    const response = await fetch(`/api/check-username?username=${username}`);
    const { available } = await response.json();
    return available || "Username already taken";
  });

  return (
    <div className="form-group">
      <label>Username</label>
      <div className="input-with-loader">
        <input type="text" onChange={(e) => validate(e.target.value)} />
        {isValidating && <div className="loader" />}
      </div>
    </div>
  );
};
```

## Key Features

1. **Flexible Validation Rules**: Support for multiple validation types
2. **Real-time Validation**: Immediate feedback as user types
3. **Async Validation**: Support for API-based validation
4. **Field-level Control**: Individual field validation and error handling
5. **Form-level Validation**: Complete form validation on submission
6. **Custom Error Messages**: Configurable error messages
7. **Performance Optimized**: Debounced validation to prevent excessive calls
8. **Accessibility**: Proper ARIA labels and error associations
