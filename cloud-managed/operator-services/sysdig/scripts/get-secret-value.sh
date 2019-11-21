#!/usr/bin/env bash

NAME="$1"
NAMESPACE="$2"
KEY="$3"

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

kubectl get "secret/${NAME}" -n "${NAMESPACE}" -o "jsonpath={.data.${KEY}}" | base64 --decode | xargs echo -n
