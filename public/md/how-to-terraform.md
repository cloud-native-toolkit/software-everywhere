# How to build a Terraform module

In the automation module catalog, terraform modules are used to provision infrastructure.

## Anatomy of the Terraform module repository

An automation modules is created from a template repository that includes a skeleton of the module logic and the automation framework to validate and release the module.

### Module logic

The module follows the naming convention of terraform modules:

- **main.tf** - The logic for the module. In the template module, this file is empty.
- **variables.tf** - The input variables for the module.
- **outputs.tf** - The output variables for the module. Output variables are used to pass values to downstream modules.
- **version.tf** - The minimum required terraform version. Currently, this is defaulted to `v0.15`. If any terraform providers are required by the module they would be added here as well.
- **module.yaml** - The metadata descriptor for the module. Each of the automation modules provides a metadata file that describes the name, description, and external dependencies of the module. Metadata for the input variables can also be provided. When a release of the module is created, an automated workflow will supplement the contents of this file with the input and output variables defined in `variables.tf` and `outputs.tf` and publish the result to `index.yaml` on the `gh-pages` branch.
- **README.md** - The documentation for the module. An initial readme is provided with instructions at the top and a template for the module documentation at the bottom.

### Module automation

The automation modules rely heavily on [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) automatically validate changes to the module and release new versions. The GitHub Action workflows are found in **.github/workflows**. There are three workflows provided by default:

#### Verify and release module (verify.yaml)

This workflow runs for pull requests against the `main` branch and when changes are pushed to the `main` branch.

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

The `verify` job checks out the module and deploys the terraform template in the `test/stages` folder. (More on the details of this folder in a later section.) It applies the testcase(s) listed in the `strategy.matrix.testcase` variable against the terraform template to validate the module logic. It then runs the `.github/scripts/validate-deploy.sh` to verify that everything was deployed successfully. **Note:** This script should be customized to validate the resources provisioned by the module. After the deploy is completed, the destroy logic is also applied to validate the destroy logic and to clean up after the test. The parameters for the test case are defined in https://github.com/cloud-native-toolkit/action-module-verify/tree/main/env. New test cases can be added via pull request.

The `verifyMetadata` job checks out the module and validates the module metadata against the module metadata schema to ensure the structure is valid.

The `release` job creates a new release of the module. The job only runs if the `verify` and `verifyMetadata` jobs completed successfully AND if the workflow was started from a push to the `main` branch (i.e. not a change to a pull request). The job uses the **release-drafter/release-drafter** GitHub Action to create the release based on the configuration in `.github/release-drafter.yaml`. The configuration looks for labels on the pull request to determine the type of change for the release changelog (`enhancement`, `bug`, `chore`) and which portion of the version number to increment (`major`, `minor`, `patch`).

#### Publish assets (publish-assets.yaml)

This workflow runs when a new release is published (either manually or via an automated process).

```yaml
on:
  release:
    types:
      - published
```

When a release is created, the module is checked out and the metadata is built and validated. If the metadata is checks out then it is published to the `gh-pages` branch as `index.yaml`

#### Notify (notify.yaml)

This workflow runs when a new release is published (either manually or via an automated process).

```yaml
on:
  release:
    types:
      - published
```

When a release is created, a repository dispatch is sent out to the repositories listed in the `strategy.matrix.repo` variable. By default, the `automation-modules` and `ibm-garage-iteration-zero` repositories are notified. When those modules receive the notification, an automation workflow is triggered on their end to deal with the newly available module version.

### Module metadata

The module metadata adds extra descriptive information about the module that is used to build out the module catalog.

```yaml
name: ""
type: terraform
description: ""
tags:
  - tools
  - devops
versions:
  - platforms: []
    #  providers:
    #    - name: ibm
    #      source: "ibm-cloud/ibm"
    dependencies: []
    #    - id: cluster
    #      refs:
    #        - source: github.com/ibm-garage-cloud/terraform-ibm-container-platform
    #          version: ">= 1.7.0"
    #        - source: github.com/ibm-garage-cloud/terraform-k8s-ocp-cluster
    #          version: ">= 2.0.0"
    #    - id: namespace
    #      refs:
    #        - source: github.com/ibm-garage-cloud/terraform-k8s-namespace
    #          version: ">= 2.1.0"
    variables: []
#    - name: cluster_type
#      moduleRef:
#        id: cluster
#        output: type_code
#    - name: cluster_ingress_hostname
#      moduleRef:
#        id: cluster
#        output: ingress_hostname
#    - name: cluster_config_file
#      moduleRef:
#        id: cluster
#        output: config_file_path
#    - name: tls_secret_name
#      moduleRef:
#        id: cluster
#        output: tls_secret_name
#    - name: releases_namespace
#      moduleRef:
#        id: namespace
#        output: name
#        discriminator: tools
```

- **name** - The `name` field is required and must be unique among the other modules. This value is used to reference the module in the Bill of Materials.
- **description** - The `description` should provide a summary of what the module does.
- **tags** - The `tags` are used to provide searchable keywords related to the module.
- **versions** - When the final module metadata is generated, the `versions` array will contain a different entry for each version with a snapshot of the inputs and outputs for that version. In the `module.yaml` file this array should contain a single entry that describes the current version's dependencies and inputs.
- **versions[*].providers** - Terraform providers used by the module. Required if the ibm terraform provider is used
- **versions[*].dependencies** - The external modules upon which this module depends. These dependencies are used to offload logic for which this module should not be responsible and retrieve the necessary values from the outputs of these dependencies. Additionally, this allows resources to be shared between modules by referencing to the same external dependency instance.
- **versions[*].variables** - Additional metadata provided for the input variables. When the metadata is generated for the release, the information for all the input variables is read from `variables.tf` and is supplemented with the information provided here. If there is no additional information to add to a variable it can be excluded from `module.yaml`. Examples of variable metadata that can be added: mapping the variable to the output of a dependency or setting the scope of the variable to `global`, `ignore`, or `module` (the default).

### Module test logic

The `test/stages` folder contains the terraform template needed to execute the module. By convention, each module is defined in its own file. Also by convention, all prereqs or dependencies for the module are named `stage1-xxx` and the module to be tested is named `stage2-xxx`. This test logic will run every time a change is made to the repository to ensure there are no regressions to the module.

## Submitting changes

1. Fork the module git repository into your personal org
2. In your forked repository, add the following secrets (note: if you are working in the repo in the Cloud Native Toolkit, these secrets are already available):
    - __IBMCLOUD_API_KEY__ - an API Key to an IBM Cloud account where you can provision the test instances of any resources you need
3. Create a branch in the forked repository where you will do your work
4. Create a [draft pull request](https://github.blog/2019-02-14-introducing-draft-pull-requests/) in the Cloud Native Toolkit repository for your branch as soon as you push your first change. Add labels to the pull request for the type of change (`enhancement`, `bug`, `chore`) and the type of release (`major`, `minor`, `patch`) to impact the generated release documentation.
5. When the changes are completed and the automated checks are running successfully, mark the pull request as "Ready to review".
6. The module changes will be reviewed and the pull request merged. After the changes are merged, the automation in the repo create a new release of the module.

## Development

### Adding logic and updating the test

1. Start by implementing the logic in `main.tf`, adding required variables to `variables.tf` as necessary.
2. Update the `test/stages/stage2-xxx.tf` file with any of the required variables.
3. If the module has dependencies on other modules, add them as `test/stages/stage1-xxx.tf` and reference the output variables as variable inputs.
4. Review the validation logic in `.github/scripts/validate-deploy.sh` and update as appropriate.
5. Push the changes to the remote branch and review the check(s) on the pull request. If the checks fail, review the log and make the necessary adjustments.
