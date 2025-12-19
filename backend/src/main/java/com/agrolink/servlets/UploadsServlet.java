package com.agrolink.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;

@WebServlet("/uploads/*")
public class UploadsServlet extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        String path = req.getPathInfo(); // /abc123_rice.jpg

        if (path == null || path.contains("..")) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String normalized = path.startsWith("/") ? path.substring(1) : path;
        File file = new File(resolveUploadsDir(req), normalized);

        if (!file.exists() || file.isDirectory()) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String mime = getServletContext().getMimeType(file.getName());
        resp.setContentType(mime != null ? mime : "image/jpeg");
        resp.setContentLengthLong(file.length());

        resp.setHeader("Cache-Control", "public, max-age=86400");

        try (FileInputStream in = new FileInputStream(file);
             OutputStream out = resp.getOutputStream()) {

            byte[] buffer = new byte[8192];
            int len;
            while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
        }
    }
}
