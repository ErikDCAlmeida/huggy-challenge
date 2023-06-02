<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  /** Valor da barra de progresso */
  value: {
    type: Number,
    default: 0,
  },

  /** Valor mínimo */
  min: {
    type: Number,
    default: 0,
  },

  /** Valor máximo */
  max: {
    type: Number,
    default: 100,
  },

  /** Torna o valor indeterminado */
  indeterminate: Boolean,
});

const ratio = computed(() => {
  if (props.indeterminate) return 1;
  return (props.value - props.min) / (props.max - props.min);
});
</script>

<template>
  <div
    class="hc-progress"
    :class="[{ 'hc-progress--indeterminate': indeterminate }]"
  >
    <div class="hc-progress-bar" :style="{ width: `${ratio * 100}%` }">
      <template v-if="indeterminate">
        <div class="hc-progress-bar-long" />
        <div class="hc-progress-bar-short" />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.hc-progress {
  display: block;
  height: 4px;
  width: 100%;
  position: relative;
  background-repeat: repeat-x;
  background-position: center;
  border-radius: 4px;
  overflow: hidden;
  background: linear-gradient(to bottom, transparent 0, #e0e0e0 0);
  background-size: 100% 1px;

  &-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.21s ease;
    background: #312bde;

    &-long,
    &-short {
      background: inherit;
      height: inherit;
      position: absolute;
      right: auto;
      bottom: 0;
      left: 0;
      top: 0;
      width: auto;
      will-change: left, right;
      animation-duration: 2.2s;
      animation-iteration-count: infinite;
      background: #312bde;
    }

    &-long {
      animation-name: indeterminate-ltr;
    }

    &-short {
      animation-name: indeterminate-short-ltr;
    }
  }

  &--indeterminate {
    .hc-progress-bar {
      @apply w-full;
      background: none;
    }
  }
}

@keyframes indeterminate-ltr {
  0% {
    left: -90%;
    right: 100%;
  }

  60% {
    left: -90%;
    right: 100%;
  }

  100% {
    left: 100%;
    right: -35%;
  }
}

@keyframes indeterminate-short-ltr {
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
}
</style>
