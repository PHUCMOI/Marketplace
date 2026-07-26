import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, dealService, Deal, formatCurrency, formatDateTime } from '@logistics-marketplace/shared';

const DealsPage: React.FC = () => {
  const [items, setItems] = useState<Deal[]>([]); const [error, setError] = useState('');
  useEffect(() => { const organizationId = authService.getStoredUser()?.organizationId; if (!organizationId) { setError('Tài khoản chưa thuộc tổ chức shipper.'); return; } dealService.getForShipper(organizationId).then(setItems).catch(() => setError('Không thể tải deals.')); }, []);
  return <main className="shipper-page"><h1>Deals</h1>{error && <p role="alert">{error}</p>}
    {items.map((item) => <article key={item.id} className="listing-card"><h2><Link to={item.id}>{formatCurrency(item.agreedPriceAmount, item.agreedPriceCurrency)}</Link></h2><p>Listing: {item.listingId}</p><p>Carrier: {item.carrierOrgId}</p><p>{item.status} · {formatDateTime(item.createdAt)}</p></article>)}
    {!error && items.length === 0 && <p>Chưa có deal.</p>}
  </main>;
};
export default DealsPage;