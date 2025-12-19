package com.agrolink.servlets;

import com.agrolink.dao.UserDAO;
import com.agrolink.model.User;

import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

public class LoginServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        setCors(request, response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        String mobile = request.getParameter("mobile");
        String password = request.getParameter("password");

        try {
            UserDAO dao = new UserDAO();
            User user = dao.getUserByMobileAndPassword(mobile, password);

            /* ==============================
               ❌ INVALID LOGIN
            ============================== */
            if (user == null) {
                out.print("{\"status\":\"error\",\"message\":\"Invalid credentials\"}");
                return;
            }

            /* ==============================
               ✅ ENSURE FARMER ID
            ============================== */
            if (user.getFarmerId() == null || user.getFarmerId().isEmpty()) {
                user = dao.getProfileByMobile(mobile);
            }

            if (user == null) {
                out.print("{\"status\":\"error\",\"message\":\"User not found\"}");
                return;
            }

            /* ==============================
               🔥 CLEAR OLD SESSION (VERY IMPORTANT)
            ============================== */
            HttpSession oldSession = request.getSession(false);
            if (oldSession != null) {
                oldSession.invalidate();
            }

            /* ==============================
               ✅ CREATE NEW SESSION
            ============================== */
            HttpSession session = request.getSession(true);
            session.setAttribute("farmerId", user.getFarmerId());
            session.setAttribute("fullName", user.getFullName());
            session.setAttribute("mobile", user.getMobile());
            session.setAttribute("role", user.getRole());               // Farmer / Buyer
            session.setAttribute("systemRole", user.getSystemRole());   // ADMIN / USER
            session.setMaxInactiveInterval(30 * 60); // 30 minutes

            out.print("{\"status\":\"success\",\"message\":\"Login successful\"}");

        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"status\":\"error\",\"message\":\"Server exception\"}");
        }
    }
}