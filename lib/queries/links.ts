import { createClient } from "@/lib/supabase/server";
import { Link, LinkFilter } from "@/types/link";

export async function getLinks(
  filter?: LinkFilter
): Promise<{ data: Link[] | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  let query = supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filter?.searchQuery) {
    query = query.or(
      `title.ilike.%${filter.searchQuery}%,memo.ilike.%${filter.searchQuery}%`
    );
  }

  if (filter?.selectedTags && filter.selectedTags.length > 0) {
    query = query.overlaps("tags", filter.selectedTags);
  }

  if (filter?.readStatus === "read") {
    query = query.eq("is_read", true);
  } else if (filter?.readStatus === "unread") {
    query = query.eq("is_read", false);
  }

  if (filter?.favoriteOnly) {
    query = query.eq("is_favorite", true);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
