# 远方羽绒官网部署说明

这是一个纯静态双语网站，文件包括：

- `index.html`
- `styles.css`
- `script.js`
- `assets/` 图片资源

## 本地预览

在网站目录运行：

```bash
python3 -m http.server 4173
```

浏览器打开：

```text
http://localhost:4173
```

## 部署到 Vercel

推荐做法：把 `yuanfang-down-site` 这个文件夹放进一个 GitHub 仓库，并在 Vercel 导入。

1. 注册或登录 Vercel。
2. 新建项目并导入 GitHub 仓库。
3. 如果仓库根目录就是这些网站文件，Root Directory 保持默认。
4. 如果网站仍在 `outputs/yuanfang-down-site` 子目录，Root Directory 选择这个子目录。
5. Framework Preset 选择 `Other`。
6. Build Command 留空。
7. Output Directory 填 `.`。
8. 部署完成后，在 Domains 里绑定你的域名。

## 部署到 Netlify

1. 登录 Netlify。
2. 选择 Add new site。
3. 最简单方式：直接拖拽整个 `yuanfang-down-site` 文件夹部署。
4. 如果使用 Git 部署，并且仓库根目录就是这些网站文件，Build command 留空，Publish directory 填 `.`。
5. 如果网站在子目录，Publish directory 填 `outputs/yuanfang-down-site`。
6. 在 Domain management 里绑定域名。

## 部署到 GitHub Pages

GitHub Pages 更适合把网站文件放在仓库根目录或 `/docs` 目录：

1. 新建 GitHub 仓库。
2. 把 `yuanfang-down-site` 里的文件复制到仓库根目录，确保 `index.html` 在根目录。
3. 推送到 GitHub。
4. 进入仓库 Settings → Pages。
5. Source 选择 Deploy from a branch。
6. Branch 选择 `main`，Folder 选择 `/root`。
7. 保存后等待 GitHub Pages 生成网址。

## 部署到普通服务器

1. 把整个 `yuanfang-down-site` 文件夹里的内容上传到服务器网站根目录。
2. 确保 `index.html` 在网站根目录。
3. Nginx 或 Apache 只需要按普通静态网站配置即可。

## 上线前建议替换

- `index.html` 里的电话：`13732583829`
- `index.html` 和 `script.js` 里的邮箱：`sales@yuanfangdown.com`
- 公司真实地址、认证信息、年供应量、合作工厂数量
- 如果需要真实表单收集客户线索，建议接入 Netlify Forms、Formspree 或自己的后端接口。

## 官方参考

- Vercel 项目配置：https://vercel.com/docs/project-configuration/vercel-json
- Netlify Drop：https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/
- GitHub Pages 发布源：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
