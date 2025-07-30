CREATE TABLE scraper_parameter_types
(
    id           TEXT PRIMARY KEY,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name TEXT NOT NULL
);
GRANT SELECT ON TABLE scraper_parameter_types TO greenstar_server;

INSERT INTO scraper_parameter_types (id, display_name)
VALUES ('number', 'Number'),
       ('string', 'Text'),
       ('account', 'Account');

CREATE TABLE scraper_types
(
    id           TEXT PRIMARY KEY,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name TEXT NOT NULL
);
GRANT SELECT ON TABLE scraper_types TO greenstar_server;

INSERT INTO scraper_types (id, display_name)
VALUES ('bankYahav', 'Bank Yahav');

CREATE TABLE scraper_type_parameters
(
    scraper_type_id           TEXT NOT NULL
        CONSTRAINT fk_scraper_type_parameters_scraper_type_id
            REFERENCES scraper_types
            ON UPDATE CASCADE ON DELETE CASCADE,
    id                        TEXT NOT NULL,
    created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name              TEXT NOT NULL,
    scraper_parameter_type_id TEXT NOT NULL
        CONSTRAINT fk_scraper_type_parameters_type_id
            REFERENCES scraper_parameter_types
            ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (scraper_type_id, id)
);
GRANT SELECT ON TABLE scraper_type_parameters TO greenstar_server;

INSERT INTO scraper_type_parameters (scraper_type_id, id, display_name, scraper_parameter_type_id)
VALUES ('bankYahav', 'accountID', 'Checking Account', 'account');

CREATE TABLE scrapers
(
    tenant_id       VARCHAR(10) NOT NULL
        CONSTRAINT fk_scrapers_tenant_id
            REFERENCES tenants
            ON UPDATE CASCADE ON DELETE CASCADE,
    scraper_type_id TEXT        NOT NULL
        CONSTRAINT fk_scrapers_scraper_type_id
            REFERENCES scraper_types
            ON UPDATE CASCADE ON DELETE CASCADE,
    id              TEXT        NOT NULL     DEFAULT gen_random_uuid(),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name    TEXT        NOT NULL,
    PRIMARY KEY (tenant_id, scraper_type_id, id)
);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE scrapers TO greenstar_server;

CREATE TABLE scraper_parameters
(
    tenant_id                 TEXT NOT NULL
        CONSTRAINT fk_scraper_parameters_tenant_id
            REFERENCES tenants
            ON UPDATE CASCADE ON DELETE CASCADE,
    scraper_type_id           TEXT NOT NULL
        CONSTRAINT fk_scraper_parameters_scraper_type_id
            REFERENCES scraper_types
            ON UPDATE CASCADE ON DELETE CASCADE,
    scraper_id                TEXT NOT NULL,
    scraper_type_parameter_id TEXT NOT NULL,
    created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    value                     TEXT NOT NULL,
    PRIMARY KEY (tenant_id, scraper_type_id, scraper_id, scraper_type_parameter_id),
    FOREIGN KEY (tenant_id, scraper_type_id, scraper_id)
        REFERENCES scrapers (tenant_id, scraper_type_id, id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (scraper_type_id, scraper_type_parameter_id)
        REFERENCES scraper_type_parameters (scraper_type_id, id)
        ON UPDATE CASCADE ON DELETE CASCADE
);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE scraper_parameters TO greenstar_server;
