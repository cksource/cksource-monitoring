output "env_variables" {
  value = { for r in circleci_environment_variable.env_variable : r.name => local.env_variables[r.name] }
}
