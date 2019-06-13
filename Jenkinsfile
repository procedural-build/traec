pipeline {
  agent {
    docker {
      image 'node:10.14-slim'
    }

  }
environment {
        SECRET = credentials('TOKEN')
        SLACK = credentials('slack')
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
          sh 'npm test -- --ci --coverage --testResultsProcessor="jest-junit"'
        }
        }
        post {
          always {
            sh 'ls'
            junit 'jest-test-results.xml'
          }
      }

    stage('Publish') {
      when {
        branch 'testing'
      }
      steps {
        ftpPublisher paramPublish: null, masterNodeName: '', alwaysPublishFromMaster: true, continueOnError: false, failOnError: true, publishers: [
                                        [configName: 'Homepage', transfers: [
                                                [asciiMode: false, cleanRemote: false, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "/docs/traec/coverage", remoteDirectorySDF: false, removePrefix: 'coverage/lcov-report', sourceFiles: 'coverage/lcov-report/**']
                                        ], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true]
                ]

        //sh 'echo $SECRET && echo "//registry.npmjs.org/:_authToken=${SECRET}" > ~/.npmrc && npm run matchversion && npm run patchversion && npm run pub'
      }
    }
  }

  post {

    always {
      cleanWs()
      }

    success {
      slackSend(
         message: "SUCCESS\nJob: ${env.JOB_NAME} \nBuild ${env.BUILD_DISPLAY_NAME} \n URL: ${env.RUN_DISPLAY_URL}",
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