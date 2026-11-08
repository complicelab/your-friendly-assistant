import type { SupabaseClient } from '@supabase/supabase-js';
import { isCrmAdministrator } from './crm-access';
import { validatePassword } from './crm-model';

export function isRecoveryReturn(url: string) {
  const parsed = new URL(url);
  const hash = new URLSearchParams(parsed.hash.slice(1));
  return parsed.searchParams.get('recovery') === '1' || hash.get('type') === 'recovery' || parsed.hash === '#recovery';
}

// The proof is captured only from PASSWORD_RECOVERY, never from a URL flag or stored login.
export async function updateRecoveryPassword(auth: SupabaseClient['auth'], proof: string | null, password: string, confirmation: string) {
  const validation = validatePassword(password, confirmation);
  if (validation) throw new Error(validation);
  if (!proof) throw new Error('Este enlace no permite restablecer la contraseña. Solicita uno nuevo.');
  const { data: sessionData, error: sessionError } = await auth.getSession();
  if (sessionError || sessionData.session?.access_token !== proof) throw new Error('La sesión de recuperación ya no es válida. Solicita un nuevo enlace.');
  const { data, error } = await auth.getUser();
  if (error || !isCrmAdministrator(data.user)) throw new Error('La sesión de recuperación ya no es válida. Solicita un nuevo enlace.');
  const { error: updateError } = await auth.updateUser({ password });
  if (updateError) throw new Error('No pude guardar la contraseña. Elige otra contraseña o solicita un nuevo enlace.');
}