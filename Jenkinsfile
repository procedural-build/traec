pipeline {
  agent {
    docker {
      image 'node:10.14-slim'
    }

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
        withEnv(overrides: ["JEST_JUNIT_OUTPUT=./jest-test-results.xml"]) {
          sh 'npm test -- --ci --testResultsProcessor="jest-junit"'
        }

        junit 'jest-test-results.xml'
      }
    }
    stage('Publish') {
      parallel {
        stage('Publish') {
          when {
            branch 'master'
          }
          steps {
            sh 'echo $SECRET && echo "//registry.npmjs.org/:_authToken=${SECRET}" > ~/.npmrc && npm run matchversion && npm run patchversion && npm run pub'
          }
        }
        stage('Build Docs') {
          steps {
            sh 'documentation build src/** -f html -o docs'
          }
        }
      }
    }
  }
  environment {
    SECRET = credentials('TOKEN')
  }
}