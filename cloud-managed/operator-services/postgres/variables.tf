variable "resource_group_name" {
  type        = "string"
  description = "Existing resource group where the IKS cluster will be provisioned."
}

variable "resource_location" {
  type        = "string"
  description = "Location for resources to be provisioned (e.g. \"us-east\")."
}

variable "server_exists" {
  type        = "string"
  description = "Flag indicating whether a database server already exists (true or false)"
}

variable "cluster_id" {
  type        = "string"
  description = "Id of the cluster"
}

variable "tools_namespace" {
  type        = "string"
  description = "Tools namespace"
}

variable "dev_namespace" {
  type        = "string"
  description = "Development namespace"
}

variable "test_namespace" {
  type        = "string"
  description = "Test namespace"
}

variable "staging_namespace" {
  type        = "string"
  description = "Staging namespace"
}

variable "name_prefix" {
  type        = "string"
  description = "The prefix name for the service. If not provided it will default to the resource group name"
  default     = ""
}

variable "plan" {
  type        = "string"
  description = "The type of plan the service instance should run under (standard)"
  default     = "standard"
}

variable "service_namespace" {
  type        = "string"
  description = "The namespace where the service obj will be created"
}

variable "cluster_config_file" {
  type        = "string"
  description = "Cluster config file for Kubernetes cluster."
}
