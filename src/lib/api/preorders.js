// lib/api/preorders.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPreorders(queryString = "") {
  const response = await fetch(`${API_BASE}/preorders?${queryString}`, {
    cache: "no-store",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch preorders");
  }
  
  return response.json();
}

export async function getPreorderById(id) {
  const response = await fetch(`${API_BASE}/preorders/${id}`, {
    cache: "no-store",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch preorder");
  }
  
  return response.json();
}