const BASE_URL = "http://localhost:9090/backend/api/auth";

export const loginUser = async (mobile, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ mobile, password })
  });

  return res.json();
};

export const signupUser = async (fullName, mobile, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ fullName, mobile, password })
  });

  return res.json();
};
