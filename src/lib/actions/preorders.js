"use server";

import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function createPreorderAction(formData) {
  try {
    const data = {
      name:         formData.get("name"),
      products:     parseInt(formData.get("products")) || 1,
      preorderWhen: formData.get("preorderWhen") || "regardless-of-stock",
      startsAt:     formData.get("startsAt"),
      endsAt:       formData.get("endsAt") || null,
      status:       formData.get("status") || "active",
    };

    const response = await fetch(`${API_BASE}/preorders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to create preorder");

    const result = await response.json();
    revalidatePath("/preorders");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updatePreorderAction(id, formData) {
  try {
    const data = {
      name:         formData.get("name"),
      products:     parseInt(formData.get("products")) || 1,
      preorderWhen: formData.get("preorderWhen") || "regardless-of-stock",
      startsAt:     formData.get("startsAt"),
      endsAt:       formData.get("endsAt") || null,
      status:       formData.get("status") || "active",
    };

    const response = await fetch(`${API_BASE}/preorders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update preorder");

    const result = await response.json();
    revalidatePath("/preorders");
    revalidatePath(`/preorders/${id}/edit`);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function toggleStatusAction(id) {
  try {
    const response = await fetch(`${API_BASE}/preorders/${id}/status`, {
      method: "PATCH",
    });

    if (!response.ok) throw new Error("Failed to toggle status");

    const result = await response.json();
    revalidatePath("/preorders");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deletePreorderAction(id) {
  try {
    const response = await fetch(`${API_BASE}/preorders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete preorder");

    const result = await response.json();
    revalidatePath("/preorders");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}