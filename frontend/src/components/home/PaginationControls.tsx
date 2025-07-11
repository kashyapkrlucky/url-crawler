import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center gap-2">
      <button
        className="p-1 border border-blue-600 text-blue-600 rounded disabled:opacity-50"
        disabled={currentPage === 1}
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </button>
      <span className="px-2 py-1 border border-gray-300 rounded w-25 flex items-center text-sm">
        Page {currentPage} of {pageCount}
      </span>
      <button
        className="p-1 border border-blue-600 text-blue-600 rounded disabled:opacity-50"
        disabled={currentPage === pageCount}
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default PaginationControls;
