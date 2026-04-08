Good — I've read the full source. The `FeedItem` has an `onEdit` button but no `onDelete` at all, and the three-dot menu is just a direct edit redirect with no dropdown. Let me build a complete, prioritized improvement plan with exact code for every fix.Here's the full plan — click any issue card to expand the exact fix with code. Here's a quick summary of what each one does:

**Critical (do first)**
- **#1 — Delete/Edit dropdown:** The `MoreHorizontal` button currently jumps straight to edit. The fix adds a proper dropdown with Edit + Delete options and a confirmation modal before deleting. Also wires `onDelete` all the way through to `deleteReport()` in the API.

**Important (do next)**
- **#2 — Tag filtering:** Right now clicking a tag downloads *all* reports and filters in the browser. Pass `tag` as a query param to the backend instead.
- **#3 — Error handling:** Every `catch` block silently logs. Adding a reusable toast system gives users actual feedback when something fails.
- **#4 — `any` types:** `updateProfile(data: any)` and `mapRef: any` — both have proper types available (`UpdateProfileData`, `MapRef`).
- **#5 — Console logs:** Remove the Mapbox token debug lines, or add `drop: ['console']` to Vite's esbuild config to strip them in prod automatically.

**Enhancements**
- **#6 — Default location:** Auto-detect on load, fall back to Delhi only if geolocation is denied.
- **#7 — Status updates:** Let report owners change their report's status directly from the three-dot menu.

**Quality**
- **#8 — Tests:** Install Vitest + React Testing Library, start with service functions.
- **#9 — Commit the backend:** The `civix-server` is missing from the repo — hit the "Generate the full backend" button on that card if you want Claude to write it.

Use the tabs to filter by category, and use the **"Ask Claude ↗" buttons** inside each card to generate the full implementation for any fix.