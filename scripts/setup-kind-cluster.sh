#!/bin/bash

set -e

echo "🚀 Creating Kind cluster for Bus Sénégal..."

# Créer cluster Kind avec ingress
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: bus-senegal
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker
EOF

echo "✅ Kind cluster created!"

echo "📦 Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

echo "⏳ Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

echo "✅ NGINX Ingress Controller ready!"

echo "📝 Adding hosts entries (requires sudo)..."
echo "Adding the following entries to /etc/hosts:"
echo "127.0.0.1 api.bus-senegal.local"
echo "127.0.0.1 bus-senegal-frontend.local"
echo "127.0.0.1 keycloak.bus-senegal.local"

sudo bash -c 'cat >> /etc/hosts << EOL

# Bus Sénégal Kind Cluster
127.0.0.1 api.bus-senegal.local
127.0.0.1 bus-senegal-frontend.local
127.0.0.1 keycloak.bus-senegal.local
EOL'

echo "✅ Hosts entries added!"

echo ""
echo "🎉 Kind cluster is ready!"
echo ""
echo "Next steps:"
echo "1. Run ./scripts/install-argocd.sh to install ArgoCD"
echo "2. Build and push Docker images"
echo "3. Deploy applications with ArgoCD"

