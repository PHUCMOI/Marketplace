import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser, UserRole } from '@logistics-marketplace/shared';
import '../styles/pages.css';

const routeForRole = (role: UserRole) => role === UserRole.Shipper ? '/shipper' : role === UserRole.Carrier ? '/carrier' : role === UserRole.Dispatcher ? '/dispatcher' : '/';

export const HomePage: React.FC = () => {
  const user = useAuthUser();
  return (
  <div className="page-container home-page">
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Vietnam logistics network</span>
        <h1 className="hero-title">Move every load with confidence.</h1>
        <p className="hero-subtitle">One operations workspace for posting loads, comparing qualified bids and managing every dispatch through delivery.</p>
        <div className="hero-actions">
          {user ? (
            <Link to={routeForRole(user.role)} className="button button-primary">Open workspace</Link>
          ) : (
            <><Link to="/register" className="button button-primary">Start shipping</Link><Link to="/login" className="button button-secondary">Sign in to workspace</Link></>
          )}
        </div>
        <div className="trust-row"><span>Verified organizations</span><span>Live load board</span><span>Role-based workflows</span></div>
      </div>
      <div className="loadboard-preview" aria-label="Operations preview">
        <div className="preview-top"><span>Live load board</span><strong>24 open</strong></div>
        <div className="preview-filter"><span>Origin</span><b>Hà Nội</b><span>Destination</span><b>Toàn quốc</b></div>
        {[
          ['HN → HCM', 'Electronics · 2.4 t', '₫18.5M'],
          ['HP → ĐN', 'Container · 8.0 t', '₫24.2M'],
          ['BN → BD', 'Industrial · 5.5 t', '₫21.8M']
        ].map(([route, cargo, price]) => <div className="preview-load" key={route}><span className="route-dot"/><div><strong>{route}</strong><small>{cargo}</small></div><b>{price}</b></div>)}
      </div>
    </section>
    <section className="workspace-section">
      <div className="section-heading"><span className="eyebrow">Purpose-built workspaces</span><h2>One network, focused tools for every role</h2></div>
      <div className="features-grid">
        <article className="feature-card"><span className="feature-number">01</span><h3>Shipper</h3><p>Create listings, compare carrier bids and keep assigned loads moving.</p><Link to="/shipper" className="feature-link">Open shipper workspace <span>→</span></Link></article>
        <article className="feature-card"><span className="feature-number">02</span><h3>Carrier</h3><p>Search profitable routes, submit bids and coordinate fleet execution.</p><Link to="/carrier" className="feature-link">Open carrier workspace <span>→</span></Link></article>
        <article className="feature-card"><span className="feature-number">03</span><h3>Dispatcher</h3><p>Review demand, control assignments and monitor operational exceptions.</p><Link to="/dispatcher" className="feature-link">Open dispatch center <span>→</span></Link></article>
      </div>
    </section>
  </div>
  );
};
