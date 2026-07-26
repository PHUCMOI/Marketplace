import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { listingService, ListingDetail, ListingStatus, formatCurrency, formatDateTime, formatWeight } from '@logistics-marketplace/shared';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); const navigate = useNavigate();
  const [item, setItem] = useState<ListingDetail | null>(null); const [error, setError] = useState('');
  const load = () => { if (id) listingService.getById(id).then(setItem).catch(() => setError('Không thể tải listing.')); };
  useEffect(load, [id]);
  const award = async (bidId: string) => { if (!id || !window.confirm('Chấp nhận báo giá này?')) return; try { await listingService.award(id, bidId); load(); } catch { setError('Không thể award báo giá.'); } };
  const remove = async () => { if (!id || !window.confirm('Xóa listing này?')) return; try { await listingService.remove(id); navigate('../'); } catch { setError('Chỉ có thể xóa listing chưa được award.'); } };
  if (!item) return <main className="shipper-page"><h1>Listing</h1><p>{error || 'Đang tải...'}</p></main>;
  return <main className="shipper-page"><header><h1>{item.cargoDescription}</h1><p><Link to="edit">Sửa</Link> · <button onClick={remove}>Xóa</button></p></header>
    {error && <p role="alert">{error}</p>}
    <p>{item.pickupLocationId} → {item.deliveryLocationId}</p>
    <p>{formatWeight(item.weight)} · {formatDateTime(item.pickupDate)} → {formatDateTime(item.deliveryDate)}</p>
    <p>Trạng thái: {item.status}{item.priceAmount !== undefined && ` · ${formatCurrency(item.priceAmount, item.priceCurrency)}`}</p>
    <h2>Báo giá ({item.bidsCount})</h2>
    {item.bids.map((bid) => <article key={bid.id} className="listing-card"><strong>{formatCurrency(bid.proposedPriceAmount, bid.proposedPriceCurrency)}</strong><p>Carrier: {bid.carrierOrgId}</p><p>{bid.status}</p>{bid.message && <p>{bid.message}</p>}{item.status === ListingStatus.Open && <button onClick={() => void award(bid.id)}>Award</button>}</article>)}
    {item.bids.length === 0 && <p>Chưa có báo giá.</p>}
  </main>;
};
export default ListingDetailPage;