const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "default_secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "default_client_id";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "default_client_secret";

export { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET };
