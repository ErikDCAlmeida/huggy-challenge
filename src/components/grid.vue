<script setup lang="ts">
import { HCUser, HCButton, HCIcon, HCInput } from "@/components";
import { ref, type PropType, computed } from "vue";
import { useInfiniteScroll } from "@vueuse/core";

const hoverLine = ref(-1);

const emits = defineEmits([
  "update:modelValue",
  "click-row",
  "edit",
  "delete",
  // "down-button",
  // "up-button",
  "update:sortDesc",
]);

const props = defineProps({
  request: {
    type: Array as PropType<Array<any>>,
    default: null,
    required: true,
  },
  onLoadMore: {} as PropType<any>,
  sortDesc: Boolean,
});

const element = ref();

useInfiniteScroll(
  element,
  async () => {
    await props.onLoadMore();
  },
  { distance: 10 }
);

const pressedLine = ref(-1);

const arrayNormalized = computed({
  get: () => {
    return props.request;
  },
  set: (items) => {
    arrayNormalized.value = items.sort(
      (before: any, after: any) => before.name - after.name
    );
  },
});

function clickRow(item: any) {
  if (!item.item.disabled) {
    pressedLine.value = item.item.id;
  }
  emits("click-row", item);
}
</script>

<template>
  <div v-if="arrayNormalized.length" class="hc-grid">
    <div class="hc-grid__header">
      <div></div>
      <div
        class="flex align-center c-pointer caption py-2 pl-2 hc-grid__header--name-area"
        @click="emits('update:sortDesc', !sortDesc)"
      >
        <span class="mr-1">Nome</span>
        <HCIcon v-if="sortDesc">arrow-down</HCIcon>
        <HCIcon v-else>arrow-up</HCIcon>
      </div>
      <div class="caption flex start-center">E-mail</div>
      <div class="caption flex start-center">Telefone</div>
      <div></div>
    </div>
    <div class="hc-grid__body" ref="element">
      <div
        v-for="(item, index) in arrayNormalized"
        :key="item.id"
        :class="[
          ' hc-grid__body__item py-2',
          {
            'mine-shaft-30--bg': item.id === pressedLine,
            'c-not-allowed': item.disabled,
          },
        ]"
        @click="clickRow({ item, index })"
        @mouseover="hoverLine = item.id"
        @mouseleave="hoverLine = -1"
      >
        <div class="flex center">
          <HCUser
            :user="{
              id: item.id,
              initials: item.initials,
              name: item.name,
              photo: item.photo,
            }"
          ></HCUser>
        </div>
        <HCInput
          v-model="item.name"
          compact
          readonly
          :disabled="item.disabled"
          placeholder="Não informado!"
          hide-messages
          name="name"
        ></HCInput>
        <HCInput
          v-model="item.email"
          compact
          readonly
          hide-messages
          placeholder="Não informado!"
          :disabled="item.disabled"
          name="email"
        ></HCInput>
        <HCInput
          v-model="item.phone"
          compact
          readonly
          type="phone"
          hide-messages
          :disabled="item.disabled"
          placeholder="Não informado!"
          name="phone"
        ></HCInput>
        <div class="flex center">
          <HCButton
            v-if="
              (hoverLine === item.id || item.id === pressedLine) &&
              !item.disabled
            "
            icon
            flat
            class="mr-2"
            @click.stop="emits('edit', { item, index })"
          >
            <HCIcon name="edit" />
          </HCButton>
          <HCButton
            v-if="
              (hoverLine === item.id || item.id === pressedLine) &&
              !item.disabled
            "
            icon
            flat
            danger
            @click.stop="emits('delete', { item, index })"
          >
            <HCIcon name="delete" />
          </HCButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.hc-grid {
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 0.5em;
  height: inherit !important;
  &__header {
    display: grid;
    grid-template-columns: 3em minmax(150px, 1fr) repeat(2, 10em) 6em;
    border-radius: 0.5em;
    column-gap: 1.5em;
    transition: all ease-in-out 0.15s;
    border-bottom: 1px solid #e1e1e1;
    border-radius: 8px 8px 0px 0px;
    overflow-x: auto;
    &--name-area {
      &:hover {
        background-color: #321bde;
        color: #ffffff;
        border-radius: 4px 4px 0 0;
      }
    }
    &::-webkit-scrollbar {
      background-color: #b1b1b12f;
      width: 0.5em;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: #312bde;
    }
  }
  &__body {
    overflow-y: scroll;
    padding-right: 2px;
    &::-webkit-scrollbar {
      background-color: #b1b1b12f;
      width: 0.5em;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: #312bde;
    }
    &__item {
      display: grid;
      grid-template-columns: 3em minmax(150px, 1fr) repeat(2, 10em) 6em;
      border-radius: 0.5em;
      column-gap: 1.5em;
      transition: all ease-in-out 0.15s;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
  &__footer {
    background-color: #b1b1b12f;
    border-radius: 8px;
    &__pagination {
      &__separator {
        height: 80%;
        width: 2px;
        border-radius: 8px !important;
        background-color: #312bde;
      }
    }
  }
  row-gap: 1em;
}
</style>
