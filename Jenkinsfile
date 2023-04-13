pipeline {

    stages {
 		stage("build & SonarQube analysis") {
            agent any
            steps {
              withSonarQubeEnv('VNPTIT sonarqube') {
                # sh 'mvn clean package sonar:sonar'
                sh './gradlew sonarqube'
              }
            }
          }
          stage("Quality Gate") {
            steps {
              timeout(time: 1, unit: 'HOURS') {
                waitForQualityGate abortPipeline: true
              }
            }
          }
	}

    post {
        always {
            echo "Always echo this"
            echo "Always echo ths"
        }
        failure {
            echo "deploy fail"
        }
        success {
            echo "deploy success"
        }
    }
}
