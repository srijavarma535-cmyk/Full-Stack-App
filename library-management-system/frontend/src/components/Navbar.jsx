import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📚 Library System
      </Link>
      <ul className="navbar-nav">
        <li>
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/books" className={`nav-link ${isActive('/books')}`}>
            Books
          </Link>
        </li>
        <li>
          <Link to="/members" className={`nav-link ${isActive('/members')}`}>
            Members
          </Link>
        </li>
        <li>
          <Link to="/transactions" className={`nav-link ${isActive('/transactions')}`}>
            Transactions
          </Link>
        </li>
      </ul>
    </nav>
  );
}
