import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Ticket,
  Lock,
  UserCheck,
  Calendar,
  Download,
  Plus,
  RefreshCw,
  TrendingUp,
  Radio,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  ChevronDown,
  Filter,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import {
  dashboardStats,
  salesChartData,
  events,
  zones,
  notifications,
} from '../lib/mock-data';
import {
  formatCurrency,
  formatCompactCurrency,
  formatNumber,
} from '../lib/formatters';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('today'); // 'today' | 'week' | 'month' | 'year'
  const [metricView, setMetricView] = useState('both'); // 'both' | 'volume' | 'revenue'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [eventSearch, setEventSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const chartData = salesChartData[timeRange] || salesChartData.today;

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchName = ev.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
      ev.venue.toLowerCase().includes(eventSearch.toLowerCase());
    const matchCat = selectedCategory === 'all' || ev.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchName && matchCat;
  });

  // Calculate SVG dimensions for smooth dual-line chart
  const svgWidth = 680;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const maxVolume = Math.max(...chartData.map((d) => d.volume), 100);
  const maxThroughput = Math.max(...chartData.map((d) => d.throughput), 50);

  const getCoordinates = (index, value, maxVal) => {
    const x = paddingX + (index / (chartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (value / maxVal) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  // Build SVG path with smooth cubic bezier curve
  const createSmoothPath = (points) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const volumePoints = chartData.map((d, i) => getCoordinates(i, d.volume, maxVolume));
  const throughputPoints = chartData.map((d, i) => getCoordinates(i, d.throughput, maxThroughput));

  const volumePath = createSmoothPath(volumePoints);
  const throughputPath = createSmoothPath(throughputPoints);

  // Area paths for gradient fills
  const volumeAreaPath = `${volumePath} L ${volumePoints[volumePoints.length - 1].x} ${svgHeight - paddingY} L ${volumePoints[0].x} ${svgHeight - paddingY} Z`;
  const throughputAreaPath = `${throughputPath} L ${throughputPoints[throughputPoints.length - 1].x} ${svgHeight - paddingY} L ${throughputPoints[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="dashboard">
      {/* ── Top Operational Sync Bar & Page Header ──────────── */}
      <div className="dashboard__header">
        <div className="dashboard__header-left">
          <div className="dashboard__sync-badge">
            <span className="dashboard__sync-dot" />
            <span className="dashboard__sync-title">LIVE OPERATIONAL SYNC</span>
            <span className="dashboard__sync-sub">• Gate Telemetry Refreshed 8s ago</span>
          </div>
          <h1 className="dashboard__title">Ringkasan Eksekutif Operasional</h1>
          <p className="dashboard__subtitle">Q2 2025 Multi-Event Cluster — Live Telemetry & Box-Office Metrics</p>
        </div>

        <div className="dashboard__header-actions">
          <div className="dashboard__date-pill">
            <Calendar size={14} />
            <span>1 Mei - 31 Mei 2025</span>
            <ChevronDown size={14} className="dashboard__date-arrow" />
          </div>
          <Button variant="outline" size="md" icon={Download}>
            Unduh Rekap
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/events/new')}
          >
            Buat Event Baru
          </Button>
        </div>
      </div>

      {/* ── Metric Cards Grid (Top 4 Summary Cards) ─────────── */}
      <div className="dashboard__stats-grid">
        {/* Card 1: Total Revenue */}
        <StatCard
          label="TOTAL PENDAPATAN"
          value={formatCurrency(dashboardStats.totalRevenue)}
          trend={dashboardStats.revenueTrend}
          trendLabel={dashboardStats.revenueTrendLabel}
          icon={DollarSign}
          iconColor="indigo"
          badge="Gross"
        />

        {/* Card 2: Tickets Sold */}
        <StatCard
          label="TOTAL TIKET TERJUAL"
          value={`${formatNumber(dashboardStats.ticketsSold)} Tiket`}
          subtitle={`${dashboardStats.ticketsSoldPercent}% dari ${formatNumber(dashboardStats.totalCapacity)} alokasi kapasitas`}
          icon={Ticket}
          iconColor="emerald"
        >
          <ProgressBar
            value={dashboardStats.ticketsSold}
            max={dashboardStats.totalCapacity}
            color="emerald"
            size="sm"
          />
          <div className="dashboard__stat-footer">
            <span>Kapasitas Tersisa: <strong>{formatNumber(dashboardStats.remainingCapacity)} Tiket</strong></span>
          </div>
        </StatCard>

        {/* Card 3: Held Tickets */}
        <StatCard
          label="TIKET TERKUNCI (HELD)"
          value={`${formatNumber(dashboardStats.heldTickets)} Sesi`}
          subtitle="Checkout In-Flight • 4.7% total"
          icon={Lock}
          iconColor="amber"
          badge="Lock"
        >
          <div className="dashboard__stat-info-pill">
            <RefreshCw size={12} className="animate-spin" />
            <span>Auto-release lepas bertahap dlm 15 mnt</span>
          </div>
        </StatCard>

        {/* Card 4: Total Attendees / Turnout */}
        <StatCard
          label="TOTAL CHECK-IN (ATTENDED)"
          value={`${formatNumber(dashboardStats.totalAttendees)} Scan`}
          subtitle={`${dashboardStats.attendanceTurnout}% Turnout Realtime`}
          trend={dashboardStats.activeEventsGrowth}
          trendLabel="vs event sebelumnya"
          icon={UserCheck}
          iconColor="emerald"
        >
          <div className="dashboard__gate-rate">
            <span className="dashboard__gate-rate-dot" />
            <span>Gate A - D: <strong>Optimal {dashboardStats.gateThroughputRate}</strong></span>
          </div>
        </StatCard>
      </div>

      {/* ── Interactive Analytics & Alerts Section ──────────── */}
      <div className="dashboard__analytics-grid">
        {/* Dual-Line Sales Performance Chart Container */}
        <Card className="dashboard__chart-card" padding="none">
          <div className="dashboard__chart-header">
            <div>
              <div className="dashboard__chart-tag">
                <Radio size={14} className="dashboard__live-icon" />
                <span>REALTIME THROUGHPUT</span>
              </div>
              <h3 className="dashboard__chart-title">Live Sales Velocity & Throughput</h3>
              <p className="dashboard__chart-subtitle">
                Monitoring volume transaksi tiket per jam dan scan masuk RFID di seluruh pintu
              </p>
            </div>

            {/* Time Range Filters */}
            <div className="dashboard__chart-controls">
              <div className="dashboard__time-filter">
                <button
                  type="button"
                  className={`dashboard__time-btn ${timeRange === 'today' ? 'active' : ''}`}
                  onClick={() => setTimeRange('today')}
                >
                  24 Jam Terakhir
                </button>
                <button
                  type="button"
                  className={`dashboard__time-btn ${timeRange === 'week' ? 'active' : ''}`}
                  onClick={() => setTimeRange('week')}
                >
                  Minggu Ini
                </button>
                <button
                  type="button"
                  className={`dashboard__time-btn ${timeRange === 'month' ? 'active' : ''}`}
                  onClick={() => setTimeRange('month')}
                >
                  Bulan Ini
                </button>
                <button
                  type="button"
                  className={`dashboard__time-btn ${timeRange === 'year' ? 'active' : ''}`}
                  onClick={() => setTimeRange('year')}
                >
                  Tahun Ini
                </button>
              </div>
            </div>
          </div>

          {/* SVG Smooth Dual-Line Chart */}
          <div className="dashboard__chart-canvas-wrap">
            <svg
              className="dashboard__svg-chart"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="volumeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="throughputGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                const y = paddingY + ratio * (svgHeight - paddingY * 2);
                return (
                  <line
                    key={ratio}
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    className="dashboard__grid-line"
                  />
                );
              })}

              {/* Gradient Areas */}
              <path d={volumeAreaPath} fill="url(#volumeGrad)" />
              <path d={throughputAreaPath} fill="url(#throughputGrad)" />

              {/* Dual Lines */}
              <path
                d={volumePath}
                fill="none"
                stroke="var(--color-primary-500)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d={throughputPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />

              {/* Data points & Tooltips */}
              {chartData.map((d, i) => {
                const coord = volumePoints[i];
                return (
                  <g
                    key={i}
                    className="dashboard__data-point"
                    onMouseEnter={() => setHoveredPoint({ ...d, ...coord })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={d.isPeak ? 6 : 4}
                      className={d.isPeak ? 'dashboard__peak-circle' : 'dashboard__circle'}
                    />
                    {d.isPeak && (
                      <g className="dashboard__peak-badge">
                        <rect
                          x={coord.x - 75}
                          y={coord.y - 40}
                          width="150"
                          height="28"
                          rx="6"
                          className="dashboard__peak-rect"
                        />
                        <text
                          x={coord.x}
                          y={coord.y - 22}
                          textAnchor="middle"
                          className="dashboard__peak-text"
                        >
                          Puncak: {d.volume} Tiket/Jam
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {chartData.map((d, i) => {
                const coord = volumePoints[i];
                return (
                  <text
                    key={`label-${i}`}
                    x={coord.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    className="dashboard__axis-text"
                  >
                    {d.time}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend & Summary */}
          <div className="dashboard__chart-footer">
            <div className="dashboard__legend">
              <div className="dashboard__legend-item">
                <span className="dashboard__legend-bullet dashboard__legend-bullet--indigo" />
                <span className="dashboard__legend-label">Laju Penjualan Tiket (Tiket/Jam)</span>
              </div>
              <div className="dashboard__legend-item">
                <span className="dashboard__legend-bullet dashboard__legend-bullet--emerald" />
                <span className="dashboard__legend-label">Throughput Pintu RFID (Scan/Jam)</span>
              </div>
            </div>

            <div className="dashboard__chart-peak-summary">
              <Zap size={14} className="text-indigo" />
              <span>Puncak Terkini: <strong>1.820 Tiket/Jam</strong> pada pukul 15:00 WIB</span>
            </div>
          </div>
        </Card>

        {/* Real-time Alerts & Operations Feed */}
        <Card className="dashboard__alerts-card" padding="none">
          <div className="dashboard__alerts-header">
            <div className="dashboard__alerts-title-row">
              <span className="dashboard__live-red-dot" />
              <h3>Aktivitas & Alert</h3>
            </div>
            <button
              type="button"
              className="dashboard__link-btn"
              onClick={() => navigate('/notifications')}
            >
              Lihat Semua (32)
            </button>
          </div>

          <div className="dashboard__alerts-list">
            {notifications.map((item) => (
              <div key={item.id} className={`dashboard__alert-item dashboard__alert-item--${item.type}`}>
                <div className="dashboard__alert-icon-box">
                  {item.type === 'critical' && <AlertTriangle size={15} />}
                  {item.type === 'success' && <CheckCircle2 size={15} />}
                  {item.type === 'warning' && <Radio size={15} />}
                  {item.type === 'info' && <Shield size={15} />}
                </div>
                <div className="dashboard__alert-content">
                  <div className="dashboard__alert-top">
                    <span className="dashboard__alert-title">{item.title}</span>
                    <span className="dashboard__alert-time">{item.time}</span>
                  </div>
                  <p className="dashboard__alert-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard__alerts-footer">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/zones')}
            >
              Buka Turnstile & Scanner Telemetry
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Ticket Zone Management Grid ─────────────────────── */}
      <div className="dashboard__zones-section">
        <div className="dashboard__section-header">
          <div>
            <div className="dashboard__section-tag">VENUE OCCUPANCY & ZONES</div>
            <h2 className="dashboard__section-title">Manajemen Zona & Kapasitas Kursi</h2>
            <p className="dashboard__section-subtitle">
              Stadion Madya GBK — Total 15.000 Kapasitas Kursi Terdistribusi
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={Layers}
            onClick={() => navigate('/zones')}
          >
            Kelola Detail Zona
          </Button>
        </div>

        {/* Segmented Capacity Distribution Bar */}
        <div className="dashboard__capacity-bar-wrap">
          <div className="dashboard__capacity-bar">
            <div style={{ width: '10%' }} className="dashboard__cap-seg dashboard__cap-seg--vip" title="VIP (10%)" />
            <div style={{ width: '33.3%' }} className="dashboard__cap-seg dashboard__cap-seg--fest-a" title="Festival A (33.3%)" />
            <div style={{ width: '36.7%' }} className="dashboard__cap-seg dashboard__cap-seg--fest-b" title="Festival B (36.7%)" />
            <div style={{ width: '13.3%' }} className="dashboard__cap-seg dashboard__cap-seg--tribune" title="Tribune Barat (13.3%)" />
            <div style={{ width: '6.7%' }} className="dashboard__cap-seg dashboard__cap-seg--promo" title="Early Promo (6.7%)" />
          </div>
          <div className="dashboard__capacity-legend">
            <span><span className="dashboard__leg-dot dashboard__cap-seg--vip" /> VIP (10%)</span>
            <span><span className="dashboard__leg-dot dashboard__cap-seg--fest-a" /> Fest A (33.3%)</span>
            <span><span className="dashboard__leg-dot dashboard__cap-seg--fest-b" /> Fest B (36.7%)</span>
            <span><span className="dashboard__leg-dot dashboard__cap-seg--tribune" /> Tribune (13.3%)</span>
            <span><span className="dashboard__leg-dot dashboard__cap-seg--promo" /> Promo (6.7%)</span>
          </div>
        </div>

        {/* Visual Zone Cards Grid */}
        <div className="dashboard__zone-cards-grid">
          {zones.map((zn) => (
            <div key={zn.id} className="dashboard__zone-card">
              <div className="dashboard__zone-top">
                <span className="dashboard__zone-name">{zn.name}</span>
                <span className={`dashboard__zone-badge dashboard__zone-badge--${zn.badgeType}`}>
                  {zn.badge}
                </span>
              </div>
              <div className="dashboard__zone-numbers">
                <span className="dashboard__zone-sold tabular-nums">
                  {formatNumber(zn.sold)}
                </span>
                <span className="dashboard__zone-total tabular-nums">
                  / {formatNumber(zn.capacity)}
                </span>
                <span className="dashboard__zone-pct tabular-nums">
                  ({zn.percentSold}%)
                </span>
              </div>
              <ProgressBar
                value={zn.sold}
                max={zn.capacity}
                color={zn.percentSold >= 100 ? 'rose' : zn.percentSold >= 80 ? 'indigo' : 'emerald'}
                size="sm"
              />
              <div className="dashboard__zone-meta">
                <span className="dashboard__zone-price">{formatCurrency(zn.price)}</span>
                <span className="dashboard__zone-remaining">
                  {zn.remaining === 0 ? 'Habis' : `Sisa ${formatNumber(zn.remaining)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Data Table Component (Active Events / Recent Transactions) ─ */}
      <div className="dashboard__table-section">
        <div className="dashboard__section-header">
          <div>
            <div className="dashboard__cluster-badge">4 CLUSTER UTAMA AKTIF</div>
            <h2 className="dashboard__section-title">Ringkasan Portfolio Event Aktif</h2>
            <p className="dashboard__section-subtitle">
              Pantau konversi kapasitas tiket, performa finansial, dan kesiapan turnstile per venue
            </p>
          </div>

          <div className="dashboard__table-filters">
            <input
              type="text"
              placeholder="Filter nama event..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              className="dashboard__table-search"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="dashboard__table-select"
            >
              <option value="all">Semua Kategori</option>
              <option value="Festival">Festival Musik</option>
              <option value="Conference">Konferensi</option>
              <option value="Seminar">Seminar & Expo</option>
              <option value="Exhibition">Pameran</option>
            </select>
          </div>
        </div>

        {/* Clean Tabular Grid */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DETAIL EVENT & JADWAL</TableHead>
              <TableHead>KATEGORI</TableHead>
              <TableHead>STATUS OPERASIONAL</TableHead>
              <TableHead>TINGKAT KETERISIAN</TableHead>
              <TableHead align="right">AKUMULASI PENDAPATAN</TableHead>
              <TableHead align="center">AKSI CEPAT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((evt) => (
              <TableRow key={evt.id} clickable onClick={() => navigate(`/events/${evt.id}`)}>
                {/* Event Name & Thumbnail */}
                <TableCell>
                  <div className="dashboard__event-cell">
                    <img
                      src={evt.banner}
                      alt={evt.name}
                      className="dashboard__event-thumb"
                    />
                    <div className="dashboard__event-info">
                      <strong className="dashboard__event-name">{evt.name}</strong>
                      <span className="dashboard__event-venue">{evt.venue}</span>
                      <span className="dashboard__event-date">{evt.date} • {evt.time}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <span className="dashboard__cat-chip">{evt.category}</span>
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <StatusBadge status={evt.status} label={evt.statusLabel} />
                </TableCell>

                {/* Tickets Sold Capacity Bar */}
                <TableCell>
                  <div className="dashboard__capacity-cell">
                    <div className="dashboard__capacity-nums">
                      <strong className="tabular-nums">{evt.percentSold}%</strong>
                      <span className="tabular-nums">
                        {formatNumber(evt.ticketsSold)} / {formatNumber(evt.totalCapacity)}
                      </span>
                    </div>
                    <ProgressBar
                      value={evt.ticketsSold}
                      max={evt.totalCapacity}
                      color={evt.percentSold >= 90 ? 'emerald' : evt.percentSold > 0 ? 'indigo' : 'amber'}
                      size="sm"
                    />
                  </div>
                </TableCell>

                {/* Revenue */}
                <TableCell align="right">
                  <div className="dashboard__revenue-cell">
                    <strong className="dashboard__revenue-val tabular-nums">
                      {formatCurrency(evt.revenue)}
                    </strong>
                    {evt.revenueTrend > 0 && (
                      <span className="dashboard__revenue-trend">
                        <TrendingUp size={11} /> +{evt.revenueTrend}%
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Quick Actions */}
                <TableCell align="center">
                  <div className="dashboard__action-btns" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="dashboard__icon-action"
                      title="Lihat Detail"
                      onClick={() => navigate(`/events/${evt.id}`)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="dashboard__icon-action"
                      title="Edit Event"
                      onClick={() => navigate(`/events/${evt.id}/edit`)}
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      type="button"
                      className="dashboard__icon-action"
                      title="Opsi Lain"
                    >
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Table Footer with Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={3}
          totalItems={filteredEvents.length}
          pageSize={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
