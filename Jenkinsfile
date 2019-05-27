pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh '''
npm install && npm test'''
      }
    }
    stage('Publish') {
      steps {
        sh 'npm version patch && npm pub'
      }
    }
  }
}