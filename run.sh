#!/bin/sh
 
if [ ! -z $SEEKER_SERVER_URL ];
then
curl -k -o /tmp/seeker.zip "$SEEKER_SERVER_URL/rest/api/latest/installers/agents/binaries/JAVA"
unzip /tmp/seeker.zip -d /tmp/seeker
JAVA_OPTS="$JAVA_OPTS -javaagent:/tmp/seeker/seeker-agent.jar -Dseeker.server.url=$SEEKER_SERVER_URL"
fi
     
java $JAVA_OPTS -jar asset-management-0.0.1-SNAPSHOT.jar --server.address=0.0.0.0