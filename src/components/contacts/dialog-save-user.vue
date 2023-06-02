<script setup lang="ts">
import { type PropType, computed } from "vue";
import { HCButton, HCCard, HCDialog, HCLabel, HCInput } from "../../components";
import { Form } from "vee-validate";
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  persistent: Boolean,
  infosUser: Object as PropType<any>,
  size: {
    type: String,
    default: "40",
  },
  modelValue: Boolean,
});

const emits = defineEmits<{
  (evt: "update:modelValue", value: boolean): void;
  (evt: "resetInfos"): void;
  (evt: "submitForm", value: any): void;
}>();

const { width } = useWindowSize();

const smallScreen = computed(() => {
  return width.value < 660;
});

const xSmallScreen = computed(() => {
  return width.value < 500;
});

const infos = computed(() => {
  return props.infosUser;
});

const openDialog = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!props.persistent) {
      emits("update:modelValue", value);
    }
  },
});

function validateEmail(value: string) {
  if (!value) {
    return "O campo e-mail é obrigatório!";
  }

  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(value)) {
    return "É preciso inserir um e-mail válido!";
  }

  return true;
}

function validatePhone(value: string) {
  if (!value) {
    return "O campo telefone/celular é obrigatório!";
  }

  if (value.replace(/\D/g, "").length < 13 || isNaN(Number(value))) {
    return `O número informado não é válido! Letras aparecem no campo, mas não são contabilizadas. Digite 13 números. (${
      value.replace(/\D/g, "").length
    }/13)`;
  }

  return true;
}
</script>

<template>
  <HCDialog v-model="openDialog" persistent>
    <HCCard color="page-contacts__card-save-user button-color">
      <div
        class="page-contacts__card-save-user__area"
        :style="{
          '--width-card-save-user': smallScreen ? '95vw' : `${size}em`,
        }"
      >
        <div class="pa-4 flex a-center b-1--bottom mine-shaft-30--border">
          <HCLabel class="mr-10" fontStyle="h2" ellipsis :size="20">{{
            infosUser.cardTitle
          }}</HCLabel>
        </div>
        <Form
          v-slot="{ meta }"
          class="pt-4 mb-1"
          validate-on-mount
          @submit="emits('submitForm', infos.userInfosEdit)"
        >
          <div class="px-4 b-1--bottom mine-shaft-30--border">
            <HCInput
              v-model="infos.userInfosEdit.name"
              class="mb-1"
              label="Nome"
              name="nome"
              placeholder="Nome completo"
              rules="required"
            ></HCInput>
            <HCInput
              v-model="infos.userInfosEdit.email"
              class="mb-1"
              label="Email"
              name="e-mail"
              placeholder="E-mail"
              :rules="validateEmail"
            ></HCInput>
            <HCInput
              v-model="infos.userInfosEdit.phone"
              class="mb-1"
              label="Telefone"
              type="phone"
              name="telefone"
              max="20"
              placeholder="Telefone"
              :rules="validatePhone"
            ></HCInput>
            <HCInput
              v-model="infos.userInfosEdit.mobile"
              class="mb-1"
              label="Celular"
              type="phone"
              name="celular"
              max="20"
              placeholder="Celular"
              :rules="validatePhone"
            ></HCInput>
            <HCInput
              v-model="infos.userInfosEdit.address"
              class="mb-1"
              label="Endereço"
              placeholder="Endereço"
              name="endereço"
            ></HCInput>
            <HCInput
              v-model="infos.userInfosEdit.district"
              class="mb-1"
              label="Bairro"
              placeholder="Bairro"
              name="bairro"
            ></HCInput>
            <div class="flex fill-w mb-1" :class="{ col: xSmallScreen }">
              <HCInput
                v-model="infos.userInfosEdit.city"
                class="flex-1"
                :class="{ 'mr-2': !xSmallScreen }"
                label="Cidade"
                placeholder="Cidade"
                name="cidade"
              ></HCInput>
              <HCInput
                v-model="infos.userInfosEdit.state"
                class="flex-1"
                :class="{ 'ml-2': !xSmallScreen }"
                label="Estado"
                placeholder="Estado"
                name="estado"
              ></HCInput>
            </div>
          </div>
          <div class="flex j-end a-center pa-4">
            <HCButton
              secondary
              class="mr-5"
              :disabled="persistent"
              @click="emits('resetInfos')"
              >Cancelar</HCButton
            >
            <HCButton :disabled="!meta.valid" :loading="persistent"
              >Salvar</HCButton
            >
          </div>
        </Form>
      </div>
    </HCCard>
  </HCDialog>
</template>

<style lang="scss">
.page-contacts__card-save-user__area {
  width: var(--width-card-save-user);
}
</style>
