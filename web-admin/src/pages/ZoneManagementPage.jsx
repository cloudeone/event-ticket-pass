import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Zap,
  TrendingUp,
  Lock,
  Ticket,
  Users,
  Settings,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Radio,
  MapPin,
  ExternalLink,
  ChevronDown,
  Search,
  Filter,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { zones as initialZones, gateStatus } from '../lib/mock-data';
import { formatCurrency, formatNumber } from '../lib/formatters';
import './ZoneManagementPage.css';

export default function ZoneManagementPage() {
  const [zonesList, setZonesList] = useState(initialZones);
  const [searchTier, setSearchTier] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('Soundfest Jakarta 2025 - Stadion Madya GBK');

  const toggleZoneStatus = (zoneId) => {
    setZonesList((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, active: !z.active } : z))
    );
  };

  const filteredZones = zonesList.filter((z) =>
    z.name.toLowerCase().includes(searchTier.toLowerCase()) ||
    z.description.toLowerCase().includes(searchTier.toLowerCase())
  );

  return (
    <div className="zone-page">
      {/* ── Top Header Bar ──────────────────────────────────── */}
      <div className="zone-page__header">
        <div className="zone-page__header-left">
          <div className="zone-page__badge">
            <span className="zone-page__badge-dot" />
            <span>INVENTORY ENGINE LIVE</span>
            <span className="zone-page__badge-id">SYS-ID: STAD-MDY-2025</span>
          </div>
          <h1 className="zone-page__title">Zona & Kuota Tiket</h1>
          <p className="zone-page__subtitle">
            Konfigurasi kapasitas dinamis, pricing tier, dan telemetry gate venue
          </p>
        </div>

        <div className="zone-page__header-right">
          <div className="zone-page__event-selector">
            <span className="zone-page__selector-label">EVENT TERPILIH</span>
            <div className="zone-page__selector-box">
              <MapPin size={14} className="text-indigo" />
              <span>{selectedEvent}</span>
              <ChevronDown size={14} />
            </div>
          </div>
          <Button variant="outline" size="md" icon={ExternalLink}>
            Box Office Portal
          </Button>
        </div>
      </div>

      {/* ── 4 Summary Stat Cards ────────────────────────────── */}
      <div className="zone-page__stats-grid">
        <StatCard
          label="TOTAL ALOKASI KAPASITAS"
          value="15.000 Kursi"
          subtitle="100% Sesuai Izin Resmi Venue"
          icon={Users}
          iconColor="indigo"
        >
          <div className="zone-page__stat-check">
            <CheckCircle2 size={12} className="text-emerald" />
            <span>Kapasitas Tersertifikasi Pemda</span>
          </div>
        </StatCard>

        <StatCard
          label="TIKET TERJUAL (PAID)"
          value="12.350 Tiket"
          subtitle="82.3% Terokupansi"
          trend={12.4}
          trendLabel="vs presale"
          icon={Ticket}
          iconColor="emerald"
        >
          <ProgressBar value={12350} max={15000} color="emerald" size="sm" />
        </StatCard>

        <StatCard
          label="SISA KUOTA BEBAS"
          value="2.150 Tersedia"
          subtitle="Laju penjualan: ~14 tix/mnt"
          icon={Zap}
          iconColor="amber"
        >
          <span className="zone-page__runway-tag">Runway perkiraan: ~2.5 jam</span>
        </StatCard>

        <StatCard
          label="TIKET DIKUNCI (HELD)"
          value="500 Reserved"
          subtitle="Sponsor & VIP Hold • Expires 6h"
          icon={Lock}
          iconColor="rose"
        >
          <span className="zone-page__lock-tag">Alokasi B2B Corporate</span>
        </StatCard>
      </div>

      {/* ── Visual Capacity Distribution Bar ────────────────── */}
      <Card className="zone-page__dist-card" padding="md">
        <div className="zone-page__dist-header">
          <div>
            <h3 className="zone-page__dist-title">Distribusi Kapasitas Stadion Madya GBK</h3>
            <p className="zone-page__dist-subtitle">
              Pemetaan realtime peruntukan zona terhadap total 15.000 kapasitas resmi
            </p>
          </div>
          <div className="zone-page__dist-legend">
            <span><span className="zone-page__leg-dot" style={{ backgroundColor: '#6366F1' }} /> VIP (10%)</span>
            <span><span className="zone-page__leg-dot" style={{ backgroundColor: '#3B82F6' }} /> Fest A (33.3%)</span>
            <span><span className="zone-page__leg-dot" style={{ backgroundColor: '#10B981' }} /> Fest B (36.7%)</span>
            <span><span className="zone-page__leg-dot" style={{ backgroundColor: '#F59E0B' }} /> Tribune (13.3%)</span>
            <span><span className="zone-page__leg-dot" style={{ backgroundColor: '#EC4899' }} /> Promo (6.7%)</span>
          </div>
        </div>

        {/* Segmented Bar */}
        <div className="zone-page__bar-container">
          <div style={{ width: '10%' }} className="zone-page__bar-seg zone-page__bar-seg--vip" />
          <div style={{ width: '33.3%' }} className="zone-page__bar-seg zone-page__bar-seg--fest-a" />
          <div style={{ width: '36.7%' }} className="zone-page__bar-seg zone-page__bar-seg--fest-b" />
          <div style={{ width: '13.3%' }} className="zone-page__bar-seg zone-page__bar-seg--tribune" />
          <div style={{ width: '6.7%' }} className="zone-page__bar-seg zone-page__bar-seg--promo" />
        </div>

        {/* Quick Zone Cards Row */}
        <div className="zone-page__zone-cards-row">
          {zonesList.map((z) => (
            <div key={z.id} className="zone-page__mini-card">
              <span className="zone-page__mini-name">{z.name}</span>
              <div className="zone-page__mini-numbers">
                <strong>{formatNumber(z.sold)}</strong> / {formatNumber(z.capacity)}
              </div>
              <span className={`zone-page__mini-status zone-page__mini-status--${z.badgeType}`}>
                {z.badge}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Table Action Controls ───────────────────────────── */}
      <div className="zone-page__controls">
        <div className="zone-page__controls-left">
          <Button variant="primary" size="md" icon={Plus}>
            Tambah Zona Tiket Baru
          </Button>
          <Button variant="outline" size="md">
            Aktifkan Semua
          </Button>
          <Button variant="outline" size="md">
            Update Harga Massal
          </Button>
        </div>

        <div className="zone-page__controls-right">
          <div className="zone-page__search-input-wrap">
            <Search size={15} className="zone-page__search-icon" />
            <input
              type="text"
              placeholder="Filter tier nama..."
              value={searchTier}
              onChange={(e) => setSearchTier(e.target.value)}
              className="zone-page__search-input"
            />
          </div>
        </div>
      </div>

      {/* ── Zone Data Table ─────────────────────────────────── */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>INFORMASI ZONA & TIPE</TableHead>
            <TableHead align="right">HARGA SATUAN (IDR)</TableHead>
            <TableHead>ALOKASI KUOTA</TableHead>
            <TableHead>PENJUALAN & OKUPANSI</TableHead>
            <TableHead align="center">STATUS ON/OFF</TableHead>
            <TableHead align="center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredZones.map((z, idx) => (
            <TableRow key={z.id}>
              <TableCell>
                <span className="zone-page__row-num">0{idx + 1}</span>
              </TableCell>

              {/* Zone Info */}
              <TableCell>
                <div className="zone-page__tier-info">
                  <div className="zone-page__tier-title-row">
                    <strong>{z.name}</strong>
                    <span className={`zone-page__badge-pill zone-page__badge-pill--${z.badgeType}`}>
                      {z.badge}
                    </span>
                  </div>
                  <span className="zone-page__tier-desc">{z.description}</span>
                  <span className="zone-page__tier-gate">
                    <MapPin size={11} /> {z.gateAccess}
                  </span>
                </div>
              </TableCell>

              {/* Price */}
              <TableCell align="right">
                <strong className="zone-page__price-text tabular-nums">
                  {formatCurrency(z.price)}
                </strong>
              </TableCell>

              {/* Quota */}
              <TableCell>
                <div className="zone-page__quota-cell">
                  <strong className="tabular-nums">{formatNumber(z.capacity)}</strong>
                  <span className="zone-page__quota-sub">Maks {z.maxPerOrder} / tumpuk</span>
                </div>
              </TableCell>

              {/* Sold & Occupancy Bar */}
              <TableCell>
                <div className="zone-page__occupancy-cell">
                  <div className="zone-page__occ-numbers">
                    <strong className="tabular-nums">{formatNumber(z.sold)} Terjual</strong>
                    <span className="tabular-nums text-rose font-semibold">{z.percentSold}%</span>
                  </div>
                  <ProgressBar
                    value={z.sold}
                    max={z.capacity}
                    color={z.percentSold >= 100 ? 'rose' : z.percentSold >= 80 ? 'indigo' : 'emerald'}
                    size="sm"
                  />
                  <span className="zone-page__occ-remaining">
                    {z.remaining === 0 ? '0 Tersisa Bebas' : `${formatNumber(z.remaining)} Tersedia Bebas`}
                  </span>
                </div>
              </TableCell>

              {/* Toggle Switch */}
              <TableCell align="center">
                <button
                  type="button"
                  className={`zone-page__switch ${z.active ? 'zone-page__switch--on' : ''}`}
                  onClick={() => toggleZoneStatus(z.id)}
                  aria-label={`Toggle ${z.name}`}
                >
                  <span className="zone-page__switch-thumb" />
                  <span className="zone-page__switch-label">
                    {z.active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </button>
              </TableCell>

              {/* Actions */}
              <TableCell align="center">
                <div className="zone-page__actions-group">
                  <button type="button" className="zone-page__action-btn" title="Edit Zona">
                    <Edit size={14} />
                  </button>
                  <button type="button" className="zone-page__action-btn" title="Kunci Kuota">
                    <Lock size={14} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ── Venue Stage Map & Gate Telemetry Section ────────── */}
      <div className="zone-page__bottom-grid">
        {/* Stage & Zone Map */}
        <Card className="zone-page__map-card" padding="md">
          <div className="zone-page__map-header">
            <div>
              <h3 className="zone-page__map-title">Layout Denah Panggung & Zona</h3>
              <p className="zone-page__map-subtitle">
                Stadion Madya GBK Senayan • Orientasi Panggung Utama Utara
              </p>
            </div>
            <Button variant="outline" size="sm">
              Fullscreen Map
            </Button>
          </div>

          <div className="zone-page__venue-layout">
            <div className="zone-page__map-stage">MAIN STAGE [NORTH]</div>
            <div className="zone-page__map-vip">
              <strong>VIP FRONT ROW</strong>
              <span>Kapasitas: 1.500 | 100% Okupansi (Sold Out)</span>
            </div>
            <div className="zone-page__map-row">
              <div className="zone-page__map-fest zone-page__map-fest--a">
                <strong>FESTIVAL A</strong>
                <span>4.820 / 5.000 (96%)</span>
              </div>
              <div className="zone-page__map-foh">FOH / MIX</div>
              <div className="zone-page__map-fest zone-page__map-fest--east">
                <strong>FESTIVAL A (EAST)</strong>
                <span>Termasuk Kuota Total</span>
              </div>
            </div>
            <div className="zone-page__map-fest-b">
              <strong>FESTIVAL B (STANDING AREA LUAS)</strong>
              <span>4.200 / 5.500 (76%) • Gate B & Gate C</span>
            </div>
            <div className="zone-page__map-tribune-row">
              <div className="zone-page__map-tribune">TRIBUNE BARAT (SEATED)</div>
              <div className="zone-page__map-tribune">TRIBUNE TIMUR (RESERVED MEDIA)</div>
            </div>
          </div>
          <div className="zone-page__map-footer">
            <span>Dimensi Lapangan: 105m x 68m</span>
            <span>Akurasi Layout: CAD Blueprint v4.1 verified</span>
          </div>
        </Card>

        {/* Real-time Gate Telemetry Scanner Sidebar */}
        <Card className="zone-page__telemetry-card" padding="md">
          <div className="zone-page__telemetry-header">
            <div>
              <div className="zone-page__telemetry-tag">
                <span className="zone-page__live-dot" /> LIVE TURNSTILE
              </div>
              <h3 className="zone-page__telemetry-title">Telemetry Scanner Gate</h3>
            </div>
            <span className="zone-page__telemetry-online">● Online</span>
          </div>
          <p className="zone-page__telemetry-desc">
            Beban throughput turnstile masuk venue per zona tiket aktif
          </p>

          <div className="zone-page__gate-list">
            {gateStatus.map((g) => (
              <div key={g.id} className="zone-page__gate-item">
                <div className="zone-page__gate-top">
                  <div className="zone-page__gate-name-wrap">
                    <Radio size={14} className="text-indigo" />
                    <strong>{g.name}</strong>
                  </div>
                  <span className="zone-page__gate-sync">{g.sync}</span>
                </div>
                <div className="zone-page__gate-meta">
                  <span>{g.readiness}</span>
                  <span>Latensi: {g.latency}</span>
                </div>
                <ProgressBar value={g.id === 'GT-BC' ? 92 : 45} max={100} color="emerald" size="sm" />
              </div>
            ))}
          </div>

          {/* Emergency Safety Controls */}
          <div className="zone-page__emergency-controls">
            <Button variant="outline" size="sm" icon={ShieldAlert} fullWidth>
              Emergency Throttle
            </Button>
            <Button variant="danger" size="sm" icon={AlertTriangle} fullWidth>
              Freeze All Sales
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

