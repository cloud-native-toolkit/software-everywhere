provider "null" {
}

locals {
  tmp_dir               = "${path.cwd}/.tmp"
  secret_name           = "jenkins-access"
  config_name           = "jenkins-config"
  ingress_host          = "jenkins.${var.cluster_ingress_hostname}"
  ingress_url           = "${var.cluster_type == "openshift" ? "https" : "http"}://${local.ingress_host}"
}

resource "null_resource" "jenkins_release_iks" {
  count = "${var.cluster_type != "openshift" ? "1" : "0"}"

  provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-jenkins.sh ${var.releases_namespace} ${local.ingress_host} ${var.helm_version} ${var.tls_secret_name}"

    environment = {
      KUBECONFIG    = "${var.cluster_config_file}"
      STORAGE_CLASS = "${var.storage_class}"
      TMP_DIR       = "${local.tmp_dir}"
      EXCLUDE_POD_NAME = "deploy"
    }
  }

  provisioner "local-exec" {
    when    = "destroy"
    command = "${path.module}/scripts/destroy-jenkins.sh ${var.releases_namespace}"

    environment = {
      KUBECONFIG_IKS = "${var.cluster_config_file}"
    }
  }
}

resource "null_resource" "jenkins_release_openshift" {
  count = "${var.cluster_type == "openshift" ? "1" : "0"}"

  provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-jenkins-openshift.sh ${var.releases_namespace} ${var.volume_capacity} ${var.storage_class}"

    environment = {
      TMP_DIR    = "${local.tmp_dir}"
      SERVER_URL = "${var.server_url}"
    }
  }

  provisioner "local-exec" {
    when    = "destroy"
    command = "${path.module}/scripts/destroy-jenkins.sh ${var.releases_namespace}"
  }
}
