<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- CRM uses the generated Cloud client for verified administrator sessions and RLS CRUD; isolated modules in src/components/crm own private UI and src/lib/crm-model owns validated rules. No account bootstrap or privileged browser client is needed for the existing administrator.

- Keep v10 comparison scene replacements in `src/data/compare`; transform only the two right-hand scene producers before the original script boots so its navigation, timers, and animation runner remain the sole rendering owner.
- Keep the eight-step system flow replacements in `src/data/flow`, replacing only selected ST h() producers before v10 boots; the original go(), run() and timer pool own rendering and autoplay, while delegated handlers manage manual interactions.
- Keep Marketing phone styles and its single state/timer owner in `src/data/marketing`; remove only the bounded legacy Marketing closure before v10 boots to avoid duplicate observers and preserve all other demos.
