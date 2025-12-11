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

    private static final String FIXED_UPLOAD_PATH = "D:/AgroLink/backend/WebContent/uploads/";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException, ServletException {

        setCors(req, resp);  // ⭐ IMPORTANT

        System.out.println("LoanApplyServlet started");

        resp.setContentType("text/plain");
        resp.setCharacterEncoding("UTF-8");

        LoanApplication loan = new LoanApplication();

        loan.setFullName(req.getParameter("fullName"));
        loan.setDob(req.getParameter("dob"));
        loan.setAadhaar(req.getParameter("aadhaar"));
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

        File folder = new File(FIXED_UPLOAD_PATH);
        if (!folder.exists()) folder.mkdirs();

        loan.setIdProof(saveFile(req.getPart("idProof")));
        loan.setAddressProof(saveFile(req.getPart("addressProof")));
        loan.setLandProof(saveFile(req.getPart("landProof")));

        LoanDAO dao = new LoanDAO();
        boolean ok = dao.saveLoanApplication(loan);

        if (ok) {
            System.out.println("SUCCESS");
            resp.getWriter().print("SUCCESS");  // ⭐ EXACT TEXT
        } else {
            resp.setStatus(500);
            resp.getWriter().print("ERROR");
        }
    }

    private String saveFile(Part part) throws IOException {
        if (part == null) return null;

        String fileName = part.getSubmittedFileName();
        if (fileName == null || fileName.isEmpty()) return null;

        String finalName = System.currentTimeMillis() + "_" + fileName;
        part.write(FIXED_UPLOAD_PATH + finalName);

        return finalName;
    }
}
