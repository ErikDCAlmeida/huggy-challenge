<script setup lang="ts">
import { HCUser, HCButton, HCIcon, HCInput, HCProgress } from "@/components";
import { ref, type PropType, computed, reactive, watchEffect } from "vue";
import { useInfiniteScroll, useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();

const sizes = reactive({
  noActions: false,
  list: false,
  minimum: false,
});

watchEffect(() => {
  if (width.value <= 800) {
    sizes.noActions = true;
  } else {
    sizes.noActions = false;
  }
  if (width.value < 700) {
    sizes.list = true;
  } else {
    sizes.list = false;
  }
  if (width.value < 360) {
    sizes.minimum = true;
  } else {
    sizes.minimum = false;
  }
});

const hoverLine = ref(-1);

const emits = defineEmits([
  "update:modelValue",
  "click-row",
  "edit",
  "delete",
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

const { isLoading } = useInfiniteScroll(
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

const sizeActions = computed(() => {
  if (!sizes.noActions) {
    return "6em";
  }
  return "0";
});

function clickRow(item: any) {
  if (!item.item.disabled) {
    pressedLine.value = item.item.id;
  }
  emits("click-row", item);
}

const controlLoadBar = reactive({
  old: 0,
  new: props.request.length,
});

watchEffect(() => {
  const oldData = controlLoadBar.new;
  controlLoadBar.new = props.request.length;
  controlLoadBar.old = oldData;
});

const noMore = computed(() => {
  if (!controlLoadBar.new && !controlLoadBar.old) {
    return true;
  }
  return !(
    controlLoadBar.new - controlLoadBar.old > 0 &&
    controlLoadBar.new - controlLoadBar.old < 20
  );
});
</script>

<template>
  <div
    v-if="arrayNormalized.length"
    class="hc-grid"
    :class="{ 'b-1--top mine-shaft-30--border pt-2': sizes.list }"
    :style="{
      '--no-actions': sizeActions,
      '--size-avatar': sizes.list ? (!sizes.minimum ? '5em' : '4em') : '3em',
    }"
  >
    <div class="relative">
      <div v-if="!sizes.list" class="hc-grid__header">
        <div></div>
        <div class="hc-grid__header__title-infos">
          <div
            class="flex align-center c-pointer caption py-2 pl-2 hc-grid__header__title-infos__name-area"
            @click="emits('update:sortDesc', !sortDesc)"
          >
            <span class="mr-1">Nome</span>
            <HCIcon v-if="sortDesc">arrow-down</HCIcon>
            <HCIcon v-else>arrow-up</HCIcon>
            <span class="ml-1 hc-grid__header__title-infos__name-area--number"
              >({{ arrayNormalized.length }})</span
            >
          </div>
          <div class="caption flex start-center">E-mail</div>
          <div class="caption flex start-center">Telefone</div>
        </div>
        <div v-if="!sizes.noActions"></div>
      </div>
      <HCProgress
        v-if="isLoading && noMore"
        class="absolute"
        indeterminate
      ></HCProgress>
    </div>
    <div class="hc-grid__body" ref="element">
      <div
        v-for="(item, index) in arrayNormalized"
        :key="item.id"
        :class="[
          'hc-grid__body__item py-2',
          {
            'mine-shaft-30--bg': item.id === pressedLine,
            'c-not-allowed': item.disabled,
            'hc-grid__body__item-list': sizes.list,
          },
        ]"
        :style="{ '--columns-gap': sizes.minimum ? '0.6em' : '1.5em' }"
        @click="clickRow({ item, index })"
        @mouseover="hoverLine = item.id"
        @mouseleave="hoverLine = -1"
      >
        <div
          class="flex"
          :class="{
            'a-start j-center ml-2': sizes.list,
            center: !sizes.list,
          }"
        >
          <HCUser
            :user="{
              id: item.id,
              initials: item.initials,
              name: item.name,
              photo: item.photo,
            }"
            :size="sizes.list ? (!sizes.minimum ? '64' : '48') : '32'"
          ></HCUser>
        </div>
        <div v-if="sizes.list" class="hc-grid__body__item-list__infos">
          <div class="mb-2">
            <p class="uppercase small button-color--text small mb-1">Nome</p>
            <HCInput
              v-model="item.name"
              compact
              readonly
              :disabled="item.disabled"
              hide-messages
              name="name"
            ></HCInput>
          </div>
          <div class="mb-2">
            <p class="uppercase small button-color--text small mb-1">E-mail</p>
            <HCInput
              v-model="item.email"
              compact
              readonly
              :disabled="item.disabled"
              hide-messages
              name="email"
            ></HCInput>
          </div>
          <div class="mb-2">
            <p class="uppercase small button-color--text small mb-1">
              Telefone
            </p>
            <HCInput
              v-model="item.phone"
              compact
              readonly
              :disabled="item.disabled"
              hide-messages
              name="telefone"
            ></HCInput>
          </div>
        </div>
        <div v-else class="hc-grid__body__item__infos">
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
        </div>
        <div v-if="!sizes.noActions" class="flex center">
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
  border-radius: 0 0 0.5em 0.5em;
  height: inherit !important;
  &__header {
    display: grid;
    grid-template-columns: var(--size-avatar) 1fr var(--no-actions);
    border-radius: 0.5em;
    column-gap: 1.5em;
    transition: all ease-in-out 0.15s;
    border-bottom: 1px solid #e1e1e1;
    border-radius: 8px 8px 0px 0px;
    &__title-infos {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) repeat(2, 10em);
      &__name-area {
        &--number {
          color: #321bde;
        }
        &:hover {
          background-color: #321bde;
          color: #ffffff;
          border-radius: 4px 4px 0 0;
          .hc-grid__header__title-infos__name-area--number {
            color: #ffffff;
          }
        }
      }
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
      grid-template-columns: var(--size-avatar) 1fr var(--no-actions);
      border-radius: 0.5em;
      column-gap: var(--columns-gap);
      transition: all ease-in-out 0.15s;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      &__infos {
        display: grid;
        grid-template-columns: minmax(150px, 1fr) repeat(2, 10em);
      }
    }
    &__item-list {
      &__infos {
        .hc-input__area-input {
          padding: 0 !important;
          margin: 0 !important;
          &__input {
            padding: 0 !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 1em !important;
            line-height: 1.5em !important;
            letter-spacing: 0.15px !important;
          }
        }
      }
    }
  }
  row-gap: 1em;
}
</style>
