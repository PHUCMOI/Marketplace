
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useInRouterContext } from 'react-router-dom';
import ShipperDashboard from './pages/ShipperDashboard';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingAddressPage';
import ListingDetailPage from './pages/ListingDetailPage';
import EditListingPage from './pages/EditListingPage';
import BidsPage from './pages/BidsPage';
import DealsPage from './pages/DealsPage';
import DealDetailPage from './pages/DealDetailPage';
import './styles/shipper-app.css';

/**
 * Main Shipper Application Component
 * The single-spa root passes basePath when this app is mounted as a bundle.
 */
export interface ShipperAppProps {
  basePath?: string;
}

const ShipperContent: React.FC = () => (
    <div className="shipper-app">
      <Routes>
        <Route index element={<ShipperDashboard />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/create" element={<CreateListingPage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />
        <Route path="listings/:id/edit" element={<EditListingPage />} />
        <Route path="bids" element={<BidsPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="deals/:id" element={<DealDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
);

const ShipperApp: React.FC<ShipperAppProps> = ({ basePath = '/' }) => {
  const hasRouter = useInRouterContext();
  const content = <ShipperContent />;
  return hasRouter ? content : <BrowserRouter basename={basePath}>{content}</BrowserRouter>;
};

export default ShipperApp;
