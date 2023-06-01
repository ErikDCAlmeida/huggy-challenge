<script setup lang="ts">
import {
  HCButton,
  HCCard,
  HCGrid,
  HCIcon,
  HCInput,
  HCLabel,
  HCLoadIndicator,
} from "../components";
import {
  ContactsDialogDelete,
  ContactsDialogError,
  ContactsDialogPerfil,
  ContactsDialogSaveUser,
} from "../components/contacts";
import { ref, computed, reactive } from "vue";
import axios from "axios";
import { useTokenStore } from "../stores/token";
import { useRouter } from "vue-router";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const token_store = useTokenStore();
const router = useRouter();

const openDialog = ref(false);
const openDialogDelete = ref(false);
const openDialogEditCreate = ref(false);
const search = ref("");
const page = ref(-1);

const savingContact = ref(false);

const sortDesc = ref(true);

const contacts = ref<any>([]);

const infosUser = ref({
  isNew: false,
  cardTitle: "",
  user: {} as any,
  userInfosEdit: {} as any,
  indexUserClicked: -1,
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

const smallScreen = computed(() => {
  return { small: width.value <= 500, xSmall: width.value <= 300 };
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

let hasMore = true;

async function initialLoad() {
  await onLoadMore();
}

function openDialogToCreate() {
  infosUser.value.userInfosEdit = {
    id: undefined,
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
  infosUser.value.indexUserClicked = -1;
  infosUser.value.isNew = true;
  infosUser.value.cardTitle = "Adicionar Contato";
  openDialogEditCreate.value = true;
}

function clickRow({ item, index }: any) {
  baseSets(item, index);
  openDialog.value = true;
}

function clickToDelete({ item, index }: any) {
  baseSets(item, index);
  openDialogDelete.value = true;
}

function clickToEdit({ item, index }: any) {
  baseSets(item, index);
  infosUser.value.userInfosEdit = { ...item };
  infosUser.value.cardTitle = "Editar Contato";
  openDialogEditCreate.value = true;
}

function resetInfos() {
  infosUser.value.user = {};
  infosUser.value.userInfosEdit = {};
  infosUser.value.indexUserClicked = -1;
  openDialog.value = false;
  openDialogDelete.value = false;
  openDialogEditCreate.value = false;
}

function baseSets(item: any, index: number) {
  infosUser.value.user = item;
  infosUser.value.indexUserClicked = index;
  infosUser.value.isNew = false;
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

async function prepareToSaveUser(evt: any) {
  infosUser.value.userInfosEdit = evt;
  await submitForm();
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
            ...infosUser.value.userInfosEdit,
            id: undefined,
          }
        : {
            ...infosUser.value.userInfosEdit,
          },
    }
  )
    .then(({ data }) => {
      if (infosUser.value.isNew) {
        contacts.value = filteredItems.value.concat([data]);
      } else {
        Object.assign(
          filteredItems.value[infosUser.value.indexUserClicked],
          data
        );
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
  }).then(() => {
    filteredItems.value.splice(infosUser.value.indexUserClicked, 1);
    resetInfos();
  });
  savingContact.value = false;
  openDialogDelete.value = false;
}
</script>

<template>
  <HCLoadIndicator
    :on-load="initialLoad"
    class="page-contacts"
    content-class="fill-h flex center"
  >
    <div
      class="fill-a flex col center page-contacts__area mx-5"
      :style="{ '--width-card-main': '70em' }"
    >
      <HCLabel font-style="h2" class="text-start fill-w mb-3">Contatos</HCLabel>

      <HCCard
        color="button-color"
        class="page-contacts__area__card fill-w fill-h flex col"
      >
        <div class="page-contacts__area__top flex a-center j-between pa-4">
          <HCInput v-model="search" hide-messages name="search">
            <template #icon>
              <HCIcon>search</HCIcon>
            </template>
          </HCInput>
          <HCButton
            :icon="smallScreen.small"
            class="button-font"
            @click="openDialogToCreate"
          >
            <template #icon>
              <HCIcon>add</HCIcon>
            </template>
            <p v-if="!smallScreen.small">Adicionar contato</p>
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

    <ContactsDialogPerfil
      v-model="openDialog"
      persistent
      :user="infosUser.user"
      @click-to-delete="
        clickToDelete({
          item: infosUser.user,
          index: infosUser.indexUserClicked,
        })
      "
      @click-to-edit="
        clickToEdit({ item: infosUser.user, index: infosUser.indexUserClicked })
      "
      @reset-infos="resetInfos"
    ></ContactsDialogPerfil>

    <ContactsDialogDelete
      v-model="openDialogDelete"
      :persistent="savingContact"
      :user="infosUser.user"
      @delete-contact="deleteContact"
      @reset-infos="resetInfos"
    ></ContactsDialogDelete>

    <ContactsDialogError
      v-model="openDialogError.open"
      :persistent="savingContact"
      :message="openDialogError.message"
    ></ContactsDialogError>

    <ContactsDialogSaveUser
      v-model="openDialogEditCreate"
      :persistent="savingContact"
      :infos-user="infosUser"
      @submit-form="prepareToSaveUser"
      @reset-infos="resetInfos"
    ></ContactsDialogSaveUser>
  </HCLoadIndicator>
</template>

<style lang="scss">
.page-contacts {
  &__area {
    width: var(--width-card-main) !important;
    height: 90vh !important;

    &__main {
      overflow: hidden;
    }

    &__card {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
