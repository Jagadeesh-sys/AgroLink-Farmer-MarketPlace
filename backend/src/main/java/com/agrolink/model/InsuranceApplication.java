package com.agrolink.model;

public class InsuranceApplication {

	private String farmerId;
    private String insuranceId;

    private String fullName;
    private String area;
    private String totalLandArea;
    private String landOwnership;
    private String phone;
    private String farmLocation;

    private String cropToInsure;
    private String cropVariety;
    private String expectedSowing;
    private String expectedHarvest;
    private String pastCropHistory;

    private String govIdNumber;
    private String aadhaar;

    private String bankAccount;
    private String ifsc;
    private String coverageType;

    private String landDoc;
    private String idProof;
    private String previousPolicy;


   

    public InsuranceApplication() {}

    // ---- GETTERS + SETTERS ----
    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getInsuranceId() { return insuranceId; }
    public void setInsuranceId(String insuranceId) { this.insuranceId = insuranceId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getTotalLandArea() { return totalLandArea; }
    public void setTotalLandArea(String totalLandArea) { this.totalLandArea = totalLandArea; }

    public String getLandOwnership() { return landOwnership; }
    public void setLandOwnership(String landOwnership) { this.landOwnership = landOwnership; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFarmLocation() { return farmLocation; }
    public void setFarmLocation(String farmLocation) { this.farmLocation = farmLocation; }

    public String getCropToInsure() { return cropToInsure; }
    public void setCropToInsure(String cropToInsure) { this.cropToInsure = cropToInsure; }

    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }

    public String getExpectedSowing() { return expectedSowing; }
    public void setExpectedSowing(String expectedSowing) { this.expectedSowing = expectedSowing; }

    public String getExpectedHarvest() { return expectedHarvest; }
    public void setExpectedHarvest(String expectedHarvest) { this.expectedHarvest = expectedHarvest; }

    public String getPastCropHistory() { return pastCropHistory; }
    public void setPastCropHistory(String pastCropHistory) { this.pastCropHistory = pastCropHistory; }

    public String getGovIdNumber() { return govIdNumber; }
    public void setGovIdNumber(String govIdNumber) { this.govIdNumber = govIdNumber; }

    public String getAadhaar() { return aadhaar; }
    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }

    public String getIfsc() { return ifsc; }
    public void setIfsc(String ifsc) { this.ifsc = ifsc; }

    public String getCoverageType() { return coverageType; }
    public void setCoverageType(String coverageType) { this.coverageType = coverageType; }

    public String getLandDoc() { return landDoc; }
    public void setLandDoc(String landDoc) { this.landDoc = landDoc; }

    public String getIdProof() { return idProof; }
    public void setIdProof(String idProof) { this.idProof = idProof; }

    public String getPreviousPolicy() { return previousPolicy; }
    public void setPreviousPolicy(String previousPolicy) { this.previousPolicy = previousPolicy; }
}