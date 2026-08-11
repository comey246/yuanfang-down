CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

INSERT INTO public."AdminUser" (
  "id",
  "name",
  "email",
  "passwordHash",
  "role",
  "active",
  "createdAt",
  "updatedAt"
)
VALUES (
  'seed-admin',
  '网站管理员',
  'admin@example.com',
  extensions.crypt('local-admin-change-me', extensions.gen_salt('bf', 12)),
  'ADMIN',
  true,
  now(),
  now()
)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO public."ProductCategory" (
  "id",
  "name",
  "slug",
  "sortOrder",
  "createdAt",
  "updatedAt"
)
VALUES
  ('seed-cat-white-goose', '白鹅绒', 'white-goose-down', 0, now(), now()),
  ('seed-cat-grey-goose', '灰鹅绒', 'grey-goose-down', 1, now(), now()),
  ('seed-cat-white-duck', '白鸭绒', 'white-duck-down', 2, now(), now()),
  ('seed-cat-grey-duck', '灰鸭绒', 'grey-duck-down', 3, now(), now()),
  ('seed-cat-feather', '羽毛及其他原料', 'feather-and-other', 4, now(), now()),
  ('seed-cat-custom', '定制规格', 'custom-specification', 5, now(), now())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO public."Product" (
  "id",
  "name",
  "slug",
  "categoryId",
  "species",
  "color",
  "summary",
  "description",
  "qualityNote",
  "customization",
  "sampleAvailable",
  "status",
  "demoNotice",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'seed-product-white-goose',
    '白鹅绒',
    'white-goose-down',
    'seed-cat-white-goose',
    '鹅绒',
    '白色',
    '白鹅绒原料示例条目，可选规格待后台补充。',
    '本条目为网站结构演示数据。所有原料来源、参数、包装、起订量、供货能力与交付周期均须核实后填写。',
    '实际质量参数以双方确认的样品、合同及检测文件为准。',
    true,
    true,
    'DRAFT',
    '示例数据，发布前需替换',
    now(),
    now()
  ),
  (
    'seed-product-grey-goose',
    '灰鹅绒',
    'grey-goose-down',
    'seed-cat-grey-goose',
    '鹅绒',
    '灰色',
    '灰鹅绒原料示例条目，可选规格待后台补充。',
    '本条目为网站结构演示数据。所有原料来源、参数、包装、起订量、供货能力与交付周期均须核实后填写。',
    '实际质量参数以双方确认的样品、合同及检测文件为准。',
    true,
    true,
    'DRAFT',
    '示例数据，发布前需替换',
    now(),
    now()
  ),
  (
    'seed-product-white-duck',
    '白鸭绒',
    'white-duck-down',
    'seed-cat-white-duck',
    '鸭绒',
    '白色',
    '白鸭绒原料示例条目，可选规格待后台补充。',
    '本条目为网站结构演示数据。所有原料来源、参数、包装、起订量、供货能力与交付周期均须核实后填写。',
    '实际质量参数以双方确认的样品、合同及检测文件为准。',
    true,
    true,
    'DRAFT',
    '示例数据，发布前需替换',
    now(),
    now()
  ),
  (
    'seed-product-grey-duck',
    '灰鸭绒',
    'grey-duck-down',
    'seed-cat-grey-duck',
    '鸭绒',
    '灰色',
    '灰鸭绒原料示例条目，可选规格待后台补充。',
    '本条目为网站结构演示数据。所有原料来源、参数、包装、起订量、供货能力与交付周期均须核实后填写。',
    '实际质量参数以双方确认的样品、合同及检测文件为准。',
    true,
    true,
    'DRAFT',
    '示例数据，发布前需替换',
    now(),
    now()
  )
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO public."ArticleCategory" (
  "id",
  "name",
  "slug",
  "createdAt",
  "updatedAt"
)
VALUES (
  'seed-article-category-purchasing',
  '采购指南',
  'purchasing-guide',
  now(),
  now()
)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO public."Article" (
  "id",
  "title",
  "slug",
  "categoryId",
  "excerpt",
  "content",
  "author",
  "status",
  "demoNotice",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'seed-article-indicators',
    '羽绒原料采购需要关注哪些指标',
    'down-purchasing-indicators',
    'seed-article-category-purchasing',
    '演示草稿，内容需经业务与质量负责人核验后方可发布。',
    '本文为内容结构占位，不包含未经核验的检测结论。请在后台完成审核与补充。',
    '待填写',
    'DRAFT',
    '演示草稿，不直接公开发布',
    now(),
    now()
  ),
  (
    'seed-article-goose-vs-duck',
    '鹅绒和鸭绒有什么区别',
    'goose-down-vs-duck-down',
    'seed-article-category-purchasing',
    '演示草稿，内容需经业务与质量负责人核验后方可发布。',
    '本文为内容结构占位，不包含未经核验的检测结论。请在后台完成审核与补充。',
    '待填写',
    'DRAFT',
    '演示草稿，不直接公开发布',
    now(),
    now()
  ),
  (
    'seed-article-fill-power',
    '羽绒蓬松度和绒子含量如何理解',
    'fill-power-and-down-cluster-content',
    'seed-article-category-purchasing',
    '演示草稿，内容需经业务与质量负责人核验后方可发布。',
    '本文为内容结构占位，不包含未经核验的检测结论。请在后台完成审核与补充。',
    '待填写',
    'DRAFT',
    '演示草稿，不直接公开发布',
    now(),
    now()
  )
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO public."MediaAsset" (
  "id",
  "title",
  "type",
  "category",
  "sortOrder",
  "featuredOnHome",
  "published",
  "altText",
  "replaceNotice",
  "createdAt",
  "updatedAt"
)
SELECT
  'seed-media-' || source.sort_order,
  source.category || '素材待补充',
  source.media_type::public."MediaType",
  source.category,
  source.sort_order,
  source.sort_order < 3,
  false,
  source.category || '真实照片待替换',
  '本地占位记录，发布前必须替换为已获授权的工厂真实素材',
  now(),
  now()
FROM (
  VALUES
    (0, '工厂环境', 'VIDEO'),
    (1, '生产设备', 'IMAGE'),
    (2, '原料实拍', 'IMAGE'),
    (3, '清洗过程', 'IMAGE'),
    (4, '分拣过程', 'IMAGE'),
    (5, '检测过程', 'IMAGE'),
    (6, '包装发货', 'IMAGE')
) AS source(sort_order, category, media_type)
WHERE NOT EXISTS (
  SELECT 1
  FROM public."MediaAsset" existing
  WHERE existing."title" = source.category || '素材待补充'
);

INSERT INTO public."SiteSetting" (
  "id",
  "key",
  "value",
  "description",
  "isSensitive",
  "createdAt",
  "updatedAt"
)
VALUES (
  'seed-setting-company-profile',
  'company_profile',
  $profile${
    "companyName": "待填写的羽绒工厂名称",
    "shortName": "待填写",
    "phone": "待填写",
    "mobile": "待填写",
    "wechat": "待填写",
    "email": "待填写",
    "address": "待填写",
    "businessHours": "周一至周六 08:30-18:00",
    "icpNumber": "待备案",
    "policeRecordNumber": "待备案",
    "logoUrl": "",
    "wechatQrUrl": ""
  }$profile$::jsonb,
  '企业资料与联系方式',
  false,
  now(),
  now()
)
ON CONFLICT ("key") DO NOTHING;
