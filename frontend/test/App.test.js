import { render} from "@testing-library/react";
import React from "react";
import App from "../src/App.js";

jest.mock("../src/MainApp", () => () => <div>MainApp</div>); // mock MainApp component
jest.mock("../src/components/Navbar", () => () => <div>Navbar</div>); // mock Navbar component
jest.mock("../src/components/WelcomeMessage", () => () => <div>WelcomeMessage</div>); // mock WelcomeMessage component

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it("renders Navbar", () => {
    const { getByText } = render(<App />);
    expect(getByText("Navbar")).toBeInTheDocument();
  });

  // and so on for other components and conditions...
});
