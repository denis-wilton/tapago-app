import React, { FC, useState, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  suggestions: string[];
  onSearch: (searchTerm: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({
  placeholder = "buscar cliente",
  suggestions,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputValue) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue("");
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div className="relative flex items-center justify-between w-full p-4 pt-0 bg-primary text-primary z-50">
      <input
        placeholder={placeholder}
        className="w-full p-2 bg-white/10 text-primary rounded-lg placeholder-white/60 text-xs px-3"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      {showSuggestions && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg -mt-4 z-50">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.slice(0, 10).map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 text-secondary"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No suggestions available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
