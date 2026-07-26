import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, bidService, dealService, listingService, DealStatus, ListingStatus } from '@logistics-marketplace/shared';

interface Stats { listings: number; open: number; bids: number; activeDeals: number; }

const ShipperDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ listings: 0, open: 0, bids: 0, activeDeals: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const organizationId = authService.getStoredUser()?.organizationId;
      if (!organizationId) { setError('Tài khoản chưa thuộc tổ chức shipper.'); return; }
      try {
        const [listings, deals] = await Promise.all([
          listingService.getForShipper(organizationId),
          dealService.getForShipper(organizationId)
        ]);
        const bidGroups = await Promise.all(listings.map((item) => bidService.getByListing(item.id)));
        setStats({
          listings: listings.length,
          open: listings.filter((item) => item.status === ListingStatus.Open).length,
          bids: bidGroups.reduce((sum, group) => sum + group.length, 0),
          activeDeals: deals.filter((item) => item.status === DealStatus.Active).length
        });
      } catch { setError('Không thể tải dữ liệu tổng quan.'); }
    };
    void load();
  }, []);

  return <main className="shipper-page">
    <h1>Shipper dashboard</h1>
    {error && <p role="alert">{error}</p>}
    <section className="stats-grid">
      <article><strong>{stats.listings}</strong><span> Listings</span></article>
      <article><strong>{stats.open}</strong><span> Đang mở</span></article>
      <article><strong>{stats.bids}</strong><span> Báo giá</span></article>
      <article><strong>{stats.activeDeals}</strong><span> Deal đang chạy</span></article>
    </section>
    <p><Link to="listings/create">Tạo listing</Link> · <Link to="listings">Quản lý listings</Link> · <Link to="deals">Theo dõi deals</Link></p>
  </main>;
};
export default ShipperDashboard;