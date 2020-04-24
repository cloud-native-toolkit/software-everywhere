# Cluster Variables

variable "cluster_config_file_path" {
  type        = string
  description = "The path to the config file for the cluster"
}

variable "monitoring_tools_namespace" {
  type        = string
  description = "The namespace where prometheus and grafana are installed"
}

variable "liberty_dashboard" {
  type        = string
  description = "The Open Liberty dashboard to install"
  default     = "grafana-dashboard-liberty.yaml"
}