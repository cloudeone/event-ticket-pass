import React, { useState } from 'react';
import {
  Settings,
  Server,
  Zap,
  Shield,
  Key,
  Database,
  Radio,
  CheckCircle2,
  RefreshCw,
  Bell,
  Sliders,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { useTheme } from '../lib/ThemeContext';
import './SettingsPage.css';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [mockActive, setMockActive] = useState(true);
  const [latency, setLatency] = useState('14ms');
  const [rateLimit, setRateLimit] = useState('1000');
  const [autoSync, setAutoSync] = useState(true);

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <div>
          <h1 className="settings-page__title">Pengaturan Sistem & Mock API</h1>
          <p className="settings-page__subtitle">
            Konfigurasi konektivitas server, telemetri gateway, dan preferensi antarmuka
          </p>
        </div>
        <Button variant="primary" size="md">
          Simpan Perubahan
        </Button>
      </div>

      <div className="settings-page__grid">
        {/* API & Telemetry */}
        <Card padding="md">
          <CardHeader
            title="Gateway & Mock Dev Environment"
            subtitle="Konfigurasi mode pengembangan dan simulasi latensi"
            icon={Server}
          />
          <CardContent>
            <div className="settings-page__fields">
              <div className="settings-page__toggle-row">
                <div>
                  <strong>Mock Service Mode</strong>
                  <p>Gunakan generator data lokal tanpa koneksi ke server produksi.</p>
                </div>
                <button
                  type="button"
                  className={`settings-page__switch ${mockActive ? 'active' : ''}`}
                  onClick={() => setMockActive(!mockActive)}
                >
                  <span className="settings-page__switch-dot" />
                </button>
              </div>

              <div className="settings-page__toggle-row">
                <div>
                  <strong>Auto-Refresh Telemetri Gate</strong>
                  <p>Perbarui statistik turnstile setiap 5 detik secara otomatis.</p>
                </div>
                <button
                  type="button"
                  className={`settings-page__switch ${autoSync ? 'active' : ''}`}
                  onClick={() => setAutoSync(!autoSync)}
                >
                  <span className="settings-page__switch-dot" />
                </button>
              </div>

              <div className="settings-page__field-item">
                <label>Simulasi Latensi Jaringan</label>
                <select
                  value={latency}
                  onChange={(e) => setLatency(e.target.value)}
                  className="settings-page__select"
                >
                  <option value="14ms">14ms (Optimal GBK Fast-Track)</option>
                  <option value="120ms">120ms (Simulasi 4G Seluler)</option>
                  <option value="800ms">800ms (High-Latency Warning)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme & Display */}
        <Card padding="md">
          <CardHeader
            title="Tampilan & Preferensi UI"
            subtitle="Pengaturan tema warna dan kepadatan tampilan"
            icon={Sliders}
          />
          <CardContent>
            <div className="settings-page__fields">
              <div className="settings-page__toggle-row">
                <div>
                  <strong>Tema Tampilan: {theme === 'dark' ? 'Mode Gelap (Dark)' : 'Mode Terang (Light)'}</strong>
                  <p>
                    {theme === 'dark'
                      ? 'Deep dark charcoal #0F172A dengan aksen indigo #6366F1'
                      : 'Crisp white #F8FAFC dengan aksen indigo #6366F1'}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                  Ganti ke {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>

              <div className="settings-page__field-item">
                <label>Format Mata Uang</label>
                <input
                  type="text"
                  value="IDR (Indonesian Rupiah — Rp)"
                  disabled
                  className="settings-page__input-disabled"
                />
              </div>

              <div className="settings-page__field-item">
                <label>Zona Waktu Operasional</label>
                <input
                  type="text"
                  value="Asia/Jakarta (WIB — UTC+7)"
                  disabled
                  className="settings-page__input-disabled"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

