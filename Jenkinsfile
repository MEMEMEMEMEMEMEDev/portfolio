pipeline {
  agent { label 'aegis' }

  environment {
    REGISTRY      = 'registry.homelab.local:5000'
    IMAGE         = 'portfolio'
    GITOPS_OWNER  = 'MEMEMEMEMEMEMEDev'
    GITOPS_REPO   = 'homelab-gitops'
    GITOPS_BRANCH = 'main'
    MANIFEST_PATH = 'portfolio/portfolio.yaml'
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.SHORTSHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          env.TAG      = "${env.BUILD_NUMBER}-${env.SHORTSHA}"
          if (!(env.TAG ==~ /^[A-Za-z0-9._-]+$/)) { error "TAG invalido: ${env.TAG}" }
          echo "TAG: ${env.TAG}"
        }
      }
    }

    stage('Build & Push') {
      steps {
        script {
          docker.withRegistry("https://${REGISTRY}", 'registry-cred') {
            def img = docker.build("${REGISTRY}/${IMAGE}:${TAG}")
            img.push()
          }
          echo "Pushed: ${REGISTRY}/${IMAGE}:${TAG}"
        }
      }
    }

    stage('Update GitOps') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-https', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PAT')]) {
          sh '''#!/usr/bin/env bash
          set -euo pipefail
          TMP="$(mktemp -d)"
          trap 'rm -rf "$TMP"' EXIT
          set +x
          REPO_URL="https://${GIT_USER}:${GIT_PAT}@github.com/${GITOPS_OWNER}/${GITOPS_REPO}.git"
          set -x
          git clone -b "${GITOPS_BRANCH}" "${REPO_URL}" "${TMP}"
          FULL_IMAGE="${REGISTRY}/${IMAGE}:${TAG}"
          if command -v yq >/dev/null 2>&1; then
            yq -i '(.spec.template.spec.containers[] | select(has("image")) | .image) = strenv(FULL_IMAGE)' "${TMP}/${MANIFEST_PATH}" || yq -i '(.image) = strenv(FULL_IMAGE)' "${TMP}/${MANIFEST_PATH}"
          else
            sed -i -E "s|^(\\s*image:\\s*)${REGISTRY}/${IMAGE}:[^\\s]+|\\1${FULL_IMAGE}|" "${TMP}/${MANIFEST_PATH}"
          fi
          kubectl apply --dry-run=client -f "${TMP}/${MANIFEST_PATH}" >/dev/null
          git -C "${TMP}" config user.name  "Jenkins CI"
          git -C "${TMP}" config user.email "ci@homelab.local"
          git -C "${TMP}" add "${MANIFEST_PATH}"
          git -C "${TMP}" commit -m "portfolio: ${TAG}" || echo "Nada que commitear"
          for i in 1 2 3; do
            if git -C "${TMP}" push origin "${GITOPS_BRANCH}"; then
              echo "Push ok ${i}"
              break
            fi
            sleep 2
            git -C "${TMP}" pull --rebase origin "${GITOPS_BRANCH}" || true
            if [ "${i}" -eq 3 ]; then exit 1; fi
          done
          '''
        }
      }
    }
  }

  post {
    always {
      echo "Build -> ${REGISTRY}/${IMAGE}:${TAG}"
    }
  }
}
          