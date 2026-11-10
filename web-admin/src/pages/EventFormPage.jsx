import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Input, { Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { MOCK_EVENTS, KATEGORI_OPTIONS } from '../lib/mock-data';
import './EventFormPage.css';

export default function EventFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: KATEGORI_OPTIONS[0],
    tanggal_mulai: '',
    tanggal_selesai: '',
    tempat: '',
    alamat: '',
    kota: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const existing = MOCK_EVENTS.find((e) => e.id === id);
      if (existing) {
        setFormData({
          judul: existing.judul,
          deskripsi: existing.deskripsi || '',
          kategori: existing.kategori || KATEGORI_OPTIONS[0],
          tanggal_mulai: existing.tanggal_mulai ? existing.tanggal_mulai.substring(0, 16) : '',
          tanggal_selesai: existing.tanggal_selesai ? existing.tanggal_selesai.substring(0, 16) : '',
          tempat: existing.tempat || '',
          alamat: existing.alamat || '',
          kota: existing.kota || '',
        });
      }
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.judul.trim()) errs.judul = 'Judul acara wajib diisi.';
    if (!formData.tempat.trim()) errs.tempat = 'Nama tempat/venue wajib diisi.';
    if (!formData.alamat.trim()) errs.alamat = 'Alamat lengkap wajib diisi.';
    if (!formData.kota.trim()) errs.kota = 'Kota wajib diisi.';
    if (!formData.tanggal_mulai) errs.tanggal_mulai = 'Waktu mulai acara wajib diisi.';
    if (!formData.tanggal_selesai) errs.tanggal_selesai = 'Waktu selesai acara wajib diisi.';

    // BR-EVT-002: end_date must be after start_date
    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      const start = new Date(formData.tanggal_mulai);
      const end = new Date(formData.tanggal_selesai);
      if (end <= start) {
        errs.tanggal_selesai = 'Waktu selesai harus setelah waktu mulai acara.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/events');
    }, 400);
  };

  return (
    <div className="event-form-container">
      <div className="page-header">
        <div className="header-back-group">
          <Link to="/events" className="back-link">
            <ArrowLeft size={18} />
            <span>Kembali ke Daftar Acara</span>
          </Link>
          <h1 className="page-title">{isEdit ? 'Ubah Informasi Acara' : 'Buat Acara Baru'}</h1>
          <p className="page-subtitle">
            {isEdit
              ? 'Perbarui detail informasi, jadwal, dan lokasi acara.'
              : 'Acara baru akan disimpan dengan status DRAF sebelum zona tiket ditambahkan dan diaktifkan.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Main Info */}
          <Card className="form-section-card">
            <CardHeader title="Informasi Utama Acara" />
            <CardContent>
              <Input
                label="Judul Acara"
                placeholder="Contoh: Konser Harmoni Indonesia 2026"
                value={formData.judul}
                onChange={(e) => handleChange('judul', e.target.value)}
                error={errors.judul}
                required
              />

              <div className="form-row-2">
                <Select
                  label="Kategori Acara"
                  value={formData.kategori}
                  onChange={(e) => handleChange('kategori', e.target.value)}
                  options={KATEGORI_OPTIONS.map((k) => ({ value: k, label: k }))}
                  required
                />

                <Input
                  label="Kota Penyelenggaraan"
                  placeholder="Contoh: Jakarta"
                  value={formData.kota}
                  onChange={(e) => handleChange('kota', e.target.value)}
                  error={errors.kota}
                  required
                />
              </div>

              <Textarea
                label="Deskripsi Lengkap"
                placeholder="Jelaskan daya tarik acara, artis/pembicara, dan panduan untuk pengunjung..."
                value={formData.deskripsi}
                onChange={(e) => handleChange('deskripsi', e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Schedule & Location */}
          <Card className="form-section-card">
            <CardHeader title="Jadwal & Lokasi" />
            <CardContent>
              <div className="form-row-2">
                <Input
                  label="Tanggal & Waktu Mulai"
                  type="datetime-local"
                  value={formData.tanggal_mulai}
                  onChange={(e) => handleChange('tanggal_mulai', e.target.value)}
                  error={errors.tanggal_mulai}
                  required
                />

                <Input
                  label="Tanggal & Waktu Selesai"
                  type="datetime-local"
                  value={formData.tanggal_selesai}
                  onChange={(e) => handleChange('tanggal_selesai', e.target.value)}
                  error={errors.tanggal_selesai}
                  required
                />
              </div>

              <Input
                label="Nama Gedung / Tempat (Venue)"
                placeholder="Contoh: Istora Senayan"
                value={formData.tempat}
                onChange={(e) => handleChange('tempat', e.target.value)}
                error={errors.tempat}
                required
              />

              <Textarea
                label="Alamat Lengkap"
                placeholder="Jalan, nomor, kelurahan, kecamatan..."
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                error={errors.alamat}
                rows={2}
                required
              />
            </CardContent>
          </Card>
        </div>

        <div className="form-actions-bar">
          <Link to="/events">
            <Button variant="secondary" size="md">
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            loading={loading}
          >
            {isEdit ? 'Simpan Perubahan' : 'Simpan sebagai Draf'}
          </Button>
        </div>
      </form>
    </div>
  );
}
