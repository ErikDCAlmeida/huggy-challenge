<script setup lang="ts">
import { onMounted, ref } from "vue";

const isLoading = ref(false);

const props = defineProps({
  onLoad: {
    type: Function,
    default: () => Promise.resolve(),
  },

  size: {
    type: String,
    default: "128",
  },

  contentClass: String,
});

onMounted(async () => {
  if (isLoading.value) {
    return;
  }

  if (!isLoading.value) {
    isLoading.value = true;
  }

  await props.onLoad();

  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="fill-a flex a-center j-center">
    <img src="@/assets/preloader.svg" :width="size" />
  </div>
  <div v-else :class="contentClass">
    <slot></slot>
  </div>
</template>

<style lang="scss"></style>
