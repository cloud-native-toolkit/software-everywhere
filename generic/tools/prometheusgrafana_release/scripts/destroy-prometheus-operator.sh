#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"

echo "*** deleting Prometheus operator in target namespace.." 
YAML_FILE=${MODULE_DIR}/yaml/prometheus-operator.yaml
oc delete -f ${YAML_FILE} -n ${NAMESPACE} || true

sleep 10
echo '>>> Prometheus operator in target namespace is deleted'

echo "*** NOT deleting the namespace used by the operator as it is may be shared with other tools .."

