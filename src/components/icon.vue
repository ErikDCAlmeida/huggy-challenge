<template>
  <span :class="iconClass" />
</template>

<script setup lang="ts">
import { useSlots, computed } from "vue";

const slots = useSlots();
const name = computed(() =>
  (slots.default?.()?.[0].children as string)?.trim()
);
const iconClass = computed(() => `hc-i-${name.value ?? props.name}`);

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
});
</script>
