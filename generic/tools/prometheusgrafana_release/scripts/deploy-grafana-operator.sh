#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"


echo "*** creating Grafana operator in target namespace.."
YAML_FILE=${MODULE_DIR}/yaml/grafana-operator.yaml
oc apply -f ${YAML_FILE} -n ${NAMESPACE} 

echo "*** waiting for Grafana CRDs to be available"
sleep 30
until oc get crd grafanas.integreatly.org -n ${NAMESPACE}  1> /dev/null 2> /dev/null 
do
    echo '>>> waiting for Grafana CRD availability'
    sleep 60
done
echo '>>> Grafana CRDs are available'


