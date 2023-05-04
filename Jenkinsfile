pipeline {
    
    parameters {
        
    }

    environment {
    }

    stages {
		stage('scan code') {
			steps {
               echo "Scan with SonarQube"
            }
		}
        
        stage('Build and test') {
			steps {
               echo "Mvn build"
            }
		}
        
        stage('Upload docker image') {
			steps {
               echo "Upload docker image"
            }
		}
        
        stage('Deploy test') {
			steps {
               echo "Deploy test"
            }
		}
        
        stage('Running DAST') {
			steps {
               echo "Running DAST"
            }
		}
        
	}

    post {
        always {
            echo "Always echo this"
        }
        failure {
            echo "deploy fail"
        }
        success {
            echo "deploy success"
        }
    }
}
