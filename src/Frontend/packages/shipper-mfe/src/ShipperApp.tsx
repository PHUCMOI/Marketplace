
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShipperDashboard from './pages/ShipperDashboard';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import ListingDetailPage from './pages/ListingDetailPage';
import EditListingPage from './pages/EditListingPage';
import BidsPage from './pages/BidsPage';
import DealsPage from './pages/DealsPage';
import DealDetailPage from './pages/DealDetailPage';
import './styles/shipper-app.css';

/**
 * Main Shipper Application Component
 * This component is exposed via Module Federation and consumed by the shell
 * Uses Routes (not BrowserRouter) because the shell handles routing context
 */
const ShipperApp: React.FC = () => {
  return (
    <div className="shipper-app">
      <Routes>
        <Route path="/" element={<ShipperDashboard />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/create" element={<CreateListingPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/listings/:id/edit" element={<EditListingPage />} />
        <Route path="/bids" element={<BidsPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/deals/:id" element={<DealDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default ShipperApp;