package com.agrolink.model;

public class LoanApplication {

    private String loanId;  // ⭐ NEW FIELD — REQUIRED

    private String fullName;
    private String dob;
    private String aadhaar;
    private String address;
    private String state;
    private String pinCode;
    private String phone;
    private String email;

    private String loanAmountNeeded;
    private String loanPurpose;
    private String cropActivity;
    private String landArea;
    private String totalLandActivity;

    private String idProof;
    private String addressProof;
    private String landProof;

    public LoanApplication() {}

    // ---- Getters & Setters ----
    
    public String getLoanId() {
        return loanId;
    }

    public void setLoanId(String loanId) {
        this.loanId = loanId;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getAadhaar() { return aadhaar; }
    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLoanAmountNeeded() { return loanAmountNeeded; }
    public void setLoanAmountNeeded(String loanAmountNeeded) { this.loanAmountNeeded = loanAmountNeeded; }

    public String getLoanPurpose() { return loanPurpose; }
    public void setLoanPurpose(String loanPurpose) { this.loanPurpose = loanPurpose; }

    public String getCropActivity() { return cropActivity; }
    public void setCropActivity(String cropActivity) { this.cropActivity = cropActivity; }

    public String getLandArea() { return landArea; }
    public void setLandArea(String landArea) { this.landArea = landArea; }

    public String getTotalLandActivity() { return totalLandActivity; }
    public void setTotalLandActivity(String totalLandActivity) { this.totalLandActivity = totalLandActivity; }

    public String getIdProof() { return idProof; }
    public void setIdProof(String idProof) { this.idProof = idProof; }

    public String getAddressProof() { return addressProof; }
    public void setAddressProof(String addressProof) { this.addressProof = addressProof; }

    public String getLandProof() { return landProof; }
    public void setLandProof(String landProof) { this.landProof = landProof; }
}