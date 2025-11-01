#!/bin/bash

set -e

echo "🚀 Deploying Bus Sénégal applications with ArgoCD..."

# Apply ArgoCD application
echo "📦 Creating ArgoCD Application..."
kubectl apply -f k8s/argocd/application.yaml

echo "⏳ Waiting for application to sync..."
sleep 5

# Check sync status
kubectl get application bus-senegal-platform -n argocd

echo ""
echo "✅ Application deployed!"
echo ""
echo "Check sync status in ArgoCD UI: https://localhost:8080"
echo "Or use: kubectl get application bus-senegal-platform -n argocd"
echo ""
echo "To manually sync: argocd app sync bus-senegal-platform"
echo "To watch sync progress: argocd app wait bus-senegal-platform"

