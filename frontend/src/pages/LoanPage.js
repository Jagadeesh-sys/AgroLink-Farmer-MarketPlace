import React, { useState } from "react";
import "../Css/LoanPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LoanPage() {

  /* =====================================================
     EMI CALCULATOR
  ===================================================== */
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interest, setInterest] = useState(7);      // annual %
  const [tenure, setTenure] = useState(12);         // months

  // Correct monthly EMI formula
  const monthlyRate = interest / 12 / 100;
  const emi =
    loanAmount && interest && tenure
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
          (Math.pow(1 + monthlyRate, tenure) - 1)
        )
      : 0;

  /* =====================================================
     MULTI-STEP FORM STATE
  ===================================================== */
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedLoanId, setGeneratedLoanId] = useState(null);

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

  /* =====================================================
     HANDLERS
  ===================================================== */
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
      [name]: files[0] || null,
    }));
  };

  /* =====================================================
     STEP VALIDATION
  ===================================================== */
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

  const nextStep = () => validateStep() && setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  /* =====================================================
     SUBMIT APPLICATION (PROXY SAFE)
  ===================================================== */
  const handleSubmitApplication = async () => {
    if (!validateStep()) return;

    try {
      const data = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        if (!["idProof", "addressProof", "landProof"].includes(key)) {
          data.append(key, formData[key]);
        }
      });

      // Add files
      data.append("idProof", formData.idProof);
      data.append("addressProof", formData.addressProof);
      data.append("landProof", formData.landProof);

      const response = await fetch("/api/loan/apply", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "SUCCESS") {
        setGeneratedLoanId(result.loanId);
        setShowSuccess(true);
      } else {
        alert(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("❌ Loan Submit Error:", error);
      alert("Failed to submit application.");
    }
  };

  const progressPercent = (step / 3) * 100;

  /* =====================================================
     UI
  ===================================================== */
  return (
    <>
      <Navbar />

      <div className="loan-container">

        {/* HERO */}
        <div className="loan-hero">
          <h1>Apply for Your Agri-Loan</h1>
          <p>Quick, hassle-free financing designed for your crop cycle.</p>
        </div>

        {/* EMI CALCULATOR */}
        <div className="emi-card">
          <h3>EMI Calculator</h3>

          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Loan Amount"
          />

          <input
            type="number"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Interest (%)"
          />

          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="Tenure (Months)"
          />

          <p><strong>Estimated EMI:</strong> ₹{emi}</p>
        </div>

        {/* APPLICATION FORM */}
        <h2 className="section-title">Apply for Loan</h2>

        <div className="loan-application-card">

          {/* Progress Bar */}
          <div className="loan-app-progress">
            <div
              className="loan-app-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div className="loan-step-content">
              <h4 className="loan-step-title">Step 1: Personal Details</h4>

              <div className="loan-grid">
                <div className="field">
                  <label>Full Name *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>DOB *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Aadhaar *</label>
                  <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} maxLength="12" />
                </div>

                <div className="field">
                  <label>Mobile *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} maxLength="10" />
                </div>

                <div className="field wide">
                  <label>Address *</label>
                  <input name="address" value={formData.address} onChange={handleChange} />
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

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div className="loan-step-content">
              <h4 className="loan-step-title">Step 2: Loan Requirements</h4>

              <div className="loan-grid">
                <div className="field">
                  <label>Loan Amount Needed *</label>
                  <input name="loanAmountNeeded" value={formData.loanAmountNeeded} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Loan Purpose *</label>
                  <input name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Crop / Activity *</label>
                  <input name="cropActivity" value={formData.cropActivity} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Land Area *</label>
                  <input name="landArea" value={formData.landArea} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Total Land Activity *</label>
                  <input name="totalLandActivity" value={formData.totalLandActivity} onChange={handleChange} />
                </div>
              </div>

              <div className="loan-step-actions">
                <button className="back-btn" onClick={prevStep}>Back</button>
                <button className="next-btn" onClick={nextStep}>Next</button>
              </div>
            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <div className="loan-step-content">
              <h4 className="loan-step-title">Step 3: Document Uploads</h4>

              <div className="upload-grid">
                <label className="upload-card">
                  <p>ID Proof</p>
                  <span>{formData.idProof?.name ?? "Upload ID Proof"}</span>
                  <input type="file" name="idProof" onChange={handleFileChange} />
                </label>

                <label className="upload-card">
                  <p>Address Proof</p>
                  <span>{formData.addressProof?.name ?? "Upload Address Proof"}</span>
                  <input type="file" name="addressProof" onChange={handleFileChange} />
                </label>

                <label className="upload-card">
                  <p>Land Proof</p>
                  <span>{formData.landProof?.name ?? "Upload Land Proof"}</span>
                  <input type="file" name="landProof" onChange={handleFileChange} />
                </label>
              </div>

              <label className="declaration-row">
                <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} />
                <span>I declare that all information provided is true.</span>
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
              <h2>Success</h2>
              <p>Your loan application has been submitted.</p>
              <p><strong>Loan ID:</strong> {generatedLoanId}</p>
              <button className="success-btn" onClick={() => setShowSuccess(false)}>OK</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default LoanPage;
