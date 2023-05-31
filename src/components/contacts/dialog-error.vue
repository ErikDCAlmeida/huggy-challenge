<script setup lang="ts">
import { type PropType, computed } from "vue";
import { HCButton, HCCard, HCDialog } from "../../components";

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
        :style="{ '--width-card-error': `${size}em` }"
      >
        <p class="h2 text-center">
          {{ message }}
        </p>
        <div class="flex j-end a-center mt-10">
          <HCButton danger :loading="persistent" @click="openDialog = false"
            >Tudo bem</HCButton
          >
        </div>
      </div>
    </HCCard>
  </HCDialog>
</template>

<style></style>
