<script lang="ts">
  let {
    eyebrow,
    title,
    subtitle,
  }: { eyebrow: string; title: string; subtitle?: string } = $props();

  const firstWord = $derived(title.split(' ')[0]);
  const rest = $derived(title.split(' ').slice(1).join(' '));
</script>

<div class="phead">
  <p class="phead__eyebrow">{eyebrow}</p>
  <h1 class="phead__title">
    <span class="phead__title-gold">{firstWord}</span>
    {#if rest}<span class="phead__title-dark"> {rest}</span>{/if}
  </h1>
  {#if subtitle}
    <p class="phead__sub">{subtitle}</p>
  {/if}
</div>

<style>
.phead {
  margin-bottom: 2px;
}

.phead__eyebrow {
  font-family: var(--font-display-sc);
  font-size: 11.5px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: var(--gold-deep);
  line-height: 1;
  max-width: none;
}

.phead__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 46px;
  color: var(--ink);
  line-height: 1.04;
  margin: 6px 0 0;
}

.phead__title-gold {
  color: var(--gold-hi);
}

.phead__title-dark {
  color: var(--ink);
}

.phead__sub {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 15px;
  color: var(--ink-soft);
  margin-top: 13px;
  line-height: 1.4;
  max-width: none;
}
</style>
