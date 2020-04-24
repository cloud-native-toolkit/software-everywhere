#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"
DASHBOARD="$2"

YAML_FILE=${MODULE_DIR}/yaml/${DASHBOARD}

echo "*** creating Grafana dashboard " $DASHBOARD
oc apply -f ${YAML_FILE} -n ${NAMESPACE}


