-- The application uses a server-only Prisma connection as the table owner.
-- Data API roles receive no direct access; this keeps customer inquiries out
-- of anonymous/authenticated browser clients even if Data API is enabled.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'AdminUser',
    'SiteSetting',
    'ProductCategory',
    'Product',
    'ProductSpecification',
    'MarketQuote',
    'MarketQuoteHistory',
    'ArticleCategory',
    'Article',
    'FAQ',
    'MediaAsset',
    'Certificate',
    'Inquiry',
    'InquiryAttachment',
    'InquiryFollowUp',
    'AuditLog'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', table_name);
  END LOOP;
END
$$;

INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'inquiry-attachments',
  'inquiry-attachments',
  false,
  5242880,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
