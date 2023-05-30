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
import { ref, computed, reactive } from "vue";
import { Form } from "vee-validate";
import axios from "axios";
import { useTokenStore } from "../stores/token";
import { useRouter } from "vue-router";

const token_store = useTokenStore();

const openDialog = ref(false);
const openDialogDelete = ref(false);
const openDialogEditCreate = ref(false);
const search = ref("");
const page = ref(-1);

const router = useRouter();

const savingContact = ref(false);

const sortDesc = ref(false);

let hasMore = true;

const contacts = ref<any>([]);

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
  user: {} as any,
  userInfosEdit: {} as any,
  indexUserClicked: 0,
  baseUser: {
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

const openDialogError = reactive({
  open: false,
  message: "",
});

const filteredItems = computed(() => {
  const query = search.value.toLowerCase().trim();
  return contacts.value
    .filter((item: any) => item.name.toLowerCase().trim().includes(query))
    .sort((a: any, b: any) => {
      return sortDesc.value
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
});

async function initialLoad() {
  await onLoadMore();
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

function clickRow({ item, index }: any) {
  infosUser.value.user = item;
  infosUser.value.indexUserClicked = index;
  infosUser.value.isNew = false;
  openDialog.value = true;
}

function clickToDelete({ item, index }: any) {
  infosUser.value.user = item;
  infosUser.value.indexUserClicked = index;
  infosUser.value.isNew = false;
  openDialogDelete.value = true;
}

function clickToEdit({ item, index }: any) {
  console.log(item, index);

  infosUser.value.user = item;
  infosUser.value.userInfosEdit = { ...item };
  infosUser.value.indexUserClicked = index;
  infosUser.value.isNew = false;
  infosUser.value.cardTitle = "Editar Contato";
  openDialogEditCreate.value = true;
}

function cancelSaveContact() {
  console.log(contacts.value, infosUser.value.indexUserClicked);

  Object.assign(
    contacts.value[infosUser.value.indexUserClicked],
    infosUser.value.userInfosEdit
  );
  openDialogEditCreate.value = false;
}

async function onLoadMore() {
  if (!token_store.token.access_token) {
    router.replace("/");
  }
  if (!hasMore) {
    return;
  }
  await axios("http://localhost:8080/api/contacts", {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${token_store.token.token_type} ${token_store.token.access_token}`,
    },
    params: {
      page: page.value + 1,
    },
  }).then(({ data }) => {
    if (data.length) {
      if (page.value === -1) {
        contacts.value = data;
      } else {
        contacts.value = contacts.value.concat(data);
      }
      page.value++;
    } else {
      hasMore = false;
    }
  });
}

async function submitForm() {
  savingContact.value = true;
  await axios(
    `http://localhost:8080/api/contacts${
      infosUser.value.isNew ? "" : `/${infosUser.value.user.id}`
    }`,
    {
      method: infosUser.value.isNew ? "POST" : "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `${token_store.token.token_type} ${token_store.token.access_token}`,
      },
      data: infosUser.value.isNew
        ? {
            ...infosUser.value.user,
            id: undefined,
          }
        : {
            ...infosUser.value.user,
          },
    }
  )
    .then(({ data }) => {
      if (infosUser.value.isNew) {
        contacts.value.unshift(data);
      } else {
        Object.assign(contacts.value[infosUser.value.indexUserClicked], data);
      }
      openDialogEditCreate.value = false;
    })
    .catch(() => {
      openDialogError.message =
        "É possível que os seguintes campos já estejam sendo utilizados: 'NOME', 'E-MAIL', 'TELEFONE' ou 'CELULAR'";
      openDialogError.open = true;
    })
    .finally(() => {
      openDialogEditCreate.value = false;
      savingContact.value = false;
    });
}

async function deleteContact() {
  savingContact.value = true;
  await axios(`http://localhost:8080/api/contacts/${infosUser.value.user.id}`, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${token_store.token.token_type} ${token_store.token.access_token}`,
    },
  }).then(() => contacts.value.splice(infosUser.value.indexUserClicked, 1));
  savingContact.value = false;
  openDialogDelete.value = false;
}

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
    return "O campo telefone é obrigatório!";
  }

  if (value.replace(/\D/g, "").length < 13) {
    return "O número informado não é válido!";
  }

  return true;
}
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
            v-model:sort-desc="sortDesc"
            :request="filteredItems"
            class="fill-h"
            :on-load-more="onLoadMore"
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
            <HCButton
              icon
              flat
              danger
              @click="
                clickToDelete({
                  item: infosUser.user,
                  index: infosUser.indexUserClicked,
                }),
                  (openDialog = false)
              "
            >
              <HCIcon>delete</HCIcon>
            </HCButton>
            <HCButton
              icon
              flat
              class="mx-2"
              @click="
                clickToEdit({
                  item: infosUser.user,
                  index: infosUser.indexUserClicked,
                }),
                  (openDialog = false)
              "
            >
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
      :persistent="savingContact"
    >
      <HCCard color="danger">
        <div class="pa-5" style="width: 20em">
          <HCLabel font-style="h2" auto-size>
            Excluir o contato {{ infosUser.user.name }}?
          </HCLabel>
          <div class="flex j-end a-center mt-10">
            <HCButton
              secondary
              class="mr-5"
              :disabled="savingContact"
              @click="openDialogDelete = false"
              >Cancelar</HCButton
            >
            <HCButton danger :loading="savingContact" @click="deleteContact"
              >Excluir</HCButton
            >
          </div>
        </div>
      </HCCard>
    </HCDialog>

    <HCDialog v-model:value="openDialogError.open" persistent>
      <HCCard color="danger">
        <div class="pa-5" style="width: 30em">
          <p class="h2 text-center">
            {{ openDialogError.message }}
          </p>
          <div class="flex j-end a-center mt-10">
            <HCButton
              danger
              :loading="savingContact"
              @click="openDialogError.open = false"
              >Tudo bem</HCButton
            >
          </div>
        </div>
      </HCCard>
    </HCDialog>

    <HCDialog
      v-model:value="openDialogEditCreate"
      @update:value="openDialogEditCreate = $event"
      persistent
    >
      <HCCard
        color="page-contacts__dialog__create-edit button-color"
        :style="{ '--width-card-create-edit': '40em' }"
      >
        <div class="page-contacts__dialog__create-edit__area">
          <div class="pa-4 flex a-center b-1--bottom mine-shaft-30--border">
            <HCLabel class="mr-10" fontStyle="h2" ellipsis :size="20">{{
              infosUser.cardTitle
            }}</HCLabel>
          </div>
          <Form
            v-slot="{ meta }"
            class="pt-4 mb-1"
            validate-on-mount
            @submit="submitForm"
          >
            <div class="px-4 b-1--bottom mine-shaft-30--border">
              <HCInput
                v-model="infosUser.user.name"
                class="mb-1"
                label="Nome"
                name="nome"
                placeholder="Nome completo"
                rules="required"
              ></HCInput>
              <HCInput
                v-model="infosUser.user.email"
                class="mb-1"
                label="Email"
                name="e-mail"
                placeholder="E-mail"
                :rules="validateEmail"
              ></HCInput>
              <HCInput
                v-model="infosUser.user.phone"
                class="mb-1"
                label="Telefone"
                type="phone"
                name="telefone"
                max="20"
                placeholder="Telefone"
                :rules="validatePhone"
              ></HCInput>
              <HCInput
                v-model="infosUser.user.mobile"
                class="mb-1"
                label="Celular"
                type="phone"
                name="celular"
                max="20"
                placeholder="Celular"
                :rules="validatePhone"
              ></HCInput>
              <HCInput
                v-model="infosUser.user.address"
                class="mb-1"
                label="Endereço"
                placeholder="Endereço"
                name="endereço"
              ></HCInput>
              <HCInput
                v-model="infosUser.user.district"
                class="mb-1"
                label="Bairro"
                placeholder="Bairro"
                name="bairro"
              ></HCInput>
              <div class="flex fill-w mb-1">
                <HCInput
                  v-model="infosUser.user.city"
                  class="mr-2 flex-1"
                  label="Cidade"
                  placeholder="Cidade"
                  name="cidade"
                ></HCInput>
                <HCInput
                  v-model="infosUser.user.state"
                  class="ml-2 flex-1"
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
                :disabled="savingContact"
                @click="cancelSaveContact"
                >Cancelar</HCButton
              >
              <HCButton :disabled="!meta.valid" :loading="savingContact"
                >Salvar</HCButton
              >
            </div>
          </Form>
        </div>
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

    &__main {
      overflow: hidden;
    }

    &__card {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }

  .page-contacts__dialog__create-edit__area {
    width: var(--width-card-create-edit);
  }
}
</style>
