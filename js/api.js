// =====================================================
// MULAI: API GATEWAY
// =====================================================

const API_URL = "/api";

async function apiRequest(action, data = {}) {
  if (!action) {
    throw new Error("Action API belum ditentukan.");
  }

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      action,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`API gagal: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.success === false) {
    throw new Error(result.message || "Backend mengembalikan error.");
  }

  return result;
}

// =====================================================
// SELESAI: API GATEWAY
// =====================================================
