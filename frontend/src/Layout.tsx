import { ComponentType, useContext, useMemo } from "react"
import { Route, Switch } from "wouter"
import {
    Backdrop,
    Breadcrumbs,
    Card,
    CardActionArea,
    CardContent,
    Divider,
    LinearProgress,
    Link,
    SvgIconProps,
    Typography,
} from "@mui/material"
import "./Layout.scss"
import {
    LoadedCurrenciesStateCtx,
    LoadedLanguagesStateCtx,
    LoadedSelectedCurrencyStateCtx,
    LoadedSelectedLanguageStateCtx,
} from "./contexts/LoadingState.ts"
import { LanguagesProvider } from "./providers/LanguagesProvider.tsx"
import { SelectedLanguageProvider } from "./providers/SelectedLanguageProvider.tsx"
import { CurrenciesProvider } from "./providers/CurrenciesProvider.tsx"
import { SelectedCurrencyProvider } from "./providers/SelectedCurrencyProvider.tsx"
import { Header } from "./components/Header.tsx"
import { Footer } from "./components/Footer.tsx"
import HomeIcon from "@mui/icons-material/Home"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import ErrorIcon from "@mui/icons-material/Error"
import { DashboardPage } from "./pages/dashboard/DashboardPage.tsx"
import { SettingsPage } from "./pages/settings/SettingsPage.tsx"
import SettingsIcon from "@mui/icons-material/Settings"
import { TransactionsPage } from "./pages/transactions/TransactionsPage.tsx"
import { ScrapersPage } from "./pages/scrapers/ScrapersPage.tsx"
import { AboutPage } from "./pages/About.tsx"
import InfoIcon from "@mui/icons-material/Info"
import CodeIcon from "@mui/icons-material/Code"
import { PageNotFoundErrorPage } from "./pages/error/PageNotFoundErrorPage.tsx"
import { LoadingErrorPage } from "./pages/error/LoadingErrorPage.tsx"

function BreadcrumbsLink({ href, label, Icon }: { href?: string, label: string, Icon: ComponentType<SvgIconProps> }) {
    if (href) {
        return (
            <Link underline="hover" sx={{ display: "flex", alignItems: "center" }} color="inherit" href={href}>
                <Icon sx={{ mr: 0.5 }} fontSize="inherit" />
                {label}
            </Link>
        )
    } else {
        return (
            <Typography sx={{ color: "text.primary", display: "flex", alignItems: "center" }}>
                <Icon sx={{ mr: 0.5 }} fontSize="inherit" />
                {label}
            </Typography>
        )
    }
}

function HomeBreadcrumbsLink() {
    return <BreadcrumbsLink href="/" label="Home" Icon={HomeIcon} />
}

function HomeBreadcrumbsText() {
    return <BreadcrumbsLink label="Home" Icon={HomeIcon} />
}

function LoadingProgress() {
    const { loaded: languagesLoaded }   = useContext(LoadedLanguagesStateCtx)
    const { loaded: selLanguageLoaded } = useContext(LoadedSelectedLanguageStateCtx)
    const { loaded: currLoaded }        = useContext(LoadedCurrenciesStateCtx)
    const { loaded: selCurrLoaded }     = useContext(LoadedSelectedCurrencyStateCtx)
    return (
        <main>
            <Backdrop open={true}>
                <Card elevation={3} sx={{ minWidth: "20em", boxShadow: "3px 3px 3px black" }}>
                    <CardActionArea>
                        <CardContent>
                            <LinearProgress />
                            <Divider sx={{ margin: "1em 0" }} />
                            {!languagesLoaded && <Typography>Loading languages...</Typography>}
                            {!selLanguageLoaded && <Typography>Loading selected language...</Typography>}
                            {!currLoaded && <Typography>Loading currencies...</Typography>}
                            {!selCurrLoaded && <Typography>Loading selected currency...</Typography>}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Backdrop>
        </main>
    )
}

export function Layout() {
    const { error: errLoadingLanguages, loaded: languagesLoaded }     = useContext(LoadedLanguagesStateCtx)
    const { error: errLoadingSelLanguage, loaded: selLanguageLoaded } = useContext(LoadedSelectedLanguageStateCtx)
    const { error: errLoadingCurr, loaded: currLoaded }               = useContext(LoadedCurrenciesStateCtx)
    const { error: errorLoadingSelCurr, loaded: selCurrLoaded }       = useContext(LoadedSelectedCurrencyStateCtx)

    const error = useMemo(
        (): Error | undefined => errLoadingLanguages || errLoadingSelLanguage || errLoadingCurr || errorLoadingSelCurr,
        [ errLoadingLanguages, errLoadingSelLanguage, errLoadingCurr, errorLoadingSelCurr ],
    )

    const loading = useMemo(
        (): boolean => !languagesLoaded || !selLanguageLoaded || !currLoaded || !selCurrLoaded,
        [ languagesLoaded, selLanguageLoaded, currLoaded, selCurrLoaded ],
    )

    return (
        <LanguagesProvider>
            <SelectedLanguageProvider>
                <CurrenciesProvider>
                    <SelectedCurrencyProvider>
                        <Header />
                        {error && (
                            <>
                                <Breadcrumbs>
                                    <HomeBreadcrumbsLink />
                                    <BreadcrumbsLink label="Error" Icon={ErrorIcon} />
                                </Breadcrumbs>
                                <LoadingErrorPage />
                            </>
                        )}
                        {!error && loading && <LoadingProgress />}
                        {!error && !loading && (
                            <Switch>
                                <Route path="/">
                                    <Breadcrumbs>
                                        <HomeBreadcrumbsText />
                                    </Breadcrumbs>
                                    <DashboardPage />
                                </Route>
                                <Route path="/settings" nest>
                                    <Breadcrumbs>
                                        <HomeBreadcrumbsLink />
                                        <BreadcrumbsLink label="Settings" Icon={SettingsIcon} />
                                    </Breadcrumbs>
                                    <SettingsPage />
                                </Route>
                                <Route path="/transactions" nest>
                                    <Breadcrumbs>
                                        <HomeBreadcrumbsLink />
                                        <BreadcrumbsLink label="Transactions" Icon={ReceiptLongIcon} />
                                    </Breadcrumbs>
                                    <TransactionsPage />
                                </Route>
                                <Route path="/scrapers" nest>
                                    <Breadcrumbs>
                                        <HomeBreadcrumbsLink />
                                        <BreadcrumbsLink label="Scrapers" Icon={CodeIcon} />
                                    </Breadcrumbs>
                                    <ScrapersPage />
                                </Route>
                                <Route path="/about">
                                    <Breadcrumbs>
                                        <HomeBreadcrumbsLink />
                                        <BreadcrumbsLink label="About" Icon={InfoIcon} />
                                    </Breadcrumbs>
                                    <AboutPage />
                                </Route>
                                <Route>
                                    <Breadcrumbs>
                                        <HomeBreadcrumbsLink />
                                        <BreadcrumbsLink label="Error" Icon={ErrorIcon} />
                                    </Breadcrumbs>
                                    <PageNotFoundErrorPage />
                                </Route>
                            </Switch>
                        )}
                        <Footer />
                    </SelectedCurrencyProvider>
                </CurrenciesProvider>
            </SelectedLanguageProvider>
        </LanguagesProvider>
    )
}
