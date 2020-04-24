#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"

echo "*** deleting Grafana instance.."
YAML_FILE=${MODULE_DIR}/yaml/grafana.yaml
oc delete -f ${YAML_FILE} -n ${NAMESPACE} || true

echo '>>> Grafana instance is deleted'

echo "*** deleting Grafana datasource for Prometheus.."
YAML_FILE=${MODULE_DIR}/yaml/grafana-datasource.yaml
oc delete -f ${YAML_FILE} -n ${NAMESPACE} || true