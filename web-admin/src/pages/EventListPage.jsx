import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, MapPin, Eye, Edit2 } from 'lucide-react';
import Table from '../components/ui/Table';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { MOCK_EVENTS } from '../lib/mock-data';
import { formatDateTime } from '../lib/formatters';
import './EventListPage.css';

export default function EventListPage() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.kota.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || evt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'judul',
      label: 'Nama Acara',
      render: (row) => (
        <div className="event-info-cell">
          <Link to={`/events/${row.id}`} className="event-title-link">
            {row.judul}
          </Link>
          <span className="event-category-tag">{row.kategori}</span>
        </div>
      ),
    },
    {
      key: 'tanggal_mulai',
      label: 'Jadwal Acara',
      render: (row) => (
        <div className="event-schedule-cell">
          <span className="event-date">{formatDateTime(row.tanggal_mulai)}</span>
          <span className="event-date-end">s.d. {formatDateTime(row.tanggal_selesai)}</span>
        </div>
      ),
    },
    {
      key: 'tempat',
      label: 'Lokasi & Tempat',
      render: (row) => (
        <div className="event-venue-cell">
          <span className="venue-name">{row.tempat}</span>
          <span className="venue-city">{row.kota}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'aksi',
      label: 'Aksi',
      align: 'right',
      render: (row) => (
        <div className="table-actions">
          <Link to={`/events/${row.id}`}>
            <Button variant="secondary" size="sm" icon={Eye}>
              Detail
            </Button>
          </Link>
          <Link to={`/events/${row.id}/edit`}>
            <Button variant="ghost" size="sm" icon={Edit2}>
              Ubah
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="event-list-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manajemen Acara</h1>
          <p className="page-subtitle">
            Daftar seluruh acara dalam sistem. Kelola zona tiket, publikasi, dan arsip.
          </p>
        </div>
        <div>
          <Link to="/events/new">
            <Button variant="primary" size="md" icon={Plus}>
              Buat Acara Baru
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Input
                placeholder="Cari nama acara atau kota..."
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
                  { value: 'AKTIF', label: 'Aktif' },
                  { value: 'DRAF', label: 'Draf' },
                  { value: 'DIARSIPKAN', label: 'Diarsipkan' },
                ]}
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredEvents}
            keyExtractor={(row) => row.id}
            emptyMessage="Tidak ada acara yang cocok dengan filter."
          />
        </CardContent>
      </Card>
    </div>
  );
}
