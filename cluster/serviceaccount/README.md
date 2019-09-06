# Create Service Account Module

Creates a service account with the name provided. If this module is applied to an OpenShift cluster it will also apply the provided `security context constraints`.
 
## Pre-requisites

This module has the following requirements:

- Kubernetes cli (`kubectl`)
- Openshift cli (`oc`), if working with an openshift cluster
- linux shell environment
