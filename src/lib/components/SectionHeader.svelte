<script lang="ts">
  let {
    eyebrow,
    heading,
  }: { eyebrow: string; heading: string } = $props();
</script>

<div class="section-header">
  <span class="section-header__leaf" aria-hidden="true">❧</span>
  <div class="section-header__text">
    <p class="section-header__eyebrow">{eyebrow}</p>
    <h3 class="section-header__heading">{heading}</h3>
  </div>
</div>

<style>
.section-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.section-header__leaf {
  font-family: var(--font-body);
  font-size: 18px;
  color: var(--gold);
  line-height: 1.2;
  margin-top: 2px;
  flex-shrink: 0;
}

.section-header__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-header__eyebrow {
  font-family: var(--font-display-sc);
  font-size: 10.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--crimson);
  line-height: 1;
  max-width: none;
}

.section-header__heading {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  color: #241a12;
  line-height: 1.1;
}
</style>
