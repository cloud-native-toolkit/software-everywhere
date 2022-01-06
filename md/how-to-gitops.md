# How to build a GitOps module

In the automation module catalog, a GitOps module is a thin terraform module that populates a GitOps repository with the resources necessary to deploy the components to an OpenShift (or vanilla kubernetes) cluster. 

## Anatomy of the GitOps module repository

An automation modules is created from a template repository that includes a skeleton of the module logic and the automation framework to validate and release the module.

### Module logic

The module follows the naming convention of terraform modules:

- **main.tf** - The logic for the module. The structure of the GitOps logic in the **main.tf** file is largely the same from GitOps module to the next with the difference being the yaml provided to populate the GitOps repo
- **variables.tf** - The input variables for the module. A number of modules are defined by default in the module and should remain. Additional variables can be added as needed by the module.
- **outputs.tf** - The output variables for the module. These are rarely used for GitOps modules but can provide values for downstream modules.
- **version.tf** - The minimum required terraform version. Currently, this is defaulted to `v0.15`. If any terraform providers are required by the module they would be added here as well, although this is highly unlikely for GitOps modules.
- **module.yaml** - The metadata descriptor for the module. Each of the automation modules provides a metadata file that describes the name, description, and external dependencies of the module. Metadata for the input variables can also be provided. When a release of the module is created, an automated workflow will supplement the contents of this file with the input and output variables defined in `variables.tf` and `outputs.tf` and publish the result to `index.yaml` on the `gh-pages` branch.
- **scripts/create-yaml.sh** - Script to set up the payload yaml for the GitOps repository in a temporary directory from which the repository will be populated. This script should be customized for the requirements of the module.
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
type: gitops
description: ""
tags:
  - tools
  - gitops
versions:
  - platforms:
      - kubernetes
      - ocp3
      - ocp4
    dependencies:
      - id: gitops
        refs:
          - source: github.com/cloud-native-toolkit/terraform-tools-gitops.git
            version: ">= 1.1.0"
      - id: namespace
        refs:
          - source: github.com/cloud-native-toolkit/terraform-gitops-namespace.git
            version: ">= 1.0.0"
    variables:
      - name: gitops_config
        moduleRef:
          id: gitops
          output: gitops_config
      - name: git_credentials
        moduleRef:
          id: gitops
          output: git_credentials
      - name: server_name
        moduleRef:
          id: gitops
          output: server_name
      - name: namespace
        moduleRef:
          id: namespace
          output: name
      - name: kubeseal_cert
        moduleRef:
          id: gitops
          output: sealed_secrets_cert
```

- **name** - The `name` field is required and must be unique among the other modules. This value is used to reference the module in the Bill of Materials.
- **description** - The `description` should provide a summary of what the module does.
- **tags** - The `tags` are used to provide searchable keywords related to the module.
- **versions** - When the final module metadata is generated, the `versions` array will contain a different entry for each version with a snapshot of the inputs and outputs for that version. In the `module.yaml` file this array should contain a single entry that describes the current version's dependencies and inputs.
- **versions[*].platforms** - The target cluster types and versions supported by the module
- **versions[*].dependencies** - The external modules upon which this module depends. These dependencies are used to offload logic for which this module should not be responsible and retrieve the necessary values from the outputs of these dependencies. Additiaonlly, this allows resources to be shared between modules by referencing to the same external dependency instance.
- **versions[*].variables** - Additional metadata provided for the input variables. When the metadata is generated for the release, the information for all the input variables is read from `variables.tf` and is supplemented with the information provided here. If there is no additional information to add to a variable it can be excluded from `module.yaml`. Examples of variable metadata that can be added: mapping the variable to the output of a dependency or setting the scope of the variable to `global`, `ignore`, or `module` (the default).

**Note:** For most all GitOps modules, the initial dependencies and variable mappings should be preserved. Additional dependencies and variable definitions can be added as needed.

**Note:** As a design point, the gitops module should ideally not have a direct dependency on the cluster and should instead depend (exclusively) on the gitops repository. That way, the cluster itself might be inaccessible by the automation process but the software can still be installed in the cluster so long as the gitops repository is accessible.

### Module test logic

The `test/stages` folder contains the terraform template needed to execute the module. By convention, each module is defined in its own file. Also by convention, all prereqs or dependencies for the module are named `stage1-xxx` and the module to be tested is named `stage2-xxx`. The default test templates in the GitOps repo are set up to provision a GitOps repository, log into a cluster, provision ArgoCD in the cluster and bootstrap it with the GitOps repository, provision a namespace via GitOps where the module will be deployed then apply the module logic. The end result of this test terraform template should be a cluster that has been provisioned with the components of the module via the GitOps repository.

This test logic will run every time a change is made to the repository to ensure there are no regressions to the module.

## GitOps repository structure

The GitOps modules assume the repository has been divided into three different layers to separate the different types of resources that will be provisioned in the cluster:

1. `infrastucture` - the infrastructure layer contains cluster-wide and/or privileged resources like namespaces, rbac configuration, service accounts, and security context constraints. Most modules won't directly use this layer but may use submodules to configure service accounts and rbac that will be put in this layer.
2. `services` - the services layer contains shared middleware and software services that may be used by multiple applications deployed within the cluster. This includes things like databases, service mesh, api management software, or multi-tenanted development tools. Most components will be placed in this layer.
3. `application` - the application layer is where the gitops configuration to deploy applications that make use of the shared services is placed. Often this configuration will be applied to the GitOps repo as part of a CI/CD process to manage the application lifecycle.

Within the layers, there are three different types that can be applied:

1. `operator` - operator deployments are organized in a particular way in the gitops repository
2. `instances` - instances created from custom resources applied via an operator are organized in a different manner in the gitops repository
3. `base` - basically everything that is not an operator or operator instance deployment falls in this category

In order to simplify the process of managing the gitops repository structure and the different configuration options, a command has been provided in the `igc` cli to populate the gitops repo - `igc gitops-module`. The layer and type are provided as arguments to the command as well as the directory where the yaml for the module is located and the details about the gitops repo.

The yaml used to define the resources required to deploy the component can be defined as kustomize scripts, a helm chart, or as raw yaml in the directory. In most cases we use helm charts to simplify the required input configuration.

## Submitting changes

1. Fork the module git repository into your personal org
2. In your forked repository, add the following secrets (note: if you are working in the repo in the Cloud Native Toolkit, these secrets are already available):
   - __IBMCLOUD_API_KEY__ - an API Key to an IBM Cloud account where you can provision the test instances of any resources you need
   - __GIT_ADMIN_USERNAME__ - the username of a git user with permission to create repositories
   - __GIT_ADMIN_TOKEN__ - the personal access token of a git user with permission to create repositories in the target git org
   - __GIT_ORG__ - the git org where test GitOps repos will be provisioned
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
