# IBM Ecosystem terraform modules

This repository contains a collection of terraform modules that
can be used to provision infrastructure and software across multi cloud environments typically into OpenShift
clusters. You can view the modules on the following link.

[Module listing](https://modules.cloudnativetoolkit.dev/)

## Modules not migrated

### SRE Tools

| **Module name**                 | **Module location**                                                      | **Features** | **Latest release** | **Last build status** |
|---------------------------------|--------------------------------------------------------------------------|-------|--------------------|-----------------------|
| *Prometheus Grafana*            | generic/tools/prometheusgrafana_release | | | |
| *LogDNA operator*               | cloud-managed/operator-services/logdna                                   |       | | |
| *SysDig operator*               | cloud-managed/operator-services/sysdig                                   |       | | |

### Middleware

| **Module name**                 | **Module location**                                                      | **Features** | **Latest release** | **Last build status** |
|---------------------------------|--------------------------------------------------------------------------|-------|--------------------|-----------------------|
| *Cloudant*                      | cloud-managed/services/cloudant                                          |       | | |
| *PostGreSQL*                    | cloud-managed/services/postgres                                          |       | | |
| *AppId operator*                | cloud-managed/operator-services/appid                                    |       | | |
| *Cloud Object Storage operator* | cloud-managed/operator-services/cloud_object_storage                     |       | | |
| *Cloudant operator*             | cloud-managed/operator-services/cloudant                                 |       | | |
| *PostGreSQL operator*           | cloud-managed/operator-services/postgres                                 |       | | |

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


