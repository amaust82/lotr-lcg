<script lang="ts">
  import PhaseHeader     from '$lib/components/PhaseHeader.svelte';
  import SectionHeader   from '$lib/components/SectionHeader.svelte';
  import SectionDivider  from '$lib/components/SectionDivider.svelte';
  import ActionWindowCallout from '$lib/components/ActionWindowCallout.svelte';
  import StonePennant    from '$lib/components/StonePennant.svelte';
</script>

<svelte:head>
  <title>Illuminated Folio · Design System</title>
</svelte:head>

<div class="scene">

  <!-- Header -->
  <header class="ds-header">
    <p class="ds-header__eyebrow">LOTR LCG Wayfellow</p>
    <h1 class="ds-header__title">Illuminated Folio</h1>
    <p class="ds-header__sub">Design System · Component Reference</p>
    <a href="/turn-guide/resource" class="ds-header__cta">Open Turn Guide →</a>
  </header>

  <div class="ds-body">

    <!-- ── 01 Typography ─────────────────────────── -->
    <section class="ds-section">
      <div class="band">
        <span class="band__pip" aria-hidden="true"></span>
        <span class="band__num">01</span>
        <h2 class="band__title">Typography</h2>
      </div>

      <div class="specimen-panel">

        <div class="type-row">
          <div class="type-sample">
            <p class="type--display">Quest Phase</p>
            <p class="type-meta">IM Fell English · 46px · display title</p>
          </div>
        </div>

        <div class="type-row">
          <div class="type-sample">
            <p class="type--section-header">Commit Characters</p>
            <p class="type-meta">IM Fell English · 24px · section header</p>
          </div>
        </div>

        <div class="type-row">
          <div class="type-sample">
            <p class="type--eyebrow">The Round · Phase III</p>
            <p class="type-meta">IM Fell English SC · 11.5px · eyebrow</p>
          </div>
        </div>

        <div class="type-row">
          <div class="type-sample">
            <p class="type--body">Each player may commit any number of heroes and allies to the quest by exhausting them. Characters committed to the Quest add their <strong class="type--strong">Willpower</strong> to the total.</p>
            <p class="type-meta">EB Garamond · 16px · body</p>
          </div>
        </div>

        <div class="type-row">
          <div class="type-sample">
            <p class="type--body-italic">Not all those who wander are lost.</p>
            <p class="type-meta">EB Garamond italic · pull quote</p>
          </div>
        </div>

        <div class="type-row">
          <div class="type-sample">
            <p class="type--tengwar">tengwar ornament</p>
            <p class="type-meta">Tengwar Annatar · ornament only</p>
          </div>
        </div>

      </div>
    </section>


    <!-- ── 02 Phase Header ───────────────────────── -->
    <section class="ds-section">
      <div class="band">
        <span class="band__pip" aria-hidden="true"></span>
        <span class="band__num">02</span>
        <h2 class="band__title">Phase Header</h2>
      </div>

      <div class="specimen-panel specimen-panel--parchment">
        <PhaseHeader
          eyebrow="The Round · Phase III"
          title="Quest Phase"
          subtitle="The road is long; progress must be made or darkness grows."
        />
      </div>
    </section>


    <!-- ── 03 Section Header ─────────────────────── -->
    <section class="ds-section">
      <div class="band">
        <span class="band__pip" aria-hidden="true"></span>
        <span class="band__num">03</span>
        <h2 class="band__title">Section Header</h2>
      </div>

      <div class="specimen-panel specimen-panel--parchment">
        <SectionHeader eyebrow="Step 1" heading="Commit Characters" />
        <SectionDivider />
        <SectionHeader eyebrow="Step 2" heading="Staging" />
      </div>
    </section>


    <!-- ── 04 Section Divider ────────────────────── -->
    <section class="ds-section">
      <div class="band">
        <span class="band__pip" aria-hidden="true"></span>
        <span class="band__num">04</span>
        <h2 class="band__title">Section Divider</h2>
      </div>

      <div class="specimen-panel specimen-panel--parchment">
        <p class="type--body">Preceding content.</p>
        <SectionDivider />
        <p class="type--body" style="margin-top:16px">Following content.</p>
      </div>
    </section>


    <!-- ── 05 Action Window Callout ──────────────── -->
    <section class="ds-section">
      <div class="band">
        <span class="band__pip" aria-hidden="true"></span>
        <span class="band__num">05</span>
        <h2 class="band__title">Action Window Callout</h2>
      </div>

      <div class="specimen-panel specimen-panel--parchment">
        <ActionWindowCallout
          text="Players may take actions after committing characters but before encounter cards are revealed."
        />
      </div>
    </section>


    <!-- ── 06 Stone Pennant Button ───────────────── -->
    <section class="ds-section">
      <div class="band">
        <span class="band__pip" aria-hidden="true"></span>
        <span class="band__num">06</span>
        <h2 class="band__title">Stone Pennant Button</h2>
      </div>

      <div class="specimen-panel">
        <p class="ds-desc">Canvas-baked stone texture with inlaid gold rim. Hover for sheen; click for press state.</p>
        <div class="button-demo">
          <StonePennant label="Next Phase" />
        </div>
      </div>
    </section>


    <!-- ── 07 Colors ─────────────────────────────── -->
    <section class="ds-section">
      <div class="band">
        <span class="band__pip" aria-hidden="true"></span>
        <span class="band__num">07</span>
        <h2 class="band__title">Color Tokens</h2>
      </div>

      <div class="specimen-panel">
        <div class="swatch-grid">
          {#each [
            ['--parchment',    '#ecdfbf', 'parchment'],
            ['--parchment-hi', '#f4ecd2', 'parchment-hi'],
            ['--parchment-lo', '#e1d0a9', 'parchment-lo'],
            ['--ink',          '#2c2117', 'ink'],
            ['--ink-soft',     '#5a4a33', 'ink-soft'],
            ['--crimson',      '#7c2a1c', 'crimson'],
            ['--crimson-deep', '#641f12', 'crimson-deep'],
            ['--gold',         '#b08d3f', 'gold'],
            ['--gold-hi',      '#caa15a', 'gold-hi'],
            ['--gold-lt',      '#e0c073', 'gold-lt'],
            ['--gold-deep',    '#8a6a2e', 'gold-deep'],
            ['--vine',         '#5d6a37', 'vine'],
            ['--canvas',       '#201d18', 'canvas'],
          ] as [varName, hex, label]}
            <div class="swatch">
              <div class="swatch__fill" style="background:var({varName})"></div>
              <p class="swatch__label">{label}</p>
              <p class="swatch__hex">{hex}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

  </div>

  <footer class="ds-footer">
    <p>LOTR LCG Wayfellow · Illuminated Folio v1.0</p>
    <a href="/turn-guide/resource">Open Turn Guide →</a>
  </footer>

</div>


<style>

/* ── Scene ────────────────────────────────── */

.scene {
  background: var(--canvas);
  min-height: 100dvh;
}

/* ── Header ───────────────────────────────── */

.ds-header {
  background: linear-gradient(180deg, #2c271d 0%, var(--canvas) 100%);
  padding: 60px 32px 48px;
  text-align: center;
  border-bottom: 1px solid rgba(176,141,63,.2);
}

.ds-header__eyebrow {
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold-hi);
  margin-bottom: 12px;
  max-width: none;
}

.ds-header__title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 400;
  color: var(--parchment-hi);
  line-height: 1.1;
}

.ds-header__sub {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 16px;
  color: var(--gold);
  margin-top: 10px;
  max-width: none;
}

.ds-header__cta {
  display: inline-block;
  margin-top: 24px;
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--parchment);
  background: var(--crimson);
  padding: 10px 22px;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.15s ease;
}
.ds-header__cta:hover {
  background: #9c3420;
  text-decoration: none;
  color: var(--parchment-hi);
}

/* ── Body ─────────────────────────────────── */

.ds-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

.ds-section {
  margin-bottom: 0;
}

.ds-desc {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(236,223,191,.55);
  line-height: 1.5;
  margin-bottom: 16px;
  max-width: 60ch;
}

/* ── Section band ─────────────────────────── */

.band {
  display: flex;
  align-items: center;
  gap: 14px;
  border-top: 2px solid var(--crimson-deep);
  padding: 20px 0 8px;
  margin: 56px 0 24px;
}

.band__pip {
  display: block;
  width: 10px;
  height: 10px;
  background: var(--crimson);
  transform: rotate(45deg);
  flex-shrink: 0;
}

.band__num {
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: 0.22em;
  color: rgba(236,223,191,.45);
  flex-shrink: 0;
}

.band__title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 400;
  color: var(--parchment);
}

/* ── Specimen panels ──────────────────────── */

.specimen-panel {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(176,141,63,.18);
  border-radius: 8px;
  padding: 28px 32px;
}

.specimen-panel--parchment {
  background: radial-gradient(150% 130% at 18% -5%, var(--parchment-hi) 0%, var(--parchment) 46%, var(--parchment-lo) 100%);
  color: var(--ink);
}

/* ── Type specimens ───────────────────────── */

.type-row {
  padding: 16px 0;
  border-bottom: 1px solid rgba(176,141,63,.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.type-row:last-child { border-bottom: none; }

.type-sample { max-width: none; }

.type-meta {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: rgba(176,141,63,.6);
  margin-top: 4px;
  max-width: none;
}

.type--display {
  font-family: var(--font-display);
  font-size: 46px;
  font-weight: 400;
  color: var(--parchment-hi);
  line-height: 1.04;
  max-width: none;
}

.type--section-header {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  color: var(--parchment);
  max-width: none;
}

.type--eyebrow {
  font-family: var(--font-display-sc);
  font-size: 11.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--crimson);
  max-width: none;
}

.type--body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink-mid);
  max-width: 58ch;
}

.type--strong {
  font-weight: 600;
  color: var(--crimson);
}

.type--body-italic {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 17.5px;
  line-height: 1.5;
  color: var(--ink-soft);
  max-width: 58ch;
}

.type--tengwar {
  font-family: var(--font-tengwar);
  font-size: 24px;
  letter-spacing: 0.06em;
  color: var(--gold);
  max-width: none;
}

/* ── Button demo ──────────────────────────── */

.button-demo {
  max-width: 340px;
}

/* ── Swatches ─────────────────────────────── */

.swatch-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.swatch {
  width: 90px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(176,141,63,.2);
}

.swatch__fill {
  height: 52px;
}

.swatch__label {
  background: rgba(255,255,255,.05);
  padding: 4px 6px 2px;
  font-family: var(--font-display-sc);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: rgba(236,223,191,.6);
  max-width: none;
}

.swatch__hex {
  background: rgba(255,255,255,.05);
  padding: 0 6px 4px;
  font-family: var(--font-display-sc);
  font-size: 8.5px;
  letter-spacing: 0.08em;
  color: rgba(236,223,191,.35);
  max-width: none;
}

/* ── Footer ───────────────────────────────── */

.ds-footer {
  border-top: 1px solid rgba(176,141,63,.15);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.ds-footer p {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: rgba(236,223,191,.35);
  max-width: none;
}

.ds-footer a {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  text-decoration: none;
}
.ds-footer a:hover { color: var(--gold-hi); text-decoration: none; }

</style>
