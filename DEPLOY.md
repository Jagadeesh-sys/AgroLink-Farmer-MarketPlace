# Deployment Instructions for AgroLink

## 1. Environment Variables
Once deployed to Railway, you MUST set the following Environment Variables in the "Variables" tab of your service:

### Database (Required)
If using Railway MySQL:
- `MYSQL_URL` (Railway often provides this automatically)
- OR use the individual variables:
  - `MYSQLHOST`
  - `MYSQLPORT`
  - `MYSQLUSER`
  - `MYSQLPASSWORD`
  - `MYSQLDATABASE`

### Security & Config
- `PORT`: (Provided by Railway automatically, usually 8080)
- `NODE_ENV`: `production`

## 2. Verify Deployment
- The build command is: `mvn clean package -DskipTests`
- The start command is: `java -jar backend/target/backend.jar`

If the deployment fails with "Unable to access jarfile", ensure that the Build Step completed successfully in the logs.
