<script lang="ts">
  import Frame from '$lib/components/Frame.svelte';
</script>

<svelte:head>
  <title>LOTR LCG Wayfellow</title>
</svelte:head>

<div class="home">
  <div class="home-header">
    <h1 class="title">
      <span class="title-product">LOTR LCG</span>
      <span class="title-name">Wayfellow</span>
    </h1>
    <span class="leaf" aria-hidden="true">❧</span>
  </div>

  <nav class="tiles" aria-label="Main navigation">
    <a class="tile-link tile-link--primary" href="/turn-guide/resource">
      <Frame variant="parchment" corners={false} class="tile-frame">
        <div class="tile-body tile-body--primary">
          <span class="tile-name tile-name--primary">Turn Guide</span>
          <span class="tile-desc">Step through each phase of play</span>
        </div>
      </Frame>
    </a>

    <div class="tiles-row">
      <a class="tile-link" href="/collection">
        <Frame corners={false} class="tile-frame">
          <div class="tile-body">
            <span class="tile-name">Collection</span>
          </div>
        </Frame>
      </a>

      <a class="tile-link" href="/campaigns">
        <Frame corners={false} class="tile-frame">
          <div class="tile-body">
            <span class="tile-name">Campaigns</span>
          </div>
        </Frame>
      </a>
    </div>
  </nav>
</div>

<style>
.home {
  background: var(--canvas);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 44px;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

/* Warm atmospheric glow from above — candlelight framing the title */
.home::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 55% at 50% -5%,
    color-mix(in srgb, var(--gold-deep) 22%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.home-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  margin: 0;
  text-align: center;
}

.title-product {
  font-family: var(--font-display-sc);
  font-size: 13px;
  letter-spacing: 0.38em;
  text-transform: uppercase;
  color: var(--gold-hi);
  line-height: 1;
}

.title-name {
  font-family: var(--font-display);
  font-size: clamp(34px, 10vw, 50px);
  font-weight: 400;
  color: var(--parchment-hi);
  letter-spacing: 0.01em;
  line-height: 1;
}

.leaf {
  font-family: var(--font-body);
  font-size: 18px;
  color: var(--gold);
  display: block;
  text-align: center;
  margin-top: 4px;
}

/* ── Navigation tiles ──────────────────────── */

.tiles {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 340px;
  position: relative;
  z-index: 1;
}

.tile-link {
  display: block;
  text-decoration: none;
}

.tile-link :global(.tile-frame) {
  transition:
    border-color var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}

.tiles-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ── Tile body ─────────────────────────────── */

.tile-body {
  padding: 15px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 52px;
}

.tile-body--primary {
  padding: 22px 22px 20px;
  gap: 7px;
  min-height: unset;
}

.tile-name {
  font-family: var(--font-display-sc);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--parchment);
}

/* Primary tile sits on parchment — needs dark ink */
.tile-name--primary {
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0.02em;
  text-transform: none;
  color: var(--ink);
  line-height: 1.1;
}

.tile-desc {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.45;
}
</style>
