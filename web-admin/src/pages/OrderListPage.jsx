import React, { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import Table from '../components/ui/Table';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Card, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { MOCK_ORDERS } from '../lib/mock-data';
import { formatRupiah, formatDateTime } from '../lib/formatters';
import './OrderListPage.css';

export default function OrderListPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.no_pesanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.pembeli_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.pembeli_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.acara_judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'no_pesanan',
      label: 'No. Pesanan',
      render: (row) => (
        <span className="order-number-code">{row.no_pesanan}</span>
      ),
    },
    {
      key: 'pembeli_nama',
      label: 'Pembeli',
      render: (row) => (
        <div className="buyer-cell">
          <span className="buyer-name">{row.pembeli_nama}</span>
          <span className="buyer-email">{row.pembeli_email}</span>
        </div>
      ),
    },
    {
      key: 'acara_judul',
      label: 'Acara & Zona',
      render: (row) => (
        <div className="event-zone-cell">
          <span className="event-name">{row.acara_judul}</span>
          <span className="zone-name">{row.zona_nama}</span>
        </div>
      ),
    },
    {
      key: 'jumlah',
      label: 'Jumlah',
      align: 'center',
      render: (row) => `${row.jumlah} tiket`,
    },
    {
      key: 'total',
      label: 'Total Pembayaran',
      align: 'right',
      render: (row) => (
        <span className="font-semibold">{formatRupiah(row.total)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status Pesanan',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'dibuat_pada',
      label: 'Waktu Transaksi',
      render: (row) => (
        <span className="text-secondary">{formatDateTime(row.dibuat_pada)}</span>
      ),
    },
    {
      key: 'aksi',
      label: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          icon={Eye}
          onClick={() => setSelectedOrder(row)}
        >
          Lihat
        </Button>
      ),
    },
  ];

  return (
    <div className="order-list-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Riwayat Pesanan & Penjualan</h1>
          <p className="page-subtitle">
            Daftar seluruh transaksi pesanan tiket, status pembayaran, dan rincian pembeli.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Input
                placeholder="Cari nomor pesanan, nama pembeli, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="status-filter-wrapper">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Semua Status' },
                  { value: 'DIBAYAR', label: 'Dibayar' },
                  { value: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu Pembayaran' },
                  { value: 'DIBATALKAN', label: 'Dibatalkan' },
                  { value: 'KEDALUWARSA', label: 'Kedaluwarsa' },
                ]}
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredOrders}
            keyExtractor={(row) => row.id}
            emptyMessage="Tidak ada transaksi pesanan yang sesuai."
          />
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title="Rincian Pesanan"
        subtitle={selectedOrder?.no_pesanan}
        footer={
          <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
            Tutup
          </Button>
        }
      >
        {selectedOrder && (
          <div className="order-detail-modal-body">
            <div className="detail-status-row">
              <span className="detail-status-label">Status Transaksi:</span>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="modal-info-section">
              <h4 className="modal-section-title">Informasi Pembeli</h4>
              <div className="info-grid">
                <div>
                  <span className="info-label">Nama Lengkap</span>
                  <span className="info-value">{selectedOrder.pembeli_nama}</span>
                </div>
                <div>
                  <span className="info-label">Email Pembeli</span>
                  <span className="info-value">{selectedOrder.pembeli_email}</span>
                </div>
              </div>
            </div>

            <div className="modal-info-section">
              <h4 className="modal-section-title">Detail Acara & Tiket</h4>
              <div className="info-grid">
                <div>
                  <span className="info-label">Acara</span>
                  <span className="info-value">{selectedOrder.acara_judul}</span>
                </div>
                <div>
                  <span className="info-label">Kategori / Zona</span>
                  <span className="info-value">{selectedOrder.zona_nama}</span>
                </div>
                <div>
                  <span className="info-label">Jumlah Tiket</span>
                  <span className="info-value">{selectedOrder.jumlah} tiket</span>
                </div>
                <div>
                  <span className="info-label">Total Pembayaran</span>
                  <span className="info-value text-primary font-bold">
                    {formatRupiah(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-info-section">
              <h4 className="modal-section-title">Riwayat Waktu</h4>
              <div className="info-grid">
                <div>
                  <span className="info-label">Waktu Dipesan</span>
                  <span className="info-value">{formatDateTime(selectedOrder.dibuat_pada)}</span>
                </div>
                <div>
                  <span className="info-label">Batas Waktu Reservasi</span>
                  <span className="info-value">10 Menit sejak dibuat</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
