import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserCheck,
  AlertTriangle,
  Server,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ticketpass.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [apiMode, setApiMode] = useState('production'); // 'production' | 'mock'
  const [rememberSession, setRememberSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoActive, setDemoActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 400);
  };

  const handleUseDemo = () => {
    setEmail('admin@ticketpass.io');
    setPassword('TicketPass2025!');
    setDemoActive(true);
  };

  return (
    <div className="login-page">
      {/* ── Top Bar with Status & Theme ─────────────────────── */}
      <div className="login-page__topbar">
        <div className="login-page__gateway-live">
          <span className="login-page__live-dot" />
          <span className="login-page__gateway-text">GATEWAY OPERATIONAL</span>
          <span className="login-page__api-endpoint">/src/services/api.js</span>
        </div>
        <ThemeToggle />
      </div>

      {/* ── Main Centered Portal Card ───────────────────────── */}
      <div className="login-page__main">
        <div className="login-page__card">
          {/* Logo Badge */}
          <div className="login-page__logo-wrap">
            <div className="login-page__logo">
              <ShieldCheck size={32} />
            </div>
          </div>

          {/* Subtitle Badge */}
          <div className="login-page__sub-badge-wrap">
            <span className="login-page__sub-badge">
              <ShieldCheck size={13} />
              <span>Operations & Box Office Console</span>
            </span>
          </div>

          <h1 className="login-page__title">Admin Portal Sign In</h1>
          <p className="login-page__desc">
            Kelola event, inventaris tiket, dan pantau penjualan tiket secara realtime.
          </p>

          {/* Production API / Mock Dev Mode Toggle */}
          <div className="login-page__mode-switch">
            <button
              type="button"
              className={`login-page__mode-btn ${apiMode === 'production' ? 'active' : ''}`}
              onClick={() => setApiMode('production')}
            >
              <Server size={14} />
              <span>Production API</span>
            </button>
            <button
              type="button"
              className={`login-page__mode-btn ${apiMode === 'mock' ? 'active' : ''}`}
              onClick={() => setApiMode('mock')}
            >
              <Zap size={14} />
              <span>Mock Dev Mode</span>
              <span className="login-page__instant-tag">Instant</span>
            </button>
          </div>

          {/* Login Form */}
          <form className="login-page__form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="login-page__field">
              <div className="login-page__field-label-row">
                <label className="login-page__label">Email Admin</label>
                <button
                  type="button"
                  className="login-page__demo-trigger"
                  onClick={handleUseDemo}
                >
                  <Zap size={12} /> Gunakan Akun Demo Ops
                </button>
              </div>
              <div className="login-page__input-wrap">
                <Mail size={16} className="login-page__input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ticketpass.io"
                  className="login-page__input"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-page__field">
              <div className="login-page__field-label-row">
                <label className="login-page__label">Kata Sandi</label>
                <a href="#forgot" className="login-page__forgot-link">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="login-page__input-wrap">
                <Lock size={16} className="login-page__input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-page__input"
                  required
                />
                <button
                  type="button"
                  className="login-page__password-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Tampilkan sandi"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="login-page__strength-row">
                <div className="login-page__strength-bar">
                  <div className="login-page__strength-fill" />
                </div>
                <div className="login-page__strength-labels">
                  <span className="login-page__strength-val">
                    <CheckCircle2 size={12} /> Kekuatan sandi: Sangat Kuat
                  </span>
                  <span className="login-page__strength-req">Min. 8 Karakter</span>
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <label className="login-page__remember-label">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="login-page__checkbox"
              />
              <span>Ingat sesi perangkat ini (30 hari)</span>
            </label>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="login-page__submit-btn"
              disabled={loading}
            >
              <LogIn size={18} />
              <span>{loading ? 'Memverifikasi Sesi...' : 'Masuk ke Dashboard Admin'}</span>
            </button>
          </form>

          {/* Quick Simulation Actions */}
          <div className="login-page__sim-actions">
            <button
              type="button"
              className="login-page__sim-btn"
              onClick={() => {
                setEmail('sarah.jenkins@ticketpass.internal');
                setPassword('OpsLead2025!');
              }}
            >
              <UserCheck size={14} />
              <span>Ops Lead Profile</span>
            </button>
            <button
              type="button"
              className="login-page__sim-btn login-page__sim-btn--warn"
              onClick={() => alert('Simulasi: Token kedaluwarsa (HTTP 401 Unauthorized)')}
            >
              <AlertTriangle size={14} />
              <span>Simulasi Error 401</span>
            </button>
          </div>

          {/* Security & Ledger Badges */}
          <div className="login-page__security-footer">
            <div className="login-page__security-tags">
              <span>🔒 256-bit SSL Ops</span>
              <span>•</span>
              <span>🛡 MFA Protected</span>
              <span>•</span>
              <span>📋 Audit Log Active</span>
            </div>
            <p className="login-page__security-disclaimer">
              Akses terbatas hanya untuk tim operasional terverifikasi. Seluruh aktivitas audit dicatat pada EventID security ledger.
            </p>
          </div>
        </div>

        {/* ── Box-Office Gateway Status Box ───────────────────── */}
        <div className="login-page__gateway-box">
          <div className="login-page__gateway-header">
            <div className="login-page__gateway-title">
              <Zap size={15} className="text-indigo" />
              <strong>Box-Office Gateway Status</strong>
            </div>
            <span className="login-page__conn-badge">● Connected (14ms)</span>
          </div>
          <div className="login-page__gateway-grid">
            <div className="login-page__gateway-stat">
              <span className="login-page__gw-label">Active Venue</span>
              <strong className="login-page__gw-val">GBK Arena</strong>
            </div>
            <div className="login-page__gateway-stat">
              <span className="login-page__gw-label">Ticket Buffer</span>
              <strong className="login-page__gw-val">18,450</strong>
            </div>
            <div className="login-page__gateway-stat">
              <span className="login-page__gw-label">Gate Status</span>
              <strong className="login-page__gw-val text-emerald">8 Online</strong>
            </div>
          </div>
        </div>

        {/* ── Page Footer Info ────────────────────────────────── */}
        <div className="login-page__footer">
          <span>TicketPass Enterprise v4.12.0</span>
          <span>•</span>
          <a href="#helpdesk">Ops Helpdesk</a>
          <span>•</span>
          <a href="#terms">System Terms</a>
        </div>
      </div>
    </div>
  );
}
