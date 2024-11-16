import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#c2d6ff', 
    },
    primary: {
      main: '#e88000', 
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', 
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', 
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', 
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white', 
          fontWeight: '700',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', 
  },
});

export default theme;
