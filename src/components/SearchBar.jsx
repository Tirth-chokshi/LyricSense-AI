import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Input } from "@/components/ui/input";
import { Search, Mic,AudioLines } from 'lucide-react';

const SearchBar = ({ onSearch, onSelect, selectedSong }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 2) {
        setIsSearching(true);
        onSearch(query).then((results) => {
          setSearchResults(results);
          setIsSearching(false);
        });
      } else {
        setSearchResults([]);
      }
    }, 300),
    [onSearch]
  );

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSelect = (result) => {
    onSelect(result);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={selectedSong ? `${selectedSong.title} - ${selectedSong.artist}` : "Search for songs or artists"}
          className="pl-10 pr-10 py-3 w-full bg-secondary text-primary-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <AudioLines className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer" />
      </div>
      
      {isSearching && (
        <div className="mt-4 text-center text-muted-foreground">
          Searching...
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-4 bg-secondary rounded-lg shadow-lg overflow-hidden">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="flex items-center p-4 hover:bg-primary/10 cursor-pointer transition-colors duration-200"
              onClick={() => handleSelect(result)}
            >
              <img src={result.albumArt} alt={result.fullTitle} className="w-12 h-12 rounded-md mr-4" />
              <div>
                <h3 className="font-semibold text-primary-foreground">{result.title}</h3>
                <p className="text-sm text-muted-foreground">{result.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;