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
      className="border border-gray-300 rounded px-3 py-2 w-full"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default SearchBox;
