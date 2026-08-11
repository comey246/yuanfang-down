import "server-only";
import { getSupabaseAdmin, supabaseStorageConfigured } from "@/lib/supabase";

export async function createInquiryAttachmentUrl(
  storageKey: string,
  localUrl: string | null
) {
  if (localUrl) return localUrl;
  if (!supabaseStorageConfigured()) return null;
  const supabase = getSupabaseAdmin();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET!;
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storageKey, 60);
  if (error) throw error;
  return data.signedUrl;
}
