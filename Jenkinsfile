pipeline {
  agent none
  stages {
    stage('Test') {
      steps {
        sh '''
export PATH=/usr/local/bin && npm install && npm test'''
      }
    }
    stage('Publish') {
      steps {
        sh 'npm version patch && npm pub'
      }
    }
  }
}