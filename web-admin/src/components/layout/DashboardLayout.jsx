import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  Ticket,
} from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const storedUser = JSON.parse(localStorage.getItem('admin_user') || '{"name":"Admin Event Pass","email":"admin@eventpass.com"}');

  const navItems = [
    { to: '/', label: 'Dasbor', icon: LayoutDashboard, end: true },
    { to: '/events', label: 'Manajemen Acara', icon: Calendar },
    { to: '/orders', label: 'Riwayat Pesanan', icon: ShoppingBag },
    { to: '/staff', label: 'Kelola Petugas', icon: Users },
  ];

  return (
    <div className="layout-root">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="layout-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`layout-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <Ticket size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Event & Ticket</span>
            <span className="brand-badge">ADMIN</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {storedUser.name?.charAt(0) || 'A'}
            </div>
            <div className="user-info">
              <span className="user-name">{storedUser.name}</span>
              <span className="user-email">{storedUser.email}</span>
            </div>
          </div>
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="layout-main">
        <header className="layout-topbar">
          <button
            type="button"
            className="menu-toggle-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka Menu"
          >
            <Menu size={22} />
          </button>
          <div className="topbar-title">
            <span>Portal Manajemen Event & Ticketing</span>
          </div>
          <div className="topbar-actions">
            <div className="topbar-role-badge">Super Admin</div>
          </div>
        </header>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
