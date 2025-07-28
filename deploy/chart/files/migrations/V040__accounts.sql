CREATE TABLE accounts
(
    tenant_id    TEXT NOT NULL
        CONSTRAINT fk_accounts_tenant_id
            REFERENCES tenants
            ON UPDATE CASCADE ON DELETE CASCADE,
    id           TEXT NOT NULL            DEFAULT gen_random_uuid(),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name TEXT NOT NULL
        CONSTRAINT val_display_name_length CHECK (CHAR_LENGTH(display_name) > 0),
    icon         TEXT NOT NULL
        CONSTRAINT val_icon_length CHECK (CHAR_LENGTH(icon) > 0),
    type         TEXT,
    parent_id    TEXT,
    PRIMARY KEY (tenant_id, id),
    FOREIGN KEY (tenant_id, parent_id) REFERENCES accounts (tenant_id, id) ON UPDATE CASCADE ON DELETE CASCADE
);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE accounts TO greenstar_server;
