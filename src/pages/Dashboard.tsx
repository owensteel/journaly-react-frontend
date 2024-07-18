// Dashboard
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { Container, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        console.log('Search Term:', event.target.value);
    };

    return (
        <Container>
            <Typography variant="h5" gutterBottom>
                Your journals
            </Typography>
            <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
            {/* Add your search results or other content here */}
        </Container>
    );
};

export default Dashboard;
