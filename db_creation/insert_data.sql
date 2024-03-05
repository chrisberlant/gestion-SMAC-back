BEGIN;

INSERT INTO "public"."user" ("last_name", "first_name", "email", "password", "role") VALUES
('Admin', 'Super', 'super.admin@gmail.com', '$2a$10$Fk6Nl6in0E9cO6XrmTDeseOJ3mbLuULupvOp10lPmBhtnu.93alwS', 'Admin');

INSERT INTO "public"."service" ("title") VALUES
('SG'), ('OH'), ('DAF'), ('DNUM');

INSERT INTO "public"."agent" ("last_name", "first_name", "email", "vip", "service_id") VALUES
('Smith', 'John', 'john.smith@example.com', 't', 1),
('Johnson', 'Alice', 'alice.johnson@example.com', 'f', 2),
('Williams', 'Robert', 'robert.williams@example.com', 't', 3),
('Jones', 'Emily', 'emily.jones@example.com', 'f', 4),
('Brown', 'Michael', 'michael.brown@example.com', 'f', 2),
('Davis', 'Jessica', 'jessica.davis@example.com', 'f', 4),
('Miller', 'David', 'david.miller@example.com', 't', 2),
('Wilson', 'Linda', 'linda.wilson@example.com', 'f', 3),
('Moore', 'Richard', 'richard.moore@example.com', 't', 1),
('Taylor', 'Karen', 'karen.taylor@example.com', 'f', 2);

INSERT INTO "public"."model" ("brand", "reference", "storage") VALUES
('Apple', 'iPhone 15', '256GB'),
('Apple', 'iPhone 15 Pro Max', '512GB'),
('Samsung', 'S23', '128GB'),
('Samsung', 'S23 Ultra', '256GB');

INSERT INTO "public"."device" ("imei", "status", "is_new", "preparation_date", "attribution_date", "comments", "agent_id", "model_id") VALUES
('123456789012345', 'En stock', 't', '2023-01-01', '2023-01-15', 'Comment 1', 1, 1),
('987654321098765', 'Restitué', 't', '2023-01-02', '2023-01-16', 'Comment 2', 5, 2),
('666777888999000', 'En prêt', 't', '2023-01-04', '2023-01-18', 'Comment 4', 9, 4),
('987654321012357', 'Volé', 't', '2023-01-06', '2023-01-20', 'Comment 6', 2, 2),
('555444333222111', 'Attribué', 'f', '2023-01-07', '2023-01-21', 'Comment 7', 4, 3),
('111000222333444', 'En attente de restitution', 'f', '2023-01-09', '2023-01-23', 'Comment 9', 6, 1),
('555666777888999', 'En prêt', 't', '2023-01-10', '2023-01-24', 'Comment 10', 3, 2),
('111222333444555', 'En attente de restitution', 'f', '2023-01-03', '2023-01-17', NULL, 7, 3),
('123321456654789', 'En panne', 'f', '2023-01-05', '2023-01-19', NULL, 10, 1),
('123987456321654', 'Restitué', 't', '2023-01-08', '2023-01-22', NULL, 8, 4);

-- INSERT INTO "public"."device" ("imei", "status", "is_new", "preparation_date", "attribution_date", "comments", "agent_id", "model_id") VALUES
-- ('111222333444666', 'En stock', 't', '2023-01-01', '2023-01-15', 'Comment 11', NULL, 1),
-- ('222333444555777', 'Restitué', 't', '2023-01-02', '2023-01-16', 'Comment 12', NULL, 2),
-- ('333444555666888', 'En prêt', 't', '2023-01-04', '2023-01-18', 'Comment 13', NULL, 4),
-- ('444555666777999', 'Volé', 't', '2023-01-06', '2023-01-20', 'Comment 14', NULL, 2),
-- ('555666777888111', 'Attribué', 'f', '2023-01-07', '2023-01-21', 'Comment 15', NULL, 3),
-- ('666777888999222', 'En attente de restitution', 'f', '2023-01-09', '2023-01-23', 'Comment 16', NULL, 1),
-- ('777888999000333', 'En prêt', 't', '2023-01-10', '2023-01-24', 'Comment 17', NULL, 2),
-- ('888999000111444', 'En attente de restitution', 'f', '2023-01-03', '2023-01-17', NULL, NULL, 3),
-- ('999000111222555', 'En panne', 'f', '2023-01-05', '2023-01-19', NULL, NULL, 1),
-- ('000111222333666', 'Restitué', 't', '2023-01-08', '2023-01-22', NULL, NULL, 4),
-- ('111222333444777', 'En stock', 't', '2023-01-01', '2023-01-15', 'Comment 21', NULL, 1),
-- ('222333444555888', 'Restitué', 't', '2023-01-02', '2023-01-16', 'Comment 22', NULL, 2),
-- ('333444555666999', 'En prêt', 't', '2023-01-04', '2023-01-18', 'Comment 23', NULL, 4),
-- ('444555666777000', 'Volé', 't', '2023-01-06', '2023-01-20', 'Comment 24', NULL, 2),
-- ('555666777888112', 'Attribué', 'f', '2023-01-07', '2023-01-21', 'Comment 25', NULL, 3),
-- ('666777888999223', 'En attente de restitution', 'f', '2023-01-09', '2023-01-23', 'Comment 26', NULL, 1),
-- ('777888999000334', 'En prêt', 't', '2023-01-10', '2023-01-24', 'Comment 27', NULL, 2),
-- ('888999000111445', 'En attente de restitution', 'f', '2023-01-03', '2023-01-17', NULL, NULL, 3),
-- ('999000111222556', 'En panne', 'f', '2023-01-05', '2023-01-19', NULL, NULL, 1),
-- ('000111222333667', 'Restitué', 't', '2023-01-08', '2023-01-22', NULL, NULL, 4);





INSERT INTO "public"."line" ("number", "profile", "status", "comments", "agent_id", "device_id") VALUES
('0102040829', 'V', 'Active', 'No comments', 2, 4),
('0123456789', 'D', 'En cours', 'Some comments', 1, 1),
('0234567890', 'VD', 'Résiliée', NULL, 5, 2),
('0345678901', 'V', 'Active', 'Additional comments', 4, 5),
('0456789012', 'D', 'Active', NULL, 6, 6),
('0567890123', 'VD', 'En cours', 'Test comments', 10, 9),
('0678901234', 'V', 'Résiliée', NULL, 8, 10),
('0789012345', 'D', 'Active', 'More comments', 9, 3),
('0890123456', 'VD', 'Active', 'New comments', 7, 8),
('0901234567', 'V', 'Résiliée', NULL, 3, 7);

COMMIT;