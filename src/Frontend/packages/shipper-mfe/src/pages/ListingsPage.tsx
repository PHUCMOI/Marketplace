import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, listingService, Listing, formatDate, formatWeight } from '@logistics-marketplace/shared';

const ListingsPage: React.FC = () => {
  const [items, setItems] = useState<Listing[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const organizationId = authService.getStoredUser()?.organizationId;
    if (!organizationId) { setError('Tài khoản chưa thuộc tổ chức shipper.'); return; }
    listingService.getForShipper(organizationId).then(setItems).catch(() => setError('Không thể tải listings.'));
  }, []);
  return <main className="shipper-page">
    <header><h1>Listings</h1><Link to="create">Tạo listing</Link></header>
    {error && <p role="alert">{error}</p>}
    <div className="listing-grid">{items.map((item) => <article key={item.id} className="listing-card">
      <h2><Link to={item.id}>{item.cargoDescription}</Link></h2>
      <p>{item.pickupLocationId} → {item.deliveryLocationId}</p>
      <p>{formatWeight(item.weight)} · Pickup {formatDate(item.pickupDate)}</p>
      <p>Trạng thái: {item.status}</p>
    </article>)}</div>
    {!error && items.length === 0 && <p>Chưa có listing.</p>}
  </main>;
};
export default ListingsPage;