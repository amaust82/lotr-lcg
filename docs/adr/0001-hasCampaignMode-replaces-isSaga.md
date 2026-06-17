# ADR 0001 — `hasCampaignMode` replaces `isSaga` on Product

**Status:** Accepted

## Context

The original `isSaga` flag on `Product` was intended to gate the hero-state layer (boons, burdens, fallen heroes) to Saga Expansions (Fellowship, Two Towers, Return of the King). The assumption was that only narrative Saga products had Campaign Mode.

The Revised Core Set and The Dark of Mirkwood both include boon and burden cards and a structured campaign log, but are not Saga Expansions. `isSaga: false` on these products would suppress the hero-state layer incorrectly.

## Decision

Rename `isSaga` → `hasCampaignMode` on the `Product` type. Set `hasCampaignMode: true` on the Revised Core Set, The Dark of Mirkwood, and all campaign/saga expansions.

## Alternatives considered

**Keep `isSaga`, set it to `true` for Core Set and Dark of Mirkwood.** Rejected — misleading; neither is a Saga Expansion. Future readers would be confused by `isSaga: true` on a standalone scenario pack.

**Keep `isSaga`, add a separate `hasCampaignMode` flag.** Rejected — all current `isSaga: true` products would also have `hasCampaignMode: true`. Two flags with identical values add no value today. Can be revisited if Saga-specific behavior (e.g. Ring-bearer tracking) is ever added.

## Consequences

All call sites that read `product.isSaga` must be updated to `product.hasCampaignMode`. The semantic change is intentional — "has campaign mode" is the condition that gates hero-state UI, not "is a Saga book."
