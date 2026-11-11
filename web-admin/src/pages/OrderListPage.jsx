import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  CreditCard,
  Building2,
  QrCode,
  Smartphone,
  Eye,
  Mail,
  RotateCcw,
  Copy,
  ChevronDown,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { transactions as initialTransactions } from '../lib/mock-data';
import { formatCurrency, formatDateTime } from '../lib/formatters';
import './OrderListPage.css';

export default function OrderListPage() {
  const [transactionsList, setTransactionsList] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxIds, setSelectedTxIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedTxIds.length === filteredTransactions.length) {
      setSelectedTxIds([]);
    } else {
      setSelectedTxIds(filteredTransactions.map((t) => t.id));
    }
  };

  const toggleSelectTx = (id) => {
    setSelectedTxIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTransactions = transactionsList.filter((tx) => {
    const matchSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.eventName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchMethod = methodFilter === 'all' || tx.methodType === methodFilter;

    return matchSearch && matchStatus && matchMethod;
  });

  return (
    <div className="orders-page">
      {/* ── Top Bar Status ──────────────────────────────────── */}
      <div className="orders-page__status-bar">
        <div className="orders-page__api-tag">
          <Zap size={14} className="text-indigo" />
          <span>MOCK API CONNECTED</span>
          <span className="orders-page__api-route">/src/services/api.js → salesService.getTransactions()</span>
        </div>
        <span className="orders-page__webhook-status">● Webhooks Synced (Latency 48ms)</span>
      </div>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="orders-page__header">
        <div className="orders-page__header-left">
          <div className="orders-page__title-row">
            <h1 className="orders-page__title">Riwayat Transaksi & Penjualan</h1>
            <span className="orders-page__live-badge">Live Feed</span>
          </div>
          <p className="orders-page__subtitle">
            Audit trail seluruh transaksi pembelian tiket, rekonsiliasi payment gateway, dan status pembayaran realtime.
          </p>
        </div>

        <div className="orders-page__header-actions">
          <Button variant="outline" size="md" icon={Download}>
            Export CSV / Excel
          </Button>
          <Button variant="outline" size="md" icon={Printer}>
            Cetak Laporan Penjualan
          </Button>
        </div>
      </div>

      {/* ── 4 Transaction Stat Cards ────────────────────────── */}
      <div className="orders-page__stats-grid">
        <StatCard
          label="TOTAL TRANSAKSI HARI INI"
          value="842 Transaksi"
          trend={18.4}
          trendLabel="vs kemarin"
          icon={History}
          iconColor="indigo"
        />

        <StatCard
          label="GROSS VOLUME TRANSAKSI"
          value="Rp 612.450.000"
          trend={24.1}
          trendLabel="settlement realtime"
          icon={CreditCard}
          iconColor="indigo"
        />

        <StatCard
          label="TRANSAKSI SUKSES"
          value="97.4%"
          subtitle="820 transaksi settled payment"
          icon={CheckCircle2}
          iconColor="emerald"
        >
          <span className="orders-page__stat-meta text-emerald">Ambang normal {'>'} 95%</span>
        </StatCard>

        <StatCard
          label="REFUND / VOID"
          value="0.6%"
          trend={-0.3}
          trendLabel="5 Kasus (Ambang aman < 1.5%)"
          icon={RotateCcw}
          iconColor="amber"
        />
      </div>

      {/* ── Search & Filter Controls ────────────────────────── */}
      <Card className="orders-page__filter-card" padding="md">
        <div className="orders-page__filter-row">
          <div className="orders-page__search-wrap">
            <Search size={16} className="orders-page__search-icon" />
            <input
              type="text"
              placeholder="Cari Order ID (#TX-XXXX), Pembeli, Email, No. HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="orders-page__search-input"
            />
          </div>

          <div className="orders-page__dropdowns">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="orders-page__select"
            >
              <option value="all">Semua Status</option>
              <option value="berhasil">Berhasil (Paid)</option>
              <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
              <option value="gagal">Gagal / Timeout</option>
              <option value="refund">Refund (Selesai)</option>
              <option value="kedaluwarsa">Kedaluwarsa</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="orders-page__select"
            >
              <option value="all">Semua Metode</option>
              <option value="qris">QRIS (GoPay, ShopeePay)</option>
              <option value="va">Virtual Account (BCA, Mandiri)</option>
              <option value="card">Credit Card (Visa/Mastercard)</option>
            </select>

            <div className="orders-page__time-tabs">
              <button
                type="button"
                className={`orders-page__tab-btn ${timeRange === 'today' ? 'active' : ''}`}
                onClick={() => setTimeRange('today')}
              >
                Hari Ini
              </button>
              <button
                type="button"
                className={`orders-page__tab-btn ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                7 Hari
              </button>
              <button
                type="button"
                className={`orders-page__tab-btn ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                30 Hari
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="orders-page__chips-row">
          <span className="orders-page__chips-label">Filter Aktif:</span>
          <span className="orders-page__chip">Rentang: Hari Ini (24 Mei 2025)</span>
          <span className="orders-page__chip">Kanal: Semua Payment Gateway</span>
          <button
            type="button"
            className="orders-page__reset-link"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setMethodFilter('all');
            }}
          >
            Reset Filter
          </button>
        </div>
      </Card>

      {/* ── Transactions Table ──────────────────────────────── */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: '40px' }}>
              <input
                type="checkbox"
                checked={selectedTxIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                onChange={toggleSelectAll}
                className="orders-page__checkbox"
              />
            </TableHead>
            <TableHead>TRANSACTION ID & WAKTU</TableHead>
            <TableHead>DATA PEMBELI</TableHead>
            <TableHead>EVENT & ZONA TIKET</TableHead>
            <TableHead align="center">QTY</TableHead>
            <TableHead align="right">TOTAL PEMBAYARAN</TableHead>
            <TableHead>METODE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead align="center">AKSI OPERASIONAL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((tx) => (
            <TableRow key={tx.id}>
              {/* Checkbox */}
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedTxIds.includes(tx.id)}
                  onChange={() => toggleSelectTx(tx.id)}
                  className="orders-page__checkbox"
                />
              </TableCell>

              {/* Transaction ID & Time */}
              <TableCell>
                <div className="orders-page__id-cell">
                  <strong className="orders-page__tx-id text-indigo">{tx.id}</strong>
                  <span className="orders-page__tx-time">{tx.timestamp}</span>
                </div>
              </TableCell>

              {/* Buyer Data */}
              <TableCell>
                <div className="orders-page__buyer-cell">
                  <strong className="orders-page__buyer-name">{tx.buyerName}</strong>
                  <span className="orders-page__buyer-email">{tx.buyerEmail}</span>
                  <span className="orders-page__buyer-phone">{tx.buyerPhone}</span>
                </div>
              </TableCell>

              {/* Event & Zone */}
              <TableCell>
                <div className="orders-page__event-zone-cell">
                  <strong className="orders-page__event-name">{tx.eventName}</strong>
                  <div className="orders-page__zone-badges">
                    <span className="orders-page__zone-badge">{tx.zone}</span>
                    <span className="orders-page__gate-badge">{tx.gate}</span>
                  </div>
                </div>
              </TableCell>

              {/* Qty */}
              <TableCell align="center">
                <span className="orders-page__qty-badge tabular-nums">
                  {tx.qty} Tiket
                </span>
              </TableCell>

              {/* Amount */}
              <TableCell align="right">
                <div className="orders-page__amount-cell">
                  <strong className="orders-page__amount-val tabular-nums">
                    {formatCurrency(tx.amount)}
                  </strong>
                  <span className="orders-page__fee-sub">
                    Fee: {formatCurrency(tx.fee)}
                  </span>
                </div>
              </TableCell>

              {/* Method */}
              <TableCell>
                <div className="orders-page__method-cell">
                  {tx.methodType === 'qris' && <QrCode size={14} className="text-emerald" />}
                  {tx.methodType === 'va' && <Building2 size={14} className="text-indigo" />}
                  {tx.methodType === 'card' && <CreditCard size={14} className="text-primary" />}
                  <span>{tx.paymentMethod}</span>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusBadge status={tx.status} label={tx.statusLabel} />
              </TableCell>

              {/* Actions */}
              <TableCell align="center">
                <div className="orders-page__action-btns">
                  <button type="button" className="orders-page__icon-btn" title="Lihat E-Pass & Resi">
                    <Eye size={14} />
                  </button>
                  <button type="button" className="orders-page__icon-btn" title="Kirim Ulang Email Resi">
                    <Mail size={14} />
                  </button>
                  <button type="button" className="orders-page__icon-btn" title="Salin Order ID">
                    <Copy size={14} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ── Pagination ──────────────────────────────────────── */}
      <Pagination
        currentPage={currentPage}
        totalPages={149}
        totalItems={1482}
        pageSize={10}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
