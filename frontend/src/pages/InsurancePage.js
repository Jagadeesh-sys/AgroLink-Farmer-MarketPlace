import React, { useState } from "react";
import "../Css/InsurancePage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../api/apiClient";

function InsurancePage() {
  const [form, setForm] = useState({
    fullName: "",
    area: "",
    totalLandArea: "",
    landOwnership: "Owned",
    phone: "",
    farmLocation: "",
    cropToInsure: "",
    cropVariety: "",
    expectedSowing: "",
    expectedHarvest: "",
    pastCropHistory: "",
    govIdNumber: "",
    aadhaar: "",
    bankAccount: "",
    ifsc: "",
    coverageType: "",
    landDoc: null,
    idProof: null,
    previousPolicy: null,
    agree: false,
  });

  const [activeDrag, setActiveDrag] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdInsuranceId, setCreatedInsuranceId] = useState(null);

  // HANDLE TEXT INPUT
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // HANDLE FILE CHOOSE
  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // DRAG DROP
  const handleDragOver = (e, field) => {
    e.preventDefault();
    setActiveDrag(field);
  };

  const handleDragLeave = () => setActiveDrag(null);

  const handleDrop = (e, field) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, [field]: file }));
    }
    setActiveDrag(null);
  };

  const DragUpload = ({ field, label }) => (
    <label
      className={`upload-box ${activeDrag === field ? "drag-active" : ""}`}
      onDragOver={(e) => handleDragOver(e, field)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, field)}
    >
      <input type="file" name={field} onChange={handleFileSelect} />
      <div className="upload-icon">⬆</div>
      <div className="upload-text">{label}</div>
      {form[field] && <div className="file-name">📄 {form[field].name}</div>}
    </label>
  );

  // VALIDATION
  const validate = () => {
    if (!form.fullName || !form.phone || !form.aadhaar) {
      alert("Please fill Full Name, Phone and Aadhaar.");
      return false;
    }
    if (!form.cropToInsure || !form.totalLandArea) {
      alert("Please fill crop and land information.");
      return false;
    }
    if (!form.landDoc || !form.idProof) {
      alert("Please upload required documents.");
      return false;
    }
    if (!form.agree) {
      alert("Please accept the declaration.");
      return false;
    }
    return true;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;

    const fd = new FormData();

    const fields = [
      "fullName","area","totalLandArea","landOwnership","phone","farmLocation",
      "cropToInsure","cropVariety","expectedSowing","expectedHarvest","pastCropHistory",
      "govIdNumber","aadhaar","bankAccount","ifsc","coverageType"
    ];

    fields.forEach((key) => fd.append(key, form[key] ?? ""));

    if (form.landDoc) fd.append("landDoc", form.landDoc);
    if (form.idProof) fd.append("idProof", form.idProof);
    if (form.previousPolicy) fd.append("previousPolicy", form.previousPolicy);

    try {
      setSubmitting(true);

      const res = await apiFetch("/api/insurance/apply", {
        method: "POST",
        body: fd,
        credentials: "include",   // ⭐ REQUIRED FOR SESSION COOKIE (JSESSIONID)
      });

      const json = await res.json();

      if (res.ok && json.status === "SUCCESS") {
        setCreatedInsuranceId(json.insuranceId);
        setShowSuccess(true);
      } else {
        alert("Submission failed.");
        console.log("DEBUG RESPONSE:", json);
      }
    } catch (err) {
      console.error("NETWORK ERROR", err);
      alert("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="insurance-page">
        <header className="insurance-hero">
          <div className="circle-right-1"></div>
          <div className="circle-right-2"></div>
          <div className="circle-left-3"></div>
          <div className="circle-left-4"></div>

          <h1>Apply for Farm Insurance</h1>
          <p>Secure your farm from unpredictable weather and losses.</p>
        </header>

        <main className="insurance-main container">

          {/* ROW 1 */}
          <section className="grid-row">
            <div className="card">
              <div className="card-badge">1</div>
              <h3>Applicant Details</h3>

              <div className="form-row">
                <label>Full Name <input name="fullName" value={form.fullName} onChange={onChange} /></label>
                <label>Area <input name="area" value={form.area} onChange={onChange} /></label>
              </div>

              <div className="form-row">
                <label>Total Land Area <input name="totalLandArea" value={form.totalLandArea} onChange={onChange} /></label>
                <label>Land Ownership
                  <select name="landOwnership" value={form.landOwnership} onChange={onChange}>
                    <option>Owned</option>
                    <option>Leased</option>
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>Phone <input name="phone" value={form.phone} onChange={onChange} /></label>
                <label>Farm Location <input name="farmLocation" value={form.farmLocation} onChange={onChange} /></label>
              </div>

              <DragUpload field="landDoc" label="Upload Land Document" />
            </div>

            <div className="card">
              <div className="card-badge">2</div>
              <h3>Farm Information</h3>

              <div className="form-row">
                <label>Crop to Insure <input name="cropToInsure" value={form.cropToInsure} onChange={onChange} /></label>
                <label>Crop Variety <input name="cropVariety" value={form.cropVariety} onChange={onChange} /></label>
              </div>

              <div className="form-row">
                <label>Sowing Date <input type="date" name="expectedSowing" value={form.expectedSowing} onChange={onChange} /></label>
                <label>Harvest Date <input type="date" name="expectedHarvest" value={form.expectedHarvest} onChange={onChange} /></label>
              </div>

              <label className="textarea-label">
                Past Crop History
                <textarea name="pastCropHistory" rows={4} value={form.pastCropHistory} onChange={onChange} />
              </label>
            </div>
          </section>

          {/* ROW 2 */}
          <section className="grid-row">

            <div className="card">
              <div className="card-badge">3</div>
              <h3>ID & Bank Details</h3>

              <div className="form-row">
                <label>Gov ID <input name="govIdNumber" value={form.govIdNumber} onChange={onChange} /></label>
                <label>Aadhaar <input name="aadhaar" value={form.aadhaar} onChange={onChange} /></label>
              </div>

              <div className="form-row">
                <label>Bank Account <input name="bankAccount" value={form.bankAccount} onChange={onChange} /></label>
                <label>IFSC <input name="ifsc" value={form.ifsc} onChange={onChange} /></label>
              </div>

              <div className="coverage-wrapper">
                <span>Coverage Type</span>
                <select name="coverageType" value={form.coverageType} onChange={onChange}>
                  <option value="">Select Coverage</option>
                  <option value="Crop">Crop Insurance</option>
                  <option value="Livestock">Livestock Insurance</option>
                  <option value="Equipment">Equipment Insurance</option>
                  <option value="Health">Farmer Health Insurance</option>
                </select>
              </div>

              <div className="upload-inline">
                <DragUpload field="idProof" label="Upload ID Proof" />
                <DragUpload field="previousPolicy" label="Previous Policy (Optional)" />
              </div>
            </div>

            <div className="card">
              <div className="card-badge">4</div>
              <h3>Declaration</h3>

              <p className="notes">
                Please ensure all information is correct before submitting.
              </p>

              <label className="declaration">
                <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
                I confirm the above information is true.
              </label>
            </div>
          </section>

          <div className="submit-row">
            <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Insurance Application"}
            </button>
          </div>
        </main>

        {showSuccess && (
          <div className="success-popup">
            <div className="success-box">
              <h2>Application Submitted Successfully</h2>
              <p>Your Insurance ID:</p>
              <p style={{ fontWeight: 700, color: "#137a38" }}>{createdInsuranceId}</p>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  setCreatedInsuranceId(null);
                }}
              >
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

export default InsurancePage;
