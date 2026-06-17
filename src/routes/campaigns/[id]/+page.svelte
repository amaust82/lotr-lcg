<script lang="ts">
  import { nanoid } from 'nanoid';
  import type { PageData } from './$types';
  import { playthroughs } from '$lib/stores/playthroughs';
  import { campaigns } from '$lib/data/campaigns';
  import { products } from '$lib/data/rules';
  import { heroes } from '$lib/data/heroes';
  import { collection } from '$lib/stores/collection';
  import type { ScenarioRecord } from '$lib/types/playthrough';

  let { data }: { data: PageData } = $props();

  const playthrough = $derived($playthroughs.find((p) => p.id === data.id) ?? null);
  const campaignScenarios = $derived(playthrough ? (campaigns[playthrough.productId] ?? []) : []);
  const product = $derived(playthrough ? products.find((p) => p.id === playthrough.productId) ?? null : null);
  const productName = $derived(product?.name ?? playthrough?.productId ?? '');
  const isSaga = $derived(product?.hasCampaignMode ?? false);
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
      : { scenarioId, status: 'not_attempted', campaignLog: [], ...patch };
    const newScenarios = existing
      ? playthrough.scenarios.map((s) => (s.scenarioId === scenarioId ? updated : s))
      : [...playthrough.scenarios, updated];
    playthroughs.updatePlaythrough(playthrough.id, { scenarios: newScenarios });
  }

  function setStatus(scenarioId: string, value: string) {
    upsertScenario(scenarioId, { status: value as ScenarioRecord['status'] });
  }

  function handleNotes(scenarioId: string, e: Event) {
    const value = (e.target as HTMLTextAreaElement).value;
    upsertScenario(scenarioId, { notes: value });
  }

  function getDatePlayed(scenarioId: string) {
    return getRecord(scenarioId)?.datePlayed ?? '';
  }

  function handleDatePlayed(scenarioId: string, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    upsertScenario(scenarioId, { datePlayed: value });
  }

  function getCampaignLogValue(scenarioId: string, fieldId: string, type: 'checkbox' | 'text' | 'select'): boolean | string {
    const entry = getRecord(scenarioId)?.campaignLog?.find((e) => e.fieldId === fieldId);
    if (entry) return entry.value;
    return type === 'checkbox' ? false : '';
  }

  function setCampaignLogValue(scenarioId: string, fieldId: string, value: boolean | string) {
    const existing = getRecord(scenarioId)?.campaignLog ?? [];
    const updated = existing.some((e) => e.fieldId === fieldId)
      ? existing.map((e) => (e.fieldId === fieldId ? { ...e, value } : e))
      : [...existing, { fieldId, value }];
    upsertScenario(scenarioId, { campaignLog: updated });
  }


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

  function toggleFallen(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    const hero = deck.heroSlots[slotIndex];
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { fallen: !hero.fallen });
  }

  let boonInputs: Record<string, string> = $state({});
  let burdenInputs: Record<string, string> = $state({});

  let pickerOpen: Record<string, boolean> = $state({});
  let pickerQuery: Record<string, string> = $state({});

  function pickerKey(deckId: string, slotIndex: number) { return `${deckId}:${slotIndex}`; }

  function filteredHeroes(deckId: string, slotIndex: number) {
    const query = (pickerQuery[pickerKey(deckId, slotIndex)] ?? '').toLowerCase().trim();
    if (!query) return [];
    const owned = $collection.products;
    const showAll = $collection.showEverything;
    return heroes.filter((h) => {
      if (!showAll && !owned[h.productId]) return false;
      return h.name.toLowerCase().includes(query);
    });
  }

  function handleHeroQuery(deckId: string, slotIndex: number, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    const key = pickerKey(deckId, slotIndex);
    pickerQuery[key] = value;
    pickerOpen[key] = value.trim().length > 0;
    playthroughs.updateHeroSlot(playthrough!.id, deckId, slotIndex, { heroName: value });
  }

  function selectHero(deckId: string, slotIndex: number, name: string) {
    const key = pickerKey(deckId, slotIndex);
    pickerQuery[key] = name;
    pickerOpen[key] = false;
    playthroughs.updateHeroSlot(playthrough!.id, deckId, slotIndex, { heroName: name });
  }

  function boonKey(deckId: string, slotIndex: number) { return `${deckId}:${slotIndex}`; }

  function addBoon(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    const key = boonKey(deckId, slotIndex);
    const val = (boonInputs[key] ?? '').trim();
    if (!val) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    const hero = deck.heroSlots[slotIndex];
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { boons: [...hero.boons, val] });
    boonInputs[key] = '';
  }

  function removeBoon(deckId: string, slotIndex: number, val: string) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    const hero = deck.heroSlots[slotIndex];
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { boons: hero.boons.filter((b) => b !== val) });
  }

  function addBurden(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    const key = boonKey(deckId, slotIndex);
    const val = (burdenInputs[key] ?? '').trim();
    if (!val) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    const hero = deck.heroSlots[slotIndex];
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { burdens: [...hero.burdens, val] });
    burdenInputs[key] = '';
  }

  function removeBurden(deckId: string, slotIndex: number, val: string) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    const hero = deck.heroSlots[slotIndex];
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { burdens: hero.burdens.filter((b) => b !== val) });
  }
</script>

<svelte:head>
  <title>{playthrough?.name ?? 'Campaign'} — LOTR LCG Wayfellow</title>
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
        <div class="progress-fill" style="--progress: {progressPct / 100}"></div>
      </div>
    </div>

    <ul class="scenario-list">
      {#each campaignScenarios as scenario (scenario.id)}
        {@const status = getStatus(scenario.id)}
        {@const notes = getNotes(scenario.id)}
        <li class="scenario-item" data-status={status}>
          <div class="scenario-row">
            <select
              class="status-select"
              aria-label="Status for {scenario.name}"
              value={status}
              onchange={(e) => setStatus(scenario.id, (e.target as HTMLSelectElement).value)}
            >
              <option value="not_attempted">Not played</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <span class="scenario-name">{scenario.name}</span>
            {#if status !== 'not_attempted'}
              <input
                type="date"
                class="date-played-input"
                aria-label="Date played for {scenario.name}"
                value={getDatePlayed(scenario.id)}
                oninput={(e) => handleDatePlayed(scenario.id, e)}
              />
            {/if}
          </div>
          <textarea
            class="notes"
            aria-label="Notes for {scenario.name}"
            placeholder="Notes…"
            value={notes}
            oninput={(e) => handleNotes(scenario.id, e)}
          ></textarea>
          {#if status !== 'not_attempted' && scenario.campaignLog && scenario.campaignLog.length > 0}
            <div class="campaign-log-fields">
              {#each scenario.campaignLog as field (field.id)}
                <div class="log-field">
                  {#if field.type === 'checkbox'}
                    <label class="log-checkbox-label">
                      <input
                        type="checkbox"
                        class="log-checkbox"
                        checked={getCampaignLogValue(scenario.id, field.id, 'checkbox') === true}
                        onchange={(e) => setCampaignLogValue(scenario.id, field.id, (e.target as HTMLInputElement).checked)}
                      />
                      {field.label}
                    </label>
                  {:else if field.type === 'select'}
                    <label class="log-text-label" for="log-{scenario.id}-{field.id}">{field.label}</label>
                    <select
                      id="log-{scenario.id}-{field.id}"
                      class="log-select"
                      value={String(getCampaignLogValue(scenario.id, field.id, 'select'))}
                      onchange={(e) => setCampaignLogValue(scenario.id, field.id, (e.target as HTMLSelectElement).value)}
                    >
                      <option value="">— choose —</option>
                      {#each field.options ?? [] as opt (opt)}
                        <option value={opt}>{opt}</option>
                      {/each}
                    </select>
                  {:else}
                    <label class="log-text-label" for="log-{scenario.id}-{field.id}">{field.label}</label>
                    <input
                      id="log-{scenario.id}-{field.id}"
                      type="text"
                      class="log-text-input"
                      value={String(getCampaignLogValue(scenario.id, field.id, 'text'))}
                      oninput={(e) => setCampaignLogValue(scenario.id, field.id, (e.target as HTMLInputElement).value)}
                    />
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
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
              {@const slotKey = boonKey(deck.id, slotIndex)}
              {@const pk = pickerKey(deck.id, slotIndex)}
              <div class="hero-slot" data-fallen={hero.fallen ? 'true' : undefined}>
                <div class="hero-picker-wrap">
                  <input
                    class="hero-name-input"
                    type="text"
                    aria-label="Hero name"
                    placeholder="Hero name"
                    value={pickerQuery[pk] ?? hero.heroName}
                    oninput={(e) => handleHeroQuery(deck.id, slotIndex, e)}
                  />
                  {#if pickerOpen[pk] && filteredHeroes(deck.id, slotIndex).length > 0}
                    <ul class="hero-picker-list" role="listbox" aria-label="Hero suggestions">
                      {#each filteredHeroes(deck.id, slotIndex) as h (h.name + h.sphere)}
                        <li
                          class="hero-picker-option"
                          role="option"
                          aria-selected="false"
                          onmousedown={() => selectHero(deck.id, slotIndex, h.name)}
                        >
                          <span class="hero-option-name">{h.name}</span>
                          <span class="hero-option-meta">{h.sphere} · {h.traits}</span>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </div>
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
              {#if isSaga}
                <div class="boon-burden-row">
                  <div class="chip-group">
                    <span class="chip-label">Boons</span>
                    <div class="chips">
                      {#each hero.boons as boon (boon)}
                        <span class="chip chip-boon">
                          {boon}
                          <button class="chip-remove" aria-label="Remove boon {boon}" onclick={() => removeBoon(deck.id, slotIndex, boon)}>×</button>
                        </span>
                      {/each}
                    </div>
                    <div class="chip-add-row">
                      <input
                        type="text"
                        class="chip-input"
                        aria-label="Add boon"
                        placeholder="Add boon…"
                        value={boonInputs[slotKey] ?? ''}
                        oninput={(e) => { boonInputs[slotKey] = (e.target as HTMLInputElement).value; }}
                      />
                      <button class="chip-add-btn" aria-label="Add boon" onclick={() => addBoon(deck.id, slotIndex)}>+</button>
                    </div>
                  </div>
                  <div class="chip-group">
                    <span class="chip-label">Burdens</span>
                    <div class="chips">
                      {#each hero.burdens as burden (burden)}
                        <span class="chip chip-burden">
                          {burden}
                          <button class="chip-remove" aria-label="Remove burden {burden}" onclick={() => removeBurden(deck.id, slotIndex, burden)}>×</button>
                        </span>
                      {/each}
                    </div>
                    <div class="chip-add-row">
                      <input
                        type="text"
                        class="chip-input"
                        aria-label="Add burden"
                        placeholder="Add burden…"
                        value={burdenInputs[slotKey] ?? ''}
                        oninput={(e) => { burdenInputs[slotKey] = (e.target as HTMLInputElement).value; }}
                      />
                      <button class="chip-add-btn" aria-label="Add burden" onclick={() => addBurden(deck.id, slotIndex)}>+</button>
                    </div>
                  </div>
                </div>
              {/if}
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
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--parchment);
  text-decoration: none;
  text-transform: uppercase;
  padding-top: 5px;
  opacity: 0.65;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.back:hover { opacity: 1; }

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
  width: 100%;
  background: var(--gold);
  border-radius: 2px;
  transform: scaleX(var(--progress, 0));
  transform-origin: left;
  transition: transform var(--duration-slow) var(--ease-out);
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

.status-select {
  appearance: none;
  -webkit-appearance: none;
  flex-shrink: 0;
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  border: 1px solid color-mix(in srgb, var(--gold) 22%, transparent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  color: color-mix(in srgb, var(--gold-deep) 70%, var(--parchment));
  padding: 5px 24px 5px 9px;
  cursor: pointer;
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23806040' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
  transition: border-color var(--duration-base), color var(--duration-base), background-color var(--duration-base);
}

.status-select option {
  background: var(--canvas);
  color: var(--parchment);
  text-transform: none;
}

.scenario-item[data-status='completed'] .status-select {
  color: var(--gold);
  border-color: color-mix(in srgb, var(--gold) 50%, transparent);
  background-color: color-mix(in srgb, var(--gold) 10%, var(--canvas));
}

.scenario-item[data-status='failed'] .status-select {
  color: #c06060;
  border-color: color-mix(in srgb, #c04040 40%, transparent);
  background-color: color-mix(in srgb, #9b2c2c 10%, var(--canvas));
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

/* ── Campaign Log Fields ── */

.campaign-log-fields {
  margin-left: 40px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-checkbox-label {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-body, sans-serif);
  font-size: 12px;
  color: var(--parchment);
  opacity: 0.85;
  cursor: pointer;
  user-select: none;
}

.log-checkbox {
  appearance: none;
  -webkit-appearance: none;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  border: 1.5px solid color-mix(in srgb, var(--gold) 38%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  cursor: pointer;
  position: relative;
  transition: background var(--duration-base), border-color var(--duration-base);
}

.log-checkbox:checked {
  background: color-mix(in srgb, var(--gold) 28%, var(--canvas));
  border-color: color-mix(in srgb, var(--gold) 75%, transparent);
}

.log-checkbox:checked::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: var(--gold);
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.log-checkbox:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--gold) 55%, transparent);
  outline-offset: 2px;
}

.log-text-label {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.7;
}

.log-text-input {
  font-family: var(--font-body, sans-serif);
  font-size: 12px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 6%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 14%, transparent);
  border-radius: 4px;
  padding: 5px 8px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color var(--duration-base);
}

.log-text-input:focus {
  border-color: color-mix(in srgb, var(--gold) 35%, transparent);
}

.log-select {
  appearance: none;
  -webkit-appearance: none;
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  border: 1px solid color-mix(in srgb, var(--gold) 22%, transparent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  color: color-mix(in srgb, var(--gold-deep) 70%, var(--parchment));
  padding: 5px 28px 5px 9px;
  cursor: pointer;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23806040' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 7px center;
  transition: border-color var(--duration-base), color var(--duration-base);
}

.log-select option {
  background: var(--canvas);
  color: var(--parchment);
  text-transform: none;
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

/* ── Date played ── */

.date-played-input {
  flex-shrink: 0;
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  color: color-mix(in srgb, var(--gold-deep) 70%, var(--parchment));
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 20%, transparent);
  border-radius: var(--radius-md);
  padding: 4px 8px;
  outline: none;
  transition: border-color var(--duration-base);
  color-scheme: dark;
}

.date-played-input:focus {
  border-color: color-mix(in srgb, var(--gold) 40%, transparent);
}

/* ── Boon / Burden chips ── */

.boon-burden-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
  padding-left: 4px;
}

.chip-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chip-label {
  font-family: var(--font-display-sc);
  font-size: 9px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.55;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-body, sans-serif);
  font-size: 11px;
  padding: 2px 7px 2px 8px;
  border-radius: 999px;
  line-height: 1.4;
}

.chip-boon {
  background: color-mix(in srgb, var(--gold) 12%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 30%, transparent);
  color: var(--gold);
}

.chip-burden {
  background: color-mix(in srgb, #c04040 10%, var(--canvas));
  border: 1px solid color-mix(in srgb, #c04040 35%, transparent);
  color: #d07070;
}

.chip-remove {
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
  font-size: 13px;
  cursor: pointer;
  opacity: 0.5;
  color: inherit;
  transition: opacity var(--duration-fast);
}

.chip-remove:hover { opacity: 1; }

.chip-add-row {
  display: flex;
  gap: 5px;
  align-items: center;
}

.chip-input {
  flex: 1;
  font-family: var(--font-body, sans-serif);
  font-size: 12px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 6%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 14%, transparent);
  border-radius: 4px;
  padding: 4px 8px;
  outline: none;
  transition: border-color var(--duration-base);
}

.chip-input:focus {
  border-color: color-mix(in srgb, var(--gold) 35%, transparent);
}

.chip-input::placeholder {
  color: var(--gold-deep);
  opacity: 0.35;
}

.chip-add-btn {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1;
  color: var(--gold-deep);
  background: none;
  border: 1px solid color-mix(in srgb, var(--gold) 20%, transparent);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--duration-fast), border-color var(--duration-fast);
}

.chip-add-btn:hover {
  opacity: 1;
  border-color: color-mix(in srgb, var(--gold) 40%, transparent);
}
</style>
