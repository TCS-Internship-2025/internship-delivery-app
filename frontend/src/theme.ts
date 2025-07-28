import { blue, green, red, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    default: string;
    paper: string;
  }
}

const white = '#FFFFFF';
const primaryColor = '#40916c';
const primaryColorDark = '#2d6a4f';

// Define global themes and styles here
export const themes = {
  light: createTheme({
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
        light: '#74c69d',
        dark: '#2d6a4f',
        contrastText: white,
      },
      secondary: {
        main: '#52b788',
        light: '#74c69d',
        dark: '#40916c',
      },
      success: {
        main: green[600],
      },
      error: { main: red[600] },
      warning: { main: yellow[700] },
      info: { main: blue[500] },
      background: {
        default: '#F8FBF8',
        paper: white,
      },
      text: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
      },
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          asterisk: {
            color: red[600],
            fontWeight: 'bold',
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          MenuProps: {
            PaperProps: {
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: (theme) => theme.shadows[5],
                '& .MuiList-root': {
                  py: 0,
                },
                '& .MuiMenuItem-root': {
                  paddingTop: 0,
                  paddingY: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              },
            },
          },
        },
      },
    },
  }),
  dark: createTheme({
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#52b788',
        light: '#74c69d',
        dark: primaryColorDark,
        contrastText: white,
      },
      secondary: {
        main: '#74c69d',
        light: '#95d5b2',
        dark: '#52b788',
      },
      success: {
        main: green[400],
      },
      error: { main: red[300] },
      warning: { main: yellow[700] },
      info: { main: blue[200] },
      background: {
        default: '#0A0F0A',
        paper: '#1A1F1A',
      },
      text: {
        primary: '#E8F5E8',
        secondary: '#797979ff',
      },
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          asterisk: {
            color: red[300],
            fontWeight: 'bold',
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          MenuProps: {
            PaperProps: {
              sx: {
                mt: 0.5,
                borderRadius: 2,
                boxShadow: (theme) => theme.shadows[5],
                '& .MuiList-root': {
                  py: 0,
                },
                '& .MuiMenuItem-root': {
                  paddingTop: 0,
                  paddingY: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              },
            },
          },
        },
      },
    },
  }),
};
