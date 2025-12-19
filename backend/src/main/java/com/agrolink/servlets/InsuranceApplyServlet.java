package com.agrolink.servlets;

import com.agrolink.db.DBConnection;
import com.google.gson.JsonObject;

import java.io.*;
import java.sql.*;
import java.util.UUID;
import javax.servlet.*;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.*;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 15,
        maxRequestSize = 1024 * 1024 * 50
)
public class InsuranceApplyServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        setCors(req, resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        JsonObject json = new JsonObject();

        try (Connection conn = DBConnection.getConnection()) {

            /* -------------------------------
               SESSION CHECK
            -------------------------------- */
            HttpSession session = req.getSession(false);
            String farmerId = (session != null)
                    ? (String) session.getAttribute("farmerId")
                    : null;

            if (farmerId == null || farmerId.trim().isEmpty()) {
                throw new RuntimeException("Login required");
            }

            /* -------------------------------
               INSURANCE ID
            -------------------------------- */
            String insuranceId =
                    "INS-" + UUID.randomUUID().toString()
                            .substring(0, 8).toUpperCase();

            /* -------------------------------
               READ FIELDS
            -------------------------------- */
            String fullName = req.getParameter("fullName");
            String area = req.getParameter("area");
            String totalLandArea = req.getParameter("totalLandArea");
            String landOwnership = req.getParameter("landOwnership");
            String phone = req.getParameter("phone");
            String farmLocation = req.getParameter("farmLocation");
            String cropToInsure = req.getParameter("cropToInsure");
            String cropVariety = req.getParameter("cropVariety");
            String expectedSowing = req.getParameter("expectedSowing");
            String expectedHarvest = req.getParameter("expectedHarvest");
            String pastCropHistory = req.getParameter("pastCropHistory");
            String govIdNumber = req.getParameter("govIdNumber");
            String aadhaar = req.getParameter("aadhaar");
            String bankAccount = req.getParameter("bankAccount");
            String ifsc = req.getParameter("ifsc");
            String coverageType = req.getParameter("coverageType");

            /* -------------------------------
               UPLOAD DIRECTORY (SOURCE)
            -------------------------------- */
            File uploadDir = resolveUploadsDir(req);

            String landDoc = saveFile(req.getPart("landDoc"), uploadDir);
            String idProof = saveFile(req.getPart("idProof"), uploadDir);
            String previousPolicy = saveFile(req.getPart("previousPolicy"), uploadDir);

            /* -------------------------------
               SQL INSERT
            -------------------------------- */
            String sql = "INSERT INTO insurance_applications (" +
                    "insuranceId, farmerId, fullName, area, totalLandArea, landOwnership, phone, farmLocation, " +
                    "cropToInsure, cropVariety, expectedSowing, expectedHarvest, pastCropHistory, govIdNumber, aadhaar, " +
                    "bankAccount, ifsc, coverageType, landDoc, idProof, previousPolicy" +
                    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            PreparedStatement ps = conn.prepareStatement(sql);

            ps.setString(1, insuranceId);
            ps.setString(2, farmerId);
            ps.setString(3, fullName);
            ps.setString(4, area);
            ps.setString(5, totalLandArea);
            ps.setString(6, landOwnership);
            ps.setString(7, phone);
            ps.setString(8, farmLocation);
            ps.setString(9, cropToInsure);
            ps.setString(10, cropVariety);
            ps.setString(11, expectedSowing);
            ps.setString(12, expectedHarvest);
            ps.setString(13, pastCropHistory);
            ps.setString(14, govIdNumber);
            ps.setString(15, aadhaar);
            ps.setString(16, bankAccount);
            ps.setString(17, ifsc);
            ps.setString(18, coverageType);
            ps.setString(19, landDoc);
            ps.setString(20, idProof);
            ps.setString(21, previousPolicy);

            int result = ps.executeUpdate();

            if (result > 0) {
                json.addProperty("status", "SUCCESS");
                json.addProperty("insuranceId", insuranceId);
            } else {
                json.addProperty("status", "FAILED");
            }

        } catch (Exception e) {
            e.printStackTrace();
            json.addProperty("status", "ERROR");
            json.addProperty("message", e.getMessage());
        }

        resp.getWriter().print(json.toString());
    }

    /* -------------------------------
       SAVE FILE (SOURCE FOLDER)
    -------------------------------- */
    private String saveFile(Part part, File uploadDir) throws IOException {
        if (part == null || part.getSize() == 0) return "";

        String safeName = part.getSubmittedFileName()
                .replaceAll("[^a-zA-Z0-9._-]", "_");

        String fileName = System.currentTimeMillis() + "_" + safeName;
        part.write(new File(uploadDir, fileName).getAbsolutePath());

        // ✅ store relative path
        return "uploads/" + fileName;
    }
}
