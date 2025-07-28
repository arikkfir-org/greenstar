CREATE TABLE rates
(
    id                   TEXT    NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    date                 DATE    NOT NULL,
    source_currency_code TEXT    NOT NULL
        CONSTRAINT fk_rates_source_currency_code
            REFERENCES currencies
            ON UPDATE CASCADE ON DELETE CASCADE,
    target_currency_code TEXT    NOT NULL
        CONSTRAINT fk_rates_target_currency_code
            REFERENCES currencies
            ON UPDATE CASCADE ON DELETE CASCADE,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rate                 NUMERIC NOT NULL,
    CONSTRAINT uq_rates UNIQUE (date, source_currency_code, target_currency_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE rates TO greenstar_server;
