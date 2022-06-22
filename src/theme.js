import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    components: {
        // Name of the component
        MuiOutlinedInput: {
            styleOverrides: {
                // Name of the slot
                root: {
                  // Some CSS
                  height: '3.1rem',
                },
              },
        },
    },
});

export default theme;
