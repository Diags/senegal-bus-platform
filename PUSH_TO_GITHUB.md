# 🚀 Guide: Pousser le Projet sur GitHub

## Statut Actuel

✅ Git initialisé  
✅ 3 commits créés (208 fichiers, 30,914 insertions totales)  
✅ Branche `main` prête  
⏳ Prêt à pousser sur GitHub !

---

## Étape 1: Créer le Repository sur GitHub (2 min)

### Option A: Via Interface Web

1. Aller sur https://github.com/new
2. **Repository name**: `senegal-bus-platform`
3. **Description**: `Plateforme SaaS multi-tenant de réservation de bus au Sénégal avec paiements mobile - Spring Boot + Next.js + Kubernetes`
4. **Visibilité**: 
   - ✅ **Public** (recommandé pour portfolio)
   - Ou **Private** (si vous préférez)
5. **⚠️ NE PAS initialiser avec**:
   - ❌ README
   - ❌ .gitignore
   - ❌ License
6. Cliquer **Create repository**

### Option B: Via GitHub CLI (si installé)

```bash
gh repo create senegal-bus-platform \
  --public \
  --description "Plateforme SaaS multi-tenant de réservation de bus au Sénégal" \
  --source=. \
  --remote=origin \
  --push
```

---

## Étape 2: Ajouter le Remote et Pousser (1 min)

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus

# Ajouter le remote GitHub
git remote add origin https://github.com/Diags/senegal-bus-platform.git

# Pousser sur GitHub
git push -u origin main
```

### Résultat Attendu

```
Énumération des objets: 250, fait.
Décompte des objets: 100% (250/250), fait.
Compression delta en utilisant jusqu'à 8 fils d'exécution
Compression des objets: 100% (230/230), fait.
Écriture des objets: 100% (250/250), 1.5 MiB | 2.3 MiB/s, fait.
Total 250 (delta 80), réutilisés 0 (delta 0), réutilisés du pack 0
remote: Resolving deltas: 100% (80/80), done.
To https://github.com/Diags/senegal-bus-platform.git
 * [new branch]      main -> main
La branche 'main' est paramétrée pour suivre la branche distante 'main' depuis 'origin'.
```

✅ **Code poussé sur GitHub !**

---

## Étape 3: Vérifier sur GitHub (1 min)

1. Aller sur https://github.com/Diags/senegal-bus-platform
2. Vérifier que tous les fichiers sont là:
   - ✅ senegal-bus-backend/
   - ✅ bus-senegal-frontend/
   - ✅ k8s/
   - ✅ .github/workflows/
   - ✅ scripts/
   - ✅ docs/
   - ✅ README.md
   - ✅ LICENSE
3. Vérifier les 3 commits sont visibles

---

## Étape 4: Configurer GitHub Secrets (pour CI/CD)

### Aller dans Settings → Secrets and variables → Actions

Ajouter ces secrets:

```
# Docker Hub (pour build images)
DOCKER_USERNAME=diags
DOCKER_PASSWORD=<votre-docker-hub-token>

# Codecov (optionnel, pour coverage)
CODECOV_TOKEN=<codecov-token>

# Vercel (si auto-deploy depuis GitHub)
VERCEL_TOKEN=<vercel-token>
VERCEL_ORG_ID=<vercel-org-id>
VERCEL_PROJECT_ID=<vercel-project-id>
```

### Comment obtenir les tokens

**Docker Hub**:
1. https://hub.docker.com
2. Account Settings → Security → New Access Token
3. Copier le token

**Codecov**:
1. https://codecov.io
2. Sign in with GitHub
3. Add repository → Get token

**Vercel**:
1. https://vercel.com/account/tokens
2. Create Token

---

## Étape 5: Activer GitHub Actions (Auto)

GitHub Actions se lancera automatiquement au prochain push!

Workflows disponibles :
- ✅ `backend.yml` - Tests + Build Backend
- ✅ `frontend.yml` - Tests + Build Frontend  
- ✅ `build-and-push.yml` - Docker images

Voir: https://github.com/Diags/senegal-bus-platform/actions

---

## Prochaines Actions

### Déploiement GRATUIT (30 min)

Suivre le guide: `DEPLOY_FREE_QUICKSTART.md`

**Étapes**:
1. **Neon.tech** → PostgreSQL (5 min)
2. **Render.com** → Backend (10 min)
3. **Vercel.com** → Frontend (5 min)
4. **Tester** ! (10 min)

**Résultat**:
- Frontend: https://bus-senegal.vercel.app
- Backend: https://bus-senegal-backend.onrender.com
- **Coût: $0/mois**

---

## Troubleshooting

### Erreur: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/Diags/senegal-bus-platform.git
git push -u origin main
```

### Erreur: "rejected - non-fast-forward"

```bash
# Forcer le push (seulement si repository vide!)
git push -u origin main --force
```

### Erreur: "Permission denied"

Vérifier authentication GitHub:

```bash
# HTTPS (avec token)
git remote set-url origin https://<github-token>@github.com/Diags/senegal-bus-platform.git

# Ou SSH
git remote set-url origin git@github.com:Diags/senegal-bus-platform.git
```

---

## Vérifications Post-Push

### Sur GitHub.com

- [ ] Repository créé et visible
- [ ] README.md affiché sur homepage
- [ ] 3 commits visibles dans l'historique
- [ ] Tous les dossiers présents
- [ ] LICENSE MIT visible
- [ ] GitHub Actions démarrés (peut échouer si secrets pas configurés)

### Localement

```bash
# Vérifier remote
git remote -v

# Vérifier branch
git branch -a

# Vérifier statut
git status
```

---

## Félicitations ! 🎉

Votre projet Bus Sénégal est maintenant sur GitHub :

**Repository**: https://github.com/Diags/senegal-bus-platform

**Prochaine étape**: Déployer gratuitement en 30 minutes !

Voir: `DEPLOY_FREE_QUICKSTART.md`

