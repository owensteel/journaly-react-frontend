// SearchBar.tsx
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => {
    return (
        <TextField
            variant="outlined"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <span className="material-symbols-outlined">
                            search
                        </span>
                    </InputAdornment>
                ),
            }}
            fullWidth
        />
    );
};

export default SearchBar;
