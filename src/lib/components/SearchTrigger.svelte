<script lang="ts">
	import { ruleOverlay } from '$lib/stores/ruleOverlay';
</script>

<button class="search-trigger" aria-label="Search" onclick={() => ruleOverlay.openSearch()}>
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<circle cx="11" cy="11" r="8"/>
		<line x1="21" y1="21" x2="16.65" y2="16.65"/>
	</svg>
</button>

<style>
.search-trigger {
	position: fixed;
	top: 16px;
	right: 16px;
	z-index: var(--z-search-trigger, 90);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 1px solid oklch(0.33 0.052 68 / 0.45);
	background: oklch(0.16 0.072 13 / 0.85);
	color: oklch(0.65 0.046 70);
	cursor: pointer;
	backdrop-filter: blur(8px);
	transition:
		background var(--duration-fast, 120ms) ease,
		color var(--duration-fast, 120ms) ease,
		border-color var(--duration-fast, 120ms) ease;
}

.search-trigger:hover {
	background: oklch(0.22 0.072 13 / 0.90);
	color: oklch(0.82 0.046 70);
	border-color: oklch(0.45 0.052 68 / 0.6);
}

.search-trigger:focus-visible {
	outline: 2px solid oklch(0.52 0.052 68 / 0.8);
	outline-offset: 2px;
}
</style>
