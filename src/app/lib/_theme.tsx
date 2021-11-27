import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const structure = {
  border: { radius: '4px' }
};

export const color = {
  background: { main: '#fafcfe' },
  border: { main: '#ddd', light: '#eee' },
  section: { main: '#f0f4f9', light: '#e0e4e9', dark: '#d0d4d9' },
  input: { main: '#fafcfe', light: '#fff' },
};

const theme = createTheme({
  palette: {
    primary: { main: '#bdd739' },
    secondary: { main: '#43C2C1' },
    error: { main: '#ed4337' },
    warning: { main: '#ffcf33' },
    success: { main: '#4bb543' },
    info: { main: '#59a6f2' },
  },
  typography: {
    fontFamily: ['Quicksand', 'sans-serif'].join(',')
  }
});

export default responsiveFontSizes(theme);
