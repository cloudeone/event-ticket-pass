import React from 'react';
import { DollarSign, Ticket, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import Table from '../components/ui/Table';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import {
  MOCK_DASHBOARD_METRICS,
  MOCK_EVENT_SUMMARY,
  MOCK_EVENTS,
} from '../lib/mock-data';
import { formatRupiah } from '../lib/formatters';
import './DashboardPage.css';

export default function DashboardPage() {
  const columns = [
    {
      key: 'judul',
      label: 'Nama Acara',
      render: (row) => (
        <div className="table-event-title-cell">
          <Link to={`/events/${row.id}`} className="table-event-link">
            {row.judul}
          </Link>
          <span className="table-event-city">{row.kota}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'tiket_terjual',
      label: 'Tiket Terjual',
      align: 'right',
      render: (row) => Number(row.tiket_terjual).toLocaleString('id-ID'),
    },
    {
      key: 'pendapatan',
      label: 'Pendapatan',
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-primary">
          {formatRupiah(row.pendapatan)}
        </span>
      ),
    },
    {
      key: 'checkin',
      label: 'Check-in',
      align: 'right',
      render: (row) => Number(row.checkin).toLocaleString('id-ID'),
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dasbor Ringkasan</h1>
          <p className="page-subtitle">
            Ringkasan metrik penjualan, kuota terkunci, dan check-in seluruh acara.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/events/new">
            <Button variant="primary" size="md">
              + Buat Acara Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Stat Cards (FR-RPT-002) */}
      <div className="stats-grid">
        <StatCard
          title="Total Pendapatan"
          value={formatRupiah(MOCK_DASHBOARD_METRICS.total_pendapatan)}
          icon={DollarSign}
          trend={{ type: 'up', text: '+12.5% vs bulan lalu' }}
          subtext="Pesanan terbayar (DIBAYAR)"
        />

        <StatCard
          title="Tiket Terjual"
          value={Number(MOCK_DASHBOARD_METRICS.tiket_terjual).toLocaleString('id-ID')}
          icon={Ticket}
          trend={{ type: 'up', text: '+8.3%' }}
          subtext="Tiket aktif diterbitkan"
        />

        <StatCard
          title="Tiket Dikunci"
          value={Number(MOCK_DASHBOARD_METRICS.tiket_dikunci).toLocaleString('id-ID')}
          icon={Lock}
          trend={{ type: 'neutral', text: 'Reservasi 10 mnt' }}
          subtext="Menunggu pembayaran aktif"
        />

        <StatCard
          title="Total Check-in"
          value={Number(MOCK_DASHBOARD_METRICS.total_checkin).toLocaleString('id-ID')}
          icon={CheckCircle2}
          trend={{ type: 'neutral', text: 'Scan sukses' }}
          subtext="Tiket berstatus DIPAKAI"
        />
      </div>

      {/* Per-Event Summary Section */}
      <Card className="mt-8">
        <CardHeader
          title="Ringkasan Performa Acara"
          subtitle="Rincian penjualan dan kehadiran berdasarkan masing-masing acara"
          action={
            <Link to="/events">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                Semua Acara
              </Button>
            </Link>
          }
        />
        <CardContent>
          <Table
            columns={columns}
            data={MOCK_EVENT_SUMMARY}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
