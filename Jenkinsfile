pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Publish') {
      steps {
        sh 'npm pub'
      }
    }
  }
}