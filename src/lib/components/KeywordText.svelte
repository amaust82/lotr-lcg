<script lang="ts">
	import { parseKeywords, resolveKeyword } from '$lib/utils/parseKeywords';
	import { ruleOverlay } from '$lib/stores/ruleOverlay';
	import { collection } from '$lib/stores/collection';
	import { rules } from '$lib/data/rules';

	let { text }: { text: string } = $props();

	const segments = $derived(parseKeywords(text));

	function isOwned(product: string): boolean {
		return $collection.showEverything || $collection.products[product] === true;
	}
</script>

{#each segments as seg}
	{#if seg.type === 'text'}
		{seg.value}
	{:else}
		{@const entry = resolveKeyword(seg.name, rules)}
		{#if entry && isOwned(entry.product)}
			<button class="keyword-link" onclick={() => ruleOverlay.open(entry)}>{seg.name}</button>
		{:else}
			{seg.name}
		{/if}
	{/if}
{/each}

<style>
.keyword-link {
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	font: inherit;
	color: var(--crimson);
	text-decoration: underline;
	text-decoration-style: dotted;
	text-underline-offset: 2px;
}

.keyword-link:hover {
	opacity: 0.75;
}
</style>
