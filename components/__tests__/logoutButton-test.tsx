import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { LogoutButton } from "../LogoutButton/logoutButton";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => "Ionicons-Mock",
}));

jest.mock("@/services/auth/auth-client", () => ({
  authClient: {
    signOut: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("LogoutButton Component", () => {
  const mockOnLogoutSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const { getByLabelText } = render(<LogoutButton />);

    const button = getByLabelText("Cerrar sesión");
    expect(button).toBeTruthy();
  });

  it("calls signOut when pressed", async () => {
    const { getByLabelText } = render(<LogoutButton />);
    const { authClient } = require("@/services/auth/auth-client");

    fireEvent.press(getByLabelText("Cerrar sesión"));

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
  });

  it("calls onLogoutSuccess callback after successful logout", async () => {
    const { getByLabelText } = render(
      <LogoutButton onLogoutSuccess={mockOnLogoutSuccess} />,
    );

    fireEvent.press(getByLabelText("Cerrar sesión"));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockOnLogoutSuccess).toHaveBeenCalledTimes(1);
  });

  it("handles errors during logout", async () => {
    const { authClient } = require("@/services/auth/auth-client");
    authClient.signOut.mockRejectedValueOnce(new Error("Error de logout"));

    const Toast = require("react-native-toast-message");

    const { getByLabelText } = render(<LogoutButton />);

    fireEvent.press(getByLabelText("Cerrar sesión"));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(Toast.show).toHaveBeenCalledWith({
      type: "error",
      text1: "Error",
      text2: "Ocurrió un error al cerrar sesión",
    });

    expect(mockOnLogoutSuccess).not.toHaveBeenCalled();
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    const { getByLabelText } = render(<LogoutButton style={customStyle} />);

    const button = getByLabelText("Cerrar sesión");

    expect(button.props.style).toMatchObject(customStyle);
  });
});
