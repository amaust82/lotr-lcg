<script lang="ts">
  import { nanoid } from 'nanoid';
  import type { PageData } from './$types';
  import { playthroughs } from '$lib/stores/playthroughs';
  import { campaigns } from '$lib/data/campaigns';
  import { products } from '$lib/data/rules';
  import { heroes } from '$lib/data/heroes';
  import { collection } from '$lib/stores/collection';
  import type { ScenarioRecord } from '$lib/types/playthrough';
  import Frame from '$lib/components/Frame.svelte';
  import Combobox from '$lib/components/Combobox.svelte';
  import type { ComboboxOption } from '$lib/components/Combobox.svelte';

  let { data }: { data: PageData } = $props();

  const playthrough = $derived($playthroughs.find((p) => p.id === data.id) ?? null);
  const campaignScenarios = $derived(playthrough ? (campaigns[playthrough.productId] ?? []) : []);
  const product = $derived(
    playthrough ? products.find((p) => p.id === playthrough.productId) ?? null : null
  );
  const productName = $derived(product?.name ?? playthrough?.productId ?? '');
  const isSaga = $derived(product?.hasCampaignMode ?? false);
  const completedCount = $derived(
    playthrough ? playthrough.scenarios.filter((s) => s.status === 'completed').length : 0
  );
  const totalCount = $derived(campaignScenarios.length);
  const progressPct = $derived(
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  );

  // Hero options filtered by collection
  const heroOptions = $derived(
    heroes
      .filter((h) => $collection.showEverything || !!$collection.products[h.productId])
      .map((h): ComboboxOption => ({
        value: h.name,
        label: h.name,
        meta: `${h.sphere} · ${h.traits}`,
      }))
  );

  // ── Scenario helpers ──────────────────────────────────────────

  function getRecord(scenarioId: string): ScenarioRecord | undefined {
    return playthrough?.scenarios.find((s) => s.scenarioId === scenarioId);
  }

  function getStatus(scenarioId: string) {
    return getRecord(scenarioId)?.status ?? 'not_attempted';
  }

  function getNotes(scenarioId: string) {
    return getRecord(scenarioId)?.notes ?? '';
  }

  function getDatePlayed(scenarioId: string) {
    return getRecord(scenarioId)?.datePlayed ?? '';
  }

  function formatDate(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
    upsertScenario(scenarioId, { notes: (e.target as HTMLTextAreaElement).value });
  }

  function handleDatePlayed(scenarioId: string, e: Event) {
    upsertScenario(scenarioId, { datePlayed: (e.target as HTMLInputElement).value });
  }

  function getCampaignLogValue(
    scenarioId: string,
    fieldId: string,
    type: 'checkbox' | 'text' | 'select'
  ): boolean | string {
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

  // Notes collapse per scenario
  let notesOpen: Record<string, boolean> = $state({});

  function toggleNotes(id: string) {
    notesOpen[id] = !(notesOpen[id] ?? false);
  }

  // ── Deck helpers ──────────────────────────────────────────────

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
    playthroughs.addHeroSlot(playthrough.id, deckId, {
      heroName: '',
      boons: [],
      burdens: [],
      fallen: false,
    });
  }

  function removeHeroSlot(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    playthroughs.removeHeroSlot(playthrough.id, deckId, slotIndex);
  }

  function toggleFallen(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, {
      fallen: !deck.heroSlots[slotIndex].fallen,
    });
  }

  function setHeroName(deckId: string, slotIndex: number, name: string) {
    if (!playthrough) return;
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, { heroName: name });
  }

  // Boon / burden
  let boonInputs: Record<string, string> = $state({});
  let burdenInputs: Record<string, string> = $state({});

  function slotKey(deckId: string, slotIndex: number) {
    return `${deckId}:${slotIndex}`;
  }

  function addBoon(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    const key = slotKey(deckId, slotIndex);
    const val = (boonInputs[key] ?? '').trim();
    if (!val) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, {
      boons: [...deck.heroSlots[slotIndex].boons, val],
    });
    boonInputs[key] = '';
  }

  function removeBoon(deckId: string, slotIndex: number, val: string) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, {
      boons: deck.heroSlots[slotIndex].boons.filter((b) => b !== val),
    });
  }

  function addBurden(deckId: string, slotIndex: number) {
    if (!playthrough) return;
    const key = slotKey(deckId, slotIndex);
    const val = (burdenInputs[key] ?? '').trim();
    if (!val) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, {
      burdens: [...deck.heroSlots[slotIndex].burdens, val],
    });
    burdenInputs[key] = '';
  }

  function removeBurden(deckId: string, slotIndex: number, val: string) {
    if (!playthrough) return;
    const deck = playthrough.decks.find((d) => d.id === deckId);
    if (!deck) return;
    playthroughs.updateHeroSlot(playthrough.id, deckId, slotIndex, {
      burdens: deck.heroSlots[slotIndex].burdens.filter((b) => b !== val),
    });
  }
</script>

<svelte:head>
  <title>{playthrough?.name ?? 'Campaign'} — LOTR LCG Wayfellow</title>
</svelte:head>

<div class="page">
  {#if !playthrough}
    <p class="not-found">Campaign not found.</p>
  {:else}
    <!-- ── Header ── -->
    <header class="header">
      <a class="back" href="/campaigns">← Campaigns</a>
      <div class="header-text">
        <p class="product-name">{productName}</p>
        <h1 class="title">{playthrough.name}</h1>
      </div>
    </header>

    <!-- ── Progress ── -->
    <div class="progress-block">
      <div class="progress-row">
        <span class="progress-fraction">{completedCount} / {totalCount}</span>
        <span class="progress-label">scenarios completed</span>
        <span class="progress-pct">{progressPct}%</span>
      </div>
      <div
        class="progress-track"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Campaign progress"
      >
        <div class="progress-fill" style="--progress: {progressPct / 100}"></div>
      </div>
    </div>

    <!-- ── Scenarios ── -->
    <ul class="scenario-list">
      {#each campaignScenarios as scenario, i (scenario.id)}
        {@const status = getStatus(scenario.id)}
        {@const notes = getNotes(scenario.id)}
        {@const datePlayed = getDatePlayed(scenario.id)}
        {@const hasNotes = notes.trim().length > 0}
        {@const isOpen = notesOpen[scenario.id] ?? false}
        {@const hasLog =
          status !== 'not_attempted' &&
          scenario.campaignLog &&
          scenario.campaignLog.length > 0}
        <li class="scenario-item" data-status={status} style="--i:{i}">
          <!-- Main row -->
          <div class="scenario-main">
            <div
              class="status-toggle"
              role="group"
              aria-label="Status for {scenario.name}"
            >
              <button
                class="s-btn"
                class:s-active={status === 'not_attempted'}
                aria-label="Not played"
                aria-pressed={status === 'not_attempted'}
                onclick={() => setStatus(scenario.id, 'not_attempted')}
              >–</button>
              <button
                class="s-btn s-btn--win"
                class:s-active={status === 'completed'}
                aria-label="Completed"
                aria-pressed={status === 'completed'}
                onclick={() => setStatus(scenario.id, 'completed')}
              >✓</button>
              <button
                class="s-btn s-btn--lose"
                class:s-active={status === 'failed'}
                aria-label="Failed"
                aria-pressed={status === 'failed'}
                onclick={() => setStatus(scenario.id, 'failed')}
              >✗</button>
            </div>

            <div class="scenario-info">
              <span class="scenario-name">{scenario.name}</span>
              {#if status !== 'not_attempted' && datePlayed}
                <span class="scenario-date">{formatDate(datePlayed)}</span>
              {/if}
            </div>

            <button
              class="notes-toggle"
              class:has-notes={hasNotes}
              class:is-open={isOpen}
              aria-label={isOpen ? 'Hide notes' : hasNotes ? 'Show notes' : 'Add notes'}
              onclick={() => toggleNotes(scenario.id)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.25"/>
                <line x1="3.75" y1="4.75" x2="10.25" y2="4.75" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
                <line x1="3.75" y1="7" x2="10.25" y2="7" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
                <line x1="3.75" y1="9.25" x2="7.5" y2="9.25" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
              </svg>
              {#if hasNotes}
                <span class="notes-dot" aria-hidden="true"></span>
              {/if}
            </button>
          </div>

          <!-- Expanded: notes + date + log -->
          {#if isOpen || hasLog}
            <div class="scenario-detail">
              {#if isOpen}
                <div class="detail-row detail-row--notes">
                  {#if status !== 'not_attempted'}
                    <div class="date-field">
                      <label class="detail-label" for="date-{scenario.id}">Date played</label>
                      <input
                        id="date-{scenario.id}"
                        type="date"
                        class="date-input"
                        aria-label="Date played for {scenario.name}"
                        value={datePlayed}
                        oninput={(e) => handleDatePlayed(scenario.id, e)}
                      />
                    </div>
                  {/if}
                  <textarea
                    class="notes"
                    aria-label="Notes for {scenario.name}"
                    placeholder="Notes…"
                    value={notes}
                    oninput={(e) => handleNotes(scenario.id, e)}
                  ></textarea>
                </div>
              {/if}

              {#if hasLog}
                <div class="campaign-log-fields">
                  {#each scenario.campaignLog! as field (field.id)}
                    <div class="log-field">
                      {#if field.type === 'checkbox'}
                        <label class="log-checkbox-label">
                          <input
                            type="checkbox"
                            class="log-checkbox"
                            checked={getCampaignLogValue(scenario.id, field.id, 'checkbox') === true}
                            onchange={(e) =>
                              setCampaignLogValue(
                                scenario.id,
                                field.id,
                                (e.target as HTMLInputElement).checked
                              )}
                          />
                          {field.label}
                        </label>
                      {:else if field.type === 'select'}
                        <label class="detail-label" for="log-{scenario.id}-{field.id}"
                          >{field.label}</label
                        >
                        <Combobox
                          inputId="log-{scenario.id}-{field.id}"
                          options={(field.options ?? []).map((o) => ({ value: o, label: o }))}
                          value={String(getCampaignLogValue(scenario.id, field.id, 'select'))}
                          onchange={(v) => setCampaignLogValue(scenario.id, field.id, v)}
                          placeholder="— choose —"
                        />
                      {:else}
                        <label class="detail-label" for="log-{scenario.id}-{field.id}"
                          >{field.label}</label
                        >
                        <input
                          id="log-{scenario.id}-{field.id}"
                          type="text"
                          class="log-text-input"
                          value={String(getCampaignLogValue(scenario.id, field.id, 'text'))}
                          oninput={(e) =>
                            setCampaignLogValue(
                              scenario.id,
                              field.id,
                              (e.target as HTMLInputElement).value
                            )}
                        />
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ul>

    <!-- ── Players ── -->
    <section class="decks-section">
      <div class="decks-heading-row">
        <h2 class="decks-heading">Players</h2>
        {#if playthrough.decks.length < 4}
          <button class="add-btn" onclick={addDeck}>+ Add Player</button>
        {/if}
      </div>

      {#each playthrough.decks as deck, deckIndex (deck.id)}
        <div class="deck-wrap">
          <Frame corners={false}>
            <div class="deck-inner">
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
                <button
                  class="remove-btn"
                  onclick={() => removeDeck(deck.id)}
                  aria-label="Remove Player {deckIndex + 1}"
                >×</button>
              </div>

              <div class="hero-slots">
                {#each deck.heroSlots as hero, slotIndex (slotIndex)}
                  {@const key = slotKey(deck.id, slotIndex)}
                  <div class="hero-slot-wrap">
                    <div class="hero-slot" data-fallen={hero.fallen ? 'true' : undefined}>
                      <Combobox
                        options={heroOptions}
                        value={hero.heroName}
                        onchange={(name) => setHeroName(deck.id, slotIndex, name)}
                        freeText={true}
                        placeholder="Hero name"
                      />
                      {#if isSaga}
                        <button
                          class="fallen-btn"
                          class:fallen-active={hero.fallen}
                          aria-label="Toggle fallen for hero {slotIndex + 1}"
                          aria-pressed={hero.fallen}
                          onclick={() => toggleFallen(deck.id, slotIndex)}
                        >{hero.fallen ? 'Fallen' : 'Active'}</button>
                      {/if}
                      <button
                        class="remove-btn"
                        onclick={() => removeHeroSlot(deck.id, slotIndex)}
                        aria-label="Remove hero {slotIndex + 1}"
                      >×</button>
                    </div>

                    {#if isSaga}
                      <div class="boon-burden-row">
                        <!-- Boons -->
                        <div class="chip-group">
                          <span class="chip-label">Boons</span>
                          {#if hero.boons.length > 0}
                            <div class="chips">
                              {#each hero.boons as boon (boon)}
                                <span class="chip chip-boon">
                                  {boon}
                                  <button
                                    class="chip-remove"
                                    aria-label="Remove boon {boon}"
                                    onclick={() => removeBoon(deck.id, slotIndex, boon)}
                                  >×</button>
                                </span>
                              {/each}
                            </div>
                          {/if}
                          <div class="chip-add-row">
                            <input
                              type="text"
                              class="chip-input"
                              aria-label="Add boon"
                              placeholder="Add boon…"
                              value={boonInputs[key] ?? ''}
                              oninput={(e) => {
                                boonInputs[key] = (e.target as HTMLInputElement).value;
                              }}
                              onkeydown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addBoon(deck.id, slotIndex);
                                }
                              }}
                            />
                            <button
                              class="chip-add-btn"
                              aria-label="Add boon"
                              onclick={() => addBoon(deck.id, slotIndex)}
                            >+</button>
                          </div>
                        </div>

                        <!-- Burdens -->
                        <div class="chip-group">
                          <span class="chip-label chip-label--burden">Burdens</span>
                          {#if hero.burdens.length > 0}
                            <div class="chips">
                              {#each hero.burdens as burden (burden)}
                                <span class="chip chip-burden">
                                  {burden}
                                  <button
                                    class="chip-remove"
                                    aria-label="Remove burden {burden}"
                                    onclick={() => removeBurden(deck.id, slotIndex, burden)}
                                  >×</button>
                                </span>
                              {/each}
                            </div>
                          {/if}
                          <div class="chip-add-row">
                            <input
                              type="text"
                              class="chip-input chip-input--burden"
                              aria-label="Add burden"
                              placeholder="Add burden…"
                              value={burdenInputs[key] ?? ''}
                              oninput={(e) => {
                                burdenInputs[key] = (e.target as HTMLInputElement).value;
                              }}
                              onkeydown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addBurden(deck.id, slotIndex);
                                }
                              }}
                            />
                            <button
                              class="chip-add-btn chip-add-btn--burden"
                              aria-label="Add burden"
                              onclick={() => addBurden(deck.id, slotIndex)}
                            >+</button>
                          </div>
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}

                {#if deck.heroSlots.length < 3}
                  <button class="add-hero-btn" onclick={() => addHeroSlot(deck.id)}>
                    + Add Hero
                  </button>
                {/if}
              </div>
            </div>
          </Frame>
        </div>
      {/each}
    </section>
  {/if}
</div>

<style>
/* ── Page shell ── */

.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px 20px 72px;
}

.not-found {
  text-align: center;
  padding: 48px 0;
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.55;
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
  padding-top: 6px;
  opacity: 0.55;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.back:hover {
  opacity: 1;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-name {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
  opacity: 0.8;
}

.title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--parchment-hi);
  letter-spacing: 0.04em;
  margin: 0;
  line-height: 1.2;
}

/* ── Progress ── */

.progress-block {
  margin-bottom: 32px;
}

.progress-row {
  display: flex;
  align-items: baseline;
  gap: 7px;
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
  opacity: 0.55;
  flex: 1;
}

.progress-pct {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--gold-deep);
  opacity: 0.55;
}

.progress-track {
  height: 3px;
  background: color-mix(in srgb, var(--gold) 12%, transparent);
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

/* ── Scenario list ── */

.scenario-list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  display: flex;
  flex-direction: column;
}

.scenario-item {
  padding: 13px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--gold) 10%, transparent);
  animation: scenario-enter 360ms var(--ease-out) both;
  animation-delay: calc(var(--i, 0) * 38ms);
}

.scenario-item:first-child {
  border-top: 1px solid color-mix(in srgb, var(--gold) 10%, transparent);
}

@keyframes scenario-enter {
  from {
    opacity: 0;
    transform: translateY(7px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scenario-item {
    animation: none;
  }
}

/* ── Scenario main row ── */

.scenario-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Status toggle */

.status-toggle {
  display: flex;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
  border-radius: 6px;
  overflow: hidden;
}

.s-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 28px;
  background: none;
  border: none;
  border-left: 1px solid color-mix(in srgb, var(--gold) 14%, transparent);
  font-size: 12px;
  line-height: 1;
  color: color-mix(in srgb, var(--gold-deep) 55%, var(--parchment));
  cursor: pointer;
  transition: background var(--duration-base), color var(--duration-base);
  padding: 0;
}

.s-btn:first-child {
  border-left: none;
}

.s-btn.s-active {
  background: color-mix(in srgb, var(--gold-deep) 22%, var(--canvas));
  color: var(--parchment-lo);
}

.s-btn--win.s-active {
  background: color-mix(in srgb, var(--gold) 15%, var(--canvas));
  color: var(--gold);
}

.s-btn--lose.s-active {
  background: color-mix(in srgb, #c04040 12%, var(--canvas));
  color: #d07070;
}

/* Scenario info */

.scenario-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.scenario-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 400;
  color: var(--parchment);
  letter-spacing: 0.02em;
  line-height: 1.3;
  transition: color var(--duration-base), opacity var(--duration-base);
}

.scenario-item[data-status='completed'] .scenario-name {
  color: var(--parchment-lo);
  opacity: 0.62;
}

.scenario-item[data-status='failed'] .scenario-name {
  color: var(--parchment-lo);
  opacity: 0.42;
}

.scenario-date {
  font-family: var(--font-display-sc);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.6;
}

/* Notes toggle */

.notes-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  padding: 0;
  color: var(--gold-deep);
  opacity: 0.35;
  cursor: pointer;
  transition: opacity var(--duration-fast), color var(--duration-fast);
}

.notes-toggle:hover,
.notes-toggle.is-open {
  opacity: 0.85;
  color: var(--parchment);
}

.notes-toggle.has-notes {
  opacity: 0.6;
}

.notes-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
}

/* ── Scenario detail (expanded) ── */

/* indent: 3 buttons × 26px + 2px border = 80px; + 10px gap = 90px */
.scenario-detail {
  padding-left: 90px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row--notes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-label {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  opacity: 0.65;
  white-space: nowrap;
}

.date-input {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--gold-deep) 65%, var(--parchment));
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
  border-radius: var(--radius-md);
  padding: 4px 8px;
  outline: none;
  transition: border-color var(--duration-base);
  color-scheme: dark;
}

.date-input:focus {
  border-color: color-mix(in srgb, var(--gold) 42%, transparent);
}

.notes {
  width: 100%;
  box-sizing: border-box;
  min-height: 58px;
  resize: vertical;
  font-family: var(--font-body, sans-serif);
  font-size: 13px;
  line-height: 1.5;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 7%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 14%, transparent);
  border-radius: 4px;
  padding: 7px 10px;
  outline: none;
  transition: border-color var(--duration-base);
}

.notes:focus {
  border-color: color-mix(in srgb, var(--gold) 36%, transparent);
}

.notes::placeholder {
  color: var(--gold-deep);
  opacity: 0.38;
}

/* ── Campaign log fields ── */

.campaign-log-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  border: 1.5px solid color-mix(in srgb, var(--gold) 36%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  cursor: pointer;
  position: relative;
  transition: background var(--duration-base), border-color var(--duration-base);
}

.log-checkbox:checked {
  background: color-mix(in srgb, var(--gold) 24%, var(--canvas));
  border-color: color-mix(in srgb, var(--gold) 70%, transparent);
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
  outline: 2px solid color-mix(in srgb, var(--gold) 50%, transparent);
  outline-offset: 2px;
}

.log-text-input {
  font-family: var(--font-body, sans-serif);
  font-size: 12px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 6%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 13%, transparent);
  border-radius: 4px;
  padding: 5px 8px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color var(--duration-base);
}

.log-text-input:focus {
  border-color: color-mix(in srgb, var(--gold) 34%, transparent);
}

/* ── Decks section ── */

.decks-section {
  border-top: 1px solid color-mix(in srgb, var(--gold) 14%, transparent);
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
  border: 1px solid color-mix(in srgb, var(--gold) 26%, transparent);
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  transition: border-color var(--duration-base), color var(--duration-base);
}

.add-btn:hover {
  border-color: color-mix(in srgb, var(--gold) 52%, transparent);
}

.remove-btn {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1;
  color: var(--gold-deep);
  background: none;
  border: none;
  padding: 3px 6px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity var(--duration-fast);
}

.remove-btn:hover {
  opacity: 0.9;
}

/* Deck card */

.deck-wrap {
  margin-bottom: 12px;
}

.deck-inner {
  padding: 14px 16px;
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
  border: 1px solid color-mix(in srgb, var(--gold) 14%, transparent);
  border-radius: 4px;
  padding: 5px 9px;
  outline: none;
  transition: border-color var(--duration-base);
}

.deck-label-input:focus {
  border-color: color-mix(in srgb, var(--gold) 36%, transparent);
}

.deck-label-input::placeholder {
  color: var(--gold-deep);
  opacity: 0.35;
}

/* Hero slots */

.hero-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-slot-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity var(--duration-base);
}

.hero-slot[data-fallen] {
  opacity: 0.38;
}

.fallen-btn {
  flex-shrink: 0;
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  background: none;
  border: 1px solid color-mix(in srgb, var(--gold) 20%, transparent);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: color var(--duration-base), border-color var(--duration-base),
    background var(--duration-base);
}

.fallen-btn.fallen-active {
  color: #c04040;
  border-color: color-mix(in srgb, #c04040 42%, transparent);
  background: color-mix(in srgb, #c04040 8%, var(--canvas));
}

.add-hero-btn {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
  background: none;
  border: 1px dashed color-mix(in srgb, var(--gold) 18%, transparent);
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  width: 100%;
  transition: border-color var(--duration-base), color var(--duration-base);
}

.add-hero-btn:hover {
  color: var(--gold);
  border-color: color-mix(in srgb, var(--gold) 32%, transparent);
}

/* ── Boon / Burden ── */

.boon-burden-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding-left: 2px;
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
  opacity: 0.5;
}

.chip-label--burden {
  color: #a05050;
  opacity: 0.6;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-body, sans-serif);
  font-size: 11px;
  padding: 2px 6px 2px 7px;
  border-radius: 999px;
  line-height: 1.4;
}

.chip-boon {
  background: color-mix(in srgb, var(--gold) 11%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 28%, transparent);
  color: var(--gold);
}

.chip-burden {
  background: color-mix(in srgb, #c04040 9%, var(--canvas));
  border: 1px solid color-mix(in srgb, #c04040 32%, transparent);
  color: #c87070;
}

.chip-remove {
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
  font-size: 13px;
  cursor: pointer;
  opacity: 0.45;
  color: inherit;
  transition: opacity var(--duration-fast);
}

.chip-remove:hover {
  opacity: 1;
}

.chip-add-row {
  display: flex;
  gap: 4px;
  align-items: center;
}

.chip-input {
  flex: 1;
  min-width: 0;
  font-family: var(--font-body, sans-serif);
  font-size: 11px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 6%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 12%, transparent);
  border-radius: 4px;
  padding: 4px 7px;
  outline: none;
  transition: border-color var(--duration-base);
}

.chip-input:focus {
  border-color: color-mix(in srgb, var(--gold) 32%, transparent);
}

.chip-input::placeholder {
  color: var(--gold-deep);
  opacity: 0.32;
}

.chip-input--burden:focus {
  border-color: color-mix(in srgb, #c04040 30%, transparent);
}

.chip-add-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  font-size: 15px;
  line-height: 1;
  color: var(--gold-deep);
  background: none;
  border: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  opacity: 0.55;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--duration-fast), border-color var(--duration-fast);
}

.chip-add-btn:hover {
  opacity: 1;
  border-color: color-mix(in srgb, var(--gold) 38%, transparent);
}

.chip-add-btn--burden {
  color: #a05050;
  border-color: color-mix(in srgb, #c04040 18%, transparent);
}

.chip-add-btn--burden:hover {
  border-color: color-mix(in srgb, #c04040 36%, transparent);
}
</style>
