# Co-Browse Portfolio Chatbot
A Next.js portfolio site with a Gemini-powered co-browsing assistant that can answer questions and execute safe on-page actions.

Repository: `https://github.com/uttam-on-git/co-browse-folio`

## Demo Video
- Demo video: `https://demo-link-here`

## Chat Screenshot / GIF

```md
![Chat Demo](docs/chat-demo.gif)
```

## Architecture
### System View
```text
Browser UI (Next.js client)
├─ Portfolio sections (hero/projects/about/contact)
├─ useContentExtractor
│  └─ Tracks visible sections + extracts structured page context
├─ ChatWidget
│  ├─ MessageList / ChatInput / ErrorBoundary
│  └─ Uses useChat for orchestration
└─ useChat
   ├─ Sends messages + page context to /api/chat
   ├─ Executes tool calls in browser via action-executor
   └─ Sends tool results back to /api/chat for final response

Server API (Next.js Route Handler)
└─ /api/chat
   ├─ Builds system prompt from page context
   ├─ Calls Gemini with function declarations (tools.ts)
   └─ Returns either text response or tool calls

External
└─ Google Gemini API
```

### Request Lifecycle (End-to-End)
```text
1) User sends message in ChatWidget
2) useContentExtractor provides current pageContext
3) useChat -> POST /api/chat { messages, pageContext }
4) Gemini returns:
   a) type="text"      -> show assistant response
   b) type="tool_calls"-> execute actions sequentially in browser
5) useChat executes tools via action-executor (scroll/highlight/click/fill/info)
6) useChat -> POST /api/chat with tool execution summary/results
7) Gemini returns final assistant response
8) UI renders final message + action feedback (toast/status)
```

## Tech Stack
- Next.js `16.1.6`
- React `19.2.3`
- TypeScript `^5`
- Tailwind CSS `^4`
- Framer Motion `^12.34.0`
- Gemini SDK `@google/generative-ai ^0.24.1`
- Lucide React `^0.563.0`
- clsx `^2.1.1`
- tailwind-merge `^3.4.0`

## Setup Instructions
1. Clone and enter project:

```bash
git clone https://github.com/uttam-on-git/co-browse-folio.git
cd co-browse-folio
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.local.example .env.local
```

If `.env.local.example` does not exist, create `.env.local` manually:

```env
GEMINI_API_KEY=your_api_key_here
# Optional (recommended to omit so auto-discovery picks supported model):
# GEMINI_MODEL=gemini-2.0-flash
```

4. Run development server:

```bash
npm run dev
```

5. Open:
- `http://localhost:3000`

## Environment Variables
| Variable | Required | Example | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | `AIza...` | API key for Google Gemini API |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Force a specific model; if invalid/unavailable, app falls back to discovered supported model |

## Tool System Documentation
Tools are defined in `src/lib/tools.ts` and executed in `src/lib/action-executor.ts`.

1. `scroll_to_section`
- Purpose: Scroll viewport to a section
- Params: `sectionId: string`, `behavior: "smooth" | "auto"`
- Example:

```json
{
  "name": "scroll_to_section",
  "arguments": {
    "sectionId": "projects",
    "behavior": "smooth"
  }
}
```

2. `highlight_element`
- Purpose: Temporary visual highlight for an element
- Params: `elementId: string`, `durationSeconds: number`, `color?: string`
- Example:

```json
{
  "name": "highlight_element",
  "arguments": {
    "elementId": "contact",
    "durationSeconds": 3,
    "color": "#22c55e"
  }
}
```

3. `click_element`
- Purpose: Programmatically click a button/link
- Params: `elementId: string`, `requireConfirmation?: boolean`
- Example:

```json
{
  "name": "click_element",
  "arguments": {
    "elementId": "open-chat",
    "requireConfirmation": true
  }
}
```

4. `fill_input`
- Purpose: Fill form input value
- Params: `inputId: string`, `value: string`
- Example:

```json
{
  "name": "fill_input",
  "arguments": {
    "inputId": "contact-email",
    "value": "user@example.com"
  }
}
```

5. `get_element_info`
- Purpose: Inspect element text/type/visibility/position
- Params: `elementId: string`
- Example:

```json
{
  "name": "get_element_info",
  "arguments": {
    "elementId": "projects"
  }
}
```

## Project Structure
```text
co-browse-chatbot/
├─ src/
│  ├─ app/
│  │  ├─ api/chat/route.ts
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ ChatProvider.tsx
│  │  ├─ chat/
│  │  │  ├─ ChatInput.tsx
│  │  │  ├─ ChatWidget.tsx
│  │  │  ├─ ErrorBoundary.tsx
│  │  │  ├─ MessageList.tsx
│  │  │  ├─ MessageSkeleton.tsx
│  │  │  └─ TypingIndicator.tsx
│  │  └─ sections/
│  │     ├─ AboutSection.tsx
│  │     ├─ ContactSection.tsx
│  │     ├─ HeroSection.tsx
│  │     └─ ProjectsSection.tsx
│  ├─ hooks/
│  │  ├─ useChat.ts
│  │  └─ useContentExtractor.ts
│  ├─ lib/
│  │  ├─ action-executor.ts
│  │  ├─ tools.ts
│  │  └─ utils.ts
│  └─ types/index.ts
├─ package.json
└─ README.md
```


## License
This project is licensed under the MIT License.
