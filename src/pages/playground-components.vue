<template>
  <div class="pa-5">
    <div class="flex mb-5">
      <HCUser
        :user="{
          id: 1,
          name: 'É O Nome Aleatório de Alguém Aqui!',
          photo:
            'https://lh3.googleusercontent.com/hTLnP_A__DtkJNOgVM2V31QMErc0GIWqwmjEPUnU7MvVOcJHVUxvFfJqqV-8WjNmyvf0JKOmzcn-enmcqslTw-Xbea3jquD3_aPVXg',
          initials: 'HC',
        }"
        class="mr-5"
      ></HCUser>
      <HCUser
        :user="{
          id: 1,
          name: 'É O Nome Aleatório de Alguém Aqui!',
          photo: '',
          initials: 'HC',
        }"
      ></HCUser>
    </div>
    <div class="ma-5 flex">
      <HCIcon class="mr-5" name="arrow-up"></HCIcon>
      <HCIcon class="mr-5" name="arrow-down"></HCIcon>
      <HCIcon class="mr-5" name="search"></HCIcon>
      <HCIcon class="mr-5" name="edit"></HCIcon>
      <HCIcon class="mr-5" name="add"></HCIcon>
      <HCIcon class="mr-5" name="delete"></HCIcon>
      <HCIcon class="mr-5" name="close"></HCIcon>
    </div>
    <div class="ma-5 flex">
      <div class="mr-10 flex">
        <HCButton class="mr-5" @click="testeClickBtn">
          <template #icon>
            <HCIcon>add</HCIcon>
          </template>
          <template #default>Button</template>
        </HCButton>
        <HCButton class="mr-5">
          <template #default>Button</template>
        </HCButton>
        <HCButton class="mr-5" disabled @click="testeClickBtn">
          <template #icon>
            <HCIcon>add</HCIcon>
          </template>
          <template #default>Button</template>
        </HCButton>
        <HCButton class="mr-5" loading @click="testeClickBtn">
          Button
        </HCButton>
      </div>

      <div class="mr-10 flex">
        <HCButton class="mr-5" secondary>
          <template #icon>
            <HCIcon>add</HCIcon>
          </template>
          <template #default>Button</template>
        </HCButton>
        <HCButton class="mr-5" secondary>
          <template #default>Button</template>
        </HCButton>
        <HCButton class="mr-5" secondary disabled>
          <template #icon>
            <HCIcon>add</HCIcon>
          </template>
          <template #default>Button</template>
        </HCButton>
      </div>

      <div class="mr-10 flex">
        <HCButton class="mr-5" danger>
          <template #icon>
            <HCIcon>add</HCIcon>
          </template>
          <template #default>Button</template>
        </HCButton>
        <HCButton class="mr-5" danger>
          <template #default>Button</template>
        </HCButton>
        <HCButton class="mr-5" danger disabled>
          <template #icon>
            <HCIcon>add</HCIcon>
          </template>
          <template #default>Button</template>
        </HCButton>
      </div>
    </div>
    <div class="flex ma-5">
      <div class="mr-10 flex-1">
        <HCInput name="tste" class="mb-5" label="Input" disabled></HCInput>
        <HCInput name="tste" class="mb-5" label="Input"></HCInput>
        <HCInput name="tste" class="mb-5" label="Input"></HCInput>
        <HCInput name="tste" class="mb-5" label="Input"></HCInput>
        <HCInput name="tste" class="mb-5" compact readonly></HCInput>
      </div>
      <div class="flex-1">
        <pre>Valor do Input: {{ valueInputText }}</pre>
        <HCInput
          name="tste"
          v-model:modelValue="valueInputText"
          class="mb-5"
          label="Input"
          error="Mensagem de error"
          @update:modelValue="valueInputText = $event"
        >
          <template #icon>
            <HCIcon>search</HCIcon>
          </template>
        </HCInput>
        <HCInput
          name="tste"
          v-model:modelValue="valueInputText"
          class="mb-5"
          label="Input"
          disabled
          ><template #icon>
            <HCIcon>search</HCIcon>
          </template></HCInput
        >
        <HCInput
          name="tste"
          class="mb-5"
          label="Input"
          error="Mensagem de error"
          ><template #icon>
            <HCIcon>search</HCIcon>
          </template></HCInput
        >
        <HCInput
          name="tste"
          class="mb-5"
          label="Input"
          error="Mensagem de error"
          ><template #icon>
            <HCIcon>search</HCIcon>
          </template></HCInput
        >
        <HCInput
          name="tste"
          class="mb-5"
          label="Input"
          error="Mensagem de error"
          ><template #icon>
            <HCIcon>search</HCIcon>
          </template></HCInput
        >
      </div>
    </div>
    <div style="height: 30em" class="mb-15">
      <HCGrid
        class="ma-5"
        v-model:request="request"
        @update:modelValue="page = $event"
      ></HCGrid>
    </div>

    <HCLoadIndicator />
  </div>
</template>

<script setup lang="ts">
import {
  HCUser,
  HCButton,
  HCGrid,
  HCInput,
  HCIcon,
  HCLoadIndicator,
} from "../components";
import { onMounted, ref } from "vue";
import { useTokenStore } from "../stores/token";
import { useRouter } from "vue-router";

const valueInputText = ref("");
const page = ref(0);
const caracteres = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const request = ref([]);

const token_store = useTokenStore();

const router = useRouter();

function testeClickBtn() {
  alert("teste");
}

onMounted(() => {
  if (!token_store.token.access_token) {
    router.replace("/");
  }
});
</script>

<style scoped></style>
