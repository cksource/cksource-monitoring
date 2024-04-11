terraform {
  required_version = ">= 1.7.4, < 2"

  required_providers {
    aws = ">= 5"
  }

  backend "s3" {
    bucket              = "cksource-ci-terraform-states"
    key                 = "cksource/cksource-monitoring/aws"
    region              = "eu-central-1"
    allowed_account_ids = [955517586947]
    profile             = "dev"
  }
}

provider "aws" {
  allowed_account_ids = [711372962861]
  region              = "us-east-1"
}
