import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Redirect, router } from "expo-router";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { authClient } from "@/services/auth/auth-client";
import { APP_CONFIG } from "@/constants";
import { Logo } from "@/components/logo";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors } from "@/theme/colors";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
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
        return <Redirect href={"/(app)/home"} />;
      }
      if (error) {
        Toast.show({
          type: "error",
          text1: "Error de inicio de sesión",
          text2: error.message || "Por favor, verifica tus credenciales",
        });
      }
    } catch (e) {
      console.error("Error al conectar con el servidor:", e);
      Toast.show({
        type: "error",
        text1: "Error de conexión",
        text2: "No se pudo conectar con el servidor",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.centeredContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.welcomeText}>Inicio de sesión - clientes</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Usuario"
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
                placeholder="Contraseña"
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
            title="Iniciar sesión"
          />

          <Button
            onPress={() => {
              router.push("/(auth)/register-screen");
            }}
            title="Regístrate"
            variant="text"
          />
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
    paddingHorizontal: 20,
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
});
