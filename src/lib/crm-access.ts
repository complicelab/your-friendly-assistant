export const CRM_ADMIN_EMAIL = "complicelab@gmail.com";

export function isCrmAdministrator(user: { email?: string; email_confirmed_at?: string | null } | null) {
  return user?.email === CRM_ADMIN_EMAIL && Boolean(user.email_confirmed_at);
}

export async function initializeCrmAdministrator(createUser: (attributes: { email: string; email_confirm: false }) => Promise<{ error: { code?: string; message: string } | null }>) {
  const { error } = await createUser({ email: CRM_ADMIN_EMAIL, email_confirm: false });
  if (error && error.code !== "email_exists" && error.code !== "user_already_exists") {
    throw new Error("No fue posible preparar el acceso del administrador.");
  }
}