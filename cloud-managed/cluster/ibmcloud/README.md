# IBM Cloud Cluster Module

This module interacts with a kubernetes cluster on IBM Cloud public. It can be used to create a new
cluster or to connect with an existing cluster. When creating a new cluster, the type can be set to
either `kubernetes` or `openshift`.

## Pre-requisites

This module has the following pre-requisites in order to run:

- `IBM Cloud` CLI must be installed. Information on installing the cli can be found here - https://cloud.ibm.com/docs/cli?topic=cloud-cli-getting-started
- `kubectl` CLI must be installed
- Linux shell environment

## Example usage

```hcl-terraform
module "dev_cluster" {
  source = "github.com/ibm-garage-cloud/garage-terraform-modules.git//cloud-managed/cluster/ibmcloud?ref=v2.4.5"

  resource_group_name     = var.resource_group_name
  cluster_name            = var.cluster_name
  private_vlan_id         = var.private_vlan_id
  public_vlan_id          = var.public_vlan_id
  vlan_datacenter         = var.vlan_datacenter
  cluster_region          = var.vlan_region
  kubeconfig_download_dir = var.user_home_dir
  cluster_machine_type    = var.cluster_machine_type
  cluster_worker_count    = var.cluster_worker_count
  cluster_hardware        = var.cluster_hardware
  cluster_type            = var.cluster_type
  cluster_exists          = var.cluster_exists
  ibmcloud_api_key        = var.ibmcloud_api_key
  name_prefix             = var.name_prefix
  is_vpc                  = false
}
```