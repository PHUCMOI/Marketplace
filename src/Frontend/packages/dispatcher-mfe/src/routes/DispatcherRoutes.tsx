import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import ListingsPage from '../features/listings/ListingsPage';
import CreateListingPage from '../features/listings/CreateListingPage';
import ListingDetailPage from '../features/listings/ListingDetailPage';
import BidsPage from '../features/bids/BidsPage';
import BidReviewPage from '../features/bids/BidReviewPage';
import DealsPage from '../features/deals/DealsPage';
import DealDetailPage from '../features/deals/DealDetailPage';

const DispatcherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />

      <Route path="listings">
        <Route index element={<ListingsPage />} />
        <Route path="new" element={<CreateListingPage />} />
        <Route path=":id" element={<ListingDetailPage />} />
      </Route>

      <Route path="bids">
        <Route index element={<BidsPage />} />
        <Route path=":id" element={<BidReviewPage />} />
      </Route>

      <Route path="deals">
        <Route index element={<DealsPage />} />
        <Route path=":id" element={<DealDetailPage />} />
      </Route>
    </Routes>
  );
};

export default DispatcherRoutes;
