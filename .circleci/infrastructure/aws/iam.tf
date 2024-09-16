locals {
  project = "tiugo-monitoring"
}

resource "aws_iam_role" "oidc" {
  name_prefix = "ci-${local.project}-oidc-"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AssumeRole",
        "Effect" : "Allow",
        "Principal" : {
          "Federated" : data.terraform_remote_state.common.outputs.oidc.provider_arn
        },
        "Action" : "sts:AssumeRoleWithWebIdentity"
        "Condition" : {
          "StringLike" : {
            "${data.terraform_remote_state.common.outputs.oidc.provider}/org/${data.terraform_remote_state.common.outputs.oidc.organization_id}:sub" : "org/${data.terraform_remote_state.common.outputs.oidc.organization_id}/project/ec337855-c20c-4c4d-9aaf-dcb87cb7cb94/user/*"
          }
        }
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::711372962861:policy/ITECRPolicy",
  ]

  inline_policy {}

  lifecycle {
    create_before_destroy = true
  }
}

data "terraform_remote_state" "common" {
  backend = "s3"

  config = {
    bucket  = "cksource-ci-terraform-states"
    key     = "cksource/prod/circleci/common"
    region  = "eu-central-1"
    profile = "dev"
  }
}
