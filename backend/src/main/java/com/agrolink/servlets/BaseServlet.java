package com.agrolink.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class BaseServlet extends HttpServlet {

    protected void setCors(HttpServletRequest request, HttpServletResponse response) {
        String origin = request.getHeader("Origin");
        if (origin != null && !origin.trim().isEmpty()) {
            String allowed = System.getenv("CORS_ALLOWED_ORIGINS");
            if (allowed != null && allowed.trim().equals("*")) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Vary", "Origin");
            } else {
                Set<String> allowedOrigins = resolveAllowedOrigins(allowed);
                if (allowedOrigins.contains(origin)) {
                    response.setHeader("Access-Control-Allow-Origin", origin);
                    response.setHeader("Vary", "Origin");
                }
            }
        }

        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers",
                "Origin, Content-Type, Accept, Authorization, X-Requested-With, enctype");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Max-Age", "3600");
}

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        setCors(req, resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(req, resp);
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            resp.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        try {
            super.service(req, resp);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    protected void sendJson(HttpServletResponse resp, String json) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }

    protected File resolveUploadsDir(HttpServletRequest request) {
        String envDir = System.getenv("UPLOAD_DIR");
        if (envDir != null && !envDir.trim().isEmpty()) {
            File dir = new File(envDir);
            if (!dir.exists()) dir.mkdirs();
            return dir;
        }

        String realPath = request.getServletContext().getRealPath("/uploads");
        if (realPath != null && !realPath.trim().isEmpty()) {
            File dir = new File(realPath);
            if (!dir.exists()) dir.mkdirs();
            return dir;
        }

        File dir = new File(System.getProperty("java.io.tmpdir"), "uploads");
        if (!dir.exists()) dir.mkdirs();
        return dir;
    }

    private Set<String> resolveAllowedOrigins(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            Set<String> allowed = new HashSet<>();
            allowed.add("http://localhost:3000");
            allowed.add("http://localhost:5173");
            allowed.add("http://127.0.0.1:3000");
            allowed.add("http://127.0.0.1:5173");
            return allowed;
        }

        Set<String> allowed = new HashSet<>();
        for (String part : raw.split(",")) {
            String trimmed = part.trim();
            if (!trimmed.isEmpty()) {
                allowed.add(trimmed);
            }
        }
        return allowed;
    }
}
