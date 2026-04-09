import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import type { ProductResponse } from '../types';
import ProductCard from './ProductCard';
import './HomePage.css';

export default function HomePage() {
  const [featured, setFeatured] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ featured: true })
      .then(setFeatured)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <img src="/logo.png" alt="He Does It!" className="hero-logo" />
          <p className="hero-subtitle">Artisan baked goods crafted with love</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-gold">Shop Now</Link>
            <Link to="/contact" className="btn btn-secondary" style={{ borderColor: 'rgba(253,248,240,0.4)', color: 'var(--color-cream)' }}>Get in Touch</Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Featured Treats</h2>
              <div className="divider" />
              <p>Our most loved creations</p>
            </div>
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
              <Link to="/products" className="btn btn-secondary">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {loading && featured.length === 0 && (
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        </section>
      )}

      <section className="about-section section">
        <div className="container about-content">
          <div className="about-text">
            <h2>Baked with Passion</h2>
            <div className="divider" style={{ margin: 'var(--space-md) 0' }} />
            <p>
              Every item that leaves our kitchen is crafted with the finest ingredients
              and a whole lot of love. From classic favorites to creative new flavors,
              we bake everything from scratch to bring you the best.
            </p>
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
              Place a Custom Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
