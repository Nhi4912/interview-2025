---
layout: page
title: "TypeScript Coding Challenges"
difficulty: Hard
category: "Coding Problems"
tags: [typescript, type-system, generics, utility-types, advanced-patterns]
---

# TypeScript Coding Challenges

## Problem 1: Advanced Type Utilities

Create a comprehensive set of TypeScript utility types that can be used in real-world applications.

### Requirements:
1. **DeepReadonly**: Make all properties deeply readonly
2. **DeepPartial**: Make all properties deeply optional
3. **RequiredKeys**: Extract keys that are required
4. **OptionalKeys**: Extract keys that are optional
5. **PickByType**: Pick properties by their type
6. **OmitByType**: Omit properties by their type

### Solution:

{% raw %}
```typescript
// DeepReadonly - makes all properties deeply readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// DeepPartial - makes all properties deeply optional
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

// RequiredKeys - extract keys that are required
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// OptionalKeys - extract keys that are optional
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// PickByType - pick properties by their type
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

// OmitByType - omit properties by their type
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

// NonNullable utility for deep objects
type DeepNonNullable<T> = {
  [P in keyof T]-?: T[P] extends object
    ? DeepNonNullable<T[P]>
    : NonNullable<T[P]>;
};

// Function parameter types
type FunctionParams<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

// Promise unwrapping
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Example usage and tests
interface User {
  id: number;
  name: string;
  email?: string;
  profile: {
    bio: string;
    avatar?: string;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  roles: string[];
  createdAt: Date;
  updateProfile: (data: Partial<User['profile']>) => void;
}

// Test the utility types
type ReadonlyUser = DeepReadonly<User>;
type PartialUser = DeepPartial<User>;
type RequiredUserKeys = RequiredKeys<User>; // 'id' | 'name' | 'profile' | 'roles' | 'createdAt' | 'updateProfile'
type OptionalUserKeys = OptionalKeys<User>; // 'email'
type StringProps = PickByType<User, string>; // { name: string }
type NonStringProps = OmitByType<User, string>; // Omits string properties

// Advanced conditional type
type IsArray<T> = T extends readonly unknown[] ? true : false;

// Tuple to Union
type TupleToUnion<T extends readonly unknown[]> = T[number];

// Union to Intersection
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// Test cases
function testUtilityTypes() {
  // DeepReadonly test
  const readonlyUser: ReadonlyUser = {} as ReadonlyUser;
  // readonlyUser.profile.settings.theme = 'dark'; // Error: Cannot assign to readonly property
  
  // DeepPartial test
  const partialUser: PartialUser = {
    name: 'John',
    profile: {
      settings: {
        theme: 'light'
        // notifications is optional
      }
    }
  };
  
  // PickByType test
  const stringOnlyProps: StringProps = { name: 'John' };
  
  // Type assertions to verify correctness
  const requiredKeys: RequiredUserKeys[] = ['id', 'name', 'profile', 'roles', 'createdAt', 'updateProfile'];
  const optionalKeys: OptionalUserKeys[] = ['email'];
}

// Advanced example: API Response Type Builder
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
};

type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Generic API client with typed responses
class ApiClient {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    return response.json();
  }
  
  async getPaginated<T>(url: string, page: number = 1): Promise<PaginatedResponse<T[]>> {
    const response = await fetch(`${url}?page=${page}`);
    return response.json();
  }
  
  async post<TRequest, TResponse>(
    url: string, 
    data: TRequest
  ): Promise<ApiResponse<TResponse>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// Usage with proper typing
const api = new ApiClient();

async function fetchUsers() {
  const response = await api.getPaginated<User>('/api/users');
  // response.data is typed as User[]
  // response.pagination is properly typed
  
  const createResponse = await api.post<Partial<User>, User>(
    '/api/users',
    { name: 'John', email: 'john@example.com' }
  );
  // createResponse.data is typed as User
}
```
{% endraw %}

## Problem 2: Type-Safe Event System

Build a type-safe event emitter system that ensures event names and payload types are correctly matched.

### Requirements:
1. **Type-safe event names**: Only registered events can be emitted/listened to
2. **Payload type safety**: Event payloads must match defined types
3. **Method chaining**: Support for method chaining
4. **Unsubscribe functionality**: Ability to remove listeners
5. **Once listeners**: Support for one-time event listeners

### Solution:

```typescript
// Event map interface - defines available events and their payload types
interface EventMap {
  [eventName: string]: any;
}

// Listener function type
type Listener<T> = (payload: T) => void;

// Internal listener storage
interface ListenerData<T> {
  listener: Listener<T>;
  once: boolean;
}

class TypedEventEmitter<TEventMap extends EventMap> {
  private listeners = new Map<keyof TEventMap, Set<ListenerData<any>>>();
  
  // Add event listener
  on<K extends keyof TEventMap>(
    event: K,
    listener: Listener<TEventMap[K]>
  ): this {
    return this.addListener(event, listener, false);
  }
  
  // Add one-time event listener
  once<K extends keyof TEventMap>(
    event: K,
    listener: Listener<TEventMap[K]>
  ): this {
    return this.addListener(event, listener, true);
  }
  
  // Remove event listener
  off<K extends keyof TEventMap>(
    event: K,
    listener: Listener<TEventMap[K]>
  ): this {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listenerData => {
        if (listenerData.listener === listener) {
          eventListeners.delete(listenerData);
        }
      });
      
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
    return this;
  }
  
  // Emit event
  emit<K extends keyof TEventMap>(
    event: K,
    payload: TEventMap[K]
  ): boolean {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.size === 0) {
      return false;
    }
    
    const listenersToRemove: ListenerData<TEventMap[K]>[] = [];
    
    eventListeners.forEach(listenerData => {
      listenerData.listener(payload);
      
      if (listenerData.once) {
        listenersToRemove.push(listenerData);
      }
    });
    
    // Remove one-time listeners
    listenersToRemove.forEach(listenerData => {
      eventListeners.delete(listenerData);
    });
    
    if (eventListeners.size === 0) {
      this.listeners.delete(event);
    }
    
    return true;
  }
  
  // Remove all listeners for an event
  removeAllListeners<K extends keyof TEventMap>(event?: K): this {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }
  
  // Get listener count for an event
  listenerCount<K extends keyof TEventMap>(event: K): number {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.size : 0;
  }
  
  // Get all event names that have listeners
  eventNames(): (keyof TEventMap)[] {
    return Array.from(this.listeners.keys());
  }
  
  private addListener<K extends keyof TEventMap>(
    event: K,
    listener: Listener<TEventMap[K]>,
    once: boolean
  ): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    const eventListeners = this.listeners.get(event)!;
    eventListeners.add({ listener, once });
    
    return this;
  }
}

// Example usage
interface AppEvents {
  'user:login': { userId: string; username: string; timestamp: Date };
  'user:logout': { userId: string; timestamp: Date };
  'post:created': { postId: string; authorId: string; title: string };
  'post:updated': { postId: string; changes: Record<string, any> };
  'error': { message: string; code: number; stack?: string };
  'notification': { type: 'info' | 'warning' | 'error'; message: string };
}

const eventEmitter = new TypedEventEmitter<AppEvents>();

// Type-safe event listeners
eventEmitter
  .on('user:login', (data) => {
    // data is typed as { userId: string; username: string; timestamp: Date }
    console.log(`User ${data.username} logged in at ${data.timestamp}`);
  })
  .on('post:created', (data) => {
    // data is typed as { postId: string; authorId: string; title: string }
    console.log(`New post created: ${data.title}`);
  })
  .once('error', (error) => {
    // data is typed as { message: string; code: number; stack?: string }
    console.error(`Error ${error.code}: ${error.message}`);
  });

// Type-safe event emission
eventEmitter.emit('user:login', {
  userId: '123',
  username: 'john_doe',
  timestamp: new Date()
});

// This would cause a TypeScript error:
// eventEmitter.emit('user:login', { userId: 123 }); // Error: missing properties

// Advanced: Event emitter with middleware
type EventMiddleware<TEventMap extends EventMap> = {
  <K extends keyof TEventMap>(
    event: K,
    payload: TEventMap[K],
    next: () => void
  ): void;
};

class AdvancedEventEmitter<TEventMap extends EventMap> extends TypedEventEmitter<TEventMap> {
  private middleware: EventMiddleware<TEventMap>[] = [];
  
  use(middleware: EventMiddleware<TEventMap>): this {
    this.middleware.push(middleware);
    return this;
  }
  
  emit<K extends keyof TEventMap>(
    event: K,
    payload: TEventMap[K]
  ): boolean {
    let index = 0;
    
    const runMiddleware = (): void => {
      if (index >= this.middleware.length) {
        super.emit(event, payload);
        return;
      }
      
      const middleware = this.middleware[index++];
      middleware(event, payload, runMiddleware);
    };
    
    runMiddleware();
    return true;
  }
}

// Usage with middleware
const advancedEmitter = new AdvancedEventEmitter<AppEvents>();

// Logging middleware
advancedEmitter.use((event, payload, next) => {
  console.log(`Event: ${String(event)}`, payload);
  next();
});

// Validation middleware
advancedEmitter.use((event, payload, next) => {
  if (event === 'error' && !payload.message) {
    console.warn('Error event must have a message');
    return;
  }
  next();
});

advancedEmitter.emit('user:login', {
  userId: '123',
  username: 'john_doe',
  timestamp: new Date()
});
```

## Problem 3: Generic Form Builder

Create a type-safe form builder that generates forms based on schema definitions with validation.

### Requirements:
1. **Type-safe schema**: Form schema should define field types and validation
2. **Dynamic form generation**: Generate form fields based on schema
3. **Validation**: Built-in and custom validation with error messages
4. **Type-safe values**: Form values should be correctly typed
5. **Conditional fields**: Support for conditional field display

### Solution:

```typescript
// Base field types
type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'date';

// Validation rules
interface ValidationRule<T = any> {
  rule: (value: T) => boolean;
  message: string;
}

// Field configuration
interface BaseFieldConfig {
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: ValidationRule<any>[];
  dependsOn?: string;
  condition?: (values: Record<string, any>) => boolean;
}

interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password';
  minLength?: number;
  maxLength?: number;
}

interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: { value: string | number; label: string }[];
  multiple?: boolean;
}

interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
}

interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
  min?: string;
  max?: string;
}

type FieldConfig = 
  | TextFieldConfig 
  | NumberFieldConfig 
  | SelectFieldConfig 
  | CheckboxFieldConfig 
  | DateFieldConfig;

// Form schema
type FormSchema = Record<string, FieldConfig>;

// Infer value types from schema
type InferFormValues<T extends FormSchema> = {
  [K in keyof T]: T[K] extends { type: 'text' | 'email' | 'password' }
    ? string
    : T[K] extends { type: 'number' }
    ? number
    : T[K] extends { type: 'select'; multiple: true }
    ? (string | number)[]
    : T[K] extends { type: 'select' }
    ? string | number
    : T[K] extends { type: 'checkbox' }
    ? boolean
    : T[K] extends { type: 'date' }
    ? Date
    : any;
};

// Form validation result
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Form builder class
class FormBuilder<TSchema extends FormSchema> {
  private schema: TSchema;
  private values: Partial<InferFormValues<TSchema>> = {};
  private errors: Record<string, string[]> = {};
  private touched: Record<string, boolean> = {};

  constructor(schema: TSchema) {
    this.schema = schema;
    this.initializeValues();
  }

  private initializeValues(): void {
    Object.keys(this.schema).forEach(key => {
      const field = this.schema[key];
      
      switch (field.type) {
        case 'checkbox':
          this.values[key as keyof InferFormValues<TSchema>] = false as any;
          break;
        case 'select':
          if ((field as SelectFieldConfig).multiple) {
            this.values[key as keyof InferFormValues<TSchema>] = [] as any;
          }
          break;
        default:
          this.values[key as keyof InferFormValues<TSchema>] = undefined as any;
      }
    });
  }

  // Set field value
  setValue<K extends keyof InferFormValues<TSchema>>(
    field: K,
    value: InferFormValues<TSchema>[K]
  ): this {
    this.values[field] = value;
    this.touched[field as string] = true;
    this.validateField(field as string);
    return this;
  }

  // Get field value
  getValue<K extends keyof InferFormValues<TSchema>>(
    field: K
  ): InferFormValues<TSchema>[K] | undefined {
    return this.values[field];
  }

  // Get all values
  getValues(): Partial<InferFormValues<TSchema>> {
    return { ...this.values };
  }

  // Validate single field
  private validateField(fieldName: string): void {
    const field = this.schema[fieldName];
    const value = this.values[fieldName as keyof InferFormValues<TSchema>];
    const fieldErrors: string[] = [];

    // Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(`${field.label} is required`);
    }

    // Type-specific validation
    if (value !== undefined && value !== null && value !== '') {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
          const textField = field as TextFieldConfig;
          const textValue = value as string;
          
          if (textField.minLength && textValue.length < textField.minLength) {
            fieldErrors.push(`${field.label} must be at least ${textField.minLength} characters`);
          }
          
          if (textField.maxLength && textValue.length > textField.maxLength) {
            fieldErrors.push(`${field.label} must be no more than ${textField.maxLength} characters`);
          }
          
          if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(textValue)) {
              fieldErrors.push(`${field.label} must be a valid email address`);
            }
          }
          break;

        case 'number':
          const numberField = field as NumberFieldConfig;
          const numberValue = value as number;
          
          if (numberField.min !== undefined && numberValue < numberField.min) {
            fieldErrors.push(`${field.label} must be at least ${numberField.min}`);
          }
          
          if (numberField.max !== undefined && numberValue > numberField.max) {
            fieldErrors.push(`${field.label} must be no more than ${numberField.max}`);
          }
          break;
      }
    }

    // Custom validation rules
    if (field.validation && value !== undefined && value !== null && value !== '') {
      field.validation.forEach(rule => {
        if (!rule.rule(value)) {
          fieldErrors.push(rule.message);
        }
      });
    }

    if (fieldErrors.length > 0) {
      this.errors[fieldName] = fieldErrors;
    } else {
      delete this.errors[fieldName];
    }
  }

  // Validate entire form
  validate(): ValidationResult {
    const visibleFields = this.getVisibleFields();
    
    visibleFields.forEach(fieldName => {
      this.validateField(fieldName);
    });

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: { ...this.errors }
    };
  }

  // Get visible fields based on conditions
  private getVisibleFields(): string[] {
    return Object.keys(this.schema).filter(fieldName => {
      const field = this.schema[fieldName];
      
      if (field.condition) {
        return field.condition(this.values);
      }
      
      if (field.dependsOn) {
        const dependentValue = this.values[field.dependsOn as keyof InferFormValues<TSchema>];
        return !!dependentValue;
      }
      
      return true;
    });
  }

  // Get field errors
  getFieldErrors(fieldName: string): string[] {
    return this.errors[fieldName] || [];
  }

  // Check if field has errors
  hasFieldError(fieldName: string): boolean {
    return !!this.errors[fieldName] && this.errors[fieldName].length > 0;
  }

  // Check if field is touched
  isFieldTouched(fieldName: string): boolean {
    return !!this.touched[fieldName];
  }

  // Reset form
  reset(): this {
    this.initializeValues();
    this.errors = {};
    this.touched = {};
    return this;
  }

  // Generate form HTML (for demonstration)
  generateHTML(): string {
    const visibleFields = this.getVisibleFields();
    
    return visibleFields.map(fieldName => {
      const field = this.schema[fieldName];
      const value = this.values[fieldName as keyof InferFormValues<TSchema>];
      const errors = this.getFieldErrors(fieldName);
      const hasError = errors.length > 0;
      
      let input = '';
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'date':
          input = `<input 
            type="${field.type}" 
            id="${fieldName}" 
            name="${fieldName}"
            placeholder="${field.placeholder || ''}"
            value="${value || ''}"
            ${field.required ? 'required' : ''}
            ${field.disabled ? 'disabled' : ''}
            class="${hasError ? 'error' : ''}"
          />`;
          break;
          
        case 'select':
          const selectField = field as SelectFieldConfig;
          const options = selectField.options.map(option => 
            `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>
              ${option.label}
            </option>`
          ).join('');
          
          input = `<select 
            id="${fieldName}" 
            name="${fieldName}"
            ${selectField.multiple ? 'multiple' : ''}
            ${field.required ? 'required' : ''}
            ${field.disabled ? 'disabled' : ''}
            class="${hasError ? 'error' : ''}"
          >${options}</select>`;
          break;
          
        case 'checkbox':
          input = `<input 
            type="checkbox" 
            id="${fieldName}" 
            name="${fieldName}"
            ${value ? 'checked' : ''}
            ${field.required ? 'required' : ''}
            ${field.disabled ? 'disabled' : ''}
            class="${hasError ? 'error' : ''}"
          />`;
          break;
      }
      
      const errorHTML = errors.length > 0 
        ? `<div class="error-messages">${errors.map(error => `<span class="error">${error}</span>`).join('')}</div>`
        : '';
      
      return `
        <div class="form-field ${hasError ? 'has-error' : ''}">
          <label for="${fieldName}">${field.label}${field.required ? ' *' : ''}</label>
          ${input}
          ${errorHTML}
        </div>
      `;
    }).join('');
  }
}

// Example usage
const userFormSchema = {
  firstName: {
    type: 'text' as const,
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true,
    minLength: 2,
    maxLength: 50
  },
  lastName: {
    type: 'text' as const,
    label: 'Last Name',
    placeholder: 'Enter your last name',
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    type: 'email' as const,
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
    validation: [
      {
        rule: (value: string) => !value.includes('+'),
        message: 'Email cannot contain + symbol'
      }
    ]
  },
  age: {
    type: 'number' as const,
    label: 'Age',
    required: true,
    min: 18,
    max: 120
  },
  country: {
    type: 'select' as const,
    label: 'Country',
    required: true,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' }
    ]
  },
  state: {
    type: 'select' as const,
    label: 'State',
    dependsOn: 'country',
    condition: (values) => values.country === 'us',
    options: [
      { value: 'ca', label: 'California' },
      { value: 'ny', label: 'New York' },
      { value: 'tx', label: 'Texas' }
    ]
  },
  newsletter: {
    type: 'checkbox' as const,
    label: 'Subscribe to newsletter'
  }
} as const;

const form = new FormBuilder(userFormSchema);

// Type-safe form manipulation
form
  .setValue('firstName', 'John') // Typed as string
  .setValue('age', 25) // Typed as number
  .setValue('newsletter', true) // Typed as boolean
  .setValue('country', 'us'); // Typed as string | number

// Get typed values
const values = form.getValues();
// values.firstName is typed as string | undefined
// values.age is typed as number | undefined
// values.newsletter is typed as boolean | undefined

// Validate and get results
const validation = form.validate();
console.log('Is valid:', validation.isValid);
console.log('Errors:', validation.errors);

// Generate HTML
const formHTML = form.generateHTML();
document.getElementById('form-container')!.innerHTML = formHTML;
```

These TypeScript challenges demonstrate advanced type system usage, generic programming, and real-world application patterns that are commonly tested in senior frontend interviews at Big Tech companies.
