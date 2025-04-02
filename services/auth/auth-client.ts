import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

import { API_URLS } from "@/constants";

export const authClient = createAuthClient({
  baseURL: API_URLS.ANDROID_EMULATOR,
  plugins: [
    expoClient({
      scheme: "ccp-sales",
      storagePrefix: "ccp-sales",
      storage: SecureStore,
    }),
  ],
});
