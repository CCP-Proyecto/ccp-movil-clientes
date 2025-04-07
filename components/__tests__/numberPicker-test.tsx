import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NumberPicker } from "../NumberPicker/numberPicker";

describe("NumberPicker Component", () => {
  const mockOnIncrement = jest.fn();
  const mockOnDecrement = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with initial value", () => {
    const { getByText } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />,
    );

    expect(getByText("5")).toBeTruthy();
    expect(getByText("+")).toBeTruthy();
    expect(getByText("-")).toBeTruthy();
  });

  it("calls onIncrement when + button is pressed", () => {
    const { getByText } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />,
    );

    fireEvent.press(getByText("+"));

    expect(mockOnIncrement).toHaveBeenCalledTimes(1);
    expect(mockOnDecrement).not.toHaveBeenCalled();
  });

  it("calls onDecrement when - button is pressed", () => {
    const { getByText } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />,
    );

    fireEvent.press(getByText("-"));

    expect(mockOnDecrement).toHaveBeenCalledTimes(1);
    expect(mockOnIncrement).not.toHaveBeenCalled();
  });

  it("enters edit mode when value is pressed", () => {
    const { getByText, queryByText, getByDisplayValue } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />,
    );

    fireEvent.press(getByText("5"));

    expect(queryByText("5")).toBeNull();
    expect(getByDisplayValue("5")).toBeTruthy();
  });

  it("handles text input and updates value on blur", () => {
    const { getByText, getByDisplayValue } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
        onChange={mockOnChange}
      />,
    );

    fireEvent.press(getByText("5"));

    const input = getByDisplayValue("5");
    fireEvent.changeText(input, "10");

    fireEvent(input, "blur");

    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it("enforces min value constraint", () => {
    const { getByText, getByDisplayValue } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
        onChange={mockOnChange}
        min={3}
        max={20}
      />,
    );

    fireEvent.press(getByText("5"));

    const input = getByDisplayValue("5");
    fireEvent.changeText(input, "1");

    fireEvent(input, "blur");

    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it("enforces max value constraint", () => {
    const { getByText, getByDisplayValue } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
        onChange={mockOnChange}
        min={1}
        max={10}
      />,
    );

    fireEvent.press(getByText("5"));

    const input = getByDisplayValue("5");
    fireEvent.changeText(input, "15");

    fireEvent(input, "blur");

    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it("only allows numeric input", () => {
    const { getByText, getByDisplayValue } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />,
    );

    fireEvent.press(getByText("5"));

    const input = getByDisplayValue("5");
    fireEvent.changeText(input, "abc");

    expect(input.props.value).toBe("5");

    fireEvent.changeText(input, "42");
    expect(input.props.value).toBe("42");
  });

  it("handles empty input as zero", () => {
    const { getByText, getByDisplayValue } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
        onChange={mockOnChange}
      />,
    );

    fireEvent.press(getByText("5"));

    const input = getByDisplayValue("5");
    fireEvent.changeText(input, "");

    fireEvent(input, "blur");

    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  it("updates displayed value when prop changes", () => {
    const { rerender, getByText } = render(
      <NumberPicker
        value={5}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />,
    );

    expect(getByText("5")).toBeTruthy();

    rerender(
      <NumberPicker
        value={10}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />,
    );

    expect(getByText("10")).toBeTruthy();
  });
});
