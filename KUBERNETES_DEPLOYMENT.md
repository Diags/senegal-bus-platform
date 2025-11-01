# 🚀 Bus Sénégal - Déploiement Kubernetes avec ArgoCD & Kind

## Vue d'ensemble

Ce guide décrit comment déployer la plateforme Bus Sénégal sur Kubernetes en utilisant Kind (Kubernetes in Docker) pour le développement local et ArgoCD pour le déploiement GitOps.

## Architecture

```
GitHub Repository
    ↓ (GitOps)
ArgoCD
    ↓ (Sync)
Kubernetes Cluster (Kind/GKE/EKS/AKS)
    ├── Namespace: bus-senegal-prod
    │   ├── Backend (Spring Boot)
    │   ├── Frontend (Next.js)
    │   ├── PostgreSQL (StatefulSet)
    │   └── Keycloak (Auth)
    └── Ingress NGINX
```

## Prérequis

### Logiciels requis
- [Docker](https://docs.docker.com/get-docker/) >= 20.10
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) >= 0.20
- [kubectl](https://kubernetes.io/docs/tasks/tools/) >= 1.28
- [kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/) >= 5.0 (optionnel)
- Git

### Vérification
```bash
docker --version
kind --version
kubectl version --client
```

## Déploiement Rapide (5 minutes)

### 1. Créer le cluster Kind
```bash
./scripts/setup-kind-cluster.sh
```

Ce script :
- Crée un cluster Kind avec 1 control-plane + 2 workers
- Install NGINX Ingress Controller
- Configure les entrées /etc/hosts

### 2. Installer ArgoCD
```bash
./scripts/install-argocd.sh
```

Ce script :
- Installe ArgoCD dans le namespace `argocd`
- Expose l'UI via port-forward
- Affiche le mot de passe admin initial

### 3. Pousser le code sur GitHub
```bash
# Depuis la racine du projet
git init
git add .
git commit -m "Initial commit: Bus Sénégal Platform"
git remote add origin https://github.com/Diags/senegal-bus-platform.git
git branch -M main
git push -u origin main
```

### 4. Déployer l'application
```bash
./scripts/deploy-with-argocd.sh
```

### 5. Accéder aux services
```bash
# Option 1: Via Ingress
open http://bus-senegal-frontend.local
open http://api.bus-senegal.local/swagger-ui.html
open http://keycloak.bus-senegal.local

# Option 2: Via port-forward
./scripts/port-forward-services.sh
open http://localhost:3000  # Frontend
open http://localhost:8080  # Backend
open http://localhost:8180  # Keycloak
```

## Structure des Manifests Kubernetes

```
k8s/
├── base/                          # Configurations communes
│   ├── backend/
│   │   ├── deployment.yaml       # Backend Deployment
│   │   ├── service.yaml          # Backend Service
│   │   └── ingress.yaml          # Backend Ingress
│   ├── frontend/
│   │   ├── deployment.yaml       # Frontend Deployment
│   │   ├── service.yaml          # Frontend Service
│   │   └── ingress.yaml          # Frontend Ingress
│   ├── postgres/
│   │   ├── statefulset.yaml      # PostgreSQL StatefulSet
│   │   └── service.yaml          # PostgreSQL Service
│   ├── keycloak/
│   │   ├── deployment.yaml       # Keycloak Deployment
│   │   ├── service.yaml          # Keycloak Service
│   │   └── ingress.yaml          # Keycloak Ingress
│   └── kustomization.yaml        # Kustomize base
│
├── overlays/                      # Environnements spécifiques
│   ├── dev/
│   │   └── kustomization.yaml    # Dev (1 replica, resources limitées)
│   └── prod/
│       └── kustomization.yaml    # Prod (3 replicas, resources optimisées)
│
└── argocd/
    └── application.yaml           # ArgoCD Application
```

## Configuration des Secrets

### Option 1: Secrets Kustomize (Simple, pour dev)
Les secrets sont générés par Kustomize dans `k8s/base/kustomization.yaml`.

**⚠️ ATTENTION**: Changer les mots de passe en production !

### Option 2: Sealed Secrets (Recommandé pour production)
```bash
# Installer Sealed Secrets Controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Créer un secret et le sceller
kubectl create secret generic postgres-secret \
  --from-literal=username=bus_senegal_user \
  --from-literal=password=STRONG_PASSWORD_HERE \
  --from-literal=jdbc-url=jdbc:postgresql://postgres-svc:5432/bus_senegal_prod \
  --dry-run=client -o yaml | \
  kubeseal -o yaml > k8s/base/postgres/sealed-secret.yaml

# Appliquer le sealed secret
kubectl apply -f k8s/base/postgres/sealed-secret.yaml
```

## Images Docker

### Build local
```bash
# Backend
cd senegal-bus-backend
docker build -t diags/bus-senegal-backend:latest .

# Frontend
cd bus-senegal-frontend
docker build -t diags/bus-senegal-frontend:latest .

# Load dans Kind
kind load docker-image diags/bus-senegal-backend:latest --name bus-senegal
kind load docker-image diags/bus-senegal-frontend:latest --name bus-senegal
```

### Push vers Docker Hub
```bash
docker login
docker push diags/bus-senegal-backend:latest
docker push diags/bus-senegal-frontend:latest
```

## CI/CD avec GitHub Actions

Le projet inclut un workflow GitHub Actions qui :
1. Build les images Docker
2. Push vers Docker Hub
3. Met à jour les manifests Kubernetes avec les nouveaux tags
4. ArgoCD détecte les changements et sync automatiquement

### Configuration requise (GitHub Secrets)
```
DOCKER_USERNAME       # Votre username Docker Hub
DOCKER_PASSWORD       # Votre token/password Docker Hub
GH_PAT                # GitHub Personal Access Token (optionnel)
```

## Commandes Utiles

### Cluster
```bash
# Lister les clusters Kind
kind get clusters

# Obtenir le kubeconfig
kind get kubeconfig --name bus-senegal

# Supprimer le cluster
kind delete cluster --name bus-senegal
# ou
./scripts/teardown.sh
```

### Kubectl
```bash
# Voir tous les pods
kubectl get pods -n bus-senegal-prod

# Voir les logs
kubectl logs -n bus-senegal-prod deployment/prod-bus-senegal-backend -f

# Exec dans un pod
kubectl exec -it -n bus-senegal-prod deployment/prod-postgres-svc -- psql -U bus_senegal_user -d bus_senegal_prod

# Décrire un resource
kubectl describe deployment prod-bus-senegal-backend -n bus-senegal-prod
```

### ArgoCD
```bash
# Login CLI
argocd login localhost:8080

# Lister les applications
argocd app list

# Sync manuel
argocd app sync bus-senegal-platform

# Watch sync progress
argocd app wait bus-senegal-platform

# Get sync status
argocd app get bus-senegal-platform
```

### Kustomize
```bash
# Voir la configuration générée
kustomize build k8s/overlays/prod

# Appliquer directement
kubectl apply -k k8s/overlays/prod
```

## Troubleshooting

### Pods ne démarrent pas
```bash
# Voir les événements
kubectl get events -n bus-senegal-prod --sort-by='.lastTimestamp'

# Voir les logs
kubectl logs -n bus-senegal-prod <pod-name>

# Décrire le pod
kubectl describe pod -n bus-senegal-prod <pod-name>
```

### Ingress ne fonctionne pas
```bash
# Vérifier ingress controller
kubectl get pods -n ingress-nginx

# Vérifier ingress
kubectl get ingress -n bus-senegal-prod

# Vérifier /etc/hosts
cat /etc/hosts | grep bus-senegal
```

### ArgoCD ne sync pas
```bash
# Forcer refresh
argocd app get bus-senegal-platform --refresh

# Voir les différences
argocd app diff bus-senegal-platform

# Hard refresh
argocd app get bus-senegal-platform --hard-refresh
```

## Migration vers Production (GKE/EKS/AKS)

### 1. Créer cluster Kubernetes cloud
```bash
# GKE
gcloud container clusters create bus-senegal-prod \
  --num-nodes=3 \
  --region=europe-west1

# EKS
eksctl create cluster --name bus-senegal-prod --region eu-west-1

# AKS
az aks create --resource-group bus-senegal-rg --name bus-senegal-prod
```

### 2. Installer NGINX Ingress
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

### 3. Configurer DNS
Pointer vos domaines vers l'IP externe de l'Ingress.

### 4. Configurer SSL/TLS avec cert-manager
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

### 5. Déployer ArgoCD et l'application
Mêmes étapes que pour Kind.

## Monitoring

### Prometheus + Grafana (Optionnel)
```bash
# Installer kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Port-forward Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80
# Login: admin / prom-operator
```

## Sécurité

### Bonnes pratiques
1. ✅ Ne jamais committer des secrets en clair
2. ✅ Utiliser Sealed Secrets ou External Secrets en production
3. ✅ Activer RBAC
4. ✅ Network Policies
5. ✅ Pod Security Standards
6. ✅ Images signées
7. ✅ Scan de vulnérabilités (Trivy)

## Support

Pour toute question ou problème :
1. Consulter les logs : `kubectl logs ...`
2. Vérifier les événements : `kubectl get events`
3. Consulter ArgoCD UI
4. Issues GitHub

---

**Bon déploiement ! 🚀**

