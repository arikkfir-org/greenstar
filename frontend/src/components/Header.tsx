import {
    AppBar,
    Avatar,
    Divider,
    Fab,
    ListItemIcon,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    TextField,
    Theme,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material"
import { ChangeEvent, MouseEvent, SyntheticEvent, useCallback, useContext, useMemo, useState } from "react"
import { useLocation } from "wouter"
import SettingsIcon from "@mui/icons-material/Settings"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LogoutIcon from "@mui/icons-material/Logout"
import { CurrenciesContext } from "../contexts/Currencies.ts"
import { SelectedCurrencyContext } from "../contexts/SelectedCurrency.ts"
import { Currency } from "../graphql/graphql.ts"

function LogoIcon() {
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="10" width="36" height="44" rx="3" fill="#FFFFFF" stroke="#4CAF50" strokeWidth="2" />
            <rect x="14" y="10" width="6" height="44" fill="#E8F5E9" />

            <line x1="22" y1="18" x2="42" y2="18" stroke="#4CAF50" strokeWidth="1.5" />
            <line x1="22" y1="24" x2="36" y2="24" stroke="#4CAF50" strokeWidth="1.5" />
            <line x1="22" y1="30" x2="46" y2="30" stroke="#4CAF50" strokeWidth="1.5" />
            <line x1="22" y1="36" x2="34" y2="36" stroke="#4CAF50" strokeWidth="1.5" />
            <line x1="22" y1="42" x2="40" y2="42" stroke="#4CAF50" strokeWidth="1.5" />

            <polygon points="20,54 22.6,60.6 29.8,60.6 24,64.8 26.6,71.4 20,67.2 13.4,71.4 16,64.8 10.2,60.6 17.4,60.6"
                     fill="#34A853" transform="translate(3,-20)" />
        </svg>
    )
}

function Title() {
    const theme: Theme = useTheme()
    return (
        <Typography className="title" variant="h5" sx={{
            fontWeight: 700,
            textShadow: `0.1em 0.1em ${theme.vars?.palette.grey["700"]}`,
        }}>GreenSTAR</Typography>
    )
}

function Nav() {
    const [ location, navigate ] = useLocation()
    const handleAppBarNavChange  = (_event: SyntheticEvent, v: string) => navigate(v)
    const navLocations           = [
        { value: "/", label: "Home" },
        { value: "/transactions", label: "Transactions" },
        { value: "/scrapers", label: "Scrapers" },
        { value: "/about", label: "About" },
    ]
    return (
        <Tabs value={navLocations.map(l => l.value).includes(location) ? location : false}
              onChange={handleAppBarNavChange} indicatorColor="secondary"
              textColor="inherit" variant="fullWidth">
            {navLocations.map(l => (
                <Tab key={l.value} value={l.value} label={l.label} sx={{ fontWeight: 700 }} />
            ))}
        </Tabs>
    )
}

function AccountFab() {
    const theme: Theme                                            = useTheme()
    const [ _location, navigate ]                                 = useLocation()
    const [ anchorEl, setAnchorEl ]                               = useState<null | HTMLElement>(null)
    const handleClick: (e: MouseEvent<HTMLButtonElement>) => void = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
    const navigateTo: (uri: string) => void                       = (uri: string) => {
        setAnchorEl(null)
        navigate(uri)
    }
    return (
        <>
            <Fab color="secondary" size="small" onClick={handleClick}>
                <Avatar sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                }}>AK</Avatar>
            </Fab>
            <Menu id="account-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => navigateTo("/my-account")}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    My Account
                </MenuItem>
                <MenuItem onClick={() => navigateTo("/settings")}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigateTo("/logout")}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    )
}

function CurrencyFab() {
    const theme: Theme                  = useTheme()
    const currencies: Currency[]        = useContext(CurrenciesContext)
    const { currency, setCurrency }     = useContext(SelectedCurrencyContext)
    const [ anchorEl, setAnchorEl ]     = useState<null | HTMLElement>(null)
    const [ searchTerm, setSearchTerm ] = useState<string>("")

    const handleClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget),
        [ setAnchorEl ],
    )

    const handleClose = useCallback(
        () => {
            setAnchorEl(null)
            setSearchTerm("")
        },
        [ setAnchorEl, setSearchTerm ],
    )

    const handleCurrencySelect = useCallback(
        (selectedCurrency: Currency) => {
            setCurrency(selectedCurrency)
            handleClose()
        },
        [ setCurrency, handleClose ],
    )

    const handleSearchChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
        [ setSearchTerm ],
    )

    const filteredCurrencies: Currency[] = useMemo(
        () => currencies.filter(c =>
            c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
        [ currencies, searchTerm ],
    )

    return (
        <>
            <Fab
                color="secondary"
                size="small"
                onClick={handleClick}
                sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                }}
            >
                {currency?.nativeSymbol || "-"}
            </Fab>
            <Menu anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
            >
                <div style={{ padding: "8px 16px" }}>
                    <TextField placeholder="Search currency"
                               variant="outlined"
                               size="small"
                               fullWidth
                               value={searchTerm}
                               onChange={handleSearchChange}
                    />
                </div>
                <Divider />
                {filteredCurrencies.map((c) => (
                    <MenuItem key={c.code}
                              onClick={() => handleCurrencySelect(c)}
                              selected={currency?.code === c.code}
                    >
                        <ListItemIcon>
                            <Typography variant="body2">{c.nativeSymbol}</Typography>
                        </ListItemIcon>
                        <Typography variant="body1">{c.code}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {c.name}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export function Header() {
    return (
        <AppBar position="relative" component="header">
            <Toolbar sx={{ justifyContent: "space-between", gap: "1em", alignContent: "center", alignItems: "center" }}>
                <LogoIcon />
                <Title />
                <div style={{ flexGrow: 1 }}></div>
                <Nav />
                <div style={{ flexGrow: 1 }}></div>
                <CurrencyFab />
                <AccountFab />
            </Toolbar>
        </AppBar>
    )
}
