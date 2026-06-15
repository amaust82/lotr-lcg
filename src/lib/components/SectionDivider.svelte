<div class="divider" aria-hidden="true">
  <span class="divider__line divider__line--left"></span>
  <span class="divider__leaf">❧</span>
  <span class="divider__line divider__line--right"></span>
</div>

<style>
.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: var(--section-gap, 34px);
  margin-bottom: 18px;
}

.divider__line {
  flex: 1;
  height: 1px;
  display: block;
}

.divider__line--left {
  background: linear-gradient(90deg, transparent, var(--crimson));
}

.divider__line--right {
  background: linear-gradient(90deg, var(--crimson), transparent);
}

.divider__leaf {
  font-family: var(--font-body);
  font-size: 21px;
  color: var(--crimson);
  line-height: 1;
  flex-shrink: 0;
}
</style>
