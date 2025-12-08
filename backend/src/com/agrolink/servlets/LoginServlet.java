package com.agrolink.servlets;

import com.agrolink.dao.UserDAO;
import com.agrolink.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(request, response);

        String mobile = request.getParameter("mobile");
        String password = request.getParameter("password");

        try {
            UserDAO dao = new UserDAO();
            User user = dao.getUserByMobileAndPassword(mobile, password);

            if (user != null) {

                // 🔥 Ensure farmerId is not null
                String farmerId = (user.getFarmerId() == null || user.getFarmerId().isEmpty())
                        ? ""
                        : user.getFarmerId();

                // 🔥 Build safe JSON manually
                String json =
                    "{"
                        + "\"status\":\"success\","
                        + "\"message\":\"Login successful\","
                        + "\"user\":{"
                            + "\"fullName\":\"" + safe(user.getFullName()) + "\","
                            + "\"mobile\":\"" + safe(user.getMobile()) + "\","
                            + "\"farmerId\":\"" + safe(farmerId) + "\""
                        + "}"
                    + "}";

                sendJson(response, json);

            } else {
                sendJson(response,
                        "{\"status\":\"error\",\"message\":\"Invalid mobile or password\"}");
            }

        } catch (Exception e) {
            sendJson(response,
                    "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    // Prevent JSON breaking when name contains quotes
    private String safe(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"");
    }
}
