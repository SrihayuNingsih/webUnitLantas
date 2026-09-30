// =====================================================
// MULAI: AUTH SESSION NODE
// =====================================================

import crypto from "crypto";

// =====================================================
// MULAI: KONFIGURASI SESSION
// =====================================================

const AUTH_SECRET = process.env.AUTH_SECRET;

if (!AUTH_SECRET) {
  throw new Error("AUTH_SECRET belum dikonfigurasi di environment variable.");
}

// Session berlaku 8 jam
const SESSION_MAX_AGE = 8 * 60 * 60;

// =====================================================
// SELESAI: KONFIGURASI SESSION
// =====================================================

// =====================================================
// MULAI: BUAT SESSION TOKEN
// =====================================================

export function buatSessionToken(pengguna) {
  const payload = {
    username: pengguna.username,
    level: pengguna.level,
    status: pengguna.status,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );

  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

// =====================================================
// SELESAI: BUAT SESSION TOKEN
// =====================================================

// =====================================================
// MULAI: VERIFIKASI SESSION TOKEN
// =====================================================

export function verifikasiSessionToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const bagian = token.split(".");

  if (bagian.length !== 2) {
    return null;
  }

  const payloadBase64 = bagian[0];
  const signature = bagian[1];

  const signatureSeharusnya = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);

  const signatureSeharusnyaBuffer = Buffer.from(signatureSeharusnya);

  if (signatureBuffer.length !== signatureSeharusnyaBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, signatureSeharusnyaBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8"),
    );

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

// =====================================================
// SELESAI: VERIFIKASI SESSION TOKEN
// =====================================================

// =====================================================
// MULAI: AMBIL SESSION DARI REQUEST
// =====================================================

export function ambilSessionDariRequest(req) {
  const cookieHeader = req.headers?.cookie || "";

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map(function (item) {
    return item.trim();
  });

  const cookieSession = cookies.find(function (item) {
    return item.startsWith("auth_session=");
  });

  if (!cookieSession) {
    return null;
  }

  const token = cookieSession.substring("auth_session=".length);

  return verifikasiSessionToken(token);
}

// =====================================================
// SELESAI: AMBIL SESSION DARI REQUEST
// =====================================================
