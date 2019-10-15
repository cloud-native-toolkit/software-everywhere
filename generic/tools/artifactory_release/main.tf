locals {
  tmp_dir                = "${path.cwd}/.tmp"
  ingress_host           = "artifactory.${var.cluster_ingress_hostname}"
  ingress_url            = "http://${local.ingress_host}"
  values_file            = "${path.module}/artifactory-values.yaml"
  config_name            = "artifactory-config"
  secret_name            = "artifactory-access"
}

resource "null_resource" "artifactory_release" {
  provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-artifactory.sh ${var.releases_namespace} ${local.ingress_host} ${local.values_file} ${var.chart_version} ${var.service_account} ${var.tls_secret_name}"

    environment = {
      KUBECONFIG_IKS = "${var.cluster_config_file}"
      STORAGE_CLASS  = "${var.storage_class}"
      TMP_DIR        = "${local.tmp_dir}"
    }
  }

  provisioner "local-exec" {
    when    = "destroy"
    command = "${path.module}/scripts/destroy-artifactory.sh ${var.releases_namespace}"

    environment = {
      KUBECONFIG_IKS = "${var.cluster_config_file}"
    }
  }
}
