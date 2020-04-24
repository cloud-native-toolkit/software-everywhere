#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
MODULE_DIR=$(cd ${SCRIPT_DIR}/..; pwd -P)

NAMESPACE="$1"

echo "*** creating target namespace for monitoring tools stack.."
oc new-project "${NAMESPACE}" 1> /dev/null 2> /dev/null || true
echo '>>> namespace is created'

YAML_TEMPLATE=${MODULE_DIR}/yaml/rbac.yaml
YAML_FILE=${MODULE_DIR}/yaml/_generated/rbac.yaml
sed 's/replace-me/'"$NAMESPACE"'/g' $YAML_TEMPLATE > $YAML_FILE

echo "*** applying RBAC policies to allow cross-namespace monitoring by Prometheus.."
oc apply -f ${YAML_FILE} -n ${NAMESPACE} 

YAML_TEMPLATE=${MODULE_DIR}/yaml/operator-group.yaml
YAML_FILE=${MODULE_DIR}/yaml/_generated/operator-group.yaml
sed 's/replace-me/'"$NAMESPACE"'/g' $YAML_TEMPLATE > $YAML_FILE

echo "*** creating Operator group.."
oc apply -f ${YAML_FILE} -n ${NAMESPACE} 
echo '>>> Operator group is created'


echo "*** creating Prometheus operator in target namespace.." 
YAML_FILE=${MODULE_DIR}/yaml/prometheus-operator.yaml
oc apply -f ${YAML_FILE} -n ${NAMESPACE}

sleep 30
until oc get crd prometheuses.monitoring.coreos.com -n ${NAMESPACE} 1> /dev/null 2> /dev/null 
do
    echo '>>> waiting for Prometheus operator availability'
    sleep 30
done
echo '>>> Prometheus operator is available'


