package com.agrolink.servlets;

import com.agrolink.dao.UserDAO;
import com.agrolink.model.User;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 10 * 1024 * 1024,
        maxRequestSize = 20 * 1024 * 1024
)
public class UpdateProfileServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(request, response);
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        /* ------------------------------
           SESSION CHECK
        ------------------------------ */
        HttpSession session = request.getSession(false);
        if (session == null) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"Session expired\"}");
            return;
        }

        String mobile = (String) session.getAttribute("mobile");
        if (mobile == null || mobile.trim().isEmpty()) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"Login required\"}");
            return;
        }

        UserDAO dao = new UserDAO();
        User existing;

        try {
            existing = dao.getProfileByMobile(mobile);
        } catch (Exception e) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"User fetch failed\"}");
            return;
        }

        if (existing == null) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"User not found\"}");
            return;
        }

        /* ------------------------------
           UPDATE USER FIELDS
        ------------------------------ */
        User u = new User();
        u.setMobile(mobile);
        u.setFullName(request.getParameter("fullName"));
        u.setEmail(request.getParameter("email"));
        u.setAddress(request.getParameter("address"));
        u.setState(request.getParameter("state"));
        u.setDistrict(request.getParameter("district"));
        u.setPincode(request.getParameter("pincode"));
        u.setFarmSize(request.getParameter("farmSize"));
        u.setMainCrops(request.getParameter("mainCrops"));
        u.setBankAccount(request.getParameter("bankAccount"));
        u.setIfsc(request.getParameter("ifsc"));
        u.setGst(request.getParameter("gst"));
        u.setPan(request.getParameter("pan"));
        u.setAadhar(request.getParameter("aadhar"));

        /* ------------------------------
           ROLE NULL-PROOF FIX
        ------------------------------ */
        String role = request.getParameter("role");
        if (role == null || role.trim().isEmpty()) {
            role = existing.getRole();
        }
        u.setRole(role);

        /* ------------------------------
           UPLOADS DIRECTORY
        ------------------------------ */
        File uploadDir = resolveUploadsDir(request);

        /* ------------------------------
           PROFILE PHOTO
        ------------------------------ */
        Part photo = request.getPart("profilePhoto");
        if (photo != null && photo.getSize() > 0) {

            String safeName = photo.getSubmittedFileName()
                    .replaceAll("[^a-zA-Z0-9._-]", "_");

            String fileName = mobile + "_profile_" + System.currentTimeMillis()
                    + "_" + safeName;

            File file = new File(uploadDir, fileName);
            try (InputStream is = photo.getInputStream()) {
                Files.copy(is, file.toPath());
            }

            u.setProfilePhoto("uploads/" + fileName);

        } else {
            u.setProfilePhoto(existing.getProfilePhoto());
        }

        /* ------------------------------
           DOCUMENT 1
        ------------------------------ */
        Part d1 = request.getPart("document1");
        if (d1 != null && d1.getSize() > 0) {

            String safeName = d1.getSubmittedFileName()
                    .replaceAll("[^a-zA-Z0-9._-]", "_");

            String fileName = mobile + "_doc1_" + System.currentTimeMillis()
                    + "_" + safeName;

            File file = new File(uploadDir, fileName);
            try (InputStream is = d1.getInputStream()) {
                Files.copy(is, file.toPath());
            }

            u.setDocument1("uploads/" + fileName);

        } else {
            u.setDocument1(existing.getDocument1());
        }

        /* ------------------------------
           DOCUMENT 2
        ------------------------------ */
        Part d2 = request.getPart("document2");
        if (d2 != null && d2.getSize() > 0) {

            String safeName = d2.getSubmittedFileName()
                    .replaceAll("[^a-zA-Z0-9._-]", "_");

            String fileName = mobile + "_doc2_" + System.currentTimeMillis()
                    + "_" + safeName;

            File file = new File(uploadDir, fileName);
            try (InputStream is = d2.getInputStream()) {
                Files.copy(is, file.toPath());
            }

            u.setDocument2("uploads/" + fileName);

        } else {
            u.setDocument2(existing.getDocument2());
        }

        /* ------------------------------
           UPDATE DATABASE
        ------------------------------ */
        try {
            dao.updateProfile(u);

            // Update session (Navbar)
            session.setAttribute("fullName", u.getFullName());
            session.setAttribute("role", u.getRole());

            sendJson(response, "{\"status\":\"success\"}");

        } catch (Exception e) {
            sendJson(response,
                    "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
