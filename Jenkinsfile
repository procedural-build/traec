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
    stage('NPM Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {

      steps {
        sh ' echo "beginning NPM" && npm test'
        withEnv(["JEST_JUNIT_OUTPUT=./jest-test-results.xml"]) {
          sh 'npm run test-ci --testResultsProcessor="jest-junit"'
        }
        }
        post {
          always {
            sh 'ls'
            junit 'jest-test-results.xml'
          }
        }
      }

    stage('Publish') {
      when {
        branch 'master'
      }
      steps {
        sh 'echo $SECRET && echo "//registry.npmjs.org/:_authToken=${SECRET}" > ~/.npmrc && npm run matchversion && npm run patchversion && npm run pub'
      }
    }
  }

}