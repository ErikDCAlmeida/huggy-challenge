<template>
  <div class="hc-card flex col">
    <div class="hc-card__slot white-start--bg fill-a">
      <div
        :class="['hc-card__slot--header', { [`${color}--bg`]: color }]"
      ></div>
      <div></div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: "primary",
  },
});
</script>

<style lang="scss">
.hc-card {
  min-width: min-content !important;
  &__slot {
    position: relative;
    border-radius: 1em;
    &--header {
      height: 1em;
      width: 100%;
      z-index: -1;
      border-radius: 1em 1em 0 0;
      position: absolute;
      top: -3px;
      left: 0;
    }
  }
}
</style>
