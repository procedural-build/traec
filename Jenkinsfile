pipeline {
  agent {
    docker {
      image 'node:10.14-slim'
      args '-u 0:0'
    }

  }
  stages {
    stage('NPM Install') {
      steps {
        sh 'npm install && npm install -g documentation'
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
    stage('Build Doc & Publish') {
      when {
        branch 'master'
      }
      steps {
        sh 'documentation build src/** -f html -o docs'
        sh 'echo $SECRET && echo "//registry.npmjs.org/:_authToken=${SECRET}" > ~/.npmrc && npm run matchversion && npm run patchversion && npm run pub'
        ftpPublisher paramPublish: null, masterNodeName: '', alwaysPublishFromMaster: true, continueOnError: false, failOnError: true, publishers: [
                                [configName: 'Docs', transfers: [
                                        [asciiMode: false, cleanRemote: false, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "/traec", remoteDirectorySDF: false, removePrefix: 'docs', sourceFiles: 'docs/**']
                                ], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true]
        ]
      }
    }
  }
  environment {
    SECRET = credentials('TOKEN')
    HOME = '.'
  }
  post{
    always{
      cleanWs()
    }
  }
}