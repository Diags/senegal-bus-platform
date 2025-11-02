# 🌐 URLs de Production - Bus Sénégal Platform

## Statut du Déploiement

- [ ] PostgreSQL déployé sur Neon.tech
- [ ] Backend déployé sur Render.com
- [ ] Frontend déployé sur Vercel
- [ ] CORS configuré
- [ ] Tests passés

---

## URLs de Production

### Frontend (Vercel)
- **URL principale** : `https://<a-completer>.vercel.app`
- **Status** : ⏳ En attente de déploiement
- **Dashboard** : https://vercel.com/dashboard

### Backend API (Render.com)
- **URL API** : `https://bus-senegal-backend.onrender.com`
- **Swagger UI** : `https://bus-senegal-backend.onrender.com/swagger-ui.html`
- **Health Check** : `https://bus-senegal-backend.onrender.com/actuator/health`
- **Status** : ⏳ En attente de déploiement
- **Dashboard** : https://dashboard.render.com/

### Base de Données (Neon.tech)
- **Provider** : Neon.tech PostgreSQL Serverless
- **Region** : EU Central (Frankfurt)
- **Database** : `bus_senegal_prod`
- **Status** : ⏳ En attente de création
- **Dashboard** : https://console.neon.tech/

---

## Informations de Connexion

### PostgreSQL (Neon)
```
Host: <a-recuperer-depuis-neon>
Port: 5432
Database: bus_senegal_prod
Username: <a-recuperer>
Password: <a-recuperer>
SSL Mode: require

Connection String (JDBC):
jdbc:postgresql://<host>/bus_senegal_prod?sslmode=require

Connection String (psql):
postgresql://<username>:<password>@<host>/bus_senegal_prod?sslmode=require
```

**⚠️ NE PAS COMMITTER LES VRAIES CREDENTIALS ⚠️**

---

## Variables d'Environnement

### Backend (Render.com)
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<neon-host>/bus_senegal_prod?sslmode=require
SPRING_DATASOURCE_USERNAME=<neon-username>
SPRING_DATASOURCE_PASSWORD=<neon-password>
CORS_ALLOWED_ORIGINS=https://<vercel-url>.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://bus-senegal-backend.onrender.com
NEXTAUTH_URL=https://<vercel-url>.vercel.app
NEXTAUTH_SECRET=<genere-avec-openssl>
```

---

## Endpoints API Principaux

### Public
- `GET /api/trips/search` - Rechercher des trajets
- `GET /api/companies` - Liste des compagnies
- `POST /api/bookings` - Créer une réservation

### Authentifié
- `GET /api/bookings/{id}` - Détails réservation
- `POST /api/payments/initiate` - Initier un paiement
- `GET /api/dashboard/analytics` - Analytics

### Admin
- `GET /api/admin/companies` - Gérer compagnies
- `GET /api/admin/analytics/global` - Métriques globales
- `POST /api/admin/subscriptions` - Gérer abonnements

**Documentation complète** : `https://bus-senegal-backend.onrender.com/swagger-ui.html`

---

## Monitoring & Logs

### Render.com (Backend)
- **Logs** : Dashboard → Service → Logs (temps réel)
- **Metrics** : Dashboard → Service → Metrics (CPU, RAM, requests)

### Vercel (Frontend)
- **Deployments** : Dashboard → Deployments
- **Analytics** : Dashboard → Analytics (si activé)
- **Logs** : Dashboard → Deployments → Logs

### Neon.tech (Database)
- **Monitoring** : Console → Project → Monitoring
- **Query Log** : Console → Project → Queries

### UptimeRobot (Optionnel)
- **URL** : https://uptimerobot.com
- **Monitor** : `https://bus-senegal-backend.onrender.com/actuator/health`
- **Interval** : 14 minutes (évite sleep)

---

## Domaines Personnalisés (Optionnel)

### Frontend
```
Domaine souhaité: bus-senegal.sn
DNS CNAME: cname.vercel-dns.com
Status: ⏳ À configurer
```

### Backend
```
Domaine souhaité: api.bus-senegal.sn
DNS CNAME: bus-senegal-backend.onrender.com
Status: ⏳ À configurer
```

---

## Sécurité

- ✅ SSL/TLS automatique (Vercel + Render + Neon)
- ✅ HTTPS partout
- ✅ Secrets stockés dans variables d'environnement
- ✅ PostgreSQL avec SSL required
- ✅ CORS configuré strictement

---

## Coûts

### Actuel (Tier Gratuit)
- **Neon.tech** : $0/mois (3GB, gratuit ∞)
- **Render.com** : $0/mois (gratuit 90j, puis app sleep)
- **Vercel** : $0/mois (gratuit ∞)

**Total** : **$0/mois**

### Après 90 jours (Options)
1. **Rester gratuit** : $0/mois (app sleep Render après 15min)
2. **Upgrade Render** : $7/mois (pas de sleep)
3. **Migration Oracle Cloud** : $0/mois (gratuit ∞)

---

## Checklist de Déploiement

### Préparation
- [x] Code sur GitHub
- [x] Guides de déploiement créés
- [x] Scripts helper créés

### Neon.tech
- [ ] Compte créé
- [ ] Projet `bus-senegal` créé
- [ ] Database `bus_senegal_prod` créée
- [ ] Connection string récupérée

### Render.com
- [ ] Compte créé
- [ ] Web Service créé
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Health check OK

### Vercel
- [ ] Compte créé
- [ ] Projet importé
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Site accessible

### Connexion
- [ ] CORS configuré
- [ ] Frontend peut appeler Backend
- [ ] Tests passés

### Optionnel
- [ ] UptimeRobot configuré
- [ ] Vercel Analytics activé
- [ ] Domaines personnalisés configurés

---

## Contact & Support

**Repository** : https://github.com/Diags/senegal-bus-platform

**Documentation** :
- Guide complet : `DEPLOYMENT_GUIDE_STEP_BY_STEP.md`
- Quick start : `DEPLOY_FREE_QUICKSTART.md`
- Vercel : `docs/DEPLOY_VERCEL.md`
- Render : `docs/DEPLOY_RENDER.md`
- Neon : `docs/DEPLOY_NEON.md`

---

**Dernière mise à jour** : 2025-11-02  
**Statut global** : ⏳ Prêt pour déploiement

