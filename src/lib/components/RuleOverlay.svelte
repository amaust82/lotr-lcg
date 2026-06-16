<script lang="ts">
	import { ruleOverlay } from '$lib/stores/ruleOverlay';
	import { rules, type RuleEntry } from '$lib/data/rules';
	import { collection } from '$lib/stores/collection';
	import { tick } from 'svelte';

	function findRule(name: string): RuleEntry | undefined {
		return rules.find((r) => r.name === name);
	}

	let expanded = $state(false);
	let searchQuery = $state('');
	let sheetEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if ($ruleOverlay.isOpen && $ruleOverlay.mode === 'detail') {
			expanded = false;
		}
	});

	$effect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') ruleOverlay.close();
		}
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	});

	$effect(() => {
		if ($ruleOverlay.isOpen) {
			document.body.style.overflow = 'hidden';
			tick().then(() => {
				const first = sheetEl?.querySelector<HTMLElement>(
					'button, input, [tabindex]:not([tabindex="-1"])'
				);
				first?.focus();
			});
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) ruleOverlay.close();
	}
</script>

{#if $ruleOverlay.isOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="overlay" role="presentation" onclick={handleBackdropClick}>
		<div
			class="sheet"
			role="dialog"
			aria-modal="true"
			aria-labelledby={$ruleOverlay.mode === 'detail' ? 'overlay-title' : undefined}
			bind:this={sheetEl}
		>
			<div class="sheet__vignette" aria-hidden="true"></div>
			<div class="sheet__handle" aria-hidden="true"></div>

			{#if $ruleOverlay.mode === 'detail'}
				{@const entry = $ruleOverlay.entry}
				{@const hasBack = $ruleOverlay.backStack.length > 0}

				<div class="sheet__header">
					{#if hasBack}
						<button class="btn-nav btn-back" onclick={() => ruleOverlay.back()}>← Back</button>
					{:else}
						<div class="btn-nav-spacer"></div>
					{/if}
					<span class="type-badge">{entry.type}</span>
					<button class="btn-nav btn-close" onclick={() => ruleOverlay.close()} aria-label="Close">✕</button>
				</div>

				<div class="sheet__body">
					<h2 class="entry-name" id="overlay-title">{entry.name}</h2>
					<p class="entry-ref">{entry.ref}</p>
					<p class="entry-summary">{entry.summary}</p>

					{#if entry.full}
						{#if expanded}
							<p class="entry-full">{entry.full}</p>
						{/if}
						<button class="btn-expand" onclick={() => (expanded = !expanded)}>
							{expanded ? 'Show less' : 'Full rule'}
						</button>
					{/if}
				</div>

				{#if entry.related.length > 0}
					<div class="sheet__footer">
						<p class="related-label">See also</p>
						<div class="related-list">
							{#each entry.related as name}
								{#if findRule(name)}
									<button class="related-chip" onclick={() => ruleOverlay.navigate(findRule(name)!)}>
										{name}
									</button>
								{:else}
									<span class="related-chip related-chip--inactive">{name}</span>
								{/if}
							{/each}
						</div>
					</div>
				{/if}

			{:else if $ruleOverlay.mode === 'search'}
				<div class="sheet__header">
					<div class="btn-nav-spacer"></div>
					<span class="type-badge">Rules</span>
					<button class="btn-nav btn-close" onclick={() => ruleOverlay.close()} aria-label="Close">✕</button>
				</div>

				<div class="sheet__body">
					<input
						type="search"
						class="search-input"
						placeholder="Search rules…"
						bind:value={searchQuery}
						aria-label="Search rules"
					/>
					{#if searchQuery}
						{@const results = rules.filter((r) =>
							r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
							($collection.showEverything || $collection.products[r.product]),
						)}
						<ul class="search-results">
							{#each results as result}
								<li>
									<button class="search-result-btn" onclick={() => ruleOverlay.open(result)}>
										<span class="result-name">{result.name}</span>
										<span class="result-type">{result.type}</span>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
/* ── Backdrop ─────────────────────────────────────── */
.overlay {
	position: fixed;
	inset: 0;
	z-index: var(--z-modal);
	background: oklch(0 0 0 / 0.62);
	display: flex;
	align-items: flex-end;
	padding: 0;
	animation: overlay-in var(--duration-base) var(--ease-out) both;
}

@keyframes overlay-in {
	from { opacity: 0; }
}

/* ── Sheet ────────────────────────────────────────── */
.sheet {
	position: relative;
	width: calc(100% - 88px);
	max-width: 480px;
	margin: 0 auto;
	max-height: 72dvh;
	overflow-y: auto;
	overscroll-behavior: contain;
	border-radius: 14px 14px 0 0;
	background-color: oklch(0.16 0.072 13);
	background-image: url('/textures/paper.webp');
	background-size: 380px 380px;
	background-blend-mode: soft-light;
	box-shadow:
		0 0 0 1px oklch(0.30 0.060 13 / 0.70),
		0 -8px 40px -4px oklch(0 0 0 / 0.6);
	animation: sheet-in var(--duration-slow) var(--ease-out) both;
}

@keyframes sheet-in {
	from { transform: translateY(100%); }
}

@media (prefers-reduced-motion: reduce) {
	.overlay { animation: none; }
	.sheet   { animation: none; }
}

/* ── Cosmetic vignette ────────────────────────────── */
.sheet__vignette {
	position: absolute;
	inset: 0;
	border-radius: inherit;
	background: radial-gradient(
		ellipse at 50% 0%,
		transparent 30%,
		oklch(0 0 0 / 0.28) 100%
	);
	pointer-events: none;
}

/* ── Handle ───────────────────────────────────────── */
.sheet__handle {
	width: 36px;
	height: 3px;
	background: oklch(0.44 0.052 68 / 0.45);
	border-radius: 2px;
	margin: 14px auto 0;
}

/* ── Header ───────────────────────────────────────── */
.sheet__header {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 20px 0;
}

.btn-nav {
	font-family: var(--font-display-sc);
	font-size: 11px;
	letter-spacing: 0.18em;
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px 0;
	min-height: 36px;
	display: flex;
	align-items: center;
	transition: color var(--duration-fast) var(--ease-out);
	white-space: nowrap;
}

.btn-back {
	color: oklch(0.65 0.046 70);
}
.btn-back:hover { color: oklch(0.82 0.046 70); }

.btn-close {
	color: oklch(0.50 0.040 68);
	font-size: 16px;
	justify-content: flex-end;
	min-width: 32px;
}
.btn-close:hover { color: oklch(0.75 0.018 72); }

.btn-nav-spacer {
	min-width: 48px;
}

.type-badge {
	flex: 1;
	font-family: var(--font-display-sc);
	font-size: 10px;
	letter-spacing: 0.22em;
	color: oklch(0.60 0.052 68);
	text-transform: uppercase;
	text-align: center;
}

/* ── Body ─────────────────────────────────────────── */
.sheet__body {
	position: relative;
	z-index: 1;
	padding: 14px 24px 22px;
}

.entry-name {
	font-family: var(--font-display);
	font-size: 30px;
	font-weight: 400;
	color: var(--parchment-hi);
	line-height: 1.08;
	letter-spacing: -0.01em;
	margin-bottom: 4px;
}

.entry-ref {
	font-family: var(--font-display-sc);
	font-size: 10.5px;
	letter-spacing: 0.18em;
	color: oklch(0.52 0.052 68);
	margin-bottom: 14px;
	max-width: none;
}

.entry-summary {
	font-family: var(--font-body);
	font-size: 15.5px;
	line-height: 1.55;
	color: oklch(0.82 0.018 72);
}

.entry-full {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 1.6;
	color: oklch(0.68 0.018 72);
	margin-top: 14px;
	padding-top: 14px;
	border-top: 1px solid oklch(0.28 0.060 13 / 0.55);
}

.btn-expand {
	margin-top: 12px;
	font-family: var(--font-display-sc);
	font-size: 10.5px;
	letter-spacing: 0.18em;
	color: oklch(0.56 0.052 68);
	text-transform: uppercase;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	transition: color var(--duration-fast) var(--ease-out);
}
.btn-expand:hover { color: oklch(0.75 0.046 70); }

/* ── Footer / Related ─────────────────────────────── */
.sheet__footer {
	position: relative;
	z-index: 1;
	border-top: 1px solid oklch(0.25 0.060 13 / 0.7);
	padding: 16px 24px max(20px, env(safe-area-inset-bottom, 0px));
}

.related-label {
	font-family: var(--font-display-sc);
	font-size: 10px;
	letter-spacing: 0.22em;
	color: oklch(0.48 0.040 68);
	text-transform: uppercase;
	margin-bottom: 10px;
	max-width: none;
}

.related-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.related-chip {
	font-family: var(--font-body);
	font-size: 13.5px;
	color: oklch(0.72 0.046 70);
	background: oklch(0.21 0.060 13 / 0.8);
	border: 1px solid oklch(0.33 0.052 68 / 0.5);
	border-radius: var(--radius-pill);
	padding: 5px 14px;
	cursor: pointer;
	transition:
		background var(--duration-fast) var(--ease-out),
		color var(--duration-fast) var(--ease-out);
}
.related-chip:hover {
	background: oklch(0.27 0.060 13);
	color: oklch(0.90 0.018 72);
}
.related-chip--inactive {
	opacity: 0.45;
	cursor: default;
}
.related-chip--inactive:hover {
	background: oklch(0.21 0.060 13 / 0.8);
	color: oklch(0.72 0.046 70);
}

/* ── Search ───────────────────────────────────────── */
.search-input {
	width: 100%;
	font-family: var(--font-body);
	font-size: 16px;
	color: oklch(0.85 0.018 72);
	background: oklch(0.21 0.060 13 / 0.8);
	border: 1px solid oklch(0.33 0.052 68 / 0.5);
	border-radius: var(--radius-md);
	padding: 10px 14px;
	outline: none;
	margin-bottom: 8px;
	transition: border-color var(--duration-fast) var(--ease-out),
	            box-shadow var(--duration-fast) var(--ease-out);
}
.search-input:focus {
	border-color: oklch(0.52 0.052 68 / 0.8);
	box-shadow: 0 0 0 2px oklch(0.52 0.052 68 / 0.18);
}
.search-input::placeholder {
	color: oklch(0.50 0.030 68);
}

.search-results {
	list-style: none;
}

.search-result-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 11px 0;
	border: none;
	border-bottom: 1px solid oklch(0.25 0.060 13 / 0.55);
	background: none;
	cursor: pointer;
	text-align: left;
	transition: opacity var(--duration-fast) var(--ease-out);
}
.search-result-btn:hover { opacity: 0.75; }

.result-name {
	font-family: var(--font-body);
	font-size: 15px;
	color: oklch(0.82 0.018 72);
}

.result-type {
	font-family: var(--font-display-sc);
	font-size: 10px;
	letter-spacing: 0.18em;
	color: oklch(0.52 0.052 68);
	text-transform: uppercase;
	flex-shrink: 0;
}
</style>
