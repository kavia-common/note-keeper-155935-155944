# Note Keeper – Frontend (Next.js)

A modern, minimalistic notes app with a sidebar for listing/searching notes and a clean editor interface for creating, viewing, editing, and deleting notes.

## Tech stack
- Next.js App Router
- React (client-side rendering)
- Tailwind CSS v4 (utilities via `@import "tailwindcss"`)

## Features
- Create, edit, and delete notes
- List and search notes
- Responsive two-pane layout (sidebar + editor)
- Light, minimal UI with responsive design

## Configuration

Create an `.env` file in this directory using the template below (see `.env.example`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

This should point to the `notes_database` backend base URL.

## Expected API (notes_database)

The frontend expects these REST endpoints (adjust in `src/lib/api.ts` if your backend differs):

- GET    /api/notes           -> `{ notes: Note[] }`
- GET    /api/notes/:id       -> `Note`
- POST   /api/notes           -> `Note`
- PUT    /api/notes/:id       -> `Note`
- DELETE /api/notes/:id       -> `{ success: true }`

`Note` fields used by the UI:
```ts
type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

## Run locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

This project uses static export. All dynamic content is fetched client-side from your configured API base URL.

## Project structure

- `src/app/page.tsx` – App entry and main state management
- `src/components/Sidebar.tsx` – Notes list and search box
- `src/components/Editor.tsx` – Title and content editor
- `src/lib/api.ts` – API client for CRUD operations
- `src/lib/utils.ts` – Debounce and formatting utils
- `src/types/note.ts` – Shared types

## Notes

- Public functions include `PUBLIC_INTERFACE` comments and inline docstrings as required.
- All configuration is read from environment variables at runtime—do not hardcode backend URLs.

