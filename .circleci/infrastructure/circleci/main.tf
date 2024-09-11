terraform {
  required_version = ">= 1.7.4, < 2"

  required_providers {
    circleci = {
      source = "mrolla/circleci"
    }
  }

  backend "s3" {
    bucket = "cksource-ci-terraform-states"
    key    = "cksource/tiugo-monitoring/circleci"
    region = "eu-central-1"
  }
}

provider "circleci" {
  api_token    = var.api_token
  vcs_type     = "github"
  organization = local.organization
}

locals {
  organization = "cksource"
  project      = "tiugo-monitoring"

  env_variables = {
    AWS_OIDC_ROLE_ARN = data.terraform_remote_state.aws.outputs.oidc_role_arn
  }
}

resource "circleci_environment_variable" "env_variable" {
  for_each = local.env_variables

  name    = each.key
  value   = each.value
  project = local.project
}

data "terraform_remote_state" "aws" {
  backend = "s3"

  config = {
    bucket = "cksource-ci-terraform-states"
    key    = "cksource/${local.project}/aws"
    region = "eu-central-1"
  }
}
