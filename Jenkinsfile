pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        GITHUB_CREDS = credentials('github-creds')

        IMAGE = "jihen28/migrationrepo"
        TAG = "frontend-${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Frontend') {
            steps {
                deleteDir()

                git(
                    url: 'https://github.com/jihen2803/App-project-front.git',
                    credentialsId: 'github-creds',
                    branch: 'main'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Angular App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker --version'
                sh 'ls -la'

                sh "docker build -t ${IMAGE}:${TAG} ."
            }
        }

        stage('Docker Login') {
            steps {
                sh '''
                    echo "$DOCKERHUB_CREDS_PSW" | docker login \
                        -u "$DOCKERHUB_CREDS_USR" \
                        --password-stdin
                '''
            }
        }

        stage('Docker Push') {
            steps {
                sh "docker push ${IMAGE}:${TAG}"
            }
        }

        stage('Update Manifest') {
            steps {
                sh '''
                    rm -rf manifests

                    git clone \
                        https://${GITHUB_CREDS_USR}:${GITHUB_CREDS_PSW}@github.com/jihen2803/Atelier-noir-manifest.git \
                        manifests

                    cd manifests

                    sed -i "s|image:.*|image: ${IMAGE}:${TAG}|" \
                        Front/frontend-deployment.yaml

                    git config user.email "jenkins@local"
                    git config user.name "Jenkins"

                    git add Front/frontend-deployment.yaml

                    git commit \
                        -m "Update frontend image to ${TAG} [skip ci]" || true

                    git push origin main
                '''
            }
        }
    }
}
