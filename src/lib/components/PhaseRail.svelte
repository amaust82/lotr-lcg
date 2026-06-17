<script lang="ts">
  import { untrack } from 'svelte';
  import type { Phase } from '$lib/data/phases.js';

  let {
    currentPhase = 0,
    phases = [],
  }: { currentPhase: number; phases: Phase[] } = $props();

  const PHASE_COUNT = 7;
  const cx = 32;
  const nodeY = [60, 160, 260, 360, 460, 560, 650];

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildPath(from: number, to: number): string {
    const points = nodeY.slice(from, to + 1);
    if (points.length < 2) return '';
    let d = `M ${cx} ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      const y0 = points[i - 1];
      const y1 = points[i];
      const offset = (i % 2 === 0) ? 8 : -8;
      d += ` C ${cx + offset} ${y0 + 30}, ${cx - offset} ${y1 - 30}, ${cx} ${y1}`;
    }
    return d;
  }

  // Trail draw animation state
  let drawnPhase = $state(currentPhase);
  let animSeg    = $state('');
  let drawing    = $state(false);

  $effect(() => {
    const to   = currentPhase;
    const from = untrack(() => drawnPhase);

    if (to === from) return;

    if (to > from) {
      if (reducedMotion) {
        // Snap without animation
        untrack(() => { drawnPhase = to; });
        return;
      }
      untrack(() => {
        animSeg = buildPath(from, to);
        drawing = false;
      });
      // Double RAF: let committed path render first, then start draw
      const r1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => { drawing = true; });
      });
      return () => cancelAnimationFrame(r1);
    } else {
      // Backward: snap immediately
      untrack(() => {
        drawnPhase = to;
        animSeg    = '';
        drawing    = false;
      });
    }
  });

  function onDrawEnd() {
    drawnPhase = currentPhase;
    animSeg    = '';
    drawing    = false;
  }

  const committedPath = $derived(buildPath(0, drawnPhase));
  const todoPaths     = $derived(
    currentPhase < PHASE_COUNT - 1 ? buildPath(currentPhase, PHASE_COUNT - 1) : ''
  );
</script>

<nav class="rail" aria-label="Phase navigation">
  <svg
    class="rail__svg"
    viewBox="0 0 64 700"
    preserveAspectRatio="xMidYMid meet"
    overflow="visible"
  >
    <!-- Committed done trail (static) -->
    {#if committedPath}
      <path class="trail trail--done" d={committedPath} aria-hidden="true" />
    {/if}

    <!-- Animating new segment (forward navigation) -->
    {#if animSeg}
      <path
        class="trail trail--seg"
        class:trail--seg-active={drawing}
        d={animSeg}
        pathLength="1"
        aria-hidden="true"
        onanimationend={onDrawEnd}
      />
    {/if}

    <!-- Todo trail -->
    {#if todoPaths}
      <path class="trail trail--todo" d={todoPaths} aria-hidden="true" />
    {/if}

    <!-- Waypoint markers -->
    {#each nodeY as y, i}
      {@const slug = phases[i]?.slug ?? ''}
      {@const name = phases[i]?.name ?? ''}
      <a
        href="/turn-guide/{slug}"
        class="node-link"
        aria-label="{name} Phase"
        aria-current={i === currentPhase ? 'page' : undefined}
      >
        <!-- Invisible large hit target -->
        <circle class="node__hit" cx={cx} cy={y} r="18" />

        <!-- Tooltip label (full phase name, visible on hover) -->
        <text class="node-tooltip" x={cx + 38} y={y + 1}>{name}</text>

        {#if i < currentPhase}
          <rect class="waypoint waypoint--done" x={cx - 28} y={y - 9} width="56" height="18" rx="3" />
          <text class="waypoint-label waypoint-label--done" x={cx} y={y + 1}>{phases[i]?.abbr}</text>
        {:else if i === currentPhase}
          <rect class="waypoint-ring" x={cx - 32} y={y - 14} width="64" height="28" rx="6" />
          <rect class="waypoint waypoint--cur" x={cx - 29} y={y - 11} width="58" height="22" rx="4" />
          <text class="waypoint-label waypoint-label--cur" x={cx} y={y + 1}>{phases[i]?.abbr}</text>
        {:else}
          <rect class="waypoint waypoint--todo" x={cx - 28} y={y - 9} width="56" height="18" rx="3" />
          <text class="waypoint-label waypoint-label--todo" x={cx} y={y + 1}>{phases[i]?.abbr}</text>
        {/if}
      </a>
    {/each}
  </svg>
</nav>

<style>
.rail {
  position: relative;
  width: 64px;
  height: 700px;
  flex-shrink: 0;
}

.rail__svg {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  overflow: visible;
}

.trail {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.trail--done {
  stroke: var(--ink);
  stroke-width: 2.4;
}

.trail--todo {
  stroke: var(--ink);
  stroke-width: 2;
  opacity: 0.3;
  stroke-dasharray: 1.5 8;
}

/* Animating segment */
.trail--seg {
  stroke: var(--ink);
  stroke-width: 2.4;
  stroke-dasharray: 1;
  stroke-dashoffset: 1; /* hidden until animation starts */
}

.trail--seg-active {
  animation: draw-seg 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes draw-seg {
  to { stroke-dashoffset: 0; }
}

/* Node link */
.node-link {
  cursor: pointer;
}

.node-link:focus-visible {
  outline: none;
}

/* Invisible hit area */
.node__hit {
  fill: transparent;
}

/* Waypoint marker boxes */
.waypoint {
  transition: fill var(--duration-base) var(--ease-out), stroke var(--duration-base) var(--ease-out);
}

.waypoint--done {
  fill: var(--ink);
}

.waypoint--cur {
  fill: var(--ink);
}

.waypoint--todo {
  fill: var(--parchment-hi);
  stroke: rgba(44, 33, 23, 0.35);
  stroke-width: 1.5;
}

/* Pulsing ring around the current waypoint */
.waypoint-ring {
  fill: none;
  stroke: rgba(176, 141, 63, 0.4);
  stroke-width: 1.5;
  animation: waypoint-ring-pulse 3s ease-in-out infinite;
}

@keyframes waypoint-ring-pulse {
  0%, 100% { stroke-opacity: 0.35; }
  50%       { stroke-opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  .waypoint-ring { animation: none; }
}

/* Labels inside waypoints */
.waypoint-label {
  font-family: var(--font-display-sc, 'Cinzel', serif);
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  user-select: none;
  transition: fill var(--duration-base) var(--ease-out);
}

.waypoint-label--done {
  font-size: 10px;
  letter-spacing: 0.08em;
  fill: var(--parchment-hi);
}

.waypoint-label--cur {
  font-size: 10px;
  letter-spacing: 0.1em;
  fill: var(--parchment-hi);
}

.waypoint-label--todo {
  font-size: 10px;
  letter-spacing: 0.08em;
  fill: rgba(44, 33, 23, 0.45);
}

/* Tooltip label */
.node-tooltip {
  font-family: var(--font-display-sc, 'Cinzel', serif);
  font-size: 10px;
  letter-spacing: 0.08em;
  dominant-baseline: middle;
  pointer-events: none;
  user-select: none;
  fill: var(--parchment);
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-out);
}

.node-link:hover .node-tooltip,
.node-link:focus-visible .node-tooltip {
  opacity: 1;
}

/* Hover / focus effects */
.node-link:hover .waypoint--todo,
.node-link:focus-visible .waypoint--todo {
  fill: color-mix(in srgb, var(--ink) 10%, var(--parchment-hi));
  stroke: rgba(44, 33, 23, 0.6);
}

.node-link:hover .waypoint-label--todo,
.node-link:focus-visible .waypoint-label--todo {
  fill: rgba(44, 33, 23, 0.7);
}

.node-link:hover .waypoint--done,
.node-link:focus-visible .waypoint--done {
  fill: var(--gold-deep);
}

.node-link:hover .waypoint-label--done,
.node-link:focus-visible .waypoint-label--done {
  fill: var(--parchment-hi);
}
</style>
