package com.agrolink.dao;

import com.agrolink.db.DBConnection;
import com.agrolink.model.Crop;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CropDAO {

    // Generate unique crop-id
    public String generateCropId(String farmerId) {
        String last4 = farmerId.substring(farmerId.length() - 4);
        int random = (int)(1000 + Math.random() * 9000);
        return "CROP-" + last4 + "-" + random;
    }

    // ============================
    // SAVE NEW CROP
    // ============================
    public void saveCrop(Crop crop) throws Exception {

        String sql = "INSERT INTO crops "
                + "(crop_id, farmer_id, crop_name, category, quantity, soldQty, price, delivery_time, grade, description, images) "
                + "VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, crop.getCropId());
            ps.setString(2, crop.getFarmerId());
            ps.setString(3, crop.getCropName());
            ps.setString(4, crop.getCategory());
            ps.setString(5, crop.getQuantity());
            ps.setString(6, crop.getPrice());
            ps.setString(7, crop.getDeliveryTime());
            ps.setString(8, crop.getGrade());
            ps.setString(9, crop.getDescription());
            ps.setString(10, crop.getImages());

            ps.executeUpdate();
        }
    }

    // ============================
    // DELETE A CROP
    // ============================
    public void deleteCrop(String cropId) throws Exception {
        String sql = "DELETE FROM crops WHERE crop_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cropId);
            ps.executeUpdate();
        }
    }

    // ============================
    // GET CROP BY ID
    // ============================
    public Crop getCropById(String cropId) throws Exception {

        String sql = "SELECT * FROM crops WHERE crop_id = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cropId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                Crop c = new Crop();
                mapCrop(c, rs);
                return c;
            }
            return null;
        }
    }

    // ============================
    // UPDATE CROP
    // ============================
    public void updateCrop(Crop crop) throws Exception {

        String sql = "UPDATE crops SET crop_name=?, category=?, quantity=?, price=?, description=?, images=? WHERE crop_id=?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, crop.getCropName());
            ps.setString(2, crop.getCategory());
            ps.setString(3, crop.getQuantity());
            ps.setString(4, crop.getPrice());
            ps.setString(5, crop.getDescription());
            ps.setString(6, crop.getImages());
            ps.setString(7, crop.getCropId());

            ps.executeUpdate();
        }
    }

    // ============================
    // FETCH ALL CROPS (BUY PAGE)
    // ============================
    public List<Crop> getAllCrops() throws Exception {

        String sql = "SELECT * FROM crops ORDER BY crop_id DESC";
        List<Crop> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Crop c = new Crop();
                mapCrop(c, rs);
                list.add(c);
            }
        }

        return list;
    }

    // ============================
    // FETCH CROPS BY FARMER (DASHBOARD)
    // ============================
    public List<Crop> getCropsByFarmer(String farmerId) throws Exception {

        String sql = "SELECT * FROM crops WHERE farmer_id = ?";
        List<Crop> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, farmerId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Crop c = new Crop();
                mapCrop(c, rs);
                list.add(c);
            }
        }

        return list;
    }

    // ==========================================================
    // 🔥 REUSABLE MAPPER METHOD — calculates available stock
    // ==========================================================
    private void mapCrop(Crop c, ResultSet rs) throws Exception {

        int totalQty = rs.getInt("quantity");
        int soldQty = rs.getInt("soldQty");

        int available = totalQty - soldQty;
        if (available < 0) available = 0;

        c.setCropId(rs.getString("crop_id"));
        c.setFarmerId(rs.getString("farmer_id"));
        c.setCropName(rs.getString("crop_name"));
        c.setCategory(rs.getString("category"));

        c.setQuantity(String.valueOf(totalQty));
        c.setSoldQty(soldQty);
        c.setAvailableStock(available);

        c.setPrice(rs.getString("price"));
        c.setDeliveryTime(rs.getString("delivery_time"));
        c.setGrade(rs.getString("grade"));
        c.setDescription(rs.getString("description"));
        c.setImages(rs.getString("images"));
    }
}