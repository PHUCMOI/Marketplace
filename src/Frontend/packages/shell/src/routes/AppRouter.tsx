import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authService, UserRole } from '@logistics-marketplace/shared';
import { LoadingFallback } from '../components/LoadingFallback';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage, RegisterPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';
const ShipperApp=lazy(()=>import('shipperMfe/ShipperApp')); const CarrierApp=lazy(()=>import('carrierMfe/CarrierApp')); const DispatcherApp=lazy(()=>import('dispatcherMfe/DispatcherApp'));
const Protected:React.FC<{roles:UserRole[];children:React.ReactNode}>=({roles,children})=>{const user=authService.getStoredUser();if(!user)return <Navigate to="/login" replace/>;if(user.role!==UserRole.Admin&&!roles.includes(user.role))return <Navigate to="/" replace/>;return <>{children}</>;};
export const AppRouter:React.FC=()=> <Suspense fallback={<LoadingFallback message="Loading application..."/>}><Routes>
  <Route path="/" element={<HomePage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/profile" element={<Protected roles={Object.values(UserRole)}><ProfilePage/></Protected>}/>
  <Route path="/shipper/*" element={<Protected roles={[UserRole.Shipper]}><ShipperApp/></Protected>}/>
  <Route path="/carrier/*" element={<Protected roles={[UserRole.Carrier]}><CarrierApp/></Protected>}/>
  <Route path="/dispatcher/*" element={<Protected roles={[UserRole.Dispatcher]}><DispatcherApp/></Protected>}/>
  <Route path="*" element={<NotFoundPage/>}/>
</Routes></Suspense>;