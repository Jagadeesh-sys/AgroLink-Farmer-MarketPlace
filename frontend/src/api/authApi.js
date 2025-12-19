const BASE_URL = "/api/auth";

/* =========================
   LOGIN (FINAL FIX)
========================= */
export const loginUser = async (mobile, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include", // ⭐ REQUIRED FOR SESSION
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ mobile, password }),
  });

  const text = await res.text();
  console.log("LOGIN RAW RESPONSE:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || data.status === "error") {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

/* =========================
   SIGNUP (FIXED)
========================= */
export const signupUser = async (fullName, mobile, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ fullName, mobile, password }),
  });

  const data = await res.json();

  if (!res.ok || data.status === "error") {
    throw new Error(data.message || "Signup failed");
  }

  return data;
};

/* =========================
   LOGOUT (OK)
========================= */
export const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
};
