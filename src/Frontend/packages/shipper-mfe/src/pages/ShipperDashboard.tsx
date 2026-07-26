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
        const [listings, deals] = await Promise.all([listingService.getForShipper(organizationId), dealService.getForShipper(organizationId)]);
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

  const cards = [
    { label: 'Total listings', value: stats.listings, note: 'All marketplace records', tone: 'navy' },
    { label: 'Open on load board', value: stats.open, note: 'Visible to qualified carriers', tone: 'green' },
    { label: 'Carrier bids', value: stats.bids, note: 'Review price and availability', tone: 'amber' },
    { label: 'Assigned loads', value: stats.activeDeals, note: 'Currently in execution', tone: 'blue' }
  ];

  return <main className="shipper-page">
    <header className="ops-page-header">
      <div><span className="ops-eyebrow">Shipper workspace</span><h1>Operations overview</h1><p>Monitor marketplace demand and keep every assigned load on schedule.</p></div>
      <Link className="ops-primary-action" to="listings/create">+ Create load</Link>
    </header>
    {error && <p className="ops-alert" role="alert">{error}</p>}
    <section className="ops-summary-strip"><div><span>Marketplace status</span><strong><i/> Accepting carrier bids</strong></div><div><span>Next action</span><strong>{stats.bids > 0 ? 'Review incoming bids' : 'Publish a new listing'}</strong></div><Link to="listings">Manage listings →</Link></section>
    <section className="stats-grid">{cards.map((card) => <article className={`ops-stat-card ${card.tone}`} key={card.label}><span>{card.label}</span><strong>{card.value}</strong><small>{card.note}</small></article>)}</section>
    <section className="dashboard-columns">
      <article className="ops-panel"><header><div><span className="ops-eyebrow">Workflow</span><h2>Quick actions</h2></div></header><div className="quick-action-list"><Link to="listings/create"><span className="action-index">01</span><span><strong>Post a load</strong><small>Add route, timing, cargo and target price</small></span><b>→</b></Link><Link to="bids"><span className="action-index">02</span><span><strong>Compare carrier bids</strong><small>Review price and carrier response</small></span><b>→</b></Link><Link to="deals"><span className="action-index">03</span><span><strong>Track assigned loads</strong><small>Follow active deals through completion</small></span><b>→</b></Link></div></article>
      <article className="ops-panel performance-panel"><header><div><span className="ops-eyebrow">Network health</span><h2>Listing performance</h2></div></header><div className="performance-ring" style={{ '--progress': `${stats.listings ? Math.round((stats.open / stats.listings) * 100) : 0}%` } as React.CSSProperties}><strong>{stats.listings ? Math.round((stats.open / stats.listings) * 100) : 0}%</strong><span>open listings</span></div><p>Keep pickup dates and target prices current to improve carrier response.</p></article>
    </section>
  </main>;
};
export default ShipperDashboard;
