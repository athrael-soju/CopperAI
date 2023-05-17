import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "../App";

// Mock the localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
jest.mock("react-dotenv", () => ({
  // Mock values
  VAR_NAME: "mock value",
}));

global.localStorage = mockLocalStorage;

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("app")).toBeInTheDocument();
  });

  it("renders WelcomeMessage when no user is logged in", () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);
    render(<App />);
    expect(screen.getByTestId("welcome-message")).toBeInTheDocument();
  });

  it("renders MainApp when a user is logged in", () => {
    const user = JSON.stringify({ name: "Test User" });
    mockLocalStorage.getItem.mockReturnValueOnce(user);
    render(<App />);
    expect(screen.getByTestId("main-app")).toBeInTheDocument();
  });

  it("logs out a user", async () => {
    const user = JSON.stringify({ name: "Test User" });
    mockLocalStorage.getItem.mockReturnValueOnce(user);
    render(<App />);
    fireEvent.click(screen.getByTestId("logout-button"));
    await waitFor(() =>
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user")
    );
    expect(screen.getByTestId("welcome-message")).toBeInTheDocument();
  });
});
