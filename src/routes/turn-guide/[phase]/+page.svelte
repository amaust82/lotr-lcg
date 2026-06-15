<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PhaseRail    from '$lib/components/PhaseRail.svelte';
  import PhaseHeader  from '$lib/components/PhaseHeader.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import ActionWindowCallout from '$lib/components/ActionWindowCallout.svelte';
  import StonePennant from '$lib/components/StonePennant.svelte';
  import { PHASES } from '$lib/data/phases.js';

  const slug = $derived($page.params.phase);
  const currentPhase = $derived(PHASES.findIndex(p => p.slug === slug));
  const phase = $derived(PHASES[currentPhase] ?? PHASES[0]);
  const isLast = $derived(currentPhase === PHASES.length - 1);
  const prevPhase = $derived(currentPhase > 0 ? PHASES[currentPhase - 1] : null);
  const nextPhase = $derived(currentPhase < PHASES.length - 1 ? PHASES[currentPhase + 1] : null);

  function advance() {
    if (nextPhase) goto('/turn-guide/' + nextPhase.slug);
  }

  function retreat() {
    if (prevPhase) goto('/turn-guide/' + prevPhase.slug);
  }
</script>

<svelte:head>
  <title>{phase.name} Phase · Turn Guide · LOTR LCG</title>
</svelte:head>

<div class="scene">
  <div class="phone" role="main">
    <div class="screen">
      <a class="pg-label" href="/" aria-label="Turn Guide — back to home">Turn Guide</a>

      <div class="specimen">

        <!-- Phase rail -->
        <PhaseRail {currentPhase} phases={PHASES} />

        <!-- Content -->
        <div class="content">

          <!-- Phase heading -->
          <PhaseHeader
            eyebrow={phase.eyebrow}
            title={phase.name + ' Phase'}
            subtitle={phase.subtitle}
          />

          {#if phase.intro}
            <p class="intro-text">
              <span class="drop-cap">{phase.intro[0]}</span>{phase.intro.slice(1)}
            </p>
          {/if}

          <!-- Sections -->
          {#each phase.sections as section}
            <SectionDivider />

            {#if section.heading}
              <SectionHeader
                eyebrow={section.eyebrow ?? ''}
                heading={section.heading}
              />
            {/if}

            {#if section.steps}
              <ul class="step-list" aria-label="{section.heading ?? 'Steps'}">
                {#each section.steps as step}
                  <li class="step-list__item">
                    {#if step.boldPrefix}
                      <strong class="step-list__bold">{step.boldPrefix}</strong>{step.text}
                    {:else}
                      {step.text}
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}

            {#if section.actionWindow}
              <div class="callout-wrap">
                <ActionWindowCallout text={section.actionWindow.text} />
              </div>
            {/if}
          {/each}

          <!-- Per-phase epigraph -->
          {#if phase.quote}
            <div class="epigraph" aria-label="Tolkien quotation">
              <span class="epigraph__leaf" aria-hidden="true">❧</span>
              <p class="epigraph__text">
                <em>{phase.quote.text}</em>
              </p>
              <p class="epigraph__attribution">— {phase.quote.attribution}</p>
            </div>
          {/if}

        </div>
      </div>

      <!-- Sticky bottom navigation bar -->
      <div class="bottom-bar">
        {#if prevPhase}
          <button class="bar__back" onclick={retreat} type="button" aria-label="Previous phase: {prevPhase.name}">
            ← {prevPhase.name}
          </button>
        {:else}
          <a class="bar__back" href="/">← Home</a>
        {/if}

        <div class="bar__cta">
          {#if !isLast}
            <StonePennant
              label="Next Phase →"
              onclick={advance}
            />
          {:else}
            <StonePennant
              label="Begin New Round"
              onclick={() => goto('/turn-guide/resource')}
            />
          {/if}
        </div>
      </div>

    </div>
  </div>
</div>


<style>

/* ── Scene / outer shell ──────────────────── */

.scene {
  background: var(--canvas);
  min-height: 100dvh;
}

/* ── Parchment card ───────────────────────── */

.phone {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

.screen {
  background: radial-gradient(
    150% 130% at 18% -5%,
    var(--parchment-hi) 0%,
    var(--parchment)    46%,
    var(--parchment-lo) 100%
  );
  color: var(--ink);
  padding: var(--screen-pad-top) var(--screen-pad-side) 0;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* ── Page label ───────────────────────────── */

.pg-label {
  font-family: var(--font-display-sc);
  letter-spacing: 0.4em;
  font-size: 12px;
  color: var(--gold-hi);
  text-transform: uppercase;
  margin-bottom: 16px;
  padding-left: 72px; /* align with content column (44px rail + 28px gap) */
  text-decoration: none;
  display: block;
  transition: color var(--duration-fast) var(--ease-out);
}

.pg-label:hover {
  color: var(--gold-lt);
  text-decoration: none;
}

/* ── Layout ───────────────────────────────── */

.specimen {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  gap: 28px;
  flex: 1;
}

.content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  view-transition-name: phase-content;
}

/* ── Drop cap ─────────────────────────────── */

.intro-text {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: var(--leading-relaxed);
  color: var(--ink-mid);
  margin-top: 16px;
  max-width: none;
}

.drop-cap {
  font-family: var(--font-display);
  font-size: 52px;
  font-weight: 400;
  float: left;
  line-height: 0.62;
  margin-top: -3px;
  padding: 0 5px 0 14px;
  color: var(--crimson);
}

/* ── Step list ────────────────────────────── */

.step-list {
  list-style: none;
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.step-list__item {
  position: relative;
  padding-left: 18px;
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--ink-mid);
}

.step-list__item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 7px;
  height: 7px;
  background: var(--crimson);
  transform: rotate(45deg);
}

.step-list__bold {
  font-weight: 600;
  color: var(--crimson);
}

/* ── Callout spacing ──────────────────────── */

.callout-wrap {
  margin-top: 16px;
}

/* ── Epigraph ─────────────────────────────── */

.epigraph {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  text-align: center;
}

.epigraph__leaf {
  font-family: var(--font-body);
  font-size: 20px;
  color: var(--gold);
}

.epigraph__text {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 16px;
  color: var(--ink-soft);
  max-width: 300px;
  line-height: 1.5;
}

.epigraph__attribution {
  font-family: var(--font-display-sc);
  font-size: 10.5px;
  letter-spacing: 0.18em;
  color: var(--crimson);
  max-width: none;
}

/* ── Sticky bottom nav bar ────────────────── */

.bottom-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: var(--parchment-lo);
  /* negative margins escape .screen's side padding so bar spans full card width */
  margin-left: calc(-1 * var(--screen-pad-side));
  margin-right: calc(-1 * var(--screen-pad-side));
  padding: 12px var(--screen-pad-side);
  padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Soft gradient fade above the bar — replaces hard border-top */
.bottom-bar::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  height: 48px;
  background: linear-gradient(to bottom, transparent, var(--parchment-lo));
  pointer-events: none;
}

.bar__back {
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--ink-soft);
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  text-align: left;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
  white-space: nowrap;
}

.bar__back:hover,
.bar__back:focus-visible {
  color: var(--ink);
  text-decoration: none;
}

.bar__cta {
  flex: 1;
  max-width: 260px;
  margin-left: auto;
}

/* ── Desktop ──────────────────────────────── */

@media (min-width: 480px) {
  .scene {
    padding: 32px;
  }

  .screen {
    border-radius: 12px;
    min-height: unset;
    box-shadow: 0 24px 64px -12px rgba(0,0,0,.7);
  }

  .bottom-bar {
    border-radius: 0 0 12px 12px;
  }
}

</style>
