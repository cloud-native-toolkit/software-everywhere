#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"


echo "*** creating Grafana datasource for Prometheus.."
YAML_FILE=${MODULE_DIR}/yaml/grafana-datasource.yaml
oc apply -f ${YAML_FILE} -n ${NAMESPACE}

echo "*** creating Grafana instance.."
YAML_FILE=${MODULE_DIR}/yaml/grafana.yaml
oc apply -f ${YAML_FILE} -n ${NAMESPACE}

echo "*** checking Grafana instance.. "
until oc get svc grafana-service -n ${NAMESPACE} 1> /dev/null 2> /dev/null
do
    echo '>>> waiting for Grafana availability'
    sleep 60
done
   
echo "*** creating Grafana route.. "
oc expose svc/grafana-service -n ${NAMESPACE}

echo "*** Grafana UI is availabe at: "  
oc get route grafana-service -o=jsonpath='{@.spec.host}' -n ${NAMESPACE}

