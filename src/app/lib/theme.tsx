import { createMuiTheme, responsiveFontSizes  } from '@material-ui/core/styles';

export const mainColor = '#bdd739';
export const mainLightColor = '#ddf769';
export const borderColor = '#ddd';
export const borderRadius = '4px';

export const backgroundColor = '#fafcfe';
export const sectionColor = '#f0f4f9';
export const sectionDarkColor = '#e0e4e9';
export const sectionDarkerColor = '#d0d4d9';

export const dangerColor = '#ed4337';
export const dangerColorLight = '#ed5347';
export const warnColor = '#ffcf33';
export const warnColorLight = '#ffdf43';
export const successColor = '#4bb543';
export const infoColor = '#59a6f2';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: mainColor,
      light: '#A2DEAA',
    },
    secondary: { main: '#43C2C1' },
  },
  typography: {
    fontFamily: ['Quicksand', 'sans-serif'].join(',')
  }
});

export default responsiveFontSizes(theme);
