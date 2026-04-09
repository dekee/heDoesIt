import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../api';
import type { ProductResponse } from '../types';
import './ProductDetail.css';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProduct(Number(id))
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container section" style={{ textAlign: 'center' }}><p>Loading...</p></div>;
  }

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="product-detail section">
      <div className="container">
        <Link to="/products" className="back-link">&larr; Back to Shop</Link>
        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="product-detail-placeholder">No Image Available</div>
            )}
          </div>
          <div className="product-detail-info">
            {product.categoryName && (
              <span className="badge badge-teal">{product.categoryName}</span>
            )}
            <h1>{product.name}</h1>
            <p className="product-detail-price">{formatPrice(product.priceCents)}</p>
            {product.description && (
              <p className="product-detail-desc">{product.description}</p>
            )}
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
              Inquire About This Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
