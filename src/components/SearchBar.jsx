import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { Input } from "@/components/ui/input";
import { Search, AudioLines } from 'lucide-react';

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
    <motion.div 
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={selectedSong ? `${selectedSong.title} - ${selectedSong.artist}` : "Search for songs or artists"}
          className="pl-10 pr-10 py-3 w-full bg-secondary text-primary-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
        />
        <AudioLines className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-300" />
      </div>
      
      <AnimatePresence>
        {isSearching && (
          <motion.div 
            className="mt-4 text-center text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Searching...
          </motion.div>
        )}

        {searchResults.length > 0 && (
          <motion.div 
            className="mt-4 bg-secondary rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {searchResults.map((result) => (
              <motion.div
                key={result.id}
                className="flex items-center p-4 hover:bg-primary/10 cursor-pointer transition-colors duration-200"
                onClick={() => handleSelect(result)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={result.albumArt} alt={result.fullTitle} className="w-12 h-12 rounded-md mr-4 object-cover" />
                <div>
                  <h3 className="font-semibold text-primary-foreground">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">{result.artist}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;