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

@MultipartConfig(maxFileSize = 10 * 1024 * 1024) // 10MB per file
public class UpdateProfileServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCors(request, response);
        request.setCharacterEncoding("UTF-8");

        String mobile = request.getParameter("mobile");
        if (mobile == null || mobile.trim().isEmpty()) {
            sendJson(response, "{\"status\":\"error\", \"message\":\"Mobile missing\"}");
            return;
        }

        UserDAO dao = new UserDAO();
        User existing;
        try {
            existing = dao.getProfileByMobile(mobile);
        } catch (Exception ex) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"Failed to fetch existing user\"}");
            return;
        }

        if (existing == null) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"User not found\"}");
            return;
        }

        User u = new User();
        u.setMobile(mobile);
        u.setFullName(request.getParameter("fullName"));
        u.setEmail(request.getParameter("email"));
        u.setAddress(request.getParameter("address"));
        u.setState(request.getParameter("state"));
        u.setDistrict(request.getParameter("district"));
        u.setPincode(request.getParameter("pincode"));
        u.setRole(request.getParameter("role"));
        u.setFarmSize(request.getParameter("farmSize"));
        u.setMainCrops(request.getParameter("mainCrops"));
        u.setBankAccount(request.getParameter("bankAccount"));
        u.setIfsc(request.getParameter("ifsc"));
        u.setGst(request.getParameter("gst"));
        u.setPan(request.getParameter("pan"));
        u.setAadhar(request.getParameter("aadhar"));

        // upload dir in webapp root: <webapp>/uploads
        String uploadsPath = request.getServletContext().getRealPath("") + File.separator + "uploads" + File.separator;
        File uploadDir = new File(uploadsPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        // PROFILE PHOTO
        Part photoPart = request.getPart("profilePhoto");
        if (photoPart != null && photoPart.getSize() > 0) {
            String filename = mobile + "_profile_" + System.currentTimeMillis() + "_" + getFileName(photoPart);
            File saved = new File(uploadsPath + filename);
            try (InputStream is = photoPart.getInputStream()) {
                Files.copy(is, saved.toPath());
            }
            u.setProfilePhoto("uploads/" + filename);
        } else {
            u.setProfilePhoto(existing.getProfilePhoto());
        }

        // DOCUMENT 1
        Part d1 = request.getPart("document1");
        if (d1 != null && d1.getSize() > 0) {
            String filename = mobile + "_doc1_" + System.currentTimeMillis() + "_" + getFileName(d1);
            File saved = new File(uploadsPath + filename);
            try (InputStream is = d1.getInputStream()) {
                Files.copy(is, saved.toPath());
            }
            u.setDocument1("uploads/" + filename);
        } else {
            u.setDocument1(existing.getDocument1());
        }

        // DOCUMENT 2
        Part d2 = request.getPart("document2");
        if (d2 != null && d2.getSize() > 0) {
            String filename = mobile + "_doc2_" + System.currentTimeMillis() + "_" + getFileName(d2);
            File saved = new File(uploadsPath + filename);
            try (InputStream is = d2.getInputStream()) {
                Files.copy(is, saved.toPath());
            }
            u.setDocument2("uploads/" + filename);
        } else {
            u.setDocument2(existing.getDocument2());
        }

        try {
            dao.updateProfile(u);
            sendJson(response, "{\"status\":\"success\",\"message\":\"Profile updated successfully\"}");
        } catch (Exception e) {
            sendJson(response, "{\"status\":\"error\",\"message\":\"DB Update Failed: " + e.getMessage() + "\"}");
        }
    }

    // utility to extract submitted file name from Part header
    private String getFileName(Part part) {
        String header = part.getHeader("content-disposition");
        if (header == null) return "file";
        for (String cd : header.split(";")) {
            if (cd.trim().startsWith("filename")) {
                String fn = cd.substring(cd.indexOf('=') + 1).trim().replace("\"", "");
                return new File(fn).getName();
            }
        }
        return "file";
    }
}
