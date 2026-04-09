#!/bin/bash
# =============================================================================
# Oracle Cloud VM Setup Script for heDoesIt Bakery
# Run this on the Oracle Ampere A1 VM after SSH'ing in
# =============================================================================
set -euo pipefail

echo "=== Step 1: Install K3s (with Traefik disabled) ==="
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik" sh -
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown "$(id -u):$(id -g)" ~/.kube/config
export KUBECONFIG=~/.kube/config
echo 'export KUBECONFIG=~/.kube/config' >> ~/.bashrc

echo ""
echo "=== Verifying K3s ==="
kubectl get nodes
echo ""

echo "=== Step 2: Install Helm ==="
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
echo ""

echo "=== Step 3: Install nginx Ingress Controller ==="
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=NodePort \
  --set controller.service.nodePorts.http=80 \
  --set controller.service.nodePorts.https=443 \
  --set controller.hostNetwork=true
echo ""

echo "=== Step 4: Install cert-manager ==="
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
echo "Waiting for cert-manager..."
kubectl wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
kubectl wait --for=condition=available deployment/cert-manager-webhook -n cert-manager --timeout=300s
echo ""

echo "=== Step 5: Create Let's Encrypt ClusterIssuer ==="
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: \${LETSENCRYPT_EMAIL:-admin@hedoesit.com}
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF
echo ""

echo "=== Step 6: Install ArgoCD ==="
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo ""
echo "Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
echo ""

ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "=== ArgoCD Initial Admin Password ==="
echo "  Username: admin"
echo "  Password: $ARGOCD_PASSWORD"
echo ""

echo "=== Step 7: Deploy ArgoCD Application ==="
kubectl apply -f https://raw.githubusercontent.com/dekee/heDoesIt/HEAD/k8s/argocd-app.yaml
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Create secrets (postgres-secret, google-oauth-secret, mail-secret)"
echo "  2. Create ghcr-secret for pulling container images"
echo "  3. ArgoCD will auto-sync and deploy the app from GitHub"
echo "  4. Check pods:  kubectl get pods -n hedoesit"
echo "  5. Check ingress: kubectl get ingress -n hedoesit"
echo ""
echo "  To access ArgoCD UI (port-forward):"
echo "    kubectl port-forward svc/argocd-server -n argocd 8443:443 --address 0.0.0.0"
echo "    Then visit: https://<YOUR_PUBLIC_IP>:8443"
