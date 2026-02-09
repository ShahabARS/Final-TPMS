# React Basics Guide for Beginners

## What is React?

React is a JavaScript library for building user interfaces. Instead of writing HTML files and manipulating the DOM directly (like you did with vanilla JavaScript), React lets you build **components** - reusable pieces of UI that manage their own state.

---

## Key React Concepts You Need to Know

### 1. **Components**

A component is like a function that returns HTML (called JSX). Think of it as a reusable UI piece.

```tsx
function MyComponent() {
  return <div>Hello World</div>;
}
```

### 2. **JSX (JavaScript XML)**

JSX looks like HTML but it's actually JavaScript. You can write HTML-like syntax inside JavaScript.

```tsx
// ✅ This is JSX
return <div className="container">Hello</div>;

// ❌ This is NOT valid JSX (use className, not class)
return <div class="container">Hello</div>;
```

**Important JSX rules:**
- Use `className` instead of `class` (because `class` is a reserved word in JavaScript)
- Use `htmlFor` instead of `for` in labels
- Always close tags: `<input />` not `<input>`
- Use curly braces `{}` to insert JavaScript expressions: `<h1>{name}</h1>`

### 3. **Props (Properties)**

Props are how you pass data from a parent component to a child component.

```tsx
// Parent component
<LoginPage onLogin={handleLogin} />

// Child component receives props
function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  // Use onLogin here
}
```

### 4. **State (useState Hook)**

State is data that can change. When state changes, React automatically re-renders the component.

```tsx
import { useState } from 'react';

function MyComponent() {
  // Create state: [currentValue, functionToUpdateIt]
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 5. **Event Handlers**

Functions that run when something happens (click, submit, type, etc.).

```tsx
function MyForm() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh
    console.log('Submitted:', email);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 6. **Conditional Rendering**

Show different content based on conditions.

```tsx
{isLoggedIn ? <BoardPage /> : <LoginPage />}
```

---

## Project Structure

```
src/
├── pages/          # Full page components (LoginPage, BoardPage)
├── components/     # Reusable UI pieces (Button, Modal, Input)
├── modals/         # Modal components (CreateTaskModal, etc.)
├── types/          # TypeScript type definitions
├── services/       # API calls and backend communication
├── App.tsx         # Root component (controls routing)
└── main.tsx        # Entry point (renders App)
```

---

## How Our App Works

1. **App.tsx** is the root component. It decides: show LoginPage or BoardPage?
2. **LoginPage** has a form. When submitted, it calls `onLogin()` prop.
3. **App.tsx** receives `onLogin`, updates state (`setIsLoggedIn(true)`), and shows BoardPage.
4. **BoardPage** shows the Kanban board (currently just a skeleton).

---

## Common Patterns You'll See

### Pattern 1: Controlled Inputs
```tsx
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Pattern 2: Passing Functions as Props
```tsx
// Parent
<ChildComponent onAction={handleAction} />

// Child
function ChildComponent({ onAction }: { onAction: () => void }) {
  return <button onClick={onAction}>Click me</button>;
}
```

### Pattern 3: Conditional Rendering
```tsx
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

---

## Next Steps

1. ✅ You have LoginPage and BoardPage working
2. Next: Create modals (CreateTaskModal, BoardSettingsModal, etc.)
3. Then: Add API calls to connect to MongoDB backend
4. Finally: Add drag-and-drop for Kanban board

---

## Tips

- **Always use TypeScript types** - it helps catch errors early
- **Keep components small** - if a component is >200 lines, split it
- **State goes up** - if multiple components need the same data, put state in their common parent
- **Props go down** - pass data from parent to child via props

---

## Resources

- [React Official Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
