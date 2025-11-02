# 🚀 Déploiement GRATUIT en 30 Minutes - Bus Sénégal

## Vue d'ensemble

Déployer la plateforme Bus Sénégal **ENTIÈREMENT GRATUITEMENT** en utilisant :
- **Vercel** : Frontend (gratuit ∞)
- **Render.com** : Backend (gratuit 90j)
- **Neon.tech** : PostgreSQL (gratuit ∞, 3GB)
- **Auth0** : Authentification (gratuit, 7000 users)

**Coût total** : **$0/mois** 🎉

---

## Prérequis (5 min)

### 1. Pousser le code sur GitHub

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus

# Si pas encore fait
git remote add origin https://github.com/Diags/senegal-bus-platform.git
git push -u origin main
```

### 2. Créer les comptes (gratuits)

- ✅ GitHub : github.com/Diags (déjà fait)
- ✅ Vercel : https://vercel.com (Sign up with GitHub)
- ✅ Render : https://render.com (Sign up with GitHub)
- ✅ Neon : https://neon.tech (Sign up with GitHub)
- ✅ Auth0 : https://auth0.com (Sign up gratuit)

**Aucune carte bancaire requise !** 🎉

---

## Étape 1 : PostgreSQL sur Neon (5 min)

### 1.1 Créer projet Neon

1. Aller sur https://neon.tech
2. **Sign Up** avec GitHub
3. **Create a project**:
   - Name: `bus-senegal`
   - Region: **EU Central (Frankfurt)**
   - Postgres version: **16**
4. Cliquer **Create project**

### 1.2 Récupérer connection string

Dans le dashboard Neon :
- Cliquer **Connection string**
- Copier la connection string **avec pooling** :

```
postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**NOTER** :
- ✅ Hostname : `ep-xxx.eu-central-1.aws.neon.tech`
- ✅ Database : `neondb`
- ✅ Username : `username`
- ✅ Password : `password`

### 1.3 Créer database bus_senegal_prod

```bash
# Se connecter
psql "postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Créer database
CREATE DATABASE bus_senegal_prod;

# Quitter
\q
```

**Connection string finale** :
```
postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require
```

✅ **PostgreSQL prêt !** (Gratuit pour toujours, 3GB)

---

## Étape 2 : Backend sur Render.com (10 min)

### 2.1 Créer Web Service

1. Aller sur https://render.com
2. **Sign Up** avec GitHub
3. Dashboard → **New +** → **Web Service**
4. **Build and deploy from a Git repository** → **Next**
5. Connect repository: `Diags/senegal-bus-platform` → **Connect**

### 2.2 Configurer le service

- **Name** : `bus-senegal-backend`
- **Region** : Frankfurt (proche Sénégal)
- **Branch** : `main`
- **Root Directory** : `senegal-bus-backend` ⚠️ IMPORTANT
- **Environment** : **Docker**
- **Dockerfile Path** : `Dockerfile` (auto-détecté)
- **Instance Type** : **Free** ✅

### 2.3 Variables d'environnement

Cliquer **Add Environment Variable** et ajouter :

```env
SPRING_PROFILES_ACTIVE=prod

# Database Neon (de l'Étape 1)
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx.eu-central-1.aws.neon.tech/bus_senegal_prod?sslmode=require
SPRING_DATASOURCE_USERNAME=<neon-username>
SPRING_DATASOURCE_PASSWORD=<neon-password>

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# Server
SERVER_PORT=8080

# CORS (Frontend Vercel - à ajuster après Étape 3)
CORS_ALLOWED_ORIGINS=https://bus-senegal.vercel.app,https://*.vercel.app

# Keycloak (temporaire - à ajuster si vous déployez Keycloak)
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=http://localhost:8180/realms/bus-senegal

# Application
APP_URL=https://bus-senegal.vercel.app

# Paiements (SANDBOX pour test)
ORANGE_MONEY_MERCHANT_CODE=test
ORANGE_MONEY_API_KEY=test-key
ORANGE_MONEY_API_SECRET=test-secret
WAVE_API_KEY=test-key
WAVE_API_SECRET=test-secret
FREE_MONEY_API_KEY=test-key
FREE_MONEY_API_SECRET=test-secret
PAYTECH_API_KEY=test-key
PAYTECH_API_SECRET=test-secret
```

### 2.4 Déployer

1. Cliquer **Create Web Service**
2. Render va :
   - Cloner le repository
   - Build l'image Docker (5-10 min)
   - Déployer l'application
3. **Attendre 5-10 minutes** ⏳

### 2.5 Vérifier le déploiement

URL : `https://bus-senegal-backend.onrender.com`

```bash
# Health check
curl https://bus-senegal-backend.onrender.com/actuator/health

# Devrait retourner:
# {"status":"UP"}

# Swagger UI
open https://bus-senegal-backend.onrender.com/swagger-ui.html
```

✅ **Backend déployé !** (Gratuit 90 jours)

---

## Étape 3 : Frontend sur Vercel (5 min)

### 3.1 Déployer via Vercel Dashboard

1. Aller sur https://vercel.com
2. **Sign Up** avec GitHub
3. **Add New... → Project**
4. **Import** `senegal-bus-platform`
5. Configuration:
   - **Framework** : Next.js (auto-détecté)
   - **Root Directory** : `bus-senegal-frontend` ⚠️
   - **Build Command** : `npm run build` (auto)
   - **Output Directory** : `.next` (auto)

### 3.2 Variables d'environnement

```env
# NextAuth
NEXTAUTH_URL=https://bus-senegal.vercel.app
NEXTAUTH_SECRET=votre-secret-genere-avec-openssl

# Backend (de l'Étape 2)
NEXT_PUBLIC_API_URL=https://bus-senegal-backend.onrender.com

# Keycloak (temporaire - désactiver auth pour test)
KEYCLOAK_CLIENT_ID=bus-senegal-frontend
KEYCLOAK_CLIENT_SECRET=temp-secret
KEYCLOAK_ISSUER=http://localhost:8180/realms/bus-senegal
```

**Générer NEXTAUTH_SECRET** :
```bash
openssl rand -base64 32
```

### 3.3 Déployer

1. Cliquer **Deploy**
2. Attendre 2-3 minutes
3. **Success** ! 🎉

URL : `https://bus-senegal-<random>.vercel.app`

✅ **Frontend déployé !** (Gratuit pour toujours)

---

## Étape 4 : Connecter Frontend ↔ Backend (2 min)

### 4.1 Mettre à jour CORS Backend

Dans Render.com → `bus-senegal-backend` → Environment :

```env
CORS_ALLOWED_ORIGINS=https://bus-senegal-<votre-url>.vercel.app
```

**Redeploy** Backend (bouton Manual Deploy)

### 4.2 Tester la connexion

```bash
# Ouvrir frontend
open https://bus-senegal-<votre-url>.vercel.app

# Chercher des trajets
# Devrait appeler l'API Backend
```

---

## Étape 5 : Auth0 pour Authentification (10 min - Optionnel)

### 5.1 Créer compte Auth0

1. https://auth0.com
2. **Sign Up** (gratuit)
3. Create Application:
   - Name: `Bus Sénégal`
   - Type: **Regular Web Application**

### 5.2 Configurer Application

**Settings** :
- **Allowed Callback URLs** :
  ```
  https://bus-senegal.vercel.app/api/auth/callback/auth0
  ```
- **Allowed Logout URLs** :
  ```
  https://bus-senegal.vercel.app
  ```
- **Allowed Web Origins** :
  ```
  https://bus-senegal.vercel.app
  ```

### 5.3 Récupérer credentials

- ✅ Domain : `your-tenant.eu.auth0.com`
- ✅ Client ID
- ✅ Client Secret

### 5.4 Mettre à jour Frontend Vercel

Variables d'environnement :

```env
AUTH0_DOMAIN=your-tenant.eu.auth0.com
AUTH0_CLIENT_ID=<client-id>
AUTH0_CLIENT_SECRET=<client-secret>
NEXTAUTH_URL=https://bus-senegal.vercel.app
NEXTAUTH_SECRET=<votre-secret>
```

**Redeploy** Frontend

✅ **Authentification prête !** (Gratuit, 7000 users)

---

## Résultat Final

### URLs de Production

- **Frontend** : https://bus-senegal.vercel.app
- **Backend API** : https://bus-senegal-backend.onrender.com
- **Swagger UI** : https://bus-senegal-backend.onrender.com/swagger-ui.html
- **PostgreSQL** : Neon.tech (via connection string)
- **Auth** : Auth0 (votre-tenant.eu.auth0.com)

### Tous les services SSL/TLS activés automatiquement ! ✅

---

## Monitoring Gratuit

### Uptime Monitoring (UptimeRobot)

1. https://uptimerobot.com (gratuit, 50 monitors)
2. **Add New Monitor**:
   - Type: HTTP(s)
   - URL: `https://bus-senegal-backend.onrender.com/actuator/health`
   - Interval: **14 minutes** (évite que Render sleep)
3. **Create**

Votre backend ne s'endormira jamais ! 🎉

### Logs

**Render** : Dashboard → Logs (temps réel)
**Vercel** : Dashboard → Deployments → Logs

### Analytics

**Vercel Analytics** (gratuit) :
- Settings → Analytics → Enable
- Voir trafic, performance, erreurs

---

## Auto-Deploy

**Déjà configuré automatiquement !**

- Push sur `main` → Deploy auto sur Render ET Vercel
- Pull Request → Preview deployment Vercel

---

## Limitations & Solutions

### Backend Render s'endort après 15 min

**Problème** : Première requête lente (30-60s cold start)

**Solutions** :
1. ✅ **UptimeRobot** ping toutes les 14 min (gratuit)
2. Upgrade vers Render plan payant ($7/mois)
3. Migrer vers Oracle Cloud (gratuit ∞)

### PostgreSQL Render expire après 90 jours

**Solution** : Utiliser Neon.tech (gratuit ∞) dès le début ! ✅

### Limite 3GB PostgreSQL Neon

**Solutions** :
1. Nettoyer vieilles données régulièrement
2. Archiver données anciennes
3. Upgrade Neon ($19/mois, 10GB)
4. Migrer vers Oracle Cloud (illimité, gratuit)

---

## Coûts

### Mois 1-3 (90 jours)

- Frontend Vercel : **$0**
- Backend Render : **$0** (free tier)
- PostgreSQL Neon : **$0**
- Auth0 : **$0** (7000 users)

**Total** : **$0/mois** 🎉

### Après 90 jours

**Option 1** : Rester gratuit avec limitations
- Frontend Vercel : $0
- Backend Render : $0 (avec sleep après 15 min)
- PostgreSQL Neon : $0
- Auth0 : $0

**Total** : **$0/mois** (avec app sleep)

**Option 2** : Upgrade Backend seulement
- Frontend Vercel : $0
- Backend Render Starter : $7/mois (pas de sleep)
- PostgreSQL Neon : $0
- Auth0 : $0

**Total** : **$7/mois**

**Option 3** : Migration Oracle Cloud
- Tout sur Oracle Cloud VMs : $0/mois ∞
- Frontend CDN Vercel : $0/mois ∞

**Total** : **$0/mois POUR TOUJOURS** 🎉

---

## Checklist de Déploiement

### Préparation
- [x] Code sur GitHub
- [x] Dockerfiles optimisés
- [x] Tests passent localement

### Neon.tech (PostgreSQL)
- [ ] Compte créé
- [ ] Projet `bus-senegal` créé
- [ ] Database `bus_senegal_prod` créée
- [ ] Connection string récupérée

### Render.com (Backend)
- [ ] Compte créé
- [ ] Web Service créé
- [ ] Root Directory = `senegal-bus-backend`
- [ ] Variables d'environnement configurées
- [ ] Déployement réussi
- [ ] Health check OK

### Vercel (Frontend)
- [ ] Compte créé
- [ ] Projet importé
- [ ] Root Directory = `bus-senegal-frontend`
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Site accessible

### Auth0 (Optionnel)
- [ ] Application créée
- [ ] Callback URLs configurées
- [ ] Credentials récupérées
- [ ] Frontend mis à jour

### Monitoring
- [ ] UptimeRobot configuré (éviter sleep)
- [ ] Vercel Analytics activé
- [ ] Logs vérifiés

---

## Tests Post-Déploiement

### Health Checks

```bash
# Backend
curl https://bus-senegal-backend.onrender.com/actuator/health
# Expected: {"status":"UP"}

# Frontend
curl https://bus-senegal.vercel.app
# Expected: HTML page

# Swagger
open https://bus-senegal-backend.onrender.com/swagger-ui.html
```

### Tests Fonctionnels

1. **Ouvrir frontend** : https://bus-senegal.vercel.app
2. **Rechercher trajets** :
   - Dakar → Saint-Louis
   - Date : Demain
   - Passagers : 2
3. **Vérifier** :
   - Appel API fonctionne
   - Pas d'erreurs CORS
   - Résultats affichés

---

## Dépannage Rapide

### Backend ne répond pas

1. Vérifier logs Render
2. Vérifier variables d'environnement
3. Vérifier Database connection string
4. Redéployer manuellement

### Frontend erreur API

1. Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
2. Vérifier CORS dans Render
3. Vérifier logs Vercel

### Database connection failed

1. Vérifier connection string Neon
2. Vérifier `sslmode=require` présent
3. Vérifier database existe
4. Tester connexion avec `psql`

---

## Prochaines Étapes

### Immédiat
1. ✅ Tester toutes les fonctionnalités
2. ✅ Inviter utilisateurs beta
3. ✅ Collecter feedback

### Court terme (1 semaine)
1. Configurer Auth0 complet
2. Ajouter compagnies de test
3. Tester paiements sandbox
4. Monitoring quotidien

### Moyen terme (1 mois)
1. Migration Oracle Cloud (gratuit ∞)
2. Domaine personnalisé (.sn)
3. Paiements production (vrais comptes marchands)
4. Soft launch beta

---

## Support

### Documentation
- `DEPLOY_VERCEL.md` - Guide détaillé Vercel
- `DEPLOY_RENDER.md` - Guide détaillé Render
- `DEPLOY_NEON.md` - Guide détaillé Neon
- `KUBERNETES_DEPLOYMENT.md` - Pour production avancée

### Liens Utiles
- Render Status : https://status.render.com
- Vercel Status : https://vercel-status.com
- Neon Status : https://neon.tech/status
- Auth0 Status : https://status.auth0.com

---

## 🎉 Conclusion

**Votre plateforme Bus Sénégal est maintenant EN PRODUCTION, GRATUITEMENT !**

- ✅ Frontend : https://bus-senegal.vercel.app
- ✅ Backend : https://bus-senegal-backend.onrender.com
- ✅ PostgreSQL : Neon.tech (3GB gratuit)
- ✅ SSL/TLS : Activé partout
- ✅ Auto-deploy : Depuis GitHub

**Coût** : **$0/mois**

**Temps de déploiement** : **30 minutes**

**Félicitations ! 🚀🇸🇳**

