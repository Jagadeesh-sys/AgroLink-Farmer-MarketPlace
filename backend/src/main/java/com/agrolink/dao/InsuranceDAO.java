package com.agrolink.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

import com.agrolink.db.DBConnection;
import com.agrolink.model.InsuranceApplication;

public class InsuranceDAO {

    private static final String INSERT_QUERY = 
        "INSERT INTO insurance_applications(" +
        "insuranceId, farmerId, fullName, area, totalLandArea, landOwnership, phone, farmLocation," +
        "cropToInsure, cropVariety, expectedSowing, expectedHarvest, pastCropHistory," +
        "govIdNumber, aadhaar, bankAccount, ifsc, coverageType," +
        "landDoc, idProof, previousPolicy) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    public boolean saveApplication(InsuranceApplication ins) {
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(INSERT_QUERY)) {

            ps.setString(1, ins.getInsuranceId());
            ps.setString(2, ins.getFarmerId());

            ps.setString(3, ins.getFullName());
            ps.setString(4, ins.getArea());
            ps.setString(5, ins.getTotalLandArea());
            ps.setString(6, ins.getLandOwnership());
            ps.setString(7, ins.getPhone());
            ps.setString(8, ins.getFarmLocation());

            ps.setString(9, ins.getCropToInsure());
            ps.setString(10, ins.getCropVariety());
            ps.setString(11, ins.getExpectedSowing());
            ps.setString(12, ins.getExpectedHarvest());
            ps.setString(13, ins.getPastCropHistory());

            ps.setString(14, ins.getGovIdNumber());
            ps.setString(15, ins.getAadhaar());
            ps.setString(16, ins.getBankAccount());
            ps.setString(17, ins.getIfsc());
            ps.setString(18, ins.getCoverageType());

            ps.setString(19, ins.getLandDoc());
            ps.setString(20, ins.getIdProof());
            ps.setString(21, ins.getPreviousPolicy());

            return ps.executeUpdate() > 0;

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}