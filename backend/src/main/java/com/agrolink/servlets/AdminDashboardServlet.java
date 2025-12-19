package com.agrolink.servlets;

import com.agrolink.db.DBConnection;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;

public class AdminDashboardServlet extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        setCors(req, resp);
        resp.setContentType("application/json");

        HttpSession session = req.getSession(false);

        // 🔐 ADMIN SECURITY
        if (session == null || !"ADMIN".equals(session.getAttribute("systemRole"))) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        JsonObject result = new JsonObject();

        try (Connection con = DBConnection.getConnection()) {

            /* ================= USERS ================= */
            JsonArray users = new JsonArray();
            ResultSet rsUsers = con.createStatement().executeQuery(
                "SELECT id, full_name, mobile, role, system_role, email, address, state, district, pincode, farm_size, main_crops, bank_account, ifsc, gst, pan, aadhar, profile_photo, document1, document2, verified, farmer_id FROM users"
            );

            while (rsUsers.next()) {
                JsonObject u = new JsonObject();
                u.addProperty("id", rsUsers.getInt("id"));
                u.addProperty("fullName", rsUsers.getString("full_name"));
                u.addProperty("mobile", rsUsers.getString("mobile"));
                u.addProperty("role", rsUsers.getString("role"));
                u.addProperty("systemRole", rsUsers.getString("system_role"));
                u.addProperty("email", rsUsers.getString("email"));
                u.addProperty("address", rsUsers.getString("address"));
                u.addProperty("state", rsUsers.getString("state"));
                u.addProperty("district", rsUsers.getString("district"));
                u.addProperty("pincode", rsUsers.getString("pincode"));
                u.addProperty("farmSize", rsUsers.getString("farm_size"));
                u.addProperty("mainCrops", rsUsers.getString("main_crops"));
                u.addProperty("bankAccount", rsUsers.getString("bank_account"));
                u.addProperty("ifsc", rsUsers.getString("ifsc"));
                u.addProperty("gst", rsUsers.getString("gst"));
                u.addProperty("pan", rsUsers.getString("pan"));
                u.addProperty("aadhar", rsUsers.getString("aadhar"));
                u.addProperty("profilePhoto", rsUsers.getString("profile_photo"));
                u.addProperty("document1", rsUsers.getString("document1"));
                u.addProperty("document2", rsUsers.getString("document2"));
                u.addProperty("verified", rsUsers.getInt("verified"));
                u.addProperty("farmerId", rsUsers.getString("farmer_id"));
                users.add(u);
            }

            /* ================= CROPS ================= */
            JsonArray crops = new JsonArray();
            ResultSet rsCrops = con.createStatement().executeQuery(
                "SELECT crop_id, farmer_id, crop_name, category, quantity, soldQty, price, delivery_time, grade, description, images FROM crops"
            );

            while (rsCrops.next()) {
                JsonObject c = new JsonObject();
                int totalQty = 0;
                int soldQty = 0;
                try { totalQty = Integer.parseInt(rsCrops.getString("quantity")); } catch (Exception ignore) {}
                try { soldQty = Integer.parseInt(rsCrops.getString("soldQty")); } catch (Exception ignore) {}
                int available = Math.max(totalQty - soldQty, 0);

                c.addProperty("cropId", rsCrops.getString("crop_id"));
                c.addProperty("farmerId", rsCrops.getString("farmer_id"));
                c.addProperty("cropName", rsCrops.getString("crop_name"));
                c.addProperty("category", rsCrops.getString("category"));
                c.addProperty("quantity", rsCrops.getString("quantity"));
                c.addProperty("soldQty", rsCrops.getString("soldQty"));
                c.addProperty("availableStock", available);
                c.addProperty("price", rsCrops.getString("price"));
                c.addProperty("deliveryTime", rsCrops.getString("delivery_time"));
                c.addProperty("grade", rsCrops.getString("grade"));
                c.addProperty("description", rsCrops.getString("description"));
                c.addProperty("images", rsCrops.getString("images"));
                crops.add(c);
            }

            /* ================= LOANS ================= */
            JsonArray loans = new JsonArray();
            ResultSet rsLoans = con.createStatement().executeQuery(
                "SELECT loanId, fullName, dob, aadhaar, address, state, pinCode, phone, email, loanAmountNeeded, loanPurpose, cropActivity, landArea, totalLandActivity, idProof, addressProof, landProof FROM loan_applications"
            );

            while (rsLoans.next()) {
                JsonObject l = new JsonObject();
                l.addProperty("loanId", rsLoans.getString("loanId"));
                l.addProperty("fullName", rsLoans.getString("fullName"));
                l.addProperty("dob", rsLoans.getString("dob"));
                l.addProperty("aadhaar", rsLoans.getString("aadhaar"));
                l.addProperty("address", rsLoans.getString("address"));
                l.addProperty("state", rsLoans.getString("state"));
                l.addProperty("pinCode", rsLoans.getString("pinCode"));
                l.addProperty("phone", rsLoans.getString("phone"));
                l.addProperty("email", rsLoans.getString("email"));
                l.addProperty("loanAmountNeeded", rsLoans.getString("loanAmountNeeded"));
                l.addProperty("loanPurpose", rsLoans.getString("loanPurpose"));
                l.addProperty("cropActivity", rsLoans.getString("cropActivity"));
                l.addProperty("landArea", rsLoans.getString("landArea"));
                l.addProperty("totalLandActivity", rsLoans.getString("totalLandActivity"));
                l.addProperty("idProof", rsLoans.getString("idProof"));
                l.addProperty("addressProof", rsLoans.getString("addressProof"));
                l.addProperty("landProof", rsLoans.getString("landProof"));
                loans.add(l);
            }

            /* ================= INSURANCE ================= */
            JsonArray insurance = new JsonArray();
            ResultSet rsIns = con.createStatement().executeQuery(
                "SELECT insuranceId, farmerId, fullName, area, totalLandArea, landOwnership, phone, farmLocation, cropToInsure, cropVariety, expectedSowing, expectedHarvest, pastCropHistory, govIdNumber, aadhaar, bankAccount, ifsc, coverageType, landDoc, idProof, previousPolicy FROM insurance_applications"
            );

            while (rsIns.next()) {
                JsonObject i = new JsonObject();
                i.addProperty("insuranceId", rsIns.getString("insuranceId"));
                i.addProperty("farmerId", rsIns.getString("farmerId"));
                i.addProperty("fullName", rsIns.getString("fullName"));
                i.addProperty("area", rsIns.getString("area"));
                i.addProperty("totalLandArea", rsIns.getString("totalLandArea"));
                i.addProperty("landOwnership", rsIns.getString("landOwnership"));
                i.addProperty("phone", rsIns.getString("phone"));
                i.addProperty("farmLocation", rsIns.getString("farmLocation"));
                i.addProperty("cropToInsure", rsIns.getString("cropToInsure"));
                i.addProperty("cropVariety", rsIns.getString("cropVariety"));
                i.addProperty("expectedSowing", rsIns.getString("expectedSowing"));
                i.addProperty("expectedHarvest", rsIns.getString("expectedHarvest"));
                i.addProperty("pastCropHistory", rsIns.getString("pastCropHistory"));
                i.addProperty("govIdNumber", rsIns.getString("govIdNumber"));
                i.addProperty("aadhaar", rsIns.getString("aadhaar"));
                i.addProperty("bankAccount", rsIns.getString("bankAccount"));
                i.addProperty("ifsc", rsIns.getString("ifsc"));
                i.addProperty("coverageType", rsIns.getString("coverageType"));
                i.addProperty("landDoc", rsIns.getString("landDoc"));
                i.addProperty("idProof", rsIns.getString("idProof"));
                i.addProperty("previousPolicy", rsIns.getString("previousPolicy"));
                insurance.add(i);
            }

            result.add("users", users);
            result.add("crops", crops);
            result.add("loans", loans);
            result.add("insurance", insurance);

            resp.getWriter().print(result.toString());

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}