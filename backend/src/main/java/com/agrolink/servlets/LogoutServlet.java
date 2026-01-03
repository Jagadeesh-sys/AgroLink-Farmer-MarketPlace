package com.agrolink.servlets;

import javax.servlet.http.*;
import java.io.IOException;

public class LogoutServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        setCors(req, resp);
        resp.setContentType("application/json");

        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Cookie cookie = new Cookie("JSESSIONID", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        if (isProduction()) {
            cookie.setSecure(true);
        }
        resp.addCookie(cookie);

        resp.getWriter().print("{\"status\":\"success\"}");
    }

    private boolean isProduction() {
        String nodeEnv = System.getenv("NODE_ENV");
        if (nodeEnv != null && nodeEnv.trim().equalsIgnoreCase("production")) return true;
        String env = System.getenv("APP_ENV");
        if (env != null && env.trim().equalsIgnoreCase("production")) return true;
        String railwayEnv = System.getenv("RAILWAY_ENVIRONMENT");
        if (railwayEnv != null && !railwayEnv.trim().isEmpty()) return true;
        return System.getenv("RAILWAY_PROJECT_ID") != null;
    }
}
