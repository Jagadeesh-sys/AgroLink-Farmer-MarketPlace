package com.agrolink.servlets;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.*;

import com.agrolink.dao.LoanDAO;
import com.agrolink.model.LoanApplication;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 20
)
public class LoanApplyServlet extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {

        setCors(req, resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        System.out.println("LoanApplyServlet started");

        LoanDAO dao = new LoanDAO();

        File uploadDir = resolveUploadsDir(req);

        // ------------------------------
        // 1️⃣ Aadhaar Duplication Check
        // ------------------------------
        String aadhaar = req.getParameter("aadhaar");

        if (dao.isAadhaarExists(aadhaar)) {
            resp.getWriter().write(
                    "{\"status\":\"ERROR\", \"message\":\"Aadhaar already registered\"}"
            );
            return;
        }

        // ------------------------------
        // 2️⃣ Create Loan Application
        // ------------------------------
        LoanApplication loan = new LoanApplication();

        String loanId = dao.generateLoanId();
        loan.setLoanId(loanId);

        loan.setFullName(req.getParameter("fullName"));
        loan.setDob(req.getParameter("dob"));
        loan.setAadhaar(aadhaar);
        loan.setAddress(req.getParameter("address"));
        loan.setState(req.getParameter("state"));
        loan.setPinCode(req.getParameter("pinCode"));
        loan.setPhone(req.getParameter("phone"));
        loan.setEmail(req.getParameter("email"));

        loan.setLoanAmountNeeded(req.getParameter("loanAmountNeeded"));
        loan.setLoanPurpose(req.getParameter("loanPurpose"));
        loan.setCropActivity(req.getParameter("cropActivity"));
        loan.setLandArea(req.getParameter("landArea"));
        loan.setTotalLandActivity(req.getParameter("totalLandActivity"));

        // ------------------------------
        // 3️⃣ Save files (SOURCE folder)
        // ------------------------------
        loan.setIdProof(saveFile(req.getPart("idProof"), uploadDir));
        loan.setAddressProof(saveFile(req.getPart("addressProof"), uploadDir));
        loan.setLandProof(saveFile(req.getPart("landProof"), uploadDir));

        // ------------------------------
        // 4️⃣ Save to Database
        // ------------------------------
        boolean ok = dao.saveLoanApplication(loan);

        // ------------------------------
        // 5️⃣ Send JSON Response
        // ------------------------------
        if (ok) {
            resp.getWriter().write(
                    "{\"status\":\"SUCCESS\", \"loanId\":\"" + loanId + "\"}"
            );
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(
                    "{\"status\":\"ERROR\", \"message\":\"Database error\"}"
            );
        }
    }

    // ------------------------------
    // Save uploaded file (SOURCE)
    // ------------------------------
    private String saveFile(Part part, File uploadDir) throws IOException {

        if (part == null || part.getSize() == 0) return null;

        String original = part.getSubmittedFileName();
        if (original == null || original.trim().isEmpty()) return null;

        String safeName = original.replaceAll("[^a-zA-Z0-9._-]", "_");
        String finalName = System.currentTimeMillis() + "_" + safeName;

        part.write(new File(uploadDir, finalName).getAbsolutePath());

        // ✅ store ONLY filename
        return finalName;
    }
}
