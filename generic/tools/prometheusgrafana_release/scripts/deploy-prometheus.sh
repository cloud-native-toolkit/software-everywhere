#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"

echo "*** creating Prometheus instance.."
YAML_FILE=${MODULE_DIR}/yaml/prometheus.yaml
oc apply -f ${YAML_FILE} -n ${NAMESPACE}

echo "*** checking Prometheus instance.. "
until oc get svc prometheus-operated -n ${NAMESPACE} 1> /dev/null 2> /dev/null
do
    echo '>>> waiting for Prometheus availability'
    sleep 60
done

echo "*** exposing route to Prometheus instance.."      
oc expose svc/prometheus-operated -n ${NAMESPACE} 

echo "*** Prometheus UI is availabe at: "  
oc get route prometheus-operated -o=jsonpath='{@.spec.host}' -n ${NAMESPACE} 
