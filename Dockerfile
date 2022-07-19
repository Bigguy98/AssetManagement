FROM openjdk:11
ADD /target/asset-management-0.0.1-SNAPSHOT.jar app.jar
COPY run.sh /run.sh
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c","/run.sh"]