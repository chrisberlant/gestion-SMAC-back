BEGIN;

-- Deleting the tables if already existing
DROP TABLE IF EXISTS "user","service","agent","model","device","line" CASCADE;

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
    "title" TEXT NOT NULL,
    CHECK ("title" <> '')
);

CREATE TABLE "agent" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
    "imei" VARCHAR(15) NOT NULL,
    "status" VARCHAR(25) NOT NULL,
    "is_new" BOOLEAN NOT NULL,
    "preparation_date" DATE,
    "attribution_date" DATE,
    "comments" TEXT,
    "agent_id" INT,
    "model_id" INT NOT NULL,
    FOREIGN KEY ("agent_id") REFERENCES "agent"("id"),
    FOREIGN KEY ("model_id") REFERENCES "model"("id"),
    CHECK (
        "imei" <> '' AND
        "comments" <> '' AND
        "status" IN ( 'En stock', 'Attribué', 'Restitué', 'En attente de restitution', 'En prêt', 'En panne', 'Volé')
    )
);

CREATE TABLE "line" (
    "id" SERIAL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "profile" VARCHAR(2) NOT NULL,
    "status" VARCHAR(9) NOT NULL,
    "comments" TEXT,
    "agent_id" INT,
    "device_id" INT,
    FOREIGN KEY ("agent_id") REFERENCES "agent"("id"),
    FOREIGN KEY ("device_id") REFERENCES "device"("id"),
    CHECK (
        "number" <> '' AND
        "profile" IN ('V', 'D', 'VD') AND
        "status" IN ('Active', 'En cours', 'Résiliée') AND
        "comments" <> ''
    )
);

COMMIT;
