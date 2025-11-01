#!/bin/bash

set -e

echo "🗑️  Tearing down Bus Sénégal Kind cluster..."

# Delete Kind cluster
kind delete cluster --name bus-senegal

echo "📝 Removing hosts entries (requires sudo)..."
sudo sed -i.bak '/# Bus Sénégal Kind Cluster/,+3d' /etc/hosts

echo "✅ Kind cluster deleted!"
echo ""
echo "All resources have been cleaned up."

