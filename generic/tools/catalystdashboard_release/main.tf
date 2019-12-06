locals {
  tmp_dir      = "${path.cwd}/.tmp"
  ingress_host = "dashboard.${var.cluster_ingress_hostname}"
}

resource "null_resource" "catalystdashboard_release" {
  provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-catalystdashboard.sh ${var.releases_namespace} ${var.cluster_type} dashboard ${var.cluster_ingress_hostname} ${var.image_tag} \"${jsonencode(var.tool_config_maps)}\""

    environment = {
      KUBECONFIG_IKS  = "${var.cluster_config_file}"
      TLS_SECRET_NAME = "${var.tls_secret_name}"
      TMP_DIR         = "${local.tmp_dir}"
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
