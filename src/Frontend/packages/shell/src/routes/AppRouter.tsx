import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthUser, UserRole } from '@logistics-marketplace/shared';
import { LoadingFallback } from '../components/LoadingFallback';
import { SingleSpaBundle } from '../single-spa/SingleSpaBundle';
import { mfeBundles } from '../single-spa/mfe-config';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage, RegisterPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';
const routeForRole=(role:UserRole)=>role===UserRole.Shipper?'/shipper':role===UserRole.Carrier?'/carrier':role===UserRole.Dispatcher?'/dispatcher':'/';
const Protected:React.FC<{roles:UserRole[];children:React.ReactNode}>=({roles,children})=>{const user=useAuthUser();if(!user)return <Navigate to="/login" replace/>;if(user.role!==UserRole.Admin&&!roles.includes(user.role))return <Navigate to="/" replace/>;return <>{children}</>;};
const AnonymousOnly:React.FC<{children:React.ReactNode}>=({children})=>{const user=useAuthUser();return user?<Navigate to={routeForRole(user.role)} replace/>:<>{children}</>;};
export const AppRouter:React.FC=()=> <Suspense fallback={<LoadingFallback message="Loading application..."/>}><Routes>
  <Route path="/" element={<HomePage/>}/><Route path="/login" element={<AnonymousOnly><LoginPage/></AnonymousOnly>}/><Route path="/register" element={<AnonymousOnly><RegisterPage/></AnonymousOnly>}/><Route path="/profile" element={<Protected roles={Object.values(UserRole)}><ProfilePage/></Protected>}/>
  <Route path="/shipper/*" element={<Protected roles={[UserRole.Shipper]}><SingleSpaBundle {...mfeBundles.shipper} /></Protected>}/>
  <Route path="/carrier/*" element={<Protected roles={[UserRole.Carrier]}><SingleSpaBundle {...mfeBundles.carrier} /></Protected>}/>
  <Route path="/dispatcher/*" element={<Protected roles={[UserRole.Dispatcher]}><SingleSpaBundle {...mfeBundles.dispatcher} /></Protected>}/>
  <Route path="*" element={<NotFoundPage/>}/>
</Routes></Suspense>;
