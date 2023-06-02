<script setup lang="ts">
import { type PropType, computed } from "vue";
import { HCButton, HCCard, HCDialog, HCLabel } from "../../components";
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  persistent: Boolean,
  user: Object as PropType<any>,
  size: {
    type: String,
    default: "30",
  },
  message: String,
  modelValue: Boolean,
});

const emits = defineEmits(["update:modelValue"]);

const { width } = useWindowSize();

const small = computed(() => width.value < 520);

const openDialog = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!props.persistent) {
      emits("update:modelValue", value);
    }
  },
});
</script>

<template>
  <HCDialog v-model="openDialog" persistent>
    <HCCard color="danger" class="page-contacts__card-error">
      <div
        class="pa-5 page-contacts__card-error__main"
        :style="{ '--width-card-error': small ? '95vw' : `${size}em` }"
      >
        <HCLabel font-style="h2" ellipsis class="fill-w text-center">
          {{ message }}
        </HCLabel>
        <div class="flex j-end a-center mt-10">
          <HCButton danger :loading="persistent" @click="openDialog = false"
            >Tudo bem</HCButton
          >
        </div>
      </div>
    </HCCard>
  </HCDialog>
</template>

<style lang="scss">
.page-contacts__card-error {
  &__main {
    width: var(--width-card-error);
  }
}
</style>
