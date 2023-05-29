<template>
  <HCLoadIndicator :on-load="initialLoad">
    <div class="flex col center fill-a">
      <p class="h1 mb-2">Login</p>
      <HCButton class="home-btn" @click="goToRegister">
        Fazer login com a Huggy
      </HCButton>
    </div>
  </HCLoadIndicator>
</template>

<script setup lang="ts">
import { HCButton, HCLoadIndicator } from "@/components";
import { useTokenStore, type IToken } from "@/stores/token";
import axios from "axios";
import { useRouter } from "vue-router";

const token_store = useTokenStore();

const router = useRouter();

async function initialLoad() {
  if (!token_store.token.access_token) {
    return;
  }

  if (token_store.token.expires_in <= Date.now()) {
    await axios<IToken>("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      data: {
        grant_type: "refresh_token",
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        refresh_token: token_store.token.refresh_token,
      },
    }).then(({ data }) => {
      token_store.setToken(data);
    });
  } else {
    router.replace("/contacts");
  }
}

function goToRegister() {
  const redirectURL = import.meta.env.VITE_REDIRECT_URI;
  const loginPopup = window.open(
    `https://auth.huggy.app/oauth/authorize?scope=install_app%20read_agent_profile&response_type=code&redirect_uri=${redirectURL}&client_id=${
      import.meta.env.VITE_CLIENT_ID
    }`,
    "_blank",
    "width=700, height=800, top=100, left=100"
  );

  const popupClosed = setInterval(() => {
    if (loginPopup!.closed) {
      clearInterval(popupClosed);
      if (token_store.token.access_token) {
        router.replace("/contacts");
      }
    }
  }, 250);
}
</script>

<style lang="scss">
.home-btn {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
