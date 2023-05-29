<script setup lang="ts">
import { HCLoadIndicator } from "@/components";
import { useRoute } from "vue-router";
import { useTokenStore, type IToken } from "@/stores/token";
import axios from "axios";

const route = useRoute();

const token_store = useTokenStore();

async function requestToken() {
  await axios<IToken>("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      grant_type: "authorization_code",
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      code: route.query.code,
    },
  }).then(({ data }) => {
    token_store.setToken(data);
  });
  window.close();
}
</script>

<template>
  <HCLoadIndicator :on-load="requestToken" />
</template>

<style lang="scss"></style>
