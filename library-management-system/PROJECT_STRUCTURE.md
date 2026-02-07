# Library Management System - Project Structure

## Complete Folder and File Structure

```
library-management-system/
│
├── README.md                      # Main documentation
├── package.json                   # Root package.json for monorepo
├── .gitignore                     # Git ignore rules
├── setup.sh                       # Installation script
│
├── backend/                       # Backend Node.js/Express API
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables
│   │
│   └── src/
│       ├── server.js             # Main server entry point
│       │
│       ├── config/
│       │   └── database.js       # Database configuration & initialization
│       │
│       ├── controllers/
│       │   ├── bookController.js       # Book CRUD operations
│       │   ├── memberController.js     # Member CRUD operations
│       │   ├── transactionController.js # Transaction management
│       │   └── statsController.js      # Dashboard statistics
│       │
│       ├── routes/
│       │   ├── books.js          # Book routes
│       │   ├── members.js        # Member routes
│       │   ├── transactions.js   # Transaction routes
│       │   └── stats.js          # Statistics routes
│       │
│       └── models/               # (Optional) Model definitions
│
├── frontend/                      # Frontend React application
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── index.html                # HTML entry point
│   │
│   ├── public/
│   │   └── library-icon.svg      # Application favicon
│   │
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Main App component with routing
│       ├── index.css             # Global styles
│       │
│       ├── components/
│       │   ├── Navbar.jsx        # Navigation bar component
│       │   └── Modal.jsx         # Reusable modal component
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx     # Dashboard page
│       │   ├── Books.jsx         # Books management page
│       │   ├── Members.jsx       # Members management page
│       │   └── Transactions.jsx  # Transactions page
│       │
│       └── services/
│           └── api.js            # API service layer (Axios)
│
└── database/
    └── library.db                # SQLite database (auto-generated)
```

## File Descriptions

### Root Level

- **README.md**: Complete documentation with setup instructions, features, API endpoints
- **package.json**: Workspace configuration for running frontend and backend together
- **.gitignore**: Excludes node_modules, database files, build outputs
- **setup.sh**: Automated installation script

### Backend (`/backend`)

#### Main Files
- **src/server.js**: Express server setup, middleware, route mounting, error handling
- **.env**: Environment configuration (PORT, DB_PATH)

#### Configuration (`/backend/src/config`)
- **database.js**: SQLite connection, table creation, sample data insertion

#### Controllers (`/backend/src/controllers`)
- **bookController.js**: 
  - `getAllBooks()` - Get all books with search/filter
  - `getBookById()` - Get single book
  - `addBook()` - Add new book
  - `updateBook()` - Update book details
  - `deleteBook()` - Delete book
  - `getCategories()` - Get unique categories

- **memberController.js**:
  - `getAllMembers()` - Get all members with search
  - `getMemberById()` - Get member with transaction history
  - `addMember()` - Register new member
  - `updateMember()` - Update member details
  - `deleteMember()` - Delete member

- **transactionController.js**:
  - `getAllTransactions()` - Get all transactions
  - `borrowBook()` - Issue book to member
  - `returnBook()` - Process book return
  - `getOverdueBooks()` - Get overdue transactions
  - `getTransactionById()` - Get single transaction

- **statsController.js**:
  - `getStats()` - Get dashboard statistics (totals, recent, popular)

#### Routes (`/backend/src/routes`)
- **books.js**: Book API endpoints
- **members.js**: Member API endpoints
- **transactions.js**: Transaction API endpoints
- **stats.js**: Statistics API endpoints

### Frontend (`/frontend`)

#### Configuration
- **vite.config.js**: Vite dev server config with API proxy
- **index.html**: HTML template with root div

#### Main Files (`/frontend/src`)
- **main.jsx**: ReactDOM render setup
- **App.jsx**: Router setup with route definitions
- **index.css**: Complete CSS styling (responsive, modern design)

#### Components (`/frontend/src/components`)
- **Navbar.jsx**: Navigation bar with active route highlighting
- **Modal.jsx**: Reusable modal for forms and dialogs

#### Pages (`/frontend/src/pages`)
- **Dashboard.jsx**: 
  - Stats cards (total books, members, borrowed, overdue)
  - Overdue books table
  - Recent transactions
  - Popular books

- **Books.jsx**:
  - Book listing with search and category filter
  - Add new book modal
  - Borrow book modal with member selection
  - Delete book functionality
  - Availability display

- **Members.jsx**:
  - Member listing with search
  - Add new member modal
  - Activate/deactivate members
  - Delete member functionality

- **Transactions.jsx**:
  - Transaction listing with status filter
  - Return book functionality
  - Overdue indicators
  - Days remaining/overdue calculation

#### Services (`/frontend/src/services`)
- **api.js**: 
  - Axios instance configuration
  - API endpoint functions for books, members, transactions, stats
  - Centralized API base URL

### Database (`/database`)

- **library.db**: SQLite database (auto-created on first run)
  - Tables: books, members, transactions
  - Sample data included

## Database Schema

### Books Table
```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE NOT NULL,
  category TEXT,
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Members Table
```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  membership_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
)
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_date DATETIME NOT NULL,
  return_date DATETIME,
  status TEXT DEFAULT 'borrowed',
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
)
```

## API Endpoints

### Books
- `GET /api/books` - List books
- `GET /api/books/:id` - Get book
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/categories` - List categories

### Members
- `GET /api/members` - List members
- `GET /api/members/:id` - Get member
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Transactions
- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction
- `POST /api/transactions/borrow` - Borrow book
- `POST /api/transactions/return/:id` - Return book
- `GET /api/transactions/overdue` - List overdue

### Stats
- `GET /api/stats` - Dashboard statistics

## Technology Stack

### Backend
- Node.js
- Express.js 4.18
- SQLite3 5.1
- CORS
- dotenv

### Frontend
- React 18
- React Router DOM 6
- Axios 1.6
- Vite 5

## Key Features Implemented

1. **Book Management**: Full CRUD operations
2. **Member Management**: Registration, status management
3. **Transaction System**: Borrow and return workflows
4. **Search & Filter**: Real-time search and category filtering
5. **Dashboard**: Statistics and analytics
6. **Overdue Tracking**: Automatic overdue detection
7. **Validation**: Input validation and error handling
8. **Responsive Design**: Mobile-friendly interface
9. **Sample Data**: Pre-populated with example records

## Running the Application

1. Install dependencies: `./setup.sh` or `npm run install-all`
2. Start development: `npm run dev`
3. Access: http://localhost:5173
