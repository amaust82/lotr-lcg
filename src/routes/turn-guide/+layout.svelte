<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { PHASES } from '$lib/data/phases.js';

  let { children } = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    const fromSlug = navigation.from?.params?.phase;
    const toSlug   = navigation.to?.params?.phase;
    const fromIdx  = PHASES.findIndex(p => p.slug === fromSlug);
    const toIdx    = PHASES.findIndex(p => p.slug === toSlug);

    document.documentElement.dataset.navDir =
      fromIdx !== -1 && toIdx !== -1
        ? (toIdx > fromIdx ? 'fwd' : 'back')
        : '';

    return new Promise(resolve => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

{@render children()}
