package com.agrolink.servlets;

import com.agrolink.dao.UserDAO;
import com.agrolink.model.User;
import com.google.gson.Gson;

import javax.servlet.http.*;
import java.io.IOException;

public class GetProfileServlet extends BaseServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        setCors(request, response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);

        /* ==============================
           ❌ NOT LOGGED IN
        ============================== */
        if (session == null || session.getAttribute("mobile") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(
                gson.toJson(new ErrorResponse("Login required"))
            );
            return;
        }

        String mobile = (String) session.getAttribute("mobile");

        try {
            UserDAO dao = new UserDAO();
            User user = dao.getProfileByMobile(mobile);

            if (user == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(
                    gson.toJson(new ErrorResponse("User not found"))
                );
                return;
            }

            /* ==============================
               ✅ SYNC SESSION (NAVBAR + ADMIN)
            ============================== */
            session.setAttribute("fullName", user.getFullName());
            session.setAttribute("farmerId", user.getFarmerId());
            session.setAttribute("systemRole", user.getSystemRole());

            /* ==============================
               ✅ SEND PROFILE JSON
            ============================== */
            response.getWriter().write(gson.toJson(user));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(
                gson.toJson(new ErrorResponse("Server error"))
            );
        }
    }

    /* ---------- Error Response ---------- */
    static class ErrorResponse {
        String status = "error";
        String message;

        ErrorResponse(String message) {
            this.message = message;
        }
    }
}