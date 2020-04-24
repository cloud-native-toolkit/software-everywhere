#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"

echo "*** deleting Grafana operator in target namespace.." 
YAML_FILE=${MODULE_DIR}/yaml/grafana-operator.yaml
oc delete -f ${YAML_FILE} -n ${NAMESPACE} || true

sleep 10
echo '>>> Grafana operator in target namespace is deleted'

