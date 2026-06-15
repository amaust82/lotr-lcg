<svelte:head>
  <title>LOTR LCG Companion</title>
</svelte:head>

<div class="landing">
  <h1 class="title">LOTR LCG Companion</h1>
  <a class="cta" href="/turn-guide/resource">Begin Game →</a>
  <p class="hint"><a href="/design">Design System</a></p>
</div>

<style>
.landing {
  background: var(--canvas);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px;
}

.title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 400;
  color: var(--parchment-hi);
  text-align: center;
}

.cta {
  font-family: var(--font-display-sc);
  font-size: 13px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--parchment);
  background: var(--crimson);
  padding: 12px 28px;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.15s ease;
}

.cta:hover {
  background: #9c3420;
  color: var(--parchment-hi);
  text-decoration: none;
}

.hint {
  font-family: var(--font-display-sc);
  font-size: 10px;
  letter-spacing: 0.18em;
  max-width: none;
}

.hint a {
  color: rgba(176,141,63,.4);
  text-decoration: none;
}

.hint a:hover {
  color: var(--gold);
  text-decoration: none;
}
</style>
