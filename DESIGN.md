# Design System: Civix Home Feed
**Project ID:** 13322255773510264676

## 1. Visual Theme & Atmosphere
The Civix platform is designed to be **professional, trustworthy, and modern**. As a civic engagement tool, it balances high visibility with clean, utilitarian accessibility. The atmosphere is "Digital-First" but "Citizen-Centric," using crisp layouts and clear hierarchy to facilitate community action.

## 2. Color Palette & Roles
The palette is dominated by a strong, digital-native primary color supported by clean whites and subtle functional grays.

* **Primary Action Blue (#135bec):** A vibrant, authoritative blue used for primary call-to-actions, active navigation states, and branding highlights.
* **Canvas White (#FFFFFF):** The base background color, providing a clean and high-contrast environment for readability.
* **Text Primary (#1F2937):** A deep charcoal for primary headings and body text, ensuring WCAG-compliant legibility.
* **Subtle Neutral (#F3F4F6):** Used for background sections and secondary containers to provide gentle contrast.

## 3. Typography Rules
The system uses **Public Sans** as its core typeface.

* **Headers:** Semibold weight, used to establish a strong hierarchical anchor for section titles.
* **Body Text:** Regular weight with generous line-height to ensure comfort during long reading sessions of community reports.
* **Metadata/Labels:** Medium weight, slightly reduced size for functional details without sacrificing clarity.

## 4. Component Stylings
* **Buttons:** 
    * **Shape:** Subtly rounded corners (ROUND_EIGHT/8px).
    * **Primary:** Blue (#135bec) background with white text.
    * **Secondary:** Transparent background with blue border or subtle gray background.
* **Cards/Containers:** 
    * **Roundness:** 8px corner radius.
    * **Elevation:** "Whisper-soft" diffused shadows or simple 1px borders to maintain a flat, modern aesthetic.
* **Navigation:** Clean, horizontally aligned tabs or top-bar links using the primary blue for active indicators.

## 5. Layout Principles
* **Whitespace:** Generous padding within cards (24px-32px) and a consistent 64px-80px margin between major sections to prevent visual clutter.
* **Alignment:** Strict left-alignment for text-heavy content (like reports) to follow natural scanning patterns.
* **Grid:** A responsive 12-column system that collapses gracefully for tablet and mobile viewports.

---

## 6. Design System Notes for Stitch Generation
*When prompting Stitch to create new pages for Civix, use these keywords:*

> **"A professional civic-themed UI using Public Sans typography. Use a vibrant primary blue (#135bec) for all major buttons and active states. Containers should have subtle 8px rounded corners. The layout should be airy and clean with high contrast for accessibility."**
