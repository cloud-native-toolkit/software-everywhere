# Contributing

There are a number of ways to contribute to the work of building and verifying the automation modules 

## Use the modules



## Create a new module

If you've searched the catalog and can't find the module you need, you can request a new module be created, and optionally provide the implementation for the module.

1. Submit a new module request to the Automation Module repository - https://github.com/cloud-native-toolkit/automation-modules
    1. In the request provide the type of module, target platform (if applicable), and the name of the component being provisioned or configured.
    2. When the request is approved, a module will be created based on a template repository in the Cloud Native Toolkit org with the URL to the new git repo provided in the comments of the request.

## Update an existing module

Create an issue in the module repository detailing the bug or feature request

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
