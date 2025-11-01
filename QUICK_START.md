# 🚀 Bus Sénégal - Démarrage Rapide

**Temps estimé** : 5 minutes ⏱️

---

## ✅ Étape 1 : Vérifier les prérequis

```bash
# Vérifier Docker
docker --version
# Attendu: Docker version 20.10+

# Vérifier Docker Compose
docker-compose --version
# Attendu: Docker Compose version 2.0+
```

❌ **Pas installé ?** → [Installer Docker](https://docs.docker.com/get-docker/)

---

## ✅ Étape 2 : Cloner le projet

```bash
git clone https://github.com/votre-repo/senegal_bus.git
cd senegal_bus
```

---

## ✅ Étape 3 : Configurer l'environnement

```bash
# Copier le fichier d'exemple
cp env.example .env

# (Optionnel) Éditer les variables
nano .env
```

💡 **Note** : Les valeurs par défaut fonctionnent pour le développement local.

---

## ✅ Étape 4 : Démarrer tous les services

```bash
./scripts/start.sh
```

### Ce qui se passe :
1. ⏳ Démarrage de PostgreSQL (~5s)
2. ⏳ Démarrage de Keycloak (~30s)
3. ⏳ Démarrage du Backend (~40s)
4. ✅ Tous les services sont prêts !

**Durée totale** : ~2-3 minutes au premier démarrage

---

## ✅ Étape 5 : Vérifier que tout fonctionne

### Backend API
```bash
curl http://localhost:8080/actuator/health
```
**Attendu** : `{"status":"UP"}`

### Keycloak
```bash
curl http://localhost:8180/health/ready
```
**Attendu** : `200 OK`

### Swagger UI
Ouvrir dans le navigateur : http://localhost:8080/swagger-ui.html

---

## 🎯 Étape 6 : Tester l'application

### 1. Accéder à Keycloak Admin
- URL : http://localhost:8180
- Username : `admin`
- Password : `admin`

### 2. Tester l'API avec Swagger
- URL : http://localhost:8080/swagger-ui.html
- Cliquer sur "Authorize"
- Utiliser un compte de test (voir ci-dessous)

### 3. Comptes de test

| Email | Password | Rôle | Accès |
|-------|----------|------|-------|
| client@test.com | password123 | CLIENT | Recherche, réservation |
| compagnie@test.com | password123 | COMPAGNIE | Dashboard compagnie |
| admin@test.com | admin123 | ADMIN | Dashboard admin |

---

## 🎨 Étape 7 : Démarrer le Frontend (optionnel)

```bash
cd bus-senegal-frontend

# Installer les dépendances
npm install

# Démarrer en mode dev
npm run dev
```

Frontend accessible sur : http://localhost:3000

---

## 🛠️ Commandes utiles

### Voir les logs
```bash
# Logs d'un service
./scripts/logs.sh backend
./scripts/logs.sh keycloak
./scripts/logs.sh postgres

# Tous les logs
docker-compose logs -f
```

### Arrêter les services
```bash
./scripts/stop.sh
```

### Redémarrer
```bash
./scripts/stop.sh
./scripts/start.sh
```

### Reset complet (⚠️ Supprime toutes les données)
```bash
./scripts/reset.sh
```

---

## 🌐 URLs d'accès

| Service | URL | Credentials |
|---------|-----|-------------|
| **Backend API** | http://localhost:8080 | - |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | - |
| **Keycloak Admin** | http://localhost:8180 | admin / admin |
| **PostgreSQL** | localhost:5432 | postgres / postgres |
| **Frontend** | http://localhost:3000 | - |

---

## 🐛 Problèmes courants

### Problème : "Port already in use"

**Solution** :
```bash
# Trouver le processus
lsof -i :8080
lsof -i :8180
lsof -i :5432

# Tuer le processus
kill -9 <PID>
```

### Problème : "Keycloak ne démarre pas"

**Solution** :
```bash
# Voir les logs
./scripts/logs.sh keycloak

# Redémarrer Keycloak
docker-compose restart keycloak
```

### Problème : "Backend ne démarre pas"

**Solution** :
```bash
# Voir les logs
./scripts/logs.sh backend

# Rebuild le backend
docker-compose up -d --build backend
```

### Problème : "Tout est cassé"

**Solution** : Reset complet
```bash
./scripts/reset.sh
./scripts/start.sh
```

---

## 📚 Documentation complète

Pour plus de détails, consultez :

- **[README.md](README.md)** : Vue d'ensemble du projet
- **[INFRASTRUCTURE.md](INFRASTRUCTURE.md)** : Guide complet d'infrastructure
- **[PHASE_A_COMPLETE.md](PHASE_A_COMPLETE.md)** : Documentation Frontend
- **[PHASE_B_COMPLETE.md](PHASE_B_COMPLETE.md)** : Documentation Infrastructure
- **[PHASE_C_COMPLETE.md](PHASE_C_COMPLETE.md)** : Intégrations paiements

---

## ✅ Checklist de démarrage

- [ ] Docker et Docker Compose installés
- [ ] Projet cloné
- [ ] Fichier `.env` créé
- [ ] `./scripts/start.sh` exécuté avec succès
- [ ] Backend accessible (http://localhost:8080)
- [ ] Keycloak accessible (http://localhost:8180)
- [ ] Swagger UI accessible (http://localhost:8080/swagger-ui.html)
- [ ] Test de connexion avec `client@test.com`

---

## 🎉 Félicitations !

Votre environnement Bus Sénégal est prêt ! 🚀

**Prochaines étapes** :
1. Explorer l'API avec Swagger UI
2. Tester les endpoints avec les comptes de test
3. Démarrer le frontend (optionnel)
4. Lire la documentation complète

---

**Besoin d'aide ?**
- 📖 Documentation : [INFRASTRUCTURE.md](INFRASTRUCTURE.md)
- 🐛 Issues : [GitHub Issues](https://github.com/votre-repo/issues)
- 📧 Email : support@bus-senegal.com

---

**Bon développement ! 🚀**

