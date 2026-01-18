pipeline {
    agent any

    environment {
        ENV_FILE_PATH = "C:\\Program Files\\Jenkins\\jenkinsEnv\\fats-amex-api"
        HOME = "C:\\ProgramData\\Jenkins\\.jenkins"
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
                echo "Copying environment file to the backend..."
                bat "copy \"${ENV_FILE_PATH}\" \"%WORKSPACE%\\.env\""
            }
        }

        stage('Manage PM2 and Install Dependencies') {
            steps {
                script {
                    echo "Checking PM2 processes..."
                    def processStatus = bat(script: 'pm2 list', returnStdout: true).trim()
                    if (processStatus.contains('fatsAmexAPI') || processStatus.contains('fats-workers')) {
                        echo "Stopping existing PM2 processes..."
                        bat 'pm2 stop fatsAmexAPI fats-workers || exit 0'
                    }
                }
                echo "Installing dependencies for fatsAmexAPI..."
                bat 'npm install'
                echo "Generating Prisma files..."
                bat 'npx prisma generate'
                script {
                    echo "Starting/Restarting PM2 process..."
                    def processStatus = bat(script: 'pm2 list', returnStdout: true).trim()
                    if (processStatus.contains('fatsAmexAPI')) {
                        echo "Process exists, restarting..."
                        bat 'pm2 restart fatsAmexAPI'
                    } else {
                        echo "Process does not exist, starting new..."
                        bat 'pm2 start src/app.js --name fatsAmexAPI'
                    }
                }
                echo "PM2 process started successfully"
                bat 'pm2 save'
            }
        }
    }
}
