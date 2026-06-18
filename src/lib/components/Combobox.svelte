<script lang="ts">
  export type ComboboxOption = {
    value: string;
    label: string;
    meta?: string;
  };

  console.log('[CB] instantiating');

  let {
    options = [],
    value = '',
    onchange,
    placeholder = '',
    freeText = false,
    inputId = '',
    class: className = '',
  }: {
    options?: ComboboxOption[];
    value?: string;
    onchange?: (v: string) => void;
    placeholder?: string;
    freeText?: boolean;
    inputId?: string;
    class?: string;
  } = $props();

  const uid = Math.random().toString(36).slice(2, 8);
  let open = $state(false);
  let query = $state('');
  let activeIndex = $state(-1);
  let inputEl: HTMLInputElement | undefined = $state();
  let listEl: HTMLUListElement | undefined = $state();
  let dropPos = $state({ top: 0, bottom: 0, left: 0, width: 0, up: false });

  const displayValue = $derived(
    open
      ? query
      : (options.find((o) => o.value === value)?.label ?? value ?? '')
  );

  const filtered = $derived(
    query.trim()
      ? options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase().trim())
        )
      : options
  );

  function updatePos() {
    if (!inputEl) return;
    const r = inputEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom - 4;
    const up = spaceBelow < 230;
    dropPos = {
      top: r.bottom + 4,
      bottom: window.innerHeight - r.top + 4,
      left: r.left,
      width: r.width,
      up,
    };
  }

  $effect(() => {
    console.log('[CB] mounted, inputEl:', !!inputEl, 'options:', options.length);
  });

  function openPicker() {
    console.log('[CB] openPicker — open:', open, 'inputEl:', !!inputEl, 'filtered:', filtered.length);
    if (open) return;
    updatePos();
    open = true;
    query = '';
    activeIndex = -1;
  }

  function closePicker() {
    open = false;
    query = '';
    activeIndex = -1;
  }

  function pick(opt: ComboboxOption) {
    onchange?.(opt.value);
    closePicker();
  }

  function handleInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    query = v;
    if (!open) open = true;
    activeIndex = -1;
    if (freeText) onchange?.(v);
    updatePos();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        openPicker();
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closePicker();
        inputEl?.blur();
        break;
      case 'ArrowDown':
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          pick(filtered[activeIndex]);
        }
        break;
      case 'Tab':
        closePicker();
        break;
    }
  }

  function handleWindowMousedown(e: MouseEvent) {
    if (!open) return;
    const t = e.target as Node;
    if (!inputEl?.contains(t) && !listEl?.contains(t)) {
      closePicker();
    }
  }
</script>

<svelte:window
  onmousedown={handleWindowMousedown}
  onscroll={updatePos}
  onresize={updatePos}
/>

<div class="cb {className}">
  <input
    bind:this={inputEl}
    id={inputId || undefined}
    class="cb-input"
    type="text"
    role="combobox"
    aria-expanded={open}
    aria-haspopup="listbox"
    aria-autocomplete="list"
    aria-controls={open ? `cb-list-${uid}` : undefined}
    aria-activedescendant={activeIndex >= 0 ? `cb-${uid}-${activeIndex}` : undefined}
    {placeholder}
    value={displayValue}
    onfocus={openPicker}
    onclick={openPicker}
    oninput={handleInput}
    onkeydown={handleKeydown}
  />
  <span class="cb-chevron" aria-hidden="true">
    <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
      <path d="M1 1l3.5 3L8 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
</div>

{#if open && filtered.length > 0}
  <ul
    bind:this={listEl}
    id="cb-list-{uid}"
    class="cb-list"
    role="listbox"
    style={dropPos.up
      ? `bottom:${dropPos.bottom}px;left:${dropPos.left}px;width:${dropPos.width}px`
      : `top:${dropPos.top}px;left:${dropPos.left}px;width:${dropPos.width}px`}
  >
    {#each filtered as opt, i (opt.value)}
      <li
        id="cb-{uid}-{i}"
        class="cb-opt"
        class:cb-opt--active={i === activeIndex}
        class:cb-opt--selected={opt.value === value}
        role="option"
        aria-selected={opt.value === value}
        onmousedown={(e) => { e.preventDefault(); pick(opt); }}
        onmouseover={() => (activeIndex = i)}
        onfocus={() => (activeIndex = i)}
      >
        <span class="cb-opt-label">{opt.label}</span>
        {#if opt.meta}
          <span class="cb-opt-meta">{opt.meta}</span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
.cb {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.cb-input {
  flex: 1;
  min-width: 0;
  font-family: var(--font-body, sans-serif);
  font-size: 13px;
  color: var(--parchment);
  background: color-mix(in srgb, var(--gold-deep) 8%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 16%, transparent);
  border-radius: 4px;
  padding: 5px 28px 5px 9px;
  outline: none;
  width: 100%;
  transition: border-color var(--duration-base);
}

.cb-input:focus {
  border-color: color-mix(in srgb, var(--gold) 42%, transparent);
}

.cb-input::placeholder {
  color: var(--gold-deep);
  opacity: 0.4;
}

.cb-chevron {
  position: absolute;
  right: 8px;
  color: var(--gold-deep);
  opacity: 0.55;
  pointer-events: none;
  display: flex;
  align-items: center;
  transition: opacity var(--duration-fast), transform var(--duration-fast);
}

.cb-list {
  position: fixed;
  z-index: 100;
  background: color-mix(in srgb, var(--gold-deep) 18%, var(--canvas));
  border: 1px solid color-mix(in srgb, var(--gold) 28%, transparent);
  border-radius: 6px;
  padding: 3px 0;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.65), 0 2px 6px rgba(0, 0, 0, 0.4);
  overscroll-behavior: contain;
}

.cb-list::-webkit-scrollbar {
  width: 4px;
}

.cb-list::-webkit-scrollbar-track {
  background: transparent;
}

.cb-list::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--gold) 22%, transparent);
  border-radius: 2px;
}

.cb-opt {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 7px 12px;
  cursor: pointer;
  transition: background var(--duration-fast);
}

.cb-opt:hover,
.cb-opt--active {
  background: color-mix(in srgb, var(--gold) 10%, transparent);
}

.cb-opt-label {
  font-family: var(--font-body, sans-serif);
  font-size: 13px;
  color: var(--parchment);
  line-height: 1.3;
}

.cb-opt--selected .cb-opt-label {
  color: var(--gold);
}

.cb-opt-meta {
  font-family: var(--font-display-sc);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--gold-deep);
  opacity: 0.75;
}
</style>
