<script lang="ts">
  import Frame from '$lib/components/Frame.svelte';
  import { goto } from '$app/navigation';
  import { playthroughs } from '$lib/stores/playthroughs';
  import { collection } from '$lib/stores/collection';
  import { products } from '$lib/data/rules';
  import { campaigns } from '$lib/data/campaigns';

  const campaignProductIds = new Set(Object.keys(campaigns));

  $: ownedCampaignProducts = products.filter(
    (p) => campaignProductIds.has(p.id) && (p.locked || !!$collection.products[p.id])
  );

  let name = '';
  let productId = '';
  let confirmDeleteId: string | null = null;

  $: if (!productId && ownedCampaignProducts.length > 0) {
    productId = ownedCampaignProducts[0].id;
  }

  function productName(id: string) {
    return products.find((p) => p.id === id)?.name ?? id;
  }

  function scenarioCount(pt: typeof $playthroughs[number]) {
    return campaigns[pt.productId]?.length ?? 0;
  }

  function completedCount(pt: typeof $playthroughs[number]) {
    return pt.scenarios.filter((s) => s.status === 'completed').length;
  }

  function handleCreate() {
    if (!name.trim() || !productId) return;
    const id = crypto.randomUUID();
    playthroughs.createPlaythrough({
      id,
      name: name.trim(),
      productId,
      decks: [],
      scenarios: [],
      createdAt: new Date().toISOString(),
    });
    name = '';
    goto(`/campaigns/${id}`);
  }
</script>

<svelte:head>
  <title>Campaigns — LOTR LCG Wayfellow</title>
</svelte:head>

<div class="page">
  <header class="header">
    <a class="back" href="/">← Home</a>
    <h1 class="title">Campaigns</h1>
  </header>

  {#if $playthroughs.length === 0}
    <p class="empty">No campaigns yet. Start one below.</p>
  {:else}
    <ul class="list">
      {#each [...$playthroughs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) as p (p.id)}
        {@const total = scenarioCount(p)}
        {@const done = completedCount(p)}
        <li class="item">
          <a class="item-link" href="/campaigns/{p.id}">
            <Frame corners={false} class="item-frame">
              <div class="item-body">
                <div class="item-text">
                  <span class="item-name">{p.name}</span>
                  <span class="item-product">{productName(p.productId)}</span>
                </div>
                {#if total > 0}
                  <span class="item-progress">{done}/{total}</span>
                {/if}
              </div>
            </Frame>
          </a>
          <div class="item-actions">
            {#if confirmDeleteId === p.id}
              <button class="btn-confirm" onclick={() => { playthroughs.deletePlaythrough(p.id); confirmDeleteId = null; }}>
                Confirm
              </button>
              <button class="btn-cancel" onclick={() => confirmDeleteId = null}>Cancel</button>
            {:else}
              <button class="btn-delete" onclick={() => confirmDeleteId = p.id} aria-label="Delete {p.name}">
                Delete
              </button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  <section class="create-section">
    <h2 class="create-heading">New Campaign</h2>
    {#if ownedCampaignProducts.length === 0}
      <p class="no-products">
        Add a campaign product to your <a class="no-products-link" href="/collection">Collection</a> first.
      </p>
    {:else}
    <form class="create-form" onsubmit={(e) => { e.preventDefault(); handleCreate(); }}>
      <div class="field">
        <label for="campaign-name" class="label">Name</label>
        <input id="campaign-name" class="input" type="text" bind:value={name} placeholder="e.g. Fellowship of the Ring" />
      </div>
      <div class="field">
        <label for="campaign-product" class="label">Product</label>
        <select id="campaign-product" class="select" bind:value={productId}>
          {#each ownedCampaignProducts as p (p.id)}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </div>
      <button type="submit" class="btn-create" disabled={!name.trim()}>Start Campaign</button>
    </form>
    {/if}
  </section>
</div>

<style>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px 20px 64px;
}

/* ── Header ── */

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back {
  font-family: var(--font-display-sc);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--parchment);
  text-decoration: none;
  text-transform: uppercase;
  flex-shrink: 0;
  opacity: 0.65;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.back:hover { opacity: 1; }

.title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  color: var(--parchment-hi);
  letter-spacing: 0.04em;
  margin: 0;
}

/* ── Campaign list ── */

.empty {
  font-family: var(--font-display-sc);
  font-size: 12px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.6;
  text-align: center;
  padding: 32px 0 40px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-link {
  display: block;
  text-decoration: none;
}

.item-link :global(.item-frame) {
  transition:
    border-color var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}

.item-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.item-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  color: var(--parchment-hi);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-product {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
}

.item-progress {
  flex-shrink: 0;
  font-family: var(--font-display-sc);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--gold);
  white-space: nowrap;
}

.item-actions {
  display: flex;
  gap: 8px;
  padding: 0 4px;
}

.btn-delete {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  background: none;
  border: none;
  padding: 2px 0;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity var(--duration-fast);
}

.btn-delete:hover { opacity: 1; }

.btn-confirm {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: #c04040;
  background: none;
  border: 1px solid color-mix(in srgb, #c04040 40%, transparent);
  border-radius: 4px;
  padding: 3px 10px;
  cursor: pointer;
}

.btn-cancel {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  background: none;
  border: 1px solid color-mix(in srgb, var(--gold) 25%, transparent);
  border-radius: 4px;
  padding: 3px 10px;
  cursor: pointer;
}

/* ── Create section ── */

.create-section {
  border-top: 1px solid color-mix(in srgb, var(--gold) 15%, transparent);
  padding-top: 28px;
}

.no-products {
  font-family: var(--font-display-sc);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.8;
  max-width: none;
}

.no-products-link {
  color: var(--gold);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.create-heading {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  color: var(--parchment);
  letter-spacing: 0.04em;
  margin: 0 0 20px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
}

.input,
.select {
  font-family: var(--font-body, serif);
  font-size: 14px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 22%, transparent);
  border-radius: var(--radius-md);
  padding: 9px 12px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color var(--duration-base);
}

.input:focus,
.select:focus {
  border-color: color-mix(in srgb, var(--gold) 50%, transparent);
}

.input::placeholder {
  color: var(--gold-deep);
  opacity: 0.45;
}

.select option {
  background: var(--canvas);
  color: var(--parchment);
}

.btn-create {
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--parchment-hi);
  background: color-mix(in srgb, var(--gold-deep) 30%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 45%, transparent);
  border-radius: var(--radius-md);
  padding: 11px 20px;
  cursor: pointer;
  align-self: flex-start;
  transition: background var(--duration-base), border-color var(--duration-base);
}

.btn-create:hover:not(:disabled) {
  background: color-mix(in srgb, var(--gold-deep) 42%, var(--canvas));
  border-color: color-mix(in srgb, var(--gold) 65%, transparent);
}

.btn-create:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
