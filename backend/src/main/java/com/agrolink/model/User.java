package com.agrolink.model;

public class User {

    private long id;
    private String fullName;
    private String mobile;
    private String password;

    // Common fields
    private String email;
    private String address;
    private String state;
    private String district;
    private String pincode;
    private String role;  // farmer / buyer

    // Farmer fields
    private String farmSize;
    private String mainCrops;
    private String bankAccount;
    private String ifsc;
    private String aadhar;

    // Buyer fields
    private String gst;
    private String pan;

    // Files
    private String profilePhoto;
    private String document1;
    private String document2;

    // Verification status
    private int verified;
    
    private String farmerId;
    private String systemRole;


    // Getters & Setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFarmSize() { return farmSize; }
    public void setFarmSize(String farmSize) { this.farmSize = farmSize; }

    public String getMainCrops() { return mainCrops; }
    public void setMainCrops(String mainCrops) { this.mainCrops = mainCrops; }

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }

    public String getIfsc() { return ifsc; }
    public void setIfsc(String ifsc) { this.ifsc = ifsc; }

    public String getAadhar() { return aadhar; }
    public void setAadhar(String aadhar) { this.aadhar = aadhar; }

    public String getGst() { return gst; }
    public void setGst(String gst) { this.gst = gst; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getDocument1() { return document1; }
    public void setDocument1(String document1) { this.document1 = document1; }

    public String getDocument2() { return document2; }
    public void setDocument2(String document2) { this.document2 = document2; }

    public int getVerified() { return verified; }
    public void setVerified(int verified) { this.verified = verified; }

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }
    
    public String getSystemRole() {
        return systemRole;
    }

    public void setSystemRole(String systemRole) {
        this.systemRole = systemRole;
    }

}