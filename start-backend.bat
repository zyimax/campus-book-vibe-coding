@echo off
echo Starting CampusBook Backend...
cd backend
mvn clean package -DskipTests && java -jar target/campusbook-backend-1.0.0.jar
pause
