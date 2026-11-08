import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isRecoveryReturn, updateRecoveryPassword } from '@/lib/crm-recovery';

function fixture(email = 'complicelab@gmail.com', token = 'test-recovery-session') {
  const updateUser = vi.fn().mockResolvedValue({ error: null });
  const getUser = vi.fn().mockResolvedValue({ data: { user: { email, email_confirmed_at: '2026-11-08T00:00:00Z' } }, error: null });
  const getSession = vi.fn().mockResolvedValue({ data: { session: { access_token: token } }, error: null });
  return { auth: { updateUser, getUser, getSession } as unknown as SupabaseClient['auth'], updateUser, getUser };
}

describe('CRM password recovery', () => {
  it('recognizes the /admin callback query and SDK recovery hash', () => {
    expect(isRecoveryReturn('https://complicelab.com/admin?recovery=1')).toBe(true);
    expect(isRecoveryReturn('https://complicelab.com/admin#type=recovery')).toBe(true);
    expect(isRecoveryReturn('https://complicelab.com/admin#recovery')).toBe(true);
    expect(isRecoveryReturn('https://complicelab.com/admin')).toBe(false);
  });
  it('requires a recovery event proof even when an administrator is signed in', async () => {
    const { auth, updateUser } = fixture();
    await expect(updateRecoveryPassword(auth, null, '12345678', '12345678')).rejects.toThrow();
    expect(updateUser).not.toHaveBeenCalled();
  });
  it('rejects a replaced or missing recovery session', async () => {
    const { auth, updateUser } = fixture();
    await expect(updateRecoveryPassword(auth, 'different-session', '12345678', '12345678')).rejects.toThrow();
    expect(updateUser).not.toHaveBeenCalled();
  });
  it('only allows the confirmed authorized administrator', async () => {
    const { auth, updateUser } = fixture('other@example.com');
    await expect(updateRecoveryPassword(auth, 'test-recovery-session', '12345678', '12345678')).rejects.toThrow();
    expect(updateUser).not.toHaveBeenCalled();
  });
  it('requires at least 8 characters before updating', async () => {
    const { auth, updateUser } = fixture();
    await expect(updateRecoveryPassword(auth, 'test-recovery-session', '1234567', '1234567')).rejects.toThrow();
    expect(updateUser).not.toHaveBeenCalled();
  });
  it('requires matching confirmation before updating', async () => {
    const { auth, updateUser } = fixture();
    await expect(updateRecoveryPassword(auth, 'test-recovery-session', '12345678', '87654321')).rejects.toThrow();
    expect(updateUser).not.toHaveBeenCalled();
  });
  it('updates a verified recovery session with password only', async () => {
    const { auth, updateUser } = fixture();
    await updateRecoveryPassword(auth, 'test-recovery-session', '12345678', '12345678');
    expect(updateUser).toHaveBeenCalledExactlyOnceWith({ password: '12345678' });
  });
  it('does not report success when the auth service rejects the update', async () => {
    const { auth, updateUser } = fixture();
    updateUser.mockResolvedValue({ error: { message: 'Expired recovery' } });
    await expect(updateRecoveryPassword(auth, 'test-recovery-session', '12345678', '12345678')).rejects.toThrow();
  });
});