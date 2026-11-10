import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Lock, Mail } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@eventpass.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Demo validation according to PRD / seed
      if (email === 'admin@eventpass.com' && password === 'Admin123!') {
        const adminData = {
          id: 'a0000000-0000-0000-0000-000000000001',
          name: 'Admin Event Pass',
          email: 'admin@eventpass.com',
          role: 'admin',
        };
        localStorage.setItem('admin_token', 'mock_jwt_token_admin_event_pass_xyz');
        localStorage.setItem('admin_user', JSON.stringify(adminData));
        navigate('/');
      } else {
        // BR-AUTH-005: Generic error message
        setError('Email atau kata sandi tidak valid.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Ticket size={28} />
          </div>
          <h1 className="login-title">Event & Ticket Pass</h1>
          <p className="login-subtitle">Portal Administrator & Operasional</p>
        </div>

        <div className="login-alert-info">
          <span>Kredensial Default:</span>
          <code>admin@eventpass.com</code> / <code>Admin123!</code>
        </div>

        {error && (
          <div className="login-alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Email Admin"
            type="email"
            placeholder="admin@eventpass.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Input
            label="Kata Sandi"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Masuk ke Portal
          </Button>
        </form>

        <div className="login-footer">
          <p>Hanya untuk peran Admin. Pembeli dan Petugas silakan gunakan aplikasi mobile.</p>
        </div>
      </div>
    </div>
  );
}
