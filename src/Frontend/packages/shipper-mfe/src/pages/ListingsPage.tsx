import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, listingService, Listing, formatDate, formatWeight, formatCurrency } from '@logistics-marketplace/shared';

const ListingsPage: React.FC = () => {
  const [items, setItems] = useState<Listing[]>([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  useEffect(() => {
    const organizationId = authService.getStoredUser()?.organizationId;
    if (!organizationId) { setError('Tài khoản chưa thuộc tổ chức shipper.'); return; }
    listingService.getForShipper(organizationId).then(setItems).catch(() => setError('Không thể tải listings.'));
  }, []);
  const statuses = useMemo(() => Array.from(new Set(items.map((item) => item.status))), [items]);
  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.cargoDescription} ${item.pickupLocationId} ${item.deliveryLocationId}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === 'all' || item.status === status);
  }), [items, query, status]);

  return <main className="shipper-page">
    <header className="ops-page-header"><div><span className="ops-eyebrow">Load management</span><h1>Manage listings</h1><p>Search, monitor and update every load posted to the marketplace.</p></div><Link className="ops-primary-action" to="create">+ Create load</Link></header>
    {error && <p className="ops-alert" role="alert">{error}</p>}
    <section className="load-toolbar"><label><span>Search listings</span><input type="search" placeholder="Cargo, origin or destination" value={query} onChange={(e) => setQuery(e.target.value)}/></label><label><span>Listing status</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{statuses.map((value) => <option value={value} key={value}>{value}</option>)}</select></label><div className="results-count"><strong>{filtered.length}</strong><span>loads shown</span></div></section>
    <section className="load-board">
      <div className="load-board-head"><span>Load / cargo</span><span>Route</span><span>Schedule</span><span>Weight</span><span>Target rate</span><span>Status</span><span /></div>
      {filtered.map((item) => <article className="load-row" key={item.id}>
        <div className="load-identity"><span className="load-id">#{item.id.slice(0, 8)}</span><strong>{item.cargoDescription}</strong></div>
        <div className="route-cell"><span>{item.pickupLocationId}</span><i /><span>{item.deliveryLocationId}</span></div>
        <div className="schedule-cell"><span>Pickup {formatDate(item.pickupDate)}</span><span>Deliver {formatDate(item.deliveryDate)}</span></div>
        <strong>{formatWeight(item.weight)}</strong>
        <strong className="rate-cell">{item.priceAmount !== undefined ? formatCurrency(item.priceAmount, item.priceCurrency) : 'Open bid'}</strong>
        <span className={`status-pill status-${String(item.status).toLowerCase()}`}>{item.status}</span>
        <Link className="row-action" to={item.id}>View →</Link>
      </article>)}
      {!error && filtered.length === 0 && <div className="ops-empty"><strong>No matching listings</strong><p>Adjust your filters or create a new load for the marketplace.</p><Link to="create">Create load</Link></div>}
    </section>
  </main>;
};
export default ListingsPage;
