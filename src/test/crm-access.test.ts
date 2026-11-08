import { describe, expect, it } from "vitest";
import { isCrmAdministrator } from "@/lib/crm-access";

describe("CRM administrator access", () => {
  it("allows only the confirmed complicelab@gmail.com account", () => {
    expect(isCrmAdministrator({ email: "complicelab@gmail.com", email_confirmed_at: "2026-11-08T20:35:00Z" })).toBe(true);
    expect(isCrmAdministrator({ email: "other@example.com", email_confirmed_at: "2026-11-08T20:35:00Z" })).toBe(false);
  });
  it("requires mailbox verification before CRM access", () => {
    expect(isCrmAdministrator({ email: "complicelab@gmail.com", email_confirmed_at: null })).toBe(false);
    expect(isCrmAdministrator(null)).toBe(false);
  });
});