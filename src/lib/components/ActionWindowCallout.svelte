<script lang="ts">
  let { text }: { text: string } = $props();

  const tengwar = 'ash nazg durbatuluk ash nazg gimbatul ash nazg thrakat uluk agh burzum ishi krimpatul ash nazg durbatuluk ash nazg gimbatul';
</script>

<div class="callout">
  <!-- vignette -->
  <div class="callout__vignette" aria-hidden="true"></div>
  <!-- elven script watermark -->
  <div class="callout__script" aria-hidden="true">{tengwar}</div>

  <div class="callout__inner">
    <p class="callout__header">
      <span class="callout__rule" aria-hidden="true"></span>
      Action Window
      <span class="callout__rule" aria-hidden="true"></span>
    </p>
    <p class="callout__body">{text}</p>
  </div>
</div>

<style>
.callout {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  padding: 16px 20px 18px;
  background-color: oklch(0.16 0.072 13);
  background-image: url('/textures/paper.webp');
  background-size: 380px 380px;
  background-blend-mode: soft-light;
  box-shadow:
    0 0 0 1px oklch(0.30 0.060 13 / 0.70),
    0 4px 14px -4px oklch(0 0 0 / 0.55);
}

.callout__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 20%,
    oklch(0 0 0 / 0.45) 100%
  );
  pointer-events: none;
}

.callout__script {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 var(--space-4, 16px);
  font-family: var(--font-tengwar);
  font-size: 1.6rem;
  color: oklch(0.95 0.008 80 / 0.07);
  letter-spacing: 0.10em;
  word-spacing: 0.5em;
  line-height: 1.8;
  user-select: none;
  pointer-events: none;
  overflow: hidden;
  white-space: nowrap;
}

.callout__inner {
  position: relative;
  z-index: 1;
}

.callout__header {
  font-family: var(--font-display-sc);
  font-size: 11px;
  letter-spacing: 0.22em;
  color: oklch(0.70 0.046 70);
  text-align: center;
  line-height: 1;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: none;
}

.callout__rule {
  display: block;
  flex: 1;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    oklch(0.44 0.052 68 / 0.55),
    transparent
  );
}

.callout__body {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 13.5px;
  color: oklch(0.82 0.018 72);
  text-align: center;
  line-height: 1.5;
  max-width: none;
}
</style>
