<script lang="ts">
  import { onMount } from 'svelte';

  let {
    label = 'Next Phase',
    onclick,
  }: { label?: string; onclick?: () => void } = $props();

  let buttonEl: HTMLButtonElement;
  let canvasEl: HTMLCanvasElement;
  let resizeTimer: ReturnType<typeof setTimeout>;

  function bake() {
    if (!canvasEl || !buttonEl) return;
    const dpr = window.devicePixelRatio || 1;
    const w = buttonEl.offsetWidth;
    const h = buttonEl.offsetHeight;
    if (!w || !h) return;

    canvasEl.width  = w * dpr;
    canvasEl.height = h * dpr;
    canvasEl.style.width  = w + 'px';
    canvasEl.style.height = h + 'px';

    const ctx = canvasEl.getContext('2d')!;
    ctx.scale(dpr, dpr);

    // Clip to pennant shape
    const notch = 20;
    const nib   = 14;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w - notch, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(w - notch, h);
    ctx.lineTo(0, h);
    ctx.lineTo(nib, h / 2);
    ctx.closePath();
    ctx.clip();

    // Stone texture tile
    const img = new Image();
    img.onload = () => {
      if (!ctx) return;
      // Re-clip after image load (ctx is same)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w - notch, 0);
      ctx.lineTo(w, h / 2);
      ctx.lineTo(w - notch, h);
      ctx.lineTo(0, h);
      ctx.lineTo(nib, h / 2);
      ctx.closePath();
      ctx.clip();

      const pat = ctx.createPattern(img, 'repeat');
      if (pat) {
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, w, h);
      }

      // Dark crimson base tint
      ctx.fillStyle = 'rgba(80,20,10,0.45)';
      ctx.fillRect(0, 0, w, h);

      // Radial highlight — top center brightening
      const hiGrad = ctx.createRadialGradient(w * 0.5, 0, 0, w * 0.5, h * 0.5, w * 0.6);
      hiGrad.addColorStop(0,   'rgba(220,160,100,0.28)');
      hiGrad.addColorStop(0.5, 'rgba(180,100,60,0.12)');
      hiGrad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = hiGrad;
      ctx.fillRect(0, 0, w, h);

      // Vignette
      const vigGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.3, w * 0.5, h * 0.5, w * 0.75);
      vigGrad.addColorStop(0,   'rgba(0,0,0,0)');
      vigGrad.addColorStop(1,   'rgba(0,0,0,0.55)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      // Gold rim — stroke the pennant polygon
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w - notch, 0);
      ctx.lineTo(w, h / 2);
      ctx.lineTo(w - notch, h);
      ctx.lineTo(0, h);
      ctx.lineTo(nib, h / 2);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(202,161,90,0.85)';
      ctx.lineWidth = 3;
      ctx.stroke();
    };
    img.src = '/assets/stone-crimson.png';
  }

  onMount(() => {
    bake();
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(bake, 120);
    });
    observer.observe(buttonEl);
    return () => observer.disconnect();
  });
</script>

<div class="pennant-wrap">
  <button
    bind:this={buttonEl}
    class="pennant"
    {onclick}
    type="button"
  >
    <canvas bind:this={canvasEl} class="pennant__canvas" aria-hidden="true"></canvas>
    <span class="pennant__label">{label}</span>
    <span class="pennant__sheen" aria-hidden="true"></span>
  </button>
</div>

<style>
.pennant-wrap {
  width: 100%;
  padding: 0 4px;
}

.pennant {
  position: relative;
  width: 100%;
  height: 52px;
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 14px 50%);
  background: #5c1a10;  /* fallback before canvas bakes */
  border: none;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: var(--shadow-stone);
  transition: filter var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.pennant:hover {
  filter: drop-shadow(0 9px 18px rgba(0,0,0,.6)) brightness(1.05);
}

.pennant:active {
  transform: translateY(2px);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,.55));
}

.pennant:focus-visible {
  outline: none;
  filter: drop-shadow(0 0 2px var(--gold-hi)) drop-shadow(0 0 8px var(--gold)) var(--shadow-stone);
}

.pennant__canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
}

.pennant__label {
  position: relative;
  z-index: 1;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #eedcb0;
  text-shadow:
    0 1px 0 rgba(255,240,205,.22),
    0 -1px 1px rgba(8,2,1,.9),
    0 -1px 3px rgba(0,0,0,.45);
}

/* Hover sheen sweep */
.pennant__sheen {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255,240,200,.12) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  background-position: 100% 0;
  pointer-events: none;
  transition: background-position 0.75s var(--ease-out);
}

.pennant:hover .pennant__sheen {
  background-position: 0% 0;
}

@media (prefers-reduced-motion: reduce) {
  .pennant__sheen {
    transition: none;
  }
}
</style>
