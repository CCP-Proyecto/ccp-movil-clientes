import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";

import { authClient } from "@/services/auth/auth-client";
import { Logo, Input, Button } from "@/components";
import { colors } from "@/theme/colors";
import { APP_CONFIG } from "@/constants";

const registerSchema = z.object({
  idType: z.string().min(1, "Tipo de identificación es requerido"),
  idNumber: z.string().min(5, "Número de identificación inválido"),
  firstName: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().min(1, "Apellido es requerido"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Número de celular debe tener 10 dígitos"),
  email: z.string().email("Email inválido"),
  address: z.string().min(1, "Dirección es requerida"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
  acceptInfo: z.boolean(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      idType: "",
      idNumber: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      password: "",
      acceptTerms: false,
      acceptInfo: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const { error, data: responseData } = await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          address: data.address,
          idType: data.idType,
          idNumber: data.idNumber,
          acceptTerms: data.acceptTerms,
          acceptInfo: data.acceptInfo,
          roles: ["customer"],
        },
        {
          body: {
            app: APP_CONFIG.APP_ID,
          },
        },
      );

      if (responseData) {
        Toast.show({
          type: "success",
          text1: "Registro exitoso",
          text2: "Tus datos han sido registrados correctamente",
          visibilityTime: 2000,
          onHide: () => {
            router.replace("/(app)/home");
          },
        });
        return;
      }
      if (error) {
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: "Error de registro",
          text2: error.message || "Por favor, verifica tus datos",
        });
      }
    } catch (e) {
      setIsLoading(false);
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
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Logo />

        <Text style={styles.sectionTitle}>Empezar ahora</Text>
        <Text style={styles.sectionSubtitle}>
          Registrarte es muy fácil y rápido
        </Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Tipo de documento</Text>
          <Controller
            control={control}
            name="idType"
            render={({ field: { onChange, value } }) => (
              <>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                    mode="dropdown"
                    dropdownIconColor={colors.primary}
                  >
                    <Picker.Item
                      label="Seleccione un tipo"
                      value=""
                      enabled={false}
                    />
                    <Picker.Item
                      label="Cédula de ciudadanía"
                      value="CC"
                    />
                    <Picker.Item
                      label="NIT"
                      value="NIT"
                    />
                  </Picker>
                </View>
                {errors.idType && (
                  <Text style={styles.errorText}>{errors.idType.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <Controller
          control={control}
          name="idNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="No de identificación"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.idNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Nombre"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Apellido"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.lastName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="No de celular"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Dirección de entrega"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.message}
            />
          )}
        />

        <Text style={styles.sectionTitle}>Datos para iniciar sesión</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
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

        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                style={styles.checkbox}
                value={value}
                onValueChange={onChange}
                color={value ? colors.secondary : undefined}
              />
            )}
          />
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxText}>
              Acepto términos y condiciones y la política de privacidad.
            </Text>
            {errors.acceptTerms && (
              <Text style={styles.errorText}>{errors.acceptTerms.message}</Text>
            )}
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="acceptInfo"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                style={styles.checkbox}
                value={value}
                onValueChange={onChange}
                color={value ? colors.secondary : undefined}
              />
            )}
          />
          <Text style={styles.checkboxText}>
            Acepto a CCP para enviarme información a través de correo
            electrónico, Whatsapp y/o celular.
          </Text>
        </View>

        <Button
          title="Registrarme"
          onPress={handleSubmit(onSubmit)}
          style={styles.registerButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: colors.black,
    marginTop: 20,
    textAlign: "center",
    width: "100%",
  },
  sectionSubtitle: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 20,
    textAlign: "center",
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
    width: "100%",
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: colors.black,
    marginLeft: 10,
    flex: 1,
  },
  registerButton: {
    marginTop: 20,
    width: "100%",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    marginTop: 2,
  },
  errorText: {
    color: "red",
    fontSize: 10,
    fontFamily: "Comfortaa-Regular",
    marginLeft: 10,
    marginTop: 2,
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
  pickerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  pickerLabel: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: colors.black,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
