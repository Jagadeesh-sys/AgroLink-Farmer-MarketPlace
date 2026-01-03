#!/bin/bash
echo "=== 🚀 STARTUP SCRIPT STARTED ==="
echo "PWD: $(pwd)"

echo "=== � SEARCHING FOR JAR ==="
# Find any JAR file in the backend/target directory (excluding original/shaded artifacts if any)
JAR_FILE=$(find backend/target -name "*.jar" | grep -v "original" | head -n 1)

if [ -z "$JAR_FILE" ]; then
    echo "❌ ERROR: No JAR file found in backend/target!"
    echo "Listing all files in backend/:"
    ls -R backend/
    exit 1
fi

echo "✅ Found JAR: $JAR_FILE"

echo "=== 🚀 LAUNCHING JAVA ==="
# Use moderate heap size for Railway (Free tier is 512MB RAM)
# Force IPv4 to avoid binding issues
exec java -Xmx300m -Djava.net.preferIPv4Stack=true -jar "$JAR_FILE"
