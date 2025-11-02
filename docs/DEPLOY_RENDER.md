# Déploiement Backend sur Render.com - GRATUIT 90 jours

## Pourquoi Render ?

- ✅ **GRATUIT** pendant 90 jours (750h/mois)
- ✅ PostgreSQL gratuit inclus (90 jours)
- ✅ Déploiement depuis GitHub automatique
- ✅ SSL/TLS automatique
- ✅ Logs en temps réel
- ✅ Environment variables sécurisées
- ✅ Support Docker natif

## Prérequis

- Compte GitHub avec repository poussé
- Code déjà sur GitHub : `github.com/Diags/senegal-bus-platform`

## Déploiement en 10 minutes

### Étape 1: Créer compte Render

1. Aller sur https://render.com
2. Cliquer **Get Started**
3. **Sign up with GitHub**
4. Autoriser Render à accéder à vos repos

### Étape 2: Créer PostgreSQL Database

1. Dashboard → **New +** → **PostgreSQL**
2. Configuration:
   - **Name**: `bus-senegal-db`
   - **Database**: `bus_senegal_prod`
   - **User**: `bus_senegal_user`
   - **Region**: Frankfurt (proche Sénégal) ou Oregon
   - **Plan**: **Free** ✅
3. Cliquer **Create Database**
4. Attendre 1-2 minutes
5. **Important**: Noter ces informations :
   - **Internal Database URL** (pour Backend)
   - **External Database URL** (pour accès local)
   - **Username** & **Password**

### Étape 3: Créer Web Service Backend

1. Dashboard → **New +** → **Web Service**
2. Cliquer **Build and deploy from a Git repository**
3. **Connect a repository**:
   - Chercher `senegal-bus-platform`
   - Cliquer **Connect**

4. **Configuration**:
   - **Name**: `bus-senegal-backend`
   - **Region**: Frankfurt ou Oregon (même que DB)
   - **Branch**: `main`
   - **Root Directory**: `senegal-bus-backend` ⚠️ IMPORTANT
   - **Environment**: **Docker** ✅
   - **Dockerfile Path**: `Dockerfile` (auto-détecté)
   - **Docker Build Context**: `.` (auto)
   - **Instance Type**: **Free** ✅

5. Cliquer **Advanced** → **Add Environment Variables**

### Étape 4: Variables d'Environnement

Ajouter toutes ces variables :

```env
# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Database (depuis Step 2)
SPRING_DATASOURCE_URL=<Internal Database URL from Step 2>
SPRING_DATASOURCE_USERNAME=bus_senegal_user
SPRING_DATASOURCE_PASSWORD=<password from Step 2>

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update

# Server
SERVER_PORT=8080

# CORS (Frontend Vercel URL)
CORS_ALLOWED_ORIGINS=https://bus-senegal.vercel.app,https://*.vercel.app

# Keycloak (à configurer après Keycloak déployé)
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=https://bus-senegal-keycloak.onrender.com/realms/bus-senegal

# Application URL
APP_URL=https://bus-senegal.vercel.app

# Payment Providers (Mode SANDBOX pour test)
ORANGE_MONEY_MERCHANT_CODE=test
ORANGE_MONEY_API_KEY=test-key
WAVE_API_KEY=test-key
FREE_MONEY_API_KEY=test-key
PAYTECH_API_KEY=test-key
```

### Étape 5: Déployer

1. Cliquer **Create Web Service**
2. Render va :
   - Clone le repository
   - Build l'image Docker
   - Déployer l'application
3. **Attendre 5-10 minutes** ⏳ (premier build est long)
4. Voir les logs en temps réel dans le dashboard

### Étape 6: Vérifier le déploiement

```bash
# Health check
curl https://bus-senegal-backend.onrender.com/actuator/health

# Swagger UI
open https://bus-senegal-backend.onrender.com/swagger-ui.html
```

**Expected Response**:
```json
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"},
    "ping": {"status": "UP"}
  }
}
```

## Option: Déploiement via render.yaml (Infrastructure as Code)

### Créer render.yaml à la racine

**Fichier: `render.yaml`** (déjà créé ✅)

```yaml
databases:
  - name: bus-senegal-db
    databaseName: bus_senegal_prod
    user: bus_senegal_user
    plan: free

services:
  - type: web
    name: bus-senegal-backend
    runtime: docker
    dockerfilePath: ./senegal-bus-backend/Dockerfile
    dockerContext: ./senegal-bus-backend
    plan: free
    healthCheckPath: /actuator/health
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: SPRING_DATASOURCE_URL
        fromDatabase:
          name: bus-senegal-db
          property: connectionString
```

### Déployer avec render.yaml

1. Dashboard → **New +** → **Blueprint**
2. Connect repository
3. Select `render.yaml`
4. **Apply**

Render va créer automatiquement DB + Backend ! 🎉

## Post-Déploiement

### Obtenir l'URL

```
https://bus-senegal-backend.onrender.com
```

### Mettre à jour Frontend

Dans Vercel, ajouter/modifier :
```env
NEXT_PUBLIC_API_URL=https://bus-senegal-backend.onrender.com
```

Redéployer Frontend.

## Limitations du Tier Gratuit

### Inclus (Gratuit 90 jours)
- ✅ 512MB RAM
- ✅ CPU partagé
- ✅ SSL automatique
- ✅ 100GB bandwidth/mois
- ✅ PostgreSQL 1GB
- ✅ Déploiement automatique

### Limitations
- ⚠️ **Apps s'arrêtent après 15 min d'inactivité**
  - Redémarrage: 30-60 secondes (lent)
  - Première requête lente
- ⚠️ PostgreSQL expire après 90 jours
  - Migration vers Neon.tech recommandée
- ⚠️ 750 heures/mois (31 jours = 744h)
  - Suffit pour 1 app tournant 24/7

## Monitoring

### Logs en temps réel

Dashboard → Your Service → **Logs** (temps réel)

### Métriques

Dashboard → Your Service → **Metrics**
- CPU
- RAM
- Requests/sec
- Response time

### Alertes

Settings → **Notifications**
- Deploy success/failure
- Service health

## Domaine Personnalisé

### Ajouter votre domaine

1. Service → **Settings** → **Custom Domains**
2. **Add Custom Domain**: `api.bus-senegal.sn`
3. Configurer DNS:

```
Type: CNAME
Name: api
Value: bus-senegal-backend.onrender.com
```

4. Attendre propagation
5. SSL automatique activé ! ✅

## Déployer Keycloak (Optionnel)

### Nouveau Web Service

1. **New +** → **Web Service**
2. **Public Git repository**: `quay.io/keycloak/keycloak:23.0`
3. Ou utiliser Docker:
   - Connect GitHub
   - Root: `keycloak/`
   - Dockerfile: `Dockerfile.production`

4. Variables:
```env
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<strong-password>
KC_DB=postgres
KC_DB_URL=<database-url>
KC_HOSTNAME_STRICT=false
KC_HTTP_ENABLED=true
```

URL: `https://bus-senegal-keycloak.onrender.com`

## Après 90 jours (Migration)

### Option 1: Migrer DB vers Neon.tech

1. Créer DB sur Neon (gratuit ∞)
2. Export data depuis Render:
```bash
pg_dump $DATABASE_URL > backup.sql
```
3. Import vers Neon:
```bash
psql $NEON_DATABASE_URL < backup.sql
```
4. Mettre à jour `SPRING_DATASOURCE_URL`

### Option 2: Passer au plan payant Render

$7/mois pour backend + $7/mois pour PostgreSQL = $14/mois

### Option 3: Migrer vers Oracle Cloud Free

Voir `DEPLOY_ORACLE_FREE.md`

## Troubleshooting

### Build échoue

**Erreur commune**: `docker: not found`
- Vérifier Dockerfile existe dans `senegal-bus-backend/`
- Vérifier Root Directory = `senegal-bus-backend`

### Service ne démarre pas

Vérifier logs:
- Database connection OK ?
- Variables d'environnement correctes ?
- Port 8080 exposé dans Dockerfile ?

### App est lente

**Normal pour tier gratuit !**
- App s'endort après 15 min
- Première requête = 30-60s (cold start)
- Solutions:
  - Uptime monitor (ping toutes les 14 min)
  - Passer au plan payant ($7/mois)

## Uptime Monitoring (Éviter Sleep)

### UptimeRobot (Gratuit)

1. https://uptimerobot.com
2. New Monitor:
   - Type: HTTP(s)
   - URL: `https://bus-senegal-backend.onrender.com/actuator/health`
   - Interval: **14 minutes**
3. Save

Votre app ne s'endormira jamais ! 🎉

## Coût

**Gratuit pendant 90 jours**, puis :
- Continuer gratuit avec migration DB
- Ou $7-14/mois pour plan payant

## Conclusion

**Backend déployé en 10 minutes, GRATUITEMENT !**

URL: `https://bus-senegal-backend.onrender.com`

**Next**: Connecter Frontend (Vercel) au Backend (Render)

