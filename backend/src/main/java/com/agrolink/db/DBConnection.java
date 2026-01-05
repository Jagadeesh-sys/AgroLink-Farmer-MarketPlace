package com.agrolink.db;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnection {

    private static volatile HikariDataSource dataSource;

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL Driver not found", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return getDataSource().getConnection();
    }

    private static HikariDataSource getDataSource() {
        if (dataSource != null)
            return dataSource;

        synchronized (DBConnection.class) {
            if (dataSource != null)
                return dataSource;

            String jdbcUrl = resolveJdbcUrl();
            String user = resolveUser();
            String pass = resolvePassword();

            HikariConfig cfg = new HikariConfig();
            cfg.setJdbcUrl(jdbcUrl);
            cfg.setUsername(user);
            cfg.setPassword(pass);

            // Pool settings (safe for Railway free tier)
            cfg.setMaximumPoolSize(10);
            cfg.setMinimumIdle(2);
            cfg.setConnectionTimeout(10000);
            cfg.setIdleTimeout(600000);
            cfg.setMaxLifetime(1800000);

            // MySQL performance props
            Properties props = new Properties();
            props.setProperty("cachePrepStmts", "true");
            props.setProperty("prepStmtCacheSize", "250");
            props.setProperty("prepStmtCacheSqlLimit", "2048");
            props.setProperty("useServerPrepStmts", "true");
            props.setProperty("useUnicode", "true");
            props.setProperty("characterEncoding", "utf8");
            props.setProperty("serverTimezone", "UTC");
            cfg.setDataSourceProperties(props);

            dataSource = new HikariDataSource(cfg);

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                if (dataSource != null) {
                    dataSource.close();
                }
            }));

            System.out.println("✅ Database connected successfully");
            return dataSource;
        }
    }

    /*
     * ==========================
     * ENV RESOLUTION (RAILWAY)
     * ==========================
     */

    private static String resolveJdbcUrl() {
        // 1️⃣ Direct JDBC URL
        String jdbc = env("JDBC_URL", "DB_URL");
        if (jdbc != null)
            return normalize(jdbc);

        // 2️⃣ Railway MySQL vars
        String host = env("MYSQL_HOST");
        String port = env("MYSQL_PORT");
        String db = env("MYSQL_DATABASE");

        if (host != null && port != null && db != null) {
            return normalize(
                    "jdbc:mysql://" + host + ":" + port + "/" + db);
        }

        throw new RuntimeException(
                "❌ Missing DB URL. Set JDBC_URL or attach Railway MySQL");
    }

    private static String resolveUser() {
        String user = env("JDBC_USER", "DB_USER", "MYSQL_USER");
        if (user != null)
            return user;

        throw new RuntimeException(
                "❌ Missing DB user. Set JDBC_USER or MYSQL_USER");
    }

    private static String resolvePassword() {
        String pass = env("JDBC_PASSWORD", "DB_PASSWORD", "MYSQL_PASSWORD");
        if (pass != null)
            return pass;

        throw new RuntimeException(
                "❌ Missing DB password. Set JDBC_PASSWORD or MYSQL_PASSWORD");
    }

    private static String env(String... keys) {
        for (String k : keys) {
            String v = System.getenv(k);
            if (v != null && !v.trim().isEmpty())
                return v.trim();
        }
        return null;
    }

    private static String normalize(String url) {
        if (!url.startsWith("jdbc:")) {
            throw new IllegalArgumentException("Invalid JDBC URL");
        }

        if (url.contains("?")) {
            if (!url.toLowerCase().contains("usessl="))
                url += "&useSSL=false";
            if (!url.toLowerCase().contains("allowpublickeyretrieval="))
                url += "&allowPublicKeyRetrieval=true";
            if (!url.toLowerCase().contains("servertimezone="))
                url += "&serverTimezone=UTC";
            return url;
        }

        return url + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    }
}
