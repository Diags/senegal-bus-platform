#!/bin/bash

set -e

echo "🚀 Installing ArgoCD..."

# Create namespace
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "⏳ Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/argocd-server -n argocd

# Patch service to LoadBalancer for Kind
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Get initial admin password
echo ""
echo "📝 ArgoCD Admin Password:"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""
echo ""

# Port forward in background
echo "🌐 Setting up port-forward to ArgoCD UI..."
kubectl port-forward svc/argocd-server -n argocd 8080:443 > /dev/null 2>&1 &
PORT_FORWARD_PID=$!

sleep 3

echo ""
echo "✅ ArgoCD installed successfully!"
echo ""
echo "Access ArgoCD UI at: https://localhost:8080"
echo "Username: admin"
echo "Password: (shown above)"
echo ""
echo "To stop port-forward: kill $PORT_FORWARD_PID"
echo ""
echo "Next steps:"
echo "1. Login to ArgoCD UI"
echo "2. Connect your GitHub repository"
echo "3. Deploy application: kubectl apply -f k8s/argocd/application.yaml"

