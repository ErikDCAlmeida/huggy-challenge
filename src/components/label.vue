<template>
  <div
    :class="['hc-label', { 'hc-label--content-size': autoSize }]"
    :style="`width: ${size}em;`"
  >
    <p
      :class="[
        `${fontStyle} ${color}--text`,
        { 'hc-label--ellipsis': ellipsis },
      ]"
      :style="`font-weight: ${bold}; text-align: ${align}`"
    >
      <slot></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: Number,
    default: 5,
  },
  align: {
    type: String,
    default: "left",
  },
  fontStyle: {
    type: String,
    default: "body-2",
  },
  color: {
    type: String,
    default: "foreground",
  },
  bold: {
    type: Number,
    default: 400,
  },
  autoSize: Boolean,
  ellipsis: Boolean,
});
</script>

<style lang="scss">
.hc-label {
  &--ellipsis {
    // white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &--content-size {
    width: 100% !important;
  }
}
</style>
