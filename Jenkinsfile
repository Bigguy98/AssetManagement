def numArr = [1,2,5,6,9]
def groovyScript

pipeline {
    agent pocSecOps 
    parameters {
        string(name: 'APP_NAME', defaultValue: 'Bugsmaker App', description: 'App name')
        choice(name: 'VERSION', choices: ['v1.0', 'v1.1', 'v1.2'], description: 'App version')
        booleanParam(name: 'NEED_TEST', defaultValue: true, description: 'Check if this deployment need to be test')
    }

    environment {
        ENV = 'test'
        BUILD_TOOL = 'mvn'
    }

    stages {
        stage ('Init') {
            steps {
                script {
                    groovyScript = load "script.groovy"
                }
            }
        }
        stage('Building') {
            steps {
                script {
                    groovyScript.buildingApp()
                }
            }  
        }
        stage('Test') {
            when {
                expression {
                    params.NEED_TEST
                }
            }
            steps {
                echo "Testing app ${params.APP_NAME}"
                // include a block of Scripted pipeline, which is Groovy code   
                script {
                    groovyScript.exampleMethod(numArr)
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    groovyScript.deployApp()
                }
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