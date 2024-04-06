BEGIN;

-- Suppression des tables si existantes
DROP TABLE IF EXISTS "user","service","agent","model","device","line","history" CASCADE;

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "role" VARCHAR(10) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    CHECK (
        "last_name" <> '' AND
        "first_name" <> '' AND
        "email" <> '' AND
        "role" IN ('Admin', 'Tech', 'Consultant') AND
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

CREATE TABLE "device" (
    "id" SERIAL PRIMARY KEY,
    "imei" VARCHAR(15) NOT NULL UNIQUE,
    "status" VARCHAR(25) NOT NULL,
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
        "comments" <> '' AND
        "status" IN ( 'En stock', 'Attribué', 'Restitué', 'En attente de restitution', 'En prêt', 'En panne', 'Volé')
    )
);

CREATE TABLE "line" (
    "id" SERIAL PRIMARY KEY,
    "number" TEXT NOT NULL UNIQUE,
    "profile" VARCHAR(2) NOT NULL,
    "status" VARCHAR(9) NOT NULL,
    "comments" TEXT,
    "agent_id" INT,
    "device_id" INT UNIQUE,
    FOREIGN KEY ("agent_id") REFERENCES "agent"("id") ON DELETE SET NULL,
    FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE SET NULL,
    CHECK (
        "number" <> '' AND
        "profile" IN ('V', 'D', 'VD') AND
        "status" IN ('Active', 'En cours', 'Résiliée') AND
        "comments" <> ''
    )
);

CREATE TABLE "history" (
    "id" SERIAL PRIMARY KEY,
    "operation" VARCHAR(12) NOT NULL,
    "table" VARCHAR(7) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "user_id" INT,
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL,
    CHECK (
        "operation" IN ('Création', 'Modification', 'Suppression') AND
        "table" IN ('user', 'service', 'agent', 'model', 'device', 'line')
    )
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
('Admin', 'Super', 'super.admin@gmail.com', '$2a$10$Fk6Nl6in0E9cO6XrmTDeseOJ3mbLuULupvOp10lPmBhtnu.93alwS', 'Admin');


COMMIT;
