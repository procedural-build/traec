pipeline {
  agent {
    docker {
      image 'node:10.14-slim'
      args '-u 0:0'
    }

  }
environment {
        SECRET = credentials('TOKEN')
        SLACK = credentials('slack')
        HOME = '.'
    }

  stages {
    stage('NPM Install') {
      steps {
        sh 'npm install && npm install -g documentation'
      }
    }
    stage('Test') {
      steps {
        withEnv(["JEST_JUNIT_OUTPUT=./jest-test-results.xml"]) {
          sh 'npm test -- --ci --coverage --testResultsProcessor="jest-junit"'
        }
        }
        post {
          always {
            junit 'jest-test-results.xml'
          }
      }
    }
    stage('Build & Publish NPM and Docs') {
      when {
        branch 'master'
      }
      steps {
        sh 'documentation build src/** -f html -o docs'
        sh 'echo $SECRET && echo "//registry.npmjs.org/:_authToken=${SECRET}" > ~/.npmrc && npm run matchversion && npm run patchversion && npm run pub'
        ftpPublisher paramPublish: null, masterNodeName: '', alwaysPublishFromMaster: true, continueOnError: false, failOnError: true, publishers: [
                                [configName: 'Docs', transfers: [
                                        [asciiMode: false, cleanRemote: false, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "/traec/coverage", remoteDirectorySDF: false, removePrefix: 'coverage/lcov-report', sourceFiles: 'coverage/lcov-report/**']
                                ], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true]
        ]
        ftpPublisher paramPublish: null, masterNodeName: '', alwaysPublishFromMaster: true, continueOnError: false, failOnError: true, publishers: [
                                [configName: 'Docs', transfers: [
                                        [asciiMode: false, cleanRemote: false, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "/traec", remoteDirectorySDF: false, removePrefix: 'docs', sourceFiles: 'docs/**']
                                ], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true]
        ]
      }
    }
  }

  post {

    always {
      cleanWs()
      }

    success {
      slackSend(
         message: "SUCCESS\nJob: ${env.JOB_NAME} \nBuild ${env.BUILD_DISPLAY_NAME} \n URL: ${env.RUN_DISPLAY_URL} \n Master Test Coverage Report: https://docs.procedural.build/traec/coverage/",
         color: "good",
         token: "${SLACK}",
         baseUrl: 'https://traecker.slack.com/services/hooks/jenkins-ci/',
         channel: '#jenkins-ci'
      )
    }

    failure {
       slackSend(
         message: "FAILED\nJob: ${env.JOB_NAME} \nBuild ${env.BUILD_DISPLAY_NAME} \n URL: ${env.RUN_DISPLAY_URL}",
         color: "#fc070b",
         token: "${SLACK}",
         baseUrl: 'https://traecker.slack.com/services/hooks/jenkins-ci/',
         channel: '#jenkins-ci'
       )
    }
  }

}