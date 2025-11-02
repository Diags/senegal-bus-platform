# ⚡ COMMANDES RAPIDES - Déploiement Bus Sénégal

## 🎯 Pour déployer EN PRODUCTION (Option 1 recommandée)

### Étape 1 : Générer NEXTAUTH_SECRET

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus
./scripts/generate-nextauth-secret.sh
```

**📋 COPIER** le secret généré (vous en aurez besoin pour Vercel)

---

### Étape 2 : Ouvrir les guides

```bash
# Guide de démarrage
open START_DEPLOYMENT.md

# Ou directement le guide complet
open DEPLOYMENT_GUIDE_STEP_BY_STEP.md
```

---

### Étape 3 : Suivre le guide !

Le guide vous accompagnera pour :

1. **Créer PostgreSQL sur Neon.tech** (5 min)
   - Sign up with GitHub
   - Créer projet `bus-senegal`
   - Récupérer connection string

2. **Déployer Backend sur Render.com** (15 min)
   - Sign up with GitHub
   - Créer Web Service depuis GitHub repo
   - Configurer variables d'environnement
   - Attendre le build

3. **Déployer Frontend sur Vercel** (10 min)
   - Sign up with GitHub
   - Importer projet depuis GitHub
   - Configurer variables d'environnement
   - Deploy !

4. **Vérifier** (5 min)
   - Tester backend health check
   - Ouvrir Swagger UI
   - Tester frontend
   - Vérifier connexion

**Total** : 40 minutes → Votre app sera EN LIGNE ! 🌍

---

## ⚙️ Pour tester EN LOCAL (Option 2)

### Avec Docker Compose

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus

# Démarrer tous les services
./scripts/start.sh

# Voir les logs
./scripts/logs.sh

# Arrêter
./scripts/stop.sh

# Reset complet
./scripts/reset.sh
```

**URLs locales** :
- Frontend : http://localhost:3000
- Backend : http://localhost:8080
- Keycloak : http://localhost:8180
- PostgreSQL : localhost:5432

---

### Avec Kubernetes (Kind)

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus

# 1. Setup cluster Kind
./scripts/setup-kind-cluster.sh

# 2. Installer ArgoCD
./scripts/install-argocd.sh

# 3. Déployer l'application
./scripts/deploy-with-argocd.sh

# 4. Port forwarding pour accès
./scripts/port-forward-services.sh
```

**URLs locales** :
- Frontend : http://localhost:3000
- Backend : http://localhost:8080
- Keycloak : http://localhost:8180
- ArgoCD : http://localhost:9090

**Nettoyage** :
```bash
./scripts/teardown.sh
```

---

## 📖 Lire la documentation

```bash
# Résumé complet
open DEPLOYMENT_READY.md

# Prochaines étapes
open NEXT_STEPS.md

# Documentation complète du projet
open PROJET_FINAL_COMPLET.md

# Récap technique
open PROJECT_COMPLETE_FINAL.md
```

---

## 🧪 Lancer les tests

### Backend (Spring Boot)

```bash
cd senegal-bus-backend

# Tests unitaires
./mvnw test

# Tests d'intégration
./mvnw verify

# Avec rapport de couverture
./mvnw clean verify jacoco:report

# Voir rapport
open target/site/jacoco/index.html
```

### Frontend (Next.js)

```bash
cd bus-senegal-frontend

# Tests unitaires (Vitest)
npm run test

# Tests E2E (Playwright)
npm run test:e2e

# Tests E2E en mode UI
npm run test:e2e:ui
```

---

## 🔧 Outils utiles

### Générer secret sécurisé

```bash
./scripts/generate-nextauth-secret.sh
```

### Vérifier le code sur GitHub

```bash
# Ouvrir le repository
open https://github.com/Diags/senegal-bus-platform

# Voir les commits
git log --oneline

# Voir les fichiers
git ls-files

# Statistiques
git log --oneline | wc -l  # Nombre de commits
git ls-files | wc -l       # Nombre de fichiers
```

### Build local (test avant déploiement)

**Backend** :
```bash
cd senegal-bus-backend
./mvnw clean package -DskipTests
docker build -t bus-senegal-backend .
```

**Frontend** :
```bash
cd bus-senegal-frontend
npm install
npm run build
```

---

## 🚀 COMMANDE ULTIME (démarrer le déploiement)

```bash
# Tout en une commande :
cd /Users/diaguily/wokspace/sources/senegal_bus && \
./scripts/generate-nextauth-secret.sh && \
echo "" && \
echo "═══════════════════════════════════════════════════════" && \
echo "✅ Secret généré !" && \
echo "📖 Ouvrez maintenant le guide de déploiement :" && \
echo "" && \
echo "   open START_DEPLOYMENT.md" && \
echo "" && \
echo "═══════════════════════════════════════════════════════"
```

---

## 📊 Vérifier le statut actuel

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus

echo "📊 STATUT DU PROJET BUS SÉNÉGAL"
echo "════════════════════════════════════════════"
echo "✅ Fichiers    : $(git ls-files | wc -l | tr -d ' ')"
echo "✅ Commits     : $(git log --oneline | wc -l | tr -d ' ')"
echo "✅ Branch      : $(git branch --show-current)"
echo "✅ Remote      : $(git remote get-url origin)"
echo "✅ Dernière MàJ: $(git log -1 --format=%cd --date=relative)"
echo "════════════════════════════════════════════"
```

---

## 🆘 Aide rapide

### Problème : "Docker not found"
```bash
# Vérifier Docker
docker --version

# Si pas installé, installer Docker Desktop
open https://www.docker.com/products/docker-desktop
```

### Problème : "Kind not found"
```bash
# Installer Kind
brew install kind

# Vérifier
kind --version
```

### Problème : "Permission denied" sur scripts
```bash
# Rendre tous les scripts exécutables
chmod +x scripts/*.sh
```

### Problème : Git push échoue
```bash
# Vérifier remote
git remote -v

# Si problème d'authentification, utiliser token
git remote set-url origin https://VOTRE_TOKEN@github.com/Diags/senegal-bus-platform.git
```

---

## ✅ Checklist finale avant déploiement

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus

# Vérifier que tout est OK
echo "Vérification..."
[ -f "scripts/generate-nextauth-secret.sh" ] && echo "✅ Script secret OK"
[ -f "START_DEPLOYMENT.md" ] && echo "✅ Guide de déploiement OK"
[ -f "DEPLOYMENT_GUIDE_STEP_BY_STEP.md" ] && echo "✅ Guide détaillé OK"
[ -d "senegal-bus-backend" ] && echo "✅ Backend OK"
[ -d "bus-senegal-frontend" ] && echo "✅ Frontend OK"
[ -d "k8s" ] && echo "✅ Manifests K8s OK"
git remote get-url origin > /dev/null 2>&1 && echo "✅ Git remote OK"
echo ""
echo "🚀 Tout est prêt pour le déploiement !"
```

---

## 🎯 DÉMARRER MAINTENANT

```bash
open START_DEPLOYMENT.md
```

**Vous êtes à 40 minutes de mettre votre application en ligne ! 🌍🇸🇳**

