// =====================================================
// MULAI: API GATEWAY
// =====================================================

// Gantilah baris ini:
// const API_URL = "/api";

// Menjadi seperti ini:
const API_URL = "/api/index";

// async function apiRequest(action, data = {}) {
//   if (!action) {
//     throw new Error("Action API belum ditentukan.");
//   }

//   // =====================================================
//   // MULAI: TAMPILKAN LOADING GLOBAL
//   // =====================================================

//   if (
//     typeof LoadingGlobal !== "undefined" &&
//     typeof LoadingGlobal.show === "function"
//   ) {
//     LoadingGlobal.show();
//   }

//   // =====================================================
//   // SELESAI: TAMPILKAN LOADING GLOBAL
//   // =====================================================

//   const response = await fetch(API_URL, {
//     method: "POST",

//     headers: {
//       "Content-Type": "application/json",
//     },

//     body: JSON.stringify({
//       action,
//       ...data,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`API gagal: ${response.status} ${response.statusText}`);
//   }

//   const result = await response.json();

//   if (result.success === false) {
//     throw new Error(result.message || "Backend mengembalikan error.");
//   }

//   // =====================================================
//   // MULAI: SEMBUNYIKAN LOADING GLOBAL
//   // =====================================================

//   if (
//     typeof LoadingGlobal !== "undefined" &&
//     typeof LoadingGlobal.hide === "function"
//   ) {
//     LoadingGlobal.hide();
//   }

//   // =====================================================
//   // SELESAI: SEMBUNYIKAN LOADING GLOBAL
//   // =====================================================

//   return result;
// }

async function apiRequest(action, data = {}) {
  if (!action) {
    throw new Error("Action API belum ditentukan.");
  }

  // =====================================================
  // MULAI: TAMPILKAN LOADING GLOBAL
  // =====================================================

  if (
    typeof LoadingGlobal !== "undefined" &&
    typeof LoadingGlobal.show === "function"
  ) {
    LoadingGlobal.show();
  }

  // =====================================================
  // SELESAI: TAMPILKAN LOADING GLOBAL
  // =====================================================

  try {
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
  } finally {
    // ===================================================
    // MULAI: SEMBUNYIKAN LOADING GLOBAL
    // ===================================================

    if (
      typeof LoadingGlobal !== "undefined" &&
      typeof LoadingGlobal.hide === "function"
    ) {
      LoadingGlobal.hide();
    }

    // ===================================================
    // SELESAI: SEMBUNYIKAN LOADING GLOBAL
    // ===================================================
  }
}

// =====================================================
// SELESAI: API GATEWAY
// =====================================================
