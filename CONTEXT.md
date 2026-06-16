# Context

Domain glossary for the LOTR LCG companion app. Implementation details belong in code or ADRs — not here.

## Terms

### Product
A discrete physical release in the LOTR LCG Revised Edition catalogue: the Revised Core Set, a Deluxe expansion, a Saga expansion, or an Adventure Pack. The unit at which the Collection Manager operates. Example: "The Black Riders", "Khazad-dûm", "Revised Core Set". The Revised Core Set is always enabled and non-toggleable — it is the mandatory baseline. App targets Revised Edition only; original Core Set compatibility is out of scope.

### Collection
The set of Products a player has marked as owned in the Collection Manager. Drives visibility gating across the app. Persisted in localStorage. Future: exportable as a base64-encoded QR code for cross-device transfer (no backend required).

### Rule Entry
A single searchable record in the rules reference. Covers keywords (Surge, Sentinel, Ranged), timing rules (action windows), and named mechanics (undefended attack, first player). Every Rule Entry is associated with exactly one Product — the Product whose rulebook introduced it.

Fields: `name`, `type` (keyword | timing | mechanic), `product`, `ref` (rulebook reference number, e.g. "1.34"), `summary` (1-2 sentences, fast answer), `full` (optional longer explanation with examples), `related` (array of Rule Entry names for "see also").

### Keyword
A subtype of Rule Entry that appears verbatim on card text (e.g. Surge, Doomed X, Ranged, Sentinel, Peril). Keywords in the Turn Guide and elsewhere are linkable — tapping one opens its Rule Entry in the Rule Overlay without navigating away. In source data (phases.ts and future content), keywords are marked with `[[Keyword Name]]` syntax and resolved to links at render time. Variable keywords (e.g. Doomed X) use a canonical name with X as placeholder; at render time, numeric instances (Doomed 2, Doomed 3) resolve to the same Rule Entry via pattern matching.

### Turn Guide
The stepthrough of the 7-phase play sequence. Exists in two modes: Guided (new players) and Reference (veterans) against the same content. Steps may contain linked Keywords.

### Rule Overlay
A modal/drawer that displays a Rule Entry on top of whatever screen is currently active. Never triggers a route change. Dismissing it returns the user to exactly where they were. "Related" entries replace the current entry in-place with back navigation to the previous entry — no nested layers.

### Global Search
A persistent search trigger (icon, always visible in the top-right corner on every screen) that opens the Rule Overlay search mode. Typing filters Rule Entries by the active Collection. A "show everything" toggle overrides Collection filtering, revealing Rule Entries and steps from unowned Products.

Content gating behavior: steps or Rule Entries belonging to an unowned Product are hidden entirely — no "not in your collection" indicator. Keywords from unowned Products that appear in visible steps render as plain unlinked text. "Show everything" overrides all of this.
