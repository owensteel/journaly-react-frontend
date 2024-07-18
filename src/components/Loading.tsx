// Loading.tsx
import React from 'react';
import { CircularProgress, Grid } from '@mui/material';

const Loading: React.FC = () => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item>
                <CircularProgress />
            </Grid>
        </Grid>
    );
};

export default Loading;
