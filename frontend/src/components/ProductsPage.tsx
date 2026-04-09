import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../api';
import type { ProductResponse, CategoryResponse } from '../types';
import ProductCard from './ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeCategory ? { category: activeCategory } : undefined)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="products-page section">
      <div className="container">
        <div className="section-title">
          <h2>Our Baked Goods</h2>
          <div className="divider" />
          <p>Made fresh, made with love</p>
        </div>

        {categories.length > 0 && (
          <div className="category-filters">
            <button
              className={`category-pill ${activeCategory === null ? 'active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-2xl)' }}>
            No products available yet. Check back soon!
          </p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
