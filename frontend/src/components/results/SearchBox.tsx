import React from "react";

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Search all columns..."
      className="border rounded px-3 py-2 mb-4 w-full"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default SearchBox;
