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
  modelValue: Boolean,
});

const emits = defineEmits(["update:modelValue", "resetInfos", "deleteContact"]);

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
  <HCDialog v-model="openDialog" :persistent="persistent">
    <HCCard color="danger" class="page-contacts__card-delete">
      <div
        class="pa-5 page-contacts__card-delete__main"
        :style="{ '--width-card-delete': small ? '95vw' : `${size}em` }"
      >
        <HCLabel font-style="h2" ellipsis class="fill-w text-center">
          Excluir o contato "{{ user.name }}" ?
        </HCLabel>
        <div class="flex j-end a-center mt-10">
          <HCButton
            secondary
            class="mr-5"
            :disabled="persistent"
            @click="emits('resetInfos')"
            >Cancelar</HCButton
          >
          <HCButton danger :loading="persistent" @click="emits('deleteContact')"
            >Excluir</HCButton
          >
        </div>
      </div>
    </HCCard>
  </HCDialog>
</template>

<style lang="scss">
.page-contacts__card-delete {
  &__main {
    width: var(--width-card-delete);
  }
}
</style>
