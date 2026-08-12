# 羽绒原料工厂 B2B 官网

面向中国羽绒原料生产工厂的现代化中文 B2B 官网。项目重点是展示可供应原料、工厂与质量资料，通过国内在线客服、电话、企业微信和邮箱与采购方直接沟通，并通过行业内容承接中文搜索流量。它不是零售商城，不包含购物车、在线支付或公开询盘表单。

品牌名、电话、邮箱、旧站 Logo、产品绒子含量区间及历史供应/质量声明已从同一仓库的旧版网站迁入。无法核验的历史数字和声明会在前台明确标记“待企业核验”，具体价格仍为空；其他未确认企业信息使用“待填写”。演示文章为后台草稿，不会直接公开。

## 技术栈

- Next.js App Router、React、TypeScript 严格模式
- Tailwind CSS、Lucide 图标、无障碍基础组件
- Prisma ORM、PostgreSQL 16
- JWT HttpOnly Cookie 后台认证、bcrypt 密码哈希
- Recharts 行情趋势图
- Vitest 单元测试、Playwright 关键流程测试
- Docker Compose 本地数据库、Next standalone 部署镜像
- 可选 Supabase 托管 PostgreSQL，用于内容、设置、管理员及历史业务档案

## 快速启动

要求 Node.js 20.9+（建议 Node.js 22）、npm 与 Docker。

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

打开 `http://localhost:3000`。后台地址为 `http://localhost:3000/admin`。

首次 seed 使用 `.env` 中的 `ADMIN_EMAIL` 与 `ADMIN_INITIAL_PASSWORD`。正式环境务必先把两项替换为真实管理员邮箱和不少于 12 位的独立强密码，同时将 `AUTH_SECRET` 替换为至少 32 字节的随机字符串。

## 常用命令

```bash
npm run dev             # 开发服务器
npm run lint            # ESLint
npm run typecheck       # TypeScript 严格检查
npm test                # Vitest 单元测试
npm run test:e2e        # Playwright 桌面与 390px 移动端流程
npm run build           # 生产构建
npm run start           # 启动生产构建
npm run db:migrate      # 本地创建新迁移
npm run db:deploy       # 生产应用已有迁移
npm run db:seed         # 初始化管理员与演示草稿
npm run db:migrate:legacy-content # 安全合并旧站品牌、联系方式和演示素材
npm run db:studio       # Prisma 数据管理界面
npm run cf:build        # 生成 Cloudflare Workers / OpenNext 构建
npm run cf:preview      # 在本地 workerd 运行时预览
npm run cf:deploy       # 构建并部署到 Cloudflare Workers
```

## 路由

公开站包含首页、产品目录与详情、羽绒行情、工厂实力、生产工艺、质量检测、媒体中心、文章列表与详情、关于、联系与在线客服、隐私政策和使用条款。`/inquiry/success` 仅作为旧链接兼容提示，不代表网站仍可提交表单。

后台包含控制台、产品、行情、文章、媒体、询盘、网站设置和管理员账号。`/admin` 路由由中间件与服务器端账号状态共同保护。

## 后台使用说明

### 产品

在“产品管理”创建或编辑产品。参数留空时前台不会显示，也不会显示为 `0`。自定义参数每行格式为：

```text
参数名称|参数值|单位|参数分组
```

演示产品默认是草稿。确认原料来源、规格、包装、起订量、供货能力、交付周期和质量说明后再改为“发布”。

### 行情

每次保存行情会同时写入历史记录，趋势图读取已发布记录。价格可留空；留空时前台显示“联系询价”。必须填写可说明的真实数据来源，不自动抓取第三方网站。

### 文章

演示文章默认草稿。正文使用空行分段，`## 标题` 和 `### 标题` 会生成对应标题结构。FAQ 每行格式为 `问题|答案`，发布后生成 FAQPage JSON-LD。内容发布前应由业务或质量负责人审核结论、时间和来源。

### 图片与视频

媒体可设置类型、URL、poster、分类、alt、排序、首页展示和公开状态。只上传企业自有或已获授权素材。视频使用 `preload="none"`，不会在首屏自动下载完整文件。生产环境建议使用阿里云 OSS 或中国大陆可稳定访问的 CDN。

### 检测与认证

在“网站设置 → 检测报告与认证资料”维护。企业内部检测、第三方检测与认证证书为三种独立类型。只有勾选“资料已核验”且“前台公开”的资料才会显示。不要把检测报告作为认证，也不要上传未经授权的认证 Logo。

### 询盘

公开询盘表单和 `/api/inquiries` 写入能力已经停用；接口固定返回 HTTP `410 Gone`。新的在线客服会话不写入 Supabase，也不出现在后台询盘列表。

后台“询盘管理”仅作为历史档案兼容功能，支持搜索、状态筛选、批量更新、业务员指派、内部备注、跟进记录和 CSV 导出。停用前形成的客户手机号、附件和跟进信息仅在受保护后台出现。

状态包括：新询盘、已联系、已报价、已寄样、跟进中、已成交、未成交、无效询盘。

### 企业资料与客服

在“网站设置”维护公司名、简称、电话、微信、邮箱、地址、工作时间、统一社会信用代码和备案信息，保存后公共头部与页脚立即读取。国内客服平台支持配置平台名称、官方直聊 URL 和脚本插槽。正式接入前必须完成供应商、隐私政策、数据存储地区、保存期限及脚本安全审查；未接入时统一联系窗口会显示电话、企业微信和邮箱。

删除类操作均要求二次确认并采用软删除/归档；关键后台操作写入 `AuditLog`。

## 旧站内容迁移说明

本工程从仓库根目录的旧版网站迁入了以下可核对内容：

- 品牌名称：`远方羽绒`
- 服务电话 / 手机：`13732583829`
- 业务邮箱：`sales@yuanfangdown.com`
- 旧站羽毛图标与百度站点验证值
- 18 张旧站 PNG 图片，转换为本地 WebP 后存放在 `public/legacy-assets`
- 白鸭绒 `70%-95%`、灰鸭绒 `70%-90%`、白鹅绒 `80%-95%`、灰鹅绒 `80%-95%` 的旧站绒子含量区间
- 旧站展示的年供应量 `3000+ 吨`、合作工厂 `200+ 家`、批次质检 `1000+ 批次`、出口配套地区 `30+ 个`
- “证书齐全”“检测报告，完整追溯”等旧站历史声明

旧站没有提供微信号、微信二维码、企业法定全称、统一社会信用代码或真实工厂地址，因此这些字段没有猜测补齐。旧站图片也没有随仓库提供拍摄来源、授权凭证或原图信息，前台使用时统一显示“旧站演示素材，真实工厂照片待替换”，不得作为真实工厂、设备、实验室或检测现场证据。

上述产品区间、经营数字和质量声明已按用户要求迁移到后台 `legacy_claims` 与产品记录，但旧仓库没有提供台账、合同、认证编号、检测机构或报告文件，因此默认状态为“待企业核验”，不会包装成正式认证。旧站也没有任何具体价格数值，行情中心只迁移四条“联系业务获取”的空价格记录，不伪造数值或趋势。后台可编辑这些字段，并在取得佐证后勾选“企业已核验”。部署新代码后执行以下命令，将内容合并到当前数据库：

```bash
npm run db:migrate:legacy-content
```

执行后会写入一条 `AuditLog`。确认真实资料后，请在后台逐项替换演示图片和仍为“待填写”的字段。

## AI 示意素材

项目现包含 39 张统一风格的 AI 示意图片，覆盖首页 Hero、4 类产品主图与图集、9 个生产流程、6 类质量指标、4 类应用场景、3 张文章封面、SEO 分享图及 3 张视频 poster。每张图片均提供 WebP 与 AVIF：

- 访问路径：`public/generated`
- 集中配置：`src/config/generated-assets.ts`
- 转换脚本：`scripts/process-ai-assets.mjs`
- 重新处理：先安装 ImageMagick，再运行 `AI_SOURCE_DIR=/原始PNG目录 npm run assets:optimize`

前台对这些素材统一显示“AI 概念示意图”或“AI 产品示意图”，不得描述为本工厂实拍、具体设备、真实库存、实际批次、检测结果、认证或客户案例。原始 PNG 保留在本地下载目录，没有加入部署包；上线后仍须逐步用企业自有或获得授权的真实图片替换涉及工厂可信度的页面。

## 联系模式与数据边界

- 公开页面不显示姓名、手机号、微信号、采购备注或附件上传字段。
- 所有“报价、样品、微信、在线咨询”按钮打开统一联系窗口，并携带当前产品提示，但不向服务器提交该提示。
- 在线会话由后台配置的国内客服平台处理；网站不复制会话到 Supabase。
- 电话、企业微信和邮箱由访客主动发起，信息按对应通信渠道的规则处理。
- 历史 `Inquiry`、附件和跟进模型暂时保留，便于企业处理停用前记录；无保留需要时应制定期限后再合规清理。

## SEO 与统计

- 独立 title、description、canonical、Open Graph
- Organization / LocalBusiness、Product、Article、FAQPage、Breadcrumb JSON-LD
- `/sitemap.xml` 与 `/robots.txt`
- 中文语义化标题、参数表、FAQ、更新时间与来源
- 百度统计、百度/360/搜狗验证环境变量占位
- `BAIDU_PUSH_TOKEN` 已预留；接入推送前应增加提交日志、重试和配额控制

统计脚本只有在对应环境变量存在时加载。SEO 关键词不应堆砌，不要生成隐藏文本或黑帽页面。

## 部署

### Supabase

本工程已维护 `supabase/config.toml` 和 `supabase/migrations`。连接独立项目后执行：

```bash
npm run supabase:link
npm run supabase:push
npm run supabase:configure
```

`supabase:configure` 从本机已登录的官方 Supabase CLI 读取项目 URL 与 API Key，并仅写入 Git 忽略的 `.env`，不会在终端打印密钥。先在 `.env` 的 `SUPABASE_DATABASE_PASSWORD` 填写创建项目时保存的密码；命令会进行 URL 编码，生成供应用运行使用的 Transaction Pooler `DATABASE_URL`，以及供 Prisma 迁移使用的 Session Pooler `DIRECT_URL`。Supabase 当前用于 CMS、后台账号、设置和历史档案；公开站不会向其写入访客联系方式或在线客服会话。历史附件 Bucket 保持私有，后台通过短时签名 URL 下载。

### Docker / 自建服务器

1. 准备 PostgreSQL 数据库和对象存储。
2. 设置全部生产环境变量，尤其是 `DATABASE_URL`、`AUTH_SECRET` 和管理员账号。
3. 执行 `npm ci`、`npm run db:deploy`，仅首次执行 `npm run db:seed`。
4. 使用项目 `Dockerfile` 构建并运行 standalone 镜像，反向代理到 3000 端口。
5. 将 `/api/health` 配为健康检查，并在网关限制 `/admin` 与 `/api` 的异常访问。
6. 配置 HTTPS、定期数据库备份、日志留存、告警和历史档案生命周期策略。

```bash
docker build -t down-material-b2b .
docker run --env-file .env -p 3000:3000 down-material-b2b
```

数据库迁移建议作为发布前独立任务执行，不建议由多个应用副本同时运行。

### Cloudflare Workers（OpenNext）

本项目已使用 `@opennextjs/cloudflare` 适配完整 Next.js 动态站点，Worker 名称为 `yf-down-next`。现有 `yf-down` 是 Cloudflare Pages 静态项目，不要继续使用旧的 `npm run build:static` / `static-dist` 设置；发布动态站点应新建 Workers 项目并保留旧 Pages 项目作为回退。

Git 仓库连接参数：

- 仓库：`comey246/yuanfang-down`
- Production branch：`main`
- Root directory：`down-material-b2b`
- Build command：`npm run cf:build`
- Deploy command：`npx wrangler deploy --keep-vars`
- 非生产分支构建：按需开启

先在 Workers 的 **Build variables and secrets** 配置构建期变量，再在 Worker 的 **Settings → Variables and Secrets** 配置运行期变量。`NEXT_PUBLIC_*` 会在构建时内联，因此构建期和运行期都应保持一致。

构建期普通变量：

- `NEXT_PUBLIC_SITE_URL`：正式域名，例如 `https://yf-down.com`
- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目 URL
- `NEXT_PUBLIC_IMAGE_HOSTS`：可选，额外图片 CDN 域名，英文逗号分隔
- 百度统计及百度/360/搜狗验证变量：仅在实际启用时填写

运行期密钥：

- `DATABASE_URL`：Supabase Transaction Pooler 连接串
- `AUTH_SECRET`：至少 32 字节的独立随机字符串
- `SUPABASE_SERVICE_ROLE_KEY`：仅服务器端使用，不得改为普通变量或提交 Git

运行期普通变量：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_IMAGE_HOSTS` 及已启用的统计/验证变量

`SUPABASE_PROJECT_REF`、`SUPABASE_DATABASE_PASSWORD`、`ADMIN_EMAIL` 和 `ADMIN_INITIAL_PASSWORD` 只用于本地配置、迁移或 seed，不需要放入 Worker 运行环境。Cloudflare 构建默认关闭动态图片转换，避免启用 Cloudflare Images 后产生额外费用；页面仍通过 `next/image` 保留尺寸、懒加载和布局稳定性。数据库迁移与首次 seed 仍在可信本地环境或独立发布任务中执行，不在 Worker 启动时执行。

本地 Workers 预览：

```bash
cp .dev.vars.example .dev.vars
npm run cf:preview
```

正式部署后先验证 `/`、`/products`、`/admin/login` 和 `/api/health`，再把 `yf-down.com`、`www.yf-down.com` 从旧 Pages 项目切换到新 Worker。不要在验证前删除旧 Pages 项目。

### Vercel / 其他 Node 平台

构建命令使用 `npm run build`，启动命令使用 `npm run start`。平台需连接可从公网安全访问的 PostgreSQL，并配置持久化对象存储。Next Image 默认允许阿里云 OSS/CDN；其他图片 CDN 通过 `NEXT_PUBLIC_IMAGE_HOSTS` 配置明确域名白名单，多个域名用英文逗号分隔。

## 安全与合规注意

- 公开询盘接口固定返回 `410 Gone`，不会解析或保存请求中的个人资料。
- 后台会话使用签名 JWT、HttpOnly、SameSite Cookie；密码 bcrypt 哈希存储。
- Prisma 参数化查询降低 SQL 注入风险；输出不渲染未过滤 HTML。
- 历史客户资料不进入公开页面、结构化数据或前端静态包。
- 环境密钥不得提交到 Git，生产管理员不得共用账号。
- 正式隐私政策、条款、数据保存期限和跨境处理情况应由企业法务审核。
- 如插入第三方客服或统计脚本，应增加严格 CSP，并审查脚本获取的数据范围。

## 上线前资料清单

以下资料仍是“待填写/待补充”，缺一不可时请保持页面不发布对应内容：

- 企业法定全称、统一社会信用代码、真实介绍（“远方羽绒”目前仅按旧站公开品牌名迁移）
- 微信号、微信二维码、真实工厂地址；并再次确认已迁移电话、邮箱和工作时间
- ICP 备案号、公安备案号、隐私联系人和正式条款日期
- 自有或获授权的工厂航拍、车间、设备、实验室、仓储、发货照片
- 视频文件、poster、拍摄日期、描述和每张图片的 alt 文本
- 各产品真实原料来源、颜色、规格和可供应范围
- 绒子含量、羽绒含量、蓬松度、清洁度、耗氧量、水分率等实测/约定数据
- 包装方式、单包重量、起订量、供货能力、交付周期、适用场景
- 经授权的内部检测文件、第三方报告、真实认证证书与核验信息
- 厂房面积、产能、员工和设备数字（不提供则不显示）
- 行情价格、单位、日期、涨跌与真实来源说明
- 文章作者、审核人、来源、更新时间和经核验内容
- 生产数据库、历史档案保留期限、域名与 HTTPS
- 百度统计、站点验证、Baidu Push、360/搜狗验证配置
- 国内客服平台真实名称、直聊 URL、隐私政策、数据存储地区、保存期限、脚本及其安全和合规审查结果

## 数据模型

Prisma 已包含：`AdminUser`、`SiteSetting`、`ProductCategory`、`Product`、`ProductSpecification`、`MarketQuote`、`MarketQuoteHistory`、`ArticleCategory`、`Article`、`FAQ`、`MediaAsset`、`Certificate`、`Inquiry`、`InquiryAttachment`、`InquiryFollowUp`、`AuditLog`。

初始迁移位于 `prisma/migrations/202608110001_init`，seed 位于 `prisma/seed.ts`。
