# @aisense/react-voice-ai-widget

A lightweight React component to embed a **CasaNeo Voice AI agent** into any React application.

CasaNeo is a reference VoiceAI implementation used by the **CasaNeo Reference Website** project.  
This widget makes it easy to start a voice conversation session by connecting your app to a LiveKit-powered agent using CasaNeo’s backend and configuration system.

---

## Features

- Plug-and-play React component
- Works with LiveKit Agents
- Session-based voice conversations
- Secure token fetching via CasaNeo backend
- Supports dynamic start/stop of voice sessions
- Framework-agnostic (Vite, CRA, Next.js, etc.)
- No bundled styles (you control UI & layout)

---

## Installation

Install the widget:

```bash
npm install @aisense/react-voice-ai-widget
```

This package has **peer dependencies** that must be installed in your app:

```bash
npm install @livekit/components-react livekit-client
```

> These are peer dependencies to avoid duplicate React/LiveKit instances and ensure compatibility with your app’s versions.

---

## Basic Usage

```tsx
import { useState } from "react";
import { ReactVoiceAIWidget } from "@aisense/react-voice-ai-widget";

const HomePage = () => {
  const [startConversation, setStartConversation] = useState(false);

  return (
    <div>
      <button
        className="px-4 py-2 rounded bg-blue-500 text-white"
        onClick={() => setStartConversation(true)}
      >
        Start Session
      </button>

      {startConversation && (
        <ReactVoiceAIWidget
          serverUrl={import.meta.env.VITE_SERVER_URL}
          livekitUrl={import.meta.env.VITE_LIVEKIT_URL}
          clientToken={import.meta.env.VITE_CLIENT_TOKEN}
          agentId="1"
          sessionId="1"
        />
      )}
    </div>
  );
};

export default HomePage;
```

---

## Props

```ts
export type ReactVoiceAIWidgetProps = {
  serverUrl: string;
  livekitUrl: string;
  clientToken: string;
  agentId: string;
  sessionId: string;
  connect?: boolean;
  children?: React.ReactNode;
  className?: string;
};
```

### `serverUrl`

CasaNeo backend server URL.
Used to fetch a LiveKit token securely.

Example:

```ts
https://api.casaneo.ai
```

---

### `livekitUrl`

LiveKit WebSocket URL.

Example:

```ts
wss://your-livekit-instance.livekit.cloud
```

---

### `clientToken`

CasaNeo client token generated via the **CasaNeo Admin Console**.
Used to authenticate your frontend against the CasaNeo backend.

---

### `agentId`

Agent identifier configured in the **CasaNeo Agent Studio**.

Each agent represents a distinct voice AI behavior (interviewer, real estate agent, tutor, etc.).

---

### `sessionId`

Unique identifier for the voice conversation session.

This is typically:

* an interview ID
* a property search session
* a customer interaction ID
* any entity your data server uses to initialize the agent

The agent uses this ID to fetch session-specific data.

---

### `connect` (optional)

Whether the widget should connect to LiveKit immediately.

Default: `true`

Example:

```tsx
<ReactVoiceAIWidget connect={false} />
```

Useful if you want to delay connection until user interaction.

---

### `children` (optional)

Custom React components rendered inside the LiveKit room.

You can use this to render your own UI, controls, or overlays.

---

### `className` (optional)

CSS class for the widget container.

Example:

```tsx
<ReactVoiceAIWidget className="h-full w-full" />
```

---

## Environment Variables

This widget does **not** read `.env` files directly.

Your app is responsible for loading env vars and passing them as props.

### Vite

```env
VITE_SERVER_URL=https://api.casaneo.ai
VITE_LIVEKIT_URL=wss://xyz.livekit.cloud
VITE_CLIENT_TOKEN=abc123
```

### CRA

```env
REACT_APP_SERVER_URL=...
REACT_APP_LIVEKIT_URL=...
REACT_APP_CLIENT_TOKEN=...
```

### Next.js

```env
NEXT_PUBLIC_SERVER_URL=...
NEXT_PUBLIC_LIVEKIT_URL=...
NEXT_PUBLIC_CLIENT_TOKEN=...
```

---

## How it works (high level)

1. Your app renders `ReactVoiceAIWidget`
2. The widget calls CasaNeo backend using `serverUrl`
3. CasaNeo returns a LiveKit token
4. The widget connects to LiveKit using `livekitUrl`
5. The agent is initialized using `agentId` + `sessionId`
6. Voice conversation starts

All sensitive data fetching happens **server-to-server**.

---

## Peer Dependencies (required)

This package requires:

```json
"@livekit/components-react": ">=2",
"livekit-client": ">=2"
```

Install them manually if not already present.

---

## Compatibility

* React 18+
* Vite / CRA / Next.js
* LiveKit Agents (Node or Python)
* Works with any CasaNeo backend

---

## Versioning & Updates

This package follows **semantic versioning**:

* Patch: bugfixes
* Minor: new features
* Major: breaking changes

Upgrade to latest:

```bash
npm install @aisense/react-voice-ai-widget@latest
```

---

## License

MIT

---

## About CasaNeo

CasaNeo is a reference VoiceAI platform demonstrating:

* agent orchestration
* voice pipelines
* session-based initialization
* secure data access
* LiveKit-powered realtime AI conversations

This widget is the official way to embed CasaNeo agents in React applications.
