import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import {
  fetchAllProducts, createProduct, updateProduct, deleteProduct,
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchInquiries, markInquiryRead, deleteInquiry,
  fetchSubscribers, fetchAdminUsers, addAdminUser, removeAdminUser,
} from '../api';
import type { ProductResponse, CategoryResponse, ContactInquiryResponse, ProductRequest, CategoryRequest } from '../types';
import './AdminDashboard.css';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function parsePriceInput(value: string): number {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : Math.round(num * 100);
}

type Tab = 'products' | 'categories' | 'inquiries' | 'subscribers' | 'admins';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('products');

  if (!isAdmin) return <div className="container section"><p>Access denied.</p></div>;

  return (
    <div className="admin-dashboard section">
      <div className="container">
        <h2>Admin Dashboard</h2>
        <div className="divider" style={{ margin: 'var(--space-md) 0 var(--space-xl)' }} />

        <div className="admin-tabs">
          {(['products', 'categories', 'inquiries', 'subscribers', 'admins'] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'inquiries' && <InquiriesTab />}
        {activeTab === 'subscribers' && <SubscribersTab />}
        {activeTab === 'admins' && <AdminsTab />}
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductRequest>({ name: '', priceCents: 0, featured: false, active: true, displayOrder: 0 });
  const [priceInput, setPriceInput] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetchAllProducts().then(setProducts).catch(() => {});
    fetchCategories().then(setCategories).catch(() => {});
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm({ name: '', priceCents: 0, featured: false, active: true, displayOrder: 0 });
    setPriceInput('');
    setImageFile(undefined);
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (p: ProductResponse) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description ?? undefined, priceCents: p.priceCents, categoryId: p.categoryId ?? undefined, featured: p.featured, active: p.active, displayOrder: p.displayOrder });
    setPriceInput((p.priceCents / 100).toFixed(2));
    setImageFile(undefined);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, priceCents: parsePriceInput(priceInput) };
      if (editing) {
        await updateProduct(editing.id, data, imageFile);
      } else {
        await createProduct(data, imageFile);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deactivate this product?')) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h3>Products ({products.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>Add Product</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h4>{editing ? 'Edit Product' : 'New Product'}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input type="number" step="0.01" min="0" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.categoryId ?? ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : undefined })}>
                <option value="">No Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImageFile(e.target.files?.[0])} />
            </div>
            <div className="form-group" style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', paddingTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 0 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 0 }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Featured</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /> : '—'}</td>
                <td><strong>{p.name}</strong></td>
                <td>{p.categoryName ?? '—'}</td>
                <td>{formatPrice(p.priceCents)}</td>
                <td>{p.featured ? 'Yes' : 'No'}</td>
                <td>{p.active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => startEdit(p)}>Edit</button>{' '}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryRequest>({ name: '', displayOrder: 0 });

  const load = () => { fetchCategories().then(setCategories).catch(() => {}); };
  useEffect(load, []);

  const resetForm = () => { setForm({ name: '', displayOrder: 0 }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await updateCategory(editing.id, form); }
      else { await createCategory(form); }
      resetForm(); load();
    } catch (err) { alert(err instanceof Error ? err.message : 'Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h3>Categories</h3>
        <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>Add Category</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Order</label><input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></div>
          </div>
          <div className="form-group"><label>Description</label><textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button type="submit" className="btn btn-primary btn-sm">{editing ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Description</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.description ?? '—'}</td>
                <td>{c.displayOrder}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description ?? undefined, displayOrder: c.displayOrder }); setShowForm(true); }}>Edit</button>{' '}
                  <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) deleteCategory(c.id).then(load); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InquiriesTab() {
  const [inquiries, setInquiries] = useState<ContactInquiryResponse[]>([]);
  const load = () => { fetchInquiries().then(setInquiries).catch(() => {}); };
  useEffect(load, []);

  return (
    <div>
      <h3 style={{ marginBottom: 'var(--space-lg)' }}>Inquiries ({inquiries.length})</h3>
      {inquiries.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No inquiries yet.</p> : (
        <div className="inquiry-list">
          {inquiries.map((inq) => (
            <div key={inq.id} className={`inquiry-card ${inq.read ? 'read' : 'unread'}`}>
              <div className="inquiry-header">
                <strong>{inq.name}</strong> &lt;{inq.email}&gt;
                <span className="badge badge-teal">{inq.inquiryType}</span>
                {!inq.read && <span className="badge badge-gold">New</span>}
              </div>
              {inq.phone && <p className="inquiry-phone">Phone: {inq.phone}</p>}
              <p className="inquiry-message">{inq.message}</p>
              <div className="inquiry-actions">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(inq.createdAt).toLocaleString()}</span>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  {!inq.read && <button className="btn btn-sm btn-secondary" onClick={() => markInquiryRead(inq.id).then(load)}>Mark Read</button>}
                  <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) deleteInquiry(inq.id).then(load); }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<{ id: number; email: string; createdAt: string }[]>([]);
  useEffect(() => { fetchSubscribers().then(setSubscribers).catch(() => {}); }, []);

  return (
    <div>
      <h3 style={{ marginBottom: 'var(--space-lg)' }}>Email Subscribers ({subscribers.length})</h3>
      {subscribers.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No subscribers yet.</p> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Email</th><th>Subscribed</th></tr></thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id}><td>{s.email}</td><td>{new Date(s.createdAt).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminsTab() {
  const [admins, setAdmins] = useState<{ id: number; email: string; name: string; createdAt: string }[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const load = () => { fetchAdminUsers().then(setAdmins).catch(() => {}); };
  useEffect(load, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await addAdminUser({ email, name }); setEmail(''); setName(''); load(); }
    catch (err) { alert(err instanceof Error ? err.message : 'Failed'); }
  };

  return (
    <div>
      <h3 style={{ marginBottom: 'var(--space-lg)' }}>Admin Users</h3>
      <form className="admin-form" onSubmit={handleAdd} style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="form-row">
          <div className="form-group"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="form-group"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Add Admin</button>
      </form>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Since</th><th>Actions</th></tr></thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}><td>{a.name}</td><td>{a.email}</td><td>{new Date(a.createdAt).toLocaleDateString()}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Remove?')) removeAdminUser(a.id).then(load); }}>Remove</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
