# Preorder Manager — Frontend

Next.js client for the Preorder Manager app.

🌐 **Live Site:** [https://preorder-manager-gamma.vercel.app](https://preorder-manager-gamma.vercel.app)
🛠 **Backend Repo:** [https://github.com/nihalxofficial/preorder-manager-server](https://github.com/nihalxofficial/preorder-manager-server)

---

## Tech Stack

- **Next.js 16** — Full-stack React framework
- **HeroUI** — UI component library
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icons

---

## Project Structure

```
preorder-manager-client/
├── app/
│   ├── page.js                     # Preorder List page
│   ├── preorders/
│   │   ├── create/page.js          # Create Preorder page
│   │   └── [id]/edit/page.js       # Edit Preorder page
│   ├── layout.js
│   └── globals.css
├── components/                     # Reusable UI components
├── .env.local                      # Environment variables
└── package.json
```

---

## Prerequisites

- Node.js v18 or higher
- npm
- Backend server running at `http://localhost:5000` (see backend README)

---

## Setup & Run Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd preorder-manager-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

App runs at: `http://localhost:3000`

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Preorder List — filter, sort, paginate, toggle status, delete |
| `/preorders/create` | Create a new preorder |
| `/preorders/[id]/edit` | Edit an existing preorder |

---

## Features

- **List Page** — filter by status (All / Active / Inactive), sort by columns, paginate — all handled server-side
- **Select All / Row checkboxes** — check/uncheck individual or all visible rows
- **Status Toggle** — instantly switches Active ↔ Inactive with UI feedback
- **Delete** — removes record and refreshes list
- **Create / Edit Form** — shared form page, pre-filled in edit mode
- **Loading Spinner** — shown during save operations
- **Empty State** — displayed when no preorders exist

---

## Connecting to the Backend

Make sure the backend server is running first:

```bash
# In the backend folder
npm run dev   # runs on http://localhost:5000
```

Then start the frontend:

```bash
# In the frontend folder
npm run dev   # runs on http://localhost:3000
```

---

## Useful Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Notes

- The backend must be running before using the frontend
- All filtering, sorting, and pagination is done server-side via the backend API — not client-side
- For production, update `NEXT_PUBLIC_API_URL` in `.env.local` to your deployed backend URL