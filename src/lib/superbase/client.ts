import { createBrowserClient } from "@supabase/ssr";
import { SUPERBASE_PUBLISHABLE_KEY, SUPERBASE_URL } from "@utils/env";

export function createClient() {
  return createBrowserClient(SUPERBASE_URL!, SUPERBASE_PUBLISHABLE_KEY!);
}
