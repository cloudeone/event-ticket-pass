import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { events as initialEvents } from '../lib/mock-data';
import { formatCurrency, formatNumber } from '../lib/formatters';
import './EventListPage.css';

export default function EventListPage() {
  const navigate = useNavigate();
  const [eventsList, setEventsList] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [demoState, setDemoState] = useState('data'); // 'data' | 'empty'

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEvents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEvents.map((e) => e.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredEvents = eventsList.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchCategory =
      categoryFilter === 'all' || e.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="event-mgmt-page">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="event-mgmt-page__header">
        <div className="event-mgmt-page__header-left">
          <div className="event-mgmt-page__badge">
            <span>EVENT OPS CORE</span>
            <span>•</span>
            <span className="event-mgmt-page__badge-sub">Active Venue Partition: ID-JKT-01</span>
          </div>
          <h1 className="event-mgmt-page__title">Manajemen Event & Konser</h1>
          <p className="event-mgmt-page__subtitle">
            Buat baru, kelola jadwal, aktifkan tiket, dan arsipkan acara box-office berkapasitas besar.
          </p>
        </div>

        <div className="event-mgmt-page__header-right">
          <div className="event-mgmt-page__kpi-chip">
            <span className="event-mgmt-page__kpi-label">Total Event Aktif</span>
            <strong className="event-mgmt-page__kpi-val">28</strong>
          </div>
          <div className="event-mgmt-page__kpi-chip">
            <span className="event-mgmt-page__kpi-label">Kapasitas Terjual</span>
            <strong className="event-mgmt-page__kpi-val text-emerald">84.2%</strong>
          </div>
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

      {/* ── Search & Filter Bar ─────────────────────────────── */}
      <Card className="event-mgmt-page__filter-card" padding="sm">
        <div className="event-mgmt-page__filter-row">
          <div className="event-mgmt-page__search-wrap">
            <Search size={16} className="event-mgmt-page__search-icon" />
            <input
              type="text"
              placeholder="Cari nama event, venue (GBK, JIExpo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="event-mgmt-page__search-input"
            />
          </div>

          <div className="event-mgmt-page__filters">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="event-mgmt-page__select"
            >
              <option value="all">Semua Status (48)</option>
              <option value="aktif">Aktif / Live</option>
              <option value="draft">Draft Mode</option>
              <option value="selesai">Selesai</option>
              <option value="diarsipkan">Diarsipkan</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="event-mgmt-page__select"
            >
              <option value="all">Semua Kategori</option>
              <option value="Konser">Konser & Festival</option>
              <option value="Konferensi">Konferensi & Expo</option>
              <option value="Olahraga">Olahraga & Kejuaraan</option>
              <option value="Pameran">Exhibition & B2B</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="event-mgmt-page__select"
            >
              <option value="date">Tanggal Terdekat</option>
              <option value="revenue">Pendapatan Tertinggi</option>
              <option value="capacity">Okupansi Tertinggi</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ── Events Data Table ───────────────────────────────── */}
      {demoState === 'empty' || filteredEvents.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={Calendar}
            title="Tidak Ada Event Ditemukan"
            description="Tidak ada event yang cocok dengan kriteria filter pencarian Anda."
            action={
              <Button
                variant="primary"
                size="md"
                icon={Plus}
                onClick={() => navigate('/events/new')}
              >
                Buat Event Pertama
              </Button>
            }
          />
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredEvents.length && filteredEvents.length > 0}
                  onChange={toggleSelectAll}
                  className="event-mgmt-page__checkbox"
                />
              </TableHead>
              <TableHead>EVENT & BANNER</TableHead>
              <TableHead>KATEGORI & LOKASI</TableHead>
              <TableHead>JADWAL ACARA</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>KUOTA TERJUAL</TableHead>
              <TableHead align="right">PENDAPATAN BRUTO</TableHead>
              <TableHead align="center">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((evt) => (
              <TableRow
                key={evt.id}
                clickable
                onClick={() => navigate(`/events/${evt.id}`)}
              >
                {/* Checkbox */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(evt.id)}
                    onChange={() => toggleSelect(evt.id)}
                    className="event-mgmt-page__checkbox"
                  />
                </TableCell>

                {/* Event Name & Thumbnail */}
                <TableCell>
                  <div className="event-mgmt-page__event-cell">
                    <img
                      src={evt.banner}
                      alt={evt.name}
                      className="event-mgmt-page__thumb"
                    />
                    <div className="event-mgmt-page__info">
                      <strong className="event-mgmt-page__name">{evt.name}</strong>
                      <div className="event-mgmt-page__meta-tags">
                        <span className="event-mgmt-page__id-tag">{evt.id}</span>
                        <span className="event-mgmt-page__sync-tag">
                          • {evt.syncStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Category & Location */}
                <TableCell>
                  <div className="event-mgmt-page__loc-cell">
                    <span className="event-mgmt-page__cat-label">{evt.category}</span>
                    <span className="event-mgmt-page__venue-name">
                      <MapPin size={12} className="text-tertiary" />
                      {evt.venue}
                    </span>
                  </div>
                </TableCell>

                {/* Schedule */}
                <TableCell>
                  <div className="event-mgmt-page__schedule-cell">
                    <strong className="event-mgmt-page__schedule-date">{evt.date}</strong>
                    <span className="event-mgmt-page__schedule-time">{evt.time}</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={evt.status} label={evt.statusLabel} />
                </TableCell>

                {/* Quota Sold */}
                <TableCell>
                  <div className="event-mgmt-page__quota-cell">
                    <div className="event-mgmt-page__quota-top">
                      <strong className="tabular-nums">
                        {formatNumber(evt.ticketsSold)}
                      </strong>
                      <span className="tabular-nums">
                        / {formatNumber(evt.totalCapacity)}
                      </span>
                      <span className="event-mgmt-page__quota-pct tabular-nums font-semibold">
                        {evt.percentSold}%
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

                {/* Gross Revenue */}
                <TableCell align="right">
                  <div className="event-mgmt-page__revenue-cell">
                    <strong className="event-mgmt-page__rev-amount tabular-nums">
                      {formatCurrency(evt.revenue)}
                    </strong>
                    {evt.revenueTrend > 0 && (
                      <span className="event-mgmt-page__rev-trend">
                        <TrendingUp size={11} /> +{evt.revenueTrend}%
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                  <div className="event-mgmt-page__action-btns">
                    <button
                      type="button"
                      className="event-mgmt-page__icon-btn"
                      title="Lihat Detail Event"
                      onClick={() => navigate(`/events/${evt.id}`)}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      className="event-mgmt-page__icon-btn"
                      title="Edit Event"
                      onClick={() => navigate(`/events/${evt.id}/edit`)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      type="button"
                      className="event-mgmt-page__icon-btn"
                      title="Opsi Lain"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* ── Pagination ──────────────────────────────────────── */}
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        totalItems={48}
        pageSize={5}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
