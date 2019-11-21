#!/usr/bin/env bash

SERVICE_NAME="$1"
SERVICE_NAMESPACE="$2"

kubectl delete "services.ibmcloud/${SERVICE_NAME}" -n "${SERVICE_NAMESPACE}"
