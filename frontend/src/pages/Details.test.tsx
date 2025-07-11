import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "../lib/axios";
import DetailsPage from "./Details";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../contexts/AuthProvider";

// Mock axios using vitest
vi.mock("../lib/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("DetailsPage", () => {
  const fakeUrlId = "123";

  const renderWithRouter = (id: string) =>
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[`/details/${id}`]}>
          <Routes>
            <Route path="/details/:urlId" element={<DetailsPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithRouter(fakeUrlId);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error message on fetch failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));
    renderWithRouter(fakeUrlId);
    await waitFor(() =>
      expect(screen.getByText(/failed to load details/i)).toBeInTheDocument()
    );
  });
  //   mockedAxios.get.mockResolvedValue({ data: mockData });

  //   renderWithRouter(fakeUrlId);

  //   expect(screen.getByText(/loading/i)).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
  //       /example site/i
  //     );
  //   });

  //   expect(screen.getByText(/html version/i)).toBeInTheDocument();
  //   expect(screen.getByText(/html5/i)).toBeInTheDocument();

  //   expect(screen.getByText(/internal links/i)).toBeInTheDocument();
  //   expect(screen.getByText("10")).toBeInTheDocument();

  //   expect(screen.getByText(/external links/i)).toBeInTheDocument();
  //   expect(screen.getByText("5")).toBeInTheDocument();

  //   expect(screen.getByText(/broken links/i)).toBeInTheDocument();
  //   expect(screen.getByText("1")).toBeInTheDocument();

  //   expect(screen.getByText(/h1 count/i)).toBeInTheDocument();
  //   expect(screen.getByText("2")).toBeInTheDocument();

  //   expect(screen.getByText(/status/i)).toBeInTheDocument();
  //   expect(screen.getByText(/completed/i)).toBeInTheDocument();

  //   expect(screen.getByText(/last updated/i)).toBeInTheDocument();

  //   expect(screen.getByText("Broken Links")).toBeInTheDocument();
  //   expect(screen.getByText("https://brokenlink.com")).toBeInTheDocument();
  //   expect(screen.getByText(/status code: 404/i)).toBeInTheDocument();
  // });

  // it("shows no broken links message if none found", async () => {
  //   const noBrokenLinksData = { ...mockData, broken_links_list: [] };
  //   mockedAxios.get.mockResolvedValue({ data: noBrokenLinksData });

  //   renderWithRouter(fakeUrlId);

  //   await waitFor(() =>
  //     expect(screen.getByText(/no broken links found/i)).toBeInTheDocument()
  //   );
  // });

  // it("shows 'details not found' if details null", async () => {
  //   mockedAxios.get.mockResolvedValue({ data: null });

  //   renderWithRouter(fakeUrlId);

  //   await waitFor(() =>
  //     expect(screen.getByText(/details not found/i)).toBeInTheDocument()
  //   );
  // });
});
