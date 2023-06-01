<template>
  <button
    :class="[
      'hc-button px-3 py-2 sub-2 flex center c-pointer',
      {
        [`hc-button--loading c-not-allowed`]: loading,
        [`hc-button--${buttonType}--hover`]:
          (primary || secondary || danger) &&
          !pressed &&
          !disabled &&
          !icon &&
          !flat &&
          !loading,
        'button-color--bg white-start--text':
          primary && !disabled && !pressed && !icon && !flat && !loading,
        'white-start--bg mine-shaft-400--text':
          secondary && !disabled && !pressed && !icon && !flat && !loading,
        'white-start--bg danger--text':
          danger && !disabled && !pressed && !icon && !flat && !loading,
        [`hc-button--${buttonType}--disabled c-not-allowed`]:
          disabled && !icon && !flat && !loading,
        [`hc-button--${buttonType}--pressed`]:
          (primary || secondary || danger) &&
          pressed &&
          !icon &&
          !flat &&
          !loading,
        'hc-button--icon': icon,
        [`hc-button--icon--${buttonType}`]:
          icon && (primary || secondary || danger) && !loading,
        'hc-button--flat': flat,
        'hc-button--flat--pressed':
          flat && pressed && (!primary || !secondary || !danger) && !loading,
        [`hc-button--flat--pressed--${buttonType}`]:
          (primary || secondary || danger) && pressed && flat && !loading,
      },
    ]"
    @click="pressed = true"
    @mouseleave="pressed = false"
    @focus="pressed = true"
    @blur="pressed = false"
  >
    <div v-if="loading" class="fill-a flex a-center j-center mr-2">
      <img src="@/assets/preloader.svg" :width="16" />
    </div>
    <div class="flex center">
      <div
        v-if="slotIconActived"
        class="caption flex center"
        :class="{ 'mr-2': !icon }"
      >
        <slot name="icon"></slot>
      </div>
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from "vue";

const pressed = ref(false);

const buttonType = computed(() => {
  return props.danger ? "danger" : props.secondary ? "secondary" : "primary";
});

const slots = useSlots();

const slotIconActived = computed(() => slots.icon);

const props = defineProps({
  primary: {
    type: Boolean,
    default: true,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: Boolean,
  flat: Boolean,
  loading: Boolean,
});
</script>

<style lang="scss">
.hc-button {
  border-radius: var(--spacing-2);
  height: 2.2em !important;
  outline: none;
  border: none;
  transition: all ease-in-out 0.25s;
  &--loading {
    background-color: transparent !important;
    color: #757575 !important;
    border: 1px solid #2715b048 !important;
    pointer-events: none;
  }
  &--primary {
    &--hover {
      &:hover {
        background-color: #5946e4 !important;
      }
    }
    &--pressed {
      background-color: #2715b0 !important;
      color: #ffffff !important;
    }
    &--disabled {
      background-color: #e1e1e1 !important;
      color: #757575 !important;
      pointer-events: none;
    }
  }
  &--secondary {
    &--hover {
      &:hover {
        background-color: #f8f8f8 !important;
      }
    }
    &--pressed {
      background-color: #e1e1e1 !important;
      color: #505050;
    }
    &--disabled {
      background-color: #ffffff !important;
      color: #949494 !important;
      pointer-events: none;
    }
  }
  &--danger {
    &--hover {
      &:hover {
        background-color: #faece3 !important;
      }
    }
    &--pressed {
      background-color: #f4cab6 !important;
      color: #de321b;
    }
    &--disabled {
      background-color: #ffffff !important;
      color: #949494 !important;
      pointer-events: none;
    }
  }
  &--icon {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    &--primary {
      background-color: #312bde !important;
      color: #ffffff !important;
      &--flat {
        background-color: #2715b021 !important;
      }
    }
    &--secondary {
      background-color: #ffffff !important;
      color: #505050 !important;
      &--flat {
        background-color: #ffffff80 !important;
      }
    }
    &--danger {
      background-color: #ffffff !important;
      color: #de321b !important;
      &--flat {
        background-color: #de321b21 !important;
      }
    }
  }
  &--flat {
    background-color: transparent !important;
    color: #505050 !important;
    &--pressed {
      &--primary {
        background-color: rgba(39, 21, 176, 0.15) !important;
      }
      &--secondary {
        background-color: rgba(80, 80, 80, 0.15) !important;
      }
      &--danger {
        background-color: rgba(222, 50, 27, 0.15) !important;
      }
    }
  }
}
</style>
