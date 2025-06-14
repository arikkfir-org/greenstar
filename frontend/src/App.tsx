import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { Layout } from "./Layout.tsx"
import { forwardRef, useMemo } from "react"
import { ApolloProvider } from "@apollo/client"
import {
    LoadedCurrenciesStateCtx,
    LoadedLanguagesStateCtx,
    LoadedSelectedCurrencyStateCtx,
    LoadedSelectedLanguageStateCtx,
} from "./contexts/LoadingState.ts"
import { LoadingStateProvider } from "./providers/LoadingStateProvider.tsx"
import { green, yellow } from "@mui/material/colors"
import { Link as WouterLink, LinkProps as WouterLinkProps } from "wouter"
import { apolloClient } from "./util/ApolloClient.ts"
import { LinkProps as MuiLinkProps } from "@mui/material/Link"
import { LocalizationProvider } from "@mui/x-date-pickers-pro"
import { AdapterLuxon } from "@mui/x-date-pickers-pro/AdapterLuxon"
import { SnackbarProvider } from "notistack"

// Remove "to" and "asChild" properties from Wouter's <Link> component props
type CustomWouterLinkProps = Omit<Omit<WouterLinkProps, "to">, "asChild"> & { href: string }

// Create a custom component that renders a Wouter <Link> element with all the properties set on the parent element,
// such as a MUI <Button> or an MUI <Link> component. This component is used below in the MUI theme customization to
// configure MUI's <Link> and <ButtonBase> to use it instead of the built-in MUI <a> component.
const LinkBehavior = forwardRef<HTMLAnchorElement, CustomWouterLinkProps>(
    (props, ref) => {
        const { href, ...other } = props
        return <WouterLink ref={ref} href={href} {...other} />
    },
)

export function App() {
    const theme = useMemo(() => createTheme({
        colorSchemes: { light: true, dark: false },
        cssVariables: {
            colorSchemeSelector: "class",
        },
        palette: {
            primary: {
                main: green[500],
                contrastText: "#ffffff",
            },
            secondary: {
                main: yellow[500],
            },
        },
        components: {
            MuiLink: {
                defaultProps: {
                    component: LinkBehavior,
                } as MuiLinkProps,
            },
            MuiButtonBase: {
                defaultProps: {
                    LinkComponent: LinkBehavior,
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        "&.MuiMenuItem-root:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                        },
                    }),
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        color: theme.palette.primary.contrastText,
                        borderColor: theme.palette.primary.contrastText,
                        "&.Mui-selected": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                            },
                        },
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                    }),
                },
            },
            MuiToggleButtonGroup: {
                styleOverrides: {
                    grouped: {
                        border: "1px solid",
                        borderColor: "inherit",
                    },
                },
            },
        },
    }), [])

    return (
        <ApolloProvider client={apolloClient}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <LoadingStateProvider ctx={LoadedLanguagesStateCtx}>
                        <LoadingStateProvider ctx={LoadedSelectedLanguageStateCtx}>
                            <LoadingStateProvider ctx={LoadedCurrenciesStateCtx}>
                                <LoadingStateProvider ctx={LoadedSelectedCurrencyStateCtx}>
                                    <SnackbarProvider />
                                    <Layout />
                                </LoadingStateProvider>
                            </LoadingStateProvider>
                        </LoadingStateProvider>
                    </LoadingStateProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </ApolloProvider>
    )
}
