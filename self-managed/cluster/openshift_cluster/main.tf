provider "null" {
}

locals {
  config_file_path       = ""
}

resource "null_resource" "oc_login" {
  count      = "${var.cluster_type == "openshift" ? "1": "0"}"

  provisioner "local-exec" {
    command = "oc login --insecure-skip-tls-verify=true -u ${var.login_user} -p ${var.ibmcloud_api_key} --server=${var.server_url} > /dev/null"
  }
}
