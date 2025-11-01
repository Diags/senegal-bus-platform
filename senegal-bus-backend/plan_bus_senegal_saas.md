
# 🚍 Plan de Développement Complet — Bus Sénégal (Clone FlixBus adapté au Sénégal, version SaaS)

## ☁️ 0.1 Architecture SaaS et modèle multi-tenant

### 🎯 Objectif
Faire de **Bus Sénégal** une **plateforme SaaS** permettant à plusieurs **compagnies de transport** d’utiliser le système avec leurs propres trajets, réservations, paiements et reporting.

### 🧠 Principe général
Chaque compagnie partenaire dispose :
- d’un **espace dédié (tenant)** avec ses bus, trajets et utilisateurs  
- d’un **tableau de bord personnalisé** pour gérer ses opérations  
- d’un **abonnement mensuel ou par transaction**  
- d’un accès via un sous-domaine ou un espace unique (ex. `compagnie.bus-senegal.sn`)  

L’administrateur global (toi) gère :
- les compagnies (création, validation, suspension)
- la facturation (abonnements)
- le reporting global (trafic, revenus, statistiques)

### ⚙️ Architecture SaaS technique

#### Modèle de données multi-tenant
Option 1 : **Colonne “tenant_id”** dans chaque table clé (`bus`, `trajet`, `user`, `booking`)  
→ plus simple à mettre en place pour un MVP.

Option 2 : **Base de données par tenant**
→ plus sécurisé et scalable, adapté à une grande échelle.

#### Gestion des tenants
- Spring Boot : interceptor + contexte “TenantContextHolder”
- Chaque requête contient le `tenant_id` (extrait du token JWT Keycloak)
- Les données sont automatiquement filtrées selon le tenant

#### Authentification & rôles Keycloak
Keycloak gère plusieurs **clients ou realms** :
| Type | Description |
|------|--------------|
| super-admin | accès global au SaaS |
| company-admin | gestion d’une seule compagnie |
| employee | accès partiel (chauffeur, guichetier) |
| customer | utilisateur final (voyageur) |

### 💳 Facturation et abonnements
- Système de **facturation récurrente** (Stripe / PayTech SN / API locale)
- Modèles possibles :
  1. 💼 **Abonnement mensuel fixe** (par compagnie)
  2. 💰 **Commission par réservation** (ex. 2% du prix du billet)
  3. 🧾 **Hybrid model** : abonnement + commission légère
- Back-office : 
  - Gestion des abonnements
  - Tableau de bord des revenus
  - Génération de factures PDF

### 🧩 Modules SaaS supplémentaires
| Module | Description |
|---------|--------------|
| Company Management | CRUD compagnies, plan tarifaire, statistiques |
| Billing Service | gestion abonnements, paiements, factures |
| Analytics Dashboard | indicateurs par compagnie (trajets, revenus, clients) |
| API Partner Portal | endpoints sécurisés pour intégration externe |
| Support & Tickets | assistance technique multi-tenant |

### 🌍 Déploiement SaaS
| Environnement | Spécificité SaaS |
|----------------|----------------|
| Front-end | Déploiement unique (multi-compagnies via token tenant) |
| Back-end | Spring Boot multi-tenant avec context isolé |
| Database | PostgreSQL avec partitionnement ou schémas multiples |
| Auth | Keycloak multi-realm |
| Domaines | `bus-senegal.sn`, `compagnieX.bus-senegal.sn` |
| Monitoring | Logs par tenant (Grafana / Loki) |

### 🔒 Sécurité et conformité
- Isolation stricte des données par `tenant_id`  
- JWT enrichi avec `tenant` et `roles`  
- Audits automatiques (qui a fait quoi, quand)  
- Conformité RGPD simplifiée (données locales, consentement utilisateur)

### 🚀 Bénéfices du modèle SaaS
| Bénéfice | Impact |
|-----------|--------|
| Scalabilité | plusieurs compagnies hébergées sur une seule plateforme |
| Rentabilité | revenus récurrents mensuels |
| Maintenance simplifiée | une seule base de code, mises à jour centralisées |
| Extension facile | ajout futur d’autres pays ou régions africaines |
| Sécurité | Keycloak + isolation des données |
