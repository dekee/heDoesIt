import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthContext';
import ComingSoon from './components/ComingSoon';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetail from './components/ProductDetail';
import ContactPage from './components/ContactPage';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}

// Set to true to show only the Coming Soon page
const COMING_SOON_MODE = false;

function AppContent() {
  const { user, isAdmin, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);

  if (COMING_SOON_MODE && location.pathname !== '/admin') {
    return (
      <Routes>
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <NotFound />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner container">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="He Does It!" className="logo-img" />
          </Link>
          <nav className={`app-nav ${menuOpen ? 'nav-open' : ''}`}>
            <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
            <NavLink to="/products" onClick={closeMenu}>Shop</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
            {isAdmin && <NavLink to="/admin" className="nav-admin" onClick={closeMenu}>Admin</NavLink>}
          </nav>
          <div className="header-right">
            <div className="auth-section">
              {user ? (
                <>
                  <span className="auth-user-name">{user.name}</span>
                  {isAdmin && <span className="badge badge-gold">Admin</span>}
                  <button className="btn btn-sm btn-secondary" onClick={logout}>Sign Out</button>
                </>
              ) : (
                <GoogleLogin
                  onSuccess={(response) => {
                    if (response.credential) {
                      login(response.credential).catch(() => {});
                    }
                  }}
                  onError={() => {}}
                  size="small"
                  theme="outline"
                />
              )}
            </div>
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img src="/logo.png" alt="He Does It!" style={{ height: '60px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
            <p>Artisan baked goods crafted with love</p>
          </div>
          <div className="footer-links">
            <Link to="/products">Shop</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-copy">
            <p>&copy; {new Date().getFullYear()} heDoesIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
