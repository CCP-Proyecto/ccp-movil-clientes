import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { authClient } from "@/services/auth/auth-client";
import { APP_CONFIG, CLOUD_ENDPOINTS } from "@/constants";
import { Logo, Button, Input } from "@/components";
import { colors } from "@/theme/colors";
import { fetchClient } from "@/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "../../i18n";

const APP_VERSION = APP_CONFIG.APP_VERSION;

const loginSchema = z.object({
  email: z.string().email(`${t("auth.login.zod.email")}`),
  password: z.string().min(6, `${t("auth.login.zod.password")}`),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const { error, data: responseData } = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          body: {
            app: APP_CONFIG.APP_ID,
          },
        },
      );

      if (responseData) {
        const userData = await AsyncStorage.getItem("user-data");
        const userDataLocal = userData ? JSON.parse(userData) : null;
        const res = await fetchClient.get(
          `${CLOUD_ENDPOINTS.API_MS}/api/customer/${userDataLocal.userId}`,
        );

        if (res.error?.status === 404) {
          console.log("User not found, creating new user");

          const body = {
            id: userDataLocal?.userId?.toString(),
            idType: userDataLocal.idType,
            address: userDataLocal.address,
            name: userDataLocal.name,
            phone: userDataLocal.phone,
          };
          console.log(body);
          const { error } = await fetchClient.post(
            `${CLOUD_ENDPOINTS.API_MS}/api/customer`,
            body,
          );

          console.log(error);
        }

        return;
      }

      if (error) {
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: `${t("auth.login.toast.text1")}`,
          text2: error.message || `${t("auth.login.toast.text2")}`,
        });
      }
    } catch (e) {
      setIsLoading(false);
      console.error("Error al conectar con el servidor:", e);
      Toast.show({
        type: "error",
        text1: `${t("auth.toast.text1")}`,
        text2: `${t("auth.toast.text2")}`,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>
      )}

      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.centeredContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>{t("common.welcome")}</Text>
          <Text style={styles.welcomeText}>{t("auth.screenTitle")}</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("auth.login.username")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("auth.login.password")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            title={t("auth.login.button")}
          />

          <Button
            onPress={() => {
              router.push("/(auth)/register-screen");
            }}
            title={t("auth.login.signup")}
            variant="text"
          />
        </View>
        <View style={styles.versionContainer}>
          <Text
            style={styles.versionText}
          >{`${t("common.version")} ${APP_VERSION}`}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    maxWidth: 350,
    paddingBottom: 50,
  },
  welcomeSection: {
    width: "100%",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Comfortaa-SemiBold",
    fontSize: 24,
    marginBottom: 5,
    color: colors.black,
  },
  welcomeText: {
    fontFamily: "Comfortaa-Regular",
    color: colors.black,
  },
  form: {
    width: "100%",
    marginTop: 20,
    gap: 15,
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  versionContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  versionText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: colors.secondary,
    opacity: 0.7,
  },
});
