locals {
  tmp_dir      = "${path.cwd}/.tmp"
  ingress_host = "dashboard.${var.cluster_ingress_hostname}"
}

resource "null_resource" "catalystdashboard_release" {
  provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-catalystdashboard.sh ${var.releases_namespace} ${local.ingress_host} \"${jsonencode(var.tool_config_maps)}\""

    environment = {
      KUBECONFIG_IKS = "${var.cluster_config_file}"
      TMP_DIR        = "${local.tmp_dir}"
    }
  }

  provisioner "local-exec" {
    when    = "destroy"
    command = "${path.module}/scripts/destroy-catalystdashboard.sh ${var.releases_namespace}"

    environment = {
      KUBECONFIG_IKS = "${var.cluster_config_file}"
    }
  }
}
