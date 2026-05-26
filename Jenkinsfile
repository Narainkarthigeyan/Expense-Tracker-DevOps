pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'finops-ai'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code...'
                checkout scm
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping old containers...'
                sh 'docker-compose down --remove-orphans || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo 'Starting all containers...'
                sh 'docker-compose up -d'
            }
        }

        stage('Wait for Services') {
            steps {
                echo 'Waiting for services to start...'
                sh 'sleep 30'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                sh 'docker-compose ps'
                sh 'docker ps --filter "name=finops" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
                echo 'Checking service health...'
                sh 'curl -f http://localhost:3000 || echo "Frontend not ready yet"'
                sh 'curl -f http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d "{}" || echo "Auth service not ready yet"'
            }
        }
    }

    post {
        success {
            echo 'FinOps AI deployed successfully!'
            echo 'Frontend: http://localhost:3000'
            echo 'API Gateway: http://localhost:8080'
        }
        failure {
            echo 'Deployment failed. Checking logs...'
            sh 'docker-compose logs --tail=50'
        }
        always {
            echo 'Pipeline completed.'
        }
    }
}
