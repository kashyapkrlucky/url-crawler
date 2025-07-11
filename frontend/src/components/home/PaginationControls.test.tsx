import { render, screen, fireEvent } from "@testing-library/react";
import PaginationControls from "./PaginationControls";
import { describe, it, expect, vi } from "vitest";

describe("PaginationControls", () => {
  it("disables the previous button on the first page", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={1}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole("button", { name: /previous page/i });
    expect(prevButton).toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={5}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next page/i });
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange with correct page when buttons clicked", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={3}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole("button", { name: /previous page/i });
    const nextButton = screen.getByRole("button", { name: /next page/i });

    fireEvent.click(prevButton);
    expect(onPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("shows correct current and total page text", () => {
    render(
      <PaginationControls
        currentPage={2}
        pageCount={10}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText("Page 2 of 10")).toBeInTheDocument();
  });
});
