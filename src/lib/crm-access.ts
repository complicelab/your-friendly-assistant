export const CRM_ADMIN_EMAIL = "complicelab@gmail.com";

export function isCrmAdministrator(user: { email?: string | undefined; email_confirmed_at?: string | null | undefined } | null) {
  return user?.email === CRM_ADMIN_EMAIL && Boolean(user.email_confirmed_at);
}
