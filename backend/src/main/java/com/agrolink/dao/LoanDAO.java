package com.agrolink.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.agrolink.db.DBConnection;
import com.agrolink.model.LoanApplication;

public class LoanDAO {

    private static final String INSERT_QUERY =
        "INSERT INTO loan_applications(loanId, fullName, dob, aadhaar, address, state, pinCode, phone, email, loanAmountNeeded, loanPurpose, cropActivity, landArea, totalLandActivity, idProof, addressProof, landProof) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String CHECK_AADHAAR =
        "SELECT COUNT(*) FROM loan_applications WHERE aadhaar = ?";

    // ----------------------------------------------------
    // ⭐ Check if Aadhaar already exists
    // ----------------------------------------------------
    public boolean isAadhaarExists(String aadhaar) {
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(CHECK_AADHAAR)) {

            ps.setString(1, aadhaar);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;   // Aadhaar found
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // ----------------------------------------------------
    // ⭐ Generate unique Loan ID (e.g., LN1733919300123)
    // ----------------------------------------------------
    public String generateLoanId() {
        return "LN" + System.currentTimeMillis();
    }

    // ----------------------------------------------------
    // ⭐ Save Loan Application
    // ----------------------------------------------------
    public boolean saveLoanApplication(LoanApplication loan) {
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(INSERT_QUERY)) {

            ps.setString(1, loan.getLoanId());
            ps.setString(2, loan.getFullName());
            ps.setString(3, loan.getDob());
            ps.setString(4, loan.getAadhaar());
            ps.setString(5, loan.getAddress());
            ps.setString(6, loan.getState());
            ps.setString(7, loan.getPinCode());
            ps.setString(8, loan.getPhone());
            ps.setString(9, loan.getEmail());
            ps.setString(10, loan.getLoanAmountNeeded());
            ps.setString(11, loan.getLoanPurpose());
            ps.setString(12, loan.getCropActivity());
            ps.setString(13, loan.getLandArea());
            ps.setString(14, loan.getTotalLandActivity());
            ps.setString(15, loan.getIdProof());
            ps.setString(16, loan.getAddressProof());
            ps.setString(17, loan.getLandProof());

            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}