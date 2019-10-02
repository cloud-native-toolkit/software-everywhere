#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"
INGRESS_HOST="$2"
CONFIG_MAPS="$3"

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

if [[ -z "${TMP_DIR}" ]]; then
    TMP_DIR=".tmp"
fi

CHART="${MODULE_DIR}/charts/catalyst-dashboard"

NAME="catalyst-dashboard"
OUTPUT_YAML="${TMP_DIR}/catalystdashboard.yaml"

CONFIG_MAP_YAML=$(echo "${CONFIG_MAPS}" | sed -E "s/[[](.+)[]]/{\1}/g" | sed "s/[[][]]//g")

mkdir -p ${TMP_DIR}

echo "*** Generating kube yaml from helm template into ${OUTPUT_YAML}"
helm init --client-only
helm template ${CHART} \
    --namespace ${NAMESPACE} \
    --name ${NAME} \
    --set ingress.hosts.0=${INGRESS_HOST} \
    --set configMaps="${CONFIG_MAP_YAML}" > ${OUTPUT_YAML}

echo "*** Applying kube yaml ${OUTPUT_YAML}"
kubectl apply -n ${NAMESPACE} -f ${OUTPUT_YAML}
