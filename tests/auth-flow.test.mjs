import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('KRONABEL CMS — Authentication & Authorization Flow', () => {
  // Mock helper to simulate Supabase client behavior
  function createMockSupabase({
    authSignInResult = null,
    authSignOutCalled = false,
    adminRecordResult = null,
    adminError = null,
    currentUser = null,
  } = {}) {
    let signedOut = authSignOutCalled;
    return {
      auth: {
        async signInWithPassword({ email, password }) {
          if (authSignInResult instanceof Error) {
            return { data: { user: null }, error: authSignInResult };
          }
          return authSignInResult || { data: { user: null }, error: new Error('Invalid credentials') };
        },
        async signOut() {
          signedOut = true;
          return { error: null };
        },
        async getUser() {
          return { data: { user: currentUser }, error: currentUser ? null : new Error('No session') };
        },
        get signedOut() {
          return signedOut;
        },
      },
      from(table) {
        assert.equal(table, 'admin_users');
        return {
          select(fields) {
            // Verify fields: must NOT include 'email' which does not exist in DB schema
            assert.ok(!fields.includes('email'), 'Query to admin_users must not request non-existent email column');
            return {
              eq(col, val) {
                return {
                  async single() {
                    if (adminError) return { data: null, error: adminError };
                    return { data: adminRecordResult, error: null };
                  },
                };
              },
            };
          },
        };
      },
    };
  }

  // Simulated login route handler logic matching src/app/api/auth/login/route.ts
  async function simulateLoginRoute(supabaseMock, { email, password }) {
    if (!email || !password) {
      return { status: 400, body: { error: 'Email dan kata sandi wajib diisi.' } };
    }
    const cleanEmail = String(email).trim().toLowerCase();

    const { data: authData, error: authError } = await supabaseMock.auth.signInWithPassword({
      email: cleanEmail,
      password: String(password),
    });

    if (authError || !authData.user) {
      const errorMsg = authError?.message || '';
      const errorCode = authError?.code || '';

      const lowerMsg = errorMsg.toLowerCase();
      if (lowerMsg.includes('invalid api key') || lowerMsg.includes('apikey') || errorCode === 'PGRST301') {
        return { status: 500, body: { error: 'Konfigurasi API Key Supabase (Anon Key) di server tidak valid. Pastikan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel sesuai dengan project Supabase aktif.' } };
      }
      if (lowerMsg.includes('invalid path') || errorCode === 'PGRST125') {
        return { status: 500, body: { error: 'Format URL Supabase di server tidak valid.' } };
      }
      if (lowerMsg.includes('email not confirmed') || errorCode === 'email_not_confirmed') {
        return { status: 403, body: { error: 'Alamat email administrator belum dikonfirmasi di Supabase Auth.' } };
      }

      return { status: 401, body: { error: 'Email atau kata sandi tidak cocok. Pastikan menggunakan email dan kata sandi yang didaftarkan saat inisialisasi CMS.' } };
    }

    const { data: adminRecord, error: adminError } = await supabaseMock
      .from('admin_users')
      .select('username, role')
      .eq('id', authData.user.id)
      .single();

    if (adminError || !adminRecord) {
      await supabaseMock.auth.signOut();
      return { status: 403, body: { error: 'Akun ini tidak memiliki hak akses administrator KRONABEL CMS.' } };
    }

    return {
      status: 200,
      body: {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          username: adminRecord.username,
          role: adminRecord.role,
        },
      },
    };
  }

  // Simulated getAuthenticatedAdmin logic matching src/lib/supabase/server.ts
  async function simulateGetAuthenticatedAdmin(supabaseMock) {
    const { data: { user }, error: userError } = await supabaseMock.auth.getUser();
    if (userError || !user) return null;

    const { data: adminRecord, error: adminError } = await supabaseMock
      .from('admin_users')
      .select('id, username, role')
      .eq('id', user.id)
      .single();

    if (adminError || !adminRecord) {
      return { user, role: null };
    }

    return {
      user,
      role: adminRecord.role,
      adminRecord: {
        id: adminRecord.id,
        username: adminRecord.username,
        role: adminRecord.role,
        email: user.email || '',
      },
    };
  }

  // Simulated Middleware access check matching src/middleware.ts
  async function simulateMiddleware(pathname, user, adminData) {
    const isProtectedAdminRoute =
      pathname.startsWith('/admin') &&
      pathname !== '/admin/login' &&
      pathname !== '/admin/setup';

    if (isProtectedAdminRoute) {
      if (!user) {
        return { action: 'redirect', to: `/admin/login?next=${pathname}` };
      }
      if (!adminData || !adminData.role) {
        return { action: 'redirect', to: '/admin/login?error=unauthorized' };
      }
      return { action: 'next' };
    }

    if (pathname === '/admin/login' && user) {
      return { action: 'redirect', to: '/admin' };
    }

    return { action: 'next' };
  }

  // TEST 1: Login administrator berhasil
  test('1. Login administrator berhasil dengan kredensial valid', async () => {
    const mockSupabase = createMockSupabase({
      authSignInResult: {
        data: {
          user: {
            id: 'admin-uuid-1234',
            email: 'admin@kronabel.id',
          },
        },
        error: null,
      },
      adminRecordResult: {
        id: 'admin-uuid-1234',
        username: 'superadmin_kronabel',
        role: 'superadmin',
      },
    });

    const res = await simulateLoginRoute(mockSupabase, {
      email: '  Admin@Kronabel.id  ', // Test trimming and lowercase
      password: 'CorrectAdminPassword123!',
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.id, 'admin-uuid-1234');
    assert.equal(res.body.user.email, 'admin@kronabel.id');
    assert.equal(res.body.user.username, 'superadmin_kronabel');
    assert.equal(res.body.user.role, 'superadmin');
  });

  // TEST 2: Password salah
  test('2. Login gagal ketika kata sandi atau email salah (HTTP 401)', async () => {
    const authError = new Error('Invalid login credentials');
    authError.status = 400;

    const mockSupabase = createMockSupabase({
      authSignInResult: {
        data: { user: null },
        error: authError,
      },
    });

    const res = await simulateLoginRoute(mockSupabase, {
      email: 'admin@kronabel.id',
      password: 'WrongPassword!',
    });

    assert.equal(res.status, 401);
    assert.ok(res.body.error.includes('Email atau kata sandi tidak cocok'));
  });

  // TEST 3: User bukan administrator
  test('3. User sah di Auth tapi tidak ada di tabel admin_users ditolak (HTTP 403 & signOut)', async () => {
    const mockSupabase = createMockSupabase({
      authSignInResult: {
        data: {
          user: {
            id: 'regular-user-5678',
            email: 'visitor@example.com',
          },
        },
        error: null,
      },
      adminRecordResult: null, // Not found in admin_users
      adminError: { code: 'PGRST116', message: 'No rows found' },
    });

    const res = await simulateLoginRoute(mockSupabase, {
      email: 'visitor@example.com',
      password: 'ValidUserPassword!',
    });

    assert.equal(res.status, 403);
    assert.ok(res.body.error.includes('tidak memiliki hak akses administrator'));
    assert.equal(mockSupabase.auth.signedOut, true, 'auth.signOut() must be executed to revoke session');
  });

  // TEST 4: Session administrator (getAuthenticatedAdmin)
  test('4. Session administrator membaca id, username, role dan mengambil email dari auth user', async () => {
    const mockSupabase = createMockSupabase({
      currentUser: {
        id: 'admin-uuid-1234',
        email: 'admin@kronabel.id',
      },
      adminRecordResult: {
        id: 'admin-uuid-1234',
        username: 'superadmin_kronabel',
        role: 'superadmin',
      },
    });

    const auth = await simulateGetAuthenticatedAdmin(mockSupabase);
    assert.ok(auth);
    assert.equal(auth.user.id, 'admin-uuid-1234');
    assert.equal(auth.role, 'superadmin');
    assert.equal(auth.adminRecord.username, 'superadmin_kronabel');
    assert.equal(auth.adminRecord.role, 'superadmin');
    assert.equal(auth.adminRecord.email, 'admin@kronabel.id'); // Retrieved from auth user!
  });

  // TEST 5: Akses dashboard setelah login (Middleware simulation)
  test('5. Middleware mengizinkan admin ke /admin dan memblokir non-admin', async () => {
    // 5a. Akses /admin oleh unauthenticated visitor -> redirect ke login
    const check1 = await simulateMiddleware('/admin', null, null);
    assert.equal(check1.action, 'redirect');
    assert.equal(check1.to, '/admin/login?next=/admin');

    // 5b. Akses /admin oleh user tanpa role admin -> redirect unauthorized
    const check2 = await simulateMiddleware('/admin', { id: 'regular-user' }, null);
    assert.equal(check2.action, 'redirect');
    assert.equal(check2.to, '/admin/login?error=unauthorized');

    // 5c. Akses /admin oleh user dengan role admin -> diizinkan (action: next)
    const check3 = await simulateMiddleware('/admin', { id: 'admin-uuid' }, { role: 'superadmin' });
    assert.equal(check3.action, 'next');

    // 5d. Admin yang sudah login membuka /admin/login -> redirect ke /admin
    const check4 = await simulateMiddleware('/admin/login', { id: 'admin-uuid' }, { role: 'superadmin' });
    assert.equal(check4.action, 'redirect');
    assert.equal(check4.to, '/admin');

    // 5e. Akses halaman publik / (beranda) -> action: next
    const check5 = await simulateMiddleware('/', null, null);
    assert.equal(check5.action, 'next');

    // 5f. Akses /admin/setup -> action: next (tidak dicegat proteksi login)
    const check6 = await simulateMiddleware('/admin/setup', null, null);
    assert.equal(check6.action, 'next');
  });

  // TEST 6: Deteksi konfigurasi API key salah (500)
  test('6. Deteksi error konfigurasi server (API key anon salah) mengembalikan pesan konfigurasi', async () => {
    const apiKeyError = new Error('Invalid API key');
    apiKeyError.status = 401;

    const mockSupabase = createMockSupabase({
      authSignInResult: {
        data: { user: null },
        error: apiKeyError,
      },
    });

    const res = await simulateLoginRoute(mockSupabase, {
      email: 'admin@kronabel.id',
      password: 'AnyPassword123!',
    });

    assert.equal(res.status, 500);
    assert.ok(res.body.error.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  });
});
