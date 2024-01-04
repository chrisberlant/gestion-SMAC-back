# Gestion SMAC (Back-end)

Cette application permet de gérer des périphériques mobiles (smartphones, tablettes, clés 4G).
Elle a été initialement créée pour simplifier le travail du service téléphonie mobile du Ministère de la Transition écologique et de la Cohésion des territoires.

## Base de données

Les fichiers de scripts SQL contenus dans db_creation permettent de créer la structure de la base de données PostgreSQL et d'y insérer des données fictives.

```bash
psql -U username -d db_name -h hostname -f insert_tables.sql
psql -U username -d db_name -h hostname -f insert_data.sql
```

## Front-end

A utiliser avec le front-end stocké sur le repository : <https://github.com/chrisberlant/gestion-SMAC-front>
