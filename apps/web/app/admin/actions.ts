"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminCookieName = "screenwise_admin_session";

function expectedSessionToken() {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`screenwise-admin:${password}`).digest("hex");
}

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password");
  const expectedToken = expectedSessionToken();

  if (typeof password !== "string" || !expectedToken || password !== process.env.ADMIN_DASHBOARD_PASSWORD) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, expectedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
  redirect("/admin");
}

export async function isAdminAuthenticated() {
  const expectedToken = expectedSessionToken();
  if (!expectedToken) return false;
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value === expectedToken;
}
