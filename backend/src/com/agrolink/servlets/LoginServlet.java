package com.agrolink.servlets;

import com.agrolink.dao.UserDAO;
import com.agrolink.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

            // ⭐ Use updated method
            User user = dao.getUserByMobileAndPassword(mobile, password);

            if (user != null) {

                // ⭐ Send fullName in JSON
                sendJson(response,
                    "{"
                        + "\"status\":\"success\","
                        + "\"message\":\"Login successful\","
                        + "\"fullName\":\"" + user.getFullName() + "\""
                    + "}"
                );

            } else {
                sendJson(response,
                    "{\"status\":\"error\",\"message\":\"Invalid mobile or password\"}");
            }

        } catch (Exception e) {
            sendJson(response,
                "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
