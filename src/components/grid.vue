<script setup lang="ts">
import { HCUser, HCButton, HCIcon, HCInput } from "@/components";
import { ref, type PropType, computed } from "vue";

const hoverLine = ref(-1);

const emits = defineEmits([
  "update:modelValue",
  "click-row",
  "edit",
  "delete",
  "down-button",
  "up-button",
]);

const props = defineProps({
  request: {
    type: Array as PropType<Array<any>>,
    default: null,
    required: true,
  },
});

const sortByName = ref(false);
const pressedLine = ref(-1);
// const requestPageValue = computed(() => props.request.page);

// const actualPage = ref(0);

// const pageNormalized = computed({
//   get: () => requestPageValue.value,
//   set: (newValue) => {
//     if (newValue >= 1 && newValue <= totalPageNormalized.value) {
//       actualPage.value = newValue;
//       emits("update:modelValue", newValue);
//     }
//   },
// });

// const totalPageNormalized = computed(() => props.request?.totalPages);

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
  if (!item.disabled) {
    pressedLine.value = item.id;
  }
  emits("click-row", item);
}
</script>

<template>
  <div class="hc-grid">
    <div class="hc-grid__header">
      <div></div>
      <div
        :class="[
          'flex align-center caption py-2 pl-2 hc-grid__item__header--name-area',
          { 'mine-shaft-30--bg c-pointer': sortByName },
        ]"
        @mouseover.prevent="sortByName = true"
        @mouseleave="sortByName = false"
      >
        <span class="mr-1">Nome</span>
        <HCIcon>arrow-down</HCIcon>
      </div>
      <div class="caption flex start-center">E-mail</div>
      <div class="caption flex start-center">Telefone</div>
      <div></div>
    </div>
    <div class="hc-grid__body">
      <div
        v-for="item in arrayNormalized"
        :key="item.id"
        :class="[
          ' hc-grid__body__item py-2',
          {
            'mine-shaft-30--bg': item.id === pressedLine,
            'c-not-allowed': item.disabled,
          },
        ]"
        @click="clickRow(item)"
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
          v-model:model-value="item.name"
          compact
          readonly
          :disabled="item.disabled"
          placeholder="Não informado!"
          hide-messages
          name="name"
        ></HCInput>
        <HCInput
          v-model:model-value="item.email"
          compact
          readonly
          hide-messages
          placeholder="Não informado!"
          :disabled="item.disabled"
          name="email"
        ></HCInput>
        <HCInput
          v-model:model-value="item.phone"
          compact
          readonly
          type="phone"
          hide-messages
          :disabled="item.disabled"
          placeholder="Não informado!"
          name="phone"
        ></HCInput>
        <div class="flex justify-center">
          <HCButton
            v-if="
              (hoverLine === item.id || item.id === pressedLine) &&
              !item.disabled
            "
            icon
            flat
            class="mr-2"
            @click.stop="$emit('edit', item)"
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
            @click.stop="$emit('delete', item)"
          >
            <HCIcon name="delete" />
          </HCButton>
        </div>
      </div>
    </div>
    <!-- <div v-if="request?.totalPages > 1" class="hc-grid__footer pa-2 flex">
      <div class="flex-1"></div>
      <div class="flex start-center hc-grid__footer__pagination">
        <HCButton
          icon
          primary
          class="hc-grid__footer__pagination__btn"
          @click="$emit('down-button')"
        >
          <HCIcon>arrow-down</HCIcon>
        </HCButton>
        <HCInput
          v-model:modelValue="pageNormalized"
          text-center
          type="number"
          hide-messages
          :min="1"
          :max="totalPageNormalized"
          :max-size="4"
          class="hc-grid__footer__pagination__page mx-1"
          @update:modelValue="pageNormalized = $event"
        ></HCInput>
        <div class="hc-grid__footer__pagination__separator"></div>
        <HCInput
          v-model:model-value="totalPageNormalized"
          readonly
          hide-messages
          :max-size="4"
          text-center
          class="hc-grid__footer__pagination__page mx-1"
        ></HCInput>
        <HCButton
          class="hc-grid__footer__pagination__btn"
          icon
          primary
          @click="$emit('up-button')"
        >
          <HCIcon>arrow-up</HCIcon>
        </HCButton>
      </div>
    </div> -->
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
    &::-webkit-scrollbar {
      background-color: #b1b1b12f;
      width: 0.5em;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: #312bde;
    }
    &--name-area {
      border-radius: 8px;
      transition: all ease-in-out 0.25s;
    }
  }
  &__body {
    overflow-y: scroll;
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
