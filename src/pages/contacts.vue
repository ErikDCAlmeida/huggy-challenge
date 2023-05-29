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
  HCLoadIndicator,
} from "@/components";
import { ref, computed } from "vue";
import { Form } from "vee-validate";
import axios from "axios";
import { useTokenStore } from "@/stores/token";
import router from "@/router";

const token_store = useTokenStore();

const openDialog = ref(false);
const openDialogDelete = ref(false);
const openDialogEditCreate = ref(false);
const search = ref("");
const page = ref(0);

const contacts = ref([]);

const dialogLabels = computed(() => {
  return [
    {
      id: 1,
      title: "E-mail",
      data: infosUser.value.user.email,
    },
    {
      id: 2,
      title: "Endereço",
      data: infosUser.value.user.address,
    },
    {
      id: 3,
      title: "Bairro",
      data: infosUser.value.user.district,
    },
    {
      id: 4,
      title: "Cidade",
      data: infosUser.value.user.city,
    },
    {
      id: 5,
      title: "Estado",
      data: infosUser.value.user.state,
    },
  ];
});

const infosUser = ref({
  isNew: false,
  cardTitle: "",
  user: {
    id: 0,
    name: "",
    email: "",
    phone: "",
    cel: "",
    address: "",
    state: "",
    district: "",
    photo: "",
    city: "",
    mobile: "",
  },
});

async function initialLoad() {
  if (!token_store.token.access_token) {
    router.replace("/");
  }

  await axios("http://localhost:8080/contacts", {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${token_store.token.token_type} ${token_store.token.access_token}`,
    },
  }).then(({ data }) => {
    contacts.value = data;
  });
}

function openDialogToCreate() {
  infosUser.value.user = {
    id: 0,
    name: "",
    email: "",
    phone: "",
    cel: "",
    address: "",
    state: "",
    district: "",
    photo: "",
    city: "",
    mobile: "",
  };
  infosUser.value.isNew = true;
  infosUser.value.cardTitle = "Adicionar Contato";
  openDialogEditCreate.value = true;
}

function clickRow(item: any) {
  infosUser.value.user = item;
  infosUser.value.isNew = false;
  openDialog.value = true;
}

function clickToDelete(item: any) {
  infosUser.value.user = item;
  infosUser.value.isNew = false;
  openDialogDelete.value = true;
}

function clickToEdit(item: any) {
  infosUser.value.user = item;
  infosUser.value.isNew = false;
  infosUser.value.cardTitle = "Editar Contato";
  openDialogEditCreate.value = true;
}

function submitForm() {}
</script>

<template>
  <HCLoadIndicator
    :on-load="initialLoad"
    class="page-contacts"
    content-class="fill-h flex center"
  >
    <div class="fill-a flex col center page-contacts__area">
      <HCLabel font-style="h2" class="text-start fill-w mb-3">Contatos</HCLabel>

      <HCCard
        color="button-color"
        class="page-contacts__area__card fill-w fill-h flex col"
      >
        <div class="page-contacts__area__top flex a-center j-between pa-4">
          <HCInput
            v-model:modelValue="search"
            :max-size="15.625"
            hide-messages
            name="search"
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
        <div class="page-contacts__area__main ma-2">
          <HCGrid
            v-model:request="contacts"
            @update:modelValue="page = $event"
            @click-row="clickRow"
            @edit="clickToEdit"
            @delete="clickToDelete"
          ></HCGrid>
        </div>
        <div
          v-if="!contacts.length"
          class="flex col center text-center flex-1"
          color="label"
        >
          <img src="../assets/book-circle.svg" width="200" />
          <HCLabel class="my-3" align="center" :size="15" font-style="sub-1"
            >Ainda não há contatos!</HCLabel
          >
          <HCButton class="button-font" @click="openDialogToCreate">
            <template #icon>
              <HCIcon>add</HCIcon>
            </template>
            <p>Adicionar contato</p>
          </HCButton>
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
              id: infosUser.user.id,
              photo: infosUser.user.photo,
              initials: 'NA',
              name: infosUser.user.name,
            }"
          />
          <HCLabel class="mr-10" fontStyle="h2" ellipsis :size="20">{{
            infosUser.user.name
          }}</HCLabel>
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

    <HCDialog
      v-model:value="openDialogDelete"
      @update:value="openDialogDelete = $event"
      persistent
    >
      <HCCard color="danger">
        <div class="pa-3">
          <HCLabel font-style="h2" auto-size>
            Excluir o contato {{ (infosUser as any)?.name ?? "" }}?
          </HCLabel>
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
        <div class="pa-4 flex a-center b-1--bottom mine-shaft-30--border">
          <HCLabel class="mr-10" fontStyle="h2" ellipsis :size="20">{{
            infosUser.cardTitle
          }}</HCLabel>
        </div>
        <Form
          v-slot="{ meta }"
          class="pa-4 b-1--bottom mb-1 mine-shaft-30--border"
          @submit="submitForm"
        >
          <HCInput
            v-model:modelValue="infosUser.user.name"
            class="mb-1"
            label="Nome"
            name="nome"
            placeholder="Nome completo"
            rules="required"
            @update:modelValue="infosUser.user.name = $event"
          ></HCInput>
          <HCInput
            v-model:modelValue="infosUser.user.email"
            class="mb-1"
            label="Email"
            name="e-mail"
            placeholder="E-mail"
            rules="required"
            @update:modelValue="infosUser.user.email = $event"
          ></HCInput>
          <pre>{{ infosUser.user.phone }}</pre>
          <HCInput
            v-model:modelValue="infosUser.user.phone"
            class="mb-1"
            label="Telefone"
            type="phone"
            name="telefone"
            max="22"
            placeholder="Telefone"
            rules="required"
            @update:modelValue="infosUser.user.phone = $event"
          ></HCInput>
          <HCInput
            v-model:modelValue="infosUser.user.mobile"
            class="mb-1"
            label="Celular"
            type="phone"
            name="celular"
            max="22"
            placeholder="Celular"
            rules="required"
            @update:modelValue="infosUser.user.mobile = $event"
          ></HCInput>
          <HCInput
            v-model:modelValue="infosUser.user.address"
            class="mb-1"
            label="Endereço"
            placeholder="Endereço"
            name="endereço"
            @update:modelValue="infosUser.user.address = $event"
          ></HCInput>
          <div class="flex mb-1">
            <HCInput
              v-model:modelValue="infosUser.user.district"
              class="mr-2"
              label="Bairro"
              placeholder="Bairro"
              name="bairro"
              @update:modelValue="infosUser.user.district = $event"
            ></HCInput>
            <HCInput
              v-model:modelValue="infosUser.user.state"
              class="ml-2"
              label="Estado"
              placeholder="Estado"
              name="estado"
              @update:modelValue="infosUser.user.state = $event"
            ></HCInput>
          </div>
          <div class="flex j-end a-center pa-4">
            <HCButton
              secondary
              class="mr-5"
              @click="openDialogEditCreate = false"
              >Cancelar</HCButton
            >
            <HCButton :disabled="!meta.valid">Salvar</HCButton>
          </div>
        </Form>
      </HCCard>
    </HCDialog>
  </HCLoadIndicator>
</template>

<style lang="scss">
.page-contacts {
  &__area {
    margin: 0 auto !important;
    width: 70vw !important;
    height: 90vh !important;

    &__card {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
