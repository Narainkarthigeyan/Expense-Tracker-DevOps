FinOps AI
DevOps-Focused Intelligent Expense Analytics Platform

FinOps AI is a cloud-native financial analytics platform developed using modern microservices architecture and DevOps engineering practices. The project demonstrates enterprise-grade software deployment workflows using Docker, Jenkins, GitHub Actions, Spring Boot microservices, and React-based frontend architecture.

The platform provides intelligent expense management, budget tracking, analytics visualization, and automated CI/CD deployment workflows within a scalable and containerized ecosystem.

🚀 Features
1. Microservices-Based Architecture
2. Dockerized Multi-Container Deployment
3. CI/CD Automation using GitHub Actions & Jenkins
4. JWT-Based Authentication & Authorization
5. Expense Management System
6. Budget Tracking & Monitoring
7. Interactive Financial Analytics Dashboard
8. API Gateway-Based Communication
9. Cloud-Native Deployment Workflow
10. Docker Compose Orchestration
    
🏗️ System Architecture
User → React Frontend → API Gateway → Microservices → MySQL Database → Analytics Dashboard

🛠️ Technology Stack
Layer	Technology
1. Frontend -	React 19, Vite, Axios, Recharts, React Router
2. Backend -	Java 17, Spring Boot 3.2, Spring Security
3. Database -	MySQL 8.0
4. Build Tool -	Maven
5. Containerization -	Docker
6. Orchestration -	Docker Compose
7. CD	- Jenkins
8. API Gateway -	Spring Boot API Gateway
   
📂 Project Structure
FINOPS-AI
│
├── .github
│   ├── workflows
│   └── modernize
│
├── api-gateway
│
├── frontend
│
├── services
│   ├── auth-service
│   ├── expense-service
│   ├── budget-service
│   └── analytics-service
│
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── Jenkinsfile
├── pom.xml
└── README.md

⚙️ DevOps Workflow
Developer → GitHub → GitHub Actions → Maven Build → Docker Build → Jenkins → Docker Compose → Deployment

🐳 Dockerized Deployment
The complete application is containerized using Docker to ensure:
1. Infrastructure consistency
2. Deployment reproducibility
3. Service isolation
4. Simplified deployment workflows

Docker Compose is used to orchestrate:
1. Frontend container
2. API Gateway container
3. Backend microservices
4. MySQL database container

   
▶️ Running the Project
1. Clone Repository
git clone https://github.com/your-username/finops-ai.git
cd finops-ai

2. Build Backend Services
mvn clean install
Run Docker Compose
docker-compose up --build

📌 Future Scope
1. Kubernetes Orchestration
2. Cloud Deployment (AWS/Azure/GCP)
3. AI-Based Financial Forecasting
4. Prometheus & Grafana Monitoring
5. Mobile Application Support
6. Multi-Tenant SaaS Architecture
   

👨‍💻 Author
Narain Karthigeyan
