<template>
  <div
    v-if="openDialog"
    class="hc-dialog flex center fill-sa"
    @click="openDialog = false"
  >
    <div class="hc-dialog__area-slot" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: Boolean,
  persistent: Boolean,
});

const openDialog = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!props.persistent) {
      emits("update:modelValue", value);
    }
  },
});
</script>

<style lang="scss">
.hc-dialog {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: var(--index-low);
  &__area-slot {
    border-radius: 1em;
  }
}
</style>
