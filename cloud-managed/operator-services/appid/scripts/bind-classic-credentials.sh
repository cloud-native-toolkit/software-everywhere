#!/usr/bin/env bash

SERVICE_INSTANCE_NAME="$1"
SERVICE_ROLE_NAME="$2"
CLUSTER_NAME="$3"
NAMESPACE="$4"

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

CREDENTIAL_NAME="${SERVICE_INSTANCE_NAME}-key"

CREDENTIAL_ID=$(ibmcloud resource service-keys --instance-name "${SERVICE_INSTANCE_NAME}" | grep "${CREDENTIAL_NAME}")

# Create the service key if it doesn't exist
if [[ -z "${CREDENTIAL_ID}" ]]; then
  ibmcloud resource service-key-create "${CREDENTIAL_NAME}" "${SERVICE_ROLE_NAME}" --instance-name "${SERVICE_INSTANCE_NAME}"
fi

if [[ -n $(kubectl get "secret/binding-${SERVICE_INSTANCE_NAME}" -n "${NAMESPACE}" -o jsonpath='{.metadata.name}' 2> /dev/null) ]]; then
  kubectl delete "secret/binding-${SERVICE_INSTANCE_NAME}" -n "${NAMESPACE}"
fi

ibmcloud ks cluster service bind \
  --cluster "${CLUSTER_NAME}" \
  --namespace "${NAMESPACE}" \
  --key "${CREDENTIAL_NAME}" \
  --service "${SERVICE_INSTANCE_NAME}"
