CREATE TABLE transactions
(
    id                TEXT       NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at        TIMESTAMP WITH TIME ZONE        DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE        DEFAULT NOW(),
    date              TIMESTAMP WITH TIME ZONE,
    sequence          SMALLINT   NOT NULL             DEFAULT 0
        CONSTRAINT val_sequence_gt_0 CHECK ( sequence >= 0 ),
    reference_id      TEXT       NOT NULL
        CONSTRAINT val_reference_id_not_empty CHECK (CHAR_LENGTH(reference_id) > 0),
    amount            NUMERIC    NOT NULL
        CONSTRAINT val_amount_gt_0 CHECK (amount > 0),
    currency          VARCHAR(5) NOT NULL
        CONSTRAINT val_currency_not_empty CHECK (CHAR_LENGTH(currency) = 3)
        CONSTRAINT fk_transactions_currency
            REFERENCES currencies
            ON UPDATE CASCADE ON DELETE RESTRICT,
    description       TEXT
        CONSTRAINT val_description_not_empty CHECK (CHAR_LENGTH(description) > 0),
    source_account_id TEXT       NOT NULL,
    target_account_id TEXT       NOT NULL,
    tenant_id         TEXT       NOT NULL
        CONSTRAINT fk_transactions_tenant_id
            REFERENCES tenants
            ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (tenant_id, id),
    CONSTRAINT fk_transactions_source_account_id
        FOREIGN KEY (tenant_id, source_account_id)
            REFERENCES accounts (tenant_id, id)
            ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_transactions_target_account_id
        FOREIGN KEY (tenant_id, target_account_id)
            REFERENCES accounts (tenant_id, id)
            ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_transactions_tenant_id_id UNIQUE (tenant_id, id),
    CONSTRAINT uq_transactions UNIQUE (
                                       date, reference_id, amount, currency, description,
                                       source_account_id, target_account_id, tenant_id
        )
);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE transactions TO greenstar_server;
