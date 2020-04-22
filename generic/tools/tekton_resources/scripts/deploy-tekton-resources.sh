#!/usr/bin/env bash

NAMESPACE="$1"
PRE_TEKTON="$2"
REVISION="$3"
GIT_URL="$4"

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

if [[ -z "${TMP_DIR}" ]]; then
  TMP_DIR=./.tmp
fi
mkdir -p "${TMP_DIR}"

URL="${GIT_URL}/releases/download/${REVISION}/release.yaml"

echo "*** Waiting for Tekton API group to be available"
until oc get tasks
do
    echo '>>> waiting for Tekton APIs availability'
    sleep 60
done
echo '>>> Tekton APIs are available'

kubectl apply -n "${NAMESPACE}" -f "${URL}"