import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, UserRole } from '@logistics-marketplace/shared';

const routeForRole = (role: UserRole) => role === UserRole.Shipper ? '/shipper' : role === UserRole.Carrier ? '/carrier' : role === UserRole.Dispatcher ? '/dispatcher' : '/';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try { const result = await authService.login({ email, password }); navigate(routeForRole(result.user.role)); }
    catch { setError('Email hoặc mật khẩu không đúng.'); }
  };
  return <main className="auth-page">
    <section className="auth-intro"><span className="eyebrow">Operations access</span><h1>Welcome back</h1><p>Sign in to manage listings, bids and dispatches in your organization workspace.</p><ul><li>Role-based access</li><li>One source of operational truth</li><li>Secure API authentication</li></ul></section>
    <section className="auth-card"><div><span className="eyebrow">Sign in</span><h2>Access your workspace</h2></div>{error && <p className="form-alert" role="alert">{error}</p>}<form className="auth-form" onSubmit={submit}><label>Email address<input type="email" required autoComplete="email" placeholder="name@company.vn" value={email} onChange={(e) => setEmail(e.target.value)}/></label><label>Password<input type="password" required autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/></label><button className="button button-primary" type="submit">Sign in</button></form><p className="auth-switch">New to the network? <Link to="/register">Create an account</Link></p></section>
  </main>;
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', fullName: '', password: '', role: UserRole.Shipper, organizationName: '', contactPhone: '' });
  const [error, setError] = useState('');
  const change = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try { const result = await authService.register({ ...form, organizationType: form.role }); navigate(routeForRole(result.user.role)); }
    catch { setError('Không thể đăng ký. Email có thể đã tồn tại hoặc dữ liệu chưa hợp lệ.'); }
  };
  return <main className="auth-page register-page">
    <section className="auth-intro"><span className="eyebrow">Join the network</span><h1>Build a faster transport operation</h1><p>Create an organization workspace designed around your role in the marketplace.</p><ul><li>Post or discover qualified loads</li><li>Standardized bid and deal workflow</li><li>Visibility from pickup to delivery</li></ul></section>
    <section className="auth-card"><div><span className="eyebrow">Create account</span><h2>Organization details</h2></div>{error && <p className="form-alert" role="alert">{error}</p>}<form className="auth-form auth-form-grid" onSubmit={submit}><label>Full name<input required value={form.fullName} onChange={(e) => change('fullName', e.target.value)}/></label><label>Email address<input type="email" required value={form.email} onChange={(e) => change('email', e.target.value)}/></label><label>Password<input type="password" minLength={8} required value={form.password} onChange={(e) => change('password', e.target.value)}/></label><label>Workspace role<select value={form.role} onChange={(e) => change('role', e.target.value)}><option value={UserRole.Shipper}>Shipper</option><option value={UserRole.Carrier}>Carrier</option><option value={UserRole.Dispatcher}>Dispatcher</option><option value={UserRole.Broker}>Broker</option></select></label><label>Organization<input required value={form.organizationName} onChange={(e) => change('organizationName', e.target.value)}/></label><label>Contact phone<input required value={form.contactPhone} onChange={(e) => change('contactPhone', e.target.value)}/></label><button className="button button-primary auth-submit" type="submit">Create workspace</button></form><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></section>
  </main>;
};
