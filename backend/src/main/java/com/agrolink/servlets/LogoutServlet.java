package com.agrolink.servlets;

import javax.servlet.http.*;
import java.io.IOException;

public class LogoutServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        setCors(req, resp);
        resp.setContentType("application/json");

        /* ==============================
           🔥 INVALIDATE SESSION
        ============================== */
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate(); // destroys session + all attributes
        }

        /* ==============================
           🔥 CLEAR JSESSIONID COOKIE
        ============================== */
        Cookie cookie = new Cookie("JSESSIONID", "");
        cookie.setMaxAge(0);
        cookie.setPath("/"); // VERY IMPORTANT
        resp.addCookie(cookie);

        resp.getWriter().print("{\"status\":\"success\"}");
    }
}