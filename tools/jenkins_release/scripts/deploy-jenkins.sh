#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"
JENKINS_HOST="$2"
TLS_SECRET_NAME="$3"

if [[ -z "${TMP_DIR}" ]]; then
    TMP_DIR=".tmp"
fi
if [[ -z "${CHART_REPO}" ]]; then
    CHART_REPO="https://kubernetes-charts.storage.googleapis.com/"
fi

NAME="jenkins"

VALUES_FILE="${MODULE_DIR}/jenkins-values.yaml"
JENKINS_CONFIG_CHART="${MODULE_DIR}/charts/jenkins-config"
KUSTOMIZE_TEMPLATE="${MODULE_DIR}/kustomize/jenkins"

CHART_DIR="${TMP_DIR}/charts"
KUSTOMIZE_DIR="${TMP_DIR}/kustomize"

JENKINS_CHART="${CHART_DIR}/jenkins"

JENKINS_KUSTOMIZE="${KUSTOMIZE_DIR}/jenkins"
JENKINS_BASE_KUSTOMIZE="${JENKINS_KUSTOMIZE}/base.yaml"
JENKINS_CONFIG_KUSTOMIZE="${JENKINS_KUSTOMIZE}/jenkins-config.yaml"

JENKINS_YAML="${TMP_DIR}/jenkins.yaml"

echo "*** Fetching Jenkins helm chart from ${CHART_REPO} into ${CHART_DIR}"
mkdir -p "${CHART_DIR}"
helm fetch --repo "${CHART_REPO}" --untar --untardir "${CHART_DIR}" jenkins

echo "*** Setting up kustomize directory"
mkdir -p "${KUSTOMIZE_DIR}"
cp -R "${KUSTOMIZE_TEMPLATE}" "${KUSTOMIZE_DIR}"

echo "*** Updating namespace in kustomization.yaml"
sed -i -e "s/tools/${NAMESPACE}/g"  ${KUSTOMIZE_DIR}/jenkins/kustomization.yaml

echo "*** Cleaning up helm chart tests"
rm -rf "${JENKINS_CHART}/templates/tests"

if [[ -n "${TLS_SECRET_NAME}" ]]; then
    echo "master:" > ${TMP_DIR}/tls-values.yaml
    echo "  ingress:" >> ${TMP_DIR}/tls-values.yaml
    echo "    tls:" >> ${TMP_DIR}/tls-values.yaml
    echo "    - secretName: ${TLS_SECRET_NAME}" >> ${TMP_DIR}/tls-values.yaml
    echo "      hosts:" >> ${TMP_DIR}/tls-values.yaml
    echo "      - ${JENKINS_HOST}" >> ${TMP_DIR}/tls-values.yaml
else
    echo "" > ${TMP_DIR}/tls-values.yaml
fi

JENKINS_URL="http://${JENKINS_HOST}"
HELM_VALUES="master.ingress.hostName=${JENKINS_HOST}"
if [[ -n "${TLS_SECRET_NAME}" ]]; then
    JENKINS_URL="https://${JENKINS_HOST}"
    HELM_VALUES="${HELM_VALUES},master.ingress.tls[0].secretName=${TLS_SECRET_NAME},master.ingress.tls[0].hosts[0]=${JENKINS_HOST}"
fi

echo "*** Generating jenkins yaml from helm template"
helm init --client-only
helm template "${JENKINS_CHART}" \
    --namespace "${NAMESPACE}" \
    --name "${NAME}" \
    --set ${HELM_VALUES} \
    --values "${VALUES_FILE}" > "${JENKINS_BASE_KUSTOMIZE}"

echo "*** Generating jenkins-config yaml from helm template"
helm template "${JENKINS_CONFIG_CHART}" \
    --namespace "${NAMESPACE}" \
    --set jenkins.url="${JENKINS_URL}" \
    --set jenkins.host="${JENKINS_HOST}" > "${JENKINS_CONFIG_KUSTOMIZE}"

echo "*** Building final kube yaml from kustomize into ${JENKINS_YAML}"
kustomize build "${JENKINS_KUSTOMIZE}" > "${JENKINS_YAML}"

echo "*** Applying Jenkins yaml to kube"
kubectl apply -n "${NAMESPACE}" -f "${JENKINS_YAML}"

export EXCLUDE_POD_NAME="jenkins-config"

echo "*** Waiting for Jenkins"
until ${SCRIPT_DIR}/checkPodRunning.sh jenkins ${NAMESPACE}; do
    echo '>>> waiting for Jenkins'
    sleep 300
done
echo '>>> Jenkins has started'
