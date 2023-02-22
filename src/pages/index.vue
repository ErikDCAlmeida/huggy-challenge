<template>
  <div class="flex col center fill-a">
    <p class="h1 mb-2">Login</p>
    <HCButton @click="$router.push('/contacts')">
      Fazer login com a Huggy
    </HCButton>
  </div>
</template>

<script setup lang="ts">
import { HCButton } from "@/components";
import { onMounted } from "vue";
import axios from "axios";

onMounted(async () => {
  const result = await axios.get(
    `https://auth.huggy.app/oauth/authorize?scope=install_app%20read_agent_profile&response_type=code&redirect_uri=localhost&client_id=APP-7aa05205-e650-48c5-9163-c1a057858d22`
  );
  console.log(result);
});
</script>

<style scoped></style>
