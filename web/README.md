# Planning Poker Web Frontend

Nuxt 3 frontend for the Planning Poker application, providing a modern and responsive user interface for agile estimation sessions.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time updates with Socket.IO
- 📱 Responsive design
- 🎲 Interactive voting interface
- 📊 Real-time vote statistics
- 👥 Participant management

## Tech Stack

- Nuxt 3
- Vue 3
- TypeScript
- Tailwind CSS
- Socket.IO Client
- Nuxt Icon

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file:

   ```env
   NUXT_PUBLIC_WEB_SOCKET_URL=http://localhost:3001
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
web/
├── components/     # Reusable Vue components
├── composables/    # Shared composable functions
├── layouts/        # Page layouts
├── pages/         # Application pages
├── public/        # Static assets
└── types/         # TypeScript type definitions
```

## Key Components

- `JoinRoomForm`: User registration form
- `RoomHeader`: Room information and sharing
- `VoteSelection`: Voting interface
- `VoteResults`: Vote statistics display
- `ParticipantsList`: Real-time participant tracking
- `AdminControls`: Room management for admins

## Environment Variables

- `NUXT_PUBLIC_WEB_SOCKET_URL`: WebSocket server URL (required)

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Development Guidelines

- Use TypeScript for all new components and functions
- Follow Vue 3 Composition API patterns
- Maintain responsive design principles
- Keep components focused and reusable
