pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
    skipDefaultCheckout(true)
  }

  parameters {
    string(name: 'BRANCH', defaultValue: 'main', description: 'Branch to build')
    booleanParam(name: 'DOCKER_PUSH', defaultValue: false, description: 'Push Docker image after build')
  }

  environment {
    APP_NAME = 'simple-node-ci'
    DOCKER_IMAGE = "${env.APP_NAME}:${env.BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        echo "Checking out branch ${params.BRANCH}"
        checkout([$class: 'GitSCM', branches: [[name: "*/${params.BRANCH}"]], userRemoteConfigs: [[url: 'https://github.com/Herit1974/jenkin-pipeline-2.git']]])
      }
    }

    stage('Install') {
      steps {
        script {
          echo "Installing dev deps (mocha + reporter)..."
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }

    stage('Lint') {
      steps {
        echo 'Running lint (quick placeholder)...'
        script { if (isUnix()) sh 'npm run lint' else bat 'npm run lint' }
      }
    }

    stage('Unit Tests') {
      steps {
        echo 'Running unit tests (Mocha -> JUnit XML)...'
        script {
          if (isUnix()) {
            sh 'mkdir -p test-results || true'
            sh 'npm test'
          } else {
            bat 'if not exist test-results mkdir test-results'
            bat 'npm test'
          }
        }
      }
      post {
        always {
          junit 'test-results/*.xml'
        }
      }
    }

    stage('Build') {
      steps {
        echo 'Building (creating dist/)'
        script { if (isUnix()) sh 'npm run build' else bat 'npm run build' }
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Docker Build (optional)') {
      when { expression { return fileExists('Dockerfile') } }
      steps {
        echo "Building Docker image ${env.DOCKER_IMAGE}"
        script {
          if (isUnix()) {
            sh "docker build -t ${env.DOCKER_IMAGE} . || true"
          } else {
            bat "docker build -t ${env.DOCKER_IMAGE} . || exit 0"
          }
        }
      }
    }

    stage('Finalize') {
      steps {
        echo 'Pipeline complete — see artifacts and test report'
      }
    }
  }

  post {
    success { echo "SUCCESS: ${env.BUILD_URL}" }
    failure { echo "FAILED: check console" }
    always { cleanWs() }
  }
}
