<!--
  Frame — the physical card's multi-layer border system.

  Renders: outer gold bar → gap → inner rule → content.
  Corner diamonds mark the four structural corners.

  Variants:
    default    — gold frame on dark surface
    encounter  — tactics-red frame (enemy / treachery cards)
    location   — lore-green frame (location cards)
    parchment  — gold frame, parchment interior (player card body)
    section    — wider frame for full-section panels
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'default',
    corners = true,
    class: className = '',
    innerClass = '',
    children,
  }: {
    variant?: 'default' | 'encounter' | 'location' | 'parchment' | 'section';
    corners?: boolean;
    class?: string;
    innerClass?: string;
    children?: Snippet;
  } = $props();
</script>

<div class="frame frame--{variant} {className}">
  {#if corners}
    <span class="frame__corner frame__corner--tl" aria-hidden="true"></span>
    <span class="frame__corner frame__corner--tr" aria-hidden="true"></span>
    <span class="frame__corner frame__corner--bl" aria-hidden="true"></span>
    <span class="frame__corner frame__corner--br" aria-hidden="true"></span>
  {/if}

  <div class="frame__body {innerClass}">
    {@render children?.()}
  </div>
</div>

<style>

.frame {
  position: relative;
  border: var(--frame-width) solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--frame-gap);
  box-shadow: var(--shadow-md);
  transition:
    box-shadow var(--duration-base) var(--ease-out),
    border-color var(--duration-base) var(--ease-out);
}

/* Corner diamond ornaments — gold, the rare precious moment */
.frame__corner {
  position: absolute;
  width: var(--frame-corner-size);
  height: var(--frame-corner-size);
  background: var(--color-gold);
  transform: rotate(45deg);
  z-index: 2;
  display: block;
  transition: background var(--duration-base) var(--ease-out);
}

.frame__corner--tl { top:    calc(var(--frame-corner-size) / -2); left:  calc(var(--frame-corner-size) / -2); }
.frame__corner--tr { top:    calc(var(--frame-corner-size) / -2); right: calc(var(--frame-corner-size) / -2); }
.frame__corner--bl { bottom: calc(var(--frame-corner-size) / -2); left:  calc(var(--frame-corner-size) / -2); }
.frame__corner--br { bottom: calc(var(--frame-corner-size) / -2); right: calc(var(--frame-corner-size) / -2); }

/* Inner rule — faint structural stone line inside the gap */
.frame__body {
  border: var(--frame-inner-width) solid var(--color-border-faint);
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

/* Hover: corners brighten, border lifts slightly */
.frame:hover {
  border-color: oklch(0.56 0.012 64);
  box-shadow: var(--shadow-lg);
}

.frame:hover .frame__corner {
  background: var(--color-gold-bright);
}

/* ── Variants ─────────────────────────────── */

/* Encounter: tactics red */
.frame--encounter {
  border-color: var(--color-tactics-border);
}
.frame--encounter .frame__corner {
  background: var(--color-tactics-border);
}
.frame--encounter .frame__body {
  border-color: oklch(0.46 0.14 28 / 0.38);
}
.frame--encounter:hover {
  border-color: var(--color-tactics);
  box-shadow: var(--shadow-lg), 0 0 20px oklch(0.76 0.17 28 / 0.18);
}
.frame--encounter:hover .frame__corner {
  background: var(--color-tactics);
}

/* Location: lore green */
.frame--location {
  border-color: var(--color-lore-border);
}
.frame--location .frame__corner {
  background: var(--color-lore-border);
}
.frame--location .frame__body {
  border-color: oklch(0.46 0.11 145 / 0.38);
}
.frame--location:hover {
  border-color: var(--color-lore);
  box-shadow: var(--shadow-lg), 0 0 20px oklch(0.76 0.14 145 / 0.18);
}
.frame--location:hover .frame__corner {
  background: var(--color-lore);
}

/* Parchment: gold frame, warm interior */
.frame--parchment {
  background: var(--color-parchment);
  border-color: var(--color-gold-dim);
}
.frame--parchment .frame__corner {
  background: var(--color-gold);
}
.frame--parchment .frame__body {
  border-color: oklch(0.54 0.062 82 / 0.30);
  background: var(--color-parchment);
}
.frame--parchment:hover {
  box-shadow: var(--shadow-lg), var(--shadow-gold-glow);
}
.frame--parchment:hover .frame__corner {
  background: var(--color-gold-bright);
}

/* Section: larger corners for full-panel frames */
.frame--section {
  --frame-corner-size: 20px;
  --frame-width: 2px;
  --frame-gap: 5px;
}

</style>
