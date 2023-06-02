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
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();

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

const smallScreen = computed(() => {
  return width.value <= 600;
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
    <HCCard
      color="button-color"
      class="page-contacts__card-visualizer"
      :style="{ '--width-card-visualizer': smallScreen ? '90vw' : `${size}em` }"
    >
      <div class="page-contacts__card-visualizer__general">
        <div
          class="pa-4 flex a-center b-1--bottom mb-5 mine-shaft-30--border"
          :class="{
            'page-contacts__card-visualizer__general__top--small': smallScreen,
            'page-contacts__card-visualizer__general__top': !smallScreen,
          }"
        >
          <div
            class="flex a-center fill-w page-contacts__card-visualizer__general__top__user"
            :class="{
              'page-contacts__card-visualizer__general__top--small__user':
                smallScreen,
            }"
          >
            <HCUser
              class="mr-4"
              :user="{
                id: user.id,
                photo: user.photo,
                initials: 'NA',
                name: user.name,
              }"
              :size="smallScreen ? '48' : '32'"
            />
            <HCLabel class="flex-1" fontStyle="h2" ellipsis>{{
              user.name
            }}</HCLabel>
          </div>
          <div
            class="flex a-center page-contacts__card-visualizer__general__top__actions"
            :class="{
              'page-contacts__card-visualizer__general__top--small__actions fill-w flex end-center mb-5':
                smallScreen,
            }"
          >
            <HCButton icon flat danger @click="emits('clickToDelete')">
              <HCIcon>delete</HCIcon>
            </HCButton>
            <HCButton
              icon
              flat
              class="mx-2"
              :class="{ 'mx-4': smallScreen }"
              @click="emits('clickToEdit')"
            >
              <HCIcon>edit</HCIcon>
            </HCButton>
            <HCButton icon flat @click="emits('resetInfos')" danger>
              <HCIcon>close</HCIcon>
            </HCButton>
          </div>
        </div>
        <div
          :class="{
            'page-contacts__card-visualizer__general__main--small col start px-5':
              smallScreen,
            'flex col page-contacts__card-visualizer__general__main overflow-hidden':
              !smallScreen,
          }"
        >
          <div
            v-for="item in dialogLabels"
            :key="item.id"
            class="mb-5 flex a-center mr-5"
            :class="{
              'page-contacts__card-visualizer__general__main--small__item flex col start':
                smallScreen,
            }"
          >
            <HCLabel
              color="mine-shaft-100"
              :size="6.5"
              fontStyle="caption"
              class="mr-4"
              :class="{ 'mb-1': smallScreen }"
              :align="smallScreen ? 'start' : 'end'"
              >{{ item.title }}</HCLabel
            >
            <HCLabel
              color="foreground"
              autoSize
              fontStyle="body-2"
              ellipsis
              class="overflow-hidden"
            >
              {{ item.data }}
            </HCLabel>
          </div>
        </div>
      </div>
    </HCCard>
  </HCDialog>
</template>

<style lang="scss">
.page-contacts__card-visualizer__general {
  width: var(--width-card-visualizer);
  &__top {
    &--small {
      flex-direction: column-reverse !important;
      &__actions {
        span {
          font-size: 1.2em !important;
        }
      }
    }
  }
}
</style>
