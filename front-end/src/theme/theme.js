import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    cssVariables: true, // required
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: "#f0750f", // SEED COLOR
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: "#f0750f", // same seed
                },
            },
        },
    },
});

export default theme;
