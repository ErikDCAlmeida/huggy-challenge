<template>
  <div class="page-contacts fill-a flex col center">
    <div>
      <p class="h2 mb-3">Contatos</p>

      <HCCard color="button-color" class="page-contacts__area flex col">
        <div class="page-contacts__area__top flex a-center j-between pa-4">
          <HCInput
            v-model:modelValue="search"
            :max-size="15.625"
            @update:modelValue="search = $event"
          >
            <template #icon>
              <HCIcon>search</HCIcon>
            </template>
          </HCInput>
          <HCButton class="button-font" @click="openDialogToCreate">
            <template #icon>
              <HCIcon>add</HCIcon>
            </template>
            <p>Adicionar contato</p>
          </HCButton>
        </div>
        <div class="page-contacts__area__main mt-2 mx-2 flex-1">
          <HCGrid
            v-model:request="request"
            @update:modelValue="page = $event"
            @click-row="clickRow"
            @edit="clickToEdit"
            @delete="clickToDelete"
          ></HCGrid>
        </div>
      </HCCard>
    </div>

    <HCDialog
      v-model:value="openDialog"
      @update:value="openDialog = $event"
      persistent
    >
      <HCCard color="button-color">
        <div class="pa-4 flex a-center b-1--bottom mb-5 mine-shaft-30--border">
          <HCUser
            class="mr-4"
            :user="{
              id: 1,
              photo:
                'https://lh3.googleusercontent.com/hTLnP_A__DtkJNOgVM2V31QMErc0GIWqwmjEPUnU7MvVOcJHVUxvFfJqqV-8WjNmyvf0JKOmzcn-enmcqslTw-Xbea3jquD3_aPVXg',
              initials: 'HC',
              name: 'ASDHAISDHASHDUIAHSD',
            }"
          />
          <HCLabel class="mr-10" fontStyle="h2" ellipsis :size="20"
            >Henrique Gomes Santana</HCLabel
          >
          <div class="flex a-center">
            <HCButton icon flat>
              <HCIcon>delete</HCIcon>
            </HCButton>
            <HCButton icon flat class="mx-2">
              <HCIcon>edit</HCIcon>
            </HCButton>
            <HCButton icon flat @click="openDialog = false" danger>
              <HCIcon>close</HCIcon>
            </HCButton>
          </div>
        </div>
        <div class="flex col">
          <div
            v-for="item in dialogLabels"
            :key="item"
            class="mb-6 flex a-center"
          >
            <HCLabel
              color="mine-shaft-100"
              :size="6.5"
              fontStyle="caption"
              class="mr-4"
              align="end"
              >{{ item }}</HCLabel
            >
            <HCLabel color="foreground" autoSize fontStyle="body-2">
              henrique.gomes@huggy.io
            </HCLabel>
          </div>
        </div>
      </HCCard>
    </HCDialog>

    <HCDialog
      v-model:value="openDialogDelete"
      @update:value="openDialogDelete = $event"
      persistent
    >
      <HCCard color="danger">
        <div class="pa-3">
          <HCLabel font-style="h2" auto-size
            >Excluir o contato
            {{ (infosToDelete as any)?.name ?? "" }}?</HCLabel
          >
          <div class="flex j-end a-center mt-10">
            <HCButton secondary class="mr-5" @click="openDialogDelete = false"
              >Cancelar</HCButton
            >
            <HCButton danger>Excluir</HCButton>
          </div>
        </div>
      </HCCard>
    </HCDialog>

    <HCDialog
      v-model:value="openDialogEditCreate"
      @update:value="openDialogEditCreate = $event"
      persistent
    >
      <HCCard color="button-color">
        <div class="pa-4 flex a-center b-1--bottom mb-5 mine-shaft-30--border">
          <HCLabel class="mr-10" fontStyle="h2" ellipsis :size="20"
            >Editar contato</HCLabel
          >
        </div>
        <div class="pa-4 b-1--bottom mb-1 mine-shaft-30--border">
          <HCInput
            v-model:modelValue="infosToEditCreate.name"
            class="mb-1"
            label="Nome"
            @update:modelValue="infosToEditCreate.name = $event"
            name="name"
          ></HCInput>
          <HCInput
            v-model:modelValue="infosToEditCreate.email"
            class="mb-1"
            label="Email"
            @update:modelValue="infosToEditCreate.email = $event"
            name="email"
          ></HCInput>
          <HCInput
            v-model:modelValue="infosToEditCreate.phone"
            class="mb-1"
            label="Telefone"
            type="phone"
            @update:modelValue="infosToEditCreate.phone = $event"
            name="phone"
          ></HCInput>
          <HCInput
            v-model:modelValue="infosToEditCreate.cel"
            class="mb-1"
            label="Celular"
            type="phone"
            @update:modelValue="infosToEditCreate.cel = $event"
            name="cellphone"
          ></HCInput>
          <HCInput
            v-model:modelValue="infosToEditCreate.address"
            class="mb-1"
            label="Endereço"
            @update:modelValue="infosToEditCreate.address = $event"
          ></HCInput>
          <div class="flex mb-1">
            <HCInput
              v-model:modelValue="infosToEditCreate.name"
              class="mr-2"
              label="Bairro"
              @update:modelValue="infosToEditCreate.name = $event"
            ></HCInput>
            <HCInput
              v-model:modelValue="infosToEditCreate.state"
              class="ml-2"
              label="Estado"
              @update:modelValue="infosToEditCreate.state = $event"
            ></HCInput>
          </div>
        </div>
        <div class="flex j-end a-center pa-4">
          <HCButton secondary class="mr-5" @click="openDialogEditCreate = false"
            >Cancelar</HCButton
          >
          <HCButton>Salvar</HCButton>
        </div>
      </HCCard>
    </HCDialog>
  </div>
</template>

<script setup lang="ts">
import {
  HCButton,
  HCCard,
  HCDialog,
  HCGrid,
  HCIcon,
  HCInput,
  HCUser,
  HCLabel,
} from "@/components";
import { ref } from "vue";
import { useForm } from "vee-validate";

const schemaValidation = {
  name(value: string) {
    return value;
  },
  email(value: string) {
    return value;
  },
  phone(value: string) {
    return value;
  },
  cellphone(value: string) {
    return value;
  },
};

const openDialog = ref(false);
const openDialogDelete = ref(false);
const openDialogEditCreate = ref(false);
const search = ref("");
const page = ref(0);

const dialogLabels = ref(["Email", "Endereço", "Bairro", "Cidade", "Estado"]);

const infosUser = ref(null);
const infosToDelete = ref(null);
const baseUser = ref({
  id: undefined,
  name: "",
  email: "",
  phone: "",
  cel: "",
  address: "",
  state: "",
});
let infosToEditCreate = ref(null) as any;

const request = ref({
  items: Array.from({ length: 25 }, (_, i) => ({
    id: i,
    photo:
      "https://lh3.googleusercontent.com/hTLnP_A__DtkJNOgVM2V31QMErc0GIWqwmjEPUnU7MvVOcJHVUxvFfJqqV-8WjNmyvf0JKOmzcn-enmcqslTw-Xbea3jquD3_aPVXg",
    initials: "HC",
    name: "ASDHAISDHASHDUIAHSD",
    email: "teste@teste.com",
    phone: "79912345678",
    cel: "",
  })),
  page: 1,
  pageSize: 25,
  totalPages: 2,
  totalItems: 30,
});

function openDialogToCreate() {
  infosToEditCreate.value = baseUser;
  openDialogEditCreate.value = true;
}

function clickRow(item: any) {
  infosUser.value = item;
  openDialog.value = true;
}

function clickToDelete(item: any) {
  infosToDelete.value = item;
  openDialogDelete.value = true;
}

function clickToEdit(item: any) {
  infosToEditCreate.value = item;
  openDialogEditCreate.value = true;
}

useForm({
  validationSchema: schemaValidation,
});
</script>

<style lang="scss">
.page-contacts {
  &__area {
    width: 72.26vw !important;
    height: 92vh !important;
    &__main {
      height: calc(58em - 6em) !important;
    }
  }
}
</style>
