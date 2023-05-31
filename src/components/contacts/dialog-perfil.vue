<script setup lang="ts">
import { type PropType, computed } from "vue";
import {
  HCButton,
  HCCard,
  HCDialog,
  HCIcon,
  HCUser,
  HCLabel,
} from "../../components";

const props = defineProps({
  persistent: Boolean,
  user: Object as PropType<any>,
  size: {
    type: String,
    default: "30",
  },
  modelValue: Boolean,
});

const emits = defineEmits([
  "update:modelValue",
  "clickToEdit",
  "clickToDelete",
  "resetInfos",
]);

const openDialog = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!props.persistent) {
      emits("update:modelValue", value);
    }
  },
});

const dialogLabels = computed(() => {
  return [
    {
      id: 1,
      title: "E-mail",
      data: props.user?.email,
    },
    {
      id: 2,
      title: "Endereço",
      data: props.user?.address,
    },
    {
      id: 3,
      title: "Bairro",
      data: props.user?.district,
    },
    {
      id: 4,
      title: "Cidade",
      data: props.user?.city,
    },
    {
      id: 5,
      title: "Estado",
      data: props.user?.state,
    },
  ];
});
</script>

<template>
  <HCDialog v-model="openDialog" :persistent="persistent">
    <HCCard color="button-color" class="page-contacts__card-visualizer">
      <div
        class="page__contacts__card-visualizer__main pa-4 flex a-center b-1--bottom mb-5 mine-shaft-30--border"
        :style="{ '--width-card-visualizer': `${size}em` }"
      >
        <HCUser
          class="mr-4"
          :user="{
            id: user.id,
            photo: user.photo,
            initials: 'NA',
            name: user.name,
          }"
        />
        <HCLabel class="mr-10" fontStyle="h2" ellipsis :size="20">{{
          user.name
        }}</HCLabel>
        <div class="flex a-center">
          <HCButton icon flat danger @click="emits('clickToDelete')">
            <HCIcon>delete</HCIcon>
          </HCButton>
          <HCButton icon flat class="mx-2" @click="emits('clickToEdit')">
            <HCIcon>edit</HCIcon>
          </HCButton>
          <HCButton icon flat @click="emits('resetInfos')" danger>
            <HCIcon>close</HCIcon>
          </HCButton>
        </div>
      </div>
      <div class="flex col">
        <div
          v-for="item in dialogLabels"
          :key="item.id"
          class="mb-6 flex a-center"
        >
          <HCLabel
            color="mine-shaft-100"
            :size="6.5"
            fontStyle="caption"
            class="mr-4"
            align="end"
            >{{ item.title }}</HCLabel
          >
          <HCLabel color="foreground" autoSize fontStyle="body-2">
            {{ item.data }}
          </HCLabel>
        </div>
      </div>
    </HCCard>
  </HCDialog>
</template>

<style>
.page-contacts__card-visualizer__main {
  width: var(--width-card-visualizer);
}
</style>
