import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "../Css/AdminDashboard.css";

function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    crops: [],
    loans: [],
    insurance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.status === 403) {
          throw new Error("NOT_AUTHORIZED");
        }

        if (!res.ok) {
          throw new Error("SERVER_ERROR");
        }

        const json = await res.json();
        setData({
          users: json.users || [],
          crops: json.crops || [],
          loans: json.loans || [],
          insurance: json.insurance || []
        });
      } catch (err) {
        console.error("Admin dashboard error:", err);

        if (err.message === "NOT_AUTHORIZED") {
          setError("You are not authorized to view this page.");
          setTimeout(() => navigate("/home"), 1500);
        } else {
          setError("Something went wrong. Try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [navigate]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="brand-loader" aria-live="polite" aria-busy="true">
          <div className="brand-circle">
            <div className="loader-ring" />
            <div className="loader-ring ellipse" />
            <img className="loader-logo" src="/Images/logo1.png" alt="AgroLink logo" onError={(e)=>{e.currentTarget.src='/logo512.png';}} />
          </div>
          <div className="loader-text">LOADING...</div>
        </div>
      </>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <>
        <Navbar />
        <div className="admin-loading error">{error}</div>
      </>
    );
  }

  // Helper to format cell values consistently
  const formatCell = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object") return JSON.stringify(val);
    // prettify booleans/numbers
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (!isNaN(val) && val !== "") return String(val);
    return String(val);
  };

  // ===== Formatting + Derived Metrics =====
  const currency = (n) => {
    const num = Number(n || 0);
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const isFarmer = (u) => {
    const role = (u.systemRole || u.role || "").toString().toUpperCase();
    return role.includes("FARMER");
  };

  const isVerified = (u) => {
    const v = (u.verified || u.verifiedStatus || u.isVerified || u.verificationStatus || u.verifiedFlag || "").toString().toUpperCase();
    return v === "YES" || v === "TRUE" || v === "VERIFIED" || v === "1";
  };

  const safeDate = (u) => {
    const d = u.createdAt || u.registrationDate || u.registeredOn || u.created_on || u.regDate || null;
    const dt = d ? new Date(d) : null;
    return dt && !isNaN(dt.getTime()) ? dt : null;
  };

  // Totals
  const totalUsers = data.users.length;
  const totalVerifiedFarmers = data.users.filter((u) => isFarmer(u) && isVerified(u)).length;
  const totalCropPostings = data.crops.length;

  const totalQty = data.crops.reduce((sum, c) => sum + Number(c.quantity || 0), 0);
  const totalValue = data.crops.reduce((sum, c) => sum + Number(c.quantity || 0) * Number(c.price || 0), 0);
  const availableStock = data.crops.reduce((sum, c) => sum + Math.max(Number(c.availableStock ?? (Number(c.quantity || 0) - Number(c.soldQty || 0))), 0), 0);
  const availablePct = totalQty > 0 ? Math.round((availableStock / totalQty) * 100) : 0;

  // Role breakdown
  const farmerCount = data.users.filter(isFarmer).length;
  const adminCount = data.users.filter((u) => (u.systemRole || u.role || "").toString().toUpperCase().includes("ADMIN")).length;
  const farmerPct = totalUsers > 0 ? Math.round((farmerCount / totalUsers) * 100) : 0;
  const adminPct = totalUsers > 0 ? Math.round((adminCount / totalUsers) * 100) : 0;

  // Registration trend (current year)
  const year = new Date().getFullYear();
  const byMonth = new Array(12).fill(0);
  data.users.forEach((u) => {
    const dt = safeDate(u);
    if (dt && dt.getFullYear() === year) {
      byMonth[dt.getMonth()] += 1;
    }
  });

  // Crop inventory aggregation (Top 5 by quantity)
  const cropAggMap = new Map();
  data.crops.forEach((c) => {
    const name = c.cropName || c.name || c.category || "Unknown";
    const qty = Number(c.quantity || 0);
    cropAggMap.set(name, (cropAggMap.get(name) || 0) + qty);
  });
  const cropAgg = Array.from(cropAggMap.entries())
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Loan purpose distribution
  const loanPurposeMap = new Map();
  data.loans.forEach((l) => {
    const purpose = (l.purpose || l.loanPurpose || l.reason || "Other").toString();
    loanPurposeMap.set(purpose, (loanPurposeMap.get(purpose) || 0) + 1);
  });
  const loanPurpose = Array.from(loanPurposeMap.entries()).map(([label, count]) => ({ label, count }));
  const loanTotal = loanPurpose.reduce((s, p) => s + p.count, 0);

  // ===== Lightweight SVG Charts (no external libs) =====
  const SimpleLineChartFromCounts = ({ counts = [], width = 320, height = 140, color = "#34D399" }) => {
    const maxVal = Math.max(1, ...counts);
    const pad = 12;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    const stepX = counts.length > 1 ? innerW / (counts.length - 1) : innerW;
    const scaleY = (v) => innerH - (v / maxVal) * innerH;
    const points = counts.map((v, i) => [pad + i * stepX, pad + scaleY(v)]);
    const path = points
      .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
      .join(" ");
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}> 
        <rect x={0} y={0} width={width} height={height} rx={8} fill="#0b1320" />
        <path d={path} fill="none" stroke={color} strokeWidth={2} />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill={color} />
        ))}
      </svg>
    );
  };

  const BarChart = ({ data = [], width = 320, height = 140, barColor = "#34D399" }) => {
    const values = data.map((d) => Number(d.value || 0));
    const maxVal = Math.max(1, ...values);
    const pad = 12;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    const count = Math.max(data.length, 1);
    const gap = 8;
    const barW = Math.max(8, (innerW - gap * (count - 1)) / count);
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}> 
        <rect x={0} y={0} width={width} height={height} rx={8} fill="#0b1320" />
        {data.map((d, i) => {
          const val = Number(d.value || 0);
          const barH = (val / maxVal) * innerH;
          const x = pad + i * (barW + gap);
          const y = pad + innerH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill={barColor} rx={4} />
              <text x={x + barW / 2} y={height - 4} fill="#9CA3AF" fontSize="10" textAnchor="middle">{String(d.label).slice(0, 6)}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  const DonutChart = ({ segments = [], size = 160, stroke = 22, centerLabel = "" }) => {
    const total = segments.reduce((s, seg) => s + Number(seg.value || 0), 0) || 1;
    const cx = size / 2;
    const cy = size / 2;
    const r = (size - stroke) / 2;
    const C = 2 * Math.PI * r;
    let offset = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}> 
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0b1320" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const ratio = Number(seg.value || 0) / total;
          const dash = ratio * C;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color || "#34D399"}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
        <circle cx={cx} cy={cy} r={r - stroke / 2} fill="#0b1320" />
        <text x={cx} y={cy} fill="#E5E7EB" fontSize="14" textAnchor="middle" dominantBaseline="middle">{centerLabel}</text>
      </svg>
    );
  };

  // Generic table section that renders all keys in the dataset
  const TableSection = ({ title, rows }) => {
    const cols = rows && rows.length ? Object.keys(rows[0]) : [];
    return (
        <section className="admin-section flat" style={{ width: "100%" }}>
        <h2>{title}</h2>
        <div className="admin-table" style={{ width: "100%" }}>
          <table>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows && rows.length ? (
                rows.map((r, i) => (
                  <tr key={i}>
                    {cols.map((col) => (
                      <td key={col}>{formatCell(r[col])}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Math.max(cols.length, 1)} className="empty">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div className="admin-root">
      <Navbar />
      <div className="admin-content-only">
        <main className="admin-content">
          <div className="admin-container" style={{ width: "100%", margin: 0 }}>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Global statistics and management overview</p>

            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="brand-loader" aria-live="polite" aria-busy="true">
                <div className="brand-circle">
                  <div className="loader-ring" />
                  <div className="loader-ring ellipse" />
                  <img className="loader-logo" src="/Images/logo1.png" alt="AgroLink logo" onError={(e)=>{e.currentTarget.src='/logo512.png';}} />
                </div>
                <div className="loader-text">LOADING...</div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Registered Users</div>
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-foot">since entry</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Total Verified Farmers</div>
                    <div className="stat-value">{totalVerifiedFarmers}</div>
                    <div className="stat-foot">since entry</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Total Crop Postings</div>
                    <div className="stat-value">{totalCropPostings}</div>
                    <div className="stat-foot">recent posts</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Available Stock</div>
                    <div className="stat-value">{currency(availableStock)}</div>
                    <div className="stat-foot">units available ({availablePct}% of total)</div>
                  </div>
                </div>

                {/* Charts (SVG-based, no external libs) */}
                <div className="charts-grid">
                  {/* Registration Trend */}
                  <div className="chart-card">
                    <div className="chart-title">User Registration Trend ({year})</div>
                    <SimpleLineChartFromCounts counts={byMonth} />
                  </div>

                  {/* Role Breakdown */}
                  <div className="chart-card">
                    <div className="chart-title">Role Breakdown</div>
                    <DonutChart
                      segments={[
                        { label: "Farmer", value: farmerPct, color: "#34D399" },
                        { label: "Admin", value: adminPct, color: "#60A5FA" },
                        { label: "Other", value: 100 - farmerPct - adminPct, color: "#10B981" },
                      ]}
                      centerLabel={`${farmerPct}% Farmers`}
                    />
                  </div>

                  {/* Crop Inventory Bars */}
                  <div className="chart-card">
                    <div className="chart-title">Crop Inventory & Sales</div>
                    <BarChart data={cropAgg.map((c, i) => ({ label: c.name, value: c.qty }))} />
                  </div>

                  {/* Total Inventory Value */}
                  <div className="chart-card">
                    <div className="chart-title">Total Inventory Value</div>
                    <div className="big-number">${currency(totalValue)}</div>
                  </div>

                  {/* Financial Products (Donut) */}
                  <div className="chart-card">
                    <div className="chart-title">Financial Products</div>
                    <DonutChart
                      segments={loanPurpose.map((p) => ({
                        label: p.label,
                        value: loanTotal ? Math.round((p.count / loanTotal) * 100) : 0,
                        color: "#34D399",
                      }))}
                      centerLabel=""
                    />
                  </div>

                  {/* Loan Purpose */}
                  <div className="chart-card">
                    <div className="chart-title">Distribution by Loan Purpose</div>
                    <BarChart data={loanPurpose.map((p) => ({ label: p.label, value: p.count }))} />
                  </div>
                </div>

                {/* Data Tables */}
                <TableSection title="Users / Farmers Management" rows={data.users} />
                <TableSection title="Crops" rows={data.crops} />
                <TableSection title="Loans" rows={data.loans} />
                <TableSection title="Insurance" rows={data.insurance} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
