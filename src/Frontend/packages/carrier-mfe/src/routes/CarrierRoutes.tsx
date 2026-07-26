import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import MarketplacePage from '../features/marketplace/MarketplacePage';
import ListingDetailPage from '../features/marketplace/ListingDetailPage';
import MyBidsPage from '../features/my-bids/MyBidsPage';
import VehiclesPage from '../features/fleet/VehiclesPage';
import DriversPage from '../features/fleet/DriversPage';
import DispatchesPage from '../features/dispatches/DispatchesPage';
import DispatchDetailPage from '../features/dispatches/DispatchDetailPage';

const CarrierRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="marketplace" element={<MarketplacePage />} />
      <Route path="marketplace/:id" element={<ListingDetailPage />} />
      <Route path="my-bids" element={<MyBidsPage />} />

      <Route path="fleet">
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="drivers" element={<DriversPage />} />
      </Route>

      <Route path="dispatches">
        <Route index element={<DispatchesPage />} />
        <Route path=":id" element={<DispatchDetailPage />} />
      </Route>
    </Routes>
  );
};

export default CarrierRoutes;
