BEGIN;

INSERT INTO "public"."user" ("id", "last_name", "first_name", "email", "password", "is_admin") VALUES
(1, 'Admin', 'Super', 'super.admin@gmail.com', '$2a$10$Fk6Nl6in0E9cO6XrmTDeseOJ3mbLuULupvOp10lPmBhtnu.93alwS', 't');

INSERT INTO "public"."service" ("id", "title") VALUES
(1, 'SG'), (2, 'OH'), (3, 'DAF'), (4, 'DNUM');

INSERT INTO "public"."agent" ("id", "last_name", "first_name", "email", "service_id") VALUES
(1, 'Smith', 'John', 'john.smith@example.com', 1),
(2, 'Johnson', 'Alice', 'alice.johnson@example.com', 2),
(3, 'Williams', 'Robert', 'robert.williams@example.com', 3),
(4, 'Jones', 'Emily', 'emily.jones@example.com', 4),
(5, 'Brown', 'Michael', 'michael.brown@example.com', 2),
(6, 'Davis', 'Jessica', 'jessica.davis@example.com', 4),
(7, 'Miller', 'David', 'david.miller@example.com', 2),
(8, 'Wilson', 'Linda', 'linda.wilson@example.com', 3),
(9, 'Moore', 'Richard', 'richard.moore@example.com', 1),
(10, 'Taylor', 'Karen', 'karen.taylor@example.com', 2);

INSERT INTO "public"."model" ("id", "brand", "reference", "storage") VALUES
(1, 'Apple', 'iPhone 15', '256GB'),
(2, 'Apple', 'iPhone 15 Pro Max', '512GB'),
(3, 'Samsung', 'S23', '128GB'),
(4, 'Samsung', 'S23 Ultra', '256GB');

INSERT INTO "public"."device" ("id", "imei", "status", "is_new", "preparation_date", "attribution_date", "comments", "agent_id", "model_id") VALUES
(1, '123456789012345', 'Attribué', 't', '2023-01-01', '2023-01-15', 'Comment 1', 1, 1),
(2, '987654321098765', 'Restitué', 't', '2023-01-02', '2023-01-16', 'Comment 2', 2, 2),
(3, '666777888999000', 'En prêt', 't', '2023-01-04', '2023-01-18', 'Comment 4', 4, 4),
(4, '987654321012345', 'Volé', 't', '2023-01-06', '2023-01-20', 'Comment 6', 6, 2),
(5, '555444333222111', 'Attribué', 'f', '2023-01-07', '2023-01-21', 'Comment 7', 7, 3),
(6, '111000222333444', 'En attente de restitution', 'f', '2023-01-09', '2023-01-23', 'Comment 9', 9, 1),
(7, '555666777888999', 'En prêt', 't', '2023-01-10', '2023-01-24', 'Comment 10', 10, 2),
(8, '111222333444555', 'En attente de restitution', 'f', '2023-01-03', '2023-01-17', NULL, 3, 3),
(9, '123321456654789', 'En panne', 'f', '2023-01-05', '2023-01-19', NULL, 5, 1),
(10, '123987456321654', 'Restitué', 't', '2023-01-08', '2023-01-22', NULL, 8, 4);

INSERT INTO "public"."line" ("id", "number", "profile", "status", "comments", "agent_id", "device_id") VALUES
(1, '0102040829', 'V', 'Attribuée', 'No comments', 2, 4),
(2, '0123456789', 'D', 'En cours', 'Some comments', 1, 1),
(3, '0234567890', 'VD', 'Résiliée', NULL, 5, 2),
(4, '0345678901', 'V', 'Attribuée', 'Additional comments', 4, 5),
(5, '0456789012', 'D', 'Attribuée', NULL, 6, 6),
(6, '0567890123', 'VD', 'En cours', 'Test comments', 10, 9),
(7, '0678901234', 'V', 'Résiliée', NULL, 8, 10),
(8, '0789012345', 'D', 'Attribuée', 'More comments', 9, 3),
(9, '0890123456', 'VD', 'Attribuée', 'New comments', 7, 8),
(10, '0901234567', 'V', 'Résiliée', NULL, 3, 7);


COMMIT;