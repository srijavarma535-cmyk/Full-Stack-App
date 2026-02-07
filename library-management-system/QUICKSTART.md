# Quick Start Guide

## Prerequisites
- Node.js v16+ installed
- npm or yarn installed

## Installation

### Method 1: Automated Setup (Recommended)
```bash
chmod +x setup.sh
./setup.sh
```

### Method 2: Manual Setup
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Running the Application

### Option 1: Run Both Together
```bash
npm run dev
```
This starts both frontend (port 5173) and backend (port 3000) concurrently.

### Option 2: Run Separately

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

## Access Points

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000 (root endpoint)

## First Steps

1. **View Dashboard**: Navigate to http://localhost:5173
   - See statistics and sample data

2. **Add a Book**:
   - Go to "Books" page
   - Click "+ Add New Book"
   - Fill in the form (title, author, ISBN, category, copies)
   - Click "Add Book"

3. **Register a Member**:
   - Go to "Members" page
   - Click "+ Add New Member"
   - Fill in details (name, email, phone, address)
   - Click "Add Member"

4. **Borrow a Book**:
   - Go to "Books" page
   - Find an available book
   - Click "Borrow" button
   - Select a member from dropdown
   - Set due date (default 14 days)
   - Click "Borrow Book"

5. **Return a Book**:
   - Go to "Transactions" page
   - Find the borrowed book
   - Click "Return" button
   - Confirm the return

## Sample Data

The application comes with pre-loaded sample data:

**Books** (8 books including):
- The Great Gatsby
- To Kill a Mockingbird
- 1984
- Harry Potter and the Sorcerer's Stone
- And more...

**Members** (4 members):
- John Doe
- Jane Smith
- Bob Johnson
- Alice Williams

## Common Tasks

### Search for Books
Use the search bar on the Books page to search by title, author, or ISBN.

### Filter by Category
Use the category dropdown to filter books by genre (Fiction, Fantasy, Science Fiction, etc.).

### View Overdue Books
Check the Dashboard to see all overdue books at a glance.

### Check Member History
Click on a member to view their borrowing history (coming soon in detail view).

## Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use:
- Backend: Edit `backend/.env` and change `PORT=3000` to another port
- Frontend: Edit `frontend/vite.config.js` and change the server port

### Database Not Found
The database is created automatically on first run. If you have issues:
```bash
# Ensure database directory exists
mkdir -p database
```

### CORS Errors
Make sure both frontend and backend are running. The frontend is configured to proxy API requests to the backend.

## Development Tips

### Hot Reload
- Frontend: Changes are automatically reflected (Vite HMR)
- Backend: Server restarts automatically (nodemon)

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Get all books
curl http://localhost:3000/api/books

# Get statistics
curl http://localhost:3000/api/stats
```

### Database Reset
To reset the database with fresh sample data:
```bash
cd database
rm library.db
# Restart the backend - it will recreate the database
```

## Next Steps

1. Customize the sample data in `backend/src/config/database.js`
2. Add more features (book reservations, late fees, etc.)
3. Implement user authentication
4. Add email notifications for overdue books
5. Export reports (PDF, Excel)
6. Add book cover images

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review PROJECT_STRUCTURE.md for code organization
3. Check console logs for error messages
4. Ensure all dependencies are installed correctly

Enjoy using your Library Management System! 📚
