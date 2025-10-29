const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "default_secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "default_client_id";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "default_client_secret";
const SUPERBASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "default_supabase_url";
const SUPERBASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "default_supabase_key";

export {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  SUPERBASE_URL,
  SUPERBASE_PUBLISHABLE_KEY,
};
