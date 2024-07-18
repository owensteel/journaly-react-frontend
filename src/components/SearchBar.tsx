// SearchBar.tsx
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

interface SearchBarProps {
    searchTerm: string;
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
    return (
        <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={onSearch}
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
