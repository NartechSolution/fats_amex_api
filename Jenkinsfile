pipeline {
    agent any

    environment {
        ENV_FILE_PATH = "C:\\ProgramData\\Jenkins\\.jenkins\\jenkinsEnv\\fatsAmex"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'dev_majid_new_github_credentials', 
                        url: 'https://github.com/NartechSolution/fats_amex_api.git'
                    ]]
                )
            }
        }

        stage('Setup Environment File') {
            steps {
                echo "Copying environment file to the API project..."
                bat "copy \"${ENV_FILE_PATH}\" \"%WORKSPACE%\\.env\""
            }
        }

        stage('Manage PM2 and Install Dependencies') {
            steps {
                script {
                    echo "Stopping PM2 process if running..."
                    def processStatus = bat(script: 'pm2 list', returnStdout: true).trim()
                    if (processStatus.contains('fatsAmexAPI')) {
                        bat 'pm2 stop fatsAmexAPI || exit 0'
                        bat 'pm2 delete fatsAmexAPI || exit 0'
                    }
                }
                echo "Installing dependencies for fatsAmexAPI..."
                bat 'npm ci'
                echo "Generating Prisma files..."
                bat 'npx prisma generate'
                echo "Restarting PM2 process..."
                bat 'pm2 start server.js --name fats_Amex'
            }
        }
    }
}
