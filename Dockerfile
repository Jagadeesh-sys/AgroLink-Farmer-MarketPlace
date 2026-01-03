# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy root pom and modules
COPY pom.xml .
COPY backend/pom.xml backend/
COPY frontend/pom.xml frontend/
COPY frontend/package.json frontend/
COPY frontend/package-lock.json frontend/

# Copy source code
COPY backend/src backend/src
COPY frontend/src frontend/src
COPY frontend/public frontend/public
COPY backend/railway.toml backend/railway.toml

# Build (skip tests to speed up)
# This handles both frontend (via plugin) and backend
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the specific backend jar
COPY --from=build /app/backend/target/backend.jar app.jar

# Environment
ENV PORT=8080
EXPOSE 8080

# Start
ENTRYPOINT ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]
