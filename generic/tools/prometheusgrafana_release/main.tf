provider "null" {
}

resource "null_resource" "prometheus-operator" {

    triggers = {
        kubeconfig = var.cluster_config_file_path
        prometheus_namespace = var.monitoring_tools_namespace
    }

    provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-prometheus-operator.sh ${self.triggers.prometheus_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }

  provisioner "local-exec" {
    when    = destroy
    command = "${path.module}/scripts/destroy-prometheus-operator.sh ${self.triggers.prometheus_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }
}

resource "null_resource" "prometheus" {
    depends_on = [null_resource.prometheus-operator]

    triggers = {
        kubeconfig = var.cluster_config_file_path
        prometheus_namespace   = var.monitoring_tools_namespace
    }

    provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-prometheus.sh ${self.triggers.prometheus_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
    
  }

    provisioner "local-exec" {
    when    = destroy
    command = "${path.module}/scripts/destroy-prometheus.sh ${self.triggers.prometheus_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }
}

resource "null_resource" "grafana-operator" {
    depends_on = [null_resource.prometheus]

    triggers = {
        kubeconfig = var.cluster_config_file_path
        grafana_namespace = var.monitoring_tools_namespace
    }

    provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-grafana-operator.sh ${self.triggers.grafana_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }

    provisioner "local-exec" {
    when    = destroy
    command = "${path.module}/scripts/destroy-grafana-operator.sh ${self.triggers.grafana_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }
}

resource "null_resource" "grafana" {
    depends_on = [null_resource.grafana-operator]

    triggers = {
        kubeconfig = var.cluster_config_file_path
        grafana_namespace = var.monitoring_tools_namespace
    }

    provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-grafana.sh ${self.triggers.grafana_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }

  provisioner "local-exec" {
    when    = destroy
    command = "${path.module}/scripts/destroy-grafana.sh ${self.triggers.grafana_namespace}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }
}

resource "null_resource" "grafana-liberty-dashboard" {
    depends_on = [null_resource.grafana]

    triggers = {
        kubeconfig = var.cluster_config_file_path
        grafana_namespace = var.monitoring_tools_namespace
        liberty_dashboard = var.liberty_dashboard
    }

    provisioner "local-exec" {
    command = "${path.module}/scripts/deploy-grafana-dashboard.sh ${self.triggers.grafana_namespace} ${self.triggers.liberty_dashboard}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
    }

    provisioner "local-exec" {
    when    = destroy
    command = "${path.module}/scripts/destroy-grafana-dashboard.sh ${self.triggers.grafana_namespace} ${self.triggers.liberty_dashboard}"

    environment = {
      KUBECONFIG = self.triggers.kubeconfig
    }
  }
}
