import { createClient } from "@/lib/supabase/server";

export async function getUserTags(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase.from("links").select("tags").eq("user_id", user.id);

  if (!data) return [];

  const allTags = data.flatMap((row) => row.tags ?? []);
  return [...new Set(allTags)].sort();
}
