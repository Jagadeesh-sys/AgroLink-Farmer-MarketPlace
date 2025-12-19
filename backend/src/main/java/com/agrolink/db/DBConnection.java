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
            // Not necessary with modern drivers but safe:
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("MySQL driver not found", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return getDataSource().getConnection();
    }

    private static HikariDataSource getDataSource() {
        HikariDataSource local = dataSource;
        if (local != null) return local;

        synchronized (DBConnection.class) {
            local = dataSource;
            if (local != null) return local;

            String jdbcUrl = resolveJdbcUrl();
            String user = resolveUser();
            String pass = resolvePassword();

            HikariConfig cfg = new HikariConfig();
            cfg.setJdbcUrl(jdbcUrl);
            cfg.setUsername(user);
            cfg.setPassword(pass);

            cfg.setMaximumPoolSize(parseIntEnv("DB_POOL_MAX", 10));
            cfg.setMinimumIdle(parseIntEnv("DB_POOL_MIN_IDLE", 2));
            cfg.setConnectionTimeout(parseLongEnv("DB_POOL_CONN_TIMEOUT_MS", 10_000L));
            cfg.setIdleTimeout(parseLongEnv("DB_POOL_IDLE_TIMEOUT_MS", 600_000L));
            cfg.setMaxLifetime(parseLongEnv("DB_POOL_MAX_LIFETIME_MS", 1_800_000L));

            Properties dsProps = new Properties();
            dsProps.setProperty("cachePrepStmts", "true");
            dsProps.setProperty("prepStmtCacheSize", "250");
            dsProps.setProperty("prepStmtCacheSqlLimit", "2048");
            dsProps.setProperty("useServerPrepStmts", "true");
            dsProps.setProperty("useUnicode", "true");
            dsProps.setProperty("characterEncoding", "utf8");
            dsProps.setProperty("serverTimezone", "UTC");
            cfg.setDataSourceProperties(dsProps);

            local = new HikariDataSource(cfg);
            dataSource = local;

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                try {
                    HikariDataSource ds = dataSource;
                    if (ds != null) ds.close();
                } catch (Exception ignored) {
                }
            }));

            return local;
        }
    }

    private static String resolveUser() {
        String user = firstNonBlankEnv("JDBC_USER", "DB_USER", "MYSQLUSER");
        if (user != null) return user;

        throw new IllegalStateException("Missing DB user. Set one of: JDBC_USER, DB_USER, MYSQLUSER");
    }

    private static String resolvePassword() {
        String pass = firstNonBlankEnv("JDBC_PASSWORD", "DB_PASSWORD", "MYSQLPASSWORD");
        if (pass != null) return pass;

        throw new IllegalStateException("Missing DB password. Set one of: JDBC_PASSWORD, DB_PASSWORD, MYSQLPASSWORD");
    }

    private static String resolveJdbcUrl() {
        String jdbcUrl = firstNonBlankEnv("JDBC_URL", "DB_URL", "JDBC_DATABASE_URL");
        if (jdbcUrl != null) {
            return normalizeJdbcUrl(jdbcUrl);
        }

        String databaseUrl = firstNonBlankEnv("DATABASE_URL", "MYSQL_URL");
        if (databaseUrl != null) {
            String normalized = databaseUrl.trim();
            if (normalized.startsWith("jdbc:")) {
                return normalizeJdbcUrl(normalized);
            }
            if (normalized.startsWith("mysql://")) {
                return normalizeJdbcUrl("jdbc:" + normalized);
            }
        }

        String host = firstNonBlankEnv("MYSQLHOST", "MYSQL_HOST");
        String port = firstNonBlankEnv("MYSQLPORT", "MYSQL_PORT");
        String db = firstNonBlankEnv("MYSQLDATABASE", "MYSQL_DATABASE");
        if (host != null && port != null && db != null) {
            return normalizeJdbcUrl("jdbc:mysql://" + host + ":" + port + "/" + db);
        }

        throw new IllegalStateException("Missing DB URL. Set JDBC_URL/DB_URL or Railway MySQL env vars");
    }

    private static String normalizeJdbcUrl(String jdbcUrl) {
        String trimmed = jdbcUrl.trim();
        if (!trimmed.startsWith("jdbc:")) {
            throw new IllegalArgumentException("DB URL must start with jdbc:");
        }

        String withParams = trimmed;
        String required = "useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        if (trimmed.contains("?")) {
            if (!trimmed.toLowerCase().contains("servertimezone=")) {
                withParams = trimmed + "&serverTimezone=UTC";
            }
            if (!trimmed.toLowerCase().contains("usessl=")) {
                withParams = withParams + "&useSSL=false";
            }
            if (!trimmed.toLowerCase().contains("allowpublickeyretrieval=")) {
                withParams = withParams + "&allowPublicKeyRetrieval=true";
            }
            return withParams;
        }
        return trimmed + "?" + required;
    }

    private static String firstNonBlankEnv(String... keys) {
        for (String key : keys) {
            String value = System.getenv(key);
            if (value != null) {
                String trimmed = value.trim();
                if (!trimmed.isEmpty()) return trimmed;
            }
        }
        return null;
    }

    private static int parseIntEnv(String key, int defaultValue) {
        String raw = System.getenv(key);
        if (raw == null || raw.trim().isEmpty()) return defaultValue;
        try {
            return Integer.parseInt(raw.trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private static long parseLongEnv(String key, long defaultValue) {
        String raw = System.getenv(key);
        if (raw == null || raw.trim().isEmpty()) return defaultValue;
        try {
            return Long.parseLong(raw.trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
