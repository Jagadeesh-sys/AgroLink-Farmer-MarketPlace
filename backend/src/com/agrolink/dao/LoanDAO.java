package com.agrolink.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

import com.agrolink.db.DBConnection;
import com.agrolink.model.LoanApplication;

public class LoanDAO {

    private static final String INSERT_QUERY =
        "INSERT INTO loan_applications(fullName, dob, aadhaar, address, state, pinCode, phone, email, loanAmountNeeded, loanPurpose, cropActivity, landArea, totalLandActivity, idProof, addressProof, landProof) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    public boolean saveLoanApplication(LoanApplication loan) {
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(INSERT_QUERY)) {

            ps.setString(1, loan.getFullName());
            ps.setString(2, loan.getDob());
            ps.setString(3, loan.getAadhaar());
            ps.setString(4, loan.getAddress());
            ps.setString(5, loan.getState());
            ps.setString(6, loan.getPinCode());
            ps.setString(7, loan.getPhone());
            ps.setString(8, loan.getEmail());
            ps.setString(9, loan.getLoanAmountNeeded());
            ps.setString(10, loan.getLoanPurpose());
            ps.setString(11, loan.getCropActivity());
            ps.setString(12, loan.getLandArea());
            ps.setString(13, loan.getTotalLandActivity());
            ps.setString(14, loan.getIdProof());
            ps.setString(15, loan.getAddressProof());
            ps.setString(16, loan.getLandProof());

            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
