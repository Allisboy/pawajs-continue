# pawajs-continue

The **Continuity Rendering Model (CRM)** for [Pawajs](https://github.com/Allisboy/pawajs).

`pawajs-continue` handles the client-side hydration (resumption) of applications server-rendered with `pawa-ssr`. It picks up where the server left off, attaching event listeners and reactivity to the existing DOM without expensive re-renders.

## Features

-   **Resumability**: Hydrates components, state, and directives from server-rendered HTML.
-   **Lightweight**: Only loads what is necessary to make the page interactive.
-   **Seamless Integration**: Designed to work out-of-the-box with `pawajs` and `pawa-ssr`.

## Installation

```bash
npm install pawajs-continue
```

## Usage

In your client-side entry point (e.g., `main.js` or `app.js`), import `initiateResumer` and call it before starting the Pawajs app.

```javascript
import { isServer } from "pawajs/server";
import { RegisterComponent, pawaStartApp } from "pawajs";
import { initiateResumer } from "pawajs-continue";
import { App } from "./App.js";

// Register your root component and others
RegisterComponent(App);

if (!isServer()) {
    const app = document.getElementById('app');
    
    // 1. Initialize the continuity engine
    initiateResumer();
    
    // 2. Start the app (hydrates the existing DOM)
    pawaStartApp(app);
}
```

## How it Works

1.  **Server-Side**: `pawa-ssr` renders the HTML and embeds serialized data (props, state, context) into comments within the DOM.
2.  **Client-Side**: `pawajs-continue` scans the DOM during the `pawaStartApp` process.
3.  **Continuity**: Instead of creating new DOM elements, it continues by reading he markers or the serialized data, restores the state, and attaches reactive effects to the existing elements from the server rendering.

## API

### `initiateResumer()`

Initializes the hydration logic for attributes, text, loops (`for-each`), conditionals (`if`), and components. This must be called before `pawaStartApp` on the client.

## Related Packages

-   **pawajs**: The core reactive framework.
-   **pawa-ssr**: The server-side rendering engine.
