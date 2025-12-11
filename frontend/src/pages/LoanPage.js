import React, { useState } from "react";
import "../Css/LoanPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LoanPage() {
  // ---------------------------------------------------
  // EMI CALCULATOR
  // ---------------------------------------------------
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interest, setInterest] = useState(7);
  const [tenure, setTenure] = useState(12);

  const emi =
    (loanAmount * interest * 0.01 * Math.pow(1 + interest * 0.01, tenure)) /
    (Math.pow(1 + interest * 0.01, tenure) - 1);

  // ---------------------------------------------------
  // MULTI-STEP FORM
  // ---------------------------------------------------
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    aadhaar: "",
    address: "",
    state: "",
    pinCode: "",
    phone: "",
    email: "",
    loanAmountNeeded: "",
    loanPurpose: "",
    cropActivity: "",
    landArea: "",
    totalLandActivity: "",
    idProof: null,
    addressProof: null,
    landProof: null,
    declaration: false,
  });

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files.length > 0 ? files[0] : null,
    }));
  };

  // ---------------------------------------------------
  // STEP VALIDATION
  // ---------------------------------------------------
  const validateStep = () => {
    if (step === 1) {
      const { fullName, dob, aadhaar, address, state, pinCode, phone } = formData;
      if (!fullName || !dob || !aadhaar || !address || !state || !pinCode || !phone) {
        alert("Please fill all personal details.");
        return false;
      }
    }

    if (step === 2) {
      const { loanAmountNeeded, loanPurpose, cropActivity, landArea, totalLandActivity } =
        formData;

      if (!loanAmountNeeded || !loanPurpose || !cropActivity || !landArea || !totalLandActivity) {
        alert("Please fill all agricultural details.");
        return false;
      }
    }

    if (step === 3) {
      const { idProof, addressProof, landProof, declaration } = formData;

      if (!idProof || !addressProof || !landProof) {
        alert("Please upload all required documents.");
        return false;
      }
      if (!declaration) {
        alert("Please accept Terms & Conditions.");
        return false;
      }
    }

    return true;
  };

  // ---------------------------------------------------
  // HANDLE STEPS
  // ---------------------------------------------------
  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  // ---------------------------------------------------
  // BACKEND API CALL
  // ---------------------------------------------------
  const handleSubmitApplication = async () => {
    if (!validateStep()) return;

    try {
      const data = new FormData();

      // ADD TEXT FIELDS
      Object.keys(formData).forEach((key) => {
        if (!["idProof", "addressProof", "landProof"].includes(key)) {
          data.append(key, formData[key]);
        }
      });

      // ADD FILE FIELDS
      data.append("idProof", formData.idProof);
      data.append("addressProof", formData.addressProof);
      data.append("landProof", formData.landProof);

      const response = await fetch("http://localhost:9090/backend/api/loan/apply", {
        method: "POST",
        body: data,
      });

      const raw = await response.text();
      const cleaned = raw.replace(/"/g, "").trim().toUpperCase();

      console.log("🚀 Raw Response:", raw);
      console.log("🧼 Cleaned Response:", cleaned);

      if (cleaned === "SUCCESS") {
        setShowSuccess(true);
      } else {
        alert("Unexpected response: " + raw);
      }
    } catch (error) {
      console.error("❌ Loan Submit Error:", error);
      alert("Failed to submit application.");
    }
  };

  const progressPercent = (step / 3) * 100;

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <>
      <Navbar />

      <div className="loan-container">
        {/* HERO */}
        <div className="loan-hero">
          <h1>Apply for Your Agri-Loan</h1>
          <p>Quick, hassle-free financing designed for your crop cycle.</p>
        </div>

        {/* LOAN PRODUCTS */}
        <h2 className="section-title">Our Loan Products</h2>

        <div className="loan-products-container">
          <div className="loan-product-card">
            <i className="fa-solid fa-wheat-awn loan-product-icon"></i>
            <h3>Crop Loan</h3>
            <p>Finance for seeds, fertilizers & pesticides.</p>
            <span>7% Interest • Short Term</span>
          </div>

          <div className="loan-product-card">
            <i className="fa-solid fa-tractor loan-product-icon"></i>
            <h3>Equipment Loan</h3>
            <p>Buy tractors, harvesters, irrigation tools.</p>
            <span>6.5% Interest • Medium Term</span>
          </div>

          <div className="loan-product-card">
            <i className="fa-solid fa-cow loan-product-icon"></i>
            <h3>Livestock Loan</h3>
            <p>Dairy, cattle, goats, poultry & more.</p>
            <span>8% Interest • Medium Term</span>
          </div>

          <div className="loan-product-card">
            <i className="fa-solid fa-shop loan-product-icon"></i>
            <h3>Agri-Business Loan</h3>
            <p>Agri-shops, processing units, cold storage.</p>
            <span>9% Interest • Long Term</span>
          </div>
        </div>

        {/* EMI CALCULATOR */}
        <h2 className="section-title">EMI Calculator</h2>

        <div className="emi-box">
          <div className="emi-left">
            <label>Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />

            <label>Interest Rate (%)</label>
            <input
              type="number"
              value={interest}
              onChange={(e) => setInterest(Number(e.target.value))}
            />

            <label>Tenure (Months)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
            />
          </div>

          <div className="emi-right">
            <h3>Calculated EMI</h3>
            <p className="emi-value">₹ {emi ? emi.toFixed(2) : "0.00"}</p>
            <span>per month</span>
          </div>
        </div>

        {/* APPLICATION FORM */}
        <h2 className="section-title">Apply for Loan</h2>

        <div className="loan-application-card">
          {/* Progress Bar */}
          <div className="loan-app-progress">
            <div className="loan-app-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="loan-step-content">
              <h4 className="loan-step-title">Step 1: Personal Details</h4>

              <div className="loan-grid">
                <div className="field">
                  <label>Full Name *</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>DOB *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Aadhaar / PAN *</label>
                  <input
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Mobile Number *</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="field wide">
                  <label>Address *</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>State *</label>
                  <input name="state" value={formData.state} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Pin Code *</label>
                  <input name="pinCode" value={formData.pinCode} onChange={handleChange} />
                </div>
              </div>

              <div className="loan-step-actions">
                <button className="next-btn" onClick={nextStep}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="loan-step-content">
              <h4 className="loan-step-title">Step 2: Loan Requirements</h4>

              <div className="loan-grid">
                <div className="field">
                  <label>Loan Amount Needed *</label>
                  <input
                    name="loanAmountNeeded"
                    value={formData.loanAmountNeeded}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Loan Purpose *</label>
                  <input
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Crop / Activity *</label>
                  <input
                    name="cropActivity"
                    value={formData.cropActivity}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Land Area (Acres) *</label>
                  <input
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Total Land Activity *</label>
                  <input
                    name="totalLandActivity"
                    value={formData.totalLandActivity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="loan-step-actions">
                <button className="back-btn" onClick={prevStep}>Back</button>
                <button className="next-btn" onClick={nextStep}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="loan-step-content">
              <h4 className="loan-step-title">Step 3: Document Uploads</h4>

              <div className="upload-grid">
                <label className="upload-card">
                  <i className="fa-solid fa-id-card upload-fa-icon"></i>
                  <p>ID Proof</p>
                  <span>{formData.idProof?.name ?? "Upload ID Proof"}</span>
                  <input type="file" name="idProof" onChange={handleFileChange} />
                </label>

                <label className="upload-card">
                  <i className="fa-solid fa-location-dot upload-fa-icon"></i>
                  <p>Address Proof</p>
                  <span>{formData.addressProof?.name ?? "Upload Address Proof"}</span>
                  <input type="file" name="addressProof" onChange={handleFileChange} />
                </label>

                <label className="upload-card">
                  <i className="fa-solid fa-file-contract upload-fa-icon"></i>
                  <p>Land Proof</p>
                  <span>{formData.landProof?.name ?? "Upload Land Proof"}</span>
                  <input type="file" name="landProof" onChange={handleFileChange} />
                </label>
              </div>

              <label className="declaration-row">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                />
                <span>I declare that all information provided is true and accurate.</span>
              </label>

              <div className="loan-step-actions single">
                <button className="back-btn" onClick={prevStep}>Back</button>
                <button className="submit-main-btn" onClick={handleSubmitApplication}>
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SUCCESS POPUP */}
        {showSuccess && (
          <div className="success-popup">
            <div className="success-box">
              <div className="success-icon">
                <i className="fa-solid fa-check"></i>
              </div>

              <h2>Success</h2>
              <p>Your loan application has been submitted successfully.</p>

              <button className="success-btn" onClick={() => setShowSuccess(false)}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default LoanPage;
