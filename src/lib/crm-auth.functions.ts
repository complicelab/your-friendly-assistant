import { createServerFn } from "@tanstack/react-start";
import { initializeCrmAdministrator } from "./crm-access";

// Public bootstrap has no caller-selected email, confirmation, role or token output.
// It can only create the fixed unconfirmed account; mailbox verification remains mandatory.
export const prepareCrmAccess = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await initializeCrmAdministrator((attributes) => supabaseAdmin.auth.admin.createUser(attributes));
  return { ok: true };
});