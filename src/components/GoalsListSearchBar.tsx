// GoalsListSearchBar.tsx
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface GoalsListSearchBarProps {
    query: string;
    setQuery: (query: string) => void;
}

const GoalsListSearchBar: React.FC<GoalsListSearchBarProps> = ({ query, setQuery }) => {
    const { t } = useTranslation();

    return (
        <TextField
            variant="outlined"
            placeholder={t('goalsListSearchBarPlaceholder')}
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

export default GoalsListSearchBar;
