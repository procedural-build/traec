pipeline {
  agent {
    docker {
      image 'node:10.14-slim'
    }

  }
environment {
        SECRET = credentials('TOKEN')
    }

  stages {
    stage('Test') {
      steps {
        sh ' echo "beginning NPM" && npm install && npm test'
      }
    }
    stage('Publish') {
      steps {
              sh 'echo $SECRET && echo "//registry.npmjs.org/:_authToken=${SECRET}" > ~/.npmrc && npm version patch && npm pub'
      }
    }
  }

}