import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  History,
  Settings,
  Plus,
  Ticket,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ShieldCheck,
  Menu,
  X,
  Radio,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navSections = [
    {
      title: 'CORE OPERATIONS',
      items: [
        {
          to: '/',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: 'Live',
          badgeType: 'live',
          end: true,
        },
        {
          to: '/events',
          label: 'Event Management',
          icon: Calendar,
          badge: '14',
          badgeType: 'count',
        },
        {
          to: '/zones',
          label: 'Ticket Zone Mgmt',
          icon: Layers,
          badge: '6',
          badgeType: 'count',
        },
        {
          to: '/orders',
          label: 'Sales History',
          icon: History,
          badge: '+482',
          badgeType: 'highlight',
        },
      ],
    },
    {
      title: 'WORKFLOWS & ACTIONS',
      items: [
        {
          to: '/events/new',
          label: 'Buat Event Baru',
          icon: Plus,
          badge: 'Wizard',
          badgeType: 'tag',
        },
        {
          to: '/login',
          label: 'Admin Login Portal',
          icon: ShieldCheck,
          badge: 'Portal',
          badgeType: 'tag',
        },
      ],
    },
    {
      title: 'SYSTEM CONFIG',
      items: [
        {
          to: '/settings',
          label: 'Settings & Mock API',
          icon: Settings,
          dot: true,
        },
      ],
    },
  ];

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Left Sidebar ────────────────────────────────────── */}
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileMenuOpen ? 'sidebar--mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar__brand">
          <NavLink to="/" className="sidebar__logo-link">
            <div className="sidebar__logo-icon">
              <ShieldCheck size={22} />
            </div>
            {!collapsed && (
              <div className="sidebar__brand-text">
                <span className="sidebar__brand-name">TicketPass</span>
                <span className="sidebar__brand-badge">OPS CONSOLE</span>
              </div>
            )}
          </NavLink>
          <button
            type="button"
            className="sidebar__collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar__nav">
          {navSections.map((sec, idx) => (
            <div key={idx} className="sidebar__section">
              {!collapsed && <div className="sidebar__section-title">{sec.title}</div>}
              <ul className="sidebar__menu">
                {sec.items.map((item) => (
                  <li key={item.to} className="sidebar__menu-item">
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon size={18} className="sidebar__link-icon" />
                      {!collapsed && (
                        <>
                          <span className="sidebar__link-label">{item.label}</span>
                          {item.badge && (
                            <span className={`sidebar__badge sidebar__badge--${item.badgeType}`}>
                              {item.badgeType === 'live' && <span className="sidebar__live-dot" />}
                              {item.badge}
                            </span>
                          )}
                          {item.dot && <span className="sidebar__green-dot" />}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Telemetry Footer */}
        <div className="sidebar__footer">
          <div className="sidebar__telemetry">
            <div className="sidebar__telemetry-status">
              <span className="sidebar__telemetry-dot" />
              {!collapsed && (
                <div className="sidebar__telemetry-info">
                  <span className="sidebar__telemetry-title">Turnstile Telemetry</span>
                  <span className="sidebar__telemetry-subtitle">Active Gates (99.8%)</span>
                </div>
              )}
            </div>
            {!collapsed && <Radio size={14} className="sidebar__telemetry-icon" />}
          </div>
        </div>
      </aside>

      {/* ── Main Layout (Header + Canvas) ───────────────────── */}
      <div className="app-main">
        {/* Top Header Bar */}
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="topbar__mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>

            {/* Global Search Bar with Shortcut */}
            <div className="topbar__search">
              <Search size={16} className="topbar__search-icon" />
              <input
                type="text"
                placeholder="Search events, orders, attendees..."
                className="topbar__search-input"
              />
              <kbd className="topbar__search-kbd">⌘K</kbd>
            </div>
          </div>

          <div className="topbar__right">
            {/* System Status Indicators */}
            <div className="topbar__system-status">
              <span className="topbar__status-dot" />
              <span className="topbar__status-text">Mock Service Ready</span>
              <span className="topbar__version-badge">Prod v2.4</span>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              className="topbar__action-btn"
              onClick={() => navigate('/events/new')}
            >
              <Plus size={16} />
              <span>Buat Event Baru</span>
            </button>

            {/* Dark/Light Mode Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            <div className="topbar__popover-wrap">
              <button
                type="button"
                className="topbar__icon-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Lihat Notifikasi"
                title="Notifikasi Operasional"
              >
                <Bell size={18} />
                <span className="topbar__notification-badge">3</span>
              </button>

              {notificationsOpen && (
                <div className="topbar__dropdown topbar__notifications-dropdown">
                  <div className="topbar__dropdown-header">
                    <h4>Pusat Notifikasi & Alert</h4>
                    <span className="topbar__dropdown-tag">3 Kritis</span>
                  </div>
                  <ul className="topbar__notif-list">
                    <li className="topbar__notif-item topbar__notif-item--critical">
                      <strong>Flash Sale VIP Ludes</strong>
                      <p>1.200 tiket Zone VIP Soundfest 2025 terjual dalam 14m 20d.</p>
                      <span className="topbar__notif-time">2m lalu</span>
                    </li>
                    <li className="topbar__notif-item topbar__notif-item--success">
                      <strong>Transaksi #TX-98421 Selesai</strong>
                      <p>Rp 3.750.000 via QRIS Dynamic diverifikasi.</p>
                      <span className="topbar__notif-time">4m lalu</span>
                    </li>
                    <li className="topbar__notif-item topbar__notif-item--warning">
                      <strong>Gate Barat: Lonjakan Antrean</strong>
                      <p>Throughput 92 scan/menit. Turnstile 3 & 4 mode cepat.</p>
                      <span className="topbar__notif-time">9m lalu</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="topbar__popover-wrap">
              <button
                type="button"
                className="topbar__profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="Profil Pengguna"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
                  alt="Sarah Jenkins"
                  className="topbar__profile-avatar"
                />
                <div className="topbar__profile-meta">
                  <span className="topbar__profile-name">Sarah Jenkins</span>
                  <span className="topbar__profile-role">Ops Administrator</span>
                </div>
                <ChevronDown size={14} className="topbar__profile-chevron" />
              </button>

              {profileDropdownOpen && (
                <div className="topbar__dropdown topbar__profile-dropdown">
                  <div className="topbar__profile-drop-header">
                    <div className="topbar__profile-drop-name">Sarah Jenkins</div>
                    <div className="topbar__profile-drop-email">admin@ticketpass.io</div>
                  </div>
                  <div className="topbar__dropdown-divider" />
                  <button
                    type="button"
                    className="topbar__dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <Settings size={15} />
                    <span>Pengaturan Akun & Konfigurasi</span>
                  </button>
                  <button
                    type="button"
                    className="topbar__dropdown-item topbar__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    <span>Keluar (Sign Out)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content Canvas */}
        <main className="content-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
