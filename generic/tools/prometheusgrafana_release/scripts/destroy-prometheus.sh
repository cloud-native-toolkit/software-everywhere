#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"

echo "*** deleting Prometheus instance.."
YAML_FILE=${MODULE_DIR}/yaml/prometheus.yaml
oc delete -f ${YAML_FILE} -n ${NAMESPACE} || true

echo '>>> Prometheus instance is deleted'