import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "lydias_admin_session";

function createToken() {
  const timestamp = Date.now().toString();

  const signature = crypto
    .createHmac("sha256", process.env.ADMIN_SECRET!)
    .update(timestamp)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

function verifyToken(token: string) {
  try {
    const [timestamp, signature] = token.split(".");

    if (!timestamp || !signature) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.ADMIN_SECRET!)
      .update(timestamp)
      .digest("hex");

    if (signature !== expectedSignature) {
      return false;
    }

    const age = Date.now() - Number(timestamp);

    return age < 1000 * 60 * 60 * 24 * 7;
  } catch {
    return false;
  }
}

export function createAdminSession() {
  return createToken();
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return verifyToken(token);
}

export { COOKIE_NAME };