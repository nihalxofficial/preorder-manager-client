// lib/actions/preorders.js
"use server";

import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createPreorderAction(formData) {
  try {
    const data = {
      name: formData.get("name"),
      products: parseInt(formData.get("products")) || 1,
      preorderWhen: formData.get("preorderWhen") || "regardless-of-stock",
      startsAt: formData.get("startsAt"),
      endsAt: formData.get("endsAt") || null,
      status: formData.get("status") || "active",
    };

    const response = await fetch(`${API_BASE}/preorders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create preorder");
    }

    const result = await response.json();
    revalidatePath("/preorders");
    return { success: true, data: result };
  } catch (error) {
    console.error("Create preorder error:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePreorderAction(id, formData) {
  try {
    const data = {
      name: formData.get("name"),
      products: parseInt(formData.get("products")) || 1,
      preorderWhen: formData.get("preorderWhen") || "regardless-of-stock",
      startsAt: formData.get("startsAt"),
      endsAt: formData.get("endsAt") || null,
      status: formData.get("status") || "active",
    };

    const response = await fetch(`${API_BASE}/preorders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update preorder");
    }

    const result = await response.json();
    revalidatePath("/preorders");
    revalidatePath(`/preorders/${id}/edit`);
    return { success: true, data: result };
  } catch (error) {
    console.error("Update preorder error:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleStatusAction(id) {
  try {
    const response = await fetch(`${API_BASE}/preorders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to toggle status");
    }

    const result = await response.json();
    revalidatePath("/preorders");
    return { success: true, data: result };
  } catch (error) {
    console.error("Toggle status error:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePreorderAction(id) {
  try {
    const response = await fetch(`${API_BASE}/preorders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete preorder");
    }

    const result = await response.json();
    revalidatePath("/preorders");
    return { success: true, data: result };
  } catch (error) {
    console.error("Delete preorder error:", error);
    return { success: false, error: error.message };
  }
}