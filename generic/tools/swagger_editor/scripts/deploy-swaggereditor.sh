#!/usr/bin/env bash

set -e
set -x

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"
NAME="$2"
CLUSTER_TYPE="$3"
INGRESS_HOST="$4"
INGRESS_SUBDOMAIN="$5"
IMAGE_TAG="$6"
ENABLE_OAUTH="$7"
CHART_VERSION="$8"

if [[ -z "${TMP_DIR}" ]]; then
    TMP_DIR=".tmp"
fi

if [[ -z "${IMAGE_TAG}" ]]; then
    IMAGE_TAG="latest"
fi

if [[ -z "${CHART_VERSION}" ]]; then
  CHART_VERSION="1.2.0"
fi

if [[ "${CLUSTER_TYPE}" == "ocp3" ]] || [[ "${CLUSTER_TYPE}" == "ocp4" ]]; then
  CLUSTER_TYPE="openshift"
fi

OUTPUT_YAML="${TMP_DIR}/swaggereditor.yaml"
CONFIG_OUTPUT_YAML="${TMP_DIR}/swaggereditor-config.yaml"

mkdir -p ${TMP_DIR}

DASHBOARD_URL="http://${INGRESS_HOST}-${NAMESPACE}.${INGRESS_SUBDOMAIN}"

VALUES="ingress.hosts.0=${INGRESS_HOST}"
if [[ -n "${TLS_SECRET_NAME}" ]]; then
    VALUES="${VALUES},ingress.tls[0].secretName=${TLS_SECRET_NAME}"
    VALUES="${VALUES},ingress.annotations.ingress\.bluemix\.net/redirect-to-https='True'"

    DASHBOARD_URL="https://${INGRESS_HOST}-${NAMESPACE}.${INGRESS_SUBDOMAIN}"
fi

echo "*** Generating kube yaml from helm3 template into ${OUTPUT_YAML}"
helm3 template "${NAME}" swaggereditor \
    --repo https://ibm-garage-cloud.github.io/toolkit-charts/ \
    --namespace "${NAMESPACE}" \
    --version "${CHART_VERSION}" \
    --set "clusterType=${CLUSTER_TYPE}" \
    --set "host=${INGRESS_HOST}" \
    --set "ingressSubdomain=${INGRESS_SUBDOMAIN}" \
    --set "ingress.includeNamespace=true" \
    --set "image.tag=${IMAGE_TAG}" \
    --set "sso.enabled=${ENABLE_OAUTH}" \
    --set "${VALUES}"  > ${OUTPUT_YAML}

echo "*** Applying kube yaml ${OUTPUT_YAML}"
kubectl apply -n "${NAMESPACE}" -f ${OUTPUT_YAML} --validate=false

helm3 template apieditor tool-config \
  --repo https://ibm-garage-cloud.github.io/toolkit-charts/ \
  --namespace "${NAMESPACE}" \
  --set app="${NAME}" \
  --set url="${DASHBOARD_URL}" > "${CONFIG_OUTPUT_YAML}"

echo "*** Applying config yaml ${CONFIG_OUTPUT_YAML}"
kubectl apply -n "${NAMESPACE}" -f "${CONFIG_OUTPUT_YAML}"

echo "*** Waiting for Swagger"
"${SCRIPT_DIR}/waitForEndpoint.sh" "${DASHBOARD_URL}" 150 12
