package com.agrolink.servlets;

import com.agrolink.dao.UserDAO;
import com.agrolink.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

public class SignupServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(request, response);

        String fullName = request.getParameter("fullName");
        String mobile = request.getParameter("mobile");
        String password = request.getParameter("password");

        try {
            UserDAO dao = new UserDAO();

            if (dao.mobileExists(mobile)) {
                sendJson(response, "{\"status\":\"error\",\"message\":\"Mobile already registered\"}");
                return;
            }

            User u = new User();
            u.setFullName(fullName);
            u.setMobile(mobile);
            u.setPassword(password); // stored as plain text

            dao.register(u);

            sendJson(response, "{\"status\":\"success\",\"message\":\"Signup successful\"}");

        } catch (Exception e) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}