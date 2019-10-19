#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"
INGRESS_HOST="$2"
IMAGE_TAG="$3"
CONFIG_MAPS="$4"

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

if [[ -z "${TMP_DIR}" ]]; then
    TMP_DIR=".tmp"
fi

if [[ -z "${IMAGE_TAG}" ]]; then
    IMAGE_TAG="latest"
fi

CHART="${MODULE_DIR}/charts/catalyst-dashboard"

NAME="catalyst-dashboard"
OUTPUT_YAML="${TMP_DIR}/catalystdashboard.yaml"

CONFIG_MAP_YAML=$(echo "${CONFIG_MAPS}" | sed -E "s/[[](.+)[]]/{\1}/g" | sed "s/[[][]]//g")

mkdir -p ${TMP_DIR}

VALUES="ingress.hosts.0=${INGRESS_HOST}"
if [[ -n "${TLS_SECRET_NAME}" ]]; then
    VALUES="${VALUES},ingress.tls[0].secretName=${TLS_SECRET_NAME}"
    VALUES="${VALUES},ingress.tls[0].hosts[0]=${INGRESS_HOST}"
    VALUES="${VALUES},ingress.annotations.ingress\.bluemix\.net/redirect-to-https='True'"
fi

echo "*** Generating kube yaml from helm template into ${OUTPUT_YAML}"
helm init --client-only
helm template ${CHART} \
    --namespace ${NAMESPACE} \
    --name ${NAME} \
    --set "image.tag=${IMAGE_TAG}" \
    --set "${VALUES}" \
    --set configMaps="${CONFIG_MAP_YAML}" > ${OUTPUT_YAML}

echo "*** Applying kube yaml ${OUTPUT_YAML}"
kubectl apply -n ${NAMESPACE} -f ${OUTPUT_YAML}
