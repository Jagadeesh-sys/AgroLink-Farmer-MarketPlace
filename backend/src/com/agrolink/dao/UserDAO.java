package com.agrolink.dao;

import com.agrolink.db.DBConnection;
import com.agrolink.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {

    // Check if mobile already exists
    public boolean mobileExists(String mobile) throws Exception {
        String sql = "SELECT id FROM users WHERE mobile = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, mobile);
            return ps.executeQuery().next();
        }
    }

    // Basic user registration
    public void register(User user) throws Exception {
        String sql = "INSERT INTO users (full_name, mobile, password) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getFullName());
            ps.setString(2, user.getMobile());
            ps.setString(3, user.getPassword());
            ps.executeUpdate();
        }
    }

    // Login – return full user object
    public User login(String mobile, String password) throws Exception {
        String sql = "SELECT * FROM users WHERE mobile = ? AND password = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, mobile);
            ps.setString(2, password);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
            }
        }
        return null;
    }

    // Used by LoginServlet
    public User getUserByMobileAndPassword(String mobile, String password) throws Exception {
        return login(mobile, password);
    }

    // Get complete user profile
    public User getProfileByMobile(String mobile) throws Exception {
        String sql = "SELECT * FROM users WHERE mobile = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, mobile);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapUser(rs);
                }
            }
        }
        return null;
    }

    // Update full profile (including optional files)
    public void updateProfile(User u) throws Exception {
        String sql =
            "UPDATE users SET "
            + "full_name=?, email=?, address=?, state=?, district=?, pincode=?, role=?, "
            + "farm_size=?, main_crops=?, bank_account=?, ifsc=?, gst=?, pan=?, aadhar=?, "
            + "profile_photo=?, document1=?, document2=?, verified=0 "
            + "WHERE mobile=?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, u.getFullName());
            ps.setString(2, u.getEmail());
            ps.setString(3, u.getAddress());
            ps.setString(4, u.getState());
            ps.setString(5, u.getDistrict());
            ps.setString(6, u.getPincode());
            ps.setString(7, u.getRole());
            ps.setString(8, u.getFarmSize());
            ps.setString(9, u.getMainCrops());
            ps.setString(10, u.getBankAccount());
            ps.setString(11, u.getIfsc());
            ps.setString(12, u.getGst());
            ps.setString(13, u.getPan());
            ps.setString(14, u.getAadhar());
            ps.setString(15, u.getProfilePhoto());
            ps.setString(16, u.getDocument1());
            ps.setString(17, u.getDocument2());
            ps.setString(18, u.getMobile());

            ps.executeUpdate();
        }
    }

    // Convert SQL row → User object
    private User mapUser(ResultSet rs) throws Exception {
        User u = new User();

        u.setId(rs.getInt("id"));
        u.setFullName(rs.getString("full_name"));
        u.setMobile(rs.getString("mobile"));
        u.setPassword(rs.getString("password"));
        u.setEmail(rs.getString("email"));
        u.setAddress(rs.getString("address"));
        u.setState(rs.getString("state"));
        u.setDistrict(rs.getString("district"));
        u.setPincode(rs.getString("pincode"));
        u.setRole(rs.getString("role"));
        u.setFarmSize(rs.getString("farm_size"));
        u.setMainCrops(rs.getString("main_crops"));
        u.setBankAccount(rs.getString("bank_account"));
        u.setIfsc(rs.getString("ifsc"));
        u.setGst(rs.getString("gst"));
        u.setPan(rs.getString("pan"));
        u.setAadhar(rs.getString("aadhar"));
        u.setProfilePhoto(rs.getString("profile_photo"));
        u.setDocument1(rs.getString("document1"));
        u.setDocument2(rs.getString("document2"));
        u.setVerified(rs.getInt("verified"));

        return u;
    }
}
