BEGIN;

-- Deleting the tables if already existing
DROP TABLE IF EXISTS "user","service","agent","model","device","line" CASCADE;

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT CHECK ("last_name" <> '') NOT NULL,
    "first_name" TEXT CHECK ("first_name" <> '') NOT NULL,
    "email" TEXT CHECK ("email" <> '') NOT NULL,
    "password" VARCHAR(72) CHECK ("password" <> '') NOT NULL,
    "is_admin" BOOLEAN NOT NULL
);

CREATE TABLE "service" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT CHECK ("title" <> '') NOT NULL
);

CREATE TABLE "agent" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT CHECK ("last_name" <> '') NOT NULL,
    "first_name" TEXT CHECK ("first_name" <> '') NOT NULL,
    "email" TEXT CHECK ("email" <> '') NOT NULL,
    "service_id" INT NOT NULL,
    FOREIGN KEY ("service_id") REFERENCES "service"("id")
);

CREATE TABLE "model" (
    "id" SERIAL PRIMARY KEY,
    "brand" TEXT CHECK ("brand" <> '') NOT NULL,
    "reference" TEXT CHECK ("reference" <> '') NOT NULL,
    "storage" TEXT CHECK ("storage" <> '')
);

CREATE TABLE "device" (
    "id" SERIAL PRIMARY KEY,
    "imei" VARCHAR(15) CHECK ("imei" <> '') NOT NULL,
    "status" VARCHAR(25) CHECK ("status" IN ('Attribué', 'Restitué', 'En attente de restitution', 'En prêt', 'En panne', 'Volé')) NOT NULL,
    "is_new" BOOLEAN NOT NULL,
    "preparation_date" DATE,
    "attribution_date" DATE,
    "comments" TEXT CHECK ("comments" <> ''),
    "agent_id" INT,
    "model_id" INT NOT NULL,
    FOREIGN KEY ("agent_id") REFERENCES "agent"("id"),
    FOREIGN KEY ("model_id") REFERENCES "model"("id")
);

CREATE TABLE "line" (
    "id" SERIAL PRIMARY KEY,
    "number" TEXT CHECK ("number" <> '') NOT NULL,
    "profile" VARCHAR(2) CHECK ("profile" IN ('V', 'D', 'VD')) NOT NULL,
    "status" VARCHAR(9) CHECK ("status" IN ('Attribuée', 'En cours', 'Résiliée')) NOT NULL,
    "comments" TEXT CHECK ("comments" <> ''),
    "agent_id" INT,
    "device_id" INT,
    FOREIGN KEY ("agent_id") REFERENCES "agent"("id"),
    FOREIGN KEY ("device_id") REFERENCES "device"("id")
);

COMMIT;
