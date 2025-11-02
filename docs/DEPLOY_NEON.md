# PostgreSQL sur Neon.tech - GRATUIT PERMANENT

## Pourquoi Neon ?

- ✅ **100% GRATUIT** pour toujours (3GB)
- ✅ PostgreSQL Serverless
- ✅ Branching (comme Git pour votre DB!)
- ✅ Auto-scaling to zero
- ✅ Backups automatiques
- ✅ Connection pooling inclus
- ✅ Compatible PostgreSQL 16

## Déploiement (5 minutes)

### Étape 1: Créer compte

1. Aller sur https://neon.tech
2. **Sign Up** avec GitHub
3. Autoriser Neon

### Étape 2: Créer projet

1. Cliquer **Create a project**
2. Configuration:
   - **Project name**: `bus-senegal`
   - **Postgres version**: 16
   - **Region**: EU Central (Frankfurt) - Proche Sénégal
   - **Compute size**: 0.25 CU (gratuit)
3. Cliquer **Create project**

### Étape 3: Créer database

1. Projet créé automatiquement avec DB `neondb`
2. Ou créer nouvelle DB:
   - **Databases** → **New Database**
   - Name: `bus_senegal_prod`

### Étape 4: Récupérer Connection String

**Dans le Dashboard** :

```
Connection String (avec pooling):
postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require
```

**Copier** :
- Connection string
- Username
- Password
- Host
- Database name

### Étape 5: Tester connexion locale

```bash
# Installer psql si pas déjà fait
brew install postgresql

# Test connexion
psql "postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require"

# Success si vous voyez:
bus_senegal_prod=> 
```

### Étape 6: Initialiser le schéma

**Option 1: Via Spring Boot**

Render.com va automatiquement créer les tables au démarrage avec `spring.jpa.hibernate.ddl-auto=update`

**Option 2: Manuellement**

```bash
# Se connecter
psql "<connection-string>"

# Vérifier tables (après que Backend ait démarré)
\dt

# Voir données
SELECT * FROM company;
```

## Utiliser avec Backend

### Pour Render.com

Dans les variables d'environnement Render :

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
```

### Pour développement local

```bash
# .env local
DATABASE_URL=postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require
```

## Fonctionnalités Avancées (Gratuites)

### Branching (Database Branches)

Créer branches de DB comme Git !

```bash
# Via UI
Branches → Create branch
  Name: development
  Parent: main
```

**Use case**:
- `main` branch → Production
- `development` branch → Dev/Test
- Feature branches → Tests isolés

### Connection Pooling

**Automatique avec Neon !**

Connection pooler endpoint (déjà inclus dans connection string).

### Backups

**Automatiques** :
- Point-in-time recovery
- 7 jours d'historique (tier gratuit)
- 30 jours (tier payant)

## Limites Tier Gratuit

### Inclus (Gratuit ∞)
- ✅ 3GB stockage
- ✅ 1 projet
- ✅ Branches illimitées
- ✅ 100 heures compute/mois
- ✅ Connection pooling
- ✅ Backups 7 jours

### Limites
- ⚠️ 3GB max (largement suffisant pour début)
- ⚠️ 100h compute/mois
  - Auto-suspend après 5 min inactivité
  - Réveil instantané
- ⚠️ 1 projet seulement

**Pour Bus Sénégal**: Parfait pour démarrer ! 🎉

## Monitoring

### Dashboard Neon

- **Operations** : Requêtes SQL en temps réel
- **Branches** : Gérer branches
- **Monitoring** : CPU, RAM, Storage
- **Logs** : Query logs

### Alertes

Settings → **Notifications**
- Storage proche limite
- Compute hours proche limite

## Migration depuis autre PostgreSQL

### Export depuis Docker Compose local

```bash
# Export
docker exec postgres pg_dump -U bus_senegal_user bus_senegal_dev > backup.sql

# Import vers Neon
psql "<neon-connection-string>" < backup.sql
```

### Export depuis Render PostgreSQL

```bash
# Render donne accès pg_dump
pg_dump "<render-external-url>" > backup.sql

# Import Neon
psql "<neon-connection-string>" < backup.sql
```

## Sécurité

### SSL/TLS

**Obligatoire** avec Neon (déjà dans connection string) :
```
?sslmode=require
```

### IP Allowlist (Tier payant only)

Tier gratuit = accessible depuis anywhere (avec password)

### Rotation Password

Settings → **Reset password**

## Scaling

### Gratuit → Payant

Quand vous dépassez 3GB :

**Launch Plan**: $19/mois
- 10GB stockage
- Autoscaling
- 300h compute
- Backups 30 jours
- Support

## Troubleshooting

### "Connection refused"

Vérifier :
- `sslmode=require` dans connection string
- Firewall pas bloqué
- Username/password corrects

### "Out of compute hours"

Tier gratuit = 100h/mois

Solutions :
- Activer auto-suspend (déjà activé)
- Upgrade vers Launch plan
- Utiliser moins

### Tables pas créées

Vérifier :
- `spring.jpa.hibernate.ddl-auto=update` dans application.yml
- Logs Backend Render
- Connection string correcte

## Alternatives Gratuites

Si Neon ne convient pas :

1. **Supabase** : 500MB gratuit, inclut Auth
2. **CockroachDB** : 10GB gratuit, compatible PostgreSQL
3. **PlanetScale** : 5GB gratuit, MySQL
4. **Render PostgreSQL** : 1GB gratuit 90 jours

## Conclusion

**PostgreSQL déployé en 5 minutes, GRATUITEMENT, POUR TOUJOURS !**

Connection String: `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod`

**Next**: Utiliser cette DB avec votre Backend Render.com

