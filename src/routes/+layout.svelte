<script lang="ts">
	import '../app.css';
	import RuleOverlay from '$lib/components/RuleOverlay.svelte';
	import SearchTrigger from '$lib/components/SearchTrigger.svelte';
	let { children } = $props();
</script>

{@render children()}
<SearchTrigger />
<RuleOverlay />
