CREATE TABLE scraper_types
(
    id           TEXT PRIMARY KEY,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name TEXT  NOT NULL
        CONSTRAINT val_display_name_length CHECK (CHAR_LENGTH(display_name) > 0),
    parameters   jsonb NOT NULL
);
CREATE INDEX idx_scraper_types_parameters ON scraper_types USING gin (parameters);
GRANT SELECT ON TABLE scraper_types TO greenstar_server;

INSERT INTO scraper_types (id, display_name, parameters)
VALUES ('bankYahav', 'Bank Yahav', '{
    "ACCOUNT_ID": {
        "type": "Account",
        "displayName": "Account"
    },
    "BANK_YAHAV_USERNAME": {
        "type": "Password",
        "displayName": "Username"
    },
    "BANK_YAHAV_PASSWORD": {
        "type": "Password",
        "displayName": "Password"
    },
    "BANK_YAHAV_PINNO": {
        "type": "Password",
        "displayName": "ID number"
    },
    "DOWNLOAD_XLS": {
        "type": "Boolean",
        "displayName": "Download XLS files"
    }
}');

CREATE TABLE scrapers
(
    id                           TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                   TIMESTAMP WITH TIME ZONE         DEFAULT NOW(),
    updated_at                   TIMESTAMP WITH TIME ZONE         DEFAULT NOW(),
    display_name                 TEXT        NOT NULL
        CONSTRAINT display_name_length CHECK (CHAR_LENGTH(display_name) > 0),
    scraper_type_id              TEXT        NOT NULL
        CONSTRAINT fk_scrapers_scraper_type_id
            REFERENCES scraper_types (id)
            ON UPDATE CASCADE ON DELETE CASCADE,
    parameters                   jsonb       NOT NULL,
    last_successful_scraped_date TIMESTAMP WITH TIME ZONE,
    tenant_id                    VARCHAR(10) NOT NULL
        CONSTRAINT fk_scrapers_tenant_id
            REFERENCES tenants (id)
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT uq_scrapers UNIQUE (tenant_id, id)
);
CREATE INDEX idx_scrapers_parameters ON scrapers USING gin (parameters);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE scrapers TO greenstar_server;
