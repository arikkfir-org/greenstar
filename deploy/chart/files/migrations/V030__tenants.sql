CREATE TABLE tenants
(
    id           VARCHAR(10) PRIMARY KEY,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name TEXT CONSTRAINT val_display_name_length CHECK (CHAR_LENGTH(display_name) > 0)
);
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE tenants TO greenstar_server;
