output "olm_namespace" {
  value       = local.operator_namespace
  description = "Namespace where OLM is running. The value will be different between OCP 4.3 and IKS/OCP 3.11"
  depends_on  = [null_resource.deploy_operator_lifecycle_manager]
}

output "target_namespace" {
  value       = local.target_namespace
  description = "Namespace where operatoes will be installed"
  depends_on  = [null_resource.deploy_operator_lifecycle_manager]
}
