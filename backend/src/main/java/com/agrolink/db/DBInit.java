package com.agrolink.db;

import java.sql.Connection;
import java.sql.Statement;

public class DBInit {

    public static void init() {
        try (Connection con = DBConnection.getConnection();
                Statement st = con.createStatement()) {

            st.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        full_name VARCHAR(255),
                        mobile VARCHAR(20) UNIQUE,
                        password VARCHAR(255),
                        email VARCHAR(255),
                        address TEXT,
                        state VARCHAR(100),
                        district VARCHAR(100),
                        pincode VARCHAR(20),
                        role VARCHAR(50),
                        system_role VARCHAR(50),
                        farm_size VARCHAR(50),
                        main_crops VARCHAR(255),
                        bank_account VARCHAR(50),
                        ifsc VARCHAR(50),
                        gst VARCHAR(50),
                        pan VARCHAR(50),
                        aadhar VARCHAR(50),
                        profile_photo VARCHAR(255),
                        document1 VARCHAR(255),
                        document2 VARCHAR(255),
                        verified INT DEFAULT 0,
                        farmer_id VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """);

            st.execute("""
                    CREATE TABLE IF NOT EXISTS crops (
                        crop_id VARCHAR(50) PRIMARY KEY,
                        farmer_id VARCHAR(50),
                        crop_name VARCHAR(255),
                        category VARCHAR(100),
                        quantity INT,
                        soldQty INT DEFAULT 0,
                        price VARCHAR(50),
                        delivery_time VARCHAR(100),
                        grade VARCHAR(50),
                        description TEXT,
                        images TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """);

            st.execute("""
                    CREATE TABLE IF NOT EXISTS insurance_applications (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        insuranceId VARCHAR(50),
                        farmerId VARCHAR(50),
                        fullName VARCHAR(255),
                        area VARCHAR(255),
                        totalLandArea VARCHAR(100),
                        landOwnership VARCHAR(100),
                        phone VARCHAR(20),
                        farmLocation TEXT,
                        cropToInsure VARCHAR(255),
                        cropVariety VARCHAR(255),
                        expectedSowing VARCHAR(100),
                        expectedHarvest VARCHAR(100),
                        pastCropHistory TEXT,
                        govIdNumber VARCHAR(100),
                        aadhaar VARCHAR(50),
                        bankAccount VARCHAR(50),
                        ifsc VARCHAR(50),
                        coverageType VARCHAR(50),
                        landDoc VARCHAR(255),
                        idProof VARCHAR(255),
                        previousPolicy VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """);

            st.execute("""
                    CREATE TABLE IF NOT EXISTS loan_applications (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        loanId VARCHAR(50),
                        fullName VARCHAR(255),
                        dob VARCHAR(50),
                        aadhaar VARCHAR(50),
                        address TEXT,
                        state VARCHAR(100),
                        pinCode VARCHAR(20),
                        phone VARCHAR(20),
                        email VARCHAR(255),
                        loanAmountNeeded VARCHAR(50),
                        loanPurpose TEXT,
                        cropActivity VARCHAR(255),
                        landArea VARCHAR(100),
                        totalLandActivity VARCHAR(255),
                        idProof VARCHAR(255),
                        addressProof VARCHAR(255),
                        landProof VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """);

            System.out.println("✅ AgroLink tables ready");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
