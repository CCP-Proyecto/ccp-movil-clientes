import { render } from "@testing-library/react-native";

import HomeScreen, { CustomText } from "@/app/index";

describe("<HomeScreen />", () => {
  test("Text renders correctly on HomeScreen", () => {
    const { getByText } = render(<HomeScreen />);

    getByText("Welcome to CCP Movil Clientes!");
  });

  test("CustomText renders correctly", () => {
    const tree = render(<CustomText>Some text</CustomText>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
