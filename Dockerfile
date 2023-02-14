FROM openjdk:11-jre-slim-buster
# RUN apk --no-cache add curl && apk --no-cache add unzip
# RUN apt update && apt install curl -y && apt install unzip -y
# ENV SEEKER_SERVER_URL=http://10.1.62.69:8082 \
#     SEEKER_PROJECT_KEY=default \
#     SEEKER_AGENT_NAME=default 
COPY /target/asset-management-0.0.1-SNAPSHOT.jar run.sh ./
RUN chmod -R 765 run.sh
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c","/run.sh"]
