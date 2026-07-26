import React, { useEffect, useState } from 'react';
import { authService, bidService, listingService, Bid, formatCurrency, formatDateTime } from '@logistics-marketplace/shared';

const BidsPage: React.FC = () => {
  const [items, setItems] = useState<Bid[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const load = async () => {
      const organizationId = authService.getStoredUser()?.organizationId;
      if (!organizationId) { setError('Tài khoản chưa thuộc tổ chức shipper.'); return; }
      try {
        const listings = await listingService.getForShipper(organizationId);
        const groups = await Promise.all(listings.map((item) => bidService.getByListing(item.id)));
        setItems(groups.flat());
      } catch { setError('Không thể tải báo giá.'); }
    };
    void load();
  }, []);
  return <main className="shipper-page"><h1>Báo giá nhận được</h1>
    {error && <p role="alert">{error}</p>}
    {items.map((bid) => <article key={bid.id} className="listing-card">
      <h2>{formatCurrency(bid.proposedPriceAmount, bid.proposedPriceCurrency)}</h2>
      <p>Listing: {bid.listingId}</p><p>Carrier: {bid.carrierOrgId}</p>
      <p>{bid.status} · {formatDateTime(bid.createdAt)}</p>{bid.message && <p>{bid.message}</p>}
    </article>)}
    {!error && items.length === 0 && <p>Chưa có báo giá.</p>}
  </main>;
};
export default BidsPage;