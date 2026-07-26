import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, listingService } from '@logistics-marketplace/shared';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ pickupLocationId: '', deliveryLocationId: '', pickupDate: '', deliveryDate: '', cargoDescription: '', weight: '', priceAmount: '', priceCurrency: 'VND' });
  const [error, setError] = useState('');
  const change = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const shipperOrgId = authService.getStoredUser()?.organizationId;
    if (!shipperOrgId) { setError('Tài khoản chưa thuộc tổ chức shipper.'); return; }
    try {
      const item = await listingService.create({
        shipperOrgId, pickupLocationId: form.pickupLocationId, deliveryLocationId: form.deliveryLocationId,
        pickupDate: new Date(form.pickupDate).toISOString(), deliveryDate: new Date(form.deliveryDate).toISOString(),
        cargoDescription: form.cargoDescription, weight: Number(form.weight),
        priceAmount: form.priceAmount ? Number(form.priceAmount) : undefined, priceCurrency: form.priceCurrency
      });
      navigate(`../listings/${item.id}`);
    } catch { setError('Không thể tạo listing. Hãy kiểm tra UUID địa điểm và dữ liệu nhập.'); }
  };
  return <main className="shipper-page"><h1>Tạo listing</h1>{error && <p role="alert">{error}</p>}
    <form onSubmit={submit} className="listing-form">
      <label>Pickup location UUID<input required value={form.pickupLocationId} onChange={(e) => change('pickupLocationId', e.target.value)} /></label>
      <label>Delivery location UUID<input required value={form.deliveryLocationId} onChange={(e) => change('deliveryLocationId', e.target.value)} /></label>
      <label>Pickup date<input required type="datetime-local" value={form.pickupDate} onChange={(e) => change('pickupDate', e.target.value)} /></label>
      <label>Delivery date<input required type="datetime-local" value={form.deliveryDate} onChange={(e) => change('deliveryDate', e.target.value)} /></label>
      <label>Mô tả hàng<textarea required value={form.cargoDescription} onChange={(e) => change('cargoDescription', e.target.value)} /></label>
      <label>Khối lượng (kg)<input required min="0.01" type="number" value={form.weight} onChange={(e) => change('weight', e.target.value)} /></label>
      <label>Giá dự kiến<input min="0" type="number" value={form.priceAmount} onChange={(e) => change('priceAmount', e.target.value)} /></label>
      <label>Tiền tệ<input value={form.priceCurrency} onChange={(e) => change('priceCurrency', e.target.value.toUpperCase())} /></label>
      <button type="submit">Tạo và publish</button>
    </form>
  </main>;
};
export default CreateListingPage;