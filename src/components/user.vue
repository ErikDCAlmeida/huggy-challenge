<template>
  <div
    class="hc-user flex center background-user--bg"
    :key="user.id"
    :style="{ '--size': `${size}px` }"
  >
    <img
      v-if="user.photo"
      class="hc-user__img"
      :src="user.photo"
      :alt="user.name"
    />
    <span v-else class="hc-user__initials sub-2 persian-blue-800--text">{{
      user.initials ?? "??"
    }}</span>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

export interface UserType {
  id: number;
  name: string;
  photo: string;
  initials: string;
}

defineProps({
  user: {
    type: Object as PropType<UserType>,
    default: null,
  },
  size: {
    type: String,
    default: "32",
  },
});
</script>

<style lang="scss">
.hc-user {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  overflow: hidden;
  &__img {
    width: inherit;
    height: inherit;
  }
}
</style>
