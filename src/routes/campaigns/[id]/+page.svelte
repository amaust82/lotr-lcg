<script lang="ts">
  import { nanoid } from 'nanoid';
  import type { PageData } from './$types';
  import { playthroughs } from '$lib/stores/playthroughs';
  import { campaigns } from '$lib/data/campaigns';
  import { products } from '$lib/data/rules';
  import type { ScenarioRecord } from '$lib/types/playthrough';

  let { data }: { data: PageData } = $props();

  const playthrough = $derived($playthroughs.find((p) => p.id === data.id) ?? null);
  const campaignScenarios = $derived(playthrough ? (campaigns[playthrough.productId] ?? []) : []);
  const product = $derived(playthrough ? products.find((p) => p.id === playthrough.productId) ?? null : null);
  const productName = $derived(product?.name ?? playthrough?.productId ?? '');
  const isSaga = $derived(product?.isSaga ?? false);
  const completedCount = $derived(
    playthrough ? playthrough.scenarios.filter((s) => s.status === 'completed').length : 0
  );
  const totalCount = $derived(campaignScenarios.length);
  const progressPct = $derived(totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

  function getRecord(scenarioId: string): ScenarioRecord | undefined {
    return playthrough?.scenarios.find((s) => s.scenarioId === scenarioId);
  }

  function getStatus(scenarioId: string) {
    return getRecord(scenarioId)?.status ?? 'not_attempted';
  }

  function getNotes(scenarioId: string) {
    return getRecord(scenarioId)?.notes ?? '';
  }

  function upsertScenario(scenarioId: string, patch: Partial<ScenarioRecord>) {
    if (!playthrough) return;
    const existing = playthrough.scenarios.find((s) => s.scenarioId === scenarioId);
    const updated: ScenarioRecord = existing
      ? { ...existing, ...patch }
      : { scenarioId, status: 'not_attempted', ...patch };
    const newScenarios = existing
      ? playthrough.scenarios.map((s) => (s.scenarioId === scenarioId ? updated : s))
      : [...playthrough.scenarios, updated];
    playthroughs.updatePlaythrough(playthrough.id, { scenarios: newScenarios });
  }

  function cycleStatus(scenarioId: string) {
    const current = getStatus(scenarioId);
    const next =
      current === 'not_attempted' ? 'completed' :
      current === 'completed' ? 'failed' :
      'not_attempted';
    upsertScenario(scenarioId, { status: next });
  }

  function handleNotes(scenarioId: string, e: Event) {
    const value = (e.target as HTMLTextAreaElement).value;
    upsertScenario(scenarioId, { notes: value });
  }

  const STATUS_LABEL: Record<string, string> = {
    not_attempted: '—',
    completed: '✓',
    failed: '✕',
  };

  function addDeck() {
    if (!playthrough || playthrough.decks.length >= 4) return;
    playthroughs.addDeck(playthrough.id, { id: nanoid(), heroSlots: [] });
  }

  function removeDeck(deckId: string) {
    if (!playthrough) return;
    playthroughs.removeDeck(playthrough.id, deckId);
  }

  function handleDeckLabel(deckId: string, e: Event) {
    if (!playthrough) return;
    const value = (e.target as HTMLInputElement).value;
    const decks = playthrough.decks.map((d) => (d.id === deckId ? { ...d, label: value } : d));
    playthroughs.updatePlaythrough(playthrough.id, { decks });
  }

  function addHeroSlot(deckId: string) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck || deck.heroSlots.length >= 3) return;
    playthroughs.addHeroSlot(playthrough.id, deckId, { heroName: '', boons: [], burdens: [], fallen: false });
  }

  function removeHeroSlot(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    playthroughs.removeHeroSlot(playthrough.id, deckId, slotIndex);
  }

  function handleHeroName(deckId: string, slotIndex: number, e: Event) {
    if (!playthrough) return;
    const value = (e.target as HTMLInputElement).value;
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { heroName: value });
  }

  function toggleFallen(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    const hero = deck.heroSlots[slotIndex];
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { fallen: !hero.fallen });
  }
</script>

<svelte:head>
  <title>{playthrough?.name ?? 'Campaign'} — LOTR LCG Companion</title>
</svelte:head>

<div class="page">
  {#if !playthrough}
    <p class="not-found">Campaign not found.</p>
  {:else}
    <header class="header">
      <a class="back" href="/campaigns">← Campaigns</a>
      <div class="header-text">
        <h1 class="title">{playthrough.name}</h1>
        <p class="product-name">{productName}</p>
      </div>
    </header>

    <div class="progress-block">
      <div class="progress-row">
        <span class="progress-fraction">{completedCount} / {totalCount}</span>
        <span class="progress-label">scenarios completed</span>
      </div>
      <div class="progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Campaign progress">
        <div class="progress-fill" style="width: {progressPct}%"></div>
      </div>
    </div>

    <ul class="scenario-list">
      {#each campaignScenarios as scenario (scenario.id)}
        {@const status = getStatus(scenario.id)}
        {@const notes = getNotes(scenario.id)}
        <li class="scenario-item" data-status={status}>
          <div class="scenario-row">
            <button
              class="status-btn"
              aria-label="Toggle status: {status}"
              onclick={() => cycleStatus(scenario.id)}
              title={status === 'not_attempted' ? 'Mark completed' : status === 'completed' ? 'Mark failed' : 'Reset'}
            >
              {STATUS_LABEL[status] ?? '—'}
            </button>
            <span class="scenario-name">{scenario.name}</span>
          </div>
          <textarea
            class="notes"
            aria-label="Notes for {scenario.name}"
            placeholder="Notes…"
            value={notes}
            oninput={(e) => handleNotes(scenario.id, e)}
          ></textarea>
        </li>
      {/each}
    </ul>

    <section class="decks-section">
      <div class="decks-heading-row">
        <h2 class="decks-heading">Players</h2>
        {#if playthrough.decks.length < 4}
          <button class="add-btn" onclick={addDeck} aria-label="Add Player">+ Add Player</button>
        {/if}
      </div>

      {#each playthrough.decks as deck, deckIndex (deck.id)}
        <div class="deck-card">
          <div class="deck-header">
            <span class="deck-number">Player {deckIndex + 1}</span>
            <input
              class="deck-label-input"
              type="text"
              aria-label="Player label"
              placeholder="Label (optional)"
              value={deck.label ?? ''}
              oninput={(e) => handleDeckLabel(deck.id, e)}
            />
            <button class="remove-btn" onclick={() => removeDeck(deck.id)} aria-label="Remove Player">×</button>
          </div>

          <div class="hero-slots">
            {#each deck.heroSlots as hero, slotIndex (slotIndex)}
              <div class="hero-slot" data-fallen={hero.fallen ? 'true' : undefined}>
                <input
                  class="hero-name-input"
                  type="text"
                  aria-label="Hero name"
                  placeholder="Hero name"
                  value={hero.heroName}
                  oninput={(e) => handleHeroName(deck.id, slotIndex, e)}
                />
                {#if isSaga}
                  <button
                    class="fallen-btn"
                    aria-label="Toggle fallen"
                    aria-pressed={hero.fallen}
                    onclick={() => toggleFallen(deck.id, slotIndex)}
                  >
                    {hero.fallen ? 'Fallen' : 'Active'}
                  </button>
                {/if}
                <button class="remove-btn" onclick={() => removeHeroSlot(deck.id, slotIndex)} aria-label="Remove Hero">×</button>
              </div>
            {/each}

            {#if deck.heroSlots.length < 3}
              <button class="add-hero-btn" onclick={() => addHeroSlot(deck.id)} aria-label="Add Hero">+ Add Hero</button>
            {/if}
          </div>
        </div>
      {/each}
    </section>
  {/if}
</div>

<style>
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px 20px 64px;
}

.not-found {
  text-align: center;
  padding: 48px 0;
  color: var(--gold-deep);
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  opacity: 0.6;
}

/* ── Header ── */

.header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}

.back {
  flex-shrink: 0;
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--gold-deep);
  text-decoration: none;
  text-transform: uppercase;
  padding-top: 5px;
}

.back:hover { color: var(--gold); }

.header-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--parchment-hi);
  letter-spacing: 0.04em;
  margin: 0;
}

.product-name {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
}

/* ── Progress ── */

.progress-block {
  margin-bottom: 28px;
}

.progress-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.progress-fraction {
  font-family: var(--font-display-sc);
  font-size: 14px;
  letter-spacing: 0.08em;
  color: var(--gold);
}

.progress-label {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.6;
}

.progress-track {
  height: 3px;
  background: color-mix(in srgb, var(--gold) 15%, transparent);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gold);
  border-radius: 2px;
  transition: width var(--duration-slow) var(--ease-out);
}

/* ── Scenarios ── */

.scenario-list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.scenario-item {
  padding: 12px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--gold) 10%, transparent);
}

.scenario-item:first-child {
  border-top: 1px solid color-mix(in srgb, var(--gold) 10%, transparent);
}

.scenario-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.status-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-family: var(--font-body);
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--gold) 28%, transparent);
  background: color-mix(in srgb, var(--gold-deep) 10%, var(--canvas));
  color: color-mix(in srgb, var(--gold-deep) 80%, transparent);
  cursor: pointer;
  transition: background var(--duration-base), border-color var(--duration-base), color var(--duration-base);
}

.scenario-item[data-status='completed'] .status-btn {
  background: color-mix(in srgb, var(--gold) 18%, var(--canvas));
  border-color: color-mix(in srgb, var(--gold) 55%, transparent);
  color: var(--gold);
}

.scenario-item[data-status='failed'] .status-btn {
  background: color-mix(in srgb, #9b2c2c 15%, var(--canvas));
  border-color: color-mix(in srgb, #c04040 45%, transparent);
  color: #c06060;
}

.status-btn:hover {
  border-color: color-mix(in srgb, var(--gold) 45%, transparent);
}

.scenario-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 400;
  color: var(--parchment);
  letter-spacing: 0.02em;
}

.scenario-item[data-status='completed'] .scenario-name {
  color: var(--parchment-lo);
  opacity: 0.7;
}

.scenario-item[data-status='failed'] .scenario-name {
  color: var(--parchment-lo);
  opacity: 0.5;
}

.notes {
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  resize: vertical;
  font-family: var(--font-body, sans-serif);
  font-size: 13px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 7%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 16%, transparent);
  border-radius: 4px;
  padding: 7px 10px;
  outline: none;
  margin-left: 40px;
  width: calc(100% - 40px);
}

.notes:focus {
  border-color: color-mix(in srgb, var(--gold) 38%, transparent);
}

.notes::placeholder {
  color: var(--gold-deep);
  opacity: 0.4;
}

/* ── Decks section ── */

.decks-section {
  border-top: 1px solid color-mix(in srgb, var(--gold) 15%, transparent);
  padding-top: 28px;
}

.decks-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.decks-heading {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 400;
  color: var(--parchment);
  letter-spacing: 0.04em;
  margin: 0;
}

.add-btn {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold);
  background: none;
  border: 1px solid color-mix(in srgb, var(--gold) 28%, transparent);
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  transition: border-color var(--duration-base);
}

.add-btn:hover {
  border-color: color-mix(in srgb, var(--gold) 50%, transparent);
}

.remove-btn {
  flex-shrink: 0;
  font-size: 15px;
  line-height: 1;
  color: var(--gold-deep);
  background: none;
  border: none;
  padding: 3px 6px;
  cursor: pointer;
  opacity: 0.45;
  transition: opacity var(--duration-fast);
}

.remove-btn:hover { opacity: 0.9; }

.deck-card {
  border: 1px solid color-mix(in srgb, var(--gold) 16%, transparent);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  background: color-mix(in srgb, var(--gold-deep) 5%, var(--canvas));
  margin-bottom: 12px;
}

.deck-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.deck-number {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  flex-shrink: 0;
}

.deck-label-input {
  flex: 1;
  font-family: var(--font-body, sans-serif);
  font-size: 13px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 16%, transparent);
  border-radius: 4px;
  padding: 5px 9px;
  outline: none;
  transition: border-color var(--duration-base);
}

.deck-label-input:focus {
  border-color: color-mix(in srgb, var(--gold) 38%, transparent);
}

.deck-label-input::placeholder {
  color: var(--gold-deep);
  opacity: 0.4;
}

.hero-slots {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.hero-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity var(--duration-base);
}

.hero-slot[data-fallen] {
  opacity: 0.4;
}

.hero-name-input {
  flex: 1;
  font-family: var(--font-body, sans-serif);
  font-size: 13px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 16%, transparent);
  border-radius: 4px;
  padding: 5px 9px;
  outline: none;
  transition: border-color var(--duration-base);
}

.hero-name-input:focus {
  border-color: color-mix(in srgb, var(--gold) 38%, transparent);
}

.hero-name-input::placeholder {
  color: var(--gold-deep);
  opacity: 0.4;
}

.fallen-btn {
  flex-shrink: 0;
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  background: none;
  border: 1px solid color-mix(in srgb, var(--gold) 22%, transparent);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: color var(--duration-base), border-color var(--duration-base), background var(--duration-base);
}

.fallen-btn[aria-pressed='true'] {
  color: #c04040;
  border-color: color-mix(in srgb, #c04040 45%, transparent);
  background: color-mix(in srgb, #c04040 8%, var(--canvas));
}

.add-hero-btn {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  background: none;
  border: 1px dashed color-mix(in srgb, var(--gold) 20%, transparent);
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  width: 100%;
  transition: border-color var(--duration-base), color var(--duration-base);
}

.add-hero-btn:hover {
  color: var(--gold);
  border-color: color-mix(in srgb, var(--gold) 35%, transparent);
}
</style>
