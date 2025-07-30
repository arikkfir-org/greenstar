CREATE TABLE accounts
(
    id           TEXT        NOT NULL     DEFAULT gen_random_uuid(),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name TEXT        NOT NULL
        CONSTRAINT val_display_name_length CHECK (CHAR_LENGTH(display_name) > 0),
    icon         TEXT        NOT NULL
        CONSTRAINT val_icon_length CHECK (CHAR_LENGTH(icon) > 0),
    type         TEXT,
    parent_id    TEXT,
    tenant_id    VARCHAR(10) NOT NULL
        CONSTRAINT fk_accounts_tenant_id
            REFERENCES tenants
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT pk_accounts
        PRIMARY KEY (tenant_id, id),
    CONSTRAINT fk_accounts_parent_id
        FOREIGN KEY (tenant_id, parent_id) REFERENCES accounts (tenant_id, id) ON UPDATE CASCADE ON DELETE CASCADE
);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE accounts TO greenstar_server;

CREATE VIEW v_accounts AS
SELECT a.*, COALESCE(child_counts.child_count, 0) AS child_count
FROM accounts a
         LEFT JOIN (SELECT tenant_id, parent_id, COUNT(*) AS child_count
                    FROM accounts
                    WHERE parent_id IS NOT NULL
                    GROUP BY tenant_id, parent_id) child_counts
                   ON a.tenant_id = child_counts.tenant_id AND a.id = child_counts.parent_id;
GRANT SELECT ON v_accounts TO greenstar_server;
