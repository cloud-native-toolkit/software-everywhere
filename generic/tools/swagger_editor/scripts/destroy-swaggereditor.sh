#!/usr/bin/env bash

NAMESPACE="$1"
LABEL="$2"
CLUSTER_TYPE="$3"

kubectl delete deployment,ingress,role,rolebinding,service,serviceaccount,configmap,secret -n "${NAMESPACE}" -l app="${LABEL}"

if [[ "${CLUSTER_TYPE}" != "kubernetes" ]]; then
  kubectl delete route,scc -n "${NAMESPACE}" -l app="${LABEL}"
fi
