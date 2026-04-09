import { Link } from 'react-router-dom';
import type { ProductResponse } from '../types';
import './ProductCard.css';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductCard({ product }: { product: ProductResponse }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card card">
      <div className="product-card-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-placeholder">
            <span>No Image</span>
          </div>
        )}
        {product.featured && <span className="badge badge-gold product-badge">Featured</span>}
      </div>
      <div className="product-card-info">
        {product.categoryName && (
          <span className="product-card-category">{product.categoryName}</span>
        )}
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
