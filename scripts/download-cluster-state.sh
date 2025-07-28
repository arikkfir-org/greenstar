#!/usr/bin/env bash

REPO_NAME="arikkfir-org/greenstar"
RUN_ID="${1}"

set -euo pipefail

# Use GitHub CLI to find the last run of the verify workflow for that commit
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it to use this script." >&2
    exit 1
fi

# Check if user is authenticated with GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "You are not authenticated with GitHub CLI. Please run 'gh auth login' first." >&2
    exit 1
fi

# Obtain the workflow run ID if it has not been provided
if [[ -z "${RUN_ID}" ]]; then

  # Get the most recent commit in the current branch
  COMMIT=$(git rev-parse HEAD)
  echo "Most recent commit: ${COMMIT}" >&2

  echo "Finding the last run of the verify workflow for commit ${COMMIT}..." >&2
  RUN_ID=$(gh run list --repo "${REPO_NAME}" --workflow="Build" --commit="${COMMIT}" --json databaseId --jq '.[0].databaseId')

  if [ -z "${RUN_ID}" ]; then
      echo "No verify workflow run found for commit ${COMMIT}" >&2
      exit 1
  fi

  echo "Found workflow run ID: ${RUN_ID}" >&2

fi

# Download the cluster-state artifact
TARGET_DIR="./hack/cluster-state/${RUN_ID}"
if [ -d "${TARGET_DIR}" ]; then
    echo "Removing existing ${TARGET_DIR} directory..."
    rm -rf "${TARGET_DIR}"
fi
mkdir -p "${TARGET_DIR}"

echo "Downloading cluster-state artifact from workflow run ${RUN_ID}..." >&2
gh run download "${RUN_ID}" --repo "${REPO_NAME}" --name cluster-state --dir "./hack/cluster-state/${RUN_ID}"
