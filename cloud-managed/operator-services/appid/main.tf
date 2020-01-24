locals {
  short_name         = "appid"
  namespaces         = ["${var.dev_namespace}", "${var.test_namespace}", "${var.staging_namespace}"]
  name_prefix        = "${var.name_prefix != "" ? var.name_prefix : var.resource_group_name}"
  region             = "${var.resource_location == "us-east" ? "us-south" : var.resource_location}"
  service_name       = "${replace(local.name_prefix, "/[^a-zA-Z0-9_\\-\\.]/", "")}-${local.short_name}"
  service_class      = "appid"
  binding_name       = "binding-${local.short_name}"
  binding_namespaces = "${jsonencode(local.namespaces)}"
  role               = "Manager"
}

// AppID - App Authentication
resource "null_resource" "deploy_appid" {
  provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-service.sh ${local.service_name} ${var.service_namespace} ${var.plan} ${local.service_class} ${local.binding_name} ${local.binding_namespaces}"

    environment {
      KUBECONFIG_IKS = "${var.cluster_config_file}"
      REGION         = "${local.region}"
      RESOURCE_GROUP = "${var.resource_group_name}"
      TMP_DIR        = "${path.cwd}/.tmp"
      CLUSTER_NAME   = "${var.cluster_name}"
    }
  }

  provisioner "local-exec" {
    when    = "destroy"
    command = "${path.module}/scripts/destroy-service.sh ${local.service_name} ${var.service_namespace}"
  }
}

resource "null_resource" "appid_bind_credentials" {
  depends_on = ["null_resource.deploy_appid"]

  provisioner "local-exec" {
    command = "${path.module}/scripts/bind-classic-credentials.sh ${local.service_name} ${local.role} ${var.cluster_name} ${var.tools_namespace}"

    environment {
      KUBECONFIG_IKS = "${var.cluster_config_file}"
    }
  }
}
