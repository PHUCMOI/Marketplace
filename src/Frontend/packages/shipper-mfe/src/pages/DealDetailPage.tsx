import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealService, Deal, DealStatus, formatCurrency, formatDateTime } from '@logistics-marketplace/shared';

const DealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); const navigate = useNavigate();
  const [item, setItem] = useState<Deal | null>(null); const [error, setError] = useState('');
  useEffect(() => { if (id) dealService.getById(id).then(setItem).catch(() => setError('Không thể tải deal.')); }, [id]);
  const cancel = async () => { if (!id || !window.confirm('Hủy deal này?')) return; try { await dealService.cancel(id); setItem((current) => current ? { ...current, status: DealStatus.Cancelled } : current); } catch { setError('Không thể hủy deal.'); } };
  if (!item) return <main className="shipper-page"><h1>Deal</h1><p>{error || 'Đang tải...'}</p></main>;
  return <main className="shipper-page"><h1>Chi tiết deal</h1>{error && <p role="alert">{error}</p>}
    <dl><dt>Listing</dt><dd>{item.listingId}</dd><dt>Bid</dt><dd>{item.acceptedBidId}</dd><dt>Carrier</dt><dd>{item.carrierOrgId}</dd><dt>Giá</dt><dd>{formatCurrency(item.agreedPriceAmount, item.agreedPriceCurrency)}</dd><dt>Trạng thái</dt><dd>{item.status}</dd><dt>Tạo lúc</dt><dd>{formatDateTime(item.createdAt)}</dd></dl>
    {item.status === DealStatus.Active && <button onClick={() => void cancel()}>Hủy deal</button>} <button onClick={() => navigate('../')}>Quay lại</button>
  </main>;
};
export default DealDetailPage;