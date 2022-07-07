def exampleMethod(numArr) {
    for(i in numArr) {
        echo "Counting to number ${i}"
    }
    // groovy syntax for printing text
    println "hello"
}
def otherExampleMethod() {
    //do something else
}

def buildingApp() {
    echo "Building app ${params.APP_NAME} with ${BUILD_TOOL}"
}
def deployApp() {
    echo "Deploying app ${params.APP_NAME} version ${params.VERSION} to env ${ENV}"
}
return this