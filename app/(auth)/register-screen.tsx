import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Toast from "react-native-toast-message";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/theme/colors";
import { Logo } from "@/components/logo";

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
  loginId: z.string().min(1, "Usuario es requerido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
  acceptInfo: z.boolean(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
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
      loginId: "",
      password: "",
      acceptTerms: false,
      acceptInfo: false,
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    // TODO: Implementar lógica de registro
    console.log("Formulario enviado:", data);
    Toast.show({
      type: "success",
      text1: "Registro exitoso",
      text2: "Tus datos han sido registrados correctamente",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Logo />

        <Text style={styles.sectionTitle}>Empezar ahora</Text>
        <Text style={styles.sectionSubtitle}>
          Registrarte es muy fácil y rápido
        </Text>

        {/* Formulario de registro con Controllers */}
        <Controller
          control={control}
          name="idType"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Tipo de identificación"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.idType?.message}
            />
          )}
        />

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
          name="loginId"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="No de identificación"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.loginId?.message}
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

        {/* Términos y condiciones */}
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={[styles.checkbox, value && styles.checkboxChecked]}
                onPress={() => onChange(!value)}
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
              <TouchableOpacity
                style={[styles.checkbox, value && styles.checkboxChecked]}
                onPress={() => onChange(!value)}
              />
            )}
          />
          <Text style={styles.checkboxText}>
            Acepto a CCP para enviarme información a través de correo
            electrónico, Whatsapp y/o celular.
          </Text>
        </View>

        {/* Botón de registro */}
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
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  errorText: {
    color: "red",
    fontSize: 10,
    fontFamily: "Comfortaa-Regular",
    marginLeft: 10,
    marginTop: 2,
  },
});
