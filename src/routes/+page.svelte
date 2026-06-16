<script lang="ts">
  import Frame from '$lib/components/Frame.svelte';
</script>

<svelte:head>
  <title>LOTR LCG Companion</title>
</svelte:head>

<div class="home">
  <h1 class="title">LOTR LCG<br>Companion</h1>

  <nav class="tiles" aria-label="Main navigation">
    <a class="tile-link" href="/turn-guide/resource">
      <Frame class="tile-frame">
        <div class="tile-body">
          <span class="tile-eyebrow">Interactive</span>
          <span class="tile-name">Turn Guide</span>
        </div>
      </Frame>
    </a>

    <a class="tile-link" href="/collection">
      <Frame class="tile-frame">
        <div class="tile-body">
          <span class="tile-eyebrow">Manage</span>
          <span class="tile-name">Collection</span>
        </div>
      </Frame>
    </a>

    <a class="tile-link" href="/campaigns">
      <Frame class="tile-frame">
        <div class="tile-body">
          <span class="tile-eyebrow">Track</span>
          <span class="tile-name">Campaigns</span>
        </div>
      </Frame>
    </a>
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
  gap: 48px;
  padding: 32px;
}

.title {
  font-family: var(--font-display);
  font-size: clamp(28px, 8vw, 42px);
  font-weight: 400;
  color: var(--parchment-hi);
  text-align: center;
  line-height: 1.15;
  letter-spacing: 0.02em;
  margin: 0;
}

.tiles {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 340px;
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

.tile-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tile-eyebrow {
  font-family: var(--font-display-sc);
  font-size: 9px;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--gold-deep);
}

.tile-name {
  font-family: var(--font-display-sc);
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--parchment);
}
</style>
