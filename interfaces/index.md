# Automation module interfaces

Module interfaces can be used in one of two ways:

- Marker interface to identify modules of a similar type
- Enforce/validate inputs and/or outputs of a module

## Available interfaces

- [Cluster](cluster.yaml)
- [IBM Service](ibm-service.yaml)
- [Sync](sync.yaml)
- [IBM VPC Resource](ibm-vpc-resource.yaml)

## Usage

### Module definition

The module metadata defines an `interfaces` field where a list of interface ids can be provided. During the module build and release process, the defined variables and outputs are validated against the interface definition(s). If the module does not adhere to the interface definition then the build and release process will fail.

```yaml
name: ibm-iks-vpc
alias: cluster
type: terraform
description: Provisions an IBM Cloud IKS cluster
interfaces:
  - github.com/cloud-native-toolkit/automation-modules#cluster
  - github.com/cloud-native-toolkit/automation-modules#sync
tags:
  - iks
  - cluster
  - vpc
```

### Module references

The module metadata also defines a `dependencies` section to identify external dependencies of the module. Originally, objects in the dependencies section only supported a `refs` value that directly identified the dependent module(s). The latest version of the metadata includes the option to define the modules that can fulfill the dependency by providing the id of the `interface` that satisfies the requirement. The tool that generates the terraform template will find a module that implements the interface if a module is not explicitly provided.

```yaml
name: ibm-iam-service-authorization
alias: service-authorization
type: terraform
description: Module to create an authorization policy that will allow one service to access another.
tags:
    - iam
    - service
    - authorization
    - policy
versions:
- platforms: []
  dependencies:
    - id: source_resource
      interface: github.com/cloud-native-toolkit/garage-terraform-modules#ibm-service
      optional: true
    - id: target_resource
      interface: github.com/cloud-native-toolkit/garage-terraform-modules#ibm-service
      optional: true
```
