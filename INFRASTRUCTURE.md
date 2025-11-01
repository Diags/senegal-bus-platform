# 🏗️ Bus Sénégal - Infrastructure & DevOps

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Architecture](#architecture)
4. [Démarrage rapide](#démarrage-rapide)
5. [Services](#services)
6. [Configuration](#configuration)
7. [Scripts utilitaires](#scripts-utilitaires)
8. [Accès aux interfaces](#accès-aux-interfaces)
9. [Troubleshooting](#troubleshooting)
10. [Développement](#développement)

---

## 🎯 Vue d'ensemble

L'infrastructure Bus Sénégal utilise **Docker Compose** pour orchestrer 3 services principaux :

- **PostgreSQL** : Base de données relationnelle
- **Keycloak** : Serveur d'authentification OAuth2/OIDC
- **Backend** : API Spring Boot

Tous les services sont conteneurisés et peuvent être démarrés avec une seule commande.

---

## 📦 Prérequis

### Logiciels requis

- **Docker** : Version 20.10+
- **Docker Compose** : Version 2.0+
- **Git** : Pour cloner le projet

### Vérification

```bash
docker --version
docker-compose --version
```

### Installation Docker

#### macOS
```bash
brew install --cask docker
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Network                          │
│                   (bus-senegal-network)                      │
│                                                               │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐ │
│  │             │      │             │      │             │ │
│  │  PostgreSQL │◄─────┤  Keycloak   │◄─────┤   Backend   │ │
│  │   :5432     │      │   :8180     │      │   :8080     │ │
│  │             │      │             │      │             │ │
│  └─────────────┘      └─────────────┘      └─────────────┘ │
│        │                     │                     │         │
│        │                     │                     │         │
│        ▼                     ▼                     ▼         │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐    │
│  │  Volume  │         │  Volume  │         │   None   │    │
│  │ postgres │         │ keycloak │         │          │    │
│  └──────────┘         └──────────┘         └──────────┘    │
└─────────────────────────────────────────────────────────────┘
         │                     │                     │
         └─────────────────────┴─────────────────────┘
                         Host Machine
                    (localhost:5432, :8180, :8080)
```

### Flux d'authentification

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│ Frontend │────1───►│ Keycloak │         │ Backend  │
│ Next.js  │         │          │         │  API     │
└──────────┘         └──────────┘         └──────────┘
      │                    │                     │
      │                    │                     │
      └────────2───────────┴──────────3──────────┘
      
1. User login → Keycloak
2. JWT Token ← Keycloak
3. API Request with JWT → Backend
```

---

## 🚀 Démarrage rapide

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/senegal_bus.git
cd senegal_bus
```

### 2. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer le fichier .env avec vos valeurs
nano .env
```

### 3. Démarrer tous les services

```bash
./scripts/start.sh
```

Cette commande va :
- ✅ Créer les volumes Docker
- ✅ Démarrer PostgreSQL
- ✅ Démarrer Keycloak
- ✅ Importer le realm Keycloak
- ✅ Démarrer le backend Spring Boot
- ✅ Attendre que tous les services soient prêts

**Durée estimée** : 2-3 minutes au premier démarrage

---

## 🔧 Services

### 1. PostgreSQL

#### Configuration
- **Image** : `postgres:16-alpine`
- **Port** : `5432`
- **Bases de données** :
  - `bus_senegal` : Données de l'application
  - `keycloak` : Données Keycloak
- **Volume** : `postgres_data`

#### Connexion
```bash
docker-compose exec postgres psql -U postgres -d bus_senegal
```

#### Backup
```bash
docker-compose exec postgres pg_dump -U postgres bus_senegal > backup.sql
```

#### Restore
```bash
docker-compose exec -T postgres psql -U postgres bus_senegal < backup.sql
```

---

### 2. Keycloak

#### Configuration
- **Image** : `quay.io/keycloak/keycloak:23.0`
- **Port** : `8180`
- **Mode** : Development (`start-dev`)
- **Realm** : `bus-senegal`
- **Volume** : `keycloak_data`

#### Realm Configuration

##### Clients

1. **backend-api** (Confidential)
   - Client ID : `backend-api`
   - Client Secret : `backend-api-secret-change-me`
   - Service Account : Enabled
   - Direct Access Grants : Enabled

2. **frontend-app** (Public)
   - Client ID : `frontend-app`
   - PKCE : Enabled
   - Redirect URIs : `http://localhost:3000/*`

##### Rôles

- **CLIENT** : Utilisateur final
- **COMPAGNIE** : Gestionnaire de compagnie
- **ADMIN** : Administrateur plateforme

##### Token Mappers

- **tenant_id** : Extrait `companyId` de l'attribut utilisateur
- **roles** : Extrait les rôles Keycloak

##### Utilisateurs de test

| Email | Password | Rôle | Company ID |
|-------|----------|------|------------|
| client@test.com | password123 | CLIENT | - |
| compagnie@test.com | password123 | COMPAGNIE | 1 |
| admin@test.com | admin123 | ADMIN | - |

#### Accès Admin
- URL : http://localhost:8180
- Username : `admin`
- Password : `admin`

---

### 3. Backend Spring Boot

#### Configuration
- **Image** : Custom (build from Dockerfile)
- **Port** : `8080`
- **Profile** : `dev`
- **JDK** : Eclipse Temurin 21

#### Endpoints principaux

##### Actuator
- Health : `GET /actuator/health`
- Metrics : `GET /actuator/metrics`

##### API Documentation
- Swagger UI : `GET /swagger-ui.html`
- OpenAPI JSON : `GET /api-docs`

##### Business API
- Companies : `/api/companies`
- Trips : `/api/trips`
- Bookings : `/api/bookings`
- Payments : `/api/payments`
- Analytics : `/api/analytics`

#### Build local (sans Docker)

```bash
cd senegal-bus-backend
mvn clean package -DskipTests
java -jar target/*.jar
```

---

## ⚙️ Configuration

### Variables d'environnement

Fichier `.env` à la racine du projet :

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=bus_senegal

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Spring Boot
SPRING_PROFILES_ACTIVE=dev
APP_URL=http://localhost:3000

# Payment Providers
ORANGE_MONEY_API_KEY=your-key
WAVE_API_KEY=your-key
FREE_MONEY_API_KEY=your-key
PAYTECH_API_KEY=your-key
```

### Modifier la configuration Keycloak

1. Éditer `keycloak/realm-export.json`
2. Redémarrer Keycloak :
   ```bash
   docker-compose restart keycloak
   ```

### Modifier la configuration Backend

1. Éditer `senegal-bus-backend/src/main/resources/application.yml`
2. Rebuild et redémarrer :
   ```bash
   docker-compose up -d --build backend
   ```

---

## 🛠️ Scripts utilitaires

### start.sh
Démarre tous les services et attend qu'ils soient prêts.

```bash
./scripts/start.sh
```

**Fonctionnalités** :
- Vérifie la présence du fichier `.env`
- Démarre Docker Compose
- Attend que PostgreSQL soit prêt
- Attend que Keycloak soit prêt (max 30 tentatives)
- Attend que le Backend soit prêt (max 30 tentatives)
- Affiche les URLs d'accès

---

### stop.sh
Arrête tous les services proprement.

```bash
./scripts/stop.sh
```

**Note** : Les données sont préservées dans les volumes Docker.

---

### reset.sh
⚠️ **ATTENTION** : Supprime toutes les données !

```bash
./scripts/reset.sh
```

**Supprime** :
- Tous les conteneurs
- Tous les volumes (PostgreSQL + Keycloak)
- Toutes les données

---

### logs.sh
Affiche les logs d'un service spécifique.

```bash
./scripts/logs.sh backend
./scripts/logs.sh keycloak
./scripts/logs.sh postgres
```

**Ou tous les logs** :
```bash
docker-compose logs -f
```

---

## 🌐 Accès aux interfaces

### Backend API
- **URL** : http://localhost:8080
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **Health Check** : http://localhost:8080/actuator/health

### Keycloak Admin Console
- **URL** : http://localhost:8180
- **Username** : `admin`
- **Password** : `admin`
- **Realm** : `bus-senegal`

### PostgreSQL
- **Host** : `localhost`
- **Port** : `5432`
- **Database** : `bus_senegal`
- **Username** : `postgres`
- **Password** : `postgres`

**Client GUI recommandé** : DBeaver, pgAdmin, TablePlus

---

## 🐛 Troubleshooting

### Problème : Les services ne démarrent pas

#### Solution 1 : Vérifier Docker
```bash
docker ps
docker-compose ps
```

#### Solution 2 : Vérifier les logs
```bash
./scripts/logs.sh keycloak
./scripts/logs.sh backend
```

#### Solution 3 : Redémarrer
```bash
./scripts/stop.sh
./scripts/start.sh
```

---

### Problème : Keycloak ne démarre pas

#### Symptômes
- Timeout après 30 tentatives
- Erreur de connexion à PostgreSQL

#### Solutions

1. **Vérifier PostgreSQL**
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

2. **Vérifier les logs Keycloak**
   ```bash
   ./scripts/logs.sh keycloak
   ```

3. **Réinitialiser Keycloak**
   ```bash
   docker-compose stop keycloak
   docker-compose rm -f keycloak
   docker volume rm senegal_bus_keycloak_data
   ./scripts/start.sh
   ```

---

### Problème : Backend ne démarre pas

#### Symptômes
- Erreur de connexion à PostgreSQL
- Erreur de connexion à Keycloak
- Erreur de compilation

#### Solutions

1. **Vérifier les dépendances**
   ```bash
   docker-compose logs backend | grep -i error
   ```

2. **Rebuild le backend**
   ```bash
   docker-compose up -d --build backend
   ```

3. **Vérifier la configuration**
   ```bash
   cat senegal-bus-backend/src/main/resources/application.yml
   ```

---

### Problème : Erreur "Port already in use"

#### Solution
```bash
# Trouver le processus utilisant le port
lsof -i :8080
lsof -i :8180
lsof -i :5432

# Tuer le processus
kill -9 <PID>
```

---

### Problème : Volumes corrompus

#### Solution : Reset complet
```bash
./scripts/reset.sh
./scripts/start.sh
```

---

## 💻 Développement

### Mode développement

#### Backend avec hot reload
```bash
cd senegal-bus-backend
mvn spring-boot:run
```

#### Frontend avec hot reload
```bash
cd bus-senegal-frontend
npm run dev
```

### Tests

#### Backend
```bash
cd senegal-bus-backend
mvn test
```

#### Frontend
```bash
cd bus-senegal-frontend
npm test
```

### Debug

#### Backend (IntelliJ IDEA)
1. Ajouter une configuration "Remote JVM Debug"
2. Port : `5005`
3. Modifier `docker-compose.yml` :
   ```yaml
   backend:
     environment:
       JAVA_OPTS: "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
     ports:
       - "5005:5005"
   ```

---

## 📊 Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:8080/actuator/health

# Keycloak
curl http://localhost:8180/health/ready

# PostgreSQL
docker-compose exec postgres pg_isready -U postgres
```

### Métriques

```bash
# Backend metrics
curl http://localhost:8080/actuator/metrics
```

---

## 🔒 Sécurité

### Production

⚠️ **IMPORTANT** : Avant de déployer en production :

1. **Changer les mots de passe** :
   - PostgreSQL
   - Keycloak admin
   - Keycloak client secrets

2. **Désactiver le mode dev Keycloak** :
   ```yaml
   keycloak:
     command: start --optimized
   ```

3. **Activer HTTPS** :
   - Reverse proxy (Nginx, Traefik)
   - Certificats SSL (Let's Encrypt)

4. **Limiter les accès réseau** :
   - Firewall
   - Security groups

---

## 📚 Ressources

### Documentation officielle
- [Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Keycloak](https://www.keycloak.org/documentation)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Support
- GitHub Issues : [Lien vers votre repo]
- Email : support@bus-senegal.com

---

## ✅ Checklist de démarrage

- [ ] Docker et Docker Compose installés
- [ ] Fichier `.env` créé et configuré
- [ ] Scripts rendus exécutables (`chmod +x scripts/*.sh`)
- [ ] `./scripts/start.sh` exécuté avec succès
- [ ] Backend accessible sur http://localhost:8080
- [ ] Keycloak accessible sur http://localhost:8180
- [ ] Swagger UI accessible sur http://localhost:8080/swagger-ui.html
- [ ] Test de connexion avec `client@test.com / password123`

---

**Bon développement ! 🚀**

