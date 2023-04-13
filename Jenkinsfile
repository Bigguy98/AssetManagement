pipeline {

    stages {
 		stage("build & SonarQube analysis") {
            agent any
            steps {
              withSonarQubeEnv('VNPTIT sonarqube') {
                sh 'mvn org.sonarsource.scanner.maven:sonar-maven-plugin:3.7.0.1746:sonar'
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
