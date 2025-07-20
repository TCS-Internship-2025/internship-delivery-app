import { blue, green, grey, red, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    default: string;
    paper: string;
  }
}

const white = '#FFFFFF';
const primaryColor = '#6D489C';
const primaryColorDark = '#8b71adff';
const primaryColorSoft = '#6D489C33';

export const themes = {
  light: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
        light: primaryColorSoft,
        contrastText: white,
      },
      success: {
        main: green[600],
      },
      error: { main: red[600] },
      warning: { main: yellow[700] },
      info: { main: blue[500] },
      background: {
        default: grey[100],
        paper: white,
      },
      text: {
        primary: '#000000',
        secondary: '#666666',
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
    palette: {
      mode: 'dark',
      primary: {
        main: primaryColorDark,
        light: primaryColorSoft,
        contrastText: white,
      },
      success: {
        main: green[200],
      },
      error: { main: red[300] },
      warning: { main: yellow[700] },
      info: { main: blue[200] },
      background: {
        default: grey[900],
        paper: '#1E1E1E',
      },
      text: {
        primary: white,
        secondary: '#B3B3B3',
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
