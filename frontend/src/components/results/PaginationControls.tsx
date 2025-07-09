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
    <div className="flex justify-center mt-4 gap-2">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      <span className="px-3 py-1 border rounded">
        Page {currentPage} of {pageCount}
      </span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
