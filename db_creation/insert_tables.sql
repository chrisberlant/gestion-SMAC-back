BEGIN;

-- Suppression des tables si existantes
DROP TABLE IF EXISTS "user","service","agent","model","device","line","history" CASCADE;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role;
    END IF;

        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'device_status') THEN
        DROP TYPE device_status;
    END IF;

        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'line_profile') THEN
        DROP TYPE line_profile;
    END IF;

        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'line_status') THEN
        DROP TYPE line_status;
    END IF;

        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'history_operation') THEN
        DROP TYPE history_operation;
    END IF;
    
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'history_table') THEN
        DROP TYPE history_table;
    END IF;
END $$;


CREATE TYPE user_role AS ENUM('Admin', 'Tech', 'Consultant');
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "role" user_role NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    CHECK (
        "last_name" <> '' AND
        "first_name" <> '' AND
        "email" <> '' AND
        "password" <> ''
    )
);

CREATE TABLE "service" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL UNIQUE,
    CHECK ("title" <> '')
);

CREATE TABLE "agent" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "vip" BOOLEAN NOT NULL,
    "service_id" INT NOT NULL,
    FOREIGN KEY ("service_id") REFERENCES "service"("id"),
    CHECK (
        "last_name" <> '' AND
        "first_name" <> '' AND
        "email" <> ''
    )
);

CREATE TABLE "model" (
    "id" SERIAL PRIMARY KEY,
    "brand" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "storage" TEXT,
    CHECK (
        "brand" <> '' AND
        "reference" <> '' AND
        "storage" <> ''
    )
);

CREATE TYPE device_status AS ENUM('En stock', 'Attribué', 'Restitué', 'En attente de restitution', 'En prêt', 'En panne', 'Volé');
CREATE TABLE "device" (
    "id" SERIAL PRIMARY KEY,
    "imei" VARCHAR(16) NOT NULL UNIQUE,
    "status" device_status NOT NULL,
    "is_new" BOOLEAN NOT NULL,
    "preparation_date" DATE,
    "attribution_date" DATE,
    "comments" TEXT,
    "agent_id" INT,
    "model_id" INT NOT NULL,
    FOREIGN KEY ("agent_id") REFERENCES "agent"("id") ON DELETE SET NULL,
    FOREIGN KEY ("model_id") REFERENCES "model"("id"),
    CHECK (
        "imei" <> '' AND
        "comments" <> ''
    )
);

CREATE TYPE line_profile AS ENUM('V', 'D', 'VD');
CREATE TYPE line_status AS ENUM('Active', 'En cours', 'Résiliée');
CREATE TABLE "line" (
    "id" SERIAL PRIMARY KEY,
    "number" TEXT NOT NULL UNIQUE,
    "profile" line_profile NOT NULL,
    "status" line_status NOT NULL,
    "comments" TEXT,
    "agent_id" INT,
    "device_id" INT UNIQUE,
    FOREIGN KEY ("agent_id") REFERENCES "agent"("id") ON DELETE SET NULL,
    FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE SET NULL,
    CHECK (
        "number" <> '' AND
        "comments" <> ''
    )
);

CREATE TYPE history_operation AS ENUM('Création', 'Modification', 'Suppression');
CREATE TYPE history_table AS ENUM('user', 'service', 'agent', 'model', 'device', 'line');
CREATE TABLE "history" (
    "id" SERIAL PRIMARY KEY,
    "operation" history_operation NOT NULL,
    "table" history_table NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "user_id" INT,
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL
);


-- Création de la fonction de déclencheur pour modifier la table device
CREATE OR REPLACE FUNCTION update_device_owner()
RETURNS TRIGGER AS $$
BEGIN

    -- Vérification si le propriétaire de l'appareil est différent de celui de la ligne
    IF NEW.agent_id IS DISTINCT FROM (SELECT agent_id FROM device WHERE id = NEW.device_id) THEN
        UPDATE device
        SET agent_id = NEW.agent_id
        WHERE id = NEW.device_id;
    END IF;

    -- Si l'appareil a été modifié, le désaffecter de l'ancienne ligne
    IF NEW.device_id IS DISTINCT FROM OLD.device_id THEN
        UPDATE line
        SET device_id = NULL
        WHERE device_id = NEW.device_id;
    END IF;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

-- Création du déclencheur sur la table line
CREATE TRIGGER update_device_owner_trigger
BEFORE INSERT OR UPDATE OF device_id, agent_id ON line
FOR EACH ROW
WHEN (pg_trigger_depth() < 1)   -- Uniquement si la mise à jour n'est pas effectuée par un autre trigger
EXECUTE FUNCTION update_device_owner();


-- Création de la fonction de déclencheur pour modifier la table line
CREATE OR REPLACE FUNCTION update_line_owner()
RETURNS TRIGGER AS $$
BEGIN

    -- Vérification si le propriétaire de la ligne est différent de celui de l'appareil
    IF NEW.agent_id IS DISTINCT FROM (SELECT agent_id FROM line WHERE device_id = NEW.id) THEN
        UPDATE line
        SET agent_id = NEW.agent_id
        WHERE device_id = NEW.id;
    END IF;

    RETURN NEW;
    
END;
$$ LANGUAGE plpgsql;

-- Création du déclencheur sur la table device
CREATE TRIGGER update_line_owner_trigger
BEFORE UPDATE OF agent_id ON device
FOR EACH ROW
WHEN (pg_trigger_depth() < 1)   -- Uniquement si la mise à jour n'est pas effectuée par un autre trigger
EXECUTE FUNCTION update_line_owner();

INSERT INTO "public"."user" ("last_name", "first_name", "email", "password", "role") VALUES
('User', 'Root', 'root.user@gmail.com', '$2a$10$Fk6Nl6in0E9cO6XrmTDeseOJ3mbLuULupvOp10lPmBhtnu.93alwS', 'Admin');


COMMIT;
