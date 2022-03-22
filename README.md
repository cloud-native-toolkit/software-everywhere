# Software Everywhere

Software Everywhere aims to make it automate the provisioning of Red Hat OpenShift and deployment and use IBM Software in any environment. The automation is provided as a set of reusable modules that can be put together into different composite solutions.

## Automation solutions

A number of common reference architectures have been defined in the [automation solutions](https://github.com/cloud-native-toolkit/automation-solutions) repository.

## Automation modules

The full catalog of automation modules is available from https://modules.cloudnativetoolkit.dev. The user interface is built from source in `src/` and the contents of the catalog are defined in `catalog.yaml`. Whenever the repository is changed a GitHub Action is triggered to build the user interface and build the catalog from the module metadata in each of the module repositories.

## Generating automation from a Bill of Materials

The [iascable](https://github.com/cloud-native-toolkit/iascable) cli is used to generate an automation bundle from a Bill of Materials. The Bill of Materials is a yaml file that defines the modules that should go into an automation template.

For example, the following will generate automation to provision Maximo Application Suite Core on an existing cluster:

```yaml
apiVersion: cloud.ibm.com/v1alpha1
kind: BillOfMaterial
metadata:
  name: 400-gitops-cp-maximo
  labels:
    code: '400'
  annotations:
    displayName: Maximo
    description: GitOps deployment of Maximo Core on OpenShift
spec:
  modules:
    - name: ocp-login
    - name: gitops-repo
    - name: gitops-bootstrap
    
    # IBM Suite License Service
    - name: gitops-namespace
      alias: sls-namespace
    - name: gitops-cp-sls
      dependencies:
        - name: namespace
          ref: sls-namespace
      variables:
        - name: namespace
          value: ibm-sls           
        - name: cluster_ingress
          scope: global
          
    # Mongo CE
    - name: gitops-namespace
      alias: mongo-namespace
    - name: gitops-mongo-ce-operator
      dependencies:
        - name: namespace
          ref: mongo-namespace
      variables: 
        - name: namespace
          value: mongo            

    - name: gitops-mongo-ce
      dependencies:
        - name: namespace
          ref: mongo-namespace    
      variables:
        - name: namespace
          value: mongo

    # IBM Behavior Analysis Service       
    - name: gitops-namespace
      alias: bas-namespace
    - name: gitops-cp-bas
      dependencies:
        - name: namespace
          ref: bas-namespace
      variables:
        - name: namespace
          value: masbas 

    # Maximo Core
    - name: gitops-cp-maximo
      variables:
        - name: instanceid
          ref: mas8
        - name: cluster_ingress
          scope: global          
```

## How to apply a module

In order to use one of these modules, a terraform script should be created that references the desired module(s). For example, to use the `ibmcloud_cluster` module to provision a cluster, the following would be required:

```

terraform {
  required_providers {
    ibm = {
      source = "ibm-cloud/ibm"
    }
  }
  required_version = ">= 0.13"
}

provider "ibm" {
  ibmcloud_api_key = var.ibmcloud_api_key
  region = var.region
}

module "cluster" {
  source = "cloud-native-toolkit/ocp-vpc/ibm"

  resource_group_name = var.resource_group_name
  region              = var.region
  ibmcloud_api_key    = var.ibmcloud_api_key
  name                = var.cluster_name
  worker_count        = var.worker_count
  ocp_version         = var.ocp_version
  exists              = var.cluster_exists
  name_prefix         = var.name_prefix
  vpc_name            = module.vpc.name
  vpc_subnet_count    = module.subnet.subnet_count
  vpc_subnets         = module.subnet.subnets
  cos_id              = module.cos.id
}
```

where:
- `CLUSTER_NAME` is any name you want for your terraform script
- `source` points to the module folder in this repo
- `${var.xxx}` refers to a variable in your terraform script. All of the variables defined within the module's `variables.tf` file need to be provided a value, either through the terraform script or through a default value in the variables.tf file itself

**Note:** If you want to refer to a specific version of a module identified by a branch or tag within the repo, you can add `ref` to the end of the repo url. E.g. github.com/ibm-garage-cloud/garage-terraform-modules/cluster/ibmcloud_cluster?ref=v1.0.0

For more information on Terraform modules see https://www.terraform.io/docs/modules/index.html

## Contribution

We want the broader IBM and Partner  teams to contribute to this work to help scale and grow skills and accelerate projects.

Read the following contribution guidelines to help support the work.

- [Developer Contribution](https://modules.cloudnativetoolkit.dev/#/contributing)
- [Governance Process](./governance.md)


