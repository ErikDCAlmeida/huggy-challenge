import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export interface IToken {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export const useTokenStore = defineStore("token", () => {
  const token = useLocalStorage("token_expires", {
    access_token: "",
    expires_in: 0,
    refresh_token: "",
    token_type: "",
  });

  function setToken(token_data: IToken) {
    const dateNow = new Date();
    const dateTokenExpires = new Date().setSeconds(
      dateNow.getSeconds() + token_data.expires_in
    );
    token.value.access_token = token_data.access_token;
    token.value.expires_in = dateTokenExpires;
    token.value.refresh_token = token_data.refresh_token;
    token.value.token_type = token_data.token_type;
  }

  return { token, setToken };
});
