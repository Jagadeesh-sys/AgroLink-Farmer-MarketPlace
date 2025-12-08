package com.agrolink.servlets;

import com.agrolink.dao.UserDAO;
import com.agrolink.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;

public class GetProfileServlet extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(request, response);
        String mobile = request.getParameter("mobile");

        if (mobile == null || mobile.trim().isEmpty()) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"Mobile missing\"}");
            return;
        }

        try {
            UserDAO dao = new UserDAO();
            User u = dao.getProfileByMobile(mobile);

            if (u == null) {
                sendJson(response, "{\"status\":\"error\",\"message\":\"User not found\"}");
                return;
            }

            String json =
                "{"
                    + "\"status\":\"success\","
                    + "\"user\":{"
                    + "\"fullName\":\"" + safe(u.getFullName()) + "\","
                    + "\"mobile\":\"" + safe(u.getMobile()) + "\","
                    + "\"email\":\"" + safe(u.getEmail()) + "\","
                    + "\"address\":\"" + safe(u.getAddress()) + "\","
                    + "\"state\":\"" + safe(u.getState()) + "\","
                    + "\"district\":\"" + safe(u.getDistrict()) + "\","
                    + "\"pincode\":\"" + safe(u.getPincode()) + "\","
                    + "\"role\":\"" + safe(u.getRole()) + "\","
                    + "\"farmSize\":\"" + safe(u.getFarmSize()) + "\","
                    + "\"mainCrops\":\"" + safe(u.getMainCrops()) + "\","
                    + "\"bankAccount\":\"" + safe(u.getBankAccount()) + "\","
                    + "\"ifsc\":\"" + safe(u.getIfsc()) + "\","
                    + "\"gst\":\"" + safe(u.getGst()) + "\","
                    + "\"pan\":\"" + safe(u.getPan()) + "\","
                    + "\"aadhar\":\"" + safe(u.getAadhar()) + "\","
                    + "\"profilePhoto\":\"" + safe(u.getProfilePhoto()) + "\","
                    + "\"document1\":\"" + safe(u.getDocument1()) + "\","
                    + "\"document2\":\"" + safe(u.getDocument2()) + "\","
                    + "\"verified\":" + u.getVerified() + ","
                    
                    // ⭐ ADD THIS LINE – Final Fix!
                    + "\"farmerId\":\"" + safe(u.getFarmerId()) + "\""

                    + "}"
                + "}";

            sendJson(response, json);

        } catch (Exception e) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"" + safe(e.getMessage()) + "\"}");
        }
    }

    private String safe(String s) {
        return s == null ? "" : s.replace("\"", "\\\"");
    }
}
