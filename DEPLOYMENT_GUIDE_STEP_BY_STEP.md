# 🚀 Guide de Déploiement ÉTAPE PAR ÉTAPE

## Vue d'ensemble

Ce guide vous accompagne pour déployer **GRATUITEMENT** la plateforme Bus Sénégal sur :
- **Neon.tech** : PostgreSQL (gratuit ∞)
- **Render.com** : Backend Spring Boot (gratuit 90j)
- **Vercel** : Frontend Next.js (gratuit ∞)

**Temps total estimé** : 30-40 minutes  
**Coût** : $0/mois

---

## Prérequis ✅

- [x] Code poussé sur GitHub : https://github.com/Diags/senegal-bus-platform
- [ ] Compte GitHub actif

---

## ÉTAPE 1 : Générer NEXTAUTH_SECRET (2 min)

### Sur votre terminal local :

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus

# Rendre le script exécutable
chmod +x scripts/generate-nextauth-secret.sh

# Générer le secret
./scripts/generate-nextauth-secret.sh
```

**COPIER** le secret généré, vous en aurez besoin pour Vercel.

---

## ÉTAPE 2 : Créer PostgreSQL sur Neon.tech (5 min)

### 2.1 Créer le compte

1. Aller sur **https://neon.tech**
2. Cliquer **Sign Up**
3. Choisir **Continue with GitHub**
4. Autoriser Neon

### 2.2 Créer le projet

1. Cliquer **Create a project**
2. Remplir :
   - **Project name** : `bus-senegal`
   - **Postgres version** : `16`
   - **Region** : **EU Central (Frankfurt)** (proche Sénégal)
3. Cliquer **Create project**

### 2.3 Récupérer la Connection String

1. Dans le dashboard Neon, vous voyez automatiquement la **Connection String**
2. Sélectionner **Connection string with pooling**
3. **COPIER** la connection string complète :

```
postgresql://username:password@ep-xxx-yyy.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 2.4 Créer la database

```bash
# Se connecter avec psql (installer si nécessaire: brew install postgresql)
psql "postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Dans psql, créer la database
CREATE DATABASE bus_senegal_prod;

# Quitter
\q
```

### 2.5 Noter les informations

**NOTER CES VALEURS** (vous en aurez besoin pour Render) :

```
Host: ep-xxx-yyy.eu-central-1.aws.neon.tech
Database: bus_senegal_prod
Username: <votre-username>
Password: <votre-password>

Connection String JDBC (pour Render):
jdbc:postgresql://ep-xxx-yyy.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require
```

✅ **PostgreSQL configuré !**

---

## ÉTAPE 3 : Déployer Backend sur Render.com (15 min)

### 3.1 Créer le compte

1. Aller sur **https://render.com**
2. Cliquer **Get Started**
3. Choisir **Sign up with GitHub**
4. Autoriser Render

### 3.2 Créer Web Service

1. Dans le dashboard, cliquer **New +** → **Web Service**
2. Cliquer **Build and deploy from a Git repository**
3. Cliquer **Next**
4. Chercher `senegal-bus-platform` dans la liste
5. Cliquer **Connect**

### 3.3 Configurer le service

Remplir le formulaire :

- **Name** : `bus-senegal-backend`
- **Region** : **Frankfurt** (EU Central)
- **Branch** : `main`
- **Root Directory** : `senegal-bus-backend` ⚠️ **TRÈS IMPORTANT**
- **Environment** : **Docker**
- **Dockerfile Path** : `Dockerfile` (auto-détecté)
- **Instance Type** : **Free** ✅

### 3.4 Configurer les variables d'environnement

Cliquer sur **Advanced** puis **Add Environment Variable**.

Ajouter **TOUTES** ces variables (utilisez les valeurs de Neon de l'Étape 2) :

```env
SPRING_PROFILES_ACTIVE=prod

# Database Neon (remplacer par vos vraies valeurs)
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require
SPRING_DATASOURCE_USERNAME=votre-username-neon
SPRING_DATASOURCE_PASSWORD=votre-password-neon

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# Server
SERVER_PORT=8080

# CORS (on mettra à jour après Vercel)
CORS_ALLOWED_ORIGINS=https://*.vercel.app,http://localhost:3000

# Application
APP_URL=https://bus-senegal.vercel.app

# Keycloak (temporaire - désactivé pour l'instant)
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=http://localhost:8180/realms/bus-senegal

# Payment APIs (SANDBOX pour test)
ORANGE_MONEY_MERCHANT_CODE=test
ORANGE_MONEY_API_KEY=test-key
ORANGE_MONEY_API_SECRET=test-secret
WAVE_API_KEY=test-wave-key
WAVE_API_SECRET=test-wave-secret
FREE_MONEY_API_KEY=test-free-key
FREE_MONEY_API_SECRET=test-free-secret
PAYTECH_API_KEY=test-paytech-key
PAYTECH_API_SECRET=test-paytech-secret
```

### 3.5 Déployer

1. Cliquer **Create Web Service**
2. Render va commencer le build (cela prend **5-10 minutes**)
3. Suivre les logs en temps réel
4. Attendre le message **"Live"** ✅

### 3.6 Vérifier le déploiement

Une fois "Live", tester :

```bash
# Remplacer par votre vraie URL Render
curl https://bus-senegal-backend.onrender.com/actuator/health

# Devrait retourner:
# {"status":"UP"}
```

Ou ouvrir dans le navigateur :
```
https://bus-senegal-backend.onrender.com/swagger-ui.html
```

**NOTER L'URL** : `https://bus-senegal-backend.onrender.com`

✅ **Backend déployé !**

---

## ÉTAPE 4 : Déployer Frontend sur Vercel (10 min)

### 4.1 Créer le compte

1. Aller sur **https://vercel.com**
2. Cliquer **Sign Up**
3. Choisir **Continue with GitHub**
4. Autoriser Vercel

### 4.2 Importer le projet

1. Dans le dashboard, cliquer **Add New...** → **Project**
2. Chercher `senegal-bus-platform`
3. Cliquer **Import**

### 4.3 Configurer le projet

- **Framework Preset** : Next.js (auto-détecté) ✅
- **Root Directory** : `bus-senegal-frontend` ⚠️ **TRÈS IMPORTANT**
  - Cliquer **Edit** à côté de Root Directory
  - Sélectionner `bus-senegal-frontend`
- **Build Command** : `npm run build` (auto)
- **Output Directory** : `.next` (auto)

### 4.4 Variables d'environnement

Cliquer **Environment Variables** et ajouter :

```env
# NextAuth (utiliser le secret généré à l'Étape 1)
NEXTAUTH_SECRET=<votre-secret-genere-etape-1>
NEXTAUTH_URL=https://bus-senegal.vercel.app

# Backend API (URL Render de l'Étape 3)
NEXT_PUBLIC_API_URL=https://bus-senegal-backend.onrender.com

# Keycloak (temporaire - pas utilisé pour l'instant)
KEYCLOAK_CLIENT_ID=bus-senegal-frontend
KEYCLOAK_CLIENT_SECRET=temp-secret
KEYCLOAK_ISSUER=http://localhost:8180/realms/bus-senegal
```

**Important** : Pour `NEXTAUTH_URL`, utilisez d'abord `https://bus-senegal.vercel.app`. Vous pourrez l'ajuster après si Vercel vous donne une URL différente.

### 4.5 Déployer

1. Cliquer **Deploy**
2. Attendre 2-3 minutes ⏳
3. **Success!** 🎉

### 4.6 Vérifier l'URL

Vercel va vous donner une URL comme :
- `https://bus-senegal-xxxxxx.vercel.app` (aléatoire)
- Ou `https://senegal-bus-platform.vercel.app`

**NOTER L'URL EXACTE**

### 4.7 Mettre à jour NEXTAUTH_URL (si nécessaire)

Si l'URL est différente de `https://bus-senegal.vercel.app` :

1. Dans Vercel, aller dans **Settings** → **Environment Variables**
2. Modifier `NEXTAUTH_URL` avec la vraie URL
3. **Save**
4. Aller dans **Deployments** → **Redeploy** (avec le menu ⋯)

✅ **Frontend déployé !**

---

## ÉTAPE 5 : Connecter Frontend ↔ Backend (5 min)

### 5.1 Mettre à jour CORS Backend

1. Retourner sur **Render.com**
2. Sélectionner votre service `bus-senegal-backend`
3. Aller dans **Environment**
4. Modifier la variable `CORS_ALLOWED_ORIGINS` :

```env
CORS_ALLOWED_ORIGINS=https://votre-url-vercel-exacte.vercel.app,https://*.vercel.app
```

5. **Save Changes**
6. Render va redéployer automatiquement (2-3 min)

### 5.2 Tester la connexion

```bash
# Ouvrir le frontend
open https://votre-url-vercel.vercel.app

# Naviguer vers "Rechercher un trajet"
# La page devrait charger sans erreurs CORS
```

✅ **Frontend et Backend connectés !**

---

## ÉTAPE 6 : Tests Post-Déploiement (5 min)

### 6.1 Vérifier le Backend

```bash
# Health check
curl https://bus-senegal-backend.onrender.com/actuator/health

# Expected: {"status":"UP"}

# Swagger
open https://bus-senegal-backend.onrender.com/swagger-ui.html
```

### 6.2 Vérifier le Frontend

1. Ouvrir : `https://votre-url-vercel.vercel.app`
2. Vérifier que la page d'accueil charge
3. Essayer de naviguer (trajets, réservations, etc.)
4. Ouvrir la console navigateur (F12) → pas d'erreurs CORS

### 6.3 Vérifier la Base de Données

```bash
# Se connecter à Neon
psql "votre-connection-string-neon"

# Vérifier les tables créées par Spring Boot
\dt

# Devrait lister: company, trip, booking, payment, etc.
```

✅ **Tout fonctionne !**

---

## ÉTAPE 7 : Configuration Finale (Optionnel)

### 7.1 Configurer un domaine personnalisé (Gratuit)

**Sur Vercel** :
1. Settings → Domains → Add Domain
2. Entrer : `bus-senegal.sn` ou `app.yourdomain.com`
3. Configurer DNS selon instructions Vercel
4. SSL automatique ! ✅

**Sur Render** :
1. Settings → Custom Domains
2. Ajouter : `api.bus-senegal.sn`
3. Configurer CNAME DNS
4. SSL automatique ! ✅

### 7.2 Éviter que Render "dorme" (Gratuit)

Le tier gratuit Render met l'app en sleep après 15 min d'inactivité.

**Solution : UptimeRobot** (gratuit)

1. Aller sur **https://uptimerobot.com**
2. Sign up gratuit
3. **Add New Monitor** :
   - Type: HTTP(s)
   - URL: `https://bus-senegal-backend.onrender.com/actuator/health`
   - Monitoring Interval: **14 minutes**
4. **Create Monitor**

Votre backend ne dormira jamais ! 🎉

### 7.3 Activer Vercel Analytics (Gratuit)

1. Dans Vercel, aller dans **Analytics**
2. Cliquer **Enable**
3. Voir le trafic, performance, erreurs en temps réel

---

## 📊 RÉSULTAT FINAL

### URLs de Production

- ✅ **Frontend** : https://votre-url.vercel.app
- ✅ **Backend API** : https://bus-senegal-backend.onrender.com
- ✅ **Swagger UI** : https://bus-senegal-backend.onrender.com/swagger-ui.html
- ✅ **PostgreSQL** : Neon.tech (sécurisé via connection string)

### Coût

- **Neon.tech** : $0/mois (gratuit ∞, 3GB)
- **Render.com** : $0/mois (gratuit 90j, puis app sleep après 15min)
- **Vercel** : $0/mois (gratuit ∞)

**Total** : **$0/mois** 🎉

### Auto-Deploy

✅ Déjà configuré ! Push sur `main` → deploy auto sur Render + Vercel

---

## 🎉 FÉLICITATIONS !

Votre plateforme **Bus Sénégal** est maintenant **EN PRODUCTION** !

### Prochaines étapes

1. **Ajouter des données de test** (compagnies, trajets)
2. **Inviter utilisateurs beta**
3. **Configurer Auth0 ou Keycloak** pour l'authentification réelle
4. **Configurer vrais comptes marchands** (Orange Money, Wave) pour les paiements

### Support

- Documentation complète : Voir `docs/`
- Guides détaillés : `DEPLOY_VERCEL.md`, `DEPLOY_RENDER.md`, `DEPLOY_NEON.md`
- Quick start : `DEPLOY_FREE_QUICKSTART.md`

---

**Votre application est en ligne et accessible au monde entier ! 🚀🇸🇳**

