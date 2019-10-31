#!/usr/bin/env bash

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

if [[ -z "${TMP_DIR}" ]]; then
    TMP_DIR=".tmp"
fi

NAME="ibmcloud-config"
OUTPUT_YAML="${TMP_DIR}/ibmcloud-apikey.yaml"

#kubectl delete -n "${NAMESPACE}" -l app=${NAME}
kubectl delete -n "${NAMESPACE}" secrets/ibmcloud-apikey
kubectl delete -n "${NAMESPACE}" configmaps/ibmcloud-config

#TLS_SECRET_NAME=$(kubectl get secrets -o jsonpath='{range .items[?(@.data.tls\.key != "")]}{.metadata.name}{"\n"}{end}' | grep -v router-certs | grep -v router-wildcard-certs | head -1)

#if [[ -n "${TLS_SECRET_FILE}" ]]; then
#    echo -n "${TLS_SECRET_NAME}" > ${TLS_SECRET_FILE}
#fi

echo "*** Generating kube yaml from helm template into ${OUTPUT_YAML}"
helm init --client-only
mkdir -p "${TMP_DIR}"
helm template "${CHART}" \
    --name "${NAME}" \
    --namespace "${NAMESPACE}" \
    --set apikey="${APIKEY}" \
    --set resource_group="${RESOURCE_GROUP}" \
    --set server_url="${SERVER_URL}" \
    --set cluster_type="${CLUSTER_TYPE}" \
    --set cluster_name="${CLUSTER_NAME}" \
    --set tls_secret_name="${TLS_SECRET_NAME}" \
    --set registry_url="${REGISTRY_URL}" \
    --set ingress_subdomain="${INGRESS_SUBDOMAIN}" > "${OUTPUT_YAML}"

echo "*** Applying kube yaml ${OUTPUT_YAML}"
kubectl create -n "${NAMESPACE}" -f "${OUTPUT_YAML}"
