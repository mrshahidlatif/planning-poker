# Planning Poker Server

Socket.IO server for the Planning Poker application, handling real-time communication between participants.

## Features

- Real-time room management
- Vote collection and synchronization
- Admin controls validation
- Vote statistics calculation

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The server will start on port 3001 by default.

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001                    # Server port (optional, defaults to 3001)
CORS_ORIGIN=http://localhost:3000  # Frontend URL for CORS
```

## API Documentation

### Socket Events

#### Client -> Server

- `join-room`: Join a planning poker room

  ```typescript
  {
    roomId: string;
    name: string;
    adminToken?: string;
  }
  ```

- `vote`: Submit a vote

  ```typescript
  {
    roomId: string;
    name: string;
    vote: number | "?";
  }
  ```

- `reveal`: Reveal all votes (admin only)

  ```typescript
  {
    roomId: string;
    adminToken: string;
  }
  ```

- `reset`: Reset the room for new voting (admin only)
  ```typescript
  {
    roomId: string;
    adminToken: string;
  }
  ```

#### Server -> Client

- `room-state`: Current state of the room

  ```typescript
  {
    users: Record<string, User>;
    votesRevealed: boolean;
    adminToken?: string;
  }
  ```

- `error`: Error message
  ```typescript
  {
    message: string;
  }
  ```

## Error Handling

The server implements comprehensive error handling for:

- Invalid room IDs
- Unauthorized admin actions
- Connection issues
- Invalid vote values
