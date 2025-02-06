pipeline {
    agent any

    environment {
        ENV_FILE_PATH = "C:\\ProgramData\\Jenkins\\.jenkins\\jenkinsEnv\\fatsAmex"
        HOME = "C:\\ProgramData\\Jenkins\\.jenkins"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'Wasim-Jenkins-Credentials', 
                        url: 'https://github.com/NartechSolution/fats_amex_api.git'
                    ]]
                )
            }
        }

        stage('Setup Environment File') {
            steps {
                echo "Copying environment file to the backend..."
                bat "copy \"${ENV_FILE_PATH}\" \"%WORKSPACE%\\.env\""
            }
        }

        stage('Manage PM2 and Install Dependencies') {
            steps {
                script {
                    echo "Stopping PM2 process if running..."
                    def processStatus = bat(script: 'pm2 list', returnStdout: true).trim()
                    if (processStatus.contains('fatsAmexAPI') || processStatus.contains('fats-workers')) {
                        bat 'pm2 stop fatsAmexAPI fats-workers || exit 0'
                    }
                }
                echo "Installing dependencies for fatsAmexAPI..."
                bat 'npm ci'
                echo "Generating Prisma files..."
                bat 'npx prisma generate'
                echo "Restarting PM2 process..."
                bat 'pm2 restart fatsAmexAPI'
                echo "Restarting PM2 process... Done"
                bat 'pm2 save'
            }
        }
    }
}
