<script lang="ts">
	import '../app.css';
	import RuleOverlay from '$lib/components/RuleOverlay.svelte';
	import SearchTrigger from '$lib/components/SearchTrigger.svelte';
	import { ruleOverlay } from '$lib/stores/ruleOverlay';
	let { children } = $props();

	function handleKey(e: KeyboardEvent) {
		const inInput = (e.target as HTMLElement)?.matches('input, textarea, select, [contenteditable]');
		if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !inInput)) {
			e.preventDefault();
			ruleOverlay.openSearch();
		}
	}
</script>

<svelte:window onkeydown={handleKey} />

{@render children()}
<SearchTrigger />
<RuleOverlay />
