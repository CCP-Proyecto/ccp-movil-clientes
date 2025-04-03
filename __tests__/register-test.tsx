import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Register from "@/app/(auth)/register-screen";

// Mock de las dependencias
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Redirect: jest.fn(() => null),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("@/services/auth/auth-client", () => ({
  authClient: {
    signUp: {
      email: jest.fn(),
    },
  },
}));

describe("Register Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    expect(getByText("Empezar ahora")).toBeTruthy();
    expect(getByPlaceholderText("Tipo de identificación")).toBeTruthy();
    expect(getByPlaceholderText("No de identificación")).toBeTruthy();
    expect(getByPlaceholderText("Nombre")).toBeTruthy();
    expect(getByPlaceholderText("Apellido")).toBeTruthy();
    expect(getByPlaceholderText("No de celular")).toBeTruthy();
    expect(getByPlaceholderText("Dirección de entrega")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Contraseña")).toBeTruthy();
    expect(getByText("Registrarme")).toBeTruthy();
  });

  it("shows validation errors when form is submitted with empty fields", async () => {
    const { getByText, findAllByText } = render(<Register />);

    fireEvent.press(getByText("Registrarme"));

    const errorMessages = await findAllByText(/es requerido/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it("validates email format", async () => {
    const { getByText, getByPlaceholderText, findByText } = render(
      <Register />,
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "emailinvalido");
    fireEvent.press(getByText("Registrarme"));

    const emailError = await findByText("Email inválido");
    expect(emailError).toBeTruthy();
  });

  it("validates phone number format", async () => {
    const { getByText, getByPlaceholderText, findByText } = render(
      <Register />,
    );

    fireEvent.changeText(getByPlaceholderText("No de celular"), "123");
    fireEvent.press(getByText("Registrarme"));

    const phoneError = await findByText(
      "Número de celular debe tener 10 dígitos",
    );
    expect(phoneError).toBeTruthy();
  });

  it("validates terms and conditions acceptance", async () => {
    const { getByText, findByText } = render(<Register />);

    fireEvent.press(getByText("Registrarme"));

    const termsError = await findByText(
      "Debes aceptar los términos y condiciones",
    );
    expect(termsError).toBeTruthy();
  });
});
