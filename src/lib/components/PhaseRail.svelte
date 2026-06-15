<script lang="ts">
  import type { Phase } from '$lib/data/phases.js';

  let {
    currentPhase = 0,
    phases = [],
  }: { currentPhase: number; phases: Phase[] } = $props();

  const PHASE_COUNT = 7;
  const cx = 22;
  const nodeY = [60, 160, 260, 360, 460, 560, 650];

  function buildPath(from: number, to: number): string {
    const points = nodeY.slice(from, to + 1);
    if (points.length < 2) return '';
    let d = `M ${cx} ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      const y0 = points[i - 1];
      const y1 = points[i];
      const cy = (y0 + y1) / 2;
      const offset = (i % 2 === 0) ? 8 : -8;
      d += ` C ${cx + offset} ${y0 + 30}, ${cx - offset} ${y1 - 30}, ${cx} ${y1}`;
    }
    return d;
  }

  const donePath  = $derived(buildPath(0, Math.max(0, currentPhase)));
  const todoPaths = $derived(
    currentPhase < PHASE_COUNT - 1 ? buildPath(currentPhase, PHASE_COUNT - 1) : ''
  );
</script>

<nav class="rail" aria-label="Phase navigation">
  <svg
    class="rail__svg"
    viewBox="0 0 44 700"
    preserveAspectRatio="xMidYMid meet"
    overflow="visible"
  >
    <!-- Done trail -->
    {#if donePath}
      <path class="trail trail--done" d={donePath} aria-hidden="true" />
    {/if}

    <!-- Todo trail -->
    {#if todoPaths}
      <path class="trail trail--todo" d={todoPaths} aria-hidden="true" />
    {/if}

    <!-- Nodes -->
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

        {#if i < currentPhase}
          <circle class="node node--done" cx={cx} cy={y} r="5.5" />
        {:else if i === currentPhase}
          <circle class="node node--cur" cx={cx} cy={y} r="8" />
          <circle class="node node--cur-ring" cx={cx} cy={y} r="11" />
        {:else}
          <circle class="node node--todo" cx={cx} cy={y} r="5.5" />
        {/if}
      </a>
    {/each}
  </svg>
</nav>

<style>
.rail {
  position: relative;
  width: 44px;
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
  stroke: #2c2117;
  stroke-width: 2.4;
}

.trail--todo {
  stroke: #2c2117;
  stroke-width: 2;
  opacity: 0.3;
  stroke-dasharray: 1.5 8;
}

/* Node link */
.node-link {
  cursor: pointer;
}

.node-link:focus-visible {
  outline: none;
}

.node-link:focus-visible .node--todo,
.node-link:hover .node--todo {
  fill: var(--parchment);
  stroke: rgba(176,141,63,0.7);
  stroke-width: 2;
}

.node-link:focus-visible .node--done,
.node-link:hover .node--done {
  fill: var(--gold-deep);
}

/* Invisible hit area */
.node__hit {
  fill: transparent;
}

.node--done {
  fill: #2c2117;
}

.node--todo {
  fill: var(--parchment-hi);
  stroke: rgba(44,33,23,.6);
  stroke-width: 1.5;
}

.node--cur {
  fill: #2c2117;
}

.node--cur-ring {
  fill: none;
  stroke: rgba(176,141,63,.4);
  stroke-width: 3;
}
</style>
