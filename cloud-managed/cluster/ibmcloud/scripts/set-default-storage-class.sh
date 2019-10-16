#!/usr/bin/env bash

STORAGE_CLASS="$1"
if [[ -z "${STORAGE_CLASS}" ]]; then
  echo "STORAGE_CLASS is required as the first argument"
  exit 1
fi

if [[ -n "${KUBECONFIG_IKS}" ]]; then
    export KUBECONFIG="${KUBECONFIG_IKS}"
fi

CURRENT_DEFAULT_STORAGE_CLASS=$(kubectl get storageclass -o jsonpath='{range .items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class == "true")]}{.metadata.name}{"\n"}{end}' | head -1)
kubectl patch storageclass ${CURRENT_DEFAULT_STORAGE_CLASS} -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
kubectl patch storageclass ${STORAGE_CLASS} -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
