# Bible Verses

A modern web application for reading, searching, and studying Bible verses with daily devotionals and reading plans.

## Features

- 📖 **Verse of the Day**: Start each day with a meaningful Bible verse
- 🔍 **Search**: Search for verses by keyword or phrase
- 📚 **Browse Bible**: Read the Bible by book and chapter
- 📅 **Reading Plans**: Structured Bible reading plans
- ❤️ **Favorites**: Save your favorite verses
- 🎨 **Modern UI**: Clean, dark-mode aesthetic with shadcn/ui components

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (dark mode)
- **shadcn/ui** (UI components)
- **Bible API** (bible-api.com - free, no authentication required)
- **Lucide Icons**

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bible-verses/
├── app/
│   ├── api/
│   │   └── bible/
│   │       ├── verse/
│   │       │   └── route.ts          # Get specific verse
│   │       ├── search/
│   │       │   └── route.ts          # Search verses
│   │       ├── books/
│   │       │   └── route.ts          # List all books
│   │       ├── chapter/
│   │       │   └── route.ts          # Get chapter
│   │       └── daily/
│   │           └── route.ts          # Verse of the day
│   ├── browse/
│   │   └── page.tsx                  # Browse by book/chapter
│   ├── search/
│   │   └── page.tsx                  # Search page
│   ├── plans/
│   │   └── page.tsx                  # Reading plans
│   ├── favorites/
│   │   └── page.tsx                  # Saved verses
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                       # Verse of the day (home)
│   └── globals.css                    # Global styles
├── components/
│   ├── ui/                            # shadcn/ui components
│   ├── app-shell.tsx                  # Main app shell
│   ├── app-sidebar.tsx                # Navigation sidebar
│   ├── app-topbar.tsx                 # Top navigation bar
│   └── copy-button.tsx                # Copy utility
└── lib/
    ├── types.ts                       # TypeScript types
    ├── storage.ts                     # Local storage utilities
    └── utils.ts                       # Utility functions
```

## Usage

1. **Verse of the Day**: View the daily verse on the home page
2. **Search**: Use the search page to find verses by keyword
3. **Browse**: Navigate through books and chapters
4. **Reading Plans**: Start a structured reading plan
5. **Favorites**: Save verses you love for quick access

## Bible API

The app uses [bible-api.com](https://bible-api.com), a free REST API that requires no authentication. It supports multiple translations:

- **KJV** (King James Version) - Default
- **ASV** (American Standard Version)
- **WEB** (World English Bible)
- **YLT** (Young's Literal Translation)

## Features

- **No API Key Required**: Uses free, public Bible API
- **Multiple Translations**: Switch between different Bible versions
- **Local Storage**: Favorites are saved in browser storage
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode**: Beautiful dark theme optimized for reading

## License

MIT
