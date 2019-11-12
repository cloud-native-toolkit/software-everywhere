#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd -P)
CHART_DIR=$(cd "${SCRIPT_DIR}/../charts"; pwd -P)

NAMESPACE="$1"
VOLUME_CAPACITY="$2"
STORAGE_CLASS="$3"

if [[ -z "${TMP_DIR}" ]]; then
  TMP_DIR=./tmp
fi

mkdir -p ${TMP_DIR}

YAML_OUTPUT=${TMP_DIR}/jenkins-config.yaml

echo "Creating jenkins-persistent instance"
oc new-app jenkins-ephemeral -n "${NAMESPACE}" \
    -e VOLUME_CAPACITY="${VOLUME_CAPACITY}"

echo "Patching Jenkins deploymentconfig to increase timeout"
kubectl patch deploymentconfig/jenkins -n "${NAMESPACE}" --type=json -p='[{"op": "replace", "path": "/spec/strategy/recreateParams/timeoutSeconds", "value": 1200}]'

JENKINS_HOST=$(oc get route jenkins -n ${NAMESPACE} -o jsonpath='{ .spec.host }')
JENKINS_URL="https://${JENKINS_HOST}"

oc create secret generic jenkins-access -n ${NAMESPACE} --from-literal url=${JENKINS_URL}

helm template ${CHART_DIR}/jenkins-config \
    --name "jenkins-config" \
    --namespace "${NAMESPACE}" \
    --set createJob=false \
    --set jenkins.host=${JENKINS_HOST} \
    --set jenkins.tls=true > ${YAML_OUTPUT}
kubectl apply --namespace ${NAMESPACE} -f ${YAML_OUTPUT}

echo "*** Waiting for Jenkins on ${JENKINS_URL}"
until curl --insecure -Isf "${JENKINS_URL}/login"; do
    echo '>>> waiting for Jenkins'
    sleep 300
done
echo '>>> Jenkins has started'
