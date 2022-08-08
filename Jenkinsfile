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
		COVERITY_TOOL_HOME = '/home/vagrant/cov-analysis-linux64/bin'
		COVERITY_TRIAL_RESULTS_PASSPHRASE = 'starwars'
		MAVEN_HOME = '/opt/maven'
    }

    stages {
// 		stage('scan security') {
// 			steps {
//                 // sh "$COVERITY_TOOL_HOME/cov-capture --dir idir --source-dir ."
//                 sh "$COVERITY_TOOL_HOME/cov-build --dir idir $MAVEN_HOME/bin/mvn -Pprod clean verify -DskipTests"
//                 // sh "$MAVEN_HOME/bin/mvn -Pprod clean verify -DskipTests"
//             }
		  
// 		}
// 		stage('analyze') {
// 			steps {
// 			    sh "$COVERITY_TOOL_HOME/cov-analyze --dir idir --all --disable-fb --webapp-security -j auto"
// 			}
		  
// 		} 
// 		stage('commit') {
// 			steps {
// 				sh "$COVERITY_TOOL_HOME/cov-commit-defects --dir idir --url http://10.1.62.68:8080 --stream jenkinstest --user admin --password p*oHrdZktC9*53"
// 			}
// 		}

//         stage('build image') {
//             steps {
// 				sh "docker build -t asset-management:v1 ."
//                 sh "cd  src/main/docker && docker-compose -f app.yml up -d"
// 			}
//         }
        
//         stage('scan with blackduck detect') {
//             steps {
//                 sh "java -jar $HOME/synopsys-detect/download/latest-detect.jar \
// --blackduck.url=https://10.159.131.165 \
// --blackduck.api.token=NDM2YWJhNTgtYTY3MS00YTQzLTliYTQtNzdiNmE3YzdkNjQ5OjYzMGU5Mzc2LTRhYzAtNGNhOS1hYzRlLTRlOTExNGIyZmZlMw== \
// --blackduck.trust.cert=true \
// --detect.project.name=sample \
// --detect.project.version.name=master \
// --detect.maven.path=/opt/maven/bin/mvn \
// --detect.maven.build.command=clean package -DskipTests"
//             }
//         }
        stage('get all jobs') {
            steps {
                script {
                    groovyScript = load "script.groovy"
                    groovyScript.getAllJobs()
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
