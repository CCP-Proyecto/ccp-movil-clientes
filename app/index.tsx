import { Redirect } from "expo-router";
import { authClient } from "@/services/auth/auth-client";

export default function Index() {
  const { data: session } = authClient.useSession();
  const screenToGo = session ? "/(app)/home" : "/(auth)/login-screen";

  return <Redirect href={screenToGo} />;
}
