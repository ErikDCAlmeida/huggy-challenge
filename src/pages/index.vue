<template>
  <HCLoadIndicator
    :on-load="initialLoad"
    content-class="flex col center fill-a"
  >
    <p class="h1 mb-2">Login</p>
    <HCButton class="home-btn" @click="goToRegister">
      Fazer login com a Huggy
    </HCButton>
  </HCLoadIndicator>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { HCButton, HCLoadIndicator } from "../components";
import { useTokenStore, type IToken } from "../stores/token";
import axios from "axios";
import { useRouter } from "vue-router";
import { reactive, watchEffect } from "vue";

const token_store = useTokenStore();

const router = useRouter();

const { width, height } = useWindowSize();

const sizes = reactive({
  width: 0,
  height: 0,
  top: 100,
  left: 100,
  s: "",
});

watchEffect(() => {
  // 1280 x 720
  if (width.value >= 1280) {
    sizes.width = Math.floor(width.value * 0.4);
    sizes.height = Math.floor(height.value * 0.8);
    sizes.s = "l";
  }
  // 640 x 480
  if (width.value >= 640 && width.value < 1280) {
    sizes.width = Math.floor(width.value * 0.7);
    sizes.height = Math.floor(height.value * 0.7);
    sizes.s = "m";
  }
  // 320 x 240
  if (width.value < 640) {
    sizes.width = Math.floor(width.value * 0.9);
    sizes.height = Math.floor(height.value * 0.7);
    sizes.top = 5;
    sizes.left = 5;
    sizes.s = "s";
  }

  return sizes;
});

async function initialLoad() {
  if (!token_store.token.access_token) {
    return;
  }

  if (token_store.token.expires_in <= Date.now()) {
    await axios<IToken>("http://localhost:8080/oauth/access_token", {
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
    `width=${sizes.width}, height=${sizes.height}, top=${sizes.top}, left=${sizes.left}`
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
.heightome-btn {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
