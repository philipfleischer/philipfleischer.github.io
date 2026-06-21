---
title: "Terraform Azure Cloud Lab"
subtitle: "Infrastructure as Code lab using Terraform and Azure, covering providers, resources, state management, variables, outputs, planning, deployment, and teardown workflows."
image: "/img/Pipeline.png"
tags: ["Terraform", "Azure", "IaC", "Cloud", "DevOps", "CLI"]
topics: ["Cloud / DevOps"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Cloud_Tutorial"
---

A structured lab for learning Infrastructure as Code (IaC) using Terraform against the Azure cloud provider. The repository follows a progression from basic resource provisioning to multi-module, variable-driven deployments.

## What this covers

### Terraform fundamentals
- Provider configuration for `azurerm`, authentication via service principal and environment variables
- Understanding Terraform's three-stage workflow: `plan` → `apply` → `destroy`
- **State management** — local state vs. remote state in Azure Blob Storage, state locking, and why shared state is critical for team environments
- `terraform.tfstate` inspection and the risks of manual state edits

### Resource provisioning
- **Virtual Networks and Subnets** — VNet address spaces, NSG rules, peering
- **Virtual Machines** — Linux VMs with cloud-init scripts, SSH key authentication, public IP assignment
- **Storage accounts** — blob containers, access tiers, lifecycle management policies
- **Azure Container Registry** — building and pushing Docker images for deployment

### Variable-driven configuration
- `variables.tf` with type constraints, default values, and validation rules
- `terraform.tfvars` for environment-specific overrides (dev/staging/prod separation)
- `outputs.tf` to expose resource IDs and endpoints for use in downstream steps

### Modules and reusability
- Extracting repeated patterns (e.g., "VM + NIC + NSG") into reusable local modules
- Module source referencing and version pinning

## Why IaC matters
The core lesson from this lab: infrastructure that isn't code is infrastructure that can't be reviewed, diffed, or reproduced reliably. Terraform's declarative model makes the gap between "what I think I deployed" and "what is actually deployed" visible.
