# pawajs/continue

The **Selective Continuity Protocool (SCP) render** for [Pawajs](https://github.com/Allisboy/pawajs).

`pawajs/continue` handles the client-side hydration (resumption) of applications server-rendered with `pawajs/ssr`. It picks up where the server left off, attaching event listeners and reactivity to the existing DOM without expensive re-renders.

## Features

-   **Continuity**: selectively re-execute components marked reactive, state, and directives from server-rendered HTML.
-   **Lightweight**: Only loads what is necessary to make the page interactive.
-   **Seamless Integration**: Designed to work out-of-the-box with `pawajs` and `pawajs/ssr`.

## Installation

```bash
npm install @pawajs/continue
```

## Usage

In your client-side entry point, pass the serialized hydration data generated for the page to `PawaContinue`.

```javascript
import { PawaContinue } from "@pawajs/continue";

// `hydrationJson` is the serialized hydration tree embedded or supplied
// by your server-rendered page.
PawaContinue(hydrationJson);
```

## How it Works

1.  **Server-Side**: `pawajs/ssr` renders the HTML and SCP JSON (props, state, reactive areas) for continuity of the dom.
2.  **Client-Side**: `pawajs/continue` work through the json to update the dom during the `pawaContinue` process.
3.  **Continuity**: Instead of creating new DOM elements, it continues by reading JSON, restores the state, and attaches reactive effects to the existing elements from the server rendering.

## API

### `PawaContinue(json: string): void`

Parses the serialized hydration tree and resumes the existing DOM. The string should contain the JSON hydration data produced for the server-rendered page. If the JSON is invalid, the library reports the error and returns without resuming.

### `resumer(hydrate, graph, context): void | false`

Resumes a single hydration node against an existing Pawajs render graph and context. Most applications should use `PawaContinue` to resume the full tree.

### TypeScript

The package includes `index.d.ts` declarations for `PawaContinue`, `resumer`, `HydrationNode`, `HydrationTree`, and `RenderGraph`.

## Related Packages

-   **pawajs**: The core reactive framework.
-   **@pawajs/ssr**: The server-side rendering engine.
