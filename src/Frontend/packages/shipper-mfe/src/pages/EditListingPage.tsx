import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listingService } from '@logistics-marketplace/shared';

const localDate = (value: string) => value.slice(0, 16);
const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ pickupDate: '', deliveryDate: '', cargoDescription: '', weight: '', priceAmount: '', priceCurrency: 'VND' });
  const [error, setError] = useState('');
  useEffect(() => {
    if (!id) return;
    listingService.getById(id).then((item) => setForm({ pickupDate: localDate(item.pickupDate), deliveryDate: localDate(item.deliveryDate), cargoDescription: item.cargoDescription, weight: String(item.weight), priceAmount: item.priceAmount ? String(item.priceAmount) : '', priceCurrency: item.priceCurrency ?? 'VND' })).catch(() => setError('Không thể tải listing.'));
  }, [id]);
  const change = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!id) return;
    try {
      await listingService.update(id, { pickupDate: new Date(form.pickupDate).toISOString(), deliveryDate: new Date(form.deliveryDate).toISOString(), cargoDescription: form.cargoDescription, weight: Number(form.weight), priceAmount: form.priceAmount ? Number(form.priceAmount) : undefined, priceCurrency: form.priceCurrency });
      navigate(`../${id}`);
    } catch { setError('Không thể cập nhật listing.'); }
  };
  return <main className="shipper-page"><h1>Sửa listing</h1>{error && <p role="alert">{error}</p>}
    <form onSubmit={submit} className="listing-form">
      <label>Pickup date<input required type="datetime-local" value={form.pickupDate} onChange={(e) => change('pickupDate', e.target.value)} /></label>
      <label>Delivery date<input required type="datetime-local" value={form.deliveryDate} onChange={(e) => change('deliveryDate', e.target.value)} /></label>
      <label>Mô tả hàng<textarea required value={form.cargoDescription} onChange={(e) => change('cargoDescription', e.target.value)} /></label>
      <label>Khối lượng (kg)<input required min="0.01" type="number" value={form.weight} onChange={(e) => change('weight', e.target.value)} /></label>
      <label>Giá dự kiến<input min="0" type="number" value={form.priceAmount} onChange={(e) => change('priceAmount', e.target.value)} /></label>
      <label>Tiền tệ<input value={form.priceCurrency} onChange={(e) => change('priceCurrency', e.target.value.toUpperCase())} /></label>
      <button type="submit">Lưu</button>
    </form>
  </main>;
};
export default EditListingPage;