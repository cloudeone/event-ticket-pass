import React, { useState } from 'react';
import { Plus, UserCheck, UserX, Search } from 'lucide-react';
import Table from '../components/ui/Table';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import { MOCK_STAFF } from '../lib/mock-data';
import { formatDate } from '../lib/formatters';
import './StaffListPage.css';

export default function StaffListPage() {
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const filteredStaff = staffList.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, aktif: !s.aktif } : s))
    );
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nama.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Nama, email, dan kata sandi awal wajib diisi.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Kata sandi minimal 8 karakter (BR-AUTH-003).');
      return;
    }

    // Check duplicate email
    if (staffList.some((s) => s.email.toLowerCase() === formData.email.toLowerCase())) {
      setError('Email sudah terdaftar untuk petugas lain.');
      return;
    }

    const created = {
      id: `staff-${Date.now()}`,
      nama: formData.nama,
      email: formData.email,
      peran: 'PETUGAS',
      aktif: true,
      dibuat_pada: new Date().toISOString(),
    };

    setStaffList((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setFormData({ nama: '', email: '', password: '' });
  };

  const columns = [
    {
      key: 'nama',
      label: 'Nama Petugas',
      render: (row) => (
        <div className="staff-name-cell">
          <span className="staff-name">{row.nama}</span>
          <span className="staff-role-badge">Petugas Check-in</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email Akun',
      render: (row) => <span className="staff-email">{row.email}</span>,
    },
    {
      key: 'aktif',
      label: 'Status Akun',
      render: (row) => (
        <StatusBadge status={row.aktif ? 'AKTIF' : 'NONAKTIF'} />
      ),
    },
    {
      key: 'dibuat_pada',
      label: 'Terdaftar Sejak',
      render: (row) => formatDate(row.dibuat_pada),
    },
    {
      key: 'aksi',
      label: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant={row.aktif ? 'secondary' : 'outline'}
          size="sm"
          icon={row.aktif ? UserX : UserCheck}
          onClick={() => handleToggleStatus(row.id)}
        >
          {row.aktif ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
      ),
    },
  ];

  return (
    <div className="staff-list-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Akun Petugas Check-in</h1>
          <p className="page-subtitle">
            Admin mendaftarkan akun petugas lapangan untuk memindai tiket QR di venue acara.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            Tambah Petugas
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Input
                placeholder="Cari nama atau email petugas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredStaff}
            keyExtractor={(row) => row.id}
            emptyMessage="Tidak ada akun petugas yang cocok."
          />
        </CardContent>
      </Card>

      {/* Create Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Akun Petugas Baru"
        subtitle="Akun ini hanya dapat login ke aplikasi mobile dalam mode Petugas."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleCreateStaff}>
              Simpan Akun
            </Button>
          </>
        }
      >
        {error && <div className="modal-error-alert">{error}</div>}

        <Input
          label="Nama Lengkap Petugas"
          placeholder="Contoh: Riko Kurniawan"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          required
        />

        <Input
          label="Email Petugas"
          type="email"
          placeholder="petugas@eventpass.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Kata Sandi Awal"
          type="password"
          placeholder="Minimal 8 karakter"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          helperText="Bagikan kata sandi ini langsung kepada petugas terkait."
          required
        />
      </Modal>
    </div>
  );
}
