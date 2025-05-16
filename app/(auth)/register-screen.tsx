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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "@/i18n";

const registerSchema = z.object({
  idType: z.string().min(1, `${t("auth.signup.zod.documentType")}`),
  idNumber: z.string().min(5, `${t("auth.signup.zod.idNumber")}`),
  firstName: z.string().min(1, `${t("auth.signup.zod.name")}`),
  lastName: z.string().min(1, `${t("auth.signup.zod.lastName")}`),
  phone: z.string().regex(/^[0-9]{10}$/, `${t("auth.signup.zod.phone")}`),
  email: z.string().email(`${t("auth.signup.zod.email")}`),
  address: z.string().min(1, `${t("auth.signup.zod.address")}`),
  password: z.string().min(6, `${t("auth.signup.zod.password")}`),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: `${t("auth.signup.zod.acceptTerms")}`,
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
          userId: data.idNumber,
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

      try {
        console.log(data);
        await AsyncStorage.removeItem("user-data");
        await AsyncStorage.setItem(
          "user-data",
          JSON.stringify({
            phone: data.phone,
            address: data.address,
            idType: data.idType,
            userId: data.idNumber,
            name: `${data.firstName} ${data.lastName}`,
          }),
        );
        console.log("Datos del usuario guardados en AsyncStorage");
      } catch (e) {
        Toast.show({
          type: "error",
          text1: `${t("auth.signup.toast.error.storage.text1")}`,
          text2: `${t("auth.signup.toast.error.storage.text2")}`,
        });
        console.error("Error al guardar datos del usuario:", e);
      }

      if (responseData) {
        Toast.show({
          type: "success",
          text1: `${t("auth.signup.toast.success.text1")}`,
          text2: `${t("auth.signup.toast.success.text2")}`,
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
          text1: `${t("auth.signup.toast.error.register.text1")}`,
          text2:
            error.message || `${t("auth.signup.toast.error.register.text2")}`,
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

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Logo />

        <Text style={styles.sectionTitle}>{t("auth.signup.title")}</Text>
        <Text style={styles.sectionSubtitle}>{t("auth.signup.subTitle")}</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>
            {t("auth.signup.documentLabel")}
          </Text>
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
                      label={t("auth.signup.documentPlaceholder")}
                      value=""
                      enabled={false}
                    />
                    <Picker.Item
                      label={t("auth.signup.documentTypes.CC")}
                      value="CC"
                    />
                    <Picker.Item
                      label={t("auth.signup.documentTypes.NIT")}
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
              placeholder={t("auth.signup.idNumberPlaceholder")}
              keyboardType="numeric"
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
              placeholder={t("auth.signup.namePlaceholder")}
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
              placeholder={t("auth.signup.lastNamePlaceholder")}
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
              placeholder={t("auth.signup.phonePlaceholder")}
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
              placeholder={t("auth.signup.addressPlaceholder")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.message}
            />
          )}
        />

        <Text style={styles.sectionTitle}>
          {t("auth.signup.loginDataTitle")}
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("auth.signup.emailPlaceholder")}
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
              placeholder={t("auth.signup.passwordPlaceholder")}
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
              {t("auth.signup.termsAndConditions")}
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
            {t("auth.signup.allowContact")}
          </Text>
        </View>

        <Button
          title={t("auth.signup.button")}
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
