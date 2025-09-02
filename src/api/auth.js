// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = "https://dukanse-be-f5w4.onrender.com/api";

// Helper to get token from localStorage
const getToken = () => localStorage.getItem("token");

// Common headers
const getHeaders = (isJson = true) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`, // ✅ include token
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// GET
export const getData = async (endpoint) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return res.json();
};

// POST

export const postData = async (endpoint, data, isFormData = false) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: getHeaders(!isFormData), // false means skip Content-Type
    body: isFormData ? data : JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// PUT
export const putData = async (endpoint, data , isFormData = false) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "PUT",
     headers: getHeaders(!isFormData), // false means skip Content-Type
    body: isFormData ? data : JSON.stringify(data),
  });
  return res.json();
};

// DELETE
export const deleteData = async (endpoint) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
};
