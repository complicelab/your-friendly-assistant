import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentType } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

const mocks=vi.hoisted(()=>({
  getUser:vi.fn(), getSession:vi.fn(), onAuthStateChange:vi.fn(),
  signOut:vi.fn(), updateUser:vi.fn(), resetPasswordForEmail:vi.fn(),
  signInWithPassword:vi.fn(), from:vi.fn(),
}));
vi.mock("@/integrations/supabase/client",()=>({supabase:{auth:mocks,from:mocks.from}}));
vi.mock("@tanstack/react-router",()=>({createFileRoute:()=> (options:unknown)=>({options})}));
import { Route } from "@/routes/admin";

const Page=Route.options.component as ComponentType;
const user={id:"test-admin", email:"complicelab@gmail.com",email_confirmed_at:"2026-11-08T20:00:00Z"};
const session={access_token:"test-recovery-proof",user,expires_at:4102444800} as Session;
let notify:(event:AuthChangeEvent,session:Session|null)=>void;

beforeEach(()=>{
  vi.resetAllMocks();
  window.history.replaceState({},"","/admin");
  mocks.getUser.mockResolvedValue({data:{user:null},error:null});
  mocks.getSession.mockResolvedValue({data:{session:null},error:null});
  mocks.signOut.mockResolvedValue({error:null});
  mocks.updateUser.mockResolvedValue({data:{user},error:null});
  mocks.resetPasswordForEmail.mockResolvedValue({error:null});
  mocks.onAuthStateChange.mockImplementation(callback=>{
    notify=callback;
    return {data:{subscription:{unsubscribe:vi.fn()}}};
  });
});
afterEach(cleanup);

async function recovery(){
  window.history.replaceState({},"","/admin?mode=recovery");
  render(<Page/>);
  mocks.getSession.mockResolvedValue({data:{session},error:null});
  mocks.getUser.mockResolvedValue({data:{user},error:null});
  await act(async()=>notify("PASSWORD_RECOVERY",session));
}
function fill(password="NewTestPassword8",confirmation=password){
  fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"),{target:{value:password}});
  fireEvent.change(screen.getByPlaceholderText("Repite la contraseña"),{target:{value:confirmation}});
}
async function submit(){
  await act(async()=>fireEvent.submit(screen.getByRole("button",{name:"Guardar nueva contraseña"}).closest("form") as HTMLFormElement));
}

describe("/admin password recovery guards",()=>{
  it("sends recovery to /admin?mode=recovery and preserves password login",async()=>{
    render(<Page/>);
    await screen.findByRole("button",{name:"Entrar al CRM"});
    fireEvent.click(screen.getByRole("button",{name:"Olvidé mi contraseña"}));
    await waitFor(()=>expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith("complicelab@gmail.com",{
      redirectTo:window.location.origin+"/admin?mode=recovery",
    }));
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("does not treat an ordinary administrator session plus a URL flag as recovery",async()=>{
    window.history.replaceState({},"","/admin?mode=recovery");
    mocks.getSession.mockResolvedValue({data:{session},error:null});
    mocks.getUser.mockResolvedValue({data:{user},error:null});
    render(<Page/>);
    await act(async()=>notify("INITIAL_SESSION",session));
    fill(); await submit();
    expect(mocks.updateUser).not.toHaveBeenCalled();
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("never reads CRM data during a PASSWORD_RECOVERY session",async()=>{
    await recovery();
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects passwords shorter than eight characters",async()=>{
    await recovery(); fill("1234567"); await submit();
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("rejects a different confirmation",async()=>{
    await recovery(); fill("12345678","12345679"); await submit();
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("rejects a session changed after PASSWORD_RECOVERY",async()=>{
    await recovery();
    mocks.getSession.mockResolvedValue({data:{session:{...session,access_token:"different-session"}},error:null});
    fill(); await submit();
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("rejects an expired session",async()=>{
    await recovery();
    mocks.getSession.mockResolvedValue({data:{session:{...session,expires_at:1}},error:null});
    fill(); await submit();
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("rejects other verified emails",async()=>{
    await recovery();
    mocks.getUser.mockResolvedValue({data:{user:{...user,email:"other@example.com"}},error:null});
    fill(); await submit();
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("updates only the password, signs out and removes recovery after saving",async()=>{
    await recovery(); fill("12345678"); await submit();
    expect(mocks.updateUser).toHaveBeenCalledExactlyOnceWith({password:"12345678"});
    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(window.location.pathname+window.location.search).toBe("/admin");
    expect(mocks.from).not.toHaveBeenCalled();
  });
});