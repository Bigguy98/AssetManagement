def numArr = [1,2,5,6,9]
def groovyScript

pipeline {
    agent {
        label 'pocSecOps'
    }
    parameters {
        string(name: 'APP_NAME', defaultValue: 'Bugsmaker App', description: 'App name')
        choice(name: 'VERSION', choices: ['v1.0', 'v1.1', 'v1.2'], description: 'App version')
        booleanParam(name: 'NEED_TEST', defaultValue: true, description: 'Check if this deployment need be test')
    }

    environment {
        ENV = 'test'
        BUILD_TOOL = 'mvn'
		COVERITY_TOOL_HOME=/home/vagrant/cov-analysis-linux64/bin
		COVERITY_TRIAL_RESULTS_PASSPHRASE=starwars
    }

    stages {
		stage('build') {
		  sh "$COVERITY_TOOL_HOME/cov-build --dir idir mvn clean install"
		  }
		stage('analyze') {
		  sh "$COVERITY_TOOL_HOME/cov-analyze" --dir idir --all --disable-fb --webapp-security -j auto"
		  } 
		stage('commit') {
		  sh "$COVERITY_TOOL_HOME/cov-commit-defects" --dir idir --url http://10.1.62.68:8080 --stream jenkinstest --user admin --password p*oHrdZktC9*53"
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
