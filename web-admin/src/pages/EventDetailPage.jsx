import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Plus,
  CheckCircle,
  Archive,
  Edit,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { MOCK_EVENTS, MOCK_ZONES } from '../lib/mock-data';
import { formatRupiah, formatDateTime } from '../lib/formatters';
import './EventDetailPage.css';

export default function EventDetailPage() {
  const { id } = useParams();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];

  const [eventStatus, setEventStatus] = useState(event.status);
  const [zones, setZones] = useState(
    MOCK_ZONES.filter((z) => z.acara_id === event.id)
  );

  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [newZone, setNewZone] = useState({
    nama: '',
    harga: '',
    kuota: '',
    deskripsi: '',
  });
  const [zoneError, setZoneError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Status transitions
  const handleActivate = () => {
    // BR-EVT-003: Must have at least 1 active zone
    if (zones.length === 0) {
      setStatusMessage('Gagal: Acara harus memiliki minimal 1 zona tiket sebelum diaktifkan.');
      return;
    }
    setEventStatus('AKTIF');
    setStatusMessage('Acara berhasil diaktifkan dan kini dapat dipesan oleh pembeli.');
  };

  const handleArchive = () => {
    setEventStatus('DIARSIPKAN');
    setStatusMessage('Acara telah diarsipkan. Tiket yang sudah dibeli tetap sah untuk check-in.');
  };

  const handleAddZone = (e) => {
    e.preventDefault();
    setZoneError('');

    if (!newZone.nama.trim() || !newZone.harga || !newZone.kuota) {
      setZoneError('Nama zona, harga, dan kuota wajib diisi.');
      return;
    }

    const priceNum = parseInt(newZone.harga, 10);
    const quotaNum = parseInt(newZone.kuota, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      setZoneError('Harga harus berupa angka lebih dari 0.');
      return;
    }
    if (isNaN(quotaNum) || quotaNum < 1) {
      setZoneError('Kuota harus minimal 1 tiket.');
      return;
    }

    const created = {
      id: `zone-${Date.now()}`,
      acara_id: event.id,
      nama: newZone.nama,
      harga: priceNum,
      kuota: quotaNum,
      terisi: 0,
      deskripsi: newZone.deskripsi,
    };

    setZones((prev) => [...prev, created]);
    setIsZoneModalOpen(false);
    setNewZone({ nama: '', harga: '', kuota: '', deskripsi: '' });
  };

  const zoneColumns = [
    {
      key: 'nama',
      label: 'Nama Zona Tiket',
      render: (row) => (
        <div>
          <span className="font-semibold">{row.nama}</span>
          {row.deskripsi && <p className="zone-desc">{row.deskripsi}</p>}
        </div>
      ),
    },
    {
      key: 'harga',
      label: 'Harga Satuan',
      render: (row) => formatRupiah(row.harga),
    },
    {
      key: 'kuota',
      label: 'Total Kuota',
      align: 'right',
      render: (row) => Number(row.kuota).toLocaleString('id-ID'),
    },
    {
      key: 'terisi',
      label: 'Terjual',
      align: 'right',
      render: (row) => Number(row.terisi || 0).toLocaleString('id-ID'),
    },
    {
      key: 'sisa',
      label: 'Sisa Kuota',
      align: 'right',
      render: (row) => {
        const sisa = row.kuota - (row.terisi || 0);
        return (
          <span className={sisa <= 0 ? 'text-danger font-semibold' : 'text-success font-semibold'}>
            {sisa.toLocaleString('id-ID')}
          </span>
        );
      },
    },
  ];

  return (
    <div className="event-detail-container">
      {/* Back Link */}
      <div className="mb-4">
        <Link to="/events" className="back-link">
          <ArrowLeft size={18} />
          <span>Kembali ke Daftar Acara</span>
        </Link>
      </div>

      {/* Alert message if any */}
      {statusMessage && (
        <div className="detail-status-banner">
          <span>{statusMessage}</span>
          <button className="banner-dismiss" onClick={() => setStatusMessage('')}>
            ×
          </button>
        </div>
      )}

      {/* Header Info Card */}
      <Card className="event-hero-card">
        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-status-row">
              <StatusBadge status={eventStatus} />
              <span className="hero-category">{event.kategori}</span>
            </div>
            <h1 className="hero-title">{event.judul}</h1>
            <p className="hero-desc">{event.deskripsi}</p>

            <div className="hero-meta-grid">
              <div className="meta-item">
                <Calendar size={18} className="meta-icon" />
                <div>
                  <span className="meta-label">Jadwal Acara</span>
                  <span className="meta-value">
                    {formatDateTime(event.tanggal_mulai)} s.d. {formatDateTime(event.tanggal_selesai)}
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <MapPin size={18} className="meta-icon" />
                <div>
                  <span className="meta-label">Lokasi / Venue</span>
                  <span className="meta-value">{event.tempat}, {event.kota}</span>
                  <span className="meta-subvalue">{event.alamat}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            {eventStatus === 'DRAF' && (
              <Button
                variant="primary"
                size="md"
                icon={CheckCircle}
                onClick={handleActivate}
              >
                Aktifkan Acara
              </Button>
            )}

            {eventStatus === 'AKTIF' && (
              <Button
                variant="secondary"
                size="md"
                icon={Archive}
                onClick={handleArchive}
              >
                Arsipkan Acara
              </Button>
            )}

            {eventStatus === 'DIARSIPKAN' && (
              <Button
                variant="outline"
                size="md"
                icon={CheckCircle}
                onClick={handleActivate}
              >
                Aktifkan Kembali
              </Button>
            )}

            <Link to={`/events/${event.id}/edit`}>
              <Button variant="ghost" size="md" icon={Edit}>
                Ubah Data
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Ticket Zones Section */}
      <Card className="mt-6">
        <CardHeader
          title="Zona & Kategori Tiket"
          subtitle="Setiap acara memiliki kategori tiket (VIP, Regular, dll) dengan harga dan kuota tersendiri."
          action={
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsZoneModalOpen(true)}
            >
              Tambah Zona Tiket
            </Button>
          }
        />
        <CardContent>
          <Table
            columns={zoneColumns}
            data={zones}
            keyExtractor={(row) => row.id}
            emptyMessage="Belum ada zona tiket. Tambahkan zona agar acara dapat diaktifkan."
          />
        </CardContent>
      </Card>

      {/* Add Zone Modal */}
      <Modal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        title="Tambah Zona Tiket Baru"
        subtitle={`Tambahkan tier tiket untuk acara ${event.judul}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsZoneModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleAddZone}>
              Simpan Zona
            </Button>
          </>
        }
      >
        {zoneError && <div className="modal-error-alert">{zoneError}</div>}

        <Input
          label="Nama Zona / Kategori"
          placeholder="Contoh: VIP Pass, Festival Standing"
          value={newZone.nama}
          onChange={(e) => setNewZone({ ...newZone, nama: e.target.value })}
          required
        />

        <div className="form-row-2">
          <Input
            label="Harga Tiket (Rp)"
            type="number"
            placeholder="Contoh: 250000"
            value={newZone.harga}
            onChange={(e) => setNewZone({ ...newZone, harga: e.target.value })}
            required
          />

          <Input
            label="Kapasitas Kuota"
            type="number"
            placeholder="Contoh: 500"
            value={newZone.kuota}
            onChange={(e) => setNewZone({ ...newZone, kuota: e.target.value })}
            required
          />
        </div>

        <Input
          label="Keterangan Fasilitas (Opsional)"
          placeholder="Contoh: Termasuk minuman gratis dan tempat duduk depan"
          value={newZone.deskripsi}
          onChange={(e) => setNewZone({ ...newZone, deskripsi: e.target.value })}
        />
      </Modal>
    </div>
  );
}
