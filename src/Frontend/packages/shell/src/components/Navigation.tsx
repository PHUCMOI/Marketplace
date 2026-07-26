import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService, UserRole } from '@logistics-marketplace/shared';
import '../styles/navigation.css';

interface NavItem { path: string; label: string; end?: boolean; }

const roleNavigation: Partial<Record<UserRole, NavItem[]>> = {
  [UserRole.Shipper]: [
    { path: '/shipper', label: 'Overview', end: true },
    { path: '/shipper/listings', label: 'Manage listings' },
    { path: '/shipper/listings/create', label: 'Create load' },
    { path: '/shipper/bids', label: 'Bids' },
    { path: '/shipper/deals', label: 'Assigned loads' }
  ],
  [UserRole.Carrier]: [
    { path: '/carrier/dashboard', label: 'Overview' },
    { path: '/carrier/marketplace', label: 'Load board' },
    { path: '/carrier/my-bids', label: 'My bids' },
    { path: '/carrier/dispatches', label: 'Dispatches' },
    { path: '/carrier/fleet/vehicles', label: 'Fleet' }
  ],
  [UserRole.Dispatcher]: [
    { path: '/dispatcher/dashboard', label: 'Overview' },
    { path: '/dispatcher/listings', label: 'Listings' },
    { path: '/dispatcher/bids', label: 'Bid review' },
    { path: '/dispatcher/deals', label: 'Deals' }
  ],
  [UserRole.Broker]: [{ path: '/', label: 'Overview', end: true }]
};

const adminNavigation: NavItem[] = [
  { path: '/', label: 'Overview', end: true },
  { path: '/shipper', label: 'Shipper workspace' },
  { path: '/carrier/dashboard', label: 'Carrier workspace' },
  { path: '/dispatcher/dashboard', label: 'Dispatch center' }
];

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getStoredUser();
  const items = user?.role === UserRole.Admin
    ? adminNavigation
    : user ? roleNavigation[user.role] || [] : [{ path: '/', label: 'Platform', end: true }];
  const logout = () => { authService.logout(); navigate('/login'); };

  return (
    <nav className="app-navigation" aria-label="Primary navigation">
      <div className="nav-container">
        <ul className="nav-list">
          {items.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink to={item.path} end={item.end} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          {user ? <button type="button" className="nav-logout" onClick={logout}>Sign out</button> : <NavLink className="nav-cta" to="/register">Create account</NavLink>}
        </div>
      </div>
    </nav>
  );
};
