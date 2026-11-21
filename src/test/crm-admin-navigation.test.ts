import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("CRM admin navigation deployment guard", () => {
  const admin = readFileSync("src/routes/admin.tsx", "utf8");
  const settings = readFileSync("src/components/crm/calendar-connection-settings.tsx", "utf8");
  it("keeps Clientes in the admin navigation and renders its independent list", () => {
    expect(admin).toContain('setView("clientes")');
    expect(admin).toContain(">Clientes</button>");
    expect(admin).toContain('<CrmClientsList onOpen={');
    expect(admin).toContain('import { CrmClientsList } from "@/components/crm/clients-list";');
  });
  it("keeps Google Calendar inside Configuración and with explicit link control", () => {
    expect(admin).toContain('<CalendarConnectionSettings/>');
    expect(settings).toContain("Enlazar Google Calendar");
    expect(settings).toContain("Sincronizar ahora");
    expect(settings).toContain("complicelab@gmail.com");
  });
});
