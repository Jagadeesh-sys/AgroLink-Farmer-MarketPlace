package com.agrolink.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

public class SpaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String requestUri = req.getRequestURI();
        String contextPath = req.getContextPath();
        String path = requestUri;
        if (contextPath != null && !contextPath.isEmpty() && requestUri.startsWith(contextPath)) {
            path = requestUri.substring(contextPath.length());
        }

        if (path == null || path.isEmpty() || "/".equals(path)) {
            serveResource("public/index.html", false, req, resp);
            return;
        }

        String normalized = path.startsWith("/") ? path.substring(1) : path;
        if (normalized.startsWith("api/") || normalized.equals("api") || normalized.startsWith("uploads/") || normalized.equals("uploads")) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String candidate = "public/" + normalized;
        if (resourceExists(candidate)) {
            boolean immutable = isImmutableAsset(normalized);
            serveResource(candidate, immutable, req, resp);
            return;
        }

        if (looksLikeFilePath(normalized)) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        serveResource("public/index.html", false, req, resp);
    }

    private boolean resourceExists(String resourcePath) {
        return Thread.currentThread().getContextClassLoader().getResource(resourcePath) != null;
    }

    private void serveResource(String resourcePath, boolean immutable, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        try (InputStream in = cl.getResourceAsStream(resourcePath)) {
            if (in == null) {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            String contentType = getServletContext().getMimeType(resourcePath);
            if (contentType == null) {
                contentType = URLConnection.guessContentTypeFromName(resourcePath);
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            if (contentType.startsWith("text/") || contentType.contains("javascript") || contentType.contains("json") || contentType.contains("svg")) {
                resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
            }
            resp.setContentType(contentType);

            if (immutable) {
                resp.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            } else {
                resp.setHeader("Cache-Control", "no-cache");
            }

            try (OutputStream out = resp.getOutputStream()) {
                byte[] buffer = new byte[8192];
                int len;
                while ((len = in.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }
            }
        }
    }

    private boolean looksLikeFilePath(String path) {
        int lastSlash = path.lastIndexOf('/');
        String lastSegment = lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
        return lastSegment.contains(".");
    }

    private boolean isImmutableAsset(String path) {
        if (path.equals("index.html")) return false;
        return path.startsWith("static/") || path.contains(".") && (path.contains(".") && !path.endsWith(".html"));
    }
}

