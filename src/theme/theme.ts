import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff0044', // Change primary color
        },
        secondary: {
            main: '#6f00ff', // Change secondary color
        },
        error: {
            main: '#f44336', // Change error color
        },
        warning: {
            main: '#ff9800', // Change warning color
        },
        info: {
            main: '#2196f3', // Change info color
        },
        success: {
            main: '#4caf50', // Change success color
        },
        // Add more custom colors as needed
    },
});

export default theme;
