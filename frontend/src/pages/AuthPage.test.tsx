import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthForm from "./AuthPage";
import axios from "../lib/axios";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../contexts/AuthProvider", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sign-in form inputs", () => {
    render(
      <MemoryRouter>
        <AuthForm mode="signin" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue as guest/i })
    ).toBeInTheDocument();
  });

  it("renders sign-up form inputs", () => {
    render(
      <MemoryRouter>
        <AuthForm mode="signup" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /continue as guest/i })
    ).not.toBeInTheDocument();
  });

  it("submits sign-in form and calls login and navigate", async () => {
    (axios.post as any).mockResolvedValueOnce({ data: { token: "token123" } });

    render(
      <MemoryRouter>
        <AuthForm mode="signin" />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/signin", {
        email: "user@test.com",
        password: "password",
      });
      expect(mockLogin).toHaveBeenCalledWith("token123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("submits sign-up form and calls login and navigate", async () => {
    (axios.post as any).mockResolvedValueOnce({ data: { token: "token456" } });

    render(
      <MemoryRouter>
        <AuthForm mode="signup" />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "newuser@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/signup", {
        name: "New User",
        email: "newuser@test.com",
        password: "newpass",
      });
      expect(mockLogin).toHaveBeenCalledWith("token456");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles guest login", async () => {
    (axios.post as any).mockResolvedValueOnce({
      data: { token: "guesttoken" },
    });

    render(
      <MemoryRouter>
        <AuthForm mode="signin" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /continue as guest/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/guest-login");
      expect(mockLogin).toHaveBeenCalledWith("guesttoken");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
