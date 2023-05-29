<template>
  <div class="hc-input">
    <span v-if="label" class="caption c-default">{{ label }}</span>
    <div
      :class="[
        'flex hc-input__area-input my-1 align-center pa-1',
        {
          'hc-input__area-input--focused button-color--border':
            isFocused && !compact && !readonly,
          'hc-input__area-input--error alizarin-crimson-500--border':
            !!(errorMessage ?? error) && !isFocused,
          'hc-input__area-input--disabled': disabled,
          'hc-input__area-input--compact': compact,
        },
      ]"
    >
      <div
        v-if="hasSlotIcon"
        :class="[
          'mx-2 flex center mine-shaft-100--text',
          { 'mine-shaft-60--text': disabled },
        ]"
      >
        <slot name="icon"></slot>
      </div>
      <input
        ref="input"
        v-model="valueInput"
        :class="[
          'hc-input__area-input__input pa-1 body-2 flex-1',
          {
            'mine-shaft-60--text c-not-allowed': disabled,
            'c-default': readonly,
            'hc-input__area-input__input--text-center': textCenter,
          },
        ]"
        :type="type"
        :style="`width: ${maxSize}em !important`"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :minlength="min"
        :maxlength="max"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <Transition name="fade">
      <div v-if="!hideMessages" class="hc-input--error-message">
        <p class="caption danger--text">{{ errorMessage ?? error }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useSlots, computed, ref, type PropType, toRef } from "vue";
import type { RuleExpression } from "vee-validate";
import { useField } from "vee-validate";
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  readonly: Boolean,
  type: {
    type: String,
    default: "text",
  },
  error: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Digite aqui...",
  },
  min: {
    type: String,
    default: "0",
  },
  max: {
    type: String,
    default: "200",
  },
  rules: [String, Object, Array] as PropType<RuleExpression<any>>,
  maxSize: Number,
  textCenter: Boolean,
  compact: Boolean,
  hideMessages: Boolean,
  disabled: Boolean,
  modelValue: {} as PropType<any>,
});

defineExpose({
  blur,
  focus,
});

const hasSlotIcon = computed(() => slots.icon);

const { value, errorMessage } = useField(
  toRef(props, "name"),
  toRef(props, "rules"),
  {
    label: toRef(props, "name"),
    initialValue: props.modelValue,
  }
);

const valueInput = computed({
  get: () =>
    props.type === "phone"
      ? phoneNormalized(String(props.modelValue))
      : props.modelValue,
  set: (newValue) => {
    value.value =
      props.type === "phone"
        ? String(newValue).replace(/[^0-9]+/g, "")
        : newValue;
    emits(
      "update:modelValue",
      props.type === "phone"
        ? String(newValue).replace(/[^0-9]+/g, "")
        : newValue
    );
  },
});

const input = ref<HTMLInputElement>();

const isFocused = ref(false);

const slots = useSlots();

function focus() {
  input.value?.focus();
}

function blur() {
  input.value?.blur();
}

function phoneNormalized(value: string) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "+($1) $2");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{2})/, "$1 $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}
</script>

<style lang="scss">
.hc-input {
  &__area-input {
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    &--compact {
      border: unset !important;
    }
    &:hover :not(:disabled) {
      border-color: #757575;
    }
    &__input {
      width: inherit !important;
      border: none;
      background-color: transparent !important;
      text-overflow: ellipsis;
      &--text-center {
        text-align: center;
      }
    }
  }
  &--error-message {
    min-height: 12px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease !important;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}
</style>
