import { describe, expect, it, vi } from "vitest";
import { initializeCrmAdministrator, isCrmAdministrator } from "@/lib/crm-access";

describe("CRM administrator access", () => {
  it("allows only the confirmed complicelab@gmail.com account", () => {
    expect(isCrmAdministrator({ email: "complicelab@gmail.com", email_confirmed_at: "2026-11-08T20:35:00Z" })).toBe(true);
    expect(isCrmAdministrator({ email: "other@example.com", email_confirmed_at: "2026-11-08T20:35:00Z" })).toBe(false);
  });
  it("requires mailbox verification before CRM access", () => {
    expect(isCrmAdministrator({ email: "complicelab@gmail.com", email_confirmed_at: null })).toBe(false);
    expect(isCrmAdministrator(null)).toBe(false);
  });
  it("initializes only the fixed unconfirmed account", async () => {
    const create = vi.fn().mockResolvedValue({ error: null });
    await initializeCrmAdministrator(create);
    expect(create).toHaveBeenCalledExactlyOnceWith({ email: "complicelab@gmail.com", email_confirm: false });
  });
  it("permits repeat access without resetting an existing account", async () => {
    await expect(initializeCrmAdministrator(vi.fn().mockResolvedValue({ error: { code: "email_exists", message: "Exists" } }))).resolves.toBeUndefined();
    await expect(initializeCrmAdministrator(vi.fn().mockResolvedValue({ error: { code: "unexpected", message: "Failed" } }))).rejects.toThrow();
  });
});