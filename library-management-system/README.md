# Library Management System

A full-stack library management application with React frontend, Node.js/Express backend, and SQLite database.

## Features

- **Book Management**: Add, edit, delete, and search books
- **Member Management**: Manage library members
- **Borrowing System**: Issue and return books
- **Dashboard**: View statistics and overdue books
- **Search & Filter**: Advanced search functionality
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Modern CSS with responsive design

### Backend
- Node.js
- Express.js
- SQLite3 database
- RESTful API architecture
- CORS enabled

### Database
- SQLite (can be easily migrated to PostgreSQL)
- Tables: books, members, transactions

## Project Structure

```
library-management-system/
├── frontend/               # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/               # Express backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── config/        # Configuration files
│   │   └── server.js      # Entry point
│   └── package.json
│
└── database/              # Database files
    └── library.db         # SQLite database (auto-generated)
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Step 2: Start the Application

#### Option A: Run Both (Recommended)
```bash
# From root directory
npm run dev
```

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Add new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/borrow` - Borrow a book
- `POST /api/transactions/return/:id` - Return a book
- `GET /api/transactions/overdue` - Get overdue books

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Database Schema

### Books Table
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- author (TEXT)
- isbn (TEXT UNIQUE)
- category (TEXT)
- total_copies (INTEGER)
- available_copies (INTEGER)
- created_at (DATETIME)

### Members Table
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- phone (TEXT)
- address (TEXT)
- membership_date (DATETIME)
- status (TEXT)

### Transactions Table
- id (INTEGER PRIMARY KEY)
- book_id (INTEGER)
- member_id (INTEGER)
- borrow_date (DATETIME)
- due_date (DATETIME)
- return_date (DATETIME)
- status (TEXT)

## Usage

1. **Add Books**: Navigate to "Books" and click "Add New Book"
2. **Register Members**: Go to "Members" and add library members
3. **Borrow Books**: Use the "Borrow" button on available books
4. **Return Books**: Mark books as returned from the transactions list
5. **View Dashboard**: See statistics and overdue books

## Development

### Adding New Features
1. Backend: Add routes in `backend/src/routes/`
2. Backend: Add controllers in `backend/src/controllers/`
3. Frontend: Add components in `frontend/src/components/`
4. Frontend: Update API calls in `frontend/src/services/`

### Database Modifications
Edit `backend/src/config/database.js` to modify schema

## Production Build

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
# Serve them with the backend or any static file server
```

## License

MIT

## Author

Built with Claude
