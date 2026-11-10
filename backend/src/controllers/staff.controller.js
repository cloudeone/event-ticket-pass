const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');
const { success, error } = require('../utils/response');

/**
 * List staff accounts (FR-STF-001)
 */
const listStaff = async (req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('id, name, email, role, is_active, created_at')
        .eq('role', 'staff')
        .order('created_at', { ascending: false });

      if (dbError) return error(res, dbError.message, 500);
      return success(res, data, 'Daftar petugas berhasil diambil.');
    }

    return success(
      res,
      [
        {
          id: 'b0000000-0000-0000-0000-000000000002',
          name: 'Test Petugas',
          email: 'staff@test.com',
          role: 'staff',
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ],
      'Daftar petugas (Demo Mode).'
    );
  } catch (err) {
    return error(res, 'Gagal memuat daftar petugas.', 500, err.message);
  }
};

/**
 * Create staff account (FR-STF-001)
 */
const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return error(res, 'Nama, email, dan kata sandi wajib diisi.', 400);
    }

    if (password.length < 8) {
      return error(res, 'Kata sandi minimal 8 karakter (BR-AUTH-003).', 400);
    }

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
            role: 'staff',
            is_active: true,
          },
        ])
        .select('id, name, email, role, is_active, created_at')
        .single();

      if (dbError) {
        if (dbError.code === '23505') {
          return error(res, 'Email sudah terdaftar untuk akun lain.', 409);
        }
        return error(res, dbError.message, 500);
      }

      return success(res, data, 'Akun petugas berhasil dibuat.', 201);
    }

    const mockStaff = {
      id: `staff-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: 'staff',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    return success(res, mockStaff, 'Akun petugas berhasil dibuat (Demo Mode).', 201);
  } catch (err) {
    return error(res, 'Gagal membuat akun petugas.', 500, err.message);
  }
};

/**
 * Toggle staff active status (FR-STF-001)
 */
const toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { data: user } = await supabase.from('users').select('is_active').eq('id', id).single();
      if (!user) return error(res, 'Akun petugas tidak ditemukan.', 404);

      const nextStatus = !user.is_active;
      const { data, error: dbError } = await supabase
        .from('users')
        .update({ is_active: nextStatus })
        .eq('id', id)
        .select('id, name, email, role, is_active')
        .single();

      if (dbError) return error(res, dbError.message, 500);
      return success(
        res,
        data,
        `Akun petugas berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}.`
      );
    }

    return success(res, { id, is_active: false }, 'Status akun petugas diperbarui (Demo Mode).');
  } catch (err) {
    return error(res, 'Gagal mengubah status petugas.', 500, err.message);
  }
};

module.exports = {
  listStaff,
  createStaff,
  toggleStaffStatus,
};
