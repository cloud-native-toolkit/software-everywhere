#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd "${SCRIPT_DIR}/.."; pwd -P)

CHART_NAME="$1"
NAMESPACE="$2"
VERSION="$3"
INGRESS_HOST="$4"

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

if [[ -z "${TMP_DIR}" ]]; then
    TMP_DIR=".tmp"
fi

KUSTOMIZE_TEMPLATE="${MODULE_DIR}/kustomize/argocd"

CHART_DIR="${TMP_DIR}/charts"
KUSTOMIZE_DIR="${TMP_DIR}/kustomize"

ARGOCD_CHART="${CHART_DIR}/${CHART_NAME}"
ACCESS_CHART="${MODULE_DIR}/charts/argocd-access"

ARGOCD_KUSTOMIZE="${KUSTOMIZE_DIR}/argocd"
ARGOCD_BASE_KUSTOMIZE="${ARGOCD_KUSTOMIZE}/base.yaml"
ARGOCD_ACCESS_KUSTOMIZE="${ARGOCD_KUSTOMIZE}/access.yaml"

ARGOCD_YAML="${TMP_DIR}/argocd.yaml"

HELM_REPO="https://ibm-garage-cloud.github.io/argo-helm/"

echo "*** Fetching the helm chart from ${HELM_REPO}"
mkdir -p ${CHART_DIR}
helm init --client-only
helm fetch --repo ${HELM_REPO} \
    --untar \
    --untardir ${CHART_DIR} \
    --version ${VERSION} \
    ${CHART_NAME}

echo "*** Setting up kustomize directory"
mkdir -p "${KUSTOMIZE_DIR}"
cp -R "${KUSTOMIZE_TEMPLATE}" "${KUSTOMIZE_DIR}"

echo "*** Generating kube yaml from helm template into ${ARGOCD_BASE_KUSTOMIZE}"
helm template ${ARGOCD_CHART} \
    --namespace ${NAMESPACE} \
    --name ${CHART_NAME} \
    --set ingress.enabled=true \
    --set ingress.ssl_passthrough=false \
    --set ingress.hosts.0=${INGRESS_HOST} > ${ARGOCD_BASE_KUSTOMIZE}

echo "*** Generating access yaml from helm template into ${ARGOCD_ACCESS_KUSTOMIZE}"
helm template ${ACCESS_CHART} \
    --namespace ${NAMESPACE} \
    --set url="http://${INGRESS_HOST}" > ${ARGOCD_ACCESS_KUSTOMIZE}

echo "*** Building final kube yaml from kustomize into ${ARGOCD_YAML}"
kustomize build "${ARGOCD_KUSTOMIZE}" > "${ARGOCD_YAML}"

echo "*** Applying kube yaml ${ARGOCD_YAML}"
kubectl apply -n "${NAMESPACE}" -f "${ARGOCD_YAML}"
