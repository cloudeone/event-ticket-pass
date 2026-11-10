const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { success, error } = require('../utils/response');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Registrasi Pembeli (FR-AUTH-001)
 * Hanya menghasilkan role 'buyer' (BR-AUTH-002)
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return error(res, 'Nama, email, dan kata sandi wajib diisi.', 400);
    }

    if (password.length < 8) {
      return error(res, 'Kata sandi minimal 8 karakter (BR-AUTH-003).', 400);
    }

    // Hash password (BR-AUTH-003)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('users')
        .insert([
          {
            name,
            email: email.toLowerCase(),
            password_hash,
            role: 'buyer',
            is_active: true,
          },
        ])
        .select('id, name, email, role, is_active, created_at')
        .single();

      if (dbError) {
        if (dbError.code === '23505') {
          return error(res, 'Email sudah terdaftar. Silakan gunakan email lain.', 409);
        }
        return error(res, 'Gagal mendaftar: ' + dbError.message, 500);
      }

      return success(res, data, 'Registrasi akun pembeli berhasil.', 201);
    }

    // Local / Mock fallback if Supabase not configured
    const mockUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: 'buyer',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    return success(res, mockUser, 'Registrasi akun pembeli berhasil (Demo Mode).', 201);
  } catch (err) {
    return error(res, 'Terjadi kesalahan server saat registrasi.', 500, err.message);
  }
};

/**
 * Login Pengguna (FR-AUTH-002)
 * Pembeli & Petugas di Mobile; Admin di Web (BR-AUTH-004)
 */
const login = async (req, res) => {
  try {
    const { email, password, platform } = req.body;

    if (!email || !password) {
      return error(res, 'Email dan kata sandi wajib diisi.', 400);
    }

    let user = null;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (dbError || !data) {
        // BR-AUTH-005: Generic message
        return error(res, 'Email atau kata sandi tidak valid.', 401);
      }

      const isValidPassword = await bcrypt.compare(password, data.password_hash);
      if (!isValidPassword) {
        return error(res, 'Email atau kata sandi tidak valid.', 401);
      }

      user = data;
    } else {
      // Mock credentials for demo
      if (email === 'admin@eventpass.com' && password === 'Admin123!') {
        user = {
          id: 'a0000000-0000-0000-0000-000000000001',
          name: 'Admin Event Pass',
          email: 'admin@eventpass.com',
          role: 'admin',
          is_active: true,
        };
      } else if (email === 'staff@test.com' && password === 'Test1234!') {
        user = {
          id: 'b0000000-0000-0000-0000-000000000002',
          name: 'Test Petugas',
          email: 'staff@test.com',
          role: 'staff',
          is_active: true,
        };
      } else if (email === 'buyer@test.com' && password === 'Test1234!') {
        user = {
          id: 'b0000000-0000-0000-0000-000000000001',
          name: 'Test Buyer',
          email: 'buyer@test.com',
          role: 'buyer',
          is_active: true,
        };
      } else {
        return error(res, 'Email atau kata sandi tidak valid.', 401);
      }
    }

    // BR-AUTH-006: Inactive check
    if (!user.is_active) {
      return error(res, 'Akun Anda dinonaktifkan. Hubungi administrator.', 403);
    }

    // BR-AUTH-004: Platform check
    if (platform === 'web' && user.role !== 'admin') {
      return error(res, 'Akun ini tidak dapat digunakan di portal Web Admin.', 403);
    }
    if (platform === 'mobile' && user.role === 'admin') {
      return error(res, 'Akun Admin tidak diizinkan masuk di aplikasi mobile.', 403);
    }

    // Issue JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return success(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'Login berhasil.'
    );
  } catch (err) {
    return error(res, 'Terjadi kesalahan server saat login.', 500, err.message);
  }
};

/**
 * Get Current User (FR-AUTH-002)
 */
const getMe = async (req, res) => {
  return success(res, req.user, 'Data sesi pengguna aktif.');
};

module.exports = {
  register,
  login,
  getMe,
};
