import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UrlForm from "./UrlForm";
import { describe, it, expect, vi } from "vitest";
import axios from "../../lib/axios";

// Mock axios POST
vi.mock("../../lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("UrlForm", () => {
  it("renders textarea and submit button", () => {
    render(<UrlForm onSuccess={() => {}} />);
    expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("submits a single URL", async () => {
    const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;
    const mockOnSuccess = vi.fn();

    mockedPost.mockResolvedValueOnce({
      data: { urls: ["https://reddit.com"] },
    });

    render(<UrlForm onSuccess={mockOnSuccess} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "https://reddit.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/api/add-url", {
        url: "https://reddit.com",
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(["https://reddit.com"]);
    });
  });

  it("submits multiple URLs", async () => {
    const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;
    const mockOnSuccess = vi.fn();
    const urls = ["https://a.com", "https://b.com"];

    mockedPost.mockResolvedValueOnce({ data: { urls } });

    render(<UrlForm onSuccess={mockOnSuccess} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "https://a.com\nhttps://b.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/api/add-url", {
        urls,
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(urls);
    });
  });

  it("disables the button during submission", async () => {
    const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockResolvedValueOnce({ data: { urls: ["https://a.com"] } });

    render(<UrlForm onSuccess={() => {}} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "https://a.com" },
    });

    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("clears input after successful submit", async () => {
    const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockResolvedValueOnce({ data: { urls: ["https://test.com"] } });

    render(<UrlForm onSuccess={() => {}} />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "https://test.com" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });
});
