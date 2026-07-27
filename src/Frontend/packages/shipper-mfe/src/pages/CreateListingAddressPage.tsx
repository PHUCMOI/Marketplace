import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ApiError,
  authService,
  listingService,
  locationService,
  VietnamProvince
} from '@logistics-marketplace/shared';

interface FormState {
  pickupProvinceCode: string;
  pickupAddressLine: string;
  deliveryProvinceCode: string;
  deliveryAddressLine: string;
  pickupDate: string;
  deliveryDate: string;
  cargoDescription: string;
  weight: string;
  priceAmount: string;
  priceCurrency: string;
}

const initialForm: FormState = {
  pickupProvinceCode: '',
  pickupAddressLine: '',
  deliveryProvinceCode: '',
  deliveryAddressLine: '',
  pickupDate: '',
  deliveryDate: '',
  cargoDescription: '',
  weight: '',
  priceAmount: '',
  priceCurrency: 'VND'
};

const getErrorMessage = (error: unknown): string => {
  const apiError = error as Partial<ApiError>;
  return apiError?.message || 'Không thể tạo listing. Vui lòng kiểm tra dữ liệu và thử lại.';
};

const CreateListingAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [provinces, setProvinces] = useState<VietnamProvince[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    locationService.getVietnamProvinces()
      .then(setProvinces)
      .catch((loadError: unknown) => setError(getErrorMessage(loadError)))
      .finally(() => setIsLoadingProvinces(false));
  }, []);

  const change = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const shipperOrgId = authService.getStoredUser()?.organizationId;
    if (!shipperOrgId) {
      setError('Tài khoản chưa thuộc tổ chức shipper.');
      return;
    }

    const pickupDate = new Date(form.pickupDate);
    const deliveryDate = new Date(form.deliveryDate);
    if (Number.isNaN(pickupDate.getTime()) || Number.isNaN(deliveryDate.getTime())) {
      setError('Ngày lấy và ngày giao hàng không hợp lệ.');
      return;
    }
    if (deliveryDate <= pickupDate) {
      setError('Ngày giao hàng phải sau ngày lấy hàng.');
      return;
    }
    if (Number(form.weight) <= 0) {
      setError('Khối lượng phải lớn hơn 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const item = await listingService.create({
        shipperOrgId,
        pickupLocation: {
          addressLine: form.pickupAddressLine.trim(),
          provinceCode: form.pickupProvinceCode
        },
        deliveryLocation: {
          addressLine: form.deliveryAddressLine.trim(),
          provinceCode: form.deliveryProvinceCode
        },
        pickupDate: pickupDate.toISOString(),
        deliveryDate: deliveryDate.toISOString(),
        cargoDescription: form.cargoDescription.trim(),
        weight: Number(form.weight),
        priceAmount: form.priceAmount ? Number(form.priceAmount) : undefined,
        priceCurrency: form.priceCurrency,
        publishImmediately: true
      });
      navigate(`../listings/${item.id}`);
    } catch (submitError: unknown) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const provinceOptions = provinces.map((province) => (
    <option value={province.code} key={province.code}>{province.name}</option>
  ));

  return (
    <main className="shipper-page">
      <header className="ops-page-header">
        <div>
          <span className="ops-eyebrow">Tạo đơn vận chuyển</span>
          <h1>Tạo listing</h1>
          <p>Chọn tỉnh/thành phố và nhập địa chỉ chi tiết trên lãnh thổ Việt Nam.</p>
        </div>
      </header>
      {error && <p className="ops-alert" role="alert">{error}</p>}
      <form onSubmit={submit} className="listing-form" aria-busy={isSubmitting}>
        <label>
          Tỉnh/thành phố lấy hàng
          <select required disabled={isLoadingProvinces} value={form.pickupProvinceCode} onChange={(e) => change('pickupProvinceCode', e.target.value)}>
            <option value="">{isLoadingProvinces ? 'Đang tải danh mục...' : 'Chọn tỉnh/thành phố'}</option>
            {provinceOptions}
          </select>
        </label>
        <label>
          Địa chỉ lấy hàng
          <input required minLength={3} maxLength={256} placeholder="Số nhà, đường, phường/xã" value={form.pickupAddressLine} onChange={(e) => change('pickupAddressLine', e.target.value)} />
        </label>
        <label>
          Tỉnh/thành phố giao hàng
          <select required disabled={isLoadingProvinces} value={form.deliveryProvinceCode} onChange={(e) => change('deliveryProvinceCode', e.target.value)}>
            <option value="">{isLoadingProvinces ? 'Đang tải danh mục...' : 'Chọn tỉnh/thành phố'}</option>
            {provinceOptions}
          </select>
        </label>
        <label>
          Địa chỉ giao hàng
          <input required minLength={3} maxLength={256} placeholder="Số nhà, đường, phường/xã" value={form.deliveryAddressLine} onChange={(e) => change('deliveryAddressLine', e.target.value)} />
        </label>
        <label>Ngày lấy hàng<input required type="datetime-local" value={form.pickupDate} onChange={(e) => change('pickupDate', e.target.value)} /></label>
        <label>Ngày giao hàng<input required type="datetime-local" value={form.deliveryDate} onChange={(e) => change('deliveryDate', e.target.value)} /></label>
        <label>Mô tả hàng<textarea required maxLength={1000} value={form.cargoDescription} onChange={(e) => change('cargoDescription', e.target.value)} /></label>
        <label>Khối lượng (kg)<input required min="0.01" step="0.01" type="number" value={form.weight} onChange={(e) => change('weight', e.target.value)} /></label>
        <label>Giá dự kiến<input min="0" step="1000" type="number" value={form.priceAmount} onChange={(e) => change('priceAmount', e.target.value)} /></label>
        <label>Tiền tệ<input required maxLength={3} value={form.priceCurrency} onChange={(e) => change('priceCurrency', e.target.value.toUpperCase())} /></label>
        <button type="submit" disabled={isLoadingProvinces || isSubmitting}>
          {isSubmitting ? 'Đang tạo listing...' : 'Tạo và publish'}
        </button>
      </form>
    </main>
  );
};

export default CreateListingAddressPage;
