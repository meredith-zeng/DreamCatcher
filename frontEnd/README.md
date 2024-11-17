# LucidLens

LucidLens is a Next.js application that transforms your dreams into stunning AI-generated artwork while providing deep psychological insights through dream analysis.

## Features

- 🧠 AI Dream Analysis - Advanced algorithms analyze your dreams for deeper psychological insights
- 🔍 Dream Patterns - Discover recurring themes and symbols in your dream journal
- 🎨 Visual Dreams - Transform written dreams into stunning AI-generated artwork
- 💬 Dream Sharing - Share your dreams with friends and family for collaborative analysis

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with GitHub provider
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animation**: Framer Motion
- **State Management**: SWR for server state
- **UI Components**: 
  - Radix UI primitives
  - Vaul for drawers
  - Lucide icons

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Follow the Auth.js tutorial here: https://authjs.dev/guides/configuring-github to create your credentials.

```env
NEXT_PUBLIC_API_URL=your_api_url
# Add GitHub OAuth credentials
AUTH_SECRET=auth_js_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and server actions
- `/types` - TypeScript type definitions

## Authentication

The application uses NextAuth.js with GitHub authentication. Users need to sign in to:
- Create dream entries
- Access their dream gallery
- Share dreams with others

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
