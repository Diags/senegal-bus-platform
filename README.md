# 🚌 Bus Sénégal - Plateforme de Réservation de Bus

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Plateforme SaaS multi-tenant de réservation de bus au Sénégal, inspirée de FlixBus et adaptée au contexte local.

---

## 🎯 Fonctionnalités

### Pour les clients
- ✅ Recherche de trajets en temps réel
- ✅ Réservation en ligne avec sélection de siège
- ✅ Paiement mobile (Orange Money, Wave, Free Money)
- ✅ E-ticket avec QR Code
- ✅ Historique des réservations
- ✅ Notifications SMS/Email/WhatsApp

### Pour les compagnies
- ✅ Gestion de la flotte de bus
- ✅ Planification des trajets
- ✅ Suivi des réservations en temps réel
- ✅ Statistiques et analytics
- ✅ Gestion des tarifs
- ✅ Dashboard dédié

### Pour les administrateurs
- ✅ Gestion des compagnies
- ✅ Gestion des utilisateurs
- ✅ Analytics globales
- ✅ Suivi des paiements
- ✅ Configuration système
- ✅ Monitoring

---

## 🏗️ Architecture

### Stack Technique

#### Backend
- **Framework** : Spring Boot 3.5.7
- **Langage** : Java 21
- **Base de données** : PostgreSQL 16
- **Authentification** : Keycloak (OAuth2/OIDC)
- **Documentation API** : Springdoc OpenAPI (Swagger)
- **Build** : Maven

#### Frontend
- **Framework** : Next.js 16
- **Langage** : TypeScript
- **Styling** : TailwindCSS
- **Authentification** : NextAuth.js
- **State Management** : React Query (TanStack Query)
- **HTTP Client** : Axios

#### Infrastructure
- **Conteneurisation** : Docker & Docker Compose
- **Base de données** : PostgreSQL
- **Auth Server** : Keycloak

### Architecture Multi-tenant (SaaS)
- Isolation par `tenant_id` (Company ID)
- Gestion des abonnements (TRIAL, BASIC, PREMIUM, ENTERPRISE)
- Facturation automatique
- Sous-domaines par compagnie

---

## 🚀 Démarrage rapide

### Prérequis
- Docker 20.10+
- Docker Compose 2.0+
- Git

### Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-repo/senegal_bus.git
   cd senegal_bus
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp env.example .env
   # Éditer .env avec vos valeurs
   ```

3. **Démarrer tous les services**
   ```bash
   ./scripts/start.sh
   ```

4. **Accéder aux interfaces**
   - Backend API : http://localhost:8080
   - Swagger UI : http://localhost:8080/swagger-ui.html
   - Keycloak : http://localhost:8180 (admin/admin)

### Comptes de test

| Email | Password | Rôle |
|-------|----------|------|
| client@test.com | password123 | CLIENT |
| compagnie@test.com | password123 | COMPAGNIE |
| admin@test.com | admin123 | ADMIN |

---

## 📁 Structure du projet

```
senegal_bus/
├── senegal-bus-backend/        # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/bus/senegal/
│   │       │   ├── model/      # Entités JPA
│   │       │   ├── repository/ # Repositories
│   │       │   ├── service/    # Services métier
│   │       │   ├── controller/ # REST Controllers
│   │       │   ├── dto/        # Data Transfer Objects
│   │       │   ├── config/     # Configurations
│   │       │   ├── exception/  # Gestion des erreurs
│   │       │   └── payment/    # Intégrations paiement
│   │       └── resources/
│   │           └── application.yml
│   ├── pom.xml
│   └── Dockerfile
│
├── bus-senegal-frontend/       # Frontend Next.js
│   ├── app/                    # Pages Next.js 14+
│   ├── components/             # Composants React
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilitaires
│   ├── types/                  # Types TypeScript
│   └── package.json
│
├── keycloak/                   # Configuration Keycloak
│   └── realm-export.json
│
├── postgres/                   # Scripts PostgreSQL
│   └── init-multiple-databases.sh
│
├── scripts/                    # Scripts utilitaires
│   ├── start.sh
│   ├── stop.sh
│   ├── reset.sh
│   └── logs.sh
│
├── docker-compose.yml          # Orchestration Docker
├── env.example                 # Variables d'environnement
├── INFRASTRUCTURE.md           # Documentation infrastructure
└── README.md                   # Ce fichier
```

---

## 📚 Documentation

- **[INFRASTRUCTURE.md](INFRASTRUCTURE.md)** : Guide complet d'infrastructure et DevOps
- **[PHASE_A_COMPLETE.md](PHASE_A_COMPLETE.md)** : Documentation du frontend
- **[PHASE_C_COMPLETE.md](PHASE_C_COMPLETE.md)** : Intégrations paiements
- **[PROJECT_STATUS_FINAL.md](PROJECT_STATUS_FINAL.md)** : État global du projet

---

## 🔧 Développement

### Backend

#### Démarrer en mode dev (sans Docker)
```bash
cd senegal-bus-backend
mvn spring-boot:run
```

#### Lancer les tests
```bash
mvn test
```

#### Build
```bash
mvn clean package
```

### Frontend

#### Démarrer en mode dev
```bash
cd bus-senegal-frontend
npm install
npm run dev
```

#### Build
```bash
npm run build
```

#### Lancer les tests
```bash
npm test
```

---

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` : Connexion (via Keycloak)
- `POST /api/auth/logout` : Déconnexion

### Trajets
- `GET /api/trips/search` : Rechercher des trajets
- `GET /api/trips/{id}` : Détails d'un trajet
- `POST /api/trips` : Créer un trajet (COMPAGNIE)

### Réservations
- `POST /api/bookings` : Créer une réservation
- `GET /api/bookings/my` : Mes réservations
- `GET /api/bookings/{id}` : Détails d'une réservation
- `DELETE /api/bookings/{id}` : Annuler une réservation

### Paiements
- `POST /api/payments/initiate` : Initier un paiement
- `GET /api/payments/{id}` : Statut du paiement
- `POST /api/payments/webhook/{provider}` : Webhook paiement

### Analytics (ADMIN/COMPAGNIE)
- `GET /api/analytics/revenue` : Statistiques de revenus
- `GET /api/analytics/bookings` : Statistiques de réservations
- `GET /api/analytics/trips` : Statistiques de trajets

**Documentation complète** : http://localhost:8080/swagger-ui.html

---

## 💳 Intégrations Paiement

### Providers supportés
- **Orange Money** : Mobile Money Orange
- **Wave** : Paiement mobile Wave
- **Free Money** : Mobile Money Free
- **PayTech** : Agrégateur local (fallback)

### Configuration
Voir `env.example` pour les clés API nécessaires.

---

## 🛠️ Scripts utilitaires

```bash
# Démarrer tous les services
./scripts/start.sh

# Arrêter tous les services
./scripts/stop.sh

# Réinitialiser toutes les données
./scripts/reset.sh

# Voir les logs d'un service
./scripts/logs.sh backend
./scripts/logs.sh keycloak
./scripts/logs.sh postgres
```

---

## 🐛 Troubleshooting

### Problème : Les services ne démarrent pas
```bash
docker-compose ps
./scripts/logs.sh backend
```

### Problème : Port déjà utilisé
```bash
lsof -i :8080
lsof -i :8180
lsof -i :5432
```

### Problème : Reset complet nécessaire
```bash
./scripts/reset.sh
./scripts/start.sh
```

**Documentation complète** : Voir [INFRASTRUCTURE.md](INFRASTRUCTURE.md)

---

## 📊 Statut du projet

| Phase | Statut | Progression |
|-------|--------|-------------|
| Backend Spring Boot | ✅ Terminé | 100% |
| SaaS Multi-tenant | ✅ Terminé | 100% |
| Intégrations Paiements | ✅ Terminé | 100% |
| Frontend Next.js | ✅ Terminé | 100% |
| Infrastructure Docker | ✅ Terminé | 100% |
| Tests | ⏳ À faire | 0% |
| Déploiement | ⏳ À faire | 0% |

**Progression globale** : **90%** 🎉

---

## 🗺️ Roadmap

### Court terme (1-2 semaines)
- [ ] Tests automatisés (Backend + Frontend)
- [ ] CI/CD avec GitHub Actions
- [ ] Déploiement en staging

### Moyen terme (1 mois)
- [ ] Beta testing avec compagnies pilotes
- [ ] Optimisations de performance
- [ ] Monitoring et alertes

### Long terme (3-6 mois)
- [ ] Application mobile (React Native)
- [ ] Tracking GPS des bus en temps réel
- [ ] Programme de fidélité
- [ ] Multi-langue (Wolof, Français, Anglais)
- [ ] API publique pour partenaires

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

- **Développeur Principal** : [Votre nom]
- **Email** : contact@bus-senegal.com
- **GitHub** : [Lien vers votre profil]

---

## 🙏 Remerciements

- Spring Boot Team
- Next.js Team
- Keycloak Team
- La communauté open source

---

**Fait avec ❤️ au Sénégal 🇸🇳**

