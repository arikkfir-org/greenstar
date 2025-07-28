CREATE TABLE transactions
(
    tenant_id         TEXT       NOT NULL
        CONSTRAINT fk_transactions_tenant_id
            REFERENCES tenants
            ON UPDATE CASCADE ON DELETE CASCADE,
    id                TEXT       NOT NULL      DEFAULT gen_random_uuid(),
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date              TIMESTAMP WITH TIME ZONE,
    reference_id      TEXT       NOT NULL,
    amount            NUMERIC    NOT NULL CHECK (amount > 0),
    currency          VARCHAR(5) NOT NULL
        CONSTRAINT fk_transactions_currency
            REFERENCES currencies
            ON UPDATE CASCADE ON DELETE RESTRICT,
    description       TEXT
        CONSTRAINT val_description_not_empty CHECK (CHAR_LENGTH(description) > 0),
    source_account_id TEXT       NOT NULL,
    target_account_id TEXT       NOT NULL,
    PRIMARY KEY (tenant_id, id),
    FOREIGN KEY (tenant_id, source_account_id) REFERENCES accounts (tenant_id, id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (tenant_id, target_account_id) REFERENCES accounts (tenant_id, id) ON UPDATE CASCADE ON DELETE CASCADE
);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE transactions TO greenstar_server;
