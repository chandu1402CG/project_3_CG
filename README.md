# Full Stack Application

A complete full stack application with a React/Vite frontend and Node.js/Express backend.

## Project Structure

```
project_3/
├── frontend/            # React/Vite frontend
│   ├── public/          # Static assets
│   └── src/             # Source code
│       ├── assets/      # Frontend assets
│       └── services/    # API services
├── backend/             # Node.js/Express backend
│   ├── routes/          # API routes
│   └── server.js        # Express server
```

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Getting Started

### Setting Up the Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The backend server will run on http://localhost:5000.

### Setting Up the Frontend

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend application will run on http://localhost:5173.

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a single item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item by ID
- `DELETE /api/items/:id` - Delete an item by ID

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- Fetch API

### Backend
- Node.js
- Express.js
- Cors (for cross-origin support)
- Morgan (for HTTP request logging)
- dotenv (for environment variables)

## Development

For local development, run both the frontend and backend simultaneously using separate terminal windows.

## License

MIT
