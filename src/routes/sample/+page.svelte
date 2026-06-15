<!-- Texture Lab — surfaces, typography, and controls for iteration -->

<div class="lab">

  <!-- ══════════════════════════════════════════════
       Title border variations
       ══════════════════════════════════════════════ -->
  <section class="sample-section">
    <p class="sample-label">Title — V1: Dark stone plaque, linen texture, recessed shadowing</p>
    <div class="title-band tv1">
      <span class="tv-tengwar" aria-hidden="true">ash nazg durbatuluk ash nazg gimbatul ash nazg thrakat uluk agh burzum ishi krimpatul ash nazg durbatuluk ash nazg gimbatul</span>
      <h2 class="chapter-title">The Fellowship</h2>
      <svg class="tv-pendant" viewBox="0 0 24 14" fill="none" aria-hidden="true">
        <path d="M0,0 L24,0 L12,14 Z" fill="oklch(0.26 0.028 60)"/>
        <path d="M0,0 L24,0 L12,14 Z" stroke="oklch(0.42 0.050 68)" stroke-width="1.2" stroke-linejoin="miter"/>
      </svg>
    </div>
  </section>

  <section class="sample-section">
    <p class="sample-label">Title — V2: Gold metallic rule, ambient ring-glow</p>
    <div class="title-band tv2">
      <h2 class="chapter-title">The Fellowship</h2>
      <div class="tv2-rule">
        <span class="tv-tengwar tv-tengwar--rule" aria-hidden="true">ash nazg durbatuluk ash nazg gimbatul ash nazg thrakat uluk agh burzum ishi krimpatul ash nazg durbatuluk</span>
        <svg class="tv-pendant tv-pendant--rule" viewBox="0 0 20 12" fill="none" aria-hidden="true">
          <path d="M0,0 L20,0 L10,12 Z" fill="oklch(0.19 0.022 61)"/>
          <path d="M0,0 L20,0 L10,12 Z" stroke="oklch(0.46 0.056 68)" stroke-width="1.2" stroke-linejoin="miter"/>
        </svg>
      </div>
    </div>
  </section>


  <!-- ══════════════════════════════════════════════
       Button samples
       ══════════════════════════════════════════════ -->
  <section class="sample-section">
    <p class="sample-label">Buttons</p>
    <div class="btn-row">
      <button class="btn btn--primary">Begin Quest</button>
      <button class="btn btn--secondary">View Rules</button>
      <button class="btn btn--ghost">Dismiss</button>
      <button class="btn btn--primary" disabled>Exhausted</button>
    </div>
  </section>


  <!-- ══════════════════════════════════════════════
       Rules panel — parchment surface
       ══════════════════════════════════════════════ -->
  <section class="sample-section">
    <p class="sample-label">Parchment panel</p>
    <div class="rules-panel">
      <div class="rules-panel__content">
        <p class="rules-eyebrow">Rules Reference</p>
        <h3 class="rules-title">Ranged</h3>

        <svg class="rules-divider" viewBox="0 0 400 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="div-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stop-color="#5a3c18" stop-opacity="0"/>
              <stop offset="15%"  stop-color="#7a5628" stop-opacity="0.7"/>
              <stop offset="95%"  stop-color="#7a5628" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#7a5628" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="div-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stop-color="#7a5628" stop-opacity="0"/>
              <stop offset="5%"   stop-color="#7a5628" stop-opacity="0.7"/>
              <stop offset="85%"  stop-color="#7a5628" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#5a3c18" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect x="0"   y="7"  width="188" height="1"   fill="url(#div-l)"/>
          <rect x="0"   y="9"  width="188" height="0.6" fill="url(#div-l)" opacity="0.45"/>
          <rect x="212" y="7"  width="188" height="1"   fill="url(#div-r)"/>
          <rect x="212" y="9"  width="188" height="0.6" fill="url(#div-r)" opacity="0.45"/>
          <path d="M200,3 L208,8 L200,13 L192,8 Z" fill="#3a2208"/>
          <path d="M200,3 L208,8 L200,13 L192,8 Z" fill="none" stroke="#180902" stroke-width="2.5" stroke-linejoin="miter"/>
          <path d="M200,3 L208,8 L200,13 L192,8 Z" fill="none" stroke="#7a5224" stroke-width="1.4" stroke-linejoin="miter"/>
          <path d="M200,3 L208,8 L200,13 L192,8 Z" fill="none" stroke="#9a7038" stroke-width="0.6" stroke-linejoin="miter"/>
        </svg>

        <p class="rules-body">
          A character with the <em>Ranged</em> keyword can be used to attack enemies
          engaged with other players during the combat phase, even if that character
          is not engaged with an enemy himself.
        </p>
        <p class="rules-body">
          Characters with the <em>Sentinel</em> keyword may be exhausted to defend
          attacks made against other players, regardless of engagement.
        </p>
        <footer class="rules-source">Core Rulebook · p. 19</footer>
      </div>
    </div>
  </section>


  <!-- ══════════════════════════════════════════════
       Crimson swatch — rulebook cover material
       ══════════════════════════════════════════════ -->
  <section class="sample-section">
    <p class="sample-label">Dark surface</p>
    <div class="crimson-swatch">
      <div class="crimson-script" aria-hidden="true">
        ash nazg durbatuluk ash nazg gimbatul ash nazg thrakat uluk agh burzum ishi krimpatul
      </div>
      <div class="crimson-swatch__content">
        <h3 class="crimson-swatch__title">The Lord of the Rings</h3>
        <p class="crimson-swatch__sub">The Card Game</p>
      </div>
    </div>
  </section>

</div>


<style>

/* ─── LAB SHELL ─── */

.lab {
  min-height: 100dvh;
  padding: var(--space-20) var(--space-8) var(--space-24);
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
  position: relative;
  isolation: isolate;
}

.lab::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/textures/linen.png');
  background-size: 300px 300px;
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: -1;
}

.sample-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.sample-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: oklch(0.44 0.020 60);
  max-width: none;
}

/* ─── CHAPTER TITLE ─── */

.chapter-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--color-ink);
  letter-spacing: 0.06em;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 1px 12px oklch(0 0 0 / 0.6);
  position: relative;
  z-index: 1;
}

/* ─── TITLE BAND SHARED ─── */

.title-band {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.tv-tengwar {
  font-family: 'Tengwar Annatar', serif;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
  display: block;
  width: 100%;
}

.tv-pendant {
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 14px;
  display: block;
}

/* ─── V1: Full-width dark stone plaque, linen texture, recessed ─── */

.tv1 {
  width: 100%;
  padding: 1rem 2.5rem 1.2rem;
  background-color: oklch(0.26 0.028 60);
  background-image: url('/textures/linen.png');
  background-size: 320px 320px;
  background-blend-mode: soft-light;
  border: 1px solid oklch(0.42 0.050 68);
  box-shadow:
    0 0 0 1px oklch(0.16 0.014 56),
    inset 0 2px 10px oklch(0 0 0 / 0.40),
    inset 0 -1px 4px oklch(0 0 0 / 0.15),
    0 6px 20px oklch(0 0 0 / 0.35);
  overflow: hidden;
}

.tv1 .tv-tengwar {
  color: oklch(0.80 0.028 74 / 0.12);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-size: 1.3rem;
}

/* ─── V2: Textured surface, single top rule, double bottom rule band ─── */

.tv2 {
  width: 100%;
  padding-bottom: var(--space-2);
  gap: var(--space-2);
  border-top: 1px solid oklch(0.44 0.052 68 / 0.65);
}

.tv2-rule {
  position: relative;
  width: 100%;
  padding: 4px 0;
  background-color: oklch(0.19 0.022 61);
  background-image: url('/textures/linen.png');
  background-size: 320px 320px;
  background-blend-mode: soft-light;
  border-top: 1.5px solid oklch(0.46 0.056 68 / 0.85);
  border-bottom: 1.5px solid oklch(0.46 0.056 68 / 0.85);
  overflow: hidden;
}

.tv-tengwar--rule {
  color: oklch(0.72 0.045 70 / 0.52);
  font-size: 0.95rem;
  padding: 1px 0.5rem;
}

.tv-pendant--rule {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 12px;
}

/* ─── BUTTONS ─── */

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

.btn {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 0.65rem 1.6rem;
  border-radius: 2px;
  cursor: pointer;
  transition: background 100ms ease, color 100ms ease, border-color 100ms ease, box-shadow 100ms ease;
  white-space: nowrap;
}

/* Primary — dark stone face, bronze edge, warm text */
.btn--primary {
  color: oklch(0.80 0.046 72);
  background: oklch(0.26 0.036 62);
  border: 1px solid oklch(0.44 0.054 67);
  box-shadow:
    0 0 0 1px oklch(0.16 0.028 60),
    inset 0 1px 0 oklch(0.42 0.050 68 / 0.40);
}

.btn--primary:hover:not(:disabled) {
  background: oklch(0.30 0.040 64);
  border-color: oklch(0.52 0.060 70);
  color: oklch(0.88 0.042 74);
}

.btn--primary:active:not(:disabled) {
  background: oklch(0.22 0.032 60);
  box-shadow:
    0 0 0 1px oklch(0.16 0.028 60),
    inset 0 1px 3px oklch(0 0 0 / 0.35);
}

.btn--primary:disabled {
  opacity: 0.36;
  cursor: not-allowed;
}

/* Secondary — thin bronze outline */
.btn--secondary {
  color: oklch(0.68 0.042 68);
  background: transparent;
  border: 1px solid oklch(0.42 0.050 66 / 0.55);
  box-shadow: none;
}

.btn--secondary:hover {
  color: oklch(0.80 0.046 70);
  border-color: oklch(0.50 0.058 68 / 0.80);
  background: oklch(0.38 0.046 66 / 0.08);
}

.btn--secondary:active {
  background: oklch(0.38 0.046 66 / 0.14);
}

/* Ghost — text only */
.btn--ghost {
  color: oklch(0.54 0.022 58);
  background: transparent;
  border: 1px solid transparent;
  padding-left: var(--space-3);
  padding-right: var(--space-3);
}

.btn--ghost:hover {
  color: oklch(0.70 0.030 66);
}

/* ─── RULES PANEL ─── */

.rules-panel {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-lg), 0 0 0 1px oklch(0.45 0.048 64 / 0.60);
  background-color: oklch(0.89 0.032 82);
  background-image: url('/textures/paper.webp');
  background-size: 520px 520px;
  background-blend-mode: soft-light;
}

.rules-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 25%,
    oklch(0 0 0 / 0.22) 100%
  );
  pointer-events: none;
}

.rules-panel__content {
  position: relative;
  z-index: 1;
  padding: var(--space-8) var(--space-10) var(--space-10);
}

.rules-eyebrow {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: oklch(0.50 0.022 32);
  margin-bottom: var(--space-1);
  max-width: none;
}

.rules-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  color: oklch(0.18 0.030 30);
  line-height: 1.1;
  margin-bottom: var(--space-5);
  text-shadow: 0 1px 0 oklch(0.97 0.014 90);
}

.rules-divider {
  display: block;
  width: 100%;
  max-width: 400px;
  height: 16px;
  margin-bottom: var(--space-6);
}

.rules-body {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 1.0625rem;
  color: oklch(0.20 0.028 30);
  line-height: 1.75;
  max-width: 58ch;
  margin-bottom: var(--space-4);
}
.rules-body:last-of-type { margin-bottom: 0; }
.rules-body em { font-style: italic; color: oklch(0.30 0.042 20); }

.rules-source {
  margin-top: var(--space-8);
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  color: oklch(0.50 0.020 32);
  letter-spacing: 0.04em;
  max-width: none;
}

/* ─── CRIMSON SWATCH ─── */

.crimson-swatch {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xl);
  background-color: oklch(0.16 0.072 13);
  background-image: url('/textures/paper.webp');
  background-size: 380px 380px;
  background-blend-mode: soft-light;
}

.crimson-swatch::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 25%,
    oklch(0 0 0 / 0.55) 100%
  );
  pointer-events: none;
}

.crimson-script {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  font-family: 'Tengwar Annatar', serif;
  font-size: 1.8rem;
  color: oklch(0.95 0.008 80 / 0.07);
  letter-spacing: 0.12em;
  word-spacing: 0.6em;
  line-height: 2.0;
  user-select: none;
  pointer-events: none;
  overflow: hidden;
  white-space: nowrap;
  z-index: 1;
}

.crimson-swatch__content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.crimson-swatch__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: 0.06em;
  text-shadow: 0 2px 14px rgba(0,0,0,0.85), 0 0 40px rgba(0,0,0,0.5);
  line-height: 1.2;
}

.crimson-swatch__sub {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: oklch(0.93 0.010 82 / 0.55);
  margin-top: var(--space-2);
  max-width: none;
}

/* ─── RESPONSIVE ─── */

@media (max-width: 600px) {
  .lab { padding: var(--space-10) var(--space-4) var(--space-16); gap: var(--space-14); }
  .chapter-title { font-size: var(--text-2xl); }
}

</style>
