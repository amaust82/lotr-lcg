<script lang="ts">
  import Frame from '$lib/components/Frame.svelte';
  import { collection } from '$lib/stores/collection';
  import { products, rules, REVISED_CORE_SET } from '$lib/data/rules';
  import type { Product } from '$lib/data/rules';

  // Only show products that have at least one rule entry authored for them.
  const productIds = new Set(rules.map((r) => r.product));
  const visibleProducts = products.filter((p) => productIds.has(p.id));
  const expansions = visibleProducts.filter((p) => p.id !== REVISED_CORE_SET.id);
  const coreSet = visibleProducts.find((p) => p.id === REVISED_CORE_SET.id);

  function imageUrl(product: Product) {
    return `/products/${product.image ?? product.id}.png`;
  }

  function isOwned(product: Product): boolean {
    return product.locked || !!$collection.products[product.id];
  }

  function toggle(product: Product) {
    if (product.locked) return;
    collection.setOwned(product.id, !isOwned(product));
  }
</script>

<svelte:head>
  <title>Collection Manager — LOTR LCG Companion</title>
</svelte:head>

<div class="page">
  <header class="header">
    <a class="back" href="/">← Home</a>
    <h1 class="title">Collection</h1>
  </header>

  <div class="show-everything-row">
    <span class="show-everything-label">Show everything</span>
    <button
      class="switch"
      class:switch--on={$collection.showEverything}
      role="switch"
      aria-checked={$collection.showEverything}
      aria-label="Show everything"
      onclick={() => collection.setShowEverything(!$collection.showEverything)}
    >
      <span class="switch-thumb"></span>
    </button>
  </div>

  <ul class="grid">
    {#if coreSet}
      <li class="grid-item grid-item--core">
        <button
          class="tile tile--owned tile--locked"
          aria-pressed={true}
          aria-label={coreSet.name}
          disabled
        >
          <Frame class="tile-frame">
            <div class="tile-body tile-body--horizontal">
              <img
                class="tile-img tile-img--core"
                src={imageUrl(coreSet)}
                alt={coreSet.name}
              />
              <div class="tile-footer tile-footer--side">
                <span class="tile-eyebrow">Always included</span>
                <span class="tile-name tile-name--lg">{coreSet.name}</span>
              </div>
            </div>
          </Frame>
        </button>
      </li>
    {/if}

    {#if expansions.length === 0}
      <li class="empty">No expansions yet.</li>
    {:else}
      {#each expansions as product (product.id)}
        {@const owned = isOwned(product)}
        <li class="grid-item">
          <button
            class="tile"
            class:tile--owned={owned}
            aria-pressed={owned}
            aria-label={product.name}
            onclick={() => toggle(product)}
          >
            <Frame class="tile-frame">
              <div class="tile-body">
                <img
                  class="tile-img"
                  src={imageUrl(product)}
                  alt={product.name}
                />
                <div class="tile-footer">
                  <span class="tile-name">{product.name}</span>
                  {#if owned}
                    <span class="tile-check" aria-hidden="true">✓</span>
                  {/if}
                </div>
              </div>
            </Frame>
          </button>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px 20px 56px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.back {
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--gold-deep);
  text-decoration: none;
  text-transform: uppercase;
}

.title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--parchment-hi);
  letter-spacing: 0.04em;
}

/* ── Show Everything toggle ─────────────────────────────── */

.show-everything-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--gold) 20%, transparent);
  margin-bottom: 24px;
}

.show-everything-label {
  font-family: var(--font-display-sc);
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--parchment);
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--gold-deep) 30%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 35%, transparent);
  padding: 0;
  cursor: pointer;
  transition:
    background var(--duration-base) var(--ease-out),
    border-color var(--duration-base) var(--ease-out);
}

.switch--on {
  background: color-mix(in srgb, var(--gold) 45%, var(--canvas));
  border-color: var(--gold);
}

.switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  background: var(--parchment-lo);
  transition: transform var(--duration-base) var(--ease-out);
}

.switch--on .switch-thumb {
  transform: translateX(20px);
  background: var(--gold-lt);
}

/* ── Product grid ───────────────────────────────────────── */

.grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.grid-item--core {
  grid-column: 1 / -1;
}

.empty {
  grid-column: 1 / -1;
  padding: 32px 0;
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.6;
  text-align: center;
}

/* ── Tile ───────────────────────────────────────────────── */

.tile {
  display: block;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.38;
  filter: grayscale(0.5);
  transition:
    opacity var(--duration-base) var(--ease-out),
    filter var(--duration-base) var(--ease-out);
}

.tile--owned {
  opacity: 1;
  filter: none;
}

.tile--locked {
  cursor: default;
}

.tile:not(.tile--locked):hover {
  opacity: 0.62;
  filter: grayscale(0.2);
}

.tile--owned:not(.tile--locked):hover {
  opacity: 0.88;
}

/* Frame brightens when owned */
.tile--owned :global(.tile-frame) {
  box-shadow: 0 0 20px color-mix(in srgb, var(--gold) 28%, transparent), var(--shadow-md);
}

/* ── Tile body ──────────────────────────────────────────── */

.tile-body {
  display: flex;
  flex-direction: column;
}

.tile-body--horizontal {
  flex-direction: row;
  align-items: stretch;
}

.tile-img {
  width: 100%;
  height: auto;
  display: block;
}

.tile-img--core {
  width: auto;
  height: auto;
  max-height: 240px;
  flex-shrink: 0;
}

.tile-footer {
  padding: 8px 10px 10px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px;
  border-top: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
}

.tile-footer--side {
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-top: none;
  border-left: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
  padding: 16px 20px;
  gap: 6px;
}

.tile-eyebrow {
  font-family: var(--font-display-sc);
  font-size: 9px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold);
  white-space: nowrap;
}

.tile-name {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--parchment);
  line-height: 1.3;
  flex: 1;
}

.tile-name--lg {
  font-size: 14px;
  letter-spacing: 0.14em;
  color: var(--parchment-hi);
  flex: unset;
}

.tile-check {
  font-size: 13px;
  color: var(--gold-lt);
  line-height: 1;
  flex-shrink: 0;
}
</style>
